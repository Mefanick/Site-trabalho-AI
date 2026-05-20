// Portado de: algorithms/genetic/ga.py

import {
  CHROMOSOME_SIZE,
  GENE_POOL,
  MAX_GENE,
  MIN_GENE,
  TOURNAMENT_K,
} from './constants';
import { calcularAptidao } from './fitness';
import type { Individuo } from '../../types/genetic';

function extrairNumeros(ind: Individuo | number[]): number[] {
  return Array.isArray(ind) ? [...ind] : [...ind.numeros];
}

export function repararCromossomo(cromossomo: number[]): number[] {
  const vistos = new Set<number>();
  const unicos: number[] = [];
  for (const gene of cromossomo) {
    if (gene >= MIN_GENE && gene <= MAX_GENE && !vistos.has(gene)) {
      vistos.add(gene);
      unicos.push(gene);
    }
  }
  const disponiveis = GENE_POOL.filter((g) => !vistos.has(g));
  shuffleInPlace(disponiveis);
  while (unicos.length < CHROMOSOME_SIZE && disponiveis.length > 0) {
    unicos.push(disponiveis.pop()!);
  }
  if (unicos.length < CHROMOSOME_SIZE) {
    throw new Error('Não foi possível reparar o cromossomo (pool esgotado).');
  }
  unicos.sort((a, b) => a - b);
  return unicos.slice(0, CHROMOSOME_SIZE);
}

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export function normalizarIndividuo(
  bruto: Individuo | number[],
  sequenciaSecreta: number[],
): Individuo {
  let base: Individuo;
  if (Array.isArray(bruto)) {
    base = { numeros: repararCromossomo(bruto) };
  } else {
    base = {
      ...bruto,
      numeros: repararCromossomo(extrairNumeros(bruto)),
    };
  }
  base.aptidao = calcularAptidao(base.numeros, sequenciaSecreta);
  return base;
}

export function criarIndividuoAleatorio(): number[] {
  const pool = [...GENE_POOL];
  shuffleInPlace(pool);
  return pool.slice(0, CHROMOSOME_SIZE).sort((a, b) => a - b);
}

export function sampleUnique(count: number, min: number, max: number): number[] {
  const pool = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  shuffleInPlace(pool);
  return pool.slice(0, count).sort((a, b) => a - b);
}

function torneio(populacao: Individuo[], k: number = TOURNAMENT_K): Individuo {
  const candidatos: Individuo[] = [];
  for (let i = 0; i < k; i++) {
    candidatos.push(populacao[Math.floor(Math.random() * populacao.length)]);
  }
  return candidatos.reduce((best, ind) =>
    (ind.aptidao ?? 0) > (best.aptidao ?? 0) ? ind : best,
  );
}

function cruzamento(pai1: number[], pai2: number[]): number[] {
  return [...pai1.slice(0, 5), ...pai2.slice(5)];
}

function mutacao(cromossomo: number[]): [number[], number | null, number | null] {
  const posicao = Math.floor(Math.random() * CHROMOSOME_SIZE);
  const disponiveis = GENE_POOL.filter((g) => !cromossomo.includes(g));
  if (disponiveis.length === 0) return [cromossomo, null, null];
  const valorNovo = disponiveis[Math.floor(Math.random() * disponiveis.length)];
  const mutado = [...cromossomo];
  mutado[posicao] = valorNovo;
  mutado.sort((a, b) => a - b);
  return [mutado, posicao, valorNovo];
}

function indiceMelhor(populacao: Individuo[]): number {
  let bestIdx = 0;
  let bestApt = populacao[0].aptidao ?? 0;
  for (let i = 1; i < populacao.length; i++) {
    const apt = populacao[i].aptidao ?? 0;
    if (apt > bestApt) {
      bestApt = apt;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function indicePiorSubstituivel(populacao: Individuo[]): number {
  const melhorIdx = indiceMelhor(populacao);
  const piores: [number, number][] = [];
  for (let i = 0; i < populacao.length; i++) {
    if (i !== melhorIdx) piores.push([i, populacao[i].aptidao ?? 0]);
  }
  if (piores.length === 0) return melhorIdx;
  return piores.reduce((a, b) => (a[1] <= b[1] ? a : b))[0];
}

export function formatarLista(numeros: number[]): string {
  return numeros.join(', ');
}

export {
  torneio,
  cruzamento,
  mutacao,
  indiceMelhor,
  indicePiorSubstituivel,
};
