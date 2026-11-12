import { Home, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef } from "react";

/** Accessible dialog: centered panel on desktop, bottom sheet on phones. */
export function Sheet({
  open,
  onClose,
  label,
  children,
  scrollKey,
  wide = false,
  modal = true,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  scrollKey?: string | number;
  wide?: boolean;
  modal?: boolean;
  className?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!open || !content.current) return;
    const element = content.current;
    element.scrollTop = 0;
    const frame = requestAnimationFrame(() => {
      if (content.current === element) element.scrollTop = 0;
    });
    return () => cancelAnimationFrame(frame);
  }, [open, label, scrollKey]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (modal && e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    if (modal) document.documentElement.classList.add("is-locked");
    requestAnimationFrame(() => panel.current?.focus({ preventScroll: true }));
    return () => {
      document.removeEventListener("keydown", onKey);
      if (modal) document.documentElement.classList.remove("is-locked");
      prev?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, modal]);
  if (!open) return null;
  return (
    <div className="sheet-root" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={panel} className={`sheet ${wide ? "sheet-wide" : ""} ${className}`} role="dialog" aria-modal={modal || undefined} aria-label={label} tabIndex={-1}>
        <SheetToolbar className="sheet-toolbar-mobile" onClose={onClose} />
        <SheetToolbar className="sheet-toolbar-desktop" onClose={onClose} />
        <div ref={content} className="sheet-content">
          {children}
        </div>
      </div>
    </div>
  );
}

function SheetToolbar({ className, onClose }: { className: string; onClose: () => void }) {
  return (
    <div className={`sheet-toolbar ${className}`}>
      <a className="icon-btn sheet-home" href="#/" aria-label="返回首页" title="返回首页">
        <Home size={19} />
        <span>首页</span>
      </a>
      <span className="sheet-grip" aria-hidden="true" />
      <button className="icon-btn sheet-close" onClick={onClose} aria-label="关闭" title="关闭">
        <X size={20} />
      </button>
    </div>
  );
}
