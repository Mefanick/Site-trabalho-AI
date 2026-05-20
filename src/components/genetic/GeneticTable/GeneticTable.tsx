import type { GeneticRow } from '../../../types/genetic';
import styles from './GeneticTable.module.css';

export interface GeneticTableProps {
  rows: GeneticRow[];
  variant: 'main' | 'best' | 'draft';
}

export function GeneticTable({ rows, variant }: GeneticTableProps) {
  const wrapperClass =
    variant === 'main'
      ? styles.mainWrap
      : variant === 'best'
        ? styles.bestWrap
        : styles.draftWrap;

  const showEmptyBody = variant === 'main' && rows.length === 0;

  return (
    <div className={wrapperClass}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Grupo</th>
            <th>Indivíduo</th>
            <th>Lista de números (ordem crescente)</th>
            <th>Aptidão</th>
          </tr>
        </thead>
        <tbody>
          {showEmptyBody ? (
            <tr className={styles.empty}>
              <td colSpan={4} aria-hidden="true" />
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={`${row.grupo}-${row.individuo}-${i}`}>
                <td>{row.grupo}</td>
                <td>{row.individuo}</td>
                <td>{row.lista}</td>
                <td>{row.aptidao}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
