import pandas as pd
import numpy as np
import joblib
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.config import (
    DATA_PATH, MODEL_DIR, PIPELINE_PATH,
    TARGET_COLUMN, TEST_SIZE, RANDOM_STATE
)

from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split


NUMERICAL_FEATURES = ["age", "annual_income", "vehicle_age", "engine_cc", "traffic_index"]
CATEGORICAL_FEATURES = ["occupation", "vehicle_type", "fuel_type", "city_tier"]


def load_data(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    print(f"✅ Data loaded — Shape: {df.shape}")
    return df


def build_pipeline() -> ColumnTransformer:
    numerical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler())
    ])

    categorical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])

    preprocessor = ColumnTransformer([
        ("num", numerical_pipeline, NUMERICAL_FEATURES),
        ("cat", categorical_pipeline, CATEGORICAL_FEATURES)
    ])

    return preprocessor


def preprocess(df: pd.DataFrame):
    X = df.drop(columns=[TARGET_COLUMN])
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE
    )

    preprocessor = build_pipeline()

    X_train_processed = preprocessor.fit_transform(X_train)
    X_test_processed = preprocessor.transform(X_test)

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(preprocessor, PIPELINE_PATH)

    print(f"✅ Preprocessing done")
    print(f"   Train shape : {X_train_processed.shape}")
    print(f"   Test shape  : {X_test_processed.shape}")
    print(f"   Pipeline saved to: {PIPELINE_PATH}")

    return X_train_processed, X_test_processed, y_train, y_test


if __name__ == "__main__":
    df = load_data(DATA_PATH)
    X_train, X_test, y_train, y_test = preprocess(df)