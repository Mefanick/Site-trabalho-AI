import type { GeneticSpeed } from '../../../types/genetic';
import { WireButton } from '../../ui/WireButton/WireButton';
import { GeneticLogPanel } from '../GeneticLogPanel/GeneticLogPanel';
import { SpeedSelector } from '../SpeedSelector/SpeedSelector';
import styles from './GeneticAlgoPanel.module.css';

export interface GeneticAlgoPanelProps {
  speed: GeneticSpeed;
  onSpeedChange: (s: GeneticSpeed) => void;
  logStatus: string;
  logResumo: string;
  onExpandLog: () => void;
  onClear: () => void;
  onReset: () => void;
  algoRunning: boolean;
}

export function GeneticAlgoPanel({
  speed,
  onSpeedChange,
  logStatus,
  logResumo,
  onExpandLog,
  onClear,
  onReset,
}: GeneticAlgoPanelProps) {
  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <span className={styles.title}>algorítimo</span>
        <span className={styles.speedLabel}>velocidade</span>
        <SpeedSelector value={speed} onChange={onSpeedChange} />
        <WireButton size="sm" onClick={onReset}>
          Resetar AG
        </WireButton>
        <WireButton size="sm" onClick={onClear}>
          Limpar log e lista
        </WireButton>
      </header>
      <GeneticLogPanel status={logStatus} resumo={logResumo} onExpand={onExpandLog} />
    </section>
  );
}
