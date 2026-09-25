// Smart API Base URL resolver for Local Dev and Live Deployed Environments
export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  // If running locally (localhost or 127.0.0.1)
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8000';
  }
  // Automatic fallback for live deployed production sites (Render / Vercel)
  return 'https://bank-marketing-campaign-ml-project-1.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Health check endpoint for checking backend connection
 */
export async function healthCheck() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Health Check Error:", error);
    return { status: "error", model_loaded: false, error: error.message };
  }
}

/**
 * Retrieves trained model metadata from FastAPI backend
 */
export async function getModelInfo() {
  try {
    const response = await fetch(`${API_BASE_URL}/model-info`);
    if (!response.ok) {
      throw new Error(`Failed to fetch model info (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Model Info Error:", error);
    return null;
  }
}

/**
 * Retrieves evaluation metrics (Confusion Matrix, ROC points, F1, etc.)
 */
export async function getModelMetrics() {
  try {
    const response = await fetch(`${API_BASE_URL}/model-metrics`);
    if (!response.ok) {
      throw new Error(`Failed to fetch model metrics (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Model Metrics Error:", error);
    return null;
  }
}

/**
 * Retrieves feature coefficients, odds ratios, and explanations
 */
export async function getFeatureAnalysis() {
  try {
    const response = await fetch(`${API_BASE_URL}/feature-analysis`);
    if (!response.ok) {
      throw new Error(`Failed to fetch feature analysis (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Feature Analysis Error:", error);
    return null;
  }
}

/**
 * Retrieves candidate model experiment results comparison
 */
export async function getModelComparison() {
  try {
    const response = await fetch(`${API_BASE_URL}/model-comparison`);
    if (!response.ok) {
      throw new Error(`Failed to fetch model comparison (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Model Comparison Error:", error);
    return null;
  }
}

/**
 * Sends all 16 customer features to FastAPI backend for real ML model prediction
 * @param {Object} inputFeatures - All 16 dataset features
 */
export async function predictCustomer(inputFeatures) {
  const payload = {
    age: Number(inputFeatures.age ?? 41),
    balance: Number(inputFeatures.balance ?? 1362),
    day: Number(inputFeatures.day ?? 15),
    duration: Number(inputFeatures.duration ?? 258),
    campaign: Number(inputFeatures.campaign ?? 2),
    pdays: Number(inputFeatures.pdays ?? -1),
    previous: Number(inputFeatures.previous ?? 0),
    job: String(inputFeatures.job ?? 'management'),
    marital: String(inputFeatures.marital ?? 'married'),
    education: String(inputFeatures.education ?? 'tertiary'),
    default: String(inputFeatures.default ?? inputFeatures.defaultCredit ?? 'no'),
    housing: String(inputFeatures.housing ?? 'no'),
    loan: String(inputFeatures.loan ?? 'no'),
    contact: String(inputFeatures.contact ?? 'cellular'),
    month: String(inputFeatures.month ?? 'may'),
    poutcome: String(inputFeatures.poutcome ?? 'unknown')
  };

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let errorDetail = "Prediction request failed";
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errorDetail;
    } catch {
      // fallback
    }
    throw new Error(errorDetail);
  }

  return await response.json();
}
