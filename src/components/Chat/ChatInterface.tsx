import React, { useEffect, useRef } from 'react';
import { BookOpen, CreditCard, Users, Zap, Send, Paperclip } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { Message } from '../../types/chat';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string, attachments?: File[]) => void;
  isLoading?: boolean;
  isTyping?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
  isTyping = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = React.useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickStartOptions = [
    {
      icon: BookOpen,
      title: "Course Information",
      description: "Learn about our training programs",
      query: "Tell me about your courses"
    },
    {
      icon: CreditCard,
      title: "Payment Plans",
      description: "Flexible payment options available",
      query: "What are the payment options?"
    },
    {
      icon: Users,
      title: "Enrollment Process",
      description: "Start your training journey",
      query: "How do I enroll?"
    },
    {
      icon: Zap,
      title: "Technical Details",
      description: "Learn about specific technologies",
      query: "What is network cabling?"
    }
  ];

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {/* Messages Area */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto', 
        padding: '20px',
        minHeight: '400px'
      }}>
        {messages.length === 0 ? (
          // Welcome Screen
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            padding: '40px 20px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#6366f1',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              color: 'white',
              fontSize: '36px'
            }}>
              🎓
            </div>
            
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '12px'
            }}>
              Welcome to Delmi AI Assistant
            </h2>
            
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '32px',
              maxWidth: '400px'
            }}>
              I'm here to help you with courses, enrollment, payment plans, and technical questions.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              width: '100%',
              maxWidth: '600px'
            }}>
              {quickStartOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => onSendMessage(option.query)}
                  style={{
                    padding: '20px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: '#6366f1',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      color: 'white'
                    }}>
                      <option.icon size={20} />
                    </div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: 0
                    }}>
                      {option.title}
                    </h3>
                  </div>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {option.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Messages List
          <div>
            {messages.map((message) => (
              <div key={message.id} style={{ marginBottom: '16px' }}>
                <MessageBubble message={message} />
              </div>
            ))}
            
            {isTyping && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                marginBottom: '16px',
                maxWidth: '200px'
              }}>
                <div style={{ display: 'flex', gap: '4px', marginRight: '12px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#6b7280',
                    borderRadius: '50%',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#6b7280',
                    borderRadius: '50%',
                    animation: 'pulse 1.5s ease-in-out infinite 0.2s'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#6b7280',
                    borderRadius: '50%',
                    animation: 'pulse 1.5s ease-in-out infinite 0.4s'
                  }}></div>
                </div>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>AI is thinking...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          <button
            type="button"
            style={{
              padding: '12px',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280'
            }}
          >
            <Paperclip size={20} />
          </button>
          
          <div style={{ flex: 1 }}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here..."
              disabled={isLoading}
              style={{
                width: '100%',
                minHeight: '50px',
                maxHeight: '120px',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
          
          <button
            type="button"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            style={{
              padding: '12px 16px',
              backgroundColor: inputValue.trim() ? '#6366f1' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '50px',
              transition: 'background-color 0.2s'
            }}
          >
            <Send size={20} />
          </button>
        </div>
        
        <div style={{
          marginTop: '8px',
          fontSize: '12px',
          color: '#9ca3af',
          textAlign: 'center'
        }}>
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;