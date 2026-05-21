import { PageHeader } from '../../components/layout/PageHeader/PageHeader';
import styles from './DocumentationPage.module.css';

export function DocumentationPage() {
  return (
    <div className={styles.page}>
      <PageHeader title="Créditos e documentação" />
      <article className={styles.content}>
        <section>
          <h2>Introdução</h2>
          <p>
            Aplicação educativa «Trabalho Unidade 3» com estilo wireframe/terminal (fundo
            branco, bordas pretas grossas, tipografia monoespaçada na interface). Inclui dois
            módulos de busca: competitiva (Gomoku + Minimax) e genética (AG steady-state).
            Esta versão web reproduz o layout; os algoritmos podem ser ligados depois via stubs.
          </p>
        </section>

        <section>
          <h2>Busca competitiva</h2>
          <p className={styles.lead}>
            Jogo: Gomoku 10×10 (cinco em linha). O jogador usa X; a IA usa O.
          </p>
          <ul>
            <li>
              <strong>Interface:</strong> tabuleiro à esquerda; LOG Minimax alfa-beta à direita
              com estado «aguardando» até a primeira jogada.
            </li>
            <li>
              <strong>LOG:</strong> por turno — jogadas legais, profundidade, candidatos na raiz,
              podas alfa-beta e jogada escolhida (texto resumido).
            </li>
            <li>
              <strong>Botões:</strong> simular IA vs IA; resetar jogo (limpa tabuleiro e LOG inicial).
            </li>
            <li>Última jogada da IA destacada a amarelo no tabuleiro.</li>
          </ul>
        </section>

        <section>
          <h2>Busca genética</h2>
          <p className={styles.lead}>
            Objetivo: encontrar a sequência secreta de 10 números distintos entre 1 e 20.
          </p>
          <ul>
            <li>
              <strong>População inicial:</strong> faixa 1–20 no topo; selecione até 10 números
              (amarelo). Botão «Gerar Aleatoriamente» e «guia» de utilização.
            </li>
            <li>
              <strong>Criador de listas:</strong> segunda faixa; rascunho G1/A; «enviar» com 10
              números; aviso «Números Insuficientes» se &lt; 10.
            </li>
            <li>
              <strong>Tabela (esquerda):</strong> histórico de grupos/indivíduos; «melhor
              indivíduo» com uma linha (aptidão «?» até haver dados).
            </li>
            <li>
              <strong>Algoritmo (direita):</strong> AG steady-state mock — torneio k=2, crossover
              5+5, mutação, elitismo; velocidades Lento/Normal/Rápido/Turbo.
            </li>
            <li>
              <strong>Controlos:</strong> «Próximo passo», «Executar até solução», «expandir»
              (LOG completo com Anterior/Próximo), «Limpar log e lista», «Resetar AG».
            </li>
          </ul>
        </section>

        <section>
          <h2>Autores</h2>
          <ul className={styles.authors}>
            <li>Nicolas Voigt</li>
            <li>Ian Gabriel da Luz Franz</li>
            <li>João Victor Batschauer</li>
          </ul>
        </section>
      </article>
    </div>
  );
}
