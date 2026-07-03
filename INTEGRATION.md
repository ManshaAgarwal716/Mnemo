# Frontend-Backend Integration Guide

This guide shows you exactly how to connect your Next.js frontend to the FastAPI backend.

## 🎯 Overview

The frontend is **already built** to work with the backend. You only need to change **ONE LINE** of code!

## Current Setup

**Frontend (Mock API):**
- Running on: `http://localhost:3000`
- Uses mock authentication
- Located in: `frontend/src/lib/auth.ts`

**Backend (Real API):**
- Running on: `http://localhost:8000`
- Real authentication with PostgreSQL + Redis
- Located in: `backend/src/main.py`

## 📋 Prerequisites

Make sure both servers are running:

```bash
# Terminal 1: Backend
cd backend/src
source ../venv/bin/activate
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

## 🔌 Step 1: Update Frontend API URL

Open `frontend/src/lib/auth.ts` and find this line:

```typescript
const API_BASE_URL = 'http://localhost:3000/api/mock'
```

Change it to:

```typescript
const API_BASE_URL = 'http://localhost:8000/api/v1'
```

That's it! 🎉

## ✅ Step 2: Verify Integration

### Test Signup Flow

1. Go to: `http://localhost:3000/signup`
2. Fill in the form:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Password**: SecurePass123!
3. Click "Sign Up"
4. You should be redirected to the dashboard

### Test Login Flow

1. Go to: `http://localhost:3000/login`
2. Enter the credentials you just created
3. Click "Log In"
4. You should be redirected to the dashboard

### Test Protected Routes

1. Go to: `http://localhost:3000/dashboard`
2. You should see your user info in the top-right
3. Try accessing other pages (they should all work)

### Test Logout

1. Click the user menu in the top-right
2. Click "Logout"
3. You should be redirected to the homepage

## 🔍 Response Format Compatibility

The backend was specifically designed to match the frontend's expected format:

### Signup/Login Response

**Frontend expects:**
```typescript
{
  user: {
    id: string
    email: string
    name: string
    avatar?: string
  }
  token: string
}
```

**Backend returns:**
```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "First Last",
    "avatar": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

✅ **Perfect match!** No changes needed.

### Get Current User Response

**Frontend expects:**
```typescript
{
  user: {
    id: string
    email: string
    name: string
    avatar?: string
  }
}
```

**Backend returns:**
```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "name": "First Last",
  "avatar": null
}
```

The frontend automatically wraps this in `{ user: data }` - no changes needed!

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error

**Symptom:**
```
Access to fetch at 'http://localhost:8000/api/v1/auth/login' from origin 
'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
Check `backend/src/.env` has the correct CORS origins:
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Issue 2: Network Error / Connection Refused

**Symptom:**
```
Failed to fetch
Error: connect ECONNREFUSED 127.0.0.1:8000
```

**Solution:**
Make sure the backend is running:
```bash
cd backend/src
uvicorn main:app --reload --port 8000
```

### Issue 3: 401 Unauthorized on Protected Routes

**Symptom:**
After login, you get 401 errors on dashboard/workspace pages.

**Solution:**
Check that the token is being stored correctly. Open browser DevTools → Application → Local Storage → `http://localhost:3000` → Look for `auth-token`.

If missing, check `frontend/src/lib/auth.ts` to ensure:
```typescript
localStorage.setItem('auth-token', data.token)
```

### Issue 4: User Data Not Showing

**Symptom:**
Dashboard loads but user name/email not displayed.

**Solution:**
The backend stores `first_name` and `last_name` separately but combines them into a single `name` field in responses. This is handled automatically by `UserResponse.from_db_model()`.

### Issue 5: Logout Not Working

**Symptom:**
Clicking logout doesn't work or throws an error.

**Solution:**
Make sure Redis is running:
```bash
redis-cli ping
# Should return: PONG
```

Redis is required for the token blocklist (logout functionality).

## 🧪 Testing the Integration

### Test 1: Full Auth Flow

```bash
# 1. Sign up
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }'

# Save the token from response
export TOKEN="<token-from-response>"

# 2. Get current user
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 3. Logout
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

### Test 2: Frontend Console Logs

Open browser DevTools → Console and watch for:

```
✅ Login successful: { user: { ... }, token: "..." }
✅ User loaded: { id: "...", email: "...", name: "..." }
✅ Logout successful
```

## 📊 API Endpoints Mapping

| Frontend Action | Frontend Method | Backend Endpoint | Method |
|-----------------|-----------------|------------------|--------|
| Sign up | `signup()` | `/api/v1/auth/signup` | POST |
| Login | `login()` | `/api/v1/auth/login` | POST |
| Logout | `logout()` | `/api/v1/auth/logout` | POST |
| Get user | `getCurrentUser()` | `/api/v1/auth/me` | GET |

All methods in `frontend/src/lib/auth.ts` automatically use the correct endpoints!

## 🚀 Production Checklist

Before deploying to production:

### Backend (.env)
- [ ] Set `DEBUG=false`
- [ ] Change `JWT_SECRET_KEY` to a secure random value
- [ ] Update `DATABASE_URL` to production PostgreSQL
- [ ] Update `REDIS_HOST` to production Redis
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Update `CORS_ORIGINS` to production domain
- [ ] Configure email service (MAIL_* variables)

### Frontend (.env.local)
- [ ] Update `NEXT_PUBLIC_API_URL` to production backend URL
- [ ] Update any other environment-specific variables

### Security
- [ ] Enable HTTPS (SSL/TLS certificates)
- [ ] Set up rate limiting
- [ ] Configure proper logging and monitoring
- [ ] Set up database backups
- [ ] Review and test all authentication flows

## 🎓 Understanding the Architecture

### Frontend Request Flow
```
User Action → auth.ts → Axios → Backend API → Response → Update State
                ↓
        localStorage (token)
```

### Backend Request Flow
```
API Request → CORS Middleware → Route Handler → Service Layer → Repository → Database
                ↓                     ↓              ↓
            Validation         Business Logic    SQL Queries
```

### Authentication Flow
```
1. User submits signup/login
2. Frontend sends request to backend
3. Backend validates credentials
4. Backend generates JWT token
5. Backend returns user + token
6. Frontend stores token in localStorage
7. Frontend includes token in Authorization header for protected routes
8. Backend validates token on each request
9. Backend checks token blocklist (for logout)
10. Backend returns protected resource
```

## 🎉 Success!

Your frontend and backend are now fully integrated! You have a production-ready authentication system with:

- ✅ User signup with validation
- ✅ User login with JWT tokens
- ✅ Protected routes with middleware
- ✅ Token-based authentication
- ✅ Secure password hashing
- ✅ Token blocklist for logout
- ✅ PostgreSQL database
- ✅ Redis for token management
- ✅ CORS configuration
- ✅ Error handling
- ✅ Response format matching

**Everything just works!** 🚀
