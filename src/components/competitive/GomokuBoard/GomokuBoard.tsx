import type { BoardCoord, CellSymbol } from '../../../types/gomoku';
import styles from './GomokuBoard.module.css';

export interface GomokuBoardProps {
  board: CellSymbol[][];
  onCellClick: (row: number, col: number) => void;
  inputEnabled: boolean;
  lastAiCell?: BoardCoord;
  gameOver?: boolean;
}

export function GomokuBoard({
  board,
  onCellClick,
  inputEnabled,
  lastAiCell,
  gameOver,
}: GomokuBoardProps) {
  return (
    <div className={styles.outer} aria-label="Tabuleiro Gomoku 10 por 10">
      <div className={styles.grid}>
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isLastAi =
              lastAiCell?.row === r && lastAiCell?.col === c;
            const empty = cell === '';
            const canPlay = inputEnabled && empty && !gameOver;
            const classes = [
              styles.cell,
              empty && canPlay ? styles.hoverable : '',
              isLastAi ? styles.lastAi : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                className={classes}
                disabled={!canPlay}
                onClick={() => onCellClick(r, c)}
                aria-label={`Célula ${r + 1}, ${c + 1}${cell ? `, ${cell}` : ''}`}
              >
                {cell}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
