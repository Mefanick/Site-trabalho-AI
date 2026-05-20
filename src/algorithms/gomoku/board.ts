// Portado de: algorithms/gomoku/minimax.py (movimentos, vitória, apply/undo)

import {
  BOARD_SIZE,
  CENTER_COL,
  CENTER_ROW,
  EMPTY,
  MAX_PLAYER,
  MIN_PLAYER,
  NEIGHBOR_RADIUS,
  WIN_LENGTH,
  type Board,
  type Coord,
} from './constants';

export function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

export function getLegalMoves(board: Board): Coord[] {
  const stones: Coord[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] !== EMPTY) stones.push([row, col]);
    }
  }

  if (stones.length === 0) return [[CENTER_ROW, CENTER_COL]];

  const legal = new Set<string>();
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] !== EMPTY) continue;
      for (const [sr, sc] of stones) {
        if (Math.max(Math.abs(row - sr), Math.abs(col - sc)) <= NEIGHBOR_RADIUS) {
          legal.add(`${row},${col}`);
          break;
        }
      }
    }
  }
  return [...legal].map((k) => {
    const [r, c] = k.split(',').map(Number);
    return [r, c] as Coord;
  });
}

export function applyMove(board: Board, row: number, col: number, player: number): boolean {
  if (!inBounds(row, col) || board[row][col] !== EMPTY) return false;
  board[row][col] = player;
  return true;
}

export function undoMove(board: Board, row: number, col: number): void {
  board[row][col] = EMPTY;
}

function countLine(
  board: Board,
  row: number,
  col: number,
  dr: number,
  dc: number,
  player: number,
): number {
  let total = 0;
  let r = row;
  let c = col;
  while (inBounds(r, c) && board[r][c] === player) {
    total += 1;
    r += dr;
    c += dc;
  }
  r = row - dr;
  c = col - dc;
  while (inBounds(r, c) && board[r][c] === player) {
    total += 1;
    r -= dr;
    c -= dc;
  }
  return total;
}

export function checkWinnerAt(board: Board, row: number, col: number): number | null {
  const player = board[row][col];
  if (player === EMPTY) return null;
  const dirs: [number, number][] = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];
  for (const [dr, dc] of dirs) {
    if (countLine(board, row, col, dr, dc, player) >= WIN_LENGTH) return player;
  }
  return null;
}

export function checkWinner(board: Board): number | null {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] !== EMPTY) {
        const won = checkWinnerAt(board, row, col);
        if (won !== null) return won;
      }
    }
  }
  return null;
}

export function isBoardFull(board: Board): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === EMPTY) return false;
    }
  }
  return true;
}

export function randomLegalMove(board: Board): Coord {
  const moves = getLegalMoves(board);
  if (moves.length > 0) {
    return moves[Math.floor(Math.random() * moves.length)];
  }
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === EMPTY) return [r, c];
    }
  }
  return [CENTER_ROW, CENTER_COL];
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export { MAX_PLAYER, MIN_PLAYER, EMPTY };
