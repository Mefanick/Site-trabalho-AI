// Portado de: game/gomoku.py

import { checkWinner, isBoardFull } from '../algorithms/gomoku/board';
import {
  BOARD_SIZE,
  EMPTY,
  MAX_PLAYER,
  MIN_PLAYER,
  type Board,
} from '../algorithms/gomoku/constants';
import type { CellSymbol } from '../types/gomoku';

export const AI = MAX_PLAYER;
export const HUMAN = MIN_PLAYER;

const DISPLAY: Record<number, CellSymbol> = {
  [EMPTY]: '',
  [HUMAN]: 'X',
  [AI]: 'O',
};

export class GomokuState {
  board: Board;
  winner: number | null;
  isDraw: boolean;

  constructor() {
    this.board = [];
    this.winner = null;
    this.isDraw = false;
    this.reset();
  }

  reset(): void {
    this.board = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => EMPTY),
    );
    this.winner = null;
    this.isDraw = false;
  }

  copyBoard(): Board {
    return this.board.map((row) => [...row]);
  }

  inBounds(row: number, col: number): boolean {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  }

  isEmpty(row: number, col: number): boolean {
    return this.board[row][col] === EMPTY;
  }

  isGameOver(): boolean {
    return this.winner !== null || this.isDraw;
  }

  makeMove(row: number, col: number, player: number): boolean {
    if (this.isGameOver() || !this.isEmpty(row, col)) return false;
    this.board[row][col] = player;
    this.updateStatus();
    return true;
  }

  private updateStatus(): void {
    this.winner = checkWinner(this.board);
    if (this.winner === null && isBoardFull(this.board)) {
      this.isDraw = true;
    }
  }

  displayBoard(): CellSymbol[][] {
    return this.board.map((row) =>
      row.map((cell) => DISPLAY[cell] ?? ''),
    );
  }
}

export function cellSymbolToPlayer(symbol: CellSymbol): number | null {
  if (symbol === 'X') return HUMAN;
  if (symbol === 'O') return AI;
  return null;
}

export function boardToInternal(display: CellSymbol[][]): Board {
  return display.map((row) =>
    row.map((cell) => {
      if (cell === 'X') return MIN_PLAYER;
      if (cell === 'O') return MAX_PLAYER;
      return EMPTY;
    }),
  );
}
