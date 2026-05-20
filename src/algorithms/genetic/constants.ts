// Portado de: algorithms/genetic/ga.py

export const CHROMOSOME_SIZE = 10;
export const POPULATION_SIZE = 20;
export const MIN_GENE = 1;
export const MAX_GENE = 20;
export const GENE_POOL = Array.from({ length: MAX_GENE - MIN_GENE + 1 }, (_, i) => i + MIN_GENE);
export const MAX_FITNESS = CHROMOSOME_SIZE;
export const TOURNAMENT_K = 2;
export const MAX_GA_GENERATIONS = 5000;
export const STEP_ARCHIVE_TOP = 5;
