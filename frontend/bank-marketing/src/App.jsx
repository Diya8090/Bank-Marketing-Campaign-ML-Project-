import { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Sliders, 
  BarChart3, 
  History,
  LayoutDashboard,
  Cpu,
  Info,
  Activity
} from 'lucide-react';

import DashboardOverview from './pages/DashboardOverview';
import PredictionCard from './components/PredictionCard';
import Analytics from './pages/Analytics';
import ModelsAndEvaluation from './pages/ModelsAndEvaluation';
import HistoryView from './components/HistoryView';
import AboutProject from './pages/AboutProject';

import { healthCheck, API_BASE_URL } from './services/api';
import './App.css';

const LOCAL_STORAGE_KEY = 'bankMarketingPredictionHistory';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [backendStatus, setBackendStatus] = useState({ online: false, modelLoaded: false });

  // Initialize prediction history from localStorage
  const [predictionHistory, setPredictionHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse localStorage history:", e);
      return [];
    }
  });

  // Apply Theme attribute on root html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check backend health status on mount
  useEffect(() => {
    async function checkStatus() {
      const res = await healthCheck();
      if (res && res.status === 'ok') {
        setBackendStatus({ online: true, modelLoaded: res.model_loaded });
      } else {
        setBackendStatus({ online: false, modelLoaded: false });
      }
    }
    checkStatus();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSavePrediction = (newRecord) => {
    const updated = [newRecord, ...predictionHistory];
    setPredictionHistory(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save prediction to localStorage:", e);
    }
  };

  const handleClearHistory = () => {
    setPredictionHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear localStorage:", e);
    }
  };

  return (
    <div className="app-container">
      {/* Header Bar */}
      <header className="app-navbar">
        <div className="brand-section">
          <div className="brand-logo-wrap">
            <Building2 size={24} />
          </div>
          <div className="brand-text">
            <h1>DepositIQ AI</h1>
            <p>Term Deposit Subscription & Predictive Lead Intelligence Engine</p>
          </div>
        </div>

        <div className="nav-actions">
          <div className={`model-pill-badge ${backendStatus.online ? '' : 'badge-offline'}`}>
            <Activity size={16} />
            <span>
              {backendStatus.online 
                ? 'Backend: Online • Model: Loaded • API: Healthy' 
                : `Backend Offline (${API_BASE_URL})`}
            </span>
          </div>

          <button 
            type="button" 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* SINGLE GLOBAL NAVBAR */}
      <nav className="tabs-navigation">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={17} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'predict' ? 'active' : ''}`}
          onClick={() => setActiveTab('predict')}
        >
          <Sliders size={17} />
          <span>Predict</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={17} />
          <span>Analytics</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'models' ? 'active' : ''}`}
          onClick={() => setActiveTab('models')}
        >
          <Cpu size={17} />
          <span>Models & Evaluation</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={17} />
          <span>History</span>
          {predictionHistory.length > 0 && (
            <span className="tab-count">{predictionHistory.length}</span>
          )}
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          <Info size={17} />
          <span>About</span>
        </button>
      </nav>

      {/* Main Tab Content */}
      <main className="tab-content-container">
        {activeTab === 'dashboard' && (
          <DashboardOverview onNavigate={(tab) => setActiveTab(tab)} historyCount={predictionHistory.length} />
        )}

        {activeTab === 'predict' && (
          <PredictionCard onSavePrediction={handleSavePrediction} />
        )}

        {activeTab === 'analytics' && (
          <Analytics />
        )}

        {activeTab === 'models' && (
          <ModelsAndEvaluation />
        )}

        {activeTab === 'history' && (
          <HistoryView 
            history={predictionHistory} 
            onClearHistory={handleClearHistory} 
          />
        )}

        {activeTab === 'about' && (
          <AboutProject />
        )}
      </main>
    </div>
  );
}

export default App;
