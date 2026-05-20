import type { CSSProperties, ReactNode } from 'react';
import styles from './WireframeBox.module.css';

export interface WireframeBoxProps {
  children: ReactNode;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function WireframeBox({ children, className, width, height }: WireframeBoxProps) {
  const style: CSSProperties = {};
  if (width != null) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height != null) style.height = typeof height === 'number' ? `${height}px` : height;

  const classes = [styles.box, className].filter(Boolean).join(' ');

  return (
    <div className={classes} style={Object.keys(style).length ? style : undefined}>
      {children}
    </div>
  );
}
