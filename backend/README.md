# Bank Marketing Machine Learning Inference API

FastAPI backend service serving real-time predictions for the Bank Marketing Term Deposit Subscription ML model.

## Features
- **Model**: Scikit-Learn Logistic Regression (`trained_model.pkl`)
- **Features Used**: `age`, `balance`, `duration`, `campaign`
- **Model Accuracy**: **93.93%**

## API Endpoints
- `GET /health` - Health status check
- `GET /model-info` - Returns model coefficients, accuracy, and dataset metrics
- `POST /predict` - Real-time ML inference given customer age, balance, duration, and campaign contacts

## How to Run

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI server using Uvicorn:
   ```bash
   uvicorn app:app --reload --port 8000
   ```
4. Access interactive API documentation at `http://localhost:8000/docs`.
