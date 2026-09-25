import { useState, useEffect } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Loader2, 
  Info, 
  AlertCircle,
  Award
} from 'lucide-react';
import { getModelComparison } from '../services/api';

export default function ModelComparison() {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getModelComparison();
      setComparisonData(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="loading-state card-panel">
        <Loader2 size={32} className="icon-spin text-indigo" />
        <p>Loading Model Experiment Comparison Data...</p>
      </div>
    );
  }

  const models = comparisonData?.models || [];

  return (
    <div className="model-comparison-page">
      {/* Page Header */}
      <div className="panel-header card-panel">
        <div className="header-left">
          <div className="header-icon-box">
            <Layers size={22} />
          </div>
          <div>
            <h2>Model Experimentation & Comparison</h2>
            <p className="subtitle">Evaluation across 6 Candidate Model Configurations (Stratified 80/20 Train-Test Split, random_state=42)</p>
          </div>
        </div>
      </div>

      {/* Selected Model Banner */}
      <div className="card-panel hero-mini-banner glowing-border">
        <div className="mini-banner-content">
          <div className="banner-icon">
            <Award size={28} className="text-emerald" />
          </div>
          <div>
            <h3>Production Selected Pipeline: <code>StandardScaler + LogisticRegression(C=1.0)</code></h3>
            <p>
              Provides standardized numerical stability (Z = (x - μ) / σ), reproducible seed (<code>random_state=42</code>), 
              and optimal log-odds interpretability with an ROC-AUC of <strong>78.39%</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Models Comparison Table */}
      <div className="card-panel comparison-table-section">
        <div className="section-title-box">
          <TrendingUp size={18} className="text-indigo" />
          <h3>Candidate Model Benchmarking Matrix</h3>
        </div>

        <div className="table-responsive">
          <table className="eda-summary-table comparison-table">
            <thead>
              <tr>
                <th>Model Configuration</th>
                <th>Features Used</th>
                <th>Accuracy</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1 Score</th>
                <th>ROC-AUC</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.id} className={model.isSelected ? 'selected-row' : ''}>
                  <td>
                    <div className="model-name-cell">
                      <strong>{model.name}</strong>
                      {model.isSelected && <span className="mini-badge badge-emerald">Selected</span>}
                    </div>
                  </td>
                  <td>
                    <div className="tags-flex">
                      {model.features.map((f, i) => (
                        <span key={i} className={`mini-badge ${f === 'duration' ? 'badge-amber' : 'badge-subtle'}`}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td><strong>{model.accuracy}%</strong></td>
                  <td>{model.precision}%</td>
                  <td>{model.recall}%</td>
                  <td>{model.f1_score}%</td>
                  <td><strong className="text-indigo">{model.roc_auc}%</strong></td>
                  <td>
                    {model.isSelected ? (
                      <span className="status-pill status-active">
                        <CheckCircle2 size={14} /> Active
                      </span>
                    ) : (
                      <span className="status-pill status-evaluated">Evaluated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Insights & Decision Rationale */}
      <div className="insights-grid">
        <div className="card-panel insight-card">
          <div className="insight-title">
            <Info size={18} className="text-indigo" />
            <h4>Why StandardScaler Scaling is Required</h4>
          </div>
          <p>
            Raw dataset features span vastly different scales: <code>balance</code> ranges from -$8,019 to $102,127 while <code>campaign</code> ranges from 1 to 63. 
            Without feature scaling, unstandardized gradient computations are skewed. Fitting a <code>StandardScaler</code> standardizes features to zero mean and unit variance (Z = (x - μ) / σ), producing reliable coefficient comparisons.
          </p>
        </div>

        <div className="card-panel insight-card">
          <div className="insight-title">
            <AlertCircle size={18} className="text-amber" />
            <h4>Pre-Call vs. In-Call Model Analysis</h4>
          </div>
          <p>
            The UCI dataset notes that <code>duration</code> is strongly correlated with campaign success but is measured <em>during/after</em> the phone call. 
            Evaluating a Pre-Call model without <code>duration</code> yields an ROC-AUC of <strong>62.74%</strong> (driven by balance and age). Documenting both models provides transparency into pre-call target screening versus post-call outcome prediction.
          </p>
        </div>
      </div>
    </div>
  );
}
