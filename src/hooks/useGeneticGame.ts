import { useCallback, useEffect, useRef, useState } from 'react';
import { executarGeracao } from '../algorithms/genetic/ga';
import {
  CHROMOSOME_SIZE,
  MAX_FITNESS,
  MAX_GA_GENERATIONS,
  POPULATION_SIZE,
  STEP_ARCHIVE_TOP,
} from '../algorithms/genetic/constants';
import { calcularAptidao } from '../algorithms/genetic/fitness';
import { criarIndividuoAleatorio, sampleUnique } from '../algorithms/genetic/operators';
import {
  BEST_INDIVIDUAL_PLACEHOLDER,
  GENETIC_IDLE_LOG,
} from '../data/mocks';
import type {
  GeneticRow,
  GeneticSpeed,
  Individuo,
  LogGenerationEntry,
} from '../types/genetic';
import { DEFAULT_GENETIC_SPEED, GA_SPEED_MS } from '../types/genetic';
import { formatList } from '../utils/formatList';
import { parseList } from '../utils/parseList';

function rowToIndividuo(row: GeneticRow, secret: number[]): Individuo | null {
  const nums = parseList(row.lista);
  if (nums.length !== CHROMOSOME_SIZE) return null;
  const ordenado = [...nums].sort((a, b) => a - b);
  return {
    grupo: row.grupo,
    individuo: row.individuo,
    numeros: ordenado,
    aptidao: calcularAptidao(ordenado, secret),
  };
}

function individuoToRow(ind: Individuo, grupo: string, individuo: string): GeneticRow {
  return {
    grupo,
    individuo,
    lista: formatList(ind.numeros),
    aptidao: String(ind.aptidao ?? 0),
  };
}

export function useGeneticGame() {
  const gaPopulationRef = useRef<Individuo[]>([]);
  const intervalRef = useRef<number | null>(null);
  const draftGrupoRef = useRef('G1');
  const draftIndividuoRef = useRef('A');

  const [secretSelection, setSecretSelection] = useState<number[]>([]);
  const [draftSelection, setDraftSelection] = useState<number[]>([]);
  const [mainTableRows, setMainTableRows] = useState<GeneticRow[]>([]);
  const [bestRow, setBestRow] = useState<GeneticRow | null>(null);
  const [logHistory, setLogHistory] = useState<LogGenerationEntry[]>([]);
  const [logResumo, setLogResumo] = useState(GENETIC_IDLE_LOG);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState<GeneticSpeed>(DEFAULT_GENETIC_SPEED);
  const [algoRunning, setAlgoRunning] = useState(false);

  const populationReady = secretSelection.length === CHROMOSOME_SIZE;

  const calcFitnessDisplay = useCallback(
    (numbers: number[]): string => {
      if (!populationReady) return '?';
      return String(calcularAptidao(numbers, secretSelection));
    },
    [populationReady, secretSelection],
  );

  const updateBestFromRows = useCallback((rows: GeneticRow[]) => {
    if (rows.length === 0) {
      setBestRow(null);
      return;
    }
    const sorted = [...rows].sort((a, b) => {
      const fa = a.aptidao === '?' ? -1 : Number(a.aptidao);
      const fb = b.aptidao === '?' ? -1 : Number(b.aptidao);
      return fb - fa;
    });
    setBestRow(sorted[0]);
  }, []);

  useEffect(() => {
    if (!populationReady) return;
    setMainTableRows((rows) => {
      const updated = rows.map((row) => {
        const nums = parseList(row.lista);
        return { ...row, aptidao: calcFitnessDisplay(nums) };
      });
      updateBestFromRows(updated);
      return updated;
    });
    gaPopulationRef.current = [];
  }, [secretSelection, populationReady, calcFitnessDisplay, updateBestFromRows]);

  const bootstrapGaPopulation = useCallback((): Individuo[] => {
    const secret = [...secretSelection].sort((a, b) => a - b);
    const pop: Individuo[] = [];
    for (const row of mainTableRows) {
      if (pop.length >= POPULATION_SIZE) break;
      const ind = rowToIndividuo(row, secret);
      if (ind) pop.push(ind);
    }
    let idx = pop.length + 1;
    while (pop.length < POPULATION_SIZE) {
      const nums = criarIndividuoAleatorio();
      pop.push({
        grupo: `P${idx}`,
        individuo: 'GA',
        numeros: nums,
        aptidao: calcularAptidao(nums, secret),
      });
      idx += 1;
    }
    return pop.map((ind) => ({
      ...ind,
      numeros: [...ind.numeros],
      aptidao: calcularAptidao(ind.numeros, secret),
    }));
  }, [mainTableRows, secretSelection]);

  const ensureGaReady = useCallback((): boolean => {
    if (!populationReady) {
      setLogResumo(
        'Populacao secreta incompleta\nSelecione 10 numeros na populacao inicial.',
      );
      return false;
    }
    if (gaPopulationRef.current.length === 0) {
      gaPopulationRef.current = bootstrapGaPopulation();
      setLogResumo(
        (prev) =>
          `${prev === GENETIC_IDLE_LOG ? '' : prev + '\n\n'}[Populacao AG]\n${POPULATION_SIZE} individuos prontos para evoluir.`,
      );
    }
    return true;
  }, [populationReady, bootstrapGaPopulation]);

  const archiveStepGroups = useCallback((gen: number, populacao: Individuo[]) => {
    const ordenada = [...populacao].sort(
      (a, b) => (b.aptidao ?? 0) - (a.aptidao ?? 0),
    );
    const newRows: GeneticRow[] = ordenada
      .slice(0, STEP_ARCHIVE_TOP)
      .map((ind, i) => individuoToRow(ind, `GA${gen}`, `P${i + 1}`));
    setMainTableRows((rows) => {
      const merged = [...rows, ...newRows];
      updateBestFromRows(merged);
      return merged;
    });
  }, [updateBestFromRows]);

  const applyGenerationResult = useCallback(
    (gen: number, resultado: ReturnType<typeof executarGeracao>) => {
      gaPopulationRef.current = resultado.novaPopulacao;
      const melhor = resultado.melhorIndividuo;
      const apt = melhor.aptidao ?? 0;

      const entry: LogGenerationEntry = {
        generation: gen,
        resumo: resultado.logResumido,
        logCompleto: resultado.log,
        melhorApt: apt,
        melhorLista: formatList(melhor.numeros),
      };
      setLogHistory((h) => [...h, entry]);
      setLogResumo(resultado.logResumido);
      setGeneration(gen);
      archiveStepGroups(gen, gaPopulationRef.current);
      setBestRow(
        individuoToRow(melhor, melhor.grupo ?? `GA${gen}`, melhor.individuo ?? 'melhor'),
      );
      return apt;
    },
    [archiveStepGroups],
  );

  const runOneGeneration = useCallback((): number | null => {
    const nextGen = generation + 1;
    if (nextGen > MAX_GA_GENERATIONS) return null;

    try {
      const resultado = executarGeracao(gaPopulationRef.current, secretSelection);
      return applyGenerationResult(nextGen, resultado);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setLogResumo(`[Erro]\n${msg}`);
      return null;
    }
  }, [generation, secretSelection, applyGenerationResult]);

  const proximoPasso = useCallback(() => {
    if (algoRunning) return;
    if (!ensureGaReady()) return;
    const apt = runOneGeneration();
    if (apt === null && generation + 1 > MAX_GA_GENERATIONS) {
      setLogResumo((p) => `${p}\n[Limite] Maximo de geracoes atingido.`);
    } else if (apt !== null && apt >= MAX_FITNESS) {
      setLogResumo(
        (p) => `${p}\n[Solucao] Aptidao ${MAX_FITNESS}/10 alcancada.`,
      );
    }
  }, [algoRunning, ensureGaReady, runOneGeneration, generation]);

  const finishAutoRun = useCallback((solved: boolean, reason: string) => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setAlgoRunning(false);
    setLogResumo((p) =>
      solved
        ? `${p}\n[Sucesso] ${reason}`
        : `${p}\n[Parada] ${reason}`,
    );
  }, []);

  const gaStep = useCallback(() => {
    const apt = runOneGeneration();
    if (apt === null) {
      finishAutoRun(false, 'limite de geracoes ou erro');
      return;
    }
    if (apt >= MAX_FITNESS) {
      finishAutoRun(true, 'solucao encontrada');
      return;
    }
  }, [runOneGeneration, finishAutoRun]);

  const executarAteSolucao = useCallback(() => {
    if (algoRunning) return;
    if (!ensureGaReady()) return;
    setAlgoRunning(true);
    if (generation === 0) {
      setLogHistory([]);
      setLogResumo('[Inicio automatico]\nPopulacao: 20 | objetivo: 10/10.');
    }
    const delay = Math.max(1, GA_SPEED_MS[speed]);
    intervalRef.current = window.setInterval(gaStep, delay);
  }, [algoRunning, ensureGaReady, generation, speed, gaStep]);

  const enviar = useCallback(() => {
    if (draftSelection.length !== CHROMOSOME_SIZE) return;
    if (!populationReady) return;

    const nums = [...draftSelection].sort((a, b) => a - b);
    const row: GeneticRow = {
      grupo: draftGrupoRef.current,
      individuo: draftIndividuoRef.current,
      lista: formatList(nums),
      aptidao: calcFitnessDisplay(nums),
    };
    setMainTableRows((rows) => {
      const merged = [...rows, row];
      updateBestFromRows(merged);
      return merged;
    });
    setDraftSelection([]);

    if (draftIndividuoRef.current === 'A') {
      draftIndividuoRef.current = 'B';
    } else {
      draftGrupoRef.current = `G${Number(draftGrupoRef.current.replace('G', '')) + 1}`;
      draftIndividuoRef.current = 'A';
    }
  }, [draftSelection, populationReady, calcFitnessDisplay, updateBestFromRows]);

  const gerarAleatorioDraft = useCallback(() => {
    setDraftSelection(sampleUnique(CHROMOSOME_SIZE, 1, 20));
  }, []);

  const gerarAleatorioSecret = useCallback(() => {
    setSecretSelection(sampleUnique(CHROMOSOME_SIZE, 1, 20));
  }, []);

  const limparLogLista = useCallback(() => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setAlgoRunning(false);
    gaPopulationRef.current = [];
    setGeneration(0);
    setLogHistory([]);
    setMainTableRows([]);
    setBestRow(null);
    setLogResumo(
      '[Limpeza]\nLOG e tabela (lista) foram apagados.\nPopulacao secreta e criador de listas mantidos.',
    );
  }, []);

  const resetarAG = useCallback(() => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setAlgoRunning(false);
    gaPopulationRef.current = [];
    setGeneration(0);
    setLogHistory((h) => h.filter((e) => !e.resumo.startsWith('GA')));
    setMainTableRows((rows) => {
      const kept = rows.filter((r) => !r.grupo.startsWith('GA'));
      updateBestFromRows(kept);
      return kept;
    });
    setLogResumo(GENETIC_IDLE_LOG);
  }, [updateBestFromRows]);

  useEffect(() => {
    return () => {
      if (intervalRef.current != null) window.clearInterval(intervalRef.current);
    };
  }, []);

  const draftRow: GeneticRow = {
    grupo: draftGrupoRef.current,
    individuo: draftIndividuoRef.current,
    lista: draftSelection.length ? formatList(draftSelection) : '',
    aptidao: '?',
  };

  const displayBestRow = bestRow ?? BEST_INDIVIDUAL_PLACEHOLDER;

  const logStatus = algoRunning
    ? 'executando…'
    : generation > 0
      ? `gen ${generation}`
      : 'aguardando';

  return {
    secretSelection,
    setSecretSelection: (nums: number[]) => {
      setSecretSelection(nums);
      gaPopulationRef.current = [];
    },
    draftSelection,
    setDraftSelection,
    mainTableRows,
    displayBestRow,
    logHistory,
    generation,
    speed,
    setSpeed,
    algoRunning,
    draftRow,
    logResumo,
    logStatus,
    enviar,
    gerarAleatorioDraft,
    gerarAleatorioSecret,
    proximoPasso,
    executarAteSolucao,
    limparLogLista,
    resetarAG,
  };
}
