// src/lib/api/chat-socket.service.ts
import { io, Socket } from 'socket.io-client'
import { AuthService } from './auth.service'

const SOCKET_URL = 'https://postmaxillary-variably-justa.ngrok-free.dev'

export interface Message {
  id: string
  conversationId: string
  senderId: string
  type: 'text' | 'image' | 'file' | 'system'
  content?: string
  fileUrls: string[]
  fileNames?: string[]
  isRead: boolean
  readAt?: Date
  createdAt: Date
  sender?: any
}

export interface SendMessageDto {
  type: 'text' | 'image' | 'file'
  content?: string
  fileUrls?: string[]
  fileNames?: string[]
}

export interface TypingData {
  conversationId: string
  userId: string
  isTyping: boolean
}

class ChatSocketService {
  private socket: Socket | null = null
  private listeners: Map<string, Set<Function>> = new Map()

  /**
   * Kết nối tới chat WebSocket namespace
   */
  connect(): void {
    if (this.socket?.connected) {
      console.log('🔌 Chat socket already connected')
      return
    }

    const token = AuthService.getToken()
    if (!token) {
      console.error('❌ No token found for chat socket connection')
      return
    }

    console.log('🔌 Connecting to chat socket...')

    this.socket = io(`${SOCKET_URL}/chat`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })

    this.socket.on('connect', () => {
      console.log('✅ Chat socket connected:', this.socket?.id)
    })

    this.socket.on('connected', (data: { userId: string; unreadCount: number }) => {
      console.log('🔔 Chat socket authenticated:', data)
      this.emit('connected', data)
    })

    this.socket.on('disconnect', (reason: string) => {
      console.log('🔌 Chat socket disconnected:', reason)
      this.emit('disconnected', { reason })
    })

    this.socket.on('connect_error', (error: Error) => {
      console.error('❌ Chat socket connection error:', error)
      this.emit('connect_error', { error: error.message })
    })

    // Events từ backend
    this.socket.on('new_message', (data: { conversationId: string; message: Message }) => {
      console.log('💬 New message received:', data)
      this.emit('new_message', data)
    })

    this.socket.on('messages_read', (data: { conversationId: string; readBy: string }) => {
      console.log('✅ Messages read:', data)
      this.emit('messages_read', data)
    })

    this.socket.on('user_typing', (data: TypingData) => {
      console.log('⌨️ User typing:', data)
      this.emit('user_typing', data)
    })

    this.socket.on('unread_updated', (data: { conversationId: string; increment: number }) => {
      console.log('🔢 Unread count updated:', data)
      this.emit('unread_updated', data)
    })
  }

  /**
   * Ngắt kết nối
   */
  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting chat socket...')
      this.socket.disconnect()
      this.socket = null
      this.listeners.clear()
    }
  }

  /**
   * Gửi tin nhắn
   */
  sendMessage(conversationId: string, message: SendMessageDto): Promise<{ success: boolean; message?: Message; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket?.connected) {
        resolve({ success: false, error: 'Socket not connected' })
        return
      }

      this.socket.emit('send_message', { conversationId, message }, (response: any) => {
        resolve(response)
      })
    })
  }

  /**
   * Đánh dấu đã đọc
   */
  markAsRead(conversationId: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket?.connected) {
        resolve({ success: false, error: 'Socket not connected' })
        return
      }

      this.socket.emit('mark_read', { conversationId }, (response: any) => {
        resolve(response)
      })
    })
  }

  /**
   * Gửi trạng thái typing
   */
  sendTyping(conversationId: string, isTyping: boolean): void {
    if (this.socket?.connected) {
      this.socket.emit('typing', { conversationId, isTyping })
    }
  }

  /**
   * Join conversation room
   */
  joinConversation(conversationId: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket?.connected) {
        resolve({ success: false, error: 'Socket not connected' })
        return
      }

      this.socket.emit('join_conversation', { conversationId }, (response: any) => {
        console.log('📥 Joined conversation:', conversationId, response)
        resolve(response)
      })
    })
  }

  /**
   * Leave conversation room
   */
  leaveConversation(conversationId: string): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      if (!this.socket?.connected) {
        resolve({ success: false })
        return
      }

      this.socket.emit('leave_conversation', { conversationId }, (response: any) => {
        console.log('📤 Left conversation:', conversationId)
        resolve(response)
      })
    })
  }

  /**
   * Lắng nghe event với unsubscribe function
   */
  on(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event)
      if (callbacks) {
        callbacks.delete(callback)
      }
    }
  }

  /**
   * Phát event tới tất cả listeners
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in ${event} listener:`, error)
        }
      })
    }
  }

  /**
   * Kiểm tra kết nối
   */
  isConnected(): boolean {
    return this.socket?.connected || false
  }

  /**
   * Reconnect manually
   */
  reconnect(): void {
    if (this.socket) {
      console.log('🔄 Reconnecting chat socket...')
      this.socket.connect()
    } else {
      this.connect()
    }
  }
}

export const chatSocketService = new ChatSocketService()
