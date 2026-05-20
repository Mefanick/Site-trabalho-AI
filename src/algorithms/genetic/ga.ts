// Portado de: algorithms/genetic/ga.py

import { MAX_FITNESS, POPULATION_SIZE } from './constants';
import { calcularAptidao, validarSequenciaSecreta } from './fitness';
import {
  cruzamento,
  formatarLista,
  indiceMelhor,
  indicePiorSubstituivel,
  mutacao,
  normalizarIndividuo,
  repararCromossomo,
  torneio,
} from './operators';
import type { Individuo, ResultadoGeracao } from '../../types/genetic';

export function executarGeracao(
  populacao: (Individuo | number[])[],
  sequenciaSecreta: number[],
): ResultadoGeracao {
  const segredo = validarSequenciaSecreta(sequenciaSecreta);

  if (populacao.length !== POPULATION_SIZE) {
    throw new Error(
      `populacao deve ter ${POPULATION_SIZE} indivíduos (recebido ${populacao.length}).`,
    );
  }

  const pop = populacao.map((ind) => normalizarIndividuo(ind, segredo));
  const linhasLog: string[] = [];

  for (const ind of pop) {
    ind.aptidao = calcularAptidao(ind.numeros, segredo);
  }
  const melhorAntes = pop[indiceMelhor(pop)];
  linhasLog.push(
    `[Avaliação] População avaliada. Melhor atual: aptidão ${melhorAntes.aptidao} (${formatarLista(melhorAntes.numeros)}).`,
  );

  const pai1 = torneio(pop);
  const pai2 = torneio(pop);
  linhasLog.push(
    `[Seleção] Torneio k=2 — Pai 1 aptidão ${pai1.aptidao} (${formatarLista(pai1.numeros)}); Pai 2 aptidão ${pai2.aptidao} (${formatarLista(pai2.numeros)}).`,
  );

  const filhoBruto = cruzamento(pai1.numeros, pai2.numeros);
  linhasLog.push(
    `[Cruzamento] Filho bruto: 5 primeiros do Pai 1 + 5 últimos do Pai 2 → ${formatarLista(filhoBruto)}.`,
  );

  const filhoReparado = repararCromossomo(filhoBruto);
  linhasLog.push(
    `[Reparo] Duplicatas removidas e lacunas preenchidas; ordenado → ${formatarLista(filhoReparado)}.`,
  );

  const [filhoMutado, posMut, valNovo] = mutacao(filhoReparado);
  let filhoFinalNums: number[];
  if (posMut !== null && valNovo !== null) {
    linhasLog.push(
      `[Mutação] Posição ${posMut + 1}: substituído por ${valNovo}; lista → ${formatarLista(filhoMutado)}.`,
    );
    filhoFinalNums = filhoMutado;
  } else {
    linhasLog.push('[Mutação] Nenhuma mutação aplicada.');
    filhoFinalNums = filhoReparado;
  }

  const aptidaoFilho = calcularAptidao(filhoFinalNums, segredo);
  const filho: Individuo = { numeros: filhoFinalNums, aptidao: aptidaoFilho };

  const idxMelhor = indiceMelhor(pop);
  const idxSubst = indicePiorSubstituivel(pop);
  const substituido = pop[idxSubst];

  if (substituido.grupo !== undefined) filho.grupo = substituido.grupo;
  if (substituido.individuo !== undefined) filho.individuo = substituido.individuo;

  pop[idxSubst] = filho;

  linhasLog.push(
    `[Substituição] Filho aptidão ${aptidaoFilho} substituiu o pior (aptidão ${substituido.aptidao}, ${formatarLista(substituido.numeros)}). Melhor global (aptidão ${pop[idxMelhor].aptidao}) preservado.`,
  );

  const melhorDepois = pop[indiceMelhor(pop)];
  linhasLog.push(
    `[Avaliação] Fim da geração — melhor indivíduo aptidão ${melhorDepois.aptidao} (${formatarLista(melhorDepois.numeros)}).`,
  );

  if (melhorDepois.aptidao === MAX_FITNESS) {
    linhasLog.push('[Objetivo] Solução encontrada (10/10 acertos).');
  }

  const mutacaoTxt =
    posMut !== null && valNovo !== null ? `pos ${posMut + 1}->${valNovo}` : 'sem mutacao';
  const logResumido =
    `Sel apt ${pai1.aptidao}/${pai2.aptidao} | Filho apt ${aptidaoFilho} (${mutacaoTxt}) | Subst pior apt ${substituido.aptidao} | Melhor pop ${melhorDepois.aptidao}/10`;

  return {
    novaPopulacao: pop.map((ind) => ({ ...ind, numeros: [...ind.numeros] })),
    melhorIndividuo: { ...melhorDepois, numeros: [...melhorDepois.numeros] },
    log: linhasLog.join('\n'),
    logResumido,
  };
}
