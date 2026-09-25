# Bank Marketing Campaign — Term Deposit Subscription Predictive System

A production-grade Machine Learning platform and interactive dashboard for predicting client term deposit subscription propensity using Scikit-Learn pipelines, FastAPI REST APIs, and React 18 frontend components.

---

## 📌 Problem Statement & Objective
Retail banking institutions conduct direct telephone marketing campaigns to promote term deposit subscriptions (Certificates of Deposit). Predictive modeling allows financial managers to screen customer leads before and during calls, focusing resources on prospects with high conversion propensity.

---

## 🏗️ System Architecture & Inference Flow

```text
┌─────────────────────────────────────────────────────────────┐
│                 React 18 + Vite Frontend                    │
│    (Single Global Navbar: Dashboard | Predict | Models)     │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ HTTP POST /predict (JSON: age, balance, duration, campaign)
                ▼
┌─────────────────────────────────────────────────────────────┐
│                 FastAPI Python Web Server                   │
│         (Input Validation & Pydantic Serialization)         │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ Passes raw DataFrame to loaded Pipeline
                ▼
┌─────────────────────────────────────────────────────────────┐
│   Scikit-Learn Pipeline (trained_model.pkl)                 │
│   ├── Step 1: StandardScaler (x - μ) / σ                     │
│   └── Step 2: Logistic Regression (z = β_0 + ∑ β_i · Z_i)   │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ predict_proba() -> [P(Class 0), P(Class 1)]
                ▼
┌─────────────────────────────────────────────────────────────┐
│  JSON Response:                                             │
│  - subscription_probability_percent (Class 1)               │
│  - not_subscription_probability_percent (Class 0)           │
│  - feature_contributions (Log-odds z_i = β_i · Z_i)         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 Machine Learning Pipeline & Training

- **Algorithm**: Logistic Regression (`sklearn.linear_model.LogisticRegression`)
- **Pipeline Structure**: `sklearn.pipeline.Pipeline([('scaler', StandardScaler()), ('model', LogisticRegression(C=1.0, random_state=42))])`
- **Features Used**:
  1. `age` — Customer age in years
  2. `balance` — Average yearly account balance in EUR
  3. `duration` — Last contact duration in seconds
  4. `campaign` — Contact attempts during campaign
- **Evaluation Performance (UCI Bank Marketing Dataset, 45,211 rows)**:
  - **Accuracy**: 88.70%
  - **ROC-AUC**: 81.58%
  - **Precision**: 48.90%
  - **Recall**: 14.37%

---

## 🌐 Application Navigation Structure

1. **Dashboard (`DashboardOverview.jsx`)**: Landing page with KPI summary metrics, dataset stats, and quick links.
2. **Predict (`PredictionCard.jsx`)**: Input form with range sliders, lead profile presets, real-time `predict_proba()` subscription & non-subscription probability bars, and model feature contributions.
3. **Analytics (`Analytics.jsx`)**: Full dataset distribution summaries, feature quantile statistics, target class imbalance breakdown (88.30% vs 11.70%), and 8-step training code explorer.
4. **Models & Evaluation (`ModelsAndEvaluation.jsx`)**: Single dedicated hub containing:
   - Model Overview & Pipeline Architecture
   - Confusion Matrix 2x2 Breakdown & 25-point SVG ROC Curve
   - Standardized Coefficients ($\beta$) & Odds Ratios ($e^\beta$)
   - Pre-Call (AUC 59.52%) vs. In-Call (AUC 81.58%) Duration Leakage Analysis
   - Candidate Models Benchmarking Matrix (Baseline, StandardScaler, RobustScaler, Regularized LR C=0.1/10)
   - Academic Viva Rationale & Project Limitations
5. **History (`HistoryView.jsx`)**: Local browser history log with search filtering, JSON, and CSV export.
6. **About (`AboutProject.jsx`)**: Tech stack specification and project objective overview.

---

## 🛠️ How to Run the Project

### 1. Start FastAPI Backend
```bash
cd backend
pip install -r requirements.txt
python train_model.py     # Fits model & generates trained_model.pkl
python test_backend.py    # Runs comprehensive verification test suite
uvicorn app:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- Swagger OpenAPI Docs: `http://localhost:8000/docs`

### 2. Start React Frontend
```bash
cd frontend/bank-marketing
npm install
npm run build             # Verifies production build
npm run dev               # Launches Vite dev server
```
- Frontend Web App: `http://localhost:5173`

---

## 🎓 Academic Viva & Technical Key Concepts

- **Prediction vs Probability**: *Prediction* is a discrete class decision ($0$ or $1$) evaluated against a $50\%$ decision threshold. *Probability* is the continuous confidence value $P(y=1) \in [0.0, 1.0]$ output directly by `model.predict_proba()`.
- **Accuracy vs ROC-AUC on Imbalanced Data**: On an imbalanced dataset (88.3% Negative), accuracy can be inflated by predicting the majority class. ROC-AUC (81.58%) measures true separation ability across all thresholds.
- **Duration Leakage**: `duration` (call length) is recorded during/after the call. Using `duration` yields an *In-Call Engagement Model* (AUC 81.58%), while omitting `duration` yields a *Pre-Call Targeting Model* (AUC 59.52%).
