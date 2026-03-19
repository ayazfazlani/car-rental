# API Routes Documentation

## Endpoint Structure

```
/api
├── auth/              # Authentication endpoints
├── public/            # Public endpoints (no auth)
├── bookings/          # Customer booking endpoints
├── admin/             # Admin panel endpoints
├── swagger/           # API documentation
└── health/            # Health check
```

## Authentication Flow

1. **Register**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login` → Returns `accessToken` and `refreshToken`
3. **Use Token**: Include in header: `Authorization: Bearer <accessToken>`
4. **Refresh**: `POST /api/auth/refresh` with `refreshToken`

## Response Format

All endpoints return JSON in this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable message"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## Pagination

List endpoints support pagination:

```
GET /api/endpoint?page=1&limit=20
```

Response includes:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Filtering

Car listing supports multiple filters:

```
GET /api/public/cars?brandId=xxx&minPrice=100&maxPrice=500&transmission=AUTOMATIC
```

Available filters:

- `brandId` - Filter by brand
- `categoryId` - Filter by category
- `minPrice` / `maxPrice` - Price range
- `transmission` - AUTOMATIC or MANUAL
- `fuelType` - PETROL, DIESEL, HYBRID, ELECTRIC
- `seats` - Number of seats
- `hasChauffeur` - true/false
- `hasSelfDrive` - true/false
- `period` - DAILY, WEEKLY, MONTHLY (for price filtering)
- `status` - ACTIVE, HIDDEN, MAINTENANCE (admin only)
