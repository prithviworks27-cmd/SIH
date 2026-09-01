# Frontend-Backend Login Integration Guide

This document explains how the login page is connected to the Supabase backend.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Login.jsx (UI Component)                              │
│         ↓                                               │
│  useAuth() hook                                        │
│         ↓                                               │
│  AuthContext (State Management)                        │
│         ↓                                               │
│  api.js (HTTP Client)                                 │
│         ↓                                               │
│  HTTP Requests                                        │
└─────────────────────────────────────────────────────────┘
                      ↓
            http://localhost:5000/api
                      ↓
┌─────────────────────────────────────────────────────────┐
│              Express.js Backend Server                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Routes: /api/auth/login                              │
│         ↓                                               │
│  Controllers: validateInput, hashPassword              │
│         ↓                                               │
│  Supabase: Query users table                           │
│         ↓                                               │
│  Return: JWT Token + User Data                        │
└─────────────────────────────────────────────────────────┘
                      ↓
           Supabase PostgreSQL Database
```

## File Structure

```
frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx          # Auth state management
│   ├── hooks/
│   │   └── useAuth.js               # Custom hook for auth
│   ├── services/
│   │   └── api.js                   # API client
│   ├── pages/public/
│   │   └── Login.jsx                # Login UI component
│   ├── App.jsx                      # Wrapped with AuthProvider
│   └── main.jsx
├── .env.local                        # Environment variables
└── package.json
```

## How It Works

### 1. **Login Flow**

```
User enters email & password
         ↓
Click "Login" button
         ↓
Login.jsx calls handleSubmit()
         ↓
useAuth().login(email, password)
         ↓
api.js calls POST /api/auth/login
         ↓
Backend validates & returns JWT token
         ↓
AuthContext stores token in localStorage
         ↓
Redirect to /dashboard
```

### 2. **Authentication State**

The `AuthContext` provides:
- `user` - Current logged-in user object
- `isAuthenticated` - Boolean flag
- `login()` - Function to log in
- `register()` - Function to register
- `logout()` - Function to log out
- `loading` - Loading state
- `error` - Error message

### 3. **Token Management**

```javascript
// Token is stored in localStorage
localStorage.setItem("authToken", response.token);
localStorage.setItem("user", JSON.stringify(response.user));

// Token is automatically sent in Authorization header
Authorization: Bearer <jwt-token>
```

## Setup Instructions

### 1. **Install Dependencies** (Already done)

```bash
npm install
```

### 2. **Configure Environment Variables**

Edit `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. **Start the Frontend**

```bash
npm run dev
```

The frontend will start at: `http://localhost:5173`

### 4. **Start the Backend** (Separate terminal)

```bash
cd backend
npm run dev
```

The backend will start at: `http://localhost:5000`

## Testing the Login Page

### Using the UI

1. Open browser → `http://localhost:5173/login`
2. Enter email: `test@example.com`
3. Enter password: `TestPass123`
4. Click "Login"
5. Should redirect to `/dashboard`

### Using cURL

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Using Postman

1. Method: `POST`
2. URL: `http://localhost:5000/api/auth/login`
3. Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "TestPass123"
}
```
4. Click "Send"

## Component Details

### **Login.jsx**

Main login page component with:
- Email & password input fields
- Form validation
- Error display
- Loading state
- Redirect on success

Key features:
```javascript
const { login, loading, error } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  await login(formData.email, formData.password);
  navigate("/dashboard");
};
```

### **AuthContext.jsx**

Global state management for authentication:
- Manages user state
- Handles login/logout/register
- Persists tokens to localStorage
- Provides error states

Key features:
```javascript
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(false);

const login = async (email, password) => {
  const response = await authAPI.login(email, password);
  localStorage.setItem("authToken", response.token);
  setUser(response.user);
};
```

### **api.js**

HTTP client for backend communication:
- `authAPI.login(email, password)` - Login
- `authAPI.register(...)` - Register
- `authAPI.getCurrentUser()` - Get user info
- `authAPI.logout()` - Logout

Key features:
```javascript
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  }
};
```

### **useAuth Hook**

Custom hook to easily access auth state:

```javascript
import { useAuth } from "../hooks/useAuth";

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Welcome, {user.name}!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Protected Routes (Next Steps)

To protect routes that require authentication:

```javascript
// In App.jsx
import ProtectedRoute from "./components/ProtectedRoute";

<Route 
  path="/dashboard" 
  element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} 
/>
```

Create `components/ProtectedRoute.jsx`:
```javascript
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return children;
}
```

## Error Handling

All errors are displayed in the UI:

```
[✗] Invalid email or password
[✗] Email is required
[✗] Login failed. Please try again.
```

Check browser console for detailed error logs.

## CORS Configuration

Both backends are configured with CORS:
- Frontend: `http://localhost:5173`
- Backend: Allows all origins in development

For production, update CORS settings in `backend/src/index.js`:
```javascript
app.use(cors({
  origin: "https://yourdomain.com",
  credentials: true
}));
```

## Troubleshooting

### Issue: "Cannot POST /api/auth/login"
- **Solution**: Backend is not running. Start it with `npm run dev` in backend folder

### Issue: "Network Error" in console
- **Solution**: Check if backend is accessible at `http://localhost:5000`
- **Solution**: Check CORS configuration

### Issue: "Invalid email or password"
- **Solution**: Ensure user exists in Supabase with the same email
- **Solution**: Check password is correct

### Issue: Token not being stored
- **Solution**: Check browser's Storage → Local Storage
- **Solution**: Ensure cookies/storage are not disabled

### Issue: "useAuth must be used within AuthProvider"
- **Solution**: Ensure Login component is rendered inside App (which wraps AuthProvider)

## Next Steps

1. **Implement Register Page** - Similar to Login
2. **Add Protected Routes** - Require auth for dashboard pages
3. **Implement Logout** - Clear token on logout
4. **Add Password Reset** - Email-based password recovery
5. **Token Refresh** - Implement refresh tokens for extended sessions
6. **Role-Based Access** - Different UIs for student/academician/industry

## Security Notes

✅ **Current Security Features:**
- Passwords are hashed with bcryptjs
- JWT tokens expire after 7 days
- Tokens are stored in localStorage
- CORS is enabled

⚠️ **Production Recommendations:**
- Use HTTPS instead of HTTP
- Implement CSRF protection
- Use httpOnly cookies instead of localStorage for tokens
- Implement rate limiting
- Add email verification
- Implement 2FA
- Use environment variables for sensitive data

## Files Changed/Created

1. `frontend/src/services/api.js` - HTTP client
2. `frontend/src/context/AuthContext.jsx` - Auth state
3. `frontend/src/hooks/useAuth.js` - Custom hook
4. `frontend/src/pages/public/Login.jsx` - Updated login UI
5. `frontend/src/App.jsx` - Wrapped with AuthProvider
6. `frontend/.env.local` - API URL configuration

## Support & Documentation

- [React Context API](https://react.dev/reference/react/useContext)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Express.js](https://expressjs.com/)
- [Supabase](https://supabase.com/docs)
- [JWT](https://jwt.io/)

---

**Ready to test?** Start both servers and visit `http://localhost:5173/login` 🚀
