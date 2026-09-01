# SIH Backend - Authentication Setup Guide

This guide will help you set up the login and register backend with Supabase integration.

## Prerequisites

- Node.js (v14 or higher)
- Supabase account (https://supabase.com)
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

Dependencies have already been installed. The following packages are included:
- `@supabase/supabase-js` - Supabase client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `validator` - Input validation
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### 2. Create Supabase Project

1. Go to https://supabase.com and sign up/log in
2. Create a new project
3. Get your credentials:
   - **Project URL** - Copy from Settings > API > URL
   - **Anon Key** - Copy from Settings > API > Service Role Key (use anon key)

### 3. Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the entire content from `src/database/schema.sql`
3. Paste it in the SQL Editor and run it
4. This will create the `users` table with all required fields

### 4. Configure Environment Variables

1. Create a `.env` file in the backend root directory (it's already created as a template)
2. Update the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
```

Replace:
- `https://your-project.supabase.co` with your actual Supabase URL
- `your-anon-key-here` with your Supabase Anon Key
- `your-secret-key-change-in-production` with a strong secret key (use a random string)

### 5. Run the Server

```bash
# Start in development mode (with auto-reload)
npm run dev

# Or start in production mode
npm start
```

The server will start at `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### 1. Register a New User
**POST** `/api/auth/register`

Request Body:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "role": "student"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student"
  },
  "token": "jwt-token-here"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Valid Roles:**
- `student`
- `academician`
- `industry`

#### 2. Login User
**POST** `/api/auth/login`

Request Body:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student"
  },
  "token": "jwt-token-here"
}
```

#### 3. Get Current User (Protected Route)
**GET** `/api/auth/me`

Headers:
```
Authorization: Bearer <jwt-token>
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student",
    "created_at": "2024-01-15T10:00:00Z",
    "last_login": "2024-01-15T11:00:00Z"
  }
}
```

#### 4. Health Check
**GET** `/api/health`

Response:
```json
{
  "status": "ok"
}
```

## File Structure

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js          # Supabase client configuration
│   ├── controllers/
│   │   └── authController.js    # Register, login, get user logic
│   ├── database/
│   │   └── schema.sql           # Database schema
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification & role-based access
│   ├── routes/
│   │   └── authRoutes.js        # Auth endpoint routes
│   ├── validators/
│   │   └── authValidator.js     # Input validation
│   └── index.js                 # Main server file
├── .env                         # Environment variables
├── package.json                 # Dependencies
└── README.md                    # This file
```

## Middleware

### Authentication Middleware
Protects routes by verifying JWT tokens. Add to any route:

```javascript
router.get("/protected", authMiddleware, controllerFunction);
```

### Role-Based Access Control
Restrict routes to specific roles:

```javascript
router.get("/admin", authMiddleware, roleMiddleware(["admin"]), controllerFunction);
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- **200** - Success
- **201** - Created (register)
- **400** - Bad request (validation errors)
- **401** - Unauthorized (invalid credentials or missing token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not found
- **500** - Server error

Error Response Format:
```json
{
  "error": "Error message here"
}
```

## Security Best Practices

1. ✅ Passwords are hashed using bcryptjs
2. ✅ JWT tokens expire after 7 days
3. ✅ Environment variables are used for sensitive data
4. ✅ Input validation is performed on all endpoints
5. ⚠️ **TODO:** Implement rate limiting
6. ⚠️ **TODO:** Add email verification
7. ⚠️ **TODO:** Implement password reset functionality
8. ⚠️ **TODO:** Add two-factor authentication

## Frontend Integration

To integrate with your React frontend, send requests like:

```javascript
// Register
const response = await fetch("http://localhost:5000/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "SecurePass123",
    name: "John Doe",
    role: "student",
  }),
});

// Login
const response = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "SecurePass123",
  }),
});

// Get current user (with token)
const response = await fetch("http://localhost:5000/api/auth/me", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## Troubleshooting

### "Missing Supabase credentials" error
- Make sure `.env` file has `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Verify you copied the correct values from Supabase dashboard

### "Email already registered" error
- This email is already in use. Use a different email address.

### "Invalid token" error
- Token may be expired (expires after 7 days)
- The token format is incorrect
- JWT_SECRET doesn't match

### Database connection issues
- Check if Supabase is up and running
- Verify credentials are correct
- Check internet connection

## Next Steps

1. Set up email verification
2. Implement password reset functionality
3. Add profile management endpoints
4. Create role-specific endpoints
5. Add audit logging
6. Implement rate limiting
7. Add refresh token functionality
8. Set up testing suite

## Support

For issues with:
- **Supabase**: https://supabase.com/docs
- **Express**: https://expressjs.com/
- **JWT**: https://jwt.io/
- **bcryptjs**: https://github.com/dcodeIO/bcrypt.js

---

**Happy coding! 🚀**
