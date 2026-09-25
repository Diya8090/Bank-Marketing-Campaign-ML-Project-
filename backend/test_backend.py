import os
import json
import joblib
import pandas as pd
import numpy as np
from fastapi.testclient import TestClient
from app import app, MODEL_PATH

def run_tests():
    print("[INFO] Starting Comprehensive 16-Feature ML Pipeline & API Test Suite...")
    with TestClient(app) as client:
        # Test 1: Health Check Endpoint
        response = client.get("/health")
        assert response.status_code == 200, f"Health endpoint failed: {response.status_code}"
        health_data = response.json()
        assert health_data["status"] == "ok", "Health status is not ok"
        assert health_data["model_loaded"] is True, "Model is not loaded"
        print("[PASS] GET /health endpoint test passed!")

        # Test 2: Model Metadata Endpoint
        response = client.get("/model-info")
        assert response.status_code == 200, f"Model info endpoint failed: {response.status_code}"
        info = response.json()
        assert "accuracy" in info, "Metadata missing accuracy"
        assert "coefficients" in info, "Metadata missing coefficients"
        assert len(info["all_features"]) == 16, f"Expected 16 features in metadata, got {len(info['all_features'])}"
        print(f"[PASS] GET /model-info passed (Accuracy: {info['accuracy']}%, ROC-AUC: {info['roc_auc']}%)")

        # Test 3: Model Metrics Endpoint
        response = client.get("/model-metrics")
        assert response.status_code == 200, f"Model metrics endpoint failed: {response.status_code}"
        metrics = response.json()
        assert "confusion_matrix" in metrics, "Metrics missing confusion_matrix"
        assert "roc_points" in metrics, "Metrics missing roc_points"
        print("[PASS] GET /model-metrics passed!")

        # Test 4: Feature Analysis Endpoint
        response = client.get("/feature-analysis")
        assert response.status_code == 200, f"Feature analysis endpoint failed: {response.status_code}"
        fa = response.json()
        assert len(fa["features"]) == 16, f"Expected 16 features, got {len(fa['features'])}"
        print("[PASS] GET /feature-analysis passed!")

        # Test 5: Model Comparison Endpoint
        response = client.get("/model-comparison")
        assert response.status_code == 200, f"Model comparison endpoint failed: {response.status_code}"
        comp = response.json()
        assert len(comp["models"]) >= 5, "Expected at least 5 benchmarked models"
        print("[PASS] GET /model-comparison passed!")

        # Test 6: Direct Sklearn vs FastAPI Prediction Verification across 10 Diverse 16-Feature Test Cases
        pipeline = joblib.load(MODEL_PATH)

        test_cases = [
            {
                "name": "Average Benchmark Lead",
                "inputs": {
                    "age": 41.0, "job": "management", "marital": "married", "education": "tertiary",
                    "default": "no", "balance": 1362.0, "housing": "no", "loan": "no",
                    "contact": "cellular", "day": 15, "month": "may", "duration": 258.0,
                    "campaign": 2, "pdays": -1, "previous": 0, "poutcome": "unknown"
                }
            },
            {
                "name": "Previous Campaign Success Lead",
                "inputs": {
                    "age": 45.0, "job": "technician", "marital": "single", "education": "tertiary",
                    "default": "no", "balance": 4500.0, "housing": "no", "loan": "no",
                    "contact": "cellular", "day": 12, "month": "oct", "duration": 480.0,
                    "campaign": 1, "pdays": 90, "previous": 2, "poutcome": "success"
                }
            },
            {
                "name": "High VIP Prospect",
                "inputs": {
                    "age": 52.0, "job": "entrepreneur", "marital": "married", "education": "tertiary",
                    "default": "no", "balance": 12500.0, "housing": "no", "loan": "no",
                    "contact": "cellular", "day": 20, "month": "aug", "duration": 600.0,
                    "campaign": 1, "pdays": -1, "previous": 0, "poutcome": "unknown"
                }
            },
            {
                "name": "Low Engagement Blue-Collar",
                "inputs": {
                    "age": 33.0, "job": "blue-collar", "marital": "married", "education": "secondary",
                    "default": "no", "balance": 120.0, "housing": "yes", "loan": "yes",
                    "contact": "unknown", "day": 5, "month": "may", "duration": 65.0,
                    "campaign": 6, "pdays": -1, "previous": 0, "poutcome": "unknown"
                }
            },
            {
                "name": "Retired Senior Saver",
                "inputs": {
                    "age": 68.0, "job": "retired", "marital": "married", "education": "secondary",
                    "default": "no", "balance": 6400.0, "housing": "no", "loan": "no",
                    "contact": "cellular", "day": 18, "month": "mar", "duration": 320.0,
                    "campaign": 1, "pdays": -1, "previous": 0, "poutcome": "unknown"
                }
            },
            {
                "name": "Student High Interest",
                "inputs": {
                    "age": 22.0, "job": "student", "marital": "single", "education": "secondary",
                    "default": "no", "balance": 800.0, "housing": "no", "loan": "no",
                    "contact": "cellular", "day": 10, "month": "sep", "duration": 400.0,
                    "campaign": 1, "pdays": -1, "previous": 0, "poutcome": "unknown"
                }
            },
            {
                "name": "High Contact Fatigue",
                "inputs": {
                    "age": 40.0, "job": "services", "marital": "married", "education": "secondary",
                    "default": "no", "balance": 250.0, "housing": "yes", "loan": "no",
                    "contact": "cellular", "day": 28, "month": "jul", "duration": 90.0,
                    "campaign": 15, "pdays": -1, "previous": 0, "poutcome": "unknown"
                }
            },
            {
                "name": "Very Short Call Low Balance",
                "inputs": {
                    "age": 29.0, "job": "unemployed", "marital": "single", "education": "primary",
                    "default": "yes", "balance": -200.0, "housing": "yes", "loan": "yes",
                    "contact": "unknown", "day": 2, "month": "may", "duration": 15.0,
                    "campaign": 4, "pdays": -1, "previous": 0, "poutcome": "unknown"
                }
            }
        ]

        print("\n--- 16-FEATURE INFERENCE & PROBABILITY CALIBRATION TEST RESULTS ---")
        prob_list = []

        for idx, tc in enumerate(test_cases, 1):
            name = tc["name"]
            inp = tc["inputs"]

            # 1. Direct Sklearn Pipeline Prediction
            input_df = pd.DataFrame([inp])
            direct_pred = int(pipeline.predict(input_df)[0])
            direct_probas = pipeline.predict_proba(input_df)[0]
            direct_prob_0 = float(direct_probas[0])
            direct_prob_1 = float(direct_probas[1])

            # 2. FastAPI Endpoint Response
            res = client.post("/predict", json=inp)
            assert res.status_code == 200, f"Predict API failed for {name}: {res.status_code}"
            api_data = res.json()

            api_pred = api_data["prediction"]
            api_prob_0 = api_data["not_subscription_probability"]
            api_prob_1 = api_data["subscription_probability"]

            # 3. Floating-Point Tolerance Check (< 0.0001)
            assert direct_pred == api_pred, f"Prediction mismatch for {name}: Sklearn {direct_pred} vs API {api_pred}"
            assert abs(direct_prob_0 - api_prob_0) < 0.0001, f"Not Subscribed Prob mismatch for {name}"
            assert abs(direct_prob_1 - api_prob_1) < 0.0001, f"Subscribed Prob mismatch for {name}"

            # 4. Probabilities Sum Check (prob_0 + prob_1 ≈ 1.0)
            prob_sum = api_prob_0 + api_prob_1
            assert abs(prob_sum - 1.0) < 0.001, f"Probabilities do not sum to 1.0 for {name}: {prob_sum}"

            prob_list.append(api_prob_1)

            print(f"Test {idx:02d} [{name}]:")
            print(f"   FastAPI API   : Pred={api_pred} ({api_data['decision']}), P(Sub)={api_prob_1*100:.2f}%, P(NotSub)={api_prob_0*100:.2f}%")
            print(f"   Probability Sum: {prob_sum*100:.2f}% [VERIFIED]\n")

        # 5. Check probability variability across diverse test inputs
        min_prob = min(prob_list)
        max_prob = max(prob_list)
        unique_probs = len(set(prob_list))

        print(f"--- PROBABILITY VARIABILITY ANALYSIS ---")
        print(f"Minimum Subscription Probability: {min_prob*100:.2f}%")
        print(f"Maximum Subscription Probability: {max_prob*100:.2f}%")
        print(f"Unique Probability Values across Test Cases: {unique_probs} / {len(test_cases)}")

        assert unique_probs >= 6, f"Probabilities are not varying sufficiently! Unique count: {unique_probs}"
        assert min_prob < 0.05, f"Expected low minimum probability, got {min_prob}"
        assert max_prob > 0.80, f"Expected high maximum probability, got {max_prob}"

        print("\n[SUCCESS] ALL 16-FEATURE INFERENCE & PROBABILITY CALIBRATION TESTS PASSED 100% CLEANLY!")

if __name__ == "__main__":
    run_tests()
