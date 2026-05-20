import { useNavigate } from 'react-router-dom';
import { WireButton } from '../../components/ui/WireButton/WireButton';
import styles from './MenuPage.module.css';

export function MenuPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>Trabalho Unidade 3</h1>
      </div>
      <nav className={styles.nav}>
        <WireButton width={320} size="lg" onClick={() => navigate('/competitive')}>
          Busca competitiva
        </WireButton>
        <WireButton width={320} size="lg" onClick={() => navigate('/genetic')}>
          Busca genética
        </WireButton>
        <WireButton width={320} size="lg" onClick={() => navigate('/documentation')}>
          Créditos e documentação
        </WireButton>
      </nav>
      <footer className={styles.footer}>
        Autores: Nicolas Voigt, Ian Gabriel da Luz Franz e João Victor Batschauer
      </footer>
    </div>
  );
}
