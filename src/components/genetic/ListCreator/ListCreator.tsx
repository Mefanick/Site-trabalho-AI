import type { GeneticRow } from '../../../types/genetic';
import { WireButton } from '../../ui/WireButton/WireButton';
import { GeneticTable } from '../GeneticTable/GeneticTable';
import { NumberStrip } from '../NumberStrip/NumberStrip';
import styles from './ListCreator.module.css';

export interface ListCreatorProps {
  draftSelection: number[];
  onDraftChange: (n: number[]) => void;
  draftRow: GeneticRow;
  insufficient: boolean;
  onEnviar: () => void;
  onGerarAleatorio: () => void;
  onProximoPasso: () => void;
  onExecutar: () => void;
  algoRunning: boolean;
}

export function ListCreator({
  draftSelection,
  onDraftChange,
  draftRow,
  insufficient,
  onEnviar,
  onGerarAleatorio,
  onProximoPasso,
  onExecutar,
  algoRunning,
}: ListCreatorProps) {
  return (
    <section className={styles.section}>
      <div className={styles.titleRow}>
        <h3 className={styles.title}>criador de listas</h3>
        {insufficient && (
          <span className={styles.warning} role="status">
            Números Insuficientes
          </span>
        )}
      </div>
      <NumberStrip
        selected={draftSelection}
        onChange={onDraftChange}
        maxSelection={10}
        cellSize="sm"
      />
      <GeneticTable rows={[draftRow]} variant="draft" />
      <div className={styles.btnRow}>
        <WireButton className={styles.fullBtn} size="sm" onClick={onEnviar} disabled={draftSelection.length !== 10}>
          enviar
        </WireButton>
        <WireButton className={styles.fullBtn} size="sm" onClick={onGerarAleatorio}>
          Gerar Aleatóriamente
        </WireButton>
      </div>
      <div className={styles.btnRow}>
        <WireButton className={styles.fullBtn} size="sm" onClick={onProximoPasso} disabled={algoRunning}>
          Próximo passo
        </WireButton>
        <WireButton className={styles.fullBtn} size="sm" onClick={onExecutar} disabled={algoRunning}>
          Executar até solução
        </WireButton>
      </div>
    </section>
  );
}
