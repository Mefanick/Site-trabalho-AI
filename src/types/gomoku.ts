export type CellSymbol = '' | 'X' | 'O';

export type LogTurnEntry = {
  turn: number;
  resumo: string;
  elapsedMs?: number;
};

export type BoardCoord = {
  row: number;
  col: number;
};
