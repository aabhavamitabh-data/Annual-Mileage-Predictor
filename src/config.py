import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models")

DATA_PATH = os.path.join(DATA_DIR, "mileage_data.csv")
MODEL_PATH = os.path.join(MODEL_DIR, "best_model.pkl")
PIPELINE_PATH = os.path.join(MODEL_DIR, "preprocessing_pipeline.pkl")

RANDOM_STATE = 42
TEST_SIZE = 0.2
TARGET_COLUMN = "annual_kms"
