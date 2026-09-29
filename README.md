# Calculator Technical Assessment

A full-stack calculator application built as part of a technical assessment.

The application provides a REST API for basic arithmetic operations and a React frontend for interacting with the calculator.

## Project Structure

```text
Calculator-Technical-Assessment/
├── backend/
│   ├── main.py
│   ├── test_main.py
│   └── requirements.txt
├── frontend/
└── README.md
```

> The frontend will be added as the next stage of the project.

## Backend

The backend is a stateless REST API built with FastAPI. It currently supports the four basic arithmetic operations:

- Addition
- Subtraction
- Multiplication
- Division

Each operation is exposed through an independent endpoint and receives its operands as query parameters.

### Requirements

- Python 3
- pip

### Setup

Clone the repository:

```bash
git clone https://github.com/incarasa/Calculator-Technical-Assessment
cd Calculator-Technical-Assessment
```

Create a virtual environment:

**Windows**

```bash
python -m venv .venv
.\.venv\Scripts\activate
```

**macOS / Linux**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r backend/requirements.txt
```

### Running the Backend

From the project root, run:

```bash
uvicorn backend.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

A successful request to the root endpoint should return:

```json
{
  "message": "Calculator API is running"
}
```

### API Documentation

FastAPI automatically generates interactive OpenAPI documentation.

Once the backend is running, open:

```text
http://127.0.0.1:8000/docs
```

The Swagger UI can be used to inspect and test all available endpoints.

## API Usage

All calculator operations use `GET` requests and receive their operands through the `a` and `b` query parameters.

### Addition

```http
GET /api/add?a=5&b=3
```

Response:

```json
{
  "result": 8
}
```

### Subtraction

```http
GET /api/subtract?a=5&b=3
```

Response:

```json
{
  "result": 2
}
```

### Multiplication

```http
GET /api/multiply?a=5&b=3
```

Response:

```json
{
  "result": 15
}
```

### Division

```http
GET /api/divide?a=10&b=2
```

Response:

```json
{
  "result": 5
}
```

Division by zero is rejected with HTTP `400 Bad Request`:

```http
GET /api/divide?a=10&b=0
```

```json
{
  "detail": "Division by zero is not allowed"
}
```

Invalid numeric parameters are automatically validated by FastAPI.

For example:

```http
GET /api/add?a=hello&b=3
```

returns HTTP `422`.

## Backend Tests

Backend tests are implemented using `pytest` and FastAPI's `TestClient`.

Run the test suite from the project root with:

```bash
python -m pytest backend/test_main.py -v
```

The current test suite covers:

- Root endpoint
- Addition
- Subtraction
- Multiplication
- Division
- Division by zero

All backend tests are currently passing.

### Test Coverage

Coverage is measured using `pytest-cov`.

Run:

```bash
python -m pytest backend/test_main.py --cov=backend.main --cov-report=term-missing
```

Current backend coverage:

```text
Name          Stmts   Miss   Cover
---------------------------------
backend/main.py  19      0    100%
---------------------------------
TOTAL            19      0    100%
```

The backend currently has 100% statement coverage.

## Backend Design Decisions

### FastAPI

FastAPI was selected for the backend because it provides a concise way to build typed REST APIs in Python, including automatic request validation and OpenAPI documentation.

Go was listed as the preferred backend technology in the assessment. Python and FastAPI were chosen instead because they allowed the backend to be implemented confidently within the assignment's time constraint while prioritizing correctness, clarity, and maintainability.

### Stateless API

The backend does not store calculator state or previous results. Each request contains all the information required to perform an operation.

Calculator state will be managed by the React frontend.

### Separate Operation Endpoints

Each arithmetic operation has its own endpoint:

```text
/api/add
/api/subtract
/api/multiply
/api/divide
```

This keeps the API explicit and easy to understand for the small number of supported operations.

### Query Parameters

Operands are sent as query parameters because the operations are simple, read-only calculations and do not modify server-side resources.

FastAPI's type annotations are used to validate the operands as numeric values.

### Error Handling

FastAPI handles invalid numeric inputs automatically through request validation.

Application-specific edge cases, such as division by zero, are handled explicitly by the backend.

## Frontend

React frontend documentation will be added after its implementation.