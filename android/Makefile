PROJECT_DIR := $(shell pwd)
.DEFAULT_GOAL := debug

KEYSTORE := $(HOME)/keys/word-atlas-release.keystore
SIGNING_PROPERTIES := app/keystore.properties

.PHONY: sync debug release test

sync:
	@echo "1) npm build and syncing android ..."
	@cd .. && npm run build && npx cap sync android

debug: sync
	@echo "2) making debug apk ..."
	@cd $(PROJECT_DIR); ./gradlew :app:assembleDebug

test: debug
	@echo "3) making testing for debug apk ..."
	@cd $(PROJECT_DIR)
	@test -f "$(KEYSTORE)" || { printf 'Keystore not found: %s\n' "$(KEYSTORE)"; exit 1; }
	@test -f "$(SIGNING_PROPERTIES)" || { printf 'Create %s from keystore.properties.example and fill in the signing values.\n' "$(SIGNING_PROPERTIES)"; exit 1; }
	@awk -F= '/^(storePassword|keyAlias|keyPassword)=/ && $$2 != "" { found[$$1]=1 } END { exit !(found["storePassword"] && found["keyAlias"] && found["keyPassword"]) }' "$(SIGNING_PROPERTIES)" || { printf 'Set storePassword, keyAlias, and keyPassword in %s.\n' "$(SIGNING_PROPERTIES)"; exit 1; }

release: test
	@echo "4) making release apk ..."
	@./gradlew :app:assembleRelease