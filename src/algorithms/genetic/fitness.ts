// Portado de: algorithms/genetic/ga.py

import { CHROMOSOME_SIZE, GENE_POOL, MAX_FITNESS } from './constants';

export function calcularAptidao(numeros: number[], sequenciaSecreta: number[]): number {
  const segredo = new Set(sequenciaSecreta);
  return numeros.filter((n) => segredo.has(n)).length;
}

export function validarSequenciaSecreta(sequenciaSecreta: number[]): number[] {
  if (sequenciaSecreta.length !== CHROMOSOME_SIZE) {
    throw new Error(`sequencia_secreta deve ter ${CHROMOSOME_SIZE} números.`);
  }
  if (new Set(sequenciaSecreta).size !== CHROMOSOME_SIZE) {
    throw new Error('sequencia_secreta não pode ter números repetidos.');
  }
  for (const n of sequenciaSecreta) {
    if (!GENE_POOL.includes(n)) {
      throw new Error(`Número inválido na sequência secreta: ${n}`);
    }
  }
  return [...sequenciaSecreta].sort((a, b) => a - b);
}

export { MAX_FITNESS };
