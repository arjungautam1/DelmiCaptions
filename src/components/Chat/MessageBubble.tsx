import React from 'react';
import { Message } from '../../types/chat';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      <div className={`message-content ${isUser ? 'user' : 'assistant'}`}>
        {/* Assistant Header */}
        {!isUser && (
          <div className="d-flex align-items-center mb-2">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center me-2"
              style={{
                width: '20px',
                height: '20px',
                background: 'var(--primary-gradient)',
                fontSize: '10px',
                color: 'white'
              }}
            >
              AI
            </div>
            <span className="fw-semibold text-primary" style={{ fontSize: '0.75rem' }}>
              Delmi Assistant
            </span>
          </div>
        )}
        
        {/* Message Content */}
        <div 
          style={{ whiteSpace: 'pre-wrap' }}
          dangerouslySetInnerHTML={{
            __html: message.content
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #6366f1; text-decoration: underline;">$1</a>')
              .replace(/\n/g, '<br>')
          }}
        />
        
        {/* Timestamp */}
        <div 
          className={`mt-1 ${isUser ? 'text-end' : 'text-start'}`}
          style={{ 
            fontSize: '0.65rem',
            opacity: 0.7,
            color: isUser ? 'white' : '#6b7280'
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;