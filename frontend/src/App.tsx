import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TwinProvider } from './context/TwinContext';
import { Header } from './components/common/Header';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { TwinPage } from './pages/TwinPage';
import { SimulationLabPage } from './pages/SimulationLabPage';
import { BatchesPage } from './pages/BatchesPage';
import { BatchPassportPage } from './pages/BatchPassportPage';
import { TraceabilityPage } from './pages/TraceabilityPage';
import { InsightsPage } from './pages/InsightsPage';
import { KnowledgeHubPage } from './pages/KnowledgeHubPage';

const AppLayout: React.FC = () => {
  const location = useLocation();
  // When viewing a specific batch digital passport (e.g. from scanning a QR code on a phone),
  // hide the complex facility control header and tabs so the user only sees that batch's details!
  const isPassportRoute = location.pathname.startsWith('/batch/');

  return (
    <div className={`app-container ${isPassportRoute ? 'passport-mode' : ''}`}>
      {!isPassportRoute && <Header />}
      <main className={`main-content ${isPassportRoute ? 'passport-main' : ''}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/twin" element={<TwinPage />} />
          <Route path="/simulation" element={<SimulationLabPage />} />
          <Route path="/batches" element={<BatchesPage />} />
          <Route path="/batch/:id" element={<BatchPassportPage />} />
          <Route path="/traceability" element={<TraceabilityPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/knowledge" element={<KnowledgeHubPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TwinProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TwinProvider>
  );
};

export default App;

