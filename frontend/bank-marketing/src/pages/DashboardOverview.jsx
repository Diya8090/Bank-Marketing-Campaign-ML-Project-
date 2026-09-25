import { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Cpu, 
  Database, 
  TrendingUp, 
  Sliders, 
  History, 
  BarChart3, 
  ArrowRight,
  Layers,
  Sparkles,
  PieChart
} from 'lucide-react';
import { getModelInfo } from '../services/api';

export default function DashboardOverview({ onNavigate, historyCount = 0 }) {
  const [modelData, setModelData] = useState(null);

  useEffect(() => {
    async function loadData() {
      const info = await getModelInfo();
      setModelData(info);
    }
    loadData();
  }, []);

  return (
    <div className="dashboard-page">
      {/* Top Hero Banner */}
      <div className="dashboard-hero card-panel glowing-border">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Bank Marketing Predictive System</span>
          </div>
          <h2>Term Deposit Subscription Predictive Intelligence Dashboard</h2>
          <p>
            An end-to-end Machine Learning platform powered by a Scikit-Learn 
            <strong> StandardScaler + Logistic Regression Pipeline</strong> evaluated on the UCI Bank Marketing dataset with 
            <strong> {modelData ? modelData.accuracy : '88.70'}% Accuracy</strong> and 
            <strong> {modelData ? modelData.roc_auc : '81.58'}% ROC-AUC Score</strong>.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn-primary-action" onClick={() => onNavigate('predict')}>
              <Sliders size={18} />
              <span>Launch Prediction Page</span>
              <ArrowRight size={18} />
            </button>

            <button type="button" className="btn-secondary-action" onClick={() => onNavigate('models')}>
              <Cpu size={18} />
              <span>Explore Models & Evaluation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="dashboard-stats-grid">
        <div className="stat-card card-panel">
          <div className="stat-top">
            <span className="stat-label">Model Accuracy</span>
            <ShieldCheck size={20} className="text-emerald" />
          </div>
          <div className="stat-val">{modelData ? `${modelData.accuracy}%` : '88.70%'}</div>
          <div className="stat-sub">Scikit-Learn Classifier Evaluation</div>
        </div>

        <div className="stat-card card-panel">
          <div className="stat-top">
            <span className="stat-label">ROC-AUC Score</span>
            <TrendingUp size={20} className="text-indigo" />
          </div>
          <div className="stat-val">{modelData ? `${modelData.roc_auc}%` : '81.58%'}</div>
          <div className="stat-sub">Area Under ROC Curve Metric</div>
        </div>

        <div className="stat-card card-panel">
          <div className="stat-top">
            <span className="stat-label">Total Campaign Records</span>
            <Database size={20} className="stat-icon text-amber" />
          </div>
          <div className="stat-val">{modelData ? modelData.dataset_rows.toLocaleString() : '45,211'}</div>
          <div className="stat-sub">UCI Bank Marketing Records</div>
        </div>

        <div className="stat-card card-panel">
          <div className="stat-top">
            <span className="stat-label">Saved Predictions</span>
            <History size={20} className="stat-icon text-purple" />
          </div>
          <div className="stat-val">{historyCount}</div>
          <div className="stat-sub">Local browser session log</div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="quick-links-grid">
        <div className="quick-link-card card-panel" onClick={() => onNavigate('predict')}>
          <div className="quick-link-icon text-indigo">
            <Sliders size={24} />
          </div>
          <h4>Interactive Customer Prediction</h4>
          <p>Input customer age, account balance, call duration, and contact frequency to predict term deposit subscription probabilities.</p>
          <span className="link-action">Make Prediction &rarr;</span>
        </div>

        <div className="quick-link-card card-panel" onClick={() => onNavigate('models')}>
          <div className="quick-link-icon text-emerald">
            <Layers size={24} />
          </div>
          <h4>Models & Evaluation Center</h4>
          <p>Inspect model architecture, StandardScaler preprocessing, ROC curve, confusion matrix, odds ratios, and benchmark experiments.</p>
          <span className="link-action">Open Models Hub &rarr;</span>
        </div>

        <div className="quick-link-card card-panel" onClick={() => onNavigate('analytics')}>
          <div className="quick-link-icon text-amber">
            <BarChart3 size={24} />
          </div>
          <h4>Exploratory Data Analytics</h4>
          <p>Examine full dataset distribution summaries, feature statistics, target class imbalance (88.3% vs 11.7%), and python notebook code.</p>
          <span className="link-action">Explore Analytics &rarr;</span>
        </div>
      </div>
    </div>
  );
}
