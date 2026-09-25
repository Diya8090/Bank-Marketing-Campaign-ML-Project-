import { useState, useEffect } from 'react';
import { 
  PieChart, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  HelpCircle,
  BarChart2
} from 'lucide-react';
import { getModelMetrics } from '../services/api';

export default function Evaluation() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      const data = await getModelMetrics();
      setMetrics(data);
      setLoading(false);
    }
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="loading-state card-panel">
        <Loader2 size={32} className="icon-spin text-indigo" />
        <p>Loading Evaluation Metrics & ROC Curve...</p>
      </div>
    );
  }

  const cm = metrics?.confusion_matrix || [[5334, 2], [331, 1]];
  const tn = cm[0][0];
  const fp = cm[0][1];
  const fn = cm[1][0];
  const tp = cm[1][1];

  const rocPoints = metrics?.roc_points || [];

  // Generate SVG path for ROC Curve
  const svgWidth = 400;
  const svgHeight = 300;
  const padding = 45;
  const plotW = svgWidth - padding * 2;
  const plotH = svgHeight - padding * 2;

  const pointsString = rocPoints.map((p) => {
    const x = padding + p.fpr * plotW;
    const y = padding + plotH - p.tpr * plotH;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="evaluation-page">
      {/* Page Header */}
      <div className="panel-header card-panel">
        <div className="header-left">
          <div className="header-icon-box">
            <PieChart size={22} />
          </div>
          <div>
            <h2>Model Evaluation & Metrics</h2>
            <p className="subtitle">Confusion Matrix Breakdown, Target Imbalance Analysis & ROC Curve</p>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="metrics-banner-grid">
        <div className="eda-metric-card card-panel glowing-border">
          <span className="metric-tag tag-primary">ACCURACY</span>
          <div className="metric-big-val">{metrics ? `${metrics.accuracy}%` : '94.12%'}</div>
          <div className="metric-subtext">Overall Test Set Accuracy</div>
        </div>

        <div className="eda-metric-card card-panel">
          <span className="metric-tag tag-emerald">ROC-AUC</span>
          <div className="metric-big-val">{metrics ? `${metrics.roc_auc}%` : '78.39%'}</div>
          <div className="metric-subtext">Area Under ROC Curve</div>
        </div>

        <div className="eda-metric-card card-panel">
          <span className="metric-tag tag-amber">PRECISION</span>
          <div className="metric-big-val">{metrics ? `${metrics.precision}%` : '33.33%'}</div>
          <div className="metric-subtext">TP / (TP + FP)</div>
        </div>

        <div className="eda-metric-card card-panel">
          <span className="metric-tag tag-purple">RECALL</span>
          <div className="metric-big-val">{metrics ? `${metrics.recall}%` : '0.30%'}</div>
          <div className="metric-subtext">TP / (TP + FN)</div>
        </div>
      </div>

      {/* Main Grid: Confusion Matrix & ROC Curve */}
      <div className="eval-grid">
        {/* Confusion Matrix Card */}
        <div className="card-panel cm-section">
          <div className="section-title-box">
            <BarChart2 size={18} className="text-indigo" />
            <h3>Confusion Matrix (22,670 Train / 5,668 Test Split)</h3>
          </div>

          <div className="cm-grid">
            <div className="cm-box cm-tn">
              <div className="cm-header">
                <CheckCircle2 size={18} className="text-emerald" />
                <span>True Negative (TN)</span>
              </div>
              <div className="cm-value">{tn.toLocaleString()}</div>
              <div className="cm-sub">Actual: Not Subscribed &bull; Pred: Not Subscribed</div>
            </div>

            <div className="cm-box cm-fp">
              <div className="cm-header">
                <AlertTriangle size={18} className="text-amber" />
                <span>False Positive (FP)</span>
              </div>
              <div className="cm-value">{fp.toLocaleString()}</div>
              <div className="cm-sub">Actual: Not Subscribed &bull; Pred: Subscribed</div>
            </div>

            <div className="cm-box cm-fn">
              <div className="cm-header">
                <XCircle size={18} className="text-rose" />
                <span>False Negative (FN)</span>
              </div>
              <div className="cm-value">{fn.toLocaleString()}</div>
              <div className="cm-sub">Actual: Subscribed &bull; Pred: Not Subscribed</div>
            </div>

            <div className="cm-box cm-tp">
              <div className="cm-header">
                <ShieldCheck size={18} className="text-indigo" />
                <span>True Positive (TP)</span>
              </div>
              <div className="cm-value">{tp.toLocaleString()}</div>
              <div className="cm-sub">Actual: Subscribed &bull; Pred: Subscribed</div>
            </div>
          </div>

          {/* Class Imbalance Explanation */}
          <div className="info-callout warning-callout">
            <HelpCircle size={20} className="callout-icon text-amber" />
            <div>
              <strong>Class Imbalance Insight:</strong>
              <p>
                The cleaned dataset is heavily imbalanced (<strong>94.15% Negative</strong> vs <strong>5.85% Positive</strong>). 
                At a default probability decision threshold of 50%, the model achieves a high overall accuracy (94.12%) by conservatively classifying most clients as negative.
              </p>
            </div>
          </div>
        </div>

        {/* ROC Curve Chart Card */}
        <div className="card-panel roc-section">
          <div className="section-title-box">
            <TrendingUp size={18} className="text-indigo" />
            <h3>Receiver Operating Characteristic (ROC) Curve</h3>
          </div>

          <div className="roc-chart-wrapper">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="roc-svg">
              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={padding + plotW} y2={padding} stroke="var(--border-color)" strokeDasharray="3 3" />
              <line x1={padding} y1={padding + plotH / 2} x2={padding + plotW} y2={padding + plotH / 2} stroke="var(--border-color)" strokeDasharray="3 3" />
              <line x1={padding + plotW / 2} y1={padding} x2={padding + plotW / 2} y2={padding + plotH} stroke="var(--border-color)" strokeDasharray="3 3" />

              {/* Diagonal Random Classifier Line */}
              <line 
                x1={padding} 
                y1={padding + plotH} 
                x2={padding + plotW} 
                y2={padding} 
                stroke="var(--text-muted)" 
                strokeDasharray="4 4" 
                strokeWidth="1.5" 
              />

              {/* ROC Curve Path */}
              {pointsString && (
                <polyline
                  fill="none"
                  stroke="var(--primary-color)"
                  strokeWidth="3"
                  points={pointsString}
                />
              )}

              {/* Axes */}
              <line x1={padding} y1={padding + plotH} x2={padding + plotW} y2={padding + plotH} stroke="var(--text-main)" strokeWidth="1.5" />
              <line x1={padding} y1={padding} x2={padding} y2={padding + plotH} stroke="var(--text-main)" strokeWidth="1.5" />

              {/* Axis Labels */}
              <text x={padding + plotW / 2} y={svgHeight - 10} fill="var(--text-secondary)" fontSize="11" textAnchor="middle">
                False Positive Rate (1 - Specificity)
              </text>
              <text x={15} y={padding + plotH / 2} fill="var(--text-secondary)" fontSize="11" textAnchor="middle" transform={`rotate(-90 15 ${padding + plotH / 2})`}>
                True Positive Rate (Sensitivity)
              </text>

              {/* Corner Value Labels */}
              <text x={padding} y={padding + plotH + 15} fill="var(--text-muted)" fontSize="10">0.0</text>
              <text x={padding + plotW} y={padding + plotH + 15} fill="var(--text-muted)" fontSize="10" textAnchor="end">1.0</text>
              <text x={padding - 8} y={padding + plotH} fill="var(--text-muted)" fontSize="10" textAnchor="end">0.0</text>
              <text x={padding - 8} y={padding + 10} fill="var(--text-muted)" fontSize="10" textAnchor="end">1.0</text>
            </svg>
          </div>

          <div className="roc-legend">
            <div className="legend-item">
              <span className="legend-line line-blue"></span>
              <span>Logistic Regression Pipeline (ROC-AUC = {metrics?.roc_auc}%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-line line-dashed"></span>
              <span>Random Guess Classifier (AUC = 50.0%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
