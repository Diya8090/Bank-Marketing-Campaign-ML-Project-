import { useState } from 'react';
import { 
  HelpCircle, 
  Cpu, 
  Sliders, 
  Database, 
  CheckCircle2, 
  ArrowRight, 
  Calculator, 
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export default function HowItWorks({ onNavigate }) {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: "Client Profile Inputs",
      icon: Database,
      badgeColor: "bg-indigo",
      desc: "User inputs customer demographic and campaign parameters: Age, Account Balance ($), Call Duration (sec), and Contact Count (campaign)."
    },
    {
      step: 2,
      title: "FastAPI Pydantic Validation",
      icon: ShieldCheck,
      badgeColor: "bg-amber",
      desc: "Backend API receives JSON payload and validates parameter data types, range bounds (e.g., age 18-100), and non-null constraints."
    },
    {
      step: 3,
      title: "StandardScaler Transformation",
      icon: Sliders,
      badgeColor: "bg-purple",
      desc: "Each feature is normalized into standard units: Z = (x - mean) / std. This ensures huge scales like balance ($100k) do not skew calculations."
    },
    {
      step: 4,
      title: "Log-Odds Calculation (z)",
      icon: Calculator,
      badgeColor: "bg-emerald",
      desc: "Computes weighted linear combination: z = intercept + (coeff_age * Z_age) + (coeff_balance * Z_balance) + (coeff_duration * Z_duration) + (coeff_campaign * Z_campaign)."
    },
    {
      step: 5,
      title: "Sigmoid Probability Mapping",
      icon: Cpu,
      badgeColor: "bg-indigo",
      desc: "Maps raw log-odds z to valid probability P(y=1) in range [0.0, 1.0] using Sigmoid function: P = 1 / (1 + exp(-z))."
    },
    {
      step: 6,
      title: "Classification & Decision Output",
      icon: CheckCircle2,
      badgeColor: "bg-emerald",
      desc: "If probability P >= 0.50 (50%), client is predicted SUBSCRIBED. Otherwise, NOT SUBSCRIBED. Response includes confidence score and odds factors."
    }
  ];

  return (
    <div className="how-it-works-page">
      {/* Page Header */}
      <div className="panel-header card-panel">
        <div className="header-left">
          <div className="header-icon-box">
            <HelpCircle size={22} />
          </div>
          <div>
            <h2>How the Prediction Works</h2>
            <p className="subtitle">Step-by-step Machine Learning Inference Pipeline & Mathematical Formulation</p>
          </div>
        </div>
      </div>

      {/* Interactive Workflow Steps */}
      <div className="card-panel visual-steps-section">
        <div className="section-title-box">
          <Zap size={18} className="text-indigo" />
          <h3>6-Step Inference Workflow</h3>
        </div>

        <div className="steps-stepper-grid">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = activeStep === s.step;
            return (
              <div 
                key={s.step} 
                className={`step-card card-panel ${isActive ? 'active-step-card glowing-border' : ''}`}
                onClick={() => setActiveStep(s.step)}
              >
                <div className="step-header">
                  <span className={`step-number ${s.badgeColor}`}>{s.step}</span>
                  <Icon size={20} className="step-icon" />
                </div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mathematical Formulations Section */}
      <div className="math-formulation-section">
        <div className="section-title-box card-panel header-title-only">
          <Calculator size={18} className="text-indigo" />
          <h3>Mathematical Framework & Logistic Regression Equations</h3>
        </div>

        <div className="math-grid">
          {/* Card 1: Feature Standardization Equation */}
          <div className="card-panel math-card">
            <div className="math-header">
              <span className="mini-badge badge-primary">Standardization</span>
              <h4>1. Standard Normalization (Z-Score)</h4>
            </div>
            <div className="formula-box">
              <code>Z_i = (x_i - μ_i) / σ_i</code>
            </div>
            <p className="math-explanation">
              Transforms continuous raw values (x_i) by subtracting the feature mean (μ_i) and dividing by sample standard deviation (σ_i). 
              Ensures zero mean (μ = 0) and unit variance (σ² = 1).
            </p>
          </div>

          {/* Card 2: Log-Odds Linear Combination */}
          <div className="card-panel math-card">
            <div className="math-header">
              <span className="mini-badge badge-emerald">Linear Log-Odds</span>
              <h4>2. Log-Odds Linear Combination</h4>
            </div>
            <div className="formula-box">
              <code>z = β_0 + β_age·Z_age + β_bal·Z_bal + β_dur·Z_dur + β_camp·Z_camp</code>
            </div>
            <p className="math-explanation">
              Where β_0 = -3.188 is the model intercept, and standardized coefficients are β_duration = +0.818, β_balance = +0.269, β_age = +0.076, and β_campaign = -0.278.
            </p>
          </div>

          {/* Card 3: Sigmoid Function */}
          <div className="card-panel math-card">
            <div className="math-header">
              <span className="mini-badge badge-amber">Sigmoid Function</span>
              <h4>3. Sigmoid Activation Function</h4>
            </div>
            <div className="formula-box">
              <code>P(y=1 | X) = 1 / (1 + e^(-z))</code>
            </div>
            <p className="math-explanation">
              Maps the unbounded real number z into a smooth, monotonic S-shaped probability curve bounded strictly between 0.0 and 1.0.
            </p>
          </div>
        </div>
      </div>

      {/* Practical Action Footer */}
      <div className="card-panel ready-action-card glowing-border">
        <div className="action-left">
          <Info size={24} className="text-indigo" />
          <div>
            <h4>Test the Model in Real-Time</h4>
            <p>Input client data into the interactive prediction card to see exact calculated probabilities, confidence tiers, and feature impact scores.</p>
          </div>
        </div>
        {onNavigate && (
          <button type="button" className="btn-primary-action" onClick={() => onNavigate('predict')}>
            <span>Open Prediction Card</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
