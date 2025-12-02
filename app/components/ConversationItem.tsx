import { Conversation } from '@/lib/api/chat.service'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
  onDelete: () => void
}

export default function ConversationItem({
  conversation,
  isActive,
  onClick,
  onDelete,
}: ConversationItemProps) {
  const formatTime = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
  }

  return (
    <div
      className={`flex items-center gap-3 p-4 cursor-pointer border-b hover:bg-gray-50 transition-colors ${
        isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
          {conversation.workerAvatar ? (
            <img
              src={conversation.workerAvatar}
              alt={conversation.workerName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold">
              {conversation.workerName.charAt(0)}
            </div>
          )}
        </div>
        {conversation.unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900 truncate">
            {conversation.workerName}
          </h3>
          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
            {formatTime(conversation.lastMessageTime)}
          </span>
        </div>
        <p className="text-sm text-gray-600 truncate">
          {conversation.lastMessage || 'Chưa có tin nhắn'}
        </p>
      </div>

      {/* Actions */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="text-gray-400 hover:text-red-500 transition-colors p-1"
        title="Xóa cuộc trò chuyện"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  )
}
