.DEFAULT_GOAL := apk

KEYSTORE := $(HOME)/keys/word-atlas-release.keystore
SIGNING_PROPERTIES := app/keystore.properties

.PHONY: apk
apk:
	@test -f "$(KEYSTORE)" || { printf 'Keystore not found: %s\n' "$(KEYSTORE)"; exit 1; }
	@test -f "$(SIGNING_PROPERTIES)" || { printf 'Create %s from keystore.properties.example and fill in the signing values.\n' "$(SIGNING_PROPERTIES)"; exit 1; }
	@awk -F= '/^(storePassword|keyAlias|keyPassword)=/ && $$2 != "" { found[$$1]=1 } END { exit !(found["storePassword"] && found["keyAlias"] && found["keyPassword"]) }' "$(SIGNING_PROPERTIES)" || { printf 'Set storePassword, keyAlias, and keyPassword in %s.\n' "$(SIGNING_PROPERTIES)"; exit 1; }
	@./gradlew :app:assembleRelease