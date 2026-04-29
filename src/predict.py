import pandas as pd
import numpy as np
import joblib
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.config import MODEL_PATH, PIPELINE_PATH


def load_model():
    model    = joblib.load(MODEL_PATH)
    pipeline = joblib.load(PIPELINE_PATH)
    return model, pipeline


def prepare_input(input_dict: dict) -> pd.DataFrame:
    df = pd.DataFrame([input_dict])
    expected_cols = [
        "age", "occupation", "annual_income",
        "vehicle_type", "vehicle_age", "engine_cc",
        "fuel_type", "city_tier", "traffic_index"
    ]
    df = df[expected_cols]
    return df


def predict(input_dict: dict) -> dict:
    model, pipeline = load_model()
    input_df        = prepare_input(input_dict)
    processed       = pipeline.transform(input_df)
    prediction      = model.predict(processed)[0]
    prediction      = max(0, round(float(prediction), 2))

    return {
        "predicted_annual_kms": prediction,
        "predicted_monthly_kms": round(prediction / 12, 2),
        "risk_category": classify_risk(prediction)
    }


def classify_risk(kms: float) -> str:
    if kms < 10000:
        return "Low Risk"
    elif kms < 20000:
        return "Medium Risk"
    elif kms < 35000:
        return "High Risk"
    else:
        return "Very High Risk"


if __name__ == "__main__":
    sample_input = {
        "age":            35,
        "occupation":     "salaried",
        "annual_income":  700000,
        "vehicle_type":   "sedan",
        "vehicle_age":    3,
        "engine_cc":      1500,
        "fuel_type":      "petrol",
        "city_tier":      1,
        "traffic_index":  0.75
    }

    print("\n🔍 Sample Input:")
    for k, v in sample_input.items():
        print(f"   {k}: {v}")

    result = predict(sample_input)

    print("\n✅ Prediction Result:")
    print(f"   Annual KMs     : {result['predicted_annual_kms']:,}")
    print(f"   Monthly KMs    : {result['predicted_monthly_kms']:,}")
    print(f"   Risk Category  : {result['risk_category']}")