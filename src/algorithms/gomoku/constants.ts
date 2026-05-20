// Portado de: algorithms/gomoku/minimax.py

export const BOARD_SIZE = 10;
export const EMPTY = 0;
export const MAX_PLAYER = 1;
export const MIN_PLAYER = -1;
export const WIN_LENGTH = 5;
export const NEIGHBOR_RADIUS = 2;
export const CENTER_ROW = Math.floor(BOARD_SIZE / 2);
export const CENTER_COL = Math.floor(BOARD_SIZE / 2);
export const DEFAULT_DEPTH = 3;
export const DEPTH_LEGAL_SOFT = 18;
export const DEPTH_LEGAL_HARD = 28;

export const SCORE_FIVE = 1_000_000;
export const SCORE_OPEN_FOUR = 50_000;
export const SCORE_CLOSED_FOUR = 5_000;
export const SCORE_OPEN_THREE = 3_000;
export const SCORE_CLOSED_THREE = 500;
export const SCORE_OPEN_TWO = 200;
export const SCORE_CENTER_BONUS = 8;

export type Coord = [number, number];
export type Board = number[][];
