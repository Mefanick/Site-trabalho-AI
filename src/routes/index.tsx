import { Route, Routes } from 'react-router-dom';
import { CompetitivePage } from '../pages/CompetitivePage/CompetitivePage';
import { DocumentationPage } from '../pages/DocumentationPage/DocumentationPage';
import { GeneticPage } from '../pages/GeneticPage/GeneticPage';
import { MenuPage } from '../pages/MenuPage/MenuPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/competitive" element={<CompetitivePage />} />
      <Route path="/genetic" element={<GeneticPage />} />
      <Route path="/documentation" element={<DocumentationPage />} />
    </Routes>
  );
}
