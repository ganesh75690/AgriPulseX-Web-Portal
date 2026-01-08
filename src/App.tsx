import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import WelcomePage from './components/WelcomePage';
import Dashboard from './components/Dashboard';
import ContainmentControl from './components/ContainmentControl';
import ContainmentImpactSimulator from './components/ContainmentImpactSimulator';
import ReportsPage from './components/ReportsPage';
import ProfilePage from './components/ProfilePage';
import VisualIntelligence from './components/VisualIntelligence';
import ImageDetection from './components/ImageDetection';
import SupplyChainMonitor from './components/SupplyChainMonitor';
import Layout from './components/Layout';

type Page = 'login' | 'welcome' | 'dashboard' | 'containment' | 'containment-simulator' | 'reports' | 'profile' | 'visual' | 'image-detection' | 'supply-chain';

interface OfficerData {
  name: string;
  designation: string;
  region: string;
  employeeId: string;
  department: string;
  email: string;
  phone: string;
  joinDate: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastLogin, setLastLogin] = useState<Date | null>(null);

  const officerData: OfficerData = {
    name: 'Dr. Rajesh Kumar Sharma',
    designation: 'District Agriculture Officer',
    region: 'Punjab - Ludhiana District',
    employeeId: 'DAO-PB-2018-4523',
    department: 'Department of Agriculture & Farmers Welfare',
    email: 'rajesh.sharma@agri.gov.in',
    phone: '+91-161-2401234',
    joinDate: '2018-03-15'
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setLastLogin(new Date());
    setCurrentPage('welcome');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLastLogin(null);
    setCurrentPage('login');
  };

  const handleNavigation = (page: Page) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    return (
      <div className="fade-in">
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={handleNavigation}
      officerData={officerData}
      lastLogin={lastLogin}
      onLogout={handleLogout}
    >
      <div key={currentPage} className="fade-in">
        {currentPage === 'welcome' && <WelcomePage onContinue={() => setCurrentPage('dashboard')} />}
        {currentPage === 'dashboard' && (
          <Dashboard 
            onNavigateToContainment={() => setCurrentPage('containment')}
            onNavigateToVisual={() => setCurrentPage('visual')}
            onNavigateToSupplyChain={() => setCurrentPage('supply-chain')}
            onNavigateToImageDetection={() => setCurrentPage('image-detection')}
          />
        )}
        {currentPage === 'containment' && <ContainmentControl />}
        {currentPage === 'containment-simulator' && <ContainmentImpactSimulator />}
        {currentPage === 'visual' && <VisualIntelligence />}
        {currentPage === 'image-detection' && <ImageDetection />}
        {currentPage === 'supply-chain' && <SupplyChainMonitor />}
        {currentPage === 'reports' && <ReportsPage />}
        {currentPage === 'profile' && <ProfilePage officerData={officerData} lastLogin={lastLogin} onLogout={handleLogout} />}
      </div>
    </Layout>
  );
}