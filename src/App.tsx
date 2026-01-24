import { useState, useEffect } from 'react';
import LoginPageFixed from './components/LoginPage';
import LandingPage from './components/LandingPage';
import WelcomePage from './components/WelcomePage';
import Dashboard from './components/Dashboard';
import FieldEmployeeDashboard from './components/FieldEmployeeDashboard';
import ReportSubmission from './components/ReportSubmission';
import MyReports from './components/MyReports';
import FieldReportsInbox from './components/FieldReportsInbox';
import ContainmentControl from './components/ContainmentControl';
import ContainmentImpactSimulator from './components/ContainmentImpactSimulator';
import ReportsPage from './components/ReportsPage';
import ProfilePage from './components/ProfilePage';
import VisualIntelligence from './components/VisualIntelligence';
import ImageDetection from './components/ImageDetection';
import EnhancedImageDetection from './components/EnhancedImageDetection';
import EnhancedAnalysis from './components/EnhancedAnalysis';
import SupplyChainMonitor from './components/SupplyChainMonitor';
import NationalCropDiseaseRiskTable from './components/NationalCropDiseaseRiskTable';
import RewardsSystem from './components/RewardsSystem';
import HelpSupport from './components/HelpSupport';
import TransportAdvisory from './components/TransportAdvisory';
import AIGuidePage from './components/AIGuidePage';
import Layout from './components/Layout';
import authService from './api/auth';
import ContainmentFatigueMonitorWorking from './components/ContainmentFatigueMonitorWorking';
import NotificationsPage from './components/NotificationsPage';
import './styles/transitions.css';

type Page = 'landing' | 'login' | 'welcome' | 'dashboard' | 'field-dashboard' | 'report-submission' | 'my-reports' | 'field-reports-inbox' | 'containment' | 'containment-simulator' | 'reports' | 'profile' | 'visual' | 'enhanced-image-detection' | 'enhanced-analysis' | 'supply-chain' | 'risk-table' | 'help-support' | 'transport-advisory' | 'rewards' | 'fatigue-monitor' | 'notifications' | 'ai-guide';

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
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastLogin, setLastLogin] = useState<Date | null>(null);
  const [userRole, setUserRole] = useState<'officer' | 'field-employee'>('officer');
  const [officerData, setOfficerData] = useState<OfficerData | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');

  // Check authentication status on mount - ALWAYS show landing page first
  useEffect(() => {
    console.log('App mounted - showing landing page first');
    // Always clear any stored authentication on app start
    authService.logout();
    setIsAuthenticated(false);
    setCurrentPage('landing');
    setOfficerData(null);
  }, []);

  const handleProceedToLogin = () => {
    setCurrentPage('login');
  };

  const handleLogin = (role: 'officer' | 'field-employee') => {
    // Get user data from localStorage (where LoginPage now stores it)
    const storedUser = localStorage.getItem('agripulse_user');
    const userData = storedUser ? JSON.parse(storedUser) : null;
    
    if (userData) {
      setUserRole(role);
      setOfficerData({
        name: userData.name,
        designation: userData.designation,
        region: userData.region,
        employeeId: userData.employeeId || '',
        department: userData.department || '',
        email: userData.email || '',
        phone: userData.phone || '',
        joinDate: userData.joinDate || ''
      });
      setIsAuthenticated(true);
      setLastLogin(new Date());
      
      if (role === 'field-employee') {
        setCurrentPage('field-dashboard');
      } else {
        // Go to welcome page first for officers
        setCurrentPage('welcome');
      }
    }
  };

  const handleLogout = () => {
    console.log('App: handleLogout called');
    // Clear both auth service and localStorage
    authService.logout();
    localStorage.removeItem('agripulse_user');
    localStorage.removeItem('agripulse_token');
    
    setIsAuthenticated(false);
    setLastLogin(null);
    setOfficerData(null);
    setCurrentPage('login');
    console.log('App: logout completed, redirected to login');
  };

  const handleNavigation = (page: Page) => {
    // Determine transition direction based on page hierarchy
    const pageHierarchy: { [key in Page]: number } = {
      'landing': 0,
      'login': 1,
      'welcome': 2,
      'dashboard': 3,
      'field-dashboard': 3,
      'containment': 4,
      'containment-simulator': 4,
      'fatigue-monitor': 4,
      'visual': 4,
      'supply-chain': 4,
      'enhanced-image-detection': 4,
      'enhanced-analysis': 4,
      'reports': 4,
      'ai-guide': 4,
      'profile': 4,
      'report-submission': 4,
      'my-reports': 4,
      'field-reports-inbox': 4,
      'risk-table': 4,
      'help-support': 4,
      'transport-advisory': 4,
      'rewards': 4,
      'notifications': 4
    };

    const currentLevel = pageHierarchy[currentPage];
    const targetLevel = pageHierarchy[page];
    
    setTransitionDirection(targetLevel > currentLevel ? 'forward' : 'backward');
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentPage(page);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  };

  if (!isAuthenticated) {
    if (currentPage === 'landing') {
      return (
        <div className="fade-in">
          <LandingPage onProceedToLogin={handleProceedToLogin} />
        </div>
      );
    }
    return (
      <div className="fade-in">
        <LoginPageFixed onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={handleNavigation}
      officerData={officerData!}
      lastLogin={lastLogin}
      onLogout={handleLogout}
      userRole={userRole}
    >
      <div key={currentPage} className={`page-transition ${isTransitioning ? 'transitioning' : ''} ${transitionDirection === 'forward' ? 'slide-in-right' : 'slide-in-left'}`}>
        {currentPage === 'welcome' && <WelcomePage onContinue={() => setCurrentPage('dashboard')} />}
        {currentPage === 'dashboard' && (
          <Dashboard 
            onNavigateToContainment={() => setCurrentPage('containment')}
            onNavigateToVisual={() => setCurrentPage('visual')}
            onNavigateToSupplyChain={() => setCurrentPage('supply-chain')}
            onNavigateToImageDetection={() => setCurrentPage('image-detection')}
            onNavigateToEnhancedImageDetection={() => setCurrentPage('enhanced-image-detection')}
            onNavigateToEnhancedAnalysis={() => setCurrentPage('enhanced-analysis')}
            onNavigateToRiskTable={() => setCurrentPage('risk-table')}
            onNavigateToFieldReportsInbox={() => setCurrentPage('field-reports-inbox')}
          />
        )}
        {currentPage === 'field-dashboard' && (
          <FieldEmployeeDashboard 
            onNavigateToReportSubmission={() => {
              console.log('App: Navigating to report submission');
              setCurrentPage('report-submission');
            }}
            onNavigateToMyReports={() => {
              console.log('App: Navigating to my reports');
              setCurrentPage('my-reports');
            }}
          />
        )}
        {currentPage === 'report-submission' && (
          <ReportSubmission onBack={() => setCurrentPage('field-dashboard')} />
        )}
        {currentPage === 'my-reports' && (
          <MyReports onBack={() => setCurrentPage('field-dashboard')} />
        )}
        {currentPage === 'transport-advisory' && <TransportAdvisory employeeVillages={['Village A', 'Village B', 'Village C']} />}
        {currentPage === 'field-reports-inbox' && (
          <FieldReportsInbox 
            onBack={() => setCurrentPage('dashboard')} 
            onNavigate={(page: string) => {
              // Convert string page to Page type if it matches known pages
              if (page === 'containment' || page === 'visual' || page === 'supply-chain') {
                setCurrentPage(page as Page);
              }
            }} 
          />
        )}
        {currentPage === 'containment' && <ContainmentControl />}
        {currentPage === 'containment-simulator' && <ContainmentImpactSimulator />}
        {currentPage === 'visual' && <VisualIntelligence />}
        {currentPage === 'enhanced-image-detection' && <EnhancedImageDetection />}
        {currentPage === 'enhanced-analysis' && <EnhancedAnalysis />}
        {currentPage === 'supply-chain' && <SupplyChainMonitor />}
        {currentPage === 'risk-table' && <NationalCropDiseaseRiskTable />}
        {currentPage === 'fatigue-monitor' && <ContainmentFatigueMonitorWorking />}
        {currentPage === 'notifications' && <NotificationsPage onBack={() => setCurrentPage('dashboard')} />}
        {currentPage === 'reports' && <ReportsPage />}
        {currentPage === 'help-support' && <HelpSupport onBack={() => setCurrentPage('field-dashboard')} />}
        {currentPage === 'rewards' && <RewardsSystem employeeName="Field Employee" />}
        {currentPage === 'ai-guide' && <AIGuidePage onBack={() => setCurrentPage('dashboard')} />}
        {currentPage === 'profile' && <ProfilePage officerData={officerData!} lastLogin={lastLogin} onLogout={handleLogout} role={userRole} />}
      </div>
    </Layout>
  );
}