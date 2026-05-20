import type { GeneticSpeed } from '../../../types/genetic';
import { WireButton } from '../../ui/WireButton/WireButton';
import styles from './SpeedSelector.module.css';

const SPEEDS: { id: GeneticSpeed; label: string }[] = [
  { id: 'lento', label: 'Lento' },
  { id: 'normal', label: 'Normal' },
  { id: 'rapido', label: 'Rápido' },
  { id: 'turbo', label: 'Turbo' },
];

export interface SpeedSelectorProps {
  value: GeneticSpeed;
  onChange: (speed: GeneticSpeed) => void;
}

export function SpeedSelector({ value, onChange }: SpeedSelectorProps) {
  return (
    <div className={styles.row} role="group" aria-label="Velocidade do algoritmo">
      {SPEEDS.map((s) => (
        <WireButton
          key={s.id}
          size="sm"
          disabled={value === s.id}
          className={value === s.id ? styles.active : undefined}
          onClick={() => onChange(s.id)}
        >
          {s.label}
        </WireButton>
      ))}
    </div>
  );
}
