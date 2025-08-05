import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, Image, FileText, Mic, Smile } from 'lucide-react';

interface InputAreaProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  disabled?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image size={14} className="text-blue-600" />;
    } else if (file.type === 'application/pdf') {
      return <FileText size={14} className="text-red-600" />;
    }
    return <Paperclip size={14} className="text-gray-600" />;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  return (
    <div className="w-100">
      {/* 📎 Modern Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3">
          <div className="d-flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="d-flex align-items-center"
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--shadow-glass)'
                }}
              >
                {getFileIcon(file)}
                <span className="ms-2 text-sm" style={{ 
                  color: 'var(--text-primary)',
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {file.name}
                </span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="btn-compact ms-2"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    padding: '2px',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 💬 Ultra-Modern Input Form */}
      <form onSubmit={handleSubmit} className="position-relative">
        <div 
          style={{
            padding: 'var(--space-lg)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--glass-border)',
            background: 'white',
            boxShadow: 'var(--shadow-glass)'
          }}
        >
          <div className="d-flex align-items-end" style={{ gap: 'var(--space-md)' }}>
            {/* 🎯 Action Buttons - Left */}
            <div className="d-flex align-items-center" style={{ gap: 'var(--space-xs)' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="btn-compact btn-secondary-modern"
                title="Attach File"
              >
                <Paperclip size={18} />
              </button>
              
              <button
                type="button"
                disabled={disabled}
                className="btn-compact btn-secondary-modern"
                title="Add Emoji"
              >
                <Smile size={18} />
              </button>
            </div>

            {/* ✨ Message Input */}
            <div className="flex-grow-1 position-relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Type your message here... Ask about courses, enrollment, or anything else!"
                disabled={disabled}
                className="w-100 form-control"
                style={{
                  minHeight: '48px',
                  maxHeight: '120px',
                  resize: 'none',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  color: 'var(--text-primary)',
                  padding: 'var(--space-md) 0'
                }}
                rows={1}
              />
              
              {/* Character Counter */}
              {message.length > 500 && (
                <div 
                  className="position-absolute"
                  style={{
                    bottom: '-24px',
                    right: '0',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  {message.length}/2000
                </div>
              )}
            </div>

            {/* 🚀 Action Buttons - Right */}
            <div className="d-flex align-items-center" style={{ gap: 'var(--space-xs)' }}>
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                disabled={disabled}
                className="btn-compact"
                style={{
                  background: isRecording ? 'var(--gradient-danger)' : 'var(--glass-white)',
                  color: isRecording ? 'white' : 'var(--text-muted)',
                  border: 'none'
                }}
                title={isRecording ? "Stop Recording" : "Voice Message"}
              >
                <Mic size={18} className={isRecording ? 'animate-pulse' : ''} />
              </button>

              <button
                type="submit"
                disabled={disabled || (!message.trim() && attachments.length === 0)}
                className="btn-compact"
                style={{
                  background: message.trim() || attachments.length > 0
                    ? 'var(--gradient-primary)'
                    : 'var(--glass-light)',
                  color: message.trim() || attachments.length > 0
                    ? 'white'
                    : 'var(--text-muted)',
                  border: 'none',
                  boxShadow: message.trim() || attachments.length > 0
                    ? 'var(--shadow-glow)'
                    : 'none',
                  cursor: message.trim() || attachments.length > 0
                    ? 'pointer'
                    : 'not-allowed'
                }}
                title="Send Message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt,.doc,.docx"
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
        />
      </form>

      {/* 💡 Modern Helper Text */}
      <div 
        className="d-flex align-items-center justify-content-between mt-3"
        style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
      >
        <div className="d-flex align-items-center" style={{ gap: 'var(--space-md)' }}>
          <span>Press Enter ↵ to send • Shift+Enter for new line</span>
          <span>•</span>
          <span>✨ Supports images, PDFs, and documents</span>
        </div>
        
        <div className="d-flex align-items-center" style={{ gap: 'var(--space-sm)' }}>
          <div className="d-flex" style={{ gap: '2px' }}>
            <div style={{
              width: '4px',
              height: '4px',
              background: 'var(--gradient-success)',
              borderRadius: '50%'
            }}></div>
            <div style={{
              width: '4px',
              height: '4px',
              background: 'var(--gradient-success)',
              borderRadius: '50%'
            }}></div>
            <div style={{
              width: '4px',
              height: '4px',
              background: 'var(--gradient-success)',
              borderRadius: '50%'
            }}></div>
          </div>
          <span style={{ fontWeight: '600' }}>🟢 AI Online</span>
        </div>
      </div>
    </div>
  );
};

export default InputArea;