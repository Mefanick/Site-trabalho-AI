import { ScrollLog } from '../../ui/ScrollLog/ScrollLog';
import styles from './SearchLogPanel.module.css';

export interface SearchLogPanelProps {
  status: string;
  logText: string;
}

export function SearchLogPanel({ status, logText }: SearchLogPanelProps) {
  return (
    <div className={styles.panel}>
      <ScrollLog title="LOG · Minimax alfa-beta" status={status} className={styles.log}>
        <pre>{logText || 'aguardando jogadas…'}</pre>
      </ScrollLog>
    </div>
  );
}
