/// <reference lib="webworker" />
// Portado de: views/competitive_view.py (_compute em thread)

import { randomLegalMove } from '../algorithms/gomoku/board';
import { DEFAULT_DEPTH } from '../algorithms/gomoku/constants';
import { getBestMove, getBestMoveFor } from '../algorithms/gomoku/minimax';
import { SearchTrace } from '../algorithms/gomoku/searchTrace';
import { MAX_PLAYER, MIN_PLAYER, type Board } from '../algorithms/gomoku/constants';

export type WorkerRequest =
  | {
      type: 'BEST_MOVE';
      board: Board;
      depth: number;
      useSmart: boolean;
      forPlayer?: number;
    };

export type WorkerResponse =
  | { type: 'RESULT'; move: [number, number]; logBlock: string; elapsedMs: number }
  | { type: 'ERROR'; message: string };

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const msg = event.data;
  if (msg.type !== 'BEST_MOVE') return;

  const t0 = performance.now();
  try {
    const board = msg.board.map((row) => [...row]) as Board;
    const depth = msg.depth ?? DEFAULT_DEPTH;
    const forPlayer = msg.forPlayer ?? MAX_PLAYER;
    let move: [number, number];
    let logBlock: string;

    if (msg.useSmart) {
      const trace = new SearchTrace();
      move =
        forPlayer === MAX_PLAYER
          ? getBestMove(board, depth, trace)
          : getBestMoveFor(board, MIN_PLAYER, depth, trace);
      logBlock = trace.formatBlock();
    } else {
      move = randomLegalMove(board);
      logBlock =
        '[IA aleatória]\nSem busca Minimax — jogada sorteada entre casas legais.';
    }

    const elapsedMs = Math.round(performance.now() - t0);
    const response: WorkerResponse = { type: 'RESULT', move, logBlock, elapsedMs };
    self.postMessage(response);
  } catch (err) {
    const response: WorkerResponse = {
      type: 'ERROR',
      message: err instanceof Error ? err.message : String(err),
    };
    self.postMessage(response);
  }
};
