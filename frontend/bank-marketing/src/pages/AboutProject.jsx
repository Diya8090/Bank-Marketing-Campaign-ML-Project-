import { 
  Building2, 
  Cpu, 
  Database, 
  Code2, 
  Server, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function AboutProject() {
  return (
    <div className="about-project-page">
      {/* Page Header */}
      <div className="panel-header card-panel">
        <div className="header-left">
          <div className="header-icon-box">
            <Building2 size={22} />
          </div>
          <div>
            <h2>About the Bank Marketing ML Project</h2>
            <p className="subtitle">Term Deposit Subscription Prediction Platform & Technical Implementation Overview</p>
          </div>
        </div>
      </div>

      {/* Hero Overview */}
      <div className="card-panel hero-mini-banner glowing-border">
        <div className="mini-banner-content">
          <div className="banner-icon">
            <Sparkles size={28} className="text-indigo" />
          </div>
          <div>
            <h3>Project Objective</h3>
            <p>
              To build a production-grade machine learning pipeline and interactive web application that predicts whether a retail banking client 
              will subscribe to a <strong>term deposit (CD) campaign</strong> based on financial profiles, demographic factors, and contact campaign metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack Cards */}
      <div className="tech-stack-section">
        <div className="section-title-box card-panel header-title-only">
          <Code2 size={18} className="text-indigo" />
          <h3>Technology Stack Architecture</h3>
        </div>

        <div className="tech-grid">
          {/* Frontend Tech */}
          <div className="card-panel tech-card">
            <div className="tech-card-header">
              <Code2 size={22} className="text-indigo" />
              <h4>Frontend Workspace</h4>
            </div>
            <ul className="tech-list">
              <li><strong>Framework:</strong> React 18 + Vite</li>
              <li><strong>UI Design:</strong> Glassmorphism CSS Theme System</li>
              <li><strong>Iconography:</strong> Lucide React Icons</li>
              <li><strong>Theme Support:</strong> Dark / Light Mode Switcher</li>
              <li><strong>Persistence:</strong> LocalStorage History Log & JSON Export</li>
            </ul>
          </div>

          {/* Backend API */}
          <div className="card-panel tech-card">
            <div className="tech-card-header">
              <Server size={22} className="text-emerald" />
              <h4>Backend Inference Engine</h4>
            </div>
            <ul className="tech-list">
              <li><strong>Framework:</strong> FastAPI (Python 3.10+)</li>
              <li><strong>Server:</strong> Uvicorn ASGI Web Server</li>
              <li><strong>Validation:</strong> Pydantic BaseModels</li>
              <li><strong>Serialization:</strong> Joblib Binary Model Loading</li>
              <li><strong>CORS:</strong> FastAPI Middleware Integration</li>
            </ul>
          </div>

          {/* Machine Learning */}
          <div className="card-panel tech-card">
            <div className="tech-card-header">
              <Cpu size={22} className="text-amber" />
              <h4>Machine Learning Pipeline</h4>
            </div>
            <ul className="tech-list">
              <li><strong>Algorithm:</strong> Logistic Regression (Scikit-Learn)</li>
              <li><strong>Normalization:</strong> <code>StandardScaler</code> (Z-Score)</li>
              <li><strong>Pipeline:</strong> <code>sklearn.pipeline.Pipeline</code></li>
              <li><strong>Reproducibility:</strong> Stratified Split (<code>random_state=42</code>)</li>
              <li><strong>Artifacts:</strong> <code>trained_model.pkl</code>, Metadata JSON</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dataset Summary */}
      <div className="card-panel dataset-summary-card">
        <div className="section-title-box">
          <Database size={18} className="text-indigo" />
          <h3>Dataset & Preprocessing Specifications</h3>
        </div>

        <div className="table-responsive">
          <table className="eda-summary-table">
            <tbody>
              <tr>
                <td><strong>Dataset Source</strong></td>
                <td>UCI Machine Learning Repository — Bank Marketing Dataset</td>
              </tr>
              <tr>
                <td><strong>Original Rows</strong></td>
                <td>45,211 direct marketing campaign entries</td>
              </tr>
              <tr>
                <td><strong>Cleaned Rows (Post-IQR Outliers)</strong></td>
                <td>28,338 records (cleaned of extreme balance/duration outliers)</td>
              </tr>
              <tr>
                <td><strong>Train / Test Partition</strong></td>
                <td>22,670 Training rows (80%) / 5,668 Test rows (20%)</td>
              </tr>
              <tr>
                <td><strong>Features Included</strong></td>
                <td>Age (years), Balance ($), Duration (sec), Campaign (contact count)</td>
              </tr>
              <tr>
                <td><strong>Target Variable</strong></td>
                <td><code>y</code> (Term Deposit Subscription: 0 = No, 1 = Yes)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
