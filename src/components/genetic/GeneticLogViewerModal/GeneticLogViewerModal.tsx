import { useEffect, useState } from 'react';
import type { LogGenerationEntry } from '../../../types/genetic';
import { WireButton } from '../../ui/WireButton/WireButton';
import { Modal } from '../../ui/Modal/Modal';
import styles from './GeneticLogViewerModal.module.css';

export interface GeneticLogViewerModalProps {
  open: boolean;
  onClose: () => void;
  entries: LogGenerationEntry[];
  initialIndex?: number;
}

export function GeneticLogViewerModal({
  open,
  onClose,
  entries,
  initialIndex,
}: GeneticLogViewerModalProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (open) {
      const start =
        initialIndex ?? (entries.length > 0 ? entries.length - 1 : 0);
      setIndex(Math.max(0, Math.min(start, entries.length - 1)));
    }
  }, [open, initialIndex, entries.length]);

  const entry = entries[index];

  return (
    <Modal open={open} onClose={onClose} title="LOG completo — Algoritmo Genético">
      {entries.length === 0 ? (
        <p className={styles.empty}>Sem entradas no log.</p>
      ) : (
        <>
          <div className={styles.meta}>
            Geração {entry.generation} · melhor apt {entry.melhorApt} · {entry.melhorLista}
          </div>
          <pre className={styles.log}>{entry.logCompleto}</pre>
          <div className={styles.nav}>
            <WireButton
              size="sm"
              disabled={index <= 0}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
            >
              Anterior
            </WireButton>
            <span className={styles.counter}>
              {index + 1} / {entries.length}
            </span>
            <WireButton
              size="sm"
              disabled={index >= entries.length - 1}
              onClick={() => setIndex((i) => Math.min(entries.length - 1, i + 1))}
            >
              Próximo
            </WireButton>
          </div>
        </>
      )}
    </Modal>
  );
}
