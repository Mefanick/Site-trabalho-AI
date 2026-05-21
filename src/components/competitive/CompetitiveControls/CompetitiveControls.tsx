import { WireButton } from '../../ui/WireButton/WireButton';
import styles from './CompetitiveControls.module.css';

export interface CompetitiveControlsProps {
  onSimulateAiVsAi: () => void;
  onReset: () => void;
}

export function CompetitiveControls({ onSimulateAiVsAi, onReset }: CompetitiveControlsProps) {
  return (
    <div className={styles.row}>
      <WireButton className={styles.btn} onClick={onSimulateAiVsAi}>
        Simular IA contra IA
      </WireButton>
      <WireButton className={styles.btn} onClick={onReset}>
        Resetar jogo
      </WireButton>
    </div>
  );
}
