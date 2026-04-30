# 🚗 Annual Mileage Predictor

> AI-powered vehicle mileage prediction system for insurance premium pricing

![ML](https://img.shields.io/badge/ML-XGBoost-blue)
![R2](https://img.shields.io/badge/R²%20Score-0.91-brightgreen)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)

## 🎯 Problem Statement
Insurance companies charge different premiums based on how much a customer drives. Customers often misreport their mileage. This ML system predicts the actual annual kilometres a vehicle will be driven based on owner profile, vehicle details, and location, enabling accurate and fair premium pricing.

## 🏗️ Architecture
User Input → Next.js Frontend → FastAPI Backend → ML Model → Prediction + Risk Category

## ⚡ Features
- Predicts annual vehicle mileage with R² = 0.91
- 4-tier risk classification (Low / Medium / High / Very High)
- Dark glassmorphism UI
- REST API for system integration
- Production-ready ML pipeline

## 🧠 ML Pipeline
- Dataset: 10,000 synthetic rows with real-world insurance logic
- Features: Age, occupation, income, vehicle type, fuel type, city tier, traffic index
- Models trained: Linear Regression, Ridge, Random Forest, Gradient Boosting, XGBoost, LightGBM
- Best model: Linear Regression (R² = 0.91, RMSE = 3,520)
- Pipeline: Imputation → Encoding → Scaling → Prediction

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 16, Tailwind CSS, Framer Motion |
| Backend | FastAPI, Python 3.11 |
| ML | Scikit-learn, XGBoost, LightGBM |
| Deployment | Vercel (frontend), Render (backend) |

## 📁 Project Structure
annual-mileage-predictor/
├── src/
│   ├── generate_data.py
│   ├── preprocess.py
│   ├── train.py
│   ├── predict.py
│   ├── config.py
│   ├── api/app.py
│   └── app/streamlit_app.py
├── mileage-predictor-ui/
├── data/
├── models/
├── requirements.txt
└── Dockerfile
## 🚀 Run Locally

### Backend
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python src/generate_data.py
python src/preprocess.py
python src/train.py
uvicorn src.api.app:app --reload --port 8000
```

### Frontend
```bash
cd mileage-predictor-ui
npm install
npm run dev
```

Open http://localhost:3000

## 📊 Model Performance
| Model | RMSE | R² |
|---|---|---|
| Linear Regression | 3,520 | 0.91 |
| Ridge | 3,520 | 0.91 |
| Random Forest | 3,713 | 0.90 |
| LightGBM | 3,604 | 0.91 |
| XGBoost | 3,768 | 0.90 |

## 🔗 API Usage
```bash
POST /predict
{
  "age": 35,
  "occupation": "salaried",
  "annual_income": 700000,
  "vehicle_type": "sedan",
  "vehicle_age": 3,
  "engine_cc": 1500,
  "fuel_type": "petrol",
  "city_tier": 1,
  "traffic_index": 0.75
}
```
## 👩‍💻 Author
Built by Aabhav Amitabh


