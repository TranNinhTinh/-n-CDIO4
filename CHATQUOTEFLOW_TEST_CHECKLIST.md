# 🧪 ChatQuoteFlow Testing Checklist

## ✅ Pre-Test Setup

1. **Open Browser DevTools**
   - Press `F12` or `Cmd+Option+I` (Mac)
   - Go to "Console" tab
   - Keep it open during testing

2. **Clear Browser Cache** (if needed)
   - DevTools → Application tab
   - Storage → LocalStorage → Clear all
   - Press F5 to reload

## 🔄 Test 1: Message Loading

**Action:**
1. Go to Tin nhắn page
2. Select a conversation
3. Watch Console output

**Expected Console Output:**
```
📨 Loading messages for conversation: [conversation-id]
✅ Raw messages response: [...]
✅ Messages type: object Is array: true
✅ Final messages to display: X messages
```

**Expected UI:**
- Messages appear in chat window
- NOT "Không có tin nhắn nào" unless conversation is truly empty

**If Failed:**
- Check error message in console starting with `❌ Failed to load messages:`
- Look at `Error details` for status code and response body
- Share console screenshot with error

---

## 📤 Test 2: Sending Text Message

**Action:**
1. Type "hello" or any text
2. Click send button (📤)
3. Watch Console and UI

**Expected Console Output:**
```
📤 Sending message: {conversationId: "...", content: "hello"}
✅ Message sent response: {...}
📨 Messages after send: [...]
```

**Expected UI:**
- Message input clears
- New message appears in chat (your message on right, blue)
- No red error box appears

**If Failed:**
- Red error box appears with error message
- Copy the error message and console error
- Check if you're logged in (localStorage should have `access_token`)

---

## 💬 Test 3: Error Handling

**Action (to test error handling):**
1. Open DevTools → Network tab
2. Turn on "offline mode" or "throttle"
3. Try to send a message
4. Observe error handling

**Expected:**
- Red error box appears with user-friendly message
- Error can be dismissed by clicking ✕
- Can try sending again after going online

---

## 🏆 Test 4: Message Refresh (Polling)

**Action:**
1. Send a message from another browser/device
2. Wait 2 seconds
3. Check if new message appears

**Expected:**
- New message appears within 2 seconds
- No manual refresh needed
- Automatic polling works

---

## 📋 Test 5: Message Types (if quote exists)

**Action:**
1. Check if conversation has quote
2. Provider should see "💰 Chào giá lại" button
3. Customer should see quote messages with "Đặt đơn" button

**Expected:**
- QUOTE messages show with 💰 icon and action button
- ORDER messages show with 📋 icon
- TEXT messages show normally
- FILE messages show with link

---

## 🐛 Debugging Commands (in Console)

**Check current conversation ID:**
```javascript
// This will show what conversationId ChatQuoteFlow is using
localStorage.getItem('selectedConversationId')
```

**Check authentication token:**
```javascript
localStorage.getItem('access_token')
```

**Check API base URL:**
```javascript
// Should show your API domain
console.log('API Base:', process.env.NEXT_PUBLIC_API_DOMAIN)
```

**Manually test API:**
```javascript
// Test if API endpoint works
fetch('https://[your-api]/chat/conversations/[conv-id]/messages', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  }
})
.then(r => r.json())
.then(data => console.log('API Response:', data))
.catch(e => console.error('API Error:', e))
```

---

## 📸 What to Share if Bug Remains

1. **Screenshot of error box** with exact error message
2. **Console logs** (copy-paste the red error lines)
3. **Network tab screenshot**:
   - Right-click the failed request
   - "Copy as cURL"
   - Paste in bug report
4. **What you were trying to do** (step-by-step)
5. **What role you have** (CUSTOMER or PROVIDER)

---

## ✨ Success Indicators

All tests pass when:
- ✅ Messages load without "Không có tin nhắn nào"
- ✅ Can send messages without error
- ✅ New messages appear within 2 seconds
- ✅ No red error boxes
- ✅ Console only shows info/debug logs (blue/gray), no errors (red)
- ✅ Quote and Order messages work with action buttons
