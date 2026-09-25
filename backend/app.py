import os
import json
import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Initialize FastAPI App
app = FastAPI(
    title="DepositIQ AI - Term Deposit Prediction Engine",
    description="Inference API for Scikit-Learn 16-Feature ColumnTransformer + Logistic Regression Pipeline trained on Bank Marketing dataset.",
    version="2.3.0"
)

# Enable CORS for local dev servers
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# File Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "trained_model.pkl")
METADATA_PATH = os.path.join(BASE_DIR, "model_metadata.json")
COMPARISON_PATH = os.path.join(BASE_DIR, "model_comparison.json")

# Global variables loaded on startup
model = None
metadata = {}
comparison_data = {}

def load_artifacts():
    global model, metadata, comparison_data
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            print(f"[INFO] Successfully loaded sklearn Pipeline from {MODEL_PATH}")
        except Exception as e:
            print(f"[ERROR] Failed to load model pipeline: {e}")
            model = None
    else:
        print(f"[WARNING] Model file not found at {MODEL_PATH}")

    if os.path.exists(METADATA_PATH):
        try:
            with open(METADATA_PATH, "r") as f:
                metadata = json.load(f)
            print(f"[INFO] Successfully loaded metadata from {METADATA_PATH}")
        except Exception as e:
            print(f"[ERROR] Failed to load metadata: {e}")
            metadata = {}

    if os.path.exists(COMPARISON_PATH):
        try:
            with open(COMPARISON_PATH, "r") as f:
                comparison_data = json.load(f)
            print(f"[INFO] Successfully loaded comparison metrics from {COMPARISON_PATH}")
        except Exception as e:
            print(f"[ERROR] Failed to load comparison metrics: {e}")
            comparison_data = {}

@app.on_event("startup")
def startup_event():
    load_artifacts()

class PredictionRequest(BaseModel):
    # Numerical Features (7)
    age: float = Field(default=41.0, ge=18, le=100, description="Customer age in years (18-100)")
    balance: float = Field(default=1362.0, description="Average yearly account balance in EUR")
    day: int = Field(default=15, ge=1, le=31, description="Last contact day of the month (1-31)")
    duration: float = Field(default=258.0, ge=0, description="Last contact call duration in seconds")
    campaign: int = Field(default=2, ge=1, description="Number of contact attempts during current campaign")
    pdays: int = Field(default=-1, description="Days passed after customer was last contacted (-1 = not contacted)")
    previous: int = Field(default=0, ge=0, description="Number of contacts performed before current campaign")

    # Categorical Features (9)
    job: str = Field(default="management", description="Job profile type")
    marital: str = Field(default="married", description="Marital status")
    education: str = Field(default="tertiary", description="Education level")
    default: str = Field(default="no", description="Credit in default status (yes/no)")
    housing: str = Field(default="no", description="Has housing loan (yes/no)")
    loan: str = Field(default="no", description="Has personal loan (yes/no)")
    contact: str = Field(default="cellular", description="Communication contact type")
    month: str = Field(default="may", description="Last contact month of year")
    poutcome: str = Field(default="unknown", description="Outcome of previous marketing campaign")

    class Config:
        json_schema_extra = {
            "example": {
                "age": 41.0,
                "job": "management",
                "marital": "married",
                "education": "tertiary",
                "default": "no",
                "balance": 1362.0,
                "housing": "no",
                "loan": "no",
                "contact": "cellular",
                "day": 15,
                "month": "may",
                "duration": 258.0,
                "campaign": 2,
                "pdays": -1,
                "previous": 0,
                "poutcome": "unknown"
            }
        }

@app.get("/")
def read_root():
    return {
        "service": "DepositPulse AI - Term Deposit Prediction Engine",
        "status": "online",
        "version": "2.2.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "service": "DepositPulse AI Engine"
    }

@app.get("/model-info")
def get_model_info():
    if not metadata:
        raise HTTPException(status_code=404, detail="Model metadata not loaded.")
    return metadata

@app.get("/model-metrics")
def get_model_metrics():
    if not metadata:
        raise HTTPException(status_code=404, detail="Model metadata not loaded.")
    return {
        "accuracy": metadata.get("accuracy"),
        "precision": metadata.get("precision"),
        "recall": metadata.get("recall"),
        "f1_score": metadata.get("f1_score"),
        "roc_auc": metadata.get("roc_auc"),
        "confusion_matrix": metadata.get("confusion_matrix"),
        "class_names": metadata.get("class_names"),
        "target_imbalance": metadata.get("target_imbalance"),
        "roc_points": metadata.get("roc_points", [])
    }

@app.get("/feature-analysis")
def get_feature_analysis():
    if not metadata:
        raise HTTPException(status_code=404, detail="Model metadata not loaded.")
    return {
        "features": metadata.get("all_features", []),
        "encoded_feature_names": metadata.get("encoded_feature_names", []),
        "coefficients": metadata.get("coefficients", []),
        "intercept": metadata.get("intercept", 0.0),
        "feature_analysis": metadata.get("feature_analysis", [])
    }

@app.get("/model-comparison")
def get_model_comparison():
    if not comparison_data:
        raise HTTPException(status_code=404, detail="Model comparison data not loaded.")
    return comparison_data

@app.post("/predict")
def predict_term_deposit(request: PredictionRequest):
    if model is None:
        load_artifacts()
        if model is None:
            raise HTTPException(status_code=500, detail="Trained ML model pipeline is not loaded.")

    try:
        # Construct DataFrame matching exact 16-feature schema
        row_dict = {
            "age": request.age,
            "balance": request.balance,
            "day": request.day,
            "duration": request.duration,
            "campaign": request.campaign,
            "pdays": request.pdays,
            "previous": request.previous,
            "job": request.job,
            "marital": request.marital,
            "education": request.education,
            "default": request.default,
            "housing": request.housing,
            "loan": request.loan,
            "contact": request.contact,
            "month": request.month,
            "poutcome": request.poutcome
        }
        input_data = pd.DataFrame([row_dict])

        # Execute direct model inference
        pred_class = int(model.predict(input_data)[0])
        probabilities = model.predict_proba(input_data)[0]

        prob_0 = float(probabilities[0])  # Class 0: Not Subscribed
        prob_1 = float(probabilities[1])  # Class 1: Subscribed

        prob_0_pct = round(prob_0 * 100, 2)
        prob_1_pct = round(prob_1 * 100, 2)

        decision = "SUBSCRIBED" if pred_class == 1 else "NOT SUBSCRIBED"

        # Extract transformed encoded feature contributions
        feature_contributions = []
        try:
            preproc = model.named_steps["preprocessor"]
            lr_model = model.named_steps["model"]

            encoded_names = preproc.get_feature_names_out()
            transformed_vals = preproc.transform(input_data)[0]
            coefs = lr_model.coef_[0]

            for name, val, c in zip(encoded_names, transformed_vals, coefs):
                clean_name = name.replace("num__", "").replace("cat__", "")
                contrib = float(val * c)
                if abs(contrib) > 0.001:  # Only report active contributions
                    feature_contributions.append({
                        "feature": clean_name,
                        "encoded_name": name,
                        "value": float(val),
                        "coefficient": round(float(c), 6),
                        "log_odds_contribution": round(contrib, 4),
                        "direction": "positive" if contrib > 0 else "negative"
                    })
            
            # Sort contributions by absolute impact
            feature_contributions.sort(key=lambda x: abs(x["log_odds_contribution"]), reverse=True)
        except Exception as ex:
            print(f"[WARNING] Could not compute encoded feature contribution: {ex}")
            feature_contributions = []

        return {
            "prediction": pred_class,
            "decision": decision,
            "subscription_probability": round(prob_1, 4),
            "not_subscription_probability": round(prob_0, 4),
            "subscription_probability_percent": prob_1_pct,
            "not_subscription_probability_percent": prob_0_pct,
            # Backward compatibility fields
            "probability": round(prob_1, 4),
            "probability_percent": prob_1_pct,
            "model": metadata.get("algorithm", "Logistic Regression"),
            "accuracy": metadata.get("accuracy", 89.20),
            "roc_auc": metadata.get("roc_auc", 90.75),
            "features_used": row_dict,
            "feature_contributions": feature_contributions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")
