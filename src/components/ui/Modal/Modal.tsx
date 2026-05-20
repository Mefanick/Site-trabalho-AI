import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { WireButton } from '../WireButton/WireButton';
import styles from './Modal.module.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  overlay?: boolean;
}

export function Modal({ open, onClose, title, children, overlay = true }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={overlay ? styles.overlay : styles.overlayClear}
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
      >
        <div className={styles.panelHeader}>
          {title != null && (
            <h2 id="modal-title" className={styles.panelTitle}>
              {title}
            </h2>
          )}
          <WireButton size="sm" onClick={onClose}>
            fechar
          </WireButton>
        </div>
        <div className={styles.panelBody}>{children}</div>
      </div>
    </div>
  );
}
