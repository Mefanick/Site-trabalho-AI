import { WireButton } from '../../ui/WireButton/WireButton';
import styles from './GeneticLogPanel.module.css';

export interface GeneticLogPanelProps {
  status: string;
  resumo: string;
  onExpand: () => void;
}

export function GeneticLogPanel({ status, resumo, onExpand }: GeneticLogPanelProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.logHeader}>
        <span className={styles.logTitle}>LOG · Algoritmo Genetico</span>
        <span className={styles.status}>{status}</span>
        <WireButton size="sm" className={styles.expand} onClick={onExpand}>
          expandir
        </WireButton>
      </div>
      <div className={styles.logBody}>
        <pre>{resumo}</pre>
      </div>
    </div>
  );
}
