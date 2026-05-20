// Portado de: algorithms/gomoku/minimax.py

import {
  applyMove,
  checkWinnerAt,
  getLegalMoves,
  undoMove,
} from './board';
import {
  CENTER_COL,
  CENTER_ROW,
  DEFAULT_DEPTH,
  DEPTH_LEGAL_HARD,
  DEPTH_LEGAL_SOFT,
  MAX_PLAYER,
  MIN_PLAYER,
  SCORE_FIVE,
  type Board,
  type Coord,
} from './constants';
import { evaluateBoard } from './evaluate';
import { SearchTrace, fmtCoord, fmtScore } from './searchTrace';

function immediateWinMove(board: Board, player: number): Coord | null {
  for (const [row, col] of getLegalMoves(board)) {
    applyMove(board, row, col, player);
    const won = checkWinnerAt(board, row, col) === player;
    undoMove(board, row, col);
    if (won) return [row, col];
  }
  return null;
}

function moveOrderKey(move: Coord): [number, number, number] {
  const [row, col] = move;
  const dist = Math.max(Math.abs(row - CENTER_ROW), Math.abs(col - CENTER_COL));
  return [dist, -row, -col];
}

function orderMoves(moves: Coord[]): Coord[] {
  return [...moves].sort((a, b) => {
    const ka = moveOrderKey(a);
    const kb = moveOrderKey(b);
    return ka[0] - kb[0] || ka[1] - kb[1] || ka[2] - kb[2];
  });
}

function effectiveDepth(legalCount: number, requested: number): number {
  if (legalCount > DEPTH_LEGAL_HARD) return Math.min(requested, 2);
  if (legalCount > DEPTH_LEGAL_SOFT) return Math.min(requested, 3);
  return requested;
}

function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  trace: SearchTrace | null,
  rootDepth: number,
): [number, Coord | null] {
  const moves = getLegalMoves(board);
  if (moves.length === 0) return [evaluateBoard(board), null];
  if (depth === 0) return [evaluateBoard(board), null];

  const ordered = orderMoves(moves);
  const atRoot = trace !== null && depth === rootDepth;

  if (maximizing) {
    if (atRoot) {
      trace.add(
        `[raiz MAX] ${ordered.length} candidatos · a=${fmtScore(alpha)} b=${fmtScore(beta)}`,
      );
    }
    let bestValue = -Infinity;
    let bestMove: Coord | null = ordered[0];
    for (let idx = 0; idx < ordered.length; idx++) {
      const [row, col] = ordered[idx];
      applyMove(board, row, col, MAX_PLAYER);
      if (checkWinnerAt(board, row, col) === MAX_PLAYER) {
        undoMove(board, row, col);
        if (atRoot) trace.add(`  → ${fmtCoord(row, col)} vitória imediata (5 em linha)`);
        return [SCORE_FIVE, [row, col]];
      }
      const [value] = minimax(board, depth - 1, alpha, beta, false, trace, rootDepth);
      undoMove(board, row, col);
      if (atRoot && trace.candidatesLogged < 8) {
        trace.candidatesLogged += 1;
        trace.add(`  → ${fmtCoord(row, col)} retorna ${fmtScore(value)}`);
      } else if (atRoot && idx === 8) {
        trace.add(`  … (+${ordered.length - 8} candidatos omitidos no log)`);
      }
      if (value > bestValue) {
        bestValue = value;
        bestMove = [row, col];
      }
      alpha = Math.max(alpha, value);
      if (beta <= alpha) {
        if (atRoot) trace.addPrune(ordered.length - idx - 1);
        break;
      }
    }
    if (atRoot && bestMove) {
      const [br, bc] = bestMove;
      trace.add(`[raiz MAX] melhor: ${fmtCoord(br, bc)} = ${fmtScore(bestValue)}`);
    }
    return [bestValue, bestMove];
  }

  if (atRoot) {
    trace.add(`[MIN] ${ordered.length} respostas · a=${fmtScore(alpha)} b=${fmtScore(beta)}`);
  }
  let bestValue = Infinity;
  let bestMove: Coord | null = ordered[0];
  for (let idx = 0; idx < ordered.length; idx++) {
    const [row, col] = ordered[idx];
    applyMove(board, row, col, MIN_PLAYER);
    if (checkWinnerAt(board, row, col) === MIN_PLAYER) {
      undoMove(board, row, col);
      return [-SCORE_FIVE, [row, col]];
    }
    const [value] = minimax(board, depth - 1, alpha, beta, true, trace, rootDepth);
    undoMove(board, row, col);
    if (value < bestValue) {
      bestValue = value;
      bestMove = [row, col];
    }
    beta = Math.min(beta, value);
    if (beta <= alpha) {
      if (atRoot) trace.addPrune(ordered.length - idx - 1);
      break;
    }
  }
  return [bestValue, bestMove];
}

function getBestMoveForPlayer(
  board: Board,
  player: number,
  depth: number,
  trace: SearchTrace | null,
): Coord {
  const legal = getLegalMoves(board);
  if (legal.length === 0) throw new Error('Não há jogadas legais disponíveis.');

  const isMax = player === MAX_PLAYER;
  const opponent = isMax ? MIN_PLAYER : MAX_PLAYER;

  if (trace) {
    trace.clear();
    trace.add(`[1] Início · ${legal.length} jogada(s) legal(is)`);
    trace.add(`     profundidade pedida: ${depth}`);
    trace.add(`     jogador: ${isMax ? 'MAX (IA)' : 'MIN (humano)'}`);
  }

  if (legal.length === 1) {
    if (trace) {
      trace.add('[2] Única jogada possível — busca omitida');
      trace.add(`     escolha: ${fmtCoord(legal[0][0], legal[0][1])}`);
    }
    return legal[0];
  }

  const win = immediateWinMove(board, player);
  if (win) {
    if (trace) {
      trace.add(`[2] Vitória imediata detectada (${isMax ? 'MAX' : 'MIN'})`);
      trace.add(`     jogada: ${fmtCoord(win[0], win[1])}`);
    }
    return win;
  }
  if (trace) trace.add(`[2] Sem vitória imediata para ${isMax ? 'MAX' : 'MIN'}`);

  const block = immediateWinMove(board, opponent);
  if (block) {
    if (trace) {
      trace.add('[3] Bloqueio obrigatório (ameaça do adversário)');
      trace.add(`     jogada: ${fmtCoord(block[0], block[1])}`);
    }
    return block;
  }
  if (trace) trace.add('[3] Sem ameaça imediata a bloquear');

  const searchDepth = effectiveDepth(legal.length, depth);
  if (trace) {
    trace.add(`[4] Profundidade efetiva: ${searchDepth} (adaptada à ramificação)`);
    trace.add('[5] Busca em arvore com poda alfa-beta:');
    trace.candidatesLogged = 0;
  }

  const [, move] = minimax(
    board,
    searchDepth,
    -Infinity,
    Infinity,
    isMax,
    trace,
    searchDepth,
  );
  const chosen = move ?? legal[0];
  if (trace) trace.add(`[6] Retorno da raiz → ${fmtCoord(chosen[0], chosen[1])}`);
  return chosen;
}

export function getBestMove(
  board: Board,
  depth: number = DEFAULT_DEPTH,
  trace: SearchTrace | null = null,
): Coord {
  return getBestMoveForPlayer(board, MAX_PLAYER, depth, trace);
}

export function getBestMoveFor(
  board: Board,
  player: number,
  depth: number = DEFAULT_DEPTH,
  trace: SearchTrace | null = null,
): Coord {
  return getBestMoveForPlayer(board, player, depth, trace);
}
