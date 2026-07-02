# Authentication Guide

## Overview

Feledo uses JWT (JSON Web Tokens) for secure user authentication. This guide covers how authentication works and how to use it.

## How JWT Authentication Works

1. **User Registration**: User provides email, password, and name
2. **Password Hashing**: Password is hashed using Bcrypt before storage
3. **Token Generation**: Upon successful login, a JWT token is generated
4. **Token Storage**: Token is stored in browser's localStorage
5. **Token Usage**: Token is included in Authorization header for protected requests
6. **Token Verification**: Backend verifies token before processing requests

## API Endpoints

### 1. Register User
**POST** `/api/auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (Success):**
```json
{
  "status": 201,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Validation Rules:**
- Name: minimum 2 characters
- Email: valid email format
- Password: minimum 6 characters, must contain uppercase, lowercase, and numbers

**Error Response:**
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "Password must contain uppercase, lowercase, and numbers"
    }
  ]
}
```

### 2. Login User
**POST** `/api/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (Success):**
```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response:**
```json
{
  "status": 401,
  "message": "Invalid email or password",
  "error": "INVALID_CREDENTIALS"
}
```

### 3. Get User Profile
**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": 200,
  "message": "User profile retrieved",
  "data": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

### 4. Logout User
**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": 200,
  "message": "Logged out successfully. Please delete the token on the client side.",
  "data": {}
}
```

## Frontend Usage

### Using the useAuth Hook

```typescript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, loading, error, login, register, logout } = useAuth();

  // Register
  const handleRegister = async () => {
    await register('John Doe', 'john@example.com', 'SecurePass123');
  };

  // Login
  const handleLogin = async () => {
    await login('john@example.com', 'SecurePass123');
  };

  // Logout
  const handleLogout = () => {
    logout();
  };

  if (loading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.name}!</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
```

### Protected Routes

```typescript
import ProtectedRoute from '../components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

## Security Best Practices

### Backend
1. **Never store plain passwords**: Always hash with Bcrypt
2. **Use strong JWT secret**: Change the default secret in production
3. **Token expiration**: Tokens expire after 7 days
4. **HTTPS only**: Always use HTTPS in production
5. **Validate input**: All inputs are validated before processing
6. **Rate limiting**: Consider implementing rate limiting for auth endpoints

### Frontend
1. **Store token securely**: Use localStorage (or sessionStorage for sensitive apps)
2. **Include token in requests**: Always include token in Authorization header
3. **Handle 401 responses**: Redirect to login when token is invalid/expired
4. **Clear token on logout**: Remove token from localStorage
5. **HTTPS only**: Always communicate over HTTPS
6. **XSS protection**: Sanitize user inputs

## Token Structure

The JWT token contains the following payload:

```json
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "iat": 1704110400,
  "exp": 1704715200
}
```

**Fields:**
- `id`: User ID
- `email`: User email
- `name`: User name
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp

## Error Codes

| Code | Status | Message |
|------|--------|----------|
| NO_TOKEN | 401 | No authorization token provided |
| INVALID_TOKEN_FORMAT | 401 | Invalid authorization format |
| INVALID_TOKEN | 401 | Invalid or expired token |
| INVALID_CREDENTIALS | 401 | Invalid email or password |
| EMAIL_ALREADY_EXISTS | 409 | Email already registered |
| USER_NOT_FOUND | 404 | User not found |
| REGISTRATION_ERROR | 500 | Internal server error during registration |
| LOGIN_ERROR | 500 | Internal server error during login |

## Next Steps

1. Create PostgreSQL database with users table
2. Run `npm install` in backend and frontend
3. Configure `.env` files
4. Test authentication endpoints
5. Implement additional features (portfolio, crypto data, etc.)
