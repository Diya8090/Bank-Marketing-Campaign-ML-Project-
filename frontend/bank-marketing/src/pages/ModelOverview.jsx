import { useState, useEffect } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  TrendingUp, 
  Database, 
  Sliders, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  Info
} from 'lucide-react';
import { getModelInfo } from '../services/api';

export default function ModelOverview() {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getModelInfo();
      setModelInfo(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="loading-state card-panel">
        <Loader2 size={32} className="icon-spin text-indigo" />
        <p>Loading Model Architecture & Metadata...</p>
      </div>
    );
  }

  return (
    <div className="model-overview-page">
      {/* Page Header */}
      <div className="panel-header card-panel">
        <div className="header-left">
          <div className="header-icon-box">
            <Cpu size={22} />
          </div>
          <div>
            <h2>Model Overview & Architecture</h2>
            <p className="subtitle">Scikit-Learn Logistic Regression Pipeline Evaluation & Pipeline Specifications</p>
          </div>
        </div>
      </div>

      {/* KPI Performance Cards */}
      <div className="metrics-banner-grid">
        <div className="eda-metric-card card-panel glowing-border">
          <span className="metric-tag tag-primary">ACCURACY</span>
          <div className="metric-big-val">{modelInfo ? `${modelInfo.accuracy}%` : '94.12%'}</div>
          <div className="metric-subtext">Overall Classification Accuracy</div>
        </div>

        <div className="eda-metric-card card-panel">
          <span className="metric-tag tag-emerald">ROC-AUC</span>
          <div className="metric-big-val">{modelInfo ? `${modelInfo.roc_auc}%` : '78.39%'}</div>
          <div className="metric-subtext">Area Under ROC Curve</div>
        </div>

        <div className="eda-metric-card card-panel">
          <span className="metric-tag tag-amber">PRECISION</span>
          <div className="metric-big-val">{modelInfo ? `${modelInfo.precision}%` : '33.33%'}</div>
          <div className="metric-subtext">Positive Class 1 Precision</div>
        </div>

        <div className="eda-metric-card card-panel">
          <span className="metric-tag tag-purple">F1 SCORE</span>
          <div className="metric-big-val">{modelInfo ? `${modelInfo.f1_score}%` : '0.60%'}</div>
          <div className="metric-subtext">Harmonic Mean Precision-Recall</div>
        </div>
      </div>

      {/* Visual Pipeline Architecture Diagram */}
      <div className="card-panel pipeline-flow-section">
        <div className="section-title-box">
          <Layers size={18} className="text-indigo" />
          <h3>End-to-End Scikit-Learn Pipeline Architecture</h3>
        </div>

        <div className="visual-flow-container">
          <div className="flow-step-node">
            <div className="node-icon bg-indigo">
              <Database size={20} />
            </div>
            <span className="node-label">1. Customer Input</span>
            <span className="node-desc">Age, Balance, Duration, Campaign</span>
          </div>

          <div className="flow-arrow"><ArrowRight size={20} /></div>

          <div className="flow-step-node">
            <div className="node-icon bg-amber">
              <ShieldCheck size={20} />
            </div>
            <span className="node-label">2. FastAPI Pydantic</span>
            <span className="node-desc">Validation & Range Checks</span>
          </div>

          <div className="flow-arrow"><ArrowRight size={20} /></div>

          <div className="flow-step-node">
            <div className="node-icon bg-purple">
              <Sliders size={20} />
            </div>
            <span className="node-label">3. StandardScaler</span>
            <span className="node-desc">Z-score normalization: $(x - \mu)/\sigma$</span>
          </div>

          <div className="flow-arrow"><ArrowRight size={20} /></div>

          <div className="flow-step-node">
            <div className="node-icon bg-emerald">
              <Cpu size={20} />
            </div>
            <span className="node-label">4. Logistic Regression</span>
            <span className="node-desc">$z = \beta_0 + \sum \beta_i x_i$</span>
          </div>

          <div className="flow-arrow"><ArrowRight size={20} /></div>

          <div className="flow-step-node">
            <div className="node-icon bg-indigo">
              <CheckCircle2 size={20} />
            </div>
            <span className="node-label">5. Sigmoid Probability</span>
            <span className="node-desc">Decision: SUBSCRIBED ≥ 50%</span>
          </div>
        </div>
      </div>

      {/* Technical Specifications Table */}
      <div className="card-panel spec-details-section">
        <div className="section-title-box">
          <Info size={18} className="text-indigo" />
          <h3>Technical Model Specifications</h3>
        </div>

        <div className="table-responsive">
          <table className="eda-summary-table">
            <tbody>
              <tr>
                <td><strong>Algorithm Name</strong></td>
                <td>{modelInfo?.algorithm || 'Logistic Regression'}</td>
              </tr>
              <tr>
                <td><strong>Pipeline Construction</strong></td>
                <td><code>sklearn.pipeline.Pipeline([('scaler', StandardScaler()), ('model', LogisticRegression(C=1.0, random_state=42))])</code></td>
              </tr>
              <tr>
                <td><strong>Preprocessing Scaler</strong></td>
                <td>{modelInfo?.preprocessing || 'StandardScaler (Z-score Normalization)'}</td>
              </tr>
              <tr>
                <td><strong>Model Features ({modelInfo?.features?.length})</strong></td>
                <td>
                  <div className="tags-flex">
                    {modelInfo?.features?.map((f, i) => (
                      <span key={i} className="mini-badge badge-primary">{f}</span>
                    ))}
                  </div>
                </td>
              </tr>
              <tr>
                <td><strong>Cleaned Dataset Sample</strong></td>
                <td>{modelInfo?.cleaned_sample_rows?.toLocaleString()} rows (Post-IQR Outlier Filtering)</td>
              </tr>
              <tr>
                <td><strong>Train / Test Split Ratio</strong></td>
                <td>80% Training ({modelInfo?.training_rows?.toLocaleString()} rows) / 20% Testing ({modelInfo?.test_rows?.toLocaleString()} rows)</td>
              </tr>
              <tr>
                <td><strong>Random Seed</strong></td>
                <td><code>random_state = 42</code> (Stratified Partitioning)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
