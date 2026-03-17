# 🚧 Backend TODO: Orders API

## ⚠️ Hiện trạng
Frontend đã sẵn sàng nhưng **Backend NestJS chưa có các endpoint Orders API**

## ✅ Cần implement các API sau:

### 1. **GET /orders**
Lấy danh sách đơn hàng của user hiện tại

**Query Parameters:**
- `status?: string` - Lọc theo trạng thái (PENDING, CONFIRMED, IN_PROGRESS, PROVIDER_COMPLETED, COMPLETED, CANCELLED)
- `role?: 'customer' | 'provider'` - Lọc theo vai trò (khách hàng hoặc thợ)
- `limit?: number` - Số lượng đơn hàng (default: 20)
- `cursor?: string` - Pagination cursor

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "orderNumber": "ORD-001",
      "quoteId": "uuid",
      "postId": "uuid",
      "customerId": "uuid",
      "providerId": "uuid",
      "customerName": "Tên khách",
      "providerName": "Tên thợ",
      "price": 500000,
      "description": "Mô tả công việc",
      "status": "CONFIRMED",
      "providerCompletedAt": "ISO date",
      "customerCompletedAt": "ISO date",
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    }
  ],
  "nextCursor": "cursor-string",
  "hasMore": true,
  "total": 10
}
```

---

### 2. **GET /orders/stats**
Thống kê đơn hàng của user

**Response:**
```json
{
  "total": 10,
  "pending": 2,
  "inProgress": 3,
  "completed": 4,
  "cancelled": 1,
  "totalRevenue": 5000000
}
```

---

### 3. **POST /orders/confirm-from-quote/:quoteId**
Tạo đơn hàng từ báo giá (khi khách hàng hoặc thợ chấp nhận báo giá)

**Body:**
```json
{
  "estimatedCompletionDate": "ISO date (optional)",
  "notes": "Ghi chú (optional)"
}
```

**Response:**
```json
{
  "id": "uuid",
  "orderNumber": "ORD-001",
  "quoteId": "uuid",
  "postId": "uuid",
  "customerId": "uuid",
  "providerId": "uuid",
  "price": 500000,
  "description": "Mô tả",
  "status": "CONFIRMED",
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

---

### 4. **POST /orders/:id/provider-complete**
Thợ xác nhận hoàn thành công việc

**Body:**
```json
{
  "notes": "Đã hoàn thành (optional)"
}
```

---

### 5. **POST /orders/:id/customer-complete**
Khách hàng xác nhận hoàn thành và đánh giá

**Body:**
```json
{
  "rating": 5,
  "review": "Làm việc tốt!"
}
```

---

### 6. **GET /orders/:id**
Xem chi tiết một đơn hàng

---

### 7. **GET /orders/number/:orderNumber**
Xem đơn hàng theo mã số (ORD-001)

---

### 8. **POST /orders/:id/cancel**
Hủy đơn hàng

**Body:**
```json
{
  "reason": "Lý do hủy"
}
```

---

## 📋 Database Schema Gợi ý

```typescript
@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  orderNumber: string // AUTO: ORD-001, ORD-002...

  @ManyToOne(() => Quote)
  quote: Quote

  @ManyToOne(() => Post)
  post: Post

  @ManyToOne(() => User)
  customer: User

  @ManyToOne(() => User)
  provider: User

  @Column('decimal')
  price: number

  @Column('text')
  description: string

  @Column({
    type: 'enum',
    enum: ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'PROVIDER_COMPLETED', 'COMPLETED', 'CANCELLED']
  })
  status: string

  @Column({ nullable: true })
  providerCompletedAt: Date

  @Column({ nullable: true })
  customerCompletedAt: Date

  @Column({ nullable: true })
  estimatedCompletionDate: Date

  @Column({ type: 'text', nullable: true })
  notes: string

  @Column({ nullable: true })
  cancelReason: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
```

---

## 🔔 Notifications cần gửi

Khi có sự kiện orders, gửi notification đến:

1. **ORDER_CREATED** → Gửi cho cả customer và provider
2. **ORDER_PROVIDER_COMPLETED** → Gửi cho customer
3. **ORDER_CUSTOMER_COMPLETED** → Gửi cho provider
4. **ORDER_CANCELLED** → Gửi cho bên còn lại

---

## 🎯 Luồng hoạt động

1. **Khách đăng bài** → Thợ gửi báo giá
2. **Khách chấp nhận báo giá** → Gọi `POST /orders/confirm-from-quote/:quoteId`
3. **Hệ thống tự động tạo:**
   - Order với status = CONFIRMED
   - Conversation để chat
   - Notification cho cả 2 bên
4. **Thợ hoàn thành** → `POST /orders/:id/provider-complete`
5. **Khách xác nhận** → `POST /orders/:id/customer-complete`
6. **Order status = COMPLETED**

---

## 🚀 Frontend đã sẵn sàng

Frontend đã implement đầy đủ:
- ✅ `OrderService` với 8 methods
- ✅ API routes (`/api/orders/*`) proxy đến backend
- ✅ UI trang "Đơn hàng" hoàn chỉnh
- ✅ Tích hợp với workflow chấp nhận báo giá
- ✅ Mock data tạm thời (xóa khi backend sẵn sàng)

**Khi backend implement xong → Frontend hoạt động ngay lập tức!**

---

## 📝 Testing

Sau khi implement, test các case:

1. ✅ User có thể xem danh sách orders của mình
2. ✅ Filter theo status (pending, completed...)
3. ✅ Filter theo role (customer/provider)
4. ✅ Stats hiển thị đúng số liệu
5. ✅ Tạo order từ quote thành công
6. ✅ Provider complete → Customer complete workflow
7. ✅ Cancel order có lý do
8. ✅ Notifications được gửi đúng

---

## 🔗 Related Files

Frontend files để tham khảo:
- `src/lib/api/order.service.ts` - Service implementation
- `app/api/orders/**` - API routes
- `app/don-hang/page.tsx` - UI page
- `app/thong-bao/page.tsx` - Accept quote integration
