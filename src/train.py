import pandas as pd
import numpy as np
import joblib
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.config import (
    DATA_PATH, MODEL_PATH, PIPELINE_PATH,
    TARGET_COLUMN, RANDOM_STATE
)
from src.preprocess import load_data, preprocess

from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from xgboost import XGBRegressor
from lightgbm import LGBMRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error


def evaluate_model(model, X_test, y_test) -> dict:
    predictions = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    mae  = mean_absolute_error(y_test, predictions)
    r2   = r2_score(y_test, predictions)
    return {"RMSE": round(rmse, 2), "MAE": round(mae, 2), "R2": round(r2, 4)}


def get_models() -> dict:
    return {
        "LinearRegression": LinearRegression(),
        "Ridge": Ridge(alpha=1.0),
        "RandomForest": RandomForestRegressor(
            n_estimators=100, random_state=RANDOM_STATE, n_jobs=-1
        ),
        "GradientBoosting": GradientBoostingRegressor(
            n_estimators=100, random_state=RANDOM_STATE
        ),
        "XGBoost": XGBRegressor(
            n_estimators=100, random_state=RANDOM_STATE,
            verbosity=0, n_jobs=-1
        ),
        "LightGBM": LGBMRegressor(
            n_estimators=100, random_state=RANDOM_STATE,
            verbose=-1, n_jobs=-1
        ),
    }


def train_and_compare(X_train, X_test, y_train, y_test) -> tuple:
    models   = get_models()
    results  = {}
    best_model      = None
    best_model_name = ""
    best_r2         = -np.inf

    print("\n📊 Training & Evaluating Models...\n")
    print(f"{'Model':<22} {'RMSE':>10} {'MAE':>10} {'R2':>8}")
    print("-" * 55)

    for name, model in models.items():
        model.fit(X_train, y_train)
        metrics = evaluate_model(model, X_test, y_test)
        results[name] = metrics

        print(f"{name:<22} {metrics['RMSE']:>10} {metrics['MAE']:>10} {metrics['R2']:>8}")

        if metrics["R2"] > best_r2:
            best_r2         = metrics["R2"]
            best_model      = model
            best_model_name = name

    print("-" * 55)
    print(f"\n🏆 Best Model : {best_model_name}")
    print(f"   R2 Score   : {best_r2}")

    return best_model, best_model_name, results


def save_model(model, path: str) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    joblib.dump(model, path)
    print(f"\n✅ Best model saved to: {path}")


if __name__ == "__main__":
    df = load_data(DATA_PATH)
    X_train, X_test, y_train, y_test = preprocess(df)
    best_model, best_model_name, results = train_and_compare(
        X_train, X_test, y_train, y_test
    )
    save_model(best_model, MODEL_PATH)
    