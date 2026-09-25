import { useState, useEffect } from 'react';
import { 
  Database, 
  Filter, 
  PieChart, 
  BarChart, 
  FileText, 
  Users, 
  Wallet, 
  Clock, 
  Sliders,
  Loader2,
  Info
} from 'lucide-react';
import { getModelInfo } from '../services/api';

export default function DatasetPage() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await getModelInfo();
      setInfo(res);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="loading-state card-panel">
        <Loader2 size={32} className="icon-spin text-indigo" />
        <p>Loading Dataset Statistics & Exploratory Data Analysis...</p>
      </div>
    );
  }

  const imbalance = info?.target_imbalance || {
    negative_class_0: 26679,
    positive_class_1: 1659,
    negative_percent: 94.15,
    positive_percent: 5.85
  };

  return (
    <div className="dataset-page">
      {/* Header */}
      <div className="panel-header card-panel">
        <div className="header-left">
          <div className="header-icon-box">
            <Database size={22} />
          </div>
          <div>
            <h2>Dataset & Exploratory Data Analysis (EDA)</h2>
            <p className="subtitle">Bank Marketing Campaign Dataset (UCI Repository) Overview & Statistical Parameters</p>
          </div>
        </div>
      </div>

      {/* Dataset Overview Metrics Banner */}
      <div className="eda-banner-grid">
        <div className="eda-metric-card card-panel glowing-border">
          <div className="card-top">
            <span className="metric-tag tag-primary">RAW OBSERVATIONS</span>
            <Database size={22} className="metric-icon text-indigo" />
          </div>
          <div className="metric-big-val">45,211</div>
          <div className="metric-subtext">Total Records in bank-full.csv</div>
        </div>

        <div className="eda-metric-card card-panel">
          <div className="card-top">
            <span className="metric-tag tag-amber">IQR OUTLIER FILTERING</span>
            <Filter size={22} className="metric-icon text-amber" />
          </div>
          <div className="metric-big-val">28,338</div>
          <div className="metric-subtext">Cleaned Records (EDA IQR Filtering)</div>
        </div>

        <div className="eda-metric-card card-panel">
          <div className="card-top">
            <span className="metric-tag tag-emerald">NEGATIVE CLASS (0)</span>
            <PieChart size={22} className="metric-icon text-rose" />
          </div>
          <div className="metric-big-val">{imbalance.negative_percent}%</div>
          <div className="metric-subtext">{imbalance.negative_class_0.toLocaleString()} Not Subscribed</div>
        </div>

        <div className="eda-metric-card card-panel">
          <div className="card-top">
            <span className="metric-tag tag-purple">POSITIVE CLASS (1)</span>
            <PieChart size={22} className="metric-icon text-emerald" />
          </div>
          <div className="metric-big-val">{imbalance.positive_percent}%</div>
          <div className="metric-subtext">{imbalance.positive_class_1.toLocaleString()} Subscribed</div>
        </div>
      </div>

      {/* Target Imbalance Visual Progress Bar */}
      <div className="card-panel imbalance-section">
        <div className="section-title-box">
          <PieChart size={18} className="text-indigo" />
          <h3>Target Class Imbalance (Term Deposit Subscription `y`)</h3>
        </div>

        <p className="description-p">
          The Bank Marketing dataset exhibits significant class imbalance (~94.15% Class 0 vs 5.85% Class 1 in the cleaned subset). 
          Therefore, precision, recall, F1-score, and ROC-AUC are critical metrics alongside raw accuracy.
        </p>

        <div className="progress-bar-container">
          <div className="progress-bar-labels">
            <span className="text-rose">Class 0 (Not Subscribed): {imbalance.negative_class_0.toLocaleString()} ({imbalance.negative_percent}%)</span>
            <span className="text-emerald">Class 1 (Subscribed): {imbalance.positive_class_1.toLocaleString()} ({imbalance.positive_percent}%)</span>
          </div>

          <div className="stacked-progress-track">
            <div 
              className="progress-fill bg-rose" 
              style={{ width: `${imbalance.negative_percent}%` }}
              title={`Class 0: ${imbalance.negative_percent}%`}
            />
            <div 
              className="progress-fill bg-emerald" 
              style={{ width: `${imbalance.positive_percent}%` }}
              title={`Class 1: ${imbalance.positive_percent}%`}
            />
          </div>
        </div>
      </div>

      {/* Feature Distribution Summary Table */}
      <div className="card-panel table-section">
        <div className="panel-header">
          <div className="header-left">
            <div className="header-icon-box">
              <BarChart size={20} />
            </div>
            <div>
              <h3>EDA Feature Distribution Summary</h3>
              <p className="subtitle">Descriptive statistical parameters extracted from EDA notebook (Page 7)</p>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="eda-summary-table">
            <thead>
              <tr>
                <th>Feature Name</th>
                <th>Mean Value</th>
                <th>Std Dev</th>
                <th>Min</th>
                <th>25% (Q1)</th>
                <th>50% (Median)</th>
                <th>75% (Q3)</th>
                <th>Max</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="feature-cell">
                    <Users size={14} />
                    <strong>age</strong>
                  </div>
                </td>
                <td>40.94</td>
                <td>10.62</td>
                <td>18</td>
                <td>33</td>
                <td>39</td>
                <td>48</td>
                <td>95</td>
              </tr>
              <tr>
                <td>
                  <div className="feature-cell">
                    <Wallet size={14} />
                    <strong>balance (€)</strong>
                  </div>
                </td>
                <td>€1,362.27</td>
                <td>€3,044.77</td>
                <td>-€8,019</td>
                <td>€72</td>
                <td>€448</td>
                <td>€1,428</td>
                <td>€102,127</td>
              </tr>
              <tr>
                <td>
                  <div className="feature-cell">
                    <Clock size={14} />
                    <strong>duration (sec)</strong>
                  </div>
                </td>
                <td>258.16s</td>
                <td>257.53s</td>
                <td>0s</td>
                <td>103s</td>
                <td>180s</td>
                <td>319s</td>
                <td>4,918s</td>
              </tr>
              <tr>
                <td>
                  <div className="feature-cell">
                    <FileText size={14} />
                    <strong>campaign</strong>
                  </div>
                </td>
                <td>2.76</td>
                <td>3.10</td>
                <td>1</td>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>63</td>
              </tr>
              <tr>
                <td>
                  <div className="feature-cell">
                    <Sliders size={14} />
                    <strong>pdays</strong>
                  </div>
                </td>
                <td>40.20</td>
                <td>100.13</td>
                <td>-1</td>
                <td>-1</td>
                <td>-1</td>
                <td>-1</td>
                <td>871</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
