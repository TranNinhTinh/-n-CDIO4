# 📝 Posts API Documentation

Tài liệu chi tiết về các API endpoints cho Posts, với tiền tố `/api/v1`.

---

## 📋 Danh sách API Endpoints

### 1. **GET /api/v1/posts/feed**
Lấy danh sách bài đăng công khai (feed)

**Frontend Route:** `/api/posts/feed`

**Query Parameters:**
- `limit` (optional): Số lượng bài đăng mỗi trang (mặc định: 10)
- `cursor` (optional): Cursor để phân trang

**Headers:**
- `Content-Type: application/json`

**Response 200:**
```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "status": "OPEN | CLOSED",
      "customer": {
        "id": "string",
        "displayName": "string",
        "avatar": "string"
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "nextCursor": "string",
  "hasMore": boolean,
  "total": number
}
```

**Frontend Usage:**
```typescript
const posts = await PostService.getFeed({ limit: 20, cursor: 'abc123' })
```

---

### 2. **GET /api/v1/posts/{id}**
Lấy chi tiết bài đăng theo ID

**Frontend Route:** `/api/posts/{id}`

**Path Parameters:**
- `id`: ID của bài đăng

**Headers:**
- `Content-Type: application/json`

**Response 200:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "status": "OPEN | CLOSED",
  "priceRange": {
    "min": number,
    "max": number
  },
  "location": {
    "city": "string",
    "district": "string",
    "ward": "string"
  },
  "customer": {
    "id": "string",
    "displayName": "string",
    "avatar": "string"
  },
  "createdAt": "string",
  "updatedAt": "string"
}
```

**Frontend Usage:**
```typescript
const post = await PostService.getPostById('post-id-123')
```

---

### 3. **POST /api/v1/posts**
Tạo bài đăng mới

**Frontend Route:** `/api/posts`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer {access_token}` ✅ Required

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "priceMin": number,
  "priceMax": number,
  "city": "string",
  "district": "string",
  "ward": "string",
  "isUrgent": boolean
}
```

**Response 201:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "status": "OPEN",
  "createdAt": "string"
}
```

**Frontend Usage:**
```typescript
const newPost = await PostService.createPost({
  title: 'Cần thợ sửa điện',
  description: 'Mất điện toàn bộ nhà',
  priceMin: 200000,
  priceMax: 300000,
  city: 'Đà Nẵng',
  district: 'Hải Châu',
  ward: 'Hòa Cường Bắc',
  isUrgent: true
})
```

---

### 4. **PATCH /api/v1/posts/{id}**
Cập nhật bài đăng

**Frontend Route:** `/api/posts/{id}`

**Path Parameters:**
- `id`: ID của bài đăng

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer {access_token}` ✅ Required

**Request Body (partial update):**
```json
{
  "title": "string",
  "description": "string",
  "priceMin": number,
  "priceMax": number,
  "isUrgent": boolean
}
```

**Response 200:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "updatedAt": "string"
}
```

**Frontend Usage:**
```typescript
const updated = await PostService.updatePost('post-id-123', {
  title: 'Cần thợ sửa điện GẤP',
  isUrgent: true
})
```

---

### 5. **DELETE /api/v1/posts/{id}**
Xóa bài đăng

**Frontend Route:** `/api/posts/{id}`

**Path Parameters:**
- `id`: ID của bài đăng

**Headers:**
- `Authorization: Bearer {access_token}` ✅ Required

**Response 200:**
```json
{
  "success": true,
  "message": "Xóa bài đăng thành công"
}
```

**Frontend Usage:**
```typescript
await PostService.deletePost('post-id-123')
```

---

### 6. **PATCH /api/v1/posts/{id}/close**
Đóng bài đăng (đánh dấu hoàn thành)

**Frontend Route:** `/api/posts/{id}/close`

**Path Parameters:**
- `id`: ID của bài đăng

**Headers:**
- `Authorization: Bearer {access_token}` ✅ Required

**Response 200:**
```json
{
  "id": "string",
  "status": "CLOSED",
  "closedAt": "string"
}
```

**Frontend Usage:**
```typescript
await PostService.closePost('post-id-123')
```

---

### 7. **GET /api/v1/posts/my/posts**
Lấy danh sách bài đăng của tôi

**Frontend Route:** `/api/posts/my/posts`

**Query Parameters:**
- `limit` (optional): Số lượng bài đăng mỗi trang (mặc định: 10)
- `cursor` (optional): Cursor để phân trang

**Headers:**
- `Authorization: Bearer {access_token}` ✅ Required

**Response 200:**
```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "status": "OPEN | CLOSED",
      "createdAt": "string"
    }
  ],
  "nextCursor": "string",
  "hasMore": boolean,
  "total": number
}
```

**Frontend Usage:**
```typescript
const myPosts = await PostService.getMyPosts({ limit: 20 })
```

---

## 🔧 Cấu trúc Files

### Backend API Routes (Next.js):
```
app/api/posts/
├── route.ts                    → POST /api/posts (create)
├── feed/route.ts              → GET /api/posts/feed
├── my/posts/route.ts          → GET /api/posts/my/posts
└── [id]/
    ├── route.ts               → GET/PATCH/DELETE /api/posts/{id}
    └── close/route.ts         → PATCH /api/posts/{id}/close
```

### Frontend Service:
```
src/lib/api/
└── post.service.ts            → PostService với 7 methods
```

---

## ✅ Tình trạng Implementation

| API Endpoint | Backend Route | Frontend Service | Status |
|-------------|---------------|------------------|--------|
| GET /posts/feed | ✅ | ✅ | **Working** |
| GET /posts/{id} | ✅ | ✅ | **Working** |
| POST /posts | ✅ | ✅ | **Working** |
| PATCH /posts/{id} | ✅ | ✅ | **Working** |
| DELETE /posts/{id} | ✅ | ✅ | **Working** |
| PATCH /posts/{id}/close | ✅ | ✅ | **Working** |
| GET /posts/my/posts | ✅ | ✅ | **Working** |

---

## 🚀 Sử dụng trong Components

### Ví dụ: Load posts trong Home page
```typescript
import { PostService } from '@/lib/api/post.service'

const [posts, setPosts] = useState([])

useEffect(() => {
  const loadPosts = async () => {
    try {
      const response = await PostService.getFeed({ limit: 20 })
      setPosts(response.data)
    } catch (error) {
      console.error('Error loading posts:', error)
    }
  }
  loadPosts()
}, [])
```

### Ví dụ: Create post
```typescript
const handleCreatePost = async (formData) => {
  try {
    const newPost = await PostService.createPost({
      title: formData.title,
      description: formData.description,
      priceMin: formData.priceMin,
      priceMax: formData.priceMax,
      city: formData.city,
      district: formData.district,
      ward: formData.ward,
      isUrgent: formData.isUrgent
    })
    alert('Tạo bài đăng thành công!')
    router.push('/home')
  } catch (error) {
    alert(error.message)
  }
}
```

### Ví dụ: Close post
```typescript
const handleClosePost = async (postId) => {
  try {
    await PostService.closePost(postId)
    alert('Đóng bài đăng thành công!')
    // Reload posts
  } catch (error) {
    alert(error.message)
  }
}
```

---

## 🔐 Authentication

Tất cả các API endpoints **NGOẠI TRỪ** `GET /posts/feed` và `GET /posts/{id}` đều **YÊU CẦU** authentication token.

Token được lấy từ `localStorage.getItem('access_token')` và gửi trong header:
```
Authorization: Bearer {access_token}
```

---

## 🌐 Backend Base URL

```typescript
const API_BASE_URL = 'https://postmaxillary-variably-justa.ngrok-free.dev'
```

Tất cả requests đều được proxy qua Next.js API routes để tránh CORS issues.

---

## 📝 Notes

1. **CORS Fix**: Tất cả requests đều qua Next.js API routes (`/api/posts/*`) để tránh CORS
2. **ngrok Header**: Mỗi request có header `ngrok-skip-browser-warning: true`
3. **Token Management**: Token tự động lấy từ localStorage trong `PostService.getAuthHeaders()`
4. **Error Handling**: Tất cả methods đều có try-catch và throw Error với message rõ ràng
5. **TypeScript Types**: Đầy đủ types cho request/response trong `index.ts`

---

## 🎯 TODO (Nếu cần)

- [ ] Thêm filter/search cho feed (city, skills, etc.)
- [ ] Pagination UI component
- [ ] Infinite scroll cho feed
- [ ] Real-time updates với WebSocket
- [ ] Image upload cho posts
- [ ] Comments/Reviews cho posts

---

**Created:** 2025-11-28  
**Last Updated:** 2025-11-28  
**Version:** 1.0
