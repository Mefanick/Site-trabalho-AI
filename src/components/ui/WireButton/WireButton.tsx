import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import styles from './WireButton.module.css';

export interface WireButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  width?: string | number;
  size?: 'sm' | 'md' | 'lg';
}

export function WireButton({
  children,
  onClick,
  disabled,
  width,
  size = 'md',
  className,
  type = 'button',
  ...rest
}: WireButtonProps) {
  const style: CSSProperties | undefined = width
    ? { width: typeof width === 'number' ? `${width}px` : width }
    : undefined;

  const classes = [styles.button, styles[size], className].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      style={style}
      {...rest}
    >
      {children}
    </button>
  );
}
