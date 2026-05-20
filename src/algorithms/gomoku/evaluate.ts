// Portado de: algorithms/gomoku/minimax.py (avaliação heurística)

import {
  BOARD_SIZE,
  CENTER_COL,
  CENTER_ROW,
  MAX_PLAYER,
  MIN_PLAYER,
  SCORE_CENTER_BONUS,
  SCORE_CLOSED_FOUR,
  SCORE_FIVE,
  SCORE_OPEN_FOUR,
  SCORE_OPEN_THREE,
  SCORE_OPEN_TWO,
  type Board,
} from './constants';

const PATTERNS_MAX: [string, number][] = [
  ['11111', SCORE_FIVE],
  ['.1111.', SCORE_OPEN_FOUR],
  ['1111.', SCORE_CLOSED_FOUR],
  ['.1111', SCORE_CLOSED_FOUR],
  ['.111.', SCORE_OPEN_THREE],
  ['.11.', SCORE_OPEN_TWO],
];

const PATTERNS_MIN: [string, number][] = [
  ['22222', SCORE_FIVE],
  ['.2222.', SCORE_OPEN_FOUR],
  ['2222.', SCORE_CLOSED_FOUR],
  ['.2222', SCORE_CLOSED_FOUR],
  ['.222.', SCORE_OPEN_THREE],
  ['.22.', SCORE_OPEN_TWO],
];

function cellToChar(value: number): string {
  if (value === MAX_PLAYER) return '1';
  if (value === MIN_PLAYER) return '2';
  return '.';
}

function scoreString(line: string): number {
  let score = 0;
  for (const [pattern, weight] of PATTERNS_MAX) {
    const count = line.split(pattern).length - 1;
    score += count * weight;
  }
  for (const [pattern, weight] of PATTERNS_MIN) {
    const count = line.split(pattern).length - 1;
    score -= count * weight;
  }
  return score;
}

function* iterLines(board: Board): Generator<string> {
  for (let row = 0; row < BOARD_SIZE; row++) {
    yield Array.from({ length: BOARD_SIZE }, (_, col) => cellToChar(board[row][col])).join('');
  }
  for (let col = 0; col < BOARD_SIZE; col++) {
    yield Array.from({ length: BOARD_SIZE }, (_, row) => cellToChar(board[row][col])).join('');
  }
  for (let k = -BOARD_SIZE + 1; k < BOARD_SIZE; k++) {
    const chars: string[] = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      const col = row + k;
      if (col >= 0 && col < BOARD_SIZE) chars.push(cellToChar(board[row][col]));
    }
    if (chars.length >= 5) yield chars.join('');
  }
  for (let k = 0; k < 2 * BOARD_SIZE - 1; k++) {
    const chars: string[] = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      const col = k - row;
      if (col >= 0 && col < BOARD_SIZE) chars.push(cellToChar(board[row][col]));
    }
    if (chars.length >= 5) yield chars.join('');
  }
}

export function evaluateBoard(board: Board): number {
  let total = 0;
  for (const line of iterLines(board)) {
    total += scoreString(line);
  }
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const dist = Math.max(Math.abs(row - CENTER_ROW), Math.abs(col - CENTER_COL));
      if (dist <= 2) {
        if (board[row][col] === MAX_PLAYER) total += SCORE_CENTER_BONUS;
        else if (board[row][col] === MIN_PLAYER) total -= SCORE_CENTER_BONUS;
      }
    }
  }
  return total;
}
