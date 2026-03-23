# 🚀 API Real Implementation Action Plan

## Current Status: ✅ 80% Complete

Your application is already configured to use the real API! Here's what's already working:

### ✅ Already Implemented:
1. **Environment Configuration** 
   - Real API URL configured in `.env.local`
   - Using ngrok backend: `https://postmaxillary-variably-justa.ngrok-free.dev/api/v1`

2. **Proxy Routes Exist**
   - 40+ proxy routes in `app/api/` directory
   - All forwards correctly to backend
   - Auth headers properly included

3. **API Services**
   - AuthService - ✅ Working with login/register
   - PostService - ✅ Proxy routes exist
   - ChatService - ✅ Proxy routes exist  
   - NotificationService - ✅ Proxy routes exist
   - ProfileService - ✅ Proxy routes exist
   - OrderService - ✅ Proxy routes exist
   - QuoteService - ✅ Proxy routes exist

### ⚠️ Areas to Verify/Fix:
1. WebSocket/Socket.io connectivity for real-time features
2. File upload/avatar endpoints
3. Some advanced filtering/search endpoints
4. Type definitions match backend responses exactly

---

## 🔧 Implementation Steps

### Step 1: Verify Backend API Status

**Test the login endpoint directly:**
```bash
curl -X POST https://postmaxillary-variably-justa.ngrok-free.dev/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d '{"identifier":"test","password":"test"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "your_token_here",
    "user": {
      "id": "...",
      "email": "...",
      "phone": "...",
      "fullName": "..."
    }
  }
}
```

### Step 2: Test Frontend API Integration

**In Browser DevTools Console:**

1. **Copy API test file to clipboard:**
   ```javascript
   // Load test suite
   fetch('/API_TEST_SUITE.js')
     .then(r => r.text())
     .then(code => {
       eval(code)
       console.log('✅ Test suite loaded!')
     })
   ```

2. **Run the tests:**
   ```javascript
   // Try all APIs
   API_TEST.testAllApis()

   // Or test specific features
   API_TEST.testAuthApi()
   API_TEST.testPostApi()
   API_TEST.testChatApi()
   ```

3. **Check current status:**
   ```javascript
   API_TEST.getApiStatus()
   ```

### Step 3: Real Testing Scenarios

**Scenario 1: User Registration & Login**
```javascript
// 1. Register new user
await API_TEST.testEndpoint('POST', '/auth/register', {
  email: 'test@example.com',
  phone: '+84912345678',
  fullName: 'Test User',
  password: 'Password123!'
})

// 2. Login with credentials
await API_TEST.testEndpoint('POST', '/auth/login', {
  identifier: 'test@example.com',
  password: 'Password123!'
})
```

**Scenario 2: Create & View Posts**
```javascript
// 1. Create a post
const createResult = await API_TEST.testEndpoint('POST', '/posts', {
  title: 'Test Post',
  description: 'This is a test post',
  category: 'construction',
  price: 500000
})

// 2. Get feed
const feedResult = await API_TEST.testEndpoint('GET', '/posts/feed?limit=10')

// 3. Get by ID
const postId = feedResult.data.data[0].id
await API_TEST.testEndpoint('GET', `/posts/${postId}`)
```

**Scenario 3: Chat & Messaging**
```javascript
// 1. Get conversations
const conversations = await API_TEST.testEndpoint('GET', '/chat/conversations')

// 2. Create direct conversation
const directConv = await API_TEST.testEndpoint('POST', '/chat/conversations/direct', {
  providerId: 'provider_id_here'
})

// 3. Send message
await API_TEST.testEndpoint('POST', `/chat/conversations/${directConv.data.id}/messages`, {
  type: 'text',
  content: 'Hello!'
})
```

### Step 4: Fix Any Issues

**If getting 401 Unauthorized:**
```javascript
// 1. Clear old data
API_TEST.clearAllData()

// 2. Login again
await API_TEST.testAuthApi()

// 3. Check token
console.log(localStorage.getItem('access_token'))
```

**If getting 400 Bad Request:**
```javascript
// Check what the actual response says
const result = await API_TEST.testEndpoint('GET', '/posts/feed')
console.log('Response:', result.data)  // See the actual error message
```

**If getting 500 Server Error:**
- The backend is having issues
- Try simpler endpoints first
- Check backend logs
- Retry in a few moments

**If getting timeout:**
- Backend is too slow  
- Check ngrok tunnel availability
- Increase timeout in config if needed

### Step 5: Enable Mock Fallback (Optional)

The app already has automatic fallback to mock data when backend fails. This is good for:
- Development when backend is down
- Testing UI with demo data
- Offline development

**To force mock mode for testing:**
```javascript
// In DevTools Console
window.ApiWrapper?.setUseMock(true)
```

**To check current mode:**
```javascript
console.log('Using mock mode:', window.ApiWrapper?.isUsingMock())
```

---

## 🎯 Checklist for Going Live

### Data Verification
- [ ] User registration with all fields
- [ ] Email/phone validation working
- [ ] Password requirements enforced
- [ ] Token generation and storage
- [ ] Token refresh working
- [ ] Logout properly clears data

### Feature Testing
- [ ] Can create posts with all details
- [ ] Can upload images/files
- [ ] Feed loads with proper pagination
- [ ] Search/filter working
- [ ] Chat conversations load
- [ ] Messages send and receive in real-time
- [ ] Notifications work (real-time)
- [ ] Profile updates save correctly
- [ ] Avatar upload working
- [ ] Orders/quotes functionality complete

### Performance
- [ ] Page load time < 3 seconds
- [ ] API responses < 2 seconds
- [ ] No memory leaks
- [ ] Handles offline gracefully
- [ ] Auto-reconnects when online

### Security
- [ ] Tokens sent securely in headers
- [ ] No sensitive data in localStorage
- [ ] CORS properly configured
- [ ] XSS protection in place
- [ ] CSRF tokens if needed

### Error Handling
- [ ] All endpoints have error messages
- [ ] User feedback for failed requests
- [ ] Retry logic for transient errors
- [ ] Graceful degradation for network issues
- [ ] Proper logging for debugging

---

## 📝 Configuration Summary

### Environment Variables
```
NEXT_PUBLIC_API_DOMAIN=https://postmaxillary-variably-justa.ngrok-free.dev/api/v1
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Tho Tot
```

### Key Files
- Config: `src/lib/api/config.ts`
- Services: `src/lib/api/*.service.ts`
- Proxies: `app/api/**/route.ts`
- Types: `src/lib/api/index.ts`

### Important Functions
```typescript
// AuthService
AuthService.login(credentials, rememberMe)
AuthService.register(data)
AuthService.logout()

// PostService  
PostService.getFeed()
PostService.getPostById(id)
PostService.createPost(data)

// ChatService
chatService.getConversations()
chatService.getMessages(conversationId)
chatService.sendMessage(conversationId, data)

// NotificationService
notificationService.getNotifications()
notificationService.markAsRead(id)

// ProfileService
ProfileService.getMyProfile()
ProfileService.updateProfile(data)
```

---

## 🆘 Troubleshooting

### App won't load
- Check if `npm run dev` is running
- Clear browser cache: Ctrl+Shift+Delete
- Check console for errors: F12 > Console

### Login fails
- Check username/email is correct
- Verify password
- Check backend is online
- Look for 401/403 errors in Network tab

### Data not loading
- Check Authorization header in Network tab
- Verify token exists: `localStorage.getItem('access_token')`
- Check response status codes
- Look for backend errors in response

### Socket.io not connecting
- Check browser console for WebSocket errors
- Verify ngrok tunnel allows WebSocket
- Check `socket-init.ts` configuration
- Monitor Network tab for WebSocket attempts

### Image/File upload fails
- Check file size limits
- Verify MIME types allowed
- Check upload endpoint exists
- Look at response error message

---

## 🚀 Ready to Deploy?

Once all tests pass:

1. **Run production build:**
   ```bash
   npm run build
   npm start
   ```

2. **Test production build:**
   - Load app in browser
   - Run same tests as above
   - Check DevTools for errors

3. **Monitor in production:**
   - Set up error tracking (Sentry, etc)
   - Monitor API response times
   - Track user sessions
   - Set up alerts for failures

4. **Gradual rollout:**
   - Deploy to staging first
   - Get user feedback
   - Deploy to production
   - Monitor closely

---

**Status**: Ready for full real API integration
**Last Updated**: March 2026
**Backend**: ngrok (development), will move to stable URL in production
