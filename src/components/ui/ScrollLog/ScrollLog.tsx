import type { ReactNode } from 'react';
import styles from './ScrollLog.module.css';

export interface ScrollLogProps {
  title: string;
  status?: string;
  children: ReactNode;
  className?: string;
}

export function ScrollLog({ title, status, children, className }: ScrollLogProps) {
  const wrapperClass = [styles.wrapper, className].filter(Boolean).join(' ');
  return (
    <section className={wrapperClass}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {status != null && <span className={styles.status}>{status}</span>}
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
