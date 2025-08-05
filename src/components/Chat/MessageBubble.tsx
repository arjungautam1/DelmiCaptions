import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Copy, Check } from 'lucide-react';
import { Message } from '../../types/chat';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Remove HTML formatting for plain text copy
      const plainText = message.content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
        .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove markdown links, keep text
      
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };
  
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
              .replace(/### (.*?)(?=\n|$)/g, '<h3 style="margin: 1rem 0 0.5rem 0; font-size: 1.1rem; font-weight: 600; color: #374151;">$1</h3>')
              .replace(/## (.*?)(?=\n|$)/g, '<h2 style="margin: 1rem 0 0.5rem 0; font-size: 1.2rem; font-weight: 600; color: #374151;">$1</h2>')
              .replace(/# (.*?)(?=\n|$)/g, '<h1 style="margin: 1rem 0 0.5rem 0; font-size: 1.3rem; font-weight: 600; color: #374151;">$1</h1>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #6366f1; text-decoration: underline;">$1</a>')
              .replace(/\n/g, '<br>')
          }}
        />
        
        {/* Timestamp and Copy Button */}
        <div className={`mt-2 d-flex align-items-center ${isUser ? 'justify-content-end' : 'justify-content-between'}`}>
          <div 
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
          
          {/* Copy Button - Only show for assistant messages */}
          {!isUser && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleCopy}
              className="d-flex align-items-center ms-2"
              style={{ 
                fontSize: '0.7rem',
                padding: '4px 8px',
                border: '1px solid #e9ecef',
                borderRadius: '6px',
                opacity: 0.8
              }}
            >
              {copied ? (
                <>
                  <Check size={12} className="me-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={12} className="me-1" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;