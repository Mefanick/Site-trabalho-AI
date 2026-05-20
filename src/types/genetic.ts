export type GeneticRow = {
  grupo: string;
  individuo: string;
  lista: string;
  aptidao: string;
};

export type LogGenerationEntry = {
  generation: number;
  resumo: string;
  logCompleto: string;
  melhorApt: number;
  melhorLista: string;
};

export type GeneticSpeed = 'lento' | 'normal' | 'rapido' | 'turbo';

export interface Individuo {
  numeros: number[];
  aptidao?: number;
  grupo?: string;
  individuo?: string;
}

export interface ResultadoGeracao {
  novaPopulacao: Individuo[];
  melhorIndividuo: Individuo;
  log: string;
  logResumido: string;
}

export const GA_SPEED_MS: Record<GeneticSpeed, number> = {
  lento: 400,
  normal: 80,
  rapido: 12,
  turbo: 1,
};

export const DEFAULT_GENETIC_SPEED: GeneticSpeed = 'rapido';
