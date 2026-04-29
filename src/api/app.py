from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.predict import predict

app = FastAPI(
    title="Annual Mileage Predictor API",
    description="ML-powered vehicle mileage prediction for insurance pricing",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    age:            int   = Field(..., ge=18, le=70,      example=35)
    occupation:     str   = Field(...,                    example="salaried")
    annual_income:  int   = Field(..., ge=80000,          example=700000)
    vehicle_type:   str   = Field(...,                    example="sedan")
    vehicle_age:    int   = Field(..., ge=0, le=20,       example=3)
    engine_cc:      int   = Field(...,                    example=1500)
    fuel_type:      str   = Field(...,                    example="petrol")
    city_tier:      int   = Field(..., ge=1, le=3,        example=1)
    traffic_index:  float = Field(..., ge=0.0, le=1.0,   example=0.75)

class PredictionResponse(BaseModel):
    predicted_annual_kms:  float
    predicted_monthly_kms: float
    risk_category:         str
    status:                str = "success"

@app.get("/")
def root():
    return {"message": "Mileage Predictor API is running ✅"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/predict", response_model=PredictionResponse)
def predict_mileage(request: PredictionRequest):
    try:
        result = predict(request.dict())
        return PredictionResponse(**result, status="success")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    