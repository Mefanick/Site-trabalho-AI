import { useState } from 'react';
import { GeneticAlgoPanel } from '../../components/genetic/GeneticAlgoPanel/GeneticAlgoPanel';
import { GeneticGuideModal } from '../../components/genetic/GeneticGuideModal/GeneticGuideModal';
import { GeneticLogViewerModal } from '../../components/genetic/GeneticLogViewerModal/GeneticLogViewerModal';
import { GeneticTable } from '../../components/genetic/GeneticTable/GeneticTable';
import { ListCreator } from '../../components/genetic/ListCreator/ListCreator';
import { NumberStrip } from '../../components/genetic/NumberStrip/NumberStrip';
import { PageHeader } from '../../components/layout/PageHeader/PageHeader';
import { WireButton } from '../../components/ui/WireButton/WireButton';
import { useGeneticGame } from '../../hooks/useGeneticGame';
import styles from './GeneticPage.module.css';

export function GeneticPage() {
  const g = useGeneticGame();
  const [guideOpen, setGuideOpen] = useState(false);
  const [logViewerOpen, setLogViewerOpen] = useState(false);

  return (
    <div className={styles.page}>
      <PageHeader title="Busca genética" />

      <section className={styles.zoneA}>
        <WireButton size="sm" className={styles.guiaBtn} onClick={() => setGuideOpen(true)}>
          guia
        </WireButton>
        <div className={styles.popCenter}>
          <h2 className={styles.zoneTitle}>população inicial</h2>
          <NumberStrip
            selected={g.secretSelection}
            onChange={g.setSecretSelection}
            maxSelection={10}
            cellSize="md"
          />
          <p className={styles.legend}>selecione a população secreta</p>
        </div>
        <WireButton size="sm" className={styles.gerarBtn} onClick={g.gerarAleatorioSecret}>
          Gerar Aleatóriamente
        </WireButton>
      </section>

      <div className={styles.zoneB}>
        <div className={styles.colLeft}>
          <h3 className={styles.subTitle}>tabela (arquivo de grupos)</h3>
          <GeneticTable rows={g.mainTableRows} variant="main" />
          <h3 className={styles.subTitle}>melhor indivíduo</h3>
          <GeneticTable rows={[g.displayBestRow]} variant="best" />
        </div>
        <div className={styles.colRight}>
          <ListCreator
            draftSelection={g.draftSelection}
            onDraftChange={g.setDraftSelection}
            draftRow={g.draftRow}
            insufficient={g.draftSelection.length < 10}
            onEnviar={g.enviar}
            onGerarAleatorio={g.gerarAleatorioDraft}
            onProximoPasso={g.proximoPasso}
            onExecutar={g.executarAteSolucao}
            algoRunning={g.algoRunning}
          />
          <GeneticAlgoPanel
            speed={g.speed}
            onSpeedChange={g.setSpeed}
            logStatus={g.logStatus}
            logResumo={g.logResumo}
            onExpandLog={() => setLogViewerOpen(true)}
            onClear={g.limparLogLista}
            onReset={g.resetarAG}
            algoRunning={g.algoRunning}
          />
        </div>
      </div>

      <GeneticGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
      <GeneticLogViewerModal
        open={logViewerOpen}
        onClose={() => setLogViewerOpen(false)}
        entries={g.logHistory}
      />
    </div>
  );
}
