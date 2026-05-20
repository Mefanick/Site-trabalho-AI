import styles from './NumberStrip.module.css';

export interface NumberStripProps {
  selected: number[];
  onChange: (numbers: number[]) => void;
  maxSelection?: number;
  cellSize?: 'md' | 'sm';
}

const NUMBERS = Array.from({ length: 20 }, (_, i) => i + 1);

export function NumberStrip({
  selected,
  onChange,
  maxSelection = 10,
  cellSize = 'md',
}: NumberStripProps) {
  const toggle = (n: number) => {
    const has = selected.includes(n);
    if (has) {
      onChange(selected.filter((x) => x !== n).sort((a, b) => a - b));
      return;
    }
    if (selected.length >= maxSelection) return;
    onChange([...selected, n].sort((a, b) => a - b));
  };

  return (
    <div className={`${styles.strip} ${styles[cellSize]}`} role="group" aria-label="Seleção de números 1 a 20">
      {NUMBERS.map((n) => {
        const isSelected = selected.includes(n);
        return (
          <button
            key={n}
            type="button"
            className={`${styles.cell} ${isSelected ? styles.selected : ''}`}
            onClick={() => toggle(n)}
            aria-pressed={isSelected}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
