from fastapi.testclient import TestClient

from main import app


client = TestClient(app)

def test_root():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "Calculator API is running"}


def test_add():
    response = client.get("/api/add", params={"a": 5, "b": 3})

    assert response.status_code == 200
    assert response.json() == {"result": 8}


def test_subtract():
    response = client.get("/api/subtract", params={"a": 5, "b": 3})

    assert response.status_code == 200
    assert response.json() == {"result": 2}


def test_multiply():
    response = client.get("/api/multiply", params={"a": 5, "b": 3})

    assert response.status_code == 200
    assert response.json() == {"result": 15}


def test_divide():
    response = client.get("/api/divide", params={"a": 10, "b": 2})

    assert response.status_code == 200
    assert response.json() == {"result": 5}


def test_divide_by_zero():
    response = client.get("/api/divide", params={"a": 10, "b": 0})

    assert response.status_code == 400
    assert response.json() == {"detail": "Division by zero is not allowed"}


def test_invalid_numeric_parameter():
    response = client.get("/api/add", params={"a": "hello", "b": 3})

    assert response.status_code == 422

def test_add_negative_numbers():
    response = client.get("/api/add", params={"a": -5, "b": 3})

    assert response.json() == {"result": -2}
    assert response.status_code == 200



