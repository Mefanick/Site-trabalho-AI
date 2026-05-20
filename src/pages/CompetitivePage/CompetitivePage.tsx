import { CompetitiveControls } from '../../components/competitive/CompetitiveControls/CompetitiveControls';
import { GomokuBoard } from '../../components/competitive/GomokuBoard/GomokuBoard';
import { SearchLogPanel } from '../../components/competitive/SearchLogPanel/SearchLogPanel';
import { PageHeader } from '../../components/layout/PageHeader/PageHeader';
import { useGomokuGame } from '../../hooks/useGomokuGame';
import styles from './CompetitivePage.module.css';

export function CompetitivePage() {
  const game = useGomokuGame();

  return (
    <div className={styles.page}>
      <PageHeader title="Busca competitiva" />
      <div className={styles.body}>
        <div className={styles.left}>
          <GomokuBoard
            board={game.board}
            onCellClick={game.playHumanMove}
            inputEnabled={game.inputEnabled}
            lastAiCell={game.lastAiCell}
            gameOver={game.gameOver}
          />
          <CompetitiveControls
            onSimulateAiVsAi={game.simulateAiVsAi}
            onSimulateSmartVsNormal={game.simulateSmartVsNormal}
            onReset={game.resetGame}
          />
        </div>
        <div className={styles.right}>
          <SearchLogPanel status={game.logStatus} logText={game.logText} />
        </div>
      </div>
    </div>
  );
}
