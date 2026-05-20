# Trabalho Unidade 3 — Interface Web

Réplica visual (wireframe/terminal) da aplicação desktop Python/tkinter, com **algoritmos reais** portados para TypeScript.

## Como correr

```bash
npm install
npm run dev
```

Abrir o URL indicado no terminal (geralmente `http://localhost:5173`).

```bash
npm run build   # verificação TypeScript + build
```

## Rotas

| Path | Página |
|------|--------|
| `/` | Menu |
| `/competitive` | Busca competitiva (Gomoku + Minimax α-β) |
| `/genetic` | Busca genética (AG steady-state) |
| `/documentation` | Créditos e documentação |

## Algoritmos

Portados de `Trabalho unidade 3/algorithms/` (Python → TypeScript strict).

```
src/algorithms/
├── gomoku/
│   ├── constants.ts    # BOARD_SIZE, scores, depth
│   ├── board.ts        # jogadas legais, vitória, apply/undo
│   ├── evaluate.ts     # heurística por padrões
│   ├── minimax.ts      # Minimax + α-β + getBestMove
│   └── searchTrace.ts  # LOG textual da busca
└── genetic/
    ├── constants.ts    # POPULATION_SIZE, CHROMOSOME_SIZE, …
    ├── fitness.ts      # calcularAptidao
    ├── operators.ts    # torneio, cruzamento, mutação, reparo
    └── ga.ts           # executarGeracao (1 geração)
```

- **Gomoku:** `src/game/gomokuState.ts`, worker `src/workers/minimax.worker.ts`, hook `src/hooks/useGomokuGame.ts`
- **Genético:** hook `src/hooks/useGeneticGame.ts`

## Mapa de pastas

```
src/
├── main.tsx, App.tsx
├── routes/index.tsx
├── pages/
├── components/
├── algorithms/     # motores (ver acima)
├── game/
├── workers/
├── hooks/          # useGomokuGame, useGeneticGame
├── types/
├── utils/
├── data/mocks.ts   # textos iniciais de LOG / guia
└── styles/
```

## Stack

React 18+, TypeScript (strict), Vite, react-router-dom, Web Worker (Minimax), CSS Modules + tokens globais.
