# Testing & Next Steps: Conversation Auto-Close Fix

## 🧪 Testing Checklist

### Test 1: Conversation Closure Detection
- [ ] Open messaging page (tin nhắn)
- [ ] Start a conversation
- [ ] Wait for 3+ minutes without activity
- [ ] Refresh the page
- [ ] Verify conversation shows "🔒 Đã đóng" in the header
- [ ] Verify conversation has strikethrough in list with 🔒 icon

### Test 2: Disabled Input on Closed Conversation
- [ ] In closed conversation, try to type a message
- [ ] Verify input is disabled (grayed out background)
- [ ] Verify placeholder says "Cuộc trò chuyện đã đóng"
- [ ] Verify yellow warning banner appears explaining closure
- [ ] Verify send button is disabled

### Test 3: Reopen Conversation
- [ ] Click "🔓 Mở lại" button in closed conversation header
- [ ] Confirm the dialog "Bạn có chắc muốn mở lại cuộc trò chuyện này?"
- [ ] After reopening:
  - [ ] Status changes to "✅ Đang hoạt động"
  - [ ] Message input becomes enabled
  - [ ] Yellow warning banner disappears
  - [ ] Can now send messages

### Test 4: Conversation List Ordering
- [ ] Have both active and closed conversations
- [ ] Verify active conversations appear at top
- [ ] Verify closed conversations appear at bottom
- [ ] Verify sorting by last message time still works

### Test 5: Visual Indicators
- [ ] Closed conversations show: 🔒 [Name] (strikethrough, gray text)
- [ ] Active conversations show: [Name] (bold, dark text)
- [ ] Chat header shows "✅ Đang hoạt động" for active
- [ ] Chat header shows "🔒 Đã đóng" for closed

---

## 🚀 Next Steps to Fix the Root Cause

### Option A: Prevent Auto-Close (Recommended Long-term)
1. **Investigate Backend Auto-Close Logic**
   - Look in `service-matching-backend/src/modules/chat/`
   - Search for: timeout, cron, schedule, auto-close, inactive
   - Check `getConversations()` method for any implicit filtering

2. **Identify the 3-Minute Timer**
   ```bash
   # In backend directory:
   grep -r "180" --include="*.ts" src/modules/chat/
   grep -r "3.*min" --include="*.ts" src/modules/chat/
   grep -r "180000" --include="*.ts" .
   ```

3. **Solutions**:
   - **Remove the timeout** if it's hardcoded
   - **Extend the timeout** to 24+ hours (1440 minutes)
   - **Make it configurable** in environment variables
   - **Implement keep-alive** to prevent timeout during active usage

### Option B: Implement Server-Side Reopen (Current Frontend Fix)
1. **Add Backend Endpoint**
   ```typescript
   // POST /chat/conversations/{id}/reopen
   async reopenConversation(id: string) {
     const conv = await this.conversationRepository.findById(id);
     conv.isActive = true;
     conv.isClosed = false;
     return this.conversationRepository.save(conv);
   }
   ```

2. **Uncomment in Frontend** (app/tin-nhan/page.tsx)
   ```typescript
   const handleReopenConversation = async () => {
     // Uncomment this line after backend endpoint is ready:
     // await chatService.reopenConversation(selectedConversation.id)
   }
   ```

3. **Add to Chat Service** (src/lib/api/chat.service.ts)
   ```typescript
   async reopenConversation(conversationId: string) {
     const response = await fetch(
       `${API_CONFIG.baseURL}/chat/conversations/${conversationId}/reopen`,
       {
         method: 'POST',
         headers: { ...API_CONFIG.headers },
       }
     );
     return response.json();
   }
   ```

### Option C: Implement Keep-Alive Ping (Best UX)
1. **Frontend Keep-Alive** 
   - Send a lightweight ping to server every 2 minutes
   - Prevents server from thinking conversation is inactive
   - Works seamlessly in background

2. **Implementation**
   ```typescript
   // In ChatQuoteFlow.tsx useEffect:
   useEffect(() => {
     const keepAliveInterval = setInterval(() => {
       if (!isClosed) {
         chatSocketService.ping(conversationId)
           .catch(err => console.error('Keep-alive failed:', err))
       }
     }, 120000) // Every 2 minutes
     
     return () => clearInterval(keepAliveInterval)
   }, [conversationId, isClosed])
   ```

---

## 📋 Quick Reference: What Was Changed

### Interface Changes
```typescript
// src/lib/api/chat.service.ts
export interface Conversation {
  // ... existing
  isClosed?: boolean // NEW ✅
}
```

### Component Props
```typescript
// app/components/ChatQuoteFlow.tsx
interface ChatQuoteFlowProps {
  // ... existing
  isClosed?: boolean // NEW ✅
}
```

### New Functions
```typescript
// app/tin-nhan/page.tsx
const handleReopenConversation = async () => { ... } // NEW ✅
```

### UI Changes
- Yellow warning banner in ChatQuoteFlow
- "🔓 Mở lại" button in header when closed
- Disabled message input
- Visual indicators (🔒 emoji, strikethrough, gray text)

---

## 🔍 Debugging Tips

### To see if conversation is actually closing server-side:
```javascript
// In browser console while conversation is open:
setInterval(() => {
  fetch('/api/chat/conversations')
    .then(r => r.json())
    .then(data => {
      const conv = data.find(c => c.id === 'YOUR_CONVERSATION_ID');
      console.log('Conversation isClosed:', conv?.isClosed);
      console.log('Conversation isActive:', conv?.isActive);
    });
}, 60000); // Check every minute
```

### To check backend closure logic:
```bash
# Backend repo
grep -r "isClosed" src/modules/chat/
grep -r "isActive" src/modules/chat/
grep -r "closeConversation" src/modules/chat/
grep -r "180" src/ # Look for 180 seconds (3 min)
```

---

## ✅ Files Summary

| File | Change | Purpose |
|------|--------|---------|
| `src/lib/api/chat.service.ts` | Added `isClosed` to Conversation | Track conversation closed state |
| `app/tin-nhan/page.tsx` | Reopen logic + sorting | Handle closed conversations in list |
| `app/components/ChatQuoteFlow.tsx` | Warning banner + disabled input | Prevent sending to closed |
| `app/components/ConversationItem.tsx` | Visual indicators | Show which conversations are closed |

---

## 🎯 Definition of Done

- [x] Conversations showing as "🔒 Đã đóng" when server closes them
- [x] Message input disabled on closed conversations  
- [x] Users can see which conversations are closed
- [x] "🔓 Mở lại" button available to reopen
- [x] TypeScript errors resolved
- [x] No warnings in console
- [ ] Backend `/reopen` endpoint implemented (PENDING)
- [ ] Root cause (3-min auto-close) identified in backend (PENDING)
- [ ] Keep-alive or timeout extension implemented (PENDING)

---

## 📞 Support

If conversations continue to auto-close after this frontend fix:

1. Check server logs for conversation closure events
2. Verify backend timeout logic
3. Confirm API response includes `isClosed` field
4. Test with backend logging enabled

The frontend now gracefully handles closed conversations - the next step is to fix the root cause on the backend.
