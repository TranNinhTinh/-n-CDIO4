# 📱 UI Interaction Guide - Quote & Order Flow

## 🎯 Current UI Design

### ❌ Problem with Current Design
Messages are sent as `type: 'text'`, but buttons only show when `type === 'QUOTE'` or `type === 'ORDER'`.
This means **buttons don't show in actual chat history!**

---

## 🔧 Current UI Locations (BEFORE FIX)

### 1. **Customer "Đặt đơn" Button** 📦
**Location in Code:** `app/components/ChatQuoteFlow.tsx` Line 366
**Current Trigger:** Only shows if `msg.type === 'QUOTE'` AND `currentUserRole === 'CUSTOMER'`

```tsx
// CURRENT: Button only appears if message type is QUOTE
{msg.type === 'QUOTE' && !isOwn && currentUserRole === 'CUSTOMER' && (
    <button
        onClick={() => setShowPlaceOrderModal(true)}
        className="mt-2 text-xs bg-white text-blue-600 px-2 py-1 rounded"
    >
        Đặt đơn
    </button>
)}
```

**Problem:** 
- Messages are sent as `type: 'text'`, not `'QUOTE'`
- ❌ Button never appears in real chat!

---

### 2. **Provider "Xác nhận nhận việc" Button** ✅
**Location in Code:** `app/components/ChatQuoteFlow.tsx` Line 380
**Current Trigger:** Only shows if `msg.type === 'ORDER'` AND `currentUserRole === 'PROVIDER'`

```tsx
// CURRENT: Button only appears if message type is ORDER
{msg.type === 'ORDER' && !isOwn && currentUserRole === 'PROVIDER' && (
    <button
        onClick={() => setShowConfirmModal(true)}
        className="mt-2 text-xs bg-white text-green-600 px-2 py-1 rounded"
    >
        Xác nhận nhận việc
    </button>
)}
```

**Problem:** Same issue - messages are text type, not ORDER type

---

### 3. **Provider "Chào giá lại" Form** 📝
**Location in Code:** `app/components/ChatQuoteFlow.tsx` Line 404
**Current Trigger:** Always shows at bottom if `currentUserRole === 'PROVIDER'`

```tsx
{currentUserRole === 'PROVIDER' && (
    <ReviseQuoteForm onSubmit={handleReviseQuote} loading={orderLoading} />
)}
```

**This WORKS!** ✅ Fixed form always visible at bottom

---

## 🎨 Proposed UI Fix

### **Option 1: Persistent Action Bar** (Recommended)
Add a sticky action bar at bottom with context-aware buttons:

```tsx
{/* Action Bar - Bottom */}
<div className="border-t border-gray-200 bg-gray-50 p-4">
    {/* If User is CUSTOMER */}
    {currentUserRole === 'CUSTOMER' && (
        <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                💰 Đặt đơn
            </button>
            <button className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500">
                ❤️ Lưu tin
            </button>
        </div>
    )}

    {/* If User is PROVIDER */}
    {currentUserRole === 'PROVIDER' && (
        <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg">
                💬 Chào giá
            </button>
            <button className="flex-1 bg-green-600 text-white py-2 rounded-lg">
                ✅ Xác nhận nhận việc
            </button>
        </div>
    )}
</div>
```

---

### **Option 2: Floating Action Button** (For Mobile)
Small button that expands on tap:

```tsx
{/* FAB - Floating Action Button */}
<div className="fixed bottom-20 right-4 flex flex-col gap-2">
    {currentUserRole === 'CUSTOMER' && (
        <>
            <button className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700">
                💰
            </button>
        </>
    )}
    {currentUserRole === 'PROVIDER' && (
        <>
            <button className="w-14 h-14 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center hover:bg-green-700">
                ✅
            </button>
        </>
    )}
</div>
```

---

### **Option 3: Context Menu on Quote Message** (Current Approach - Better)
Instead of plain text, detect quote-related content and show special formatting:

```tsx
{messages.map((msg) => {
    // Check if this is quote-related content
    const isQuoteMessage = msg.content?.includes('giá') || msg.content?.includes('đ');
    const isOrderMessage = msg.content?.includes('Đặt đơn') || msg.content?.includes('đơn hàng');

    return (
        <div key={msg.id} className="space-y-2">
            {isQuoteMessage && (
                <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded">
                    <p className="text-sm font-semibold">💰 Báo giá từ thợ</p>
                    <p className="text-sm text-gray-700">{msg.content}</p>
                    {currentUserRole === 'CUSTOMER' && (
                        <button className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                            Đặt đơn ngay
                        </button>
                    )}
                </div>
            )}

            {isOrderMessage && (
                <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded">
                    <p className="text-sm font-semibold">📋 Khách đặt đơn</p>
                    <p className="text-sm text-gray-700">{msg.content}</p>
                    {currentUserRole === 'PROVIDER' && !msg.content?.includes('xác nhận') && (
                        <button className="mt-2 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                            Xác nhận nhận việc
                        </button>
                    )}
                </div>
            )}

            {!isQuoteMessage && !isOrderMessage && (
                <div className="text-sm text-gray-700">{msg.content}</div>
            )}
        </div>
    )
})}
```

---

## 📊 Comparison Table

| Approach | Pros | Cons | Implementation |
|----------|------|------|-----------------|
| **Bottom Action Bar** | Always visible, clear | Takes space, may hide messages | Add sticky bar above input |
| **Floating Button** | Mobile-friendly, compact | Small target area | CSS position fixed |
| **Smart Message Detection** | Context-aware, reads naturally | Complex logic, fragile regex | String matching in messages |
| **Message Type System** (Ideal) | Clean, semantic, future-proof | Requires backend changes | Store actual message type |

---

## ✅ Recommended Solution

**Combine approaches:**

1. **Keep "Chào giá lại" form** at bottom (already working) ✅
2. **Add message formatting** to detect quote/order messages
3. **Add Action Bar** at bottom with main buttons
4. **Update backend** to store message type = QUOTE/ORDER

---

## 🔄 Implementation Priority

### Phase 1: Quick Fix (Today)
```tsx
// Add this smart message detection
const isQuoteMessage = (content: string) => {
    return /giá.*\d+đ|chào giá|báo giá/i.test(content);
}

const isOrderMessage = (content: string) => {
    return /đặt đơn|khách đặt|order/i.test(content);
}
```

### Phase 2: Better UI (This Week)
```tsx
// Add colored message containers with inline buttons
<div className={`p-3 rounded-lg border-l-4 ${
    isQuoteMessage ? 'bg-blue-50 border-blue-600' :
    isOrderMessage ? 'bg-green-50 border-green-600' :
    'bg-gray-50 border-gray-400'
}`}>
```

### Phase 3: Full Integration (Next Sprint)
- Change backend to send `type: QUOTE | ORDER` in messages
- Update message schema in database
- Sync with MessageType enum

---

## 🎯 Example User Flow

### For Customer 👥
```
1. Khách vào chat với thợ
2. Thợ gửi: "Tôi báo giá 500,000đ với mô tả..."
3. UI detects quote content → Shows blue highlight
4. 💰 "Đặt đơn" button appears
5. Khách click → Modal opens
6. Khách xác nhận → Order created
```

### For Provider 🔧
```
1. Thợ vào chat, sẵn có form chào giá
2. Thợ nhập giá và gửi
3. Khách nhận → nhấn đặt đơn
4. Message "Khách đặt đơn: 500,000đ" appears
5. UI detects order content → Shows green highlight
6. ✅ "Xác nhận nhận việc" button appears
7. Thợ click → Order confirmed
```

---

## 🛠️ Files to Modify

1. **app/components/ChatQuoteFlow.tsx**
   - Add smart message detection functions
   - Update message rendering with colored containers
   - Add inline action buttons

2. **app/lib/api/chat.service.ts** (Optional)
   - Add message type detection utilities

3. **app/components/ChatQuoteFlow.tsx** (Bottom)
   - Keep ReviseQuoteForm
   - Maybe add PlaceOrderButton + ConfirmOrderButton

---

## 🎨 Visual Design Example

```
┌─────────────────────────────────────────┐
│  Chat History                           │
├─────────────────────────────────────────┤
│                                         │
│  12:30 Thợ gửi:                        │
│  ┌───────────────────────────────────┐ │
│  │ 💰 Báo giá từ thợ                 │ │
│  │ Giá: 500,000đ                     │ │
│  │ Mô tả: Sửa khóa cửa chuyên nghiệp│ │
│  │ ┌──────────────────────────────┐ │ │
│  │ │ 💰 Đặt đơn ngay              │ │ │
│  │ └──────────────────────────────┘ │ │
│  └───────────────────────────────────┘ │
│                                         │
│  12:35 Khách (bạn):                    │
│  ┌───────────────────────────────────┐ │
│  │ 📋 Khách đặt đơn                  │ │
│  │ Giá: 500,000đ - Sửa khóa cửa      │ │
│  │ ┌──────────────────────────────┐ │ │
│  │ │ ✅ Xác nhận nhận việc         │ │ │
│  │ └──────────────────────────────┘ │ │
│  └───────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│ ┌──────────────────────────────────┐   │
│ │ 💬 Chào giá lại              ▼  │   │ (Provider)
│ │ Giá: [____] Mô tả: [______] Gửi │   │
│ └──────────────────────────────────┘   │
│                                         │
│ ┌──────────────────────────────────┐   │
│ │ Nhập tin nhắn...         [  Gửi ]   │
│ └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 📝 Summary

**Current Problem:** Buttons don't show because messages are `type: 'text'`, not `'QUOTE'`/`'ORDER'`

**Quick Solutions:**
1. ✅ Detect quote/order content by text patterns
2. ✅ Show colored message containers
3. ✅ Add inline action buttons
4. ✅ Keep provider form at bottom

**Result:** User will see clear, colored messages with action buttons right inside the chat!

