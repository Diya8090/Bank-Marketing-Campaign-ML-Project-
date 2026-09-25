import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    roc_curve
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
RAW_DATA_PATH = os.path.join(PROJECT_DIR, "bank-full.csv")

NUMERICAL_FEATURES = ["age", "balance", "day", "duration", "campaign", "pdays", "previous"]
CATEGORICAL_FEATURES = ["job", "marital", "education", "default", "housing", "loan", "contact", "month", "poutcome"]
ALL_FEATURES = NUMERICAL_FEATURES + CATEGORICAL_FEATURES

def create_preprocessor():
    return ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERICAL_FEATURES),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL_FEATURES)
        ]
    )

def run_experiments():
    print(f"[INFO] Loading dataset from {RAW_DATA_PATH}...")
    if not os.path.exists(RAW_DATA_PATH):
        raise FileNotFoundError(f"Dataset file not found at {RAW_DATA_PATH}")

    df = pd.read_csv(RAW_DATA_PATH, sep=";")
    df["target"] = (df["y"] == "yes").astype(int)

    X = df[ALL_FEATURES]
    y = df["target"]

    # Stratified Train-Test Split (reproducible seed=42)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"[INFO] Total Dataset Rows: {len(df)} | Train: {len(X_train)} | Test: {len(X_test)}")

    # Features list for no-duration model
    no_dur_num = [f for f in NUMERICAL_FEATURES if f != "duration"]
    no_dur_features = no_dur_num + CATEGORICAL_FEATURES
    preprocessor_no_dur = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), no_dur_num),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL_FEATURES)
        ]
    )

    # 4-feature legacy preprocessor
    preprocessor_4feat = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), ["age", "balance", "duration", "campaign"])
        ]
    )

    candidate_configs = [
        {
            "id": "standard_lr_16",
            "name": "Calibrated Weighted Logistic Regression (16-Feature Pipeline - Production)",
            "pipeline": Pipeline([
                ("preprocessor", create_preprocessor()),
                ("model", LogisticRegression(class_weight={0: 1.0, 1: 3.2}, C=1.0, random_state=42, max_iter=1000))
            ]),
            "features": ALL_FEATURES,
            "has_duration": True
        },
        {
            "id": "baseline_lr_16",
            "name": "Baseline Unweighted Logistic Regression (16 Features)",
            "pipeline": Pipeline([
                ("preprocessor", create_preprocessor()),
                ("model", LogisticRegression(random_state=42, max_iter=1000))
            ]),
            "features": ALL_FEATURES,
            "has_duration": True
        },
        {
            "id": "random_forest_16",
            "name": "Random Forest Classifier (16 Features, max_depth=10)",
            "pipeline": Pipeline([
                ("preprocessor", create_preprocessor()),
                ("model", RandomForestClassifier(n_estimators=100, max_depth=10, class_weight={0: 1.0, 1: 3.0}, random_state=42))
            ]),
            "features": ALL_FEATURES,
            "has_duration": True
        },
        {
            "id": "gradient_boosting_16",
            "name": "Gradient Boosting Classifier (16 Features, max_depth=5)",
            "pipeline": Pipeline([
                ("preprocessor", create_preprocessor()),
                ("model", GradientBoostingClassifier(n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42))
            ]),
            "features": ALL_FEATURES,
            "has_duration": True
        },
        {
            "id": "no_duration_lr_16",
            "name": "Pre-Call Targeting Model (Without Duration - 15 Features)",
            "pipeline": Pipeline([
                ("preprocessor", preprocessor_no_dur),
                ("model", LogisticRegression(class_weight={0: 1.0, 1: 3.2}, C=1.0, random_state=42, max_iter=1000))
            ]),
            "features": no_dur_features,
            "has_duration": False
        },
        {
            "id": "legacy_4feat_lr",
            "name": "Legacy 4-Feature Logistic Regression (Age, Balance, Duration, Campaign)",
            "pipeline": Pipeline([
                ("preprocessor", preprocessor_4feat),
                ("model", LogisticRegression(class_weight={0: 1.0, 1: 3.2}, C=1.0, random_state=42, max_iter=1000))
            ]),
            "features": ["age", "balance", "duration", "campaign"],
            "has_duration": True
        }
    ]

    comparison_results = []

    for cfg in candidate_configs:
        feats = cfg["features"]
        pipe = cfg["pipeline"]

        X_tr = X_train[feats]
        X_te = X_test[feats]

        pipe.fit(X_tr, y_train)
        y_pred = pipe.predict(X_te)
        y_proba = pipe.predict_proba(X_te)[:, 1]

        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred, zero_division=0))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))
        auc = float(roc_auc_score(y_test, y_proba))
        cm = confusion_matrix(y_test, y_pred).tolist()

        res_item = {
            "id": cfg["id"],
            "name": cfg["name"],
            "features_count": len(feats),
            "accuracy": round(acc * 100, 2),
            "accuracy_raw": acc,
            "precision": round(prec * 100, 2),
            "precision_raw": prec,
            "recall": round(rec * 100, 2),
            "recall_raw": rec,
            "f1_score": round(f1 * 100, 2),
            "f1_raw": f1,
            "roc_auc": round(auc * 100, 2),
            "roc_auc_raw": auc,
            "confusion_matrix": cm,
            "has_duration": cfg["has_duration"],
            "isSelected": cfg["id"] == "standard_lr_16"
        }
        comparison_results.append(res_item)
        print(f"-> {cfg['name']}: Accuracy={res_item['accuracy']}% | Recall={res_item['recall']}% | F1={res_item['f1_score']}% | AUC={res_item['roc_auc']}%")

    # Selected Production Model: 16-feature Pipeline
    selected_cfg = next(c for c in candidate_configs if c["id"] == "standard_lr_16")
    final_pipeline = selected_cfg["pipeline"]
    final_pipeline.fit(X_train[ALL_FEATURES], y_train)

    y_pred_final = final_pipeline.predict(X_test[ALL_FEATURES])
    y_proba_final = final_pipeline.predict_proba(X_test[ALL_FEATURES])[:, 1]

    acc = float(accuracy_score(y_test, y_pred_final))
    prec = float(precision_score(y_test, y_pred_final, zero_division=0))
    rec = float(recall_score(y_test, y_pred_final, zero_division=0))
    f1 = float(f1_score(y_test, y_pred_final, zero_division=0))
    auc = float(roc_auc_score(y_test, y_proba_final))
    cm = confusion_matrix(y_test, y_pred_final).tolist()

    fpr, tpr, _ = roc_curve(y_test, y_proba_final)
    indices = np.linspace(0, len(fpr) - 1, 25, dtype=int)
    roc_points = [{"fpr": round(float(fpr[i]), 4), "tpr": round(float(tpr[i]), 4)} for i in indices]

    preproc = final_pipeline.named_steps["preprocessor"]
    lr_model = final_pipeline.named_steps["model"]

    encoded_feature_names = preproc.get_feature_names_out().tolist()
    coefs = lr_model.coef_[0].tolist()
    intercept = float(lr_model.intercept_[0])

    feature_analysis = []
    for feat_name, coef_val in zip(encoded_feature_names, coefs):
        clean_name = feat_name.replace("num__", "").replace("cat__", "")
        or_val = float(np.exp(coef_val))
        feature_analysis.append({
            "feature": clean_name,
            "raw_feature_name": feat_name,
            "coefficient": round(float(coef_val), 6),
            "odds_ratio": round(or_val, 4),
            "direction": "positive" if coef_val > 0 else "negative"
        })

    # Sort feature analysis by magnitude of coefficient
    feature_analysis.sort(key=lambda x: abs(x["coefficient"]), reverse=True)

    class_counts = y.value_counts().to_dict()
    neg_count = int(class_counts.get(0, 0))
    pos_count = int(class_counts.get(1, 0))
    total_count = neg_count + pos_count

    metadata = {
        "model_name": "DepositPulse AI 16-Feature Scikit-Learn Pipeline",
        "algorithm": "Logistic Regression (Class-Weighted)",
        "preprocessing": "ColumnTransformer (StandardScaler on 7 Numeric + OneHotEncoder on 9 Categorical)",
        "solver": "lbfgs",
        "penalty": "l2",
        "C": 1.0,
        "class_weight": {0: 1.0, 1: 3.2},
        "random_state": 42,
        "train_test_ratio": "80/20 Stratified Split",
        "accuracy": round(acc * 100, 2),
        "accuracy_raw": acc,
        "precision": round(prec * 100, 2),
        "precision_raw": prec,
        "recall": round(rec * 100, 2),
        "recall_raw": rec,
        "f1_score": round(f1 * 100, 2),
        "f1_raw": f1,
        "roc_auc": round(auc * 100, 2),
        "roc_auc_raw": auc,
        "confusion_matrix": cm,
        "class_names": ["NOT SUBSCRIBED (0)", "SUBSCRIBED (1)"],
        "target_imbalance": {
            "negative_class_0": neg_count,
            "positive_class_1": pos_count,
            "negative_percent": round((neg_count / total_count) * 100, 2),
            "positive_percent": round((pos_count / total_count) * 100, 2)
        },
        "numerical_features": NUMERICAL_FEATURES,
        "categorical_features": CATEGORICAL_FEATURES,
        "all_features": ALL_FEATURES,
        "encoded_feature_names": encoded_feature_names,
        "coefficients": [round(c, 6) for c in coefs],
        "intercept": round(intercept, 6),
        "feature_analysis": feature_analysis,
        "dataset_rows": total_count,
        "training_rows": len(X_train),
        "test_rows": len(X_test),
        "roc_points": roc_points
    }

    model_file = os.path.join(BASE_DIR, "trained_model.pkl")
    joblib.dump(final_pipeline, model_file)
    print(f"[SUCCESS] Saved 16-feature trained Pipeline (Accuracy: {metadata['accuracy']}%, F1: {metadata['f1_score']}%, ROC-AUC: {metadata['roc_auc']}%) to {model_file}")

    meta_file = os.path.join(BASE_DIR, "model_metadata.json")
    with open(meta_file, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"[SUCCESS] Saved model metadata to {meta_file}")

    comp_file = os.path.join(BASE_DIR, "model_comparison.json")
    comp_payload = {"models": comparison_results}
    with open(comp_file, "w") as f:
        json.dump(comp_payload, f, indent=2)
    print(f"[SUCCESS] Saved model comparison metrics to {comp_file}")

if __name__ == "__main__":
    run_experiments()
