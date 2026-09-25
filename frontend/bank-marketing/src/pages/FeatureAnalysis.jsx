import { useState, useEffect } from 'react';
import { 
  BarChart2, 
  BookOpen, 
  HelpCircle, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Loader2,
  Info
} from 'lucide-react';
import { getFeatureAnalysis } from '../services/api';

export default function FeatureAnalysis() {
  const [featureData, setFeatureData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getFeatureAnalysis();
      setFeatureData(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="loading-state card-panel">
        <Loader2 size={32} className="icon-spin text-indigo" />
        <p>Loading Model Feature Analysis & Coefficients...</p>
      </div>
    );
  }

  const featuresList = featureData?.feature_analysis || [];
  const maxAbsCoef = Math.max(...featuresList.map(f => Math.abs(f.coefficient)), 0.0001);

  return (
    <div className="feature-analysis-page">
      {/* Page Header */}
      <div className="panel-header card-panel">
        <div className="header-left">
          <div className="header-icon-box">
            <BarChart2 size={22} />
          </div>
          <div>
            <h2>Feature Analysis & Logistic Regression Coefficients</h2>
            <p className="subtitle">Standardized Model Coefficients (β) & Exponential Odds Ratios (OR = e^β)</p>
          </div>
        </div>
      </div>

      {/* Horizontal Bar Chart for Standardized Coefficients */}
      <div className="card-panel coef-chart-section">
        <div className="section-title-box">
          <BarChart2 size={18} className="text-indigo" />
          <h3>Standardized Model Coefficients (β) Magnitude</h3>
        </div>
        <p className="description-p">
          All numeric inputs are standardized via <code>StandardScaler</code> prior to fitting the Logistic Regression model. 
          Standardized coefficients allow direct comparison of relative feature magnitude independent of original units.
        </p>

        <div className="horizontal-bars-container">
          {featuresList.map((item, index) => {
            const absWidth = Math.min(100, Math.round((Math.abs(item.coefficient) / maxAbsCoef) * 85));
            const isPos = item.coefficient > 0;
            return (
              <div key={index} className="coef-bar-row">
                <div className="bar-label-box">
                  <span className="bar-feature-name">{item.feature}</span>
                  <span className={`badge-pill ${isPos ? 'badge-primary' : 'badge-rose'}`}>
                    {isPos ? 'Positive Influence' : 'Negative Influence'}
                  </span>
                </div>

                <div className="bar-track-wrap">
                  <div 
                    className={`bar-fill ${isPos ? 'fill-emerald' : 'fill-rose'}`} 
                    style={{ width: `${absWidth}%` }}
                  />
                </div>

                <div className="bar-value-box font-mono">
                  <strong>{item.coefficient >= 0 ? `+${item.coefficient.toFixed(4)}` : item.coefficient.toFixed(4)}</strong>
                  <span className="text-muted"> (OR: {item.odds_ratio})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Detailed Analysis Table */}
      <div className="card-panel feature-table-section">
        <div className="section-title-box">
          <Info size={18} className="text-indigo" />
          <h3>Feature Parameters & Role Definitions</h3>
        </div>

        <div className="table-responsive">
          <table className="eda-summary-table">
            <thead>
              <tr>
                <th>Feature Name</th>
                <th>Role in Model</th>
                <th>Standardized Coef (β)</th>
                <th>Odds Ratio (OR = e^β)</th>
                <th>Directional Impact</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {featuresList.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="feature-cell">
                      <ShieldCheck size={14} />
                      <strong>{item.feature}</strong>
                    </div>
                  </td>
                  <td><span className="mini-badge badge-subtle">{item.role}</span></td>
                  <td><code className="font-mono">{item.coefficient >= 0 ? `+${item.coefficient}` : item.coefficient}</code></td>
                  <td><strong className="font-mono text-indigo">{item.odds_ratio}</strong></td>
                  <td>
                    <span className={`status-pill ${item.direction === 'positive' ? 'pill-success' : 'pill-danger'}`}>
                      {item.direction === 'positive' ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                      <span>{item.direction.toUpperCase()}</span>
                    </span>
                  </td>
                  <td className="text-secondary">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational Explanation Box */}
      <div className="card-panel education-card">
        <div className="rec-header">
          <BookOpen size={18} className="text-amber" />
          <h4 className="text-amber">Understanding Logistic Regression Coefficients & Odds Ratios</h4>
        </div>
        <div className="edu-content-text">
          <p>
            In Logistic Regression, the model models the <strong>log-odds</strong> of the target outcome y = 1 (Term Deposit Subscribed) as a linear combination:
          </p>
          <div className="code-formula-box font-mono">
            ln(P / (1 - P)) = β_0 + β_1·age + β_2·balance + β_3·duration + β_4·campaign
          </div>
          <ul className="edu-bullets">
            <li>
              <strong>Standardized Coefficient (β):</strong> Measures the change in log-odds corresponding to a 1 standard deviation increase in the predictor.
            </li>
            <li>
              <strong>Odds Ratio (OR = e^β):</strong> Represents the multiplicative change in odds P / (1 - P). 
              For instance, an odds ratio of <strong>2.2660</strong> for <code>duration</code> means that 1 standard deviation increase in call duration multiplies the subscription odds by ~2.27x.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
