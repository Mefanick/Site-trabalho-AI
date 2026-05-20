import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_DEPTH } from '../algorithms/gomoku/constants';
import { GOMOKU_IDLE_LOG } from '../data/mocks';
import { AI, GomokuState, HUMAN } from '../game/gomokuState';
import type { BoardCoord, CellSymbol } from '../types/gomoku';
import type { WorkerRequest, WorkerResponse } from '../workers/minimax.worker';
import MinimaxWorker from '../workers/minimax.worker?worker';

const SIM_DELAY_MS = 300;

function formatTurnEntry(turn: number, block: string, elapsedMs: number, row: number, col: number): string {
  const sep = '='.repeat(30);
  return (
    `\n${sep}\n` +
    `TURNO ${turn} | IA | ${elapsedMs} ms\n` +
    `${sep}\n` +
    `${block}\n` +
    `>> JOGADA FINAL: linha ${row + 1}, coluna ${col + 1}\n`
  );
}

export function useGomokuGame() {
  const gameRef = useRef(new GomokuState());
  const workerRef = useRef<Worker | null>(null);
  const simTimerRef = useRef<number | null>(null);
  const turnRef = useRef(0);
  const simModeRef = useRef<'none' | 'ai_vs_ai' | 'smart_vs_normal'>('none');
  const nextPlayerRef = useRef(AI);

  const [board, setBoard] = useState<CellSymbol[][]>(() => gameRef.current.displayBoard());
  const [logText, setLogText] = useState(GOMOKU_IDLE_LOG);
  const [logStatus, setLogStatus] = useState('aguardando');
  const [humanTurn, setHumanTurn] = useState(true);
  const [aiBusy, setAiBusy] = useState(false);
  const [lastAiCell, setLastAiCell] = useState<BoardCoord | undefined>();
  const [gameOver, setGameOver] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const inputEnabled = humanTurn && !aiBusy && !gameOver && !simulating;

  const syncFromGame = useCallback(() => {
    const g = gameRef.current;
    setBoard(g.displayBoard());
    setGameOver(g.isGameOver());
  }, []);

  const requestAiMove = useCallback(
    (
      useSmart: boolean,
      forPlayer: number,
      onDone?: () => void,
    ) => {
      const g = gameRef.current;
      if (g.isGameOver()) {
        setAiBusy(false);
        setHumanTurn(true);
        onDone?.();
        return;
      }

      setLogStatus('calculando…');
      setAiBusy(true);

      if (!workerRef.current) {
        workerRef.current = new MinimaxWorker();
      }

      const worker = workerRef.current;
      const boardCopy = g.copyBoard();

      const handler = (event: MessageEvent<WorkerResponse>) => {
        worker.removeEventListener('message', handler);
        setAiBusy(false);

        const data = event.data;
        if (data.type === 'ERROR') {
          setLogText((prev) => `${prev}\n\n[Erro na busca]\n${data.message}\n`);
          setLogStatus('aguardando');
          onDone?.();
          return;
        }

        const { move, logBlock, elapsedMs } = data;
        const [row, col] = move;

        if (g.makeMove(row, col, forPlayer)) {
          if (forPlayer === AI) {
            setLastAiCell({ row, col });
          }
          turnRef.current += 1;
          setLogText((prev) =>
            prev === GOMOKU_IDLE_LOG
              ? formatTurnEntry(turnRef.current, logBlock, elapsedMs, row, col).trimStart()
              : prev + formatTurnEntry(turnRef.current, logBlock, elapsedMs, row, col),
          );
          setLogStatus(`turno ${turnRef.current}`);
          syncFromGame();
        }

        onDone?.();
      };

      worker.addEventListener('message', handler);
      const req: WorkerRequest = {
        type: 'BEST_MOVE',
        board: boardCopy,
        depth: DEFAULT_DEPTH,
        useSmart,
        forPlayer,
      };
      worker.postMessage(req);
    },
    [syncFromGame],
  );

  const runAiTurn = useCallback(
    (useSmart: boolean, forPlayer: number = AI, onComplete?: () => void) => {
      requestAiMove(useSmart, forPlayer, () => {
        const g = gameRef.current;
        if (g.isGameOver()) {
          setHumanTurn(true);
          onComplete?.();
          return;
        }
        onComplete?.();
      });
    },
    [requestAiMove],
  );

  const scheduleSimStep = useCallback(() => {
    if (simModeRef.current === 'none') return;
    const g = gameRef.current;
    if (g.isGameOver()) {
      simModeRef.current = 'none';
      setSimulating(false);
      setHumanTurn(true);
      return;
    }

    if (simModeRef.current === 'ai_vs_ai') {
      const player = nextPlayerRef.current;
      const smart = true;
      runAiTurn(smart, player, () => {
        nextPlayerRef.current = player === AI ? HUMAN : AI;
        simTimerRef.current = window.setTimeout(scheduleSimStep, SIM_DELAY_MS);
      });
    } else if (simModeRef.current === 'smart_vs_normal') {
      const player = nextPlayerRef.current;
      const smart = player === AI;
      runAiTurn(smart, player, () => {
        nextPlayerRef.current = player === AI ? HUMAN : AI;
        simTimerRef.current = window.setTimeout(scheduleSimStep, SIM_DELAY_MS);
      });
    }
  }, [runAiTurn]);

  const stopSimulation = useCallback(() => {
    simModeRef.current = 'none';
    setSimulating(false);
    if (simTimerRef.current != null) {
      window.clearTimeout(simTimerRef.current);
      simTimerRef.current = null;
    }
  }, []);

  const playHumanMove = useCallback(
    (row: number, col: number) => {
      if (!humanTurn || aiBusy || gameOver || simulating) return;
      const g = gameRef.current;
      if (!g.makeMove(row, col, HUMAN)) return;

      setHumanTurn(false);
      syncFromGame();

      if (g.isGameOver()) {
        setHumanTurn(true);
        return;
      }

      runAiTurn(true, AI, () => {
        setHumanTurn(true);
      });
    },
    [humanTurn, aiBusy, gameOver, simulating, syncFromGame, runAiTurn],
  );

  const resetGame = useCallback(() => {
    stopSimulation();
    gameRef.current.reset();
    turnRef.current = 0;
    nextPlayerRef.current = AI;
    setLogText(GOMOKU_IDLE_LOG);
    setLogStatus('aguardando');
    setHumanTurn(true);
    setAiBusy(false);
    setLastAiCell(undefined);
    setGameOver(false);
    syncFromGame();
  }, [stopSimulation, syncFromGame]);

  const simulateAiVsAi = useCallback(() => {
    resetGame();
    simModeRef.current = 'ai_vs_ai';
    nextPlayerRef.current = AI;
    setSimulating(true);
    setHumanTurn(false);
    simTimerRef.current = window.setTimeout(scheduleSimStep, SIM_DELAY_MS);
  }, [resetGame, scheduleSimStep]);

  const simulateSmartVsNormal = useCallback(() => {
    resetGame();
    simModeRef.current = 'smart_vs_normal';
    nextPlayerRef.current = AI;
    setSimulating(true);
    setHumanTurn(false);
    simTimerRef.current = window.setTimeout(scheduleSimStep, SIM_DELAY_MS);
  }, [resetGame, scheduleSimStep]);

  useEffect(() => {
    return () => {
      stopSimulation();
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [stopSimulation]);

  return {
    board,
    playHumanMove,
    inputEnabled,
    lastAiCell,
    gameOver,
    resetGame,
    logStatus,
    logText,
    simulateAiVsAi,
    simulateSmartVsNormal,
    simulating,
  };
}
