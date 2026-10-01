from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Calculator API is running"}

@app.get("/api/add")
def add(a: float, b: float):
    return {"result": a + b}


@app.get("/api/subtract")
def subtract(a: float, b: float):
    return {"result": a - b}


@app.get("/api/multiply")
def multiply(a: float, b: float):
    return {"result": a * b}


@app.get("/api/divide")
def divide(a: float, b: float):
    if b == 0:
        raise HTTPException(status_code=400, detail="Division by zero is not allowed")

    return {"result": a / b}
