# 📋 API Integration Checklist - THOTOT

## ✅ Current Status

### Backend Configuration
- **Real API URL**: `https://postmaxillary-variably-justa.ngrok-free.dev/api/v1`
- **Environment**: Configured in `.env.local`
- **Status**: ✅ Online and responding

### Frontend Architecture
```
Local Frontend (localhost:3003)
       ↓
Next.js API Routes (Proxy) at /api/*
       ↓
Real Backend API (ngrok)
```

## 🔍 API Endpoints Status

### ✅ Authentication (Auth Service)
- **Proxy Endpoint**: `/api/auth/login` → Real API
- **Status**: Working via proxy at `app/api/auth/login/route.ts`
- **Features**:
  - Multiple phone number format support
  - Token storage (localStorage)
  - Remember Me functionality

### 📄 Posts (Post Service)
- **Proxy Endpoints**: 
  - `GET /api/posts/feed` 
  - `GET /api/posts/[id]`
  - `POST /api/posts`
- **Current Status**: Calling local proxy
- **Real API Support**: Need to verify endpoints exist on backend

### 💬 Chat (Chat Service)
- **Proxy Endpoints**:
  - `GET /api/chat/conversations`
  - `GET /api/chat/unread-count`
  - `POST /api/chat/conversations/:id/messages`
- **Current Status**: Calling local proxy
- **Real API Support**: Need to verify socket.io integration

### 🔔 Notifications (Notification Service)
- **Proxy Endpoints**:
  - `GET /api/notifications`
  - `GET /api/notifications/unread-count`
- **Current Status**: Calling local proxy
- **Real API Support**: Need to verify implementation

### 👤 Profile (Profile Service)
- **Proxy Endpoints**:
  - `GET /api/profile/me`
  - `PUT /api/profile`
  - `POST /api/profile/avatar`
- **Current Status**: Calling local proxy
- **Real API Support**: Need to verify implementation

## 🛠️ Implementation Guide

### Step 1: Verify Real API Endpoints Exist
Use the included `API_TEST_SUITE.js` to test all endpoints:

```javascript
// In browser DevTools Console:
// 1. Load the test suite
const script = document.createElement('script')
script.src = '/API_TEST_SUITE.js'
document.body.appendChild(script)

// 2. Run tests
API_TEST.testAllApis()

// 3. Check status
API_TEST.getApiStatus()
```

### Step 2: Create Missing Proxy Routes
If backend endpoints exist but proxy routes are missing, create them in `app/api/`:

Example structure for a missing endpoint:
```typescript
// app/api/posts/feed/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_DOMAIN

export async function GET(request: NextRequest) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      'Authorization': request.headers.get('Authorization') || '',
    }

    const url = new URL(request.url)
    const params = url.searchParams.toString()
    
    const response = await fetch(
      `${API_BASE_URL}/posts/feed${params ? `?${params}` : ''}`,
      { method: 'GET', headers }
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      { message: 'Proxy error', error: String(error) },
      { status: 500 }
    )
  }
}
```

### Step 3: Verify Service Implementations
Each service (Auth, Post, Chat, etc.) should:

1. ✅ Make requests to local proxy endpoints (`/api/*`)
2. ✅ Include Authorization header with token
3. ✅ Handle error responses properly
4. ✅ Parse response data correctly

Example pattern:
```typescript
static async getMethod(id: string): Promise<DataType> {
  try {
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
    
    const response = await fetch(`/api/resource/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    })

    if (!response.ok) {
      throw new Error('Request failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
```

## 🔄 API Mode Detection

The app uses auto-detection to switch between Real API and Mock:

### Detection Logic (in `api-mode.ts`):
1. Try to connect to backend via test endpoint
2. If succeeds → Use Real API ✅
3. If fails → Fallback to Mock API 🎭

### Fallback Conditions:
- Network error
- Timeout (>2 seconds)
- Server error (5xx)

## 📊 Testing Checklist

### Before Deployment:

- [ ] All proxy routes created for needed endpoints
- [ ] API responses match expected data types
- [ ] Token authentication working in requests
- [ ] Error handling implemented
- [ ] No console errors from services
- [ ] Socket.io connections working for real-time features
- [ ] Tests pass with real API data

### Run Tests:
```bash
# In project terminal
npm run test  # if configured

# Manual test in DevTools
API_TEST.testAllApis()
```

## 🗑️ Clean Up Required

### API Files to Review:
1. `src/lib/api/api-mode.ts` - Detection logic
2. `src/lib/api/fetch-real-api.ts` - Retry logic  
3. `src/lib/api/api-wrapper.ts` - Fallback logic
4. `src/lib/api/mock.service.ts` - Remove when fully migrated

### Services to Verify:
- [x] `auth.service.ts` - Using proxy
- [ ] `post.service.ts` - Review endpoints
- [ ] `chat.service.ts` - Verify socket.io
- [ ] `notification.service.ts` - Review endpoints
- [ ] `profile.service.ts` - Review endpoints
- [ ] `user.service.ts` - Review endpoints
- [ ] `quote.service.ts` - Review endpoints
- [ ] `order.service.ts` - Review endpoints

## 🔗 Useful References

### Backend API Endpoints
```
Base: https://postmaxillary-variably-justa.ngrok-free.dev/api/v1

Authentication:
  POST /auth/login
  POST /auth/register
  POST /auth/refresh
  POST /auth/logout

Posts:
  GET /posts/feed
  GET /posts/:id
  POST /posts
  PUT /posts/:id
  DELETE /posts/:id
  GET /posts/my
  GET /posts/feed (with pagination)

Chat:
  GET /chat/conversations
  POST /chat/conversations
  GET /chat/conversations/:id/messages
  POST /chat/conversations/:id/messages
  POST /chat/conversations/direct
  GET /chat/unread-count

Notifications:
  GET /notifications
  GET /notifications/unread-count
  PUT /notifications/:id/read
  PUT /notifications/mark-all-read

Profile:
  GET /profile/me
  PUT /profile
  POST /profile/avatar
  GET /profile/:userId
  GET /profile/search

Orders:
  GET /orders
  GET /orders/:id
  POST /orders
  PUT /orders/:id/confirm-from-quote

Quotes:
  GET /quotes/:postId
  POST /quotes
  PUT /quotes/:id
```

## 🚀 Quick Start

1. **Verify app is running**:
   ```bash
   npm run dev
   ```

2. **Test API connection**:
   - Open `http://localhost:3003`
   - Press F12 to open DevTools
   - Copy-paste content from `API_TEST_SUITE.js`
   - Call: `API_TEST.testAllApis()`

3. **Monitor real API calls**:
   - Open DevTools Network tab
   - Filter by XHR
   - Watch requests to `/api/*` endpoints
   - Check response data

4. **Debug issues**:
   - Check Console for errors
   - Verify token in localStorage: `localStorage.getItem('access_token')`
   - Check network requests for 401/403 errors
   - Look for CORS issues

## ⚠️ Common Issues & Solutions

### 401 Unauthorized
**Cause**: Token missing or expired
**Solution**: 
1. Login first via `/dang-nhap` page
2. Check token: `localStorage.getItem('access_token')`
3. If missing, clear data: `API_TEST.clearAllData()`

### CORS Error
**Cause**: ngrok headers not sent
**Solution**:
- Ensure proxy routes include: `'ngrok-skip-browser-warning': 'true'`

### Timeout Errors
**Cause**: Backend slow or offline
**Solution**:
1. Check backend status in terminal
2. Increase timeout in `real-api-config.ts`
3. App will auto-fallback to mock data

### Wrong Data Format
**Cause**: Response structure mismatch
**Solution**:
1. Check actual response in Network tab
2. Update type definitions in services
3. Adjust response parsing in handlers

---

Generated: March 2026
API Mode: Real API with Mock Fallback
Environment: Development
