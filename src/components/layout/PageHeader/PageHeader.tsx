import { useNavigate } from 'react-router-dom';
import { WireButton } from '../../ui/WireButton/WireButton';
import styles from './PageHeader.module.css';

export interface PageHeaderProps {
  title: string;
  backTo?: string;
}

export function PageHeader({ title, backTo = '/' }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <WireButton size="sm" onClick={() => navigate(backTo)}>
        voltar
      </WireButton>
    </header>
  );
}
