/**
 * ML Model Metadata & Helper Constants for DepositIQ AI Term Deposit Subscription
 * Model: Scikit-learn ColumnTransformer + LogisticRegression Pipeline (trained_model.pkl)
 * Accuracy: 89.20% | F1-Score: 58.16% | ROC-AUC: 90.75%
 * Trained Features: All 16 Dataset Features
 */

export const MODEL_METADATA = {
  accuracy: 89.20,
  roc_auc: 90.75,
  f1_score: 58.16,
  totalDatasetRows: 45211,
  trainingRows: 36168,
  testRows: 9043,
  modelName: '16-Feature Calibrated Logistic Regression Pipeline',
  numericalFeatures: ["age", "balance", "day", "duration", "campaign", "pdays", "previous"],
  categoricalFeatures: ["job", "marital", "education", "default", "housing", "loan", "contact", "month", "poutcome"]
};

// Preset customer profiles for instant testing with all 16 features
export const PRESET_PROFILES = [
  {
    id: 'average_lead',
    label: 'Standard Benchmark Lead',
    badge: 'Dataset Mean Values',
    description: 'Dataset averages (Age 41, Management, Balance €1,362, Duration 258s)',
    data: {
      age: 41,
      job: 'management',
      marital: 'married',
      education: 'tertiary',
      default: 'no',
      balance: 1362,
      housing: 'no',
      loan: 'no',
      contact: 'cellular',
      day: 15,
      month: 'may',
      duration: 258,
      campaign: 2,
      pdays: -1,
      previous: 0,
      poutcome: 'unknown'
    }
  },
  {
    id: 'prev_success',
    label: 'Previous Campaign Success Lead',
    badge: 'High Conversion (99%+)',
    description: 'Previous success outcome, balance €4,500, call duration 480s',
    data: {
      age: 45,
      job: 'technician',
      marital: 'single',
      education: 'tertiary',
      default: 'no',
      balance: 4500,
      housing: 'no',
      loan: 'no',
      contact: 'cellular',
      day: 12,
      month: 'oct',
      duration: 480,
      campaign: 1,
      pdays: 90,
      previous: 2,
      poutcome: 'success'
    }
  },
  {
    id: 'vip_prospect',
    label: 'High Prospect VIP',
    badge: 'High Balance',
    description: 'High balance (€12,500), long call duration (600s), 1 contact',
    data: {
      age: 52,
      job: 'entrepreneur',
      marital: 'married',
      education: 'tertiary',
      default: 'no',
      balance: 12500,
      housing: 'no',
      loan: 'no',
      contact: 'cellular',
      day: 20,
      month: 'aug',
      duration: 600,
      campaign: 1,
      pdays: -1,
      previous: 0,
      poutcome: 'unknown'
    }
  },
  {
    id: 'low_engagement',
    label: 'Low Engagement Prospect',
    badge: 'Low Conversion',
    description: 'Short call (65s), high campaign contacts (6), low balance (€120)',
    data: {
      age: 33,
      job: 'blue-collar',
      marital: 'married',
      education: 'secondary',
      default: 'no',
      balance: 120,
      housing: 'yes',
      loan: 'yes',
      contact: 'unknown',
      day: 5,
      month: 'may',
      duration: 65,
      campaign: 6,
      pdays: -1,
      previous: 0,
      poutcome: 'unknown'
    }
  },
  {
    id: 'senior_saver',
    label: 'Retired Senior Saver',
    badge: 'Niche Segment',
    description: 'Retired, debt free, balance €5,400, call duration 320s',
    data: {
      age: 68,
      job: 'retired',
      marital: 'married',
      education: 'secondary',
      default: 'no',
      balance: 5400,
      housing: 'no',
      loan: 'no',
      contact: 'cellular',
      day: 18,
      month: 'mar',
      duration: 320,
      campaign: 1,
      pdays: -1,
      previous: 0,
      poutcome: 'unknown'
    }
  }
];

export const BENCHMARKS = {
  age: { min: 18, max: 95, mean: 40.9, median: 39 },
  balance: { min: -8019, max: 102127, mean: 1362, median: 448 },
  day: { min: 1, max: 31, mean: 15.8, median: 16 },
  duration: { min: 0, max: 4918, mean: 258, median: 180 },
  campaign: { min: 1, max: 63, mean: 2.76, median: 2 },
  pdays: { min: -1, max: 871, mean: 40.2, median: -1 },
  previous: { min: 0, max: 275, mean: 0.58, median: 0 }
};

export const JOB_OPTIONS = [
  "admin.", "blue-collar", "entrepreneur", "housemaid", "management", 
  "retired", "self-employed", "services", "student", "technician", "unemployed", "unknown"
];

export const MARITAL_OPTIONS = ["married", "single", "divorced"];

export const EDUCATION_OPTIONS = ["tertiary", "secondary", "primary", "unknown"];

export const CONTACT_OPTIONS = ["cellular", "telephone", "unknown"];

export const MONTH_OPTIONS = [
  "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"
];

export const POUTCOME_OPTIONS = ["unknown", "failure", "other", "success"];
