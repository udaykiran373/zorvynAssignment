# Finance Data Processing API

A complete, production-grade Express REST API with MongoDB, JWT Authentication, Service-layer architectural decoupling, Swagger documentation, Joi validation schemas, and Rate Limiting.

## Project Structure
```
backend/
├── .env                  (Environment config containing MONGO_URI)
├── package.json
├── src/
│   ├── app.js            (Express instance, swagger wrappers, middlewares)
│   ├── server.js         (Bootstrap & port config)
│   ├── config/
│   │   └── db.js         (MongoDB Connection Logic)
│   ├── controllers/      
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── recordController.js
│   │   └── userController.js
│   ├── docs/
│   │   └── swagger.yaml  (Swagger 3.0 API Definition)
│   ├── middleware/
│   │   ├── auth.js       (JWT Cookie/Header token verifier)
│   │   ├── error.js      (Global error handler mapping AppErrors)
│   │   ├── rateLimiter.js (Express-rate-limit 15 window)
│   │   ├── role.js       (RBAC restrictTo verifier)
│   │   └── validate.js   (Joi schema request block wrapper)
│   ├── models/
│   │   ├── Record.js     (Includes isDeleted soft-delete flag & indices)
│   │   └── User.js       (Includes bcrypt pre-save hash hooks)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── recordRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   ├── dashboardService.js (Mongoose Aggregations)
│   │   ├── recordService.js    (Pagination, keyword search, Soft Delete)
│   │   └── userService.js      
│   ├── utils/
│   │   └── errors.js     (AppError inheritance)
│   └── validators/
│       └── schemas.js    (Joi structural rules mapping)
└── tests/
    └── dashboard.test.js (Jest + SuperTest mapping)
```

## Running the System
1. `npm install`
2. `npm run dev`

Navigate to **`http://localhost:5000/api-docs`** to visually interact with the endpoints and sample schemas, or test it programmatically!

### Verified Operations Comparison Constraints

| Operation | Admin | Analyst | Viewer |
|---|---|---|---|
| Create Record | ✅ | ❌ | ❌ |
| View All Records | ✅ | ✅ | ❌ |
| Update Record | ✅ | ❌ | ❌ |
| Delete Record | ✅ | ❌ | ❌ |
| View Dashboard Summary | ✅ | ✅ | ✅ |
| Filter/Search Records | ✅ | ✅ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
