import { WireButton } from '../../ui/WireButton/WireButton';
import styles from './CompetitiveControls.module.css';

export interface CompetitiveControlsProps {
  onSimulateAiVsAi: () => void;
  onSimulateSmartVsNormal: () => void;
  onReset: () => void;
}

export function CompetitiveControls({
  onSimulateAiVsAi,
  onSimulateSmartVsNormal,
  onReset,
}: CompetitiveControlsProps) {
  return (
    <div className={styles.row}>
      <WireButton className={styles.btn} onClick={onSimulateAiVsAi}>
        Simular IA contra IA
      </WireButton>
      <WireButton className={styles.btn} onClick={onSimulateSmartVsNormal}>
        Simular IA inteligente contra IA normal
      </WireButton>
      <WireButton className={styles.btn} onClick={onReset}>
        Resetar jogo
      </WireButton>
    </div>
  );
}
