import { useState } from 'react';
import { 
  Database, 
  Cpu, 
  BarChart2, 
  Filter, 
  PieChart, 
  Code2, 
  Sliders,
  Clock,
  Wallet,
  Users,
  Info,
  CheckCircle2
} from 'lucide-react';

export default function Analytics() {
  const [activeStep, setActiveStep] = useState(1);

  const pipelineSteps = [
    {
      step: 1,
      title: 'Import Libraries',
      code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, roc_auc_score`,
      description: 'Load scikit-learn, pandas, and data processing modules.'
    },
    {
      step: 2,
      title: 'Read Dataset',
      code: `df = pd.read_csv("bank-full.csv", sep=";")
df["target"] = (df["y"] == "yes").astype(int)`,
      description: 'Read 45,211 campaign contact records and map target label to 0/1.'
    },
    {
      step: 3,
      title: 'Evaluate Target Imbalance',
      code: `print(df["target"].value_counts(normalize=True))
# 0 (Not Subscribed): 88.30%
# 1 (Subscribed)    : 11.70%`,
      description: 'Quantify class imbalance ratio (39,922 negative vs 5,289 positive).'
    },
    {
      step: 4,
      title: 'Feature Matrix Selection',
      code: `features = ["age", "balance", "duration", "campaign"]
X = df[features]
y = df["target"]`,
      description: 'Select primary continuous predictors: Age, Account Balance, Call Duration, Campaign Contacts.'
    },
    {
      step: 5,
      title: 'Stratified Train-Test Split',
      code: `X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)`,
      description: 'Partition data into 80% train (36,168 rows) and 20% test (9,043 rows).'
    },
    {
      step: 6,
      title: 'Pipeline Construction',
      code: `pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', LogisticRegression(C=1.0, random_state=42))
])`,
      description: 'Construct sklearn Pipeline coupling Z-score normalization with Logistic Regression.'
    },
    {
      step: 7,
      title: 'Fit Model Pipeline',
      code: `pipeline.fit(X_train, y_train)`,
      description: 'Fit scaler parameters and maximum likelihood logit weights on train set.'
    },
    {
      step: 8,
      title: 'Predict & Evaluate',
      code: `y_pred = pipeline.predict(X_test)
y_proba = pipeline.predict_proba(X_test)[:, 1]
print("Accuracy:", accuracy_score(y_test, y_pred))
print("ROC-AUC :", roc_auc_score(y_test, y_proba))`,
      description: 'Evaluate test predictions (Accuracy: 88.70%, ROC-AUC: 81.58%).'
    }
  ];

  return (
    <div className="analytics-page">
      {/* Page Header */}
      <div className="panel-header card-panel">
        <div className="header-left">
          <div className="header-icon-box">
            <BarChart2 size={22} />
          </div>
          <div>
            <h2>Exploratory Data Analysis & Analytics</h2>
            <p className="subtitle">Dataset Distributions, Feature Statistics & Training Notebook Explorer</p>
          </div>
        </div>
      </div>

      {/* Dataset Summary Cards */}
      <div className="eda-banner-grid">
        <div className="eda-metric-card card-panel glowing-border">
          <span className="metric-tag tag-primary">TOTAL RECORDS</span>
          <div className="metric-big-val">45,211</div>
          <div className="metric-subtext">UCI Bank Marketing Campaign Entries</div>
        </div>

        <div className="eda-metric-card card-panel">
          <span className="metric-tag tag-emerald">PREDICTIVE FEATURES</span>
          <div className="metric-big-val">4</div>
          <div className="metric-subtext">Age, Balance (€), Duration (s), Campaign</div>
        </div>

        <div className="eda-metric-card card-panel">
          <span className="metric-tag tag-amber">NEGATIVE CLASS (0)</span>
          <div className="metric-big-val">88.30%</div>
          <div className="metric-subtext">39,922 Not Subscribed Records</div>
        </div>

        <div className="eda-metric-card card-panel">
          <span className="metric-tag tag-purple">POSITIVE CLASS (1)</span>
          <div className="metric-big-val">11.70%</div>
          <div className="metric-subtext">5,289 Subscribed Records</div>
        </div>
      </div>

      {/* Feature Distribution Summary Table */}
      <div className="card-panel">
        <div className="section-title-box">
          <Database size={18} className="text-indigo" />
          <h3>Feature Summary Statistics (Full Dataset Distribution)</h3>
        </div>

        <div className="table-responsive">
          <table className="eda-summary-table">
            <thead>
              <tr>
                <th>Feature Name</th>
                <th>Units / Type</th>
                <th>Mean (μ)</th>
                <th>Std Dev (σ)</th>
                <th>Min</th>
                <th>25% (Q1)</th>
                <th>Median (Q2)</th>
                <th>75% (Q3)</th>
                <th>Max</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="feature-cell">
                    <Users size={15} />
                    <strong>age</strong>
                  </div>
                </td>
                <td>Years (Integer)</td>
                <td>40.93</td>
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
                    <Wallet size={15} />
                    <strong>balance</strong>
                  </div>
                </td>
                <td>Euros (€ Float)</td>
                <td>€1,362.27</td>
                <td>€3,049.57</td>
                <td>-€8,019</td>
                <td>€72</td>
                <td>€448</td>
                <td>€1,428</td>
                <td>€102,127</td>
              </tr>
              <tr>
                <td>
                  <div className="feature-cell">
                    <Clock size={15} />
                    <strong>duration</strong>
                  </div>
                </td>
                <td>Seconds (Float)</td>
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
                    <Filter size={15} />
                    <strong>campaign</strong>
                  </div>
                </td>
                <td>Contacts (Count)</td>
                <td>2.76</td>
                <td>3.10</td>
                <td>1</td>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>63</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Code Pipeline Explorer */}
      <div className="card-panel pipeline-card">
        <div className="section-title-box">
          <Code2 size={18} className="text-indigo" />
          <h3>Interactive Training Pipeline Code Explorer</h3>
          <span className="step-count-badge">Step {activeStep} of {pipelineSteps.length}</span>
        </div>

        <div className="pipeline-stepper">
          {pipelineSteps.map((s) => (
            <button
              key={s.step}
              type="button"
              className={`step-btn ${activeStep === s.step ? 'active' : ''}`}
              onClick={() => setActiveStep(s.step)}
            >
              <span className="step-num">{s.step}</span>
              <span className="step-title-text">{s.title}</span>
            </button>
          ))}
        </div>

        <div className="step-code-box">
          <div className="code-box-header">
            <span className="code-step-title">
              Step {pipelineSteps[activeStep - 1].step}: {pipelineSteps[activeStep - 1].title}
            </span>
            <span className="code-lang">Python 3.10 &bull; Scikit-Learn</span>
          </div>
          <pre className="code-content">
            <code>{pipelineSteps[activeStep - 1].code}</code>
          </pre>
          <div className="code-explanation">
            <p>{pipelineSteps[activeStep - 1].description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
