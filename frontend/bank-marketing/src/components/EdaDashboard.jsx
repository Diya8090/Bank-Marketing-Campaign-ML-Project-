import { useState } from 'react';
import { 
  Database, 
  Cpu, 
  BarChart, 
  Filter, 
  PieChart, 
  Code2, 
  Sliders,
  FileText,
  Clock,
  Wallet,
  Users
} from 'lucide-react';

export default function EdaDashboard() {
  const [activeStep, setActiveStep] = useState(10);

  const pipelineSteps = [
    {
      step: 1,
      title: 'Import Libraries',
      code: `import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score`,
      description: 'Loaded essential machine learning and data processing libraries.'
    },
    {
      step: 2,
      title: 'Read Cleaned Dataset',
      code: `df = pd.read_csv("bank_cleaned.csv")
df.head()`,
      description: 'Loaded preprocessed dataset containing 28,338 records post outlier cleaning.'
    },
    {
      step: 3,
      title: 'Check Target Distribution',
      code: `print(df["y"].value_counts())
# y: 0 -> 26,679 | 1 -> 1,659`,
      description: 'Evaluated target class imbalance for term deposit subscriptions.'
    },
    {
      step: 4,
      title: 'Feature Selection',
      code: `X = df[["age", "balance", "duration", "campaign"]]`,
      description: 'Selected primary numerical predictive features: Age, Account Balance, Call Duration, and Campaign Contacts.'
    },
    {
      step: 5,
      title: 'Target Selection',
      code: `y = df["y"]`,
      description: 'Isolated binary deposit subscription outcome.'
    },
    {
      step: 6,
      title: 'Split Dataset',
      code: `X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)`,
      description: 'Partitioned dataset with an 80/20 train-test ratio using seed 42.'
    },
    {
      step: 7,
      title: 'Create Logistic Regression Model',
      code: `model = LogisticRegression()`,
      description: 'Initialized scikit-learn binary logistic classifier.'
    },
    {
      step: 8,
      title: 'Train Model',
      code: `model.fit(X_train, y_train)`,
      description: 'Fitted logistic weights using maximum likelihood estimation.'
    },
    {
      step: 9,
      title: 'Make Predictions',
      code: `y_pred = model.predict(X_test)
# Output: array([0, 0, 0, ..., 0, 0, 0])`,
      description: 'Generated binary class predictions on test partition.'
    },
    {
      step: 10,
      title: 'Calculate Model Accuracy',
      code: `accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)
# Accuracy: 0.9393083980239944`,
      description: 'Evaluated accuracy performance achieving 93.93% overall accuracy.'
    }
  ];

  return (
    <div className="eda-dashboard">
      {/* Metrics Banner */}
      <div className="eda-banner-grid">
        <div className="eda-metric-card card-panel glowing-border">
          <div className="card-top">
            <span className="metric-tag tag-primary">MODEL PERFORMANCE</span>
            <Cpu size={22} className="metric-icon text-indigo" />
          </div>
          <div className="metric-big-val">93.93%</div>
          <div className="metric-subtext">Logistic Regression Accuracy (PDF Step 10)</div>
        </div>

        <div className="eda-metric-card card-panel">
          <div className="card-top">
            <span className="metric-tag tag-emerald">RAW DATASET</span>
            <Database size={22} className="metric-icon text-emerald" />
          </div>
          <div className="metric-big-val">45,211</div>
          <div className="metric-subtext">Total Observations in bank-full.csv</div>
        </div>

        <div className="eda-metric-card card-panel">
          <div className="card-top">
            <span className="metric-tag tag-amber">IQR OUTLIER FILTERING</span>
            <Filter size={22} className="metric-icon text-amber" />
          </div>
          <div className="metric-big-val">28,338</div>
          <div className="metric-subtext">Cleaned Records (EDA Page 11 IQR bounds)</div>
        </div>

        <div className="eda-metric-card card-panel">
          <div className="card-top">
            <span className="metric-tag tag-purple">SUBSCRIBERS</span>
            <PieChart size={22} className="metric-icon text-purple" />
          </div>
          <div className="metric-big-val">11.7%</div>
          <div className="metric-subtext">Overall Positive Conversion Rate (5,289 Yes)</div>
        </div>
      </div>

      <div className="eda-sections-grid">
        {/* Feature Summary Benchmarks Table */}
        <div className="eda-table-card card-panel">
          <div className="panel-header">
            <div className="header-left">
              <div className="header-icon-box">
                <BarChart size={20} />
              </div>
              <div>
                <h3>PDF EDA Feature Distribution Summary</h3>
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

        {/* 10-Step ML Pipeline Interactive Code Inspector */}
        <div className="pipeline-card card-panel">
          <div className="panel-header">
            <div className="header-left">
              <div className="header-icon-box">
                <Code2 size={20} />
              </div>
              <div>
                <h3>Logistic Regression Execution Pipeline</h3>
                <p className="subtitle">Replicating the 10 notebook steps from LogisticRegression PDF</p>
              </div>
            </div>
            <span className="step-count-badge">Step {activeStep} of 10</span>
          </div>

          <div className="pipeline-stepper">
            {pipelineSteps.map((s) => (
              <button
                key={s.step}
                type="button"
                className={`step-btn ${activeStep === s.step ? 'active' : ''} ${s.step < activeStep ? 'completed' : ''}`}
                onClick={() => setActiveStep(s.step)}
              >
                <span className="step-num">{s.step}</span>
                <span className="step-title-short">{s.title}</span>
              </button>
            ))}
          </div>

          {/* Active Step Code Viewer */}
          {pipelineSteps.find(s => s.step === activeStep) && (
            <div className="step-code-box">
              <div className="code-box-header">
                <span className="code-step-title">
                  Step {activeStep}: {pipelineSteps.find(s => s.step === activeStep).title}
                </span>
                <span className="code-lang">Python 3</span>
              </div>
              <pre className="code-content">
                <code>{pipelineSteps.find(s => s.step === activeStep).code}</code>
              </pre>
              <p className="code-explanation">
                {pipelineSteps.find(s => s.step === activeStep).description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
