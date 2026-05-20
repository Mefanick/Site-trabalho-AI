import { GENETIC_GUIDE_TEXT } from '../../../data/mocks';
import { Modal } from '../../ui/Modal/Modal';
import styles from './GeneticGuideModal.module.css';

export interface GeneticGuideModalProps {
  open: boolean;
  onClose: () => void;
}

export function GeneticGuideModal({ open, onClose }: GeneticGuideModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Guia de utilização">
      <pre className={styles.text}>{GENETIC_GUIDE_TEXT}</pre>
    </Modal>
  );
}
