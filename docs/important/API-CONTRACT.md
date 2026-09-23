# API Contract Specifications: Next.js + TypeScript

## 1. Standard Response Envelope

### Success Response Format
```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [
      { "field": "price", "message": "Price must be a positive number" }
    ]
  },
  "requestId": "req-987654"
}
```

## 2. Standard HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Invalid request syntax.
- `401 Unauthorized`: Authentication required or session expired.
- `403 Forbidden`: Authenticated user lacks required permission.
- `404 Not Found`: Resource does not exist.
- `409 Conflict`: Duplicate entry or state conflict (e.g. duplicate email).
- `422 Unprocessable Entity`: Validation failure on request body/params.
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: Unexpected server failure (details hidden from client).
