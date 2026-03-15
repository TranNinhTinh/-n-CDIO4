# Troubleshooting Checklist - Loading Issue

## ✅ Before Testing

- [ ] Clear cache: `localStorage.clear()` in console
- [ ] Refresh page: Ctrl+Shift+R (hard refresh)
- [ ] Check you're logged in (should have access_token)
- [ ] Backend API is running

## 🧪 Testing Steps

### Step 1: Check Authentication
Open DevTools Console and run:
```javascript
console.log('Token:', localStorage.getItem('access_token')?.substring(0, 20) + '...')
```
**Expected:** Token should show (not null/undefined)
**If fails:** Login again

### Step 2: Test Profile API Endpoint
```javascript
fetch('/api/profile/me')
  .then(r => console.log('Status:', r.status, r.statusText))
```
**Expected:** Status 200 OK
**If fails:** 
- 401 = Need to login
- 404 = Endpoint not found (check backend)
- 500 = Backend error

### Step 3: Test Chat API Endpoint
```javascript
fetch('/api/chat/conversations')
  .then(r => console.log('Status:', r.status, r.statusText))
```
**Expected:** Status 200 OK
**If fails:**
- 401 = Need to login  
- 404 = Endpoint not found
- 500 = Backend error

### Step 4: Click Conversation & Watch Console
1. Open DevTools Console
2. Click on a conversation in the list
3. Watch for these logs in order:
   ```
   ✅ 👤 Loading current user profile...
   ✅ ✅ Current user loaded: {...}
   ✅ 📨 Setting up conversation: {id}
   ✅ 📨 Loading messages for conversation: {id}
   ✅ ✅ Messages loaded: X messages
   ✅ 👤 Loading other user profile: {userId}
   ✅ ✅ Other user loaded: {...}
   ```

## 🐛 Common Issues & Solutions

### Issue 1: "Đang tải dữ liệu..." forever
**Check these console logs:**
- [ ] See "👤 Loading current user profile..." ?
  - YES → Go to Step 2
  - NO → App initialization problem
  
- [ ] See "✅ Current user loaded..." ?
  - YES → Go to Step 3
  - NO → ProfileService.getMyProfile() failed
  
- [ ] See "📨 Setting up conversation..." ?
  - YES → Go to Step 4
  - NO → currentUser still loading or selectedConversation not set
  
- [ ] See "✅ Messages loaded..." ?
  - YES → Conversation should show
  - NO → chatService.getMessages() failed

**Solution:**
- Check Network tab in DevTools for failed requests
- Note the error response
- Check if access token is valid

### Issue 2: 401 Unauthorized errors
**Console shows:** "❌ Error loading..." with 401 status
**Solution:** 
- Token expired → Logout & login again
- Or check token in storage: `localStorage.getItem('access_token')`

### Issue 3: 404 Not Found errors
**Console shows:** Request to wrong endpoint
**Solution:**
- Check `/api/profile/me` endpoint exists on backend
- Check `/api/chat/conversations/{id}/messages` endpoint exists
- Ask backend to verify endpoint paths

### Issue 4: Network errors / CORS
**Console shows:** "Access to XMLHttpRequest blocked by CORS"
**Solution:**
- Backend CORS configuration issue
- Contact backend team to allow frontend domain

### Issue 5: Messages show but loading never stops
**Console shows:** All logs present but messagesLoading=true
**Solution:**
- Check if `messagesLoading` state is being set to false
- Might be React state issue, clear localStorage and refresh

## 📝 What to Report if Still Broken

If after all steps it's still not working, provide:

1. **Console output:**
   ```
   Copy-paste ALL console logs when clicking conversation
   Include both [✅] and [❌] messages
   ```

2. **Network tab screenshot:**
   ```
   DevTools → Network → Click conversation
   Screenshot showing all requests and their status codes
   ```

3. **Local storage state:**
   ```javascript
   // Run in console:
   JSON.stringify({
     token: localStorage.getItem('access_token')?.substring(0, 20) + '...',
     currentUser: localStorage.getItem('currentUser'),
     hasConversations: !!localStorage.getItem('conversations')
   }, null, 2)
   ```

## 🎯 Success Criteria

✅ When fixed, you should see:
- Conversation loads within 3-4 seconds
- Messages appear with proper loading spinner
- If API fails, shows fallback UI instead of stuck loading
- Console has helpful debug logs for future issues

## 💡 Pro Tips

**Quick restart:**
```javascript
// In console:
localStorage.clear()
location.reload()
```

**Check specific conversation:**
```javascript
// Get conversation ID from URL or inspect element
const convId = 'xxx'
fetch(`/api/chat/conversations/${convId}`)
  .then(r => r.json())
  .then(data => console.log('Conversation:', data))
```

**Monitor in real-time:**
```javascript
// Keep console open while using app
// Logs will show real-time status
```
