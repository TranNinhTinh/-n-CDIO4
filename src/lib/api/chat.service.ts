// Chat Service API
import { API_CONFIG } from './config'

export interface Conversation {
  id: string
  workerId: string
  workerName: string
  workerAvatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  isClosed: boolean
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  isRead: boolean
  createdAt: string
}

export interface CreateDirectConversationRequest {
  workerId: string
}

export interface SendMessageRequest {
  content: string
}

export interface SearchMessagesParams {
  query: string
  limit?: number
}

// Token management
const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token')
  }
  return null
}

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken()
  
  const headers: HeadersInit = {
    ...API_CONFIG.HEADERS,
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

// Chat Service
export const chatService = {
  // GET /chat/conversations - Lấy danh sách conversations
  async getConversations(): Promise<Conversation[]> {
    return apiCall<Conversation[]>('/chat/conversations', {
      method: 'GET',
    })
  },

  // GET /chat/conversations/{id} - Xem chi tiết conversation
  async getConversationById(id: string): Promise<Conversation> {
    return apiCall<Conversation>(`/chat/conversations/${id}`, {
      method: 'GET',
    })
  },

  // DELETE /chat/conversations/{id} - Xóa conversation
  async deleteConversation(id: string): Promise<void> {
    return apiCall<void>(`/chat/conversations/${id}`, {
      method: 'DELETE',
    })
  },

  // POST /chat/conversations/direct - Tạo conversation riêng với thợ
  async createDirectConversation(data: CreateDirectConversationRequest): Promise<Conversation> {
    return apiCall<Conversation>('/chat/conversations/direct', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // POST /chat/conversations/{id}/messages - Gửi tin nhắn
  async sendMessage(conversationId: string, data: SendMessageRequest): Promise<Message> {
    return apiCall<Message>(`/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // GET /chat/conversations/{id}/messages - Lấy tin nhắn của conversation
  async getMessages(conversationId: string): Promise<Message[]> {
    return apiCall<Message[]>(`/chat/conversations/${conversationId}/messages`, {
      method: 'GET',
    })
  },

  // POST /chat/conversations/{id}/read - Đánh dấu tin nhắn đã đọc
  async markAsRead(conversationId: string): Promise<void> {
    return apiCall<void>(`/chat/conversations/${conversationId}/read`, {
      method: 'POST',
    })
  },

  // GET /chat/unread-count - Đếm tổng tin nhắn chưa đọc
  async getUnreadCount(): Promise<{ unreadCount: number }> {
    return apiCall<{ unreadCount: number }>('/chat/unread-count', {
      method: 'GET',
    })
  },

  // POST /chat/conversations/{id}/close - Đóng conversation
  async closeConversation(conversationId: string): Promise<void> {
    return apiCall<void>(`/chat/conversations/${conversationId}/close`, {
      method: 'POST',
    })
  },

  // GET /chat/search - Tìm kiếm tin nhắn
  async searchMessages(params: SearchMessagesParams): Promise<Message[]> {
    const queryParams = new URLSearchParams({
      query: params.query,
      ...(params.limit && { limit: params.limit.toString() }),
    })
    
    return apiCall<Message[]>(`/chat/search?${queryParams}`, {
      method: 'GET',
    })
  },
}
