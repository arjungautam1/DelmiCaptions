import { useState, useCallback } from 'react';
import { Message } from '../types/chat';
import groqApi, { GroqMessage } from '../services/groqApi';
import { knowledgeLoader } from '../knowledge-base/knowledge-loader';

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  sendMessage: (content: string, attachments?: File[]) => Promise<void>;
  clearMessages: () => void;
  regenerateLastResponse: () => Promise<void>;
}

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const processAttachments = async (files: File[]): Promise<string> => {
    let attachmentContext = '';
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        attachmentContext += `[Image attached: ${file.name}]\n`;
      } else if (file.type === 'application/pdf') {
        attachmentContext += `[PDF attached: ${file.name}]\n`;
      } else if (file.type.startsWith('text/')) {
        try {
          const text = await file.text();
          attachmentContext += `[File content from ${file.name}]:\n${text}\n\n`;
        } catch (error) {
          attachmentContext += `[Text file attached: ${file.name} - could not read content]\n`;
        }
      }
    }
    
    return attachmentContext;
  };

  const sendMessage = useCallback(async (content: string, attachments?: File[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) {
      return;
    }

    const userMessageId = generateMessageId();
    const userMessage: Message = {
      id: userMessageId,
      content,
      role: 'user',
      timestamp: new Date(),
      status: 'sending',
      attachments: attachments?.map(file => ({
        id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type === 'application/pdf' ? 'pdf' : 'text',
        url: URL.createObjectURL(file),
        size: file.size
      }))
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Update user message status to sent
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessageId 
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      );

      // Process attachments
      let fullContent = content;
      if (attachments && attachments.length > 0) {
        const attachmentContext = await processAttachments(attachments);
        fullContent = `${attachmentContext}\n${content}`;
      }

      // Prepare messages for API with comprehensive Delmi Training Institute knowledge base
      const apiMessages: GroqMessage[] = [
        {
          role: 'system',
          content: knowledgeLoader.generateChatContext()
        },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content: fullContent
        }
      ];

      setIsTyping(true);

      // Get response from Groq API
      const response = await groqApi.sendMessage(apiMessages);

      // Clean the response to remove any personal signatures and urgency messaging
      const cleanedResponse = response
        .replace(/Best,\s*\n\s*Alex/gi, '')
        .replace(/Sincerely,\s*\n\s*Alex/gi, '')
        .replace(/Regards,\s*\n\s*Alex/gi, '')
        .replace(/Best regards,\s*\n\s*Alex/gi, '')
        .replace(/Thank you,\s*\n\s*Alex/gi, '')
        .replace(/Alex\s*$/gi, '')
        .replace(/Best,\s*\n\s*[A-Z][a-z]+/gi, '')
        .replace(/Sincerely,\s*\n\s*[A-Z][a-z]+/gi, '')
        .replace(/Regards,\s*\n\s*[A-Z][a-z]+/gi, '')
        .replace(/Best regards,\s*\n\s*[A-Z][a-z]+/gi, '')
        .replace(/Thank you,\s*\n\s*[A-Z][a-z]+/gi, '')
        .replace(/only \d+ spots? left/gi, '')
        .replace(/limited spots? available/gi, '')
        .replace(/hurry, only \d+ spots?/gi, '')
        .replace(/don't miss out/gi, '')
        .replace(/act now/gi, '')
        .replace(/limited time/gi, '')
        .replace(/hurry up/gi, '')
        .replace(/spots? filling fast/gi, '')
        .trim();

      const assistantMessage: Message = {
        id: generateMessageId(),
        content: cleanedResponse,
        role: 'assistant',
        timestamp: new Date(),
        status: 'sent'
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update user message status to error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessageId 
            ? { ...msg, status: 'error' as const }
            : msg
        )
      );
      
      // Check for usage limit error
      const errorMessage = error instanceof Error ? error.message : String(error);
      let userFriendlyMessage = 'Sorry, I encountered an error while processing your message. Please check your API configuration and try again.';
      
      if (errorMessage.includes('rate limit') || errorMessage.includes('quota') || errorMessage.includes('usage limit') || errorMessage.includes('429')) {
        userFriendlyMessage = '🚫 **You\'ve hit the maximum usage limit!**\n\n💎 **Upgrade your Groq plan for more API calls:**\n• Visit [groq.com](https://groq.com) to upgrade\n• Get higher limits and faster responses\n• Unlock premium features and better performance\n\n📊 **Current Status:** Free tier limit reached';
      }
      
      // Add error message
      const assistantMessage: Message = {
        id: generateMessageId(),
        content: userFriendlyMessage,
        role: 'assistant',
        timestamp: new Date(),
        status: 'sent'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const regenerateLastResponse = useCallback(async () => {
    if (messages.length < 2) return;

    const lastUserMessage = messages[messages.length - 2];
    const lastAssistantMessage = messages[messages.length - 1];

    if (lastUserMessage.role !== 'user' || lastAssistantMessage.role !== 'assistant') {
      return;
    }

    // Remove the last assistant message
    setMessages(prev => prev.slice(0, -1));
    setIsLoading(true);
    setIsTyping(true);

    try {
      const apiMessages: GroqMessage[] = [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Provide a different response to the user\'s question.'
        },
        ...messages.slice(0, -1).map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      ];

      const response = await groqApi.sendMessage(apiMessages);

      // Clean the response to remove any personal signatures and urgency messaging
      const cleanedResponse = response
        .replace(/Best,\s*\n\s*Alex/gi, '')
        .replace(/Sincerely,\s*\n\s*Alex/gi, '')
        .replace(/Regards,\s*\n\s*Alex/gi, '')
        .replace(/Best regards,\s*\n\s*Alex/gi, '')
        .replace(/Thank you,\s*\n\s*Alex/gi, '')
        .replace(/Alex\s*$/gi, '')
        .replace(/Best,\s*\n\s*[A-Z][a-z]+/gi, '')
        .replace(/Sincerely,\s*\n\s*[A-Z][a-z]+/gi, '')
        .replace(/Regards,\s*\n\s*[A-Z][a-z]+/gi, '')
        .replace(/Best regards,\s*\n\s*[A-Z][a-z]+/gi, '')
        .replace(/Thank you,\s*\n\s*[A-Z][a-z]+/gi, '')
        .replace(/only \d+ spots? left/gi, '')
        .replace(/limited spots? available/gi, '')
        .replace(/hurry, only \d+ spots?/gi, '')
        .replace(/don't miss out/gi, '')
        .replace(/act now/gi, '')
        .replace(/limited time/gi, '')
        .replace(/hurry up/gi, '')
        .replace(/spots? filling fast/gi, '')
        .trim();

      const newAssistantMessage: Message = {
        id: generateMessageId(),
        content: cleanedResponse,
        role: 'assistant',
        timestamp: new Date(),
        status: 'sent'
      };

      setMessages(prev => [...prev, newAssistantMessage]);

    } catch (error) {
      console.error('Error regenerating response:', error);
      
      // Check for usage limit error
      const errorMessage = error instanceof Error ? error.message : String(error);
      let userFriendlyMessage = 'Sorry, I encountered an error while regenerating the response. Please try again.';
      
      if (errorMessage.includes('rate limit') || errorMessage.includes('quota') || errorMessage.includes('usage limit') || errorMessage.includes('429')) {
        userFriendlyMessage = '🚫 **You\'ve hit the maximum usage limit!**\n\n💎 **Upgrade your Groq plan for more API calls:**\n• Visit [groq.com](https://groq.com) to upgrade\n• Get higher limits and faster responses\n• Unlock premium features and better performance\n\n📊 **Current Status:** Free tier limit reached';
      }
      
      const assistantMessage: Message = {
        id: generateMessageId(),
        content: userFriendlyMessage,
        role: 'assistant',
        timestamp: new Date(),
        status: 'sent'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [messages]);

  return {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    clearMessages,
    regenerateLastResponse
  };
};