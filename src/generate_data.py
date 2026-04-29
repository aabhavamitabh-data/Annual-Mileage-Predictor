import pandas as pd
import numpy as np
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.config import DATA_PATH, RANDOM_STATE

np.random.seed(RANDOM_STATE)


def generate_mileage_dataset(n_rows: int = 10000) -> pd.DataFrame:

    occupation = np.random.choice(
        ["salaried", "self_employed", "business", "student", "retired"],
        n_rows, p=[0.40, 0.25, 0.20, 0.10, 0.05]
    )

    annual_income = np.where(
        occupation == "salaried",      np.random.normal(600000,  80000, n_rows),
        np.where(
        occupation == "self_employed", np.random.normal(800000,  100000, n_rows),
        np.where(
        occupation == "business",      np.random.normal(1200000, 150000, n_rows),
        np.where(
        occupation == "student",       np.random.normal(150000,  20000,  n_rows),
                                       np.random.normal(300000,  40000,  n_rows)
        ))))
    annual_income = np.clip(annual_income, 80000, 5000000).astype(int)

    vehicle_type = np.random.choice(
        ["hatchback", "sedan", "suv", "truck", "two_wheeler"],
        n_rows, p=[0.30, 0.25, 0.20, 0.10, 0.15]
    )

    vehicle_age = np.random.randint(0, 20, n_rows)

    engine_cc = np.where(
        vehicle_type == "two_wheeler", np.random.choice([100, 125, 150, 200], n_rows),
        np.where(
        vehicle_type == "hatchback",   np.random.choice([800, 1000, 1200], n_rows),
        np.where(
        vehicle_type == "sedan",       np.random.choice([1200, 1500, 1800], n_rows),
        np.where(
        vehicle_type == "suv",         np.random.choice([1500, 2000, 2500], n_rows),
                                       np.random.choice([2500, 3000, 3500], n_rows)
        ))))

    fuel_type = np.random.choice(
        ["petrol", "diesel", "cng", "electric"],
        n_rows, p=[0.45, 0.30, 0.15, 0.10]
    )

    age = np.random.randint(18, 70, n_rows)
    city_tier = np.random.choice([1, 2, 3], n_rows, p=[0.35, 0.40, 0.25])

    traffic_index = np.where(
        city_tier == 1, np.random.uniform(0.6, 1.0, n_rows),
        np.where(
        city_tier == 2, np.random.uniform(0.3, 0.7, n_rows),
                        np.random.uniform(0.1, 0.4, n_rows)
        ))

    # --- Strong direct mapping to annual_kms ---
    annual_kms = np.zeros(n_rows)

    # Occupation is the strongest signal
    occ_base = {
        "business":      38000,
        "self_employed": 28000,
        "salaried":      20000,
        "student":       10000,
        "retired":        7000
    }
    for occ, base in occ_base.items():
        mask = occupation == occ
        annual_kms[mask] = base

    # Income: every 100k above 400k adds 500 kms
    annual_kms += ((annual_income - 400000) / 100000) * 500

    # City tier
    annual_kms += np.where(city_tier == 1, -3000,
                  np.where(city_tier == 2,  0, 2500))

    # Vehicle type
    annual_kms += np.where(vehicle_type == "truck",      7000,
                  np.where(vehicle_type == "suv",        3500,
                  np.where(vehicle_type == "sedan",      1500,
                  np.where(vehicle_type == "hatchback",     0,
                                                         -4500))))

    # Vehicle age: older = less usage
    annual_kms -= vehicle_age * 250

    # Traffic
    annual_kms -= traffic_index * 2000

    # Tiny noise — only 500 std (very small)
    annual_kms += np.random.normal(0, 3500, n_rows)
    annual_kms = np.clip(annual_kms, 2000, 80000).astype(int)

    df = pd.DataFrame({
        "age":           age,
        "occupation":    occupation,
        "annual_income": annual_income,
        "vehicle_type":  vehicle_type,
        "vehicle_age":   vehicle_age,
        "engine_cc":     engine_cc,
        "fuel_type":     fuel_type,
        "city_tier":     city_tier,
        "traffic_index": traffic_index.round(3),
        "annual_kms":    annual_kms
    })

    # Mild missing values only
    for col, pct in [("annual_income", 0.02), ("engine_cc", 0.02), ("traffic_index", 0.02)]:
        missing_idx = np.random.choice(df.index, size=int(n_rows * pct), replace=False)
        df.loc[missing_idx, col] = np.nan

    return df


def save_dataset(df: pd.DataFrame) -> None:
    os.makedirs(os.path.dirname(DATA_PATH), exist_ok=True)
    df.to_csv(DATA_PATH, index=False)
    print(f"✅ Dataset saved — Shape: {df.shape}")
    print(f"\nTarget stats:\n{df['annual_kms'].describe()}")
    print(f"\nMissing values:\n{df.isnull().sum()}")


if __name__ == "__main__":
    df = generate_mileage_dataset(n_rows=10000)
    save_dataset(df)
