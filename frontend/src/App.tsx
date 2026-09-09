import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

export const App: React.FC = () => {
  return (
    <TwinProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <main className="main-content">
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
      </BrowserRouter>
    </TwinProvider>
  );
};

export default App;
