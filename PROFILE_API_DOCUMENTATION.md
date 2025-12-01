# Profile API Documentation

Tài liệu chi tiết về các API Profile với prefix `/api/v1`

## Base URL
```
https://postmaxillary-variably-justa.ngrok-free.dev/api/v1
```

---

## 1. GET /api/v1/profile/me
**Lấy thông tin profile của user hiện tại**

### Headers
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

### Response 200 (Success)
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "phone": "0987654321",
  "fullName": "Nguyễn Văn A",
  "displayName": "vana_user",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "Tôi là thợ điện với 5 năm kinh nghiệm",
  "accountType": "WORKER",
  "contactInfo": {
    "phone": "0987654321",
    "email": "user@example.com",
    "address": "123 Đường ABC",
    "city": "Hồ Chí Minh",
    "district": "Quận 1",
    "ward": "Phường Bến Nghé"
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-11-28T00:00:00Z"
}
```

### Response 401 (Unauthorized)
```json
{
  "error": "Unauthorized - Token không tồn tại"
}
```

### Mô tả
- API này dùng để lấy thông tin profile đầy đủ của user đang đăng nhập
- Yêu cầu token xác thực hợp lệ
- Trả về tất cả thông tin cá nhân, bao gồm cả thông tin riêng tư

---

## 2. PATCH /api/v1/profile/me
**Cập nhật thông tin profile của user**

### Headers
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

### Body
```json
{
  "fullName": "Nguyễn Văn B",
  "displayName": "vanb_user",
  "bio": "Tôi là thợ điện chuyên nghiệp",
  "phone": "0912345678"
}
```

### Response 200 (Success)
```json
{
  "id": "user_123",
  "fullName": "Nguyễn Văn B",
  "displayName": "vanb_user",
  "bio": "Tôi là thợ điện chuyên nghiệp",
  "updatedAt": "2024-11-28T00:00:00Z"
}
```

### Response 400 (Bad Request)
```json
{
  "error": "Thông tin không hợp lệ"
}
```

### Mô tả
- Cập nhật một hoặc nhiều trường thông tin profile
- Tất cả các trường đều optional
- Chỉ cập nhật các trường được gửi lên

---

## 3. DELETE /api/v1/profile/me
**Xóa tài khoản người dùng**

### Headers
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

### Body (Optional)
```json
{
  "password": "user_password",
  "reason": "Không còn sử dụng dịch vụ"
}
```

### Response 200 (Success)
```json
{
  "message": "Tài khoản đã được xóa thành công"
}
```

### Response 401 (Unauthorized)
```json
{
  "error": "Mật khẩu không chính xác"
}
```

### Mô tả
- Xóa vĩnh viễn tài khoản người dùng
- Có thể yêu cầu xác nhận mật khẩu để bảo mật
- Có thể ghi lại lý do xóa tài khoản
- ⚠️ **Cảnh báo**: Hành động này không thể hoàn tác!

---

## 4. PUT /api/v1/profile/contact
**Cập nhật thông tin liên hệ**

### Headers
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

### Body
```json
{
  "phone": "0987654321",
  "email": "newemail@example.com",
  "address": "456 Đường XYZ",
  "city": "Hà Nội",
  "district": "Quận Ba Đình",
  "ward": "Phường Điện Biên"
}
```

### Response 200 (Success)
```json
{
  "id": "user_123",
  "contactInfo": {
    "phone": "0987654321",
    "email": "newemail@example.com",
    "address": "456 Đường XYZ",
    "city": "Hà Nội",
    "district": "Quận Ba Đình",
    "ward": "Phường Điện Biên"
  },
  "updatedAt": "2024-11-28T00:00:00Z"
}
```

### Response 400 (Bad Request)
```json
{
  "error": "Số điện thoại không hợp lệ"
}
```

### Validation Rules
- **phone**: 10-11 chữ số
- **email**: Định dạng email hợp lệ
- Các trường khác: Không có yêu cầu đặc biệt

### Mô tả
- Cập nhật thông tin liên hệ của user
- Validate số điện thoại và email trước khi gửi
- Tất cả các trường đều optional

---

## 5. PUT /api/v1/profile/display-name
**Thay đổi tên hiển thị**

### Headers
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

### Body
```json
{
  "displayName": "new_username"
}
```

### Response 200 (Success)
```json
{
  "id": "user_123",
  "displayName": "new_username",
  "updatedAt": "2024-11-28T00:00:00Z"
}
```

### Response 400 (Bad Request)
```json
{
  "error": "Tên hiển thị phải từ 3-50 ký tự"
}
```

### Validation Rules
- **Độ dài**: 3-50 ký tự
- **Ký tự cho phép**: Chữ cái (a-z, A-Z), số (0-9), khoảng trắng, và ký tự tiếng Việt
- **Không cho phép**: Ký tự đặc biệt (@, #, $, %, v.v.)

### Mô tả
- Thay đổi tên hiển thị của user
- Tên hiển thị phải unique (không trùng với user khác)
- Validate format trước khi gửi

---

## 6. PATCH /api/v1/profile/avatar
**Cập nhật avatar**

### Method 1: Upload File

#### Headers
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "multipart/form-data"
}
```

#### Body (FormData)
```
avatar: [File] (image file)
```

#### File Requirements
- **Định dạng**: JPG, JPEG, PNG, GIF
- **Kích thước tối đa**: 5MB
- **Khuyến nghị**: Ảnh vuông, tối thiểu 200x200px

### Method 2: Avatar URL

#### Headers
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

#### Body
```json
{
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

### Response 200 (Success)
```json
{
  "id": "user_123",
  "avatar": "https://cdn.example.com/avatars/user_123.jpg",
  "updatedAt": "2024-11-28T00:00:00Z"
}
```

### Response 400 (Bad Request)
```json
{
  "error": "Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif)"
}
```

### Mô tả
- Hai cách upload avatar: file trực tiếp hoặc URL
- Server sẽ resize và optimize ảnh
- Trả về URL CDN của avatar mới

---

## 7. GET /api/v1/profile/user/{id}
**Lấy profile công khai của user khác**

### Headers
```json
{
  "Authorization": "Bearer {access_token}" // Optional
}
```

### URL Parameters
- **id** (required): User ID

### Response 200 (Success)
```json
{
  "id": "user_456",
  "displayName": "worker_pro",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "Thợ điện chuyên nghiệp 10 năm kinh nghiệm",
  "accountType": "WORKER",
  "rating": 4.8,
  "totalReviews": 150,
  "completedJobs": 200,
  "joinedAt": "2023-01-01T00:00:00Z",
  "isVerified": true,
  "skills": ["Điện dân dụng", "Điện công nghiệp", "Sửa chữa điện"],
  "location": {
    "city": "Hồ Chí Minh",
    "district": "Quận 1"
  }
}
```

### Response 404 (Not Found)
```json
{
  "error": "User không tồn tại"
}
```

### Mô tả
- Xem profile công khai của user khác
- Không cần đăng nhập để xem (nhưng có thể có thông tin bổ sung nếu đăng nhập)
- Chỉ hiển thị thông tin công khai, không có thông tin nhạy cảm
- Đặc biệt hữu ích để xem profile của thợ trước khi thuê

---

## 8. GET /api/v1/profile/search
**Tìm kiếm profiles**

### Headers
```json
{
  "Authorization": "Bearer {access_token}" // Optional
}
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | No | Từ khóa tìm kiếm (tên, kỹ năng, mô tả) |
| accountType | string | No | Loại tài khoản: `CUSTOMER` hoặc `WORKER` |
| city | string | No | Thành phố |
| district | string | No | Quận/Huyện |
| skills | string | No | Kỹ năng (comma-separated) |
| minRating | number | No | Đánh giá tối thiểu (1-5) |
| isVerified | boolean | No | Chỉ tài khoản đã xác thực |
| page | number | No | Trang hiện tại (default: 1) |
| limit | number | No | Số kết quả/trang (default: 20, max: 100) |
| sortBy | string | No | Sắp xếp: `rating`, `reviews`, `joinedAt`, `name` |
| order | string | No | Thứ tự: `asc`, `desc` (default: desc) |

### Example Request
```
GET /api/v1/profile/search?q=thợ+điện&city=Hồ+Chí+Minh&minRating=4&page=1&limit=20&sortBy=rating&order=desc
```

### Response 200 (Success)
```json
{
  "data": [
    {
      "id": "user_456",
      "displayName": "worker_pro",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "Thợ điện chuyên nghiệp",
      "accountType": "WORKER",
      "rating": 4.8,
      "totalReviews": 150,
      "completedJobs": 200,
      "isVerified": true,
      "skills": ["Điện dân dụng", "Điện công nghiệp"],
      "location": {
        "city": "Hồ Chí Minh",
        "district": "Quận 1"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Response 400 (Bad Request)
```json
{
  "error": "Tham số không hợp lệ"
}
```

### Mô tả
- Tìm kiếm profiles theo nhiều tiêu chí
- Hỗ trợ phân trang
- Hỗ trợ sắp xếp theo nhiều tiêu chí
- Không cần đăng nhập để tìm kiếm cơ bản
- Có thể lọc theo location, rating, skills, v.v.

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Dữ liệu không hợp lệ |
| 401 | Unauthorized - Token không hợp lệ hoặc hết hạn |
| 403 | Forbidden - Không có quyền truy cập |
| 404 | Not Found - Resource không tồn tại |
| 500 | Internal Server Error - Lỗi server |

---

## Common Headers

### Request Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {access_token}",
  "ngrok-skip-browser-warning": "true"
}
```

### Response Headers
```json
{
  "Content-Type": "application/json"
}
```

---

## Authentication

Hầu hết các API yêu cầu Bearer Token trong header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token có thể lấy từ:
- API `/api/v1/auth/login`
- API `/api/v1/auth/register`

Token sẽ hết hạn sau một khoảng thời gian, cần refresh bằng refresh token.

---

## Best Practices

1. **Luôn validate dữ liệu** ở client trước khi gửi lên server
2. **Xử lý errors** một cách graceful
3. **Cache profile data** để giảm số lượng API calls
4. **Implement retry logic** cho các request bị failed
5. **Show loading states** khi gọi API
6. **Handle token expiration** và auto-refresh token
7. **Optimize images** trước khi upload avatar
8. **Use pagination** khi search để tránh load quá nhiều dữ liệu

---

## Example Usage (TypeScript)

```typescript
// Get my profile
const getMyProfile = async () => {
  const token = localStorage.getItem('access_token')
  
  const response = await fetch('/api/v1/profile/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error('Failed to get profile')
  }
  
  return await response.json()
}

// Update profile
const updateProfile = async (data: UpdateProfileData) => {
  const token = localStorage.getItem('access_token')
  
  const response = await fetch('/api/v1/profile/me', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    throw new Error('Failed to update profile')
  }
  
  return await response.json()
}

// Upload avatar
const uploadAvatar = async (file: File) => {
  const token = localStorage.getItem('access_token')
  const formData = new FormData()
  formData.append('avatar', file)
  
  const response = await fetch('/api/v1/profile/avatar', {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })
  
  if (!response.ok) {
    throw new Error('Failed to upload avatar')
  }
  
  return await response.json()
}

// Search profiles
const searchProfiles = async (params: SearchParams) => {
  const queryString = new URLSearchParams(params).toString()
  
  const response = await fetch(`/api/v1/profile/search?${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error('Failed to search profiles')
  }
  
  return await response.json()
}
```
