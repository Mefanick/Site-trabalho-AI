import type { GeneticRow, LogGenerationEntry } from '../types/genetic';
import type { CellSymbol, LogTurnEntry } from '../types/gomoku';

export const INITIAL_GENETIC_TABLE: GeneticRow[] = [
  { grupo: 'G1', individuo: 'A', lista: '1, 3, 7, 12, 15, 18, 19, 20, 4, 9', aptidao: '42' },
  { grupo: 'G1', individuo: 'B', lista: '2, 5, 6, 8, 10, 11, 13, 14, 16, 17', aptidao: '38' },
  { grupo: 'G2', individuo: 'A', lista: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10', aptidao: '55' },
  { grupo: 'G2', individuo: 'B', lista: '11, 12, 13, 14, 15, 16, 17, 18, 19, 20', aptidao: '51' },
  { grupo: 'G3', individuo: 'A', lista: '3, 6, 9, 12, 15, 18, 1, 4, 7, 10', aptidao: '47' },
];

export const MOCK_LOG_GENERATIONS: LogGenerationEntry[] = [
  {
    generation: 1,
    resumo: 'GA1 — melhor aptidão 48 (G1 A)',
    logCompleto:
      '--- Geração 1 ---\nPopulação inicial avaliada.\nMelhor: G1 A | lista 1,3,7,12,15,18,19,20,4,9 | apt 48\nPior: G2 B | apt 35\n',
    melhorApt: 48,
    melhorLista: '1, 3, 7, 12, 15, 18, 19, 20, 4, 9',
  },
  {
    generation: 2,
    resumo: 'GA2 — melhor aptidão 52 (G2 A)',
    logCompleto:
      '--- Geração 2 ---\nCrossover entre G1 A e G2 A.\nMutação em posição 4.\nMelhor: G2 A | apt 52\n',
    melhorApt: 52,
    melhorLista: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10',
  },
];

export const INITIAL_GOMOKU_BOARD: CellSymbol[][] = createEmptyBoard();

export const MOCK_COMPETITIVE_LOG: LogTurnEntry[] = [
  { turn: 1, resumo: 'Humano X em (4,4) | IA O em (5,5) | nós avaliados: 120', elapsedMs: 38 },
  { turn: 2, resumo: 'Humano X em (3,4) | IA O em (6,4) | poda alfa-beta: 45', elapsedMs: 41 },
];

export const DEFAULT_SECRET_SELECTION: number[] = [];

export const GOMOKU_IDLE_LOG = `LOG reiniciado.
Aguardando primeira jogada da IA...
Cada turno mostra: jogadas legais, profundidade, candidatos na raiz, podas alfa-beta e jogada escolhida.`;

export const GENETIC_IDLE_LOG = `LOG reiniciado.
«Próximo passo» -> 1 geracao, grupos na tabela.
«Executar ate solucao» -> loop automatico.
«expandir» -> LOG completo con navegacao.`;

export const BEST_INDIVIDUAL_PLACEHOLDER: GeneticRow = {
  grupo: 'G1',
  individuo: 'A',
  lista: '',
  aptidao: '?',
};

export function createEmptyBoard(size = 10): CellSymbol[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => '' as CellSymbol),
  );
}

export const GENETIC_GUIDE_TEXT = `GUIA DE UTILIZAÇÃO — BUSCA GENÉTICA

1. População secreta
Selecione até 10 números na faixa 1–20 (destaque amarelo). Esta lista não aparece na tabela principal, mas define o alvo do algoritmo.

2. Tabela (arquivo de grupos)
Regista indivíduos enviados manualmente ou gerados. Colunas: Grupo, Indivíduo, Lista (ordem crescente), Aptidão.

3. Criador de listas
Monte rascunhos com 10 números e use «enviar» para adicionar à tabela. «Gerar Aleatóriamente» preenche o rascunho.

4. Algoritmo
«Próximo passo» avança uma geração mock. «Executar até solução» simula várias gerações. Ajuste a velocidade (Lento / Normal / Rápido / Turbo).

5. LOG
Resumo na página; «expandir» abre o histórico completo com navegação Anterior / Próximo.

O algoritmo genético steady-state está ativo nesta versão web.
`;
