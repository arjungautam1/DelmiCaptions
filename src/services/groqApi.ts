import { Groq } from 'groq-sdk';

interface GroqConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class GroqApiService {
  private config: GroqConfig;
  private groq: Groq;
  private retryAttempts = 3;
  private retryDelay = 1000;

  constructor() {
    this.config = {
      apiKey: process.env.REACT_APP_GROQ_API_KEY || '',
      model: 'deepseek-r1-distill-llama-70b',
      maxTokens: 4096,
      temperature: 0.7
    };
    
    this.groq = new Groq({
      apiKey: this.config.apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  private async makeRequest(
    messages: GroqMessage[],
    options: Partial<GroqConfig> = {}
  ): Promise<GroqResponse> {
    const requestConfig = { ...this.config, ...options };
    
    if (!requestConfig.apiKey) {
      throw new Error('Groq API key is not configured. Please add REACT_APP_GROQ_API_KEY to your environment variables.');
    }

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: messages,
        model: requestConfig.model,
        temperature: requestConfig.temperature,
        max_tokens: requestConfig.maxTokens,
        stream: false
      });

      return {
        choices: chatCompletion.choices.map(choice => ({
          message: {
            content: choice.message.content || '',
            role: choice.message.role
          },
          finish_reason: choice.finish_reason || 'stop'
        })),
        usage: chatCompletion.usage || {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };
    } catch (error: any) {
      // Check for specific rate limit and quota errors
      if (error.status === 429 || error.message?.includes('rate limit') || error.message?.includes('quota') || error.message?.includes('usage limit')) {
        throw new Error('rate limit exceeded');
      }
      
      // Check for other common Groq API errors
      if (error.status === 401) {
        throw new Error('Invalid API key. Please check your Groq API key configuration.');
      }
      
      if (error.status === 400) {
        throw new Error('Invalid request. Please check your input and try again.');
      }
      
      throw new Error(`Groq API error: ${error.message}`);
    }
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    attempt = 1
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (attempt >= this.retryAttempts) {
        throw error;
      }

      const delay = this.retryDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return this.retryRequest(requestFn, attempt + 1);
    }
  }

  async sendMessage(
    messages: GroqMessage[],
    options: Partial<GroqConfig> = {}
  ): Promise<string> {
    try {
      const response = await this.retryRequest(() => 
        this.makeRequest(messages, options)
      );

      if (!response.choices || response.choices.length === 0) {
        throw new Error('No response received from Groq API');
      }

      const content = response.choices[0].message.content;
      
      // Clean the response to remove any thinking process
      const cleanContent = content
        .replace(/<think>[\s\S]*?<\/think>/gi, '') // Remove <think> blocks
        .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '') // Remove <thinking> blocks
        .replace(/thinking:[\s\S]*?(?=\n\n|\n$|$)/gi, '') // Remove thinking: sections
        .replace(/reasoning:[\s\S]*?(?=\n\n|\n$|$)/gi, '') // Remove reasoning: sections
        .replace(/analysis:[\s\S]*?(?=\n\n|\n$|$)/gi, '') // Remove analysis: sections
        .replace(/<process>[\s\S]*?<\/process>/gi, '') // Remove <process> blocks
        .replace(/<thought>[\s\S]*?<\/thought>/gi, '') // Remove <thought> blocks
        .trim();

      return cleanContent;
    } catch (error) {
      console.error('Groq API Error:', error);
      throw error;
    }
  }

  async *streamMessage(
    messages: GroqMessage[],
    options: Partial<GroqConfig> = {}
  ): AsyncGenerator<string, void, unknown> {
    const requestConfig = { ...this.config, ...options };
    
    if (!requestConfig.apiKey) {
      throw new Error('Groq API key is not configured');
    }

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: messages,
        model: requestConfig.model,
        temperature: requestConfig.temperature,
        max_tokens: requestConfig.maxTokens,
        stream: true
      });

      let fullContent = '';
      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          fullContent += content;
          
          // Clean the accumulated content to remove thinking blocks
          const cleanContent = fullContent
            .replace(/<think>[\s\S]*?<\/think>/gi, '') // Remove <think> blocks
            .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '') // Remove <thinking> blocks
            .replace(/<process>[\s\S]*?<\/process>/gi, '') // Remove <process> blocks
            .replace(/<thought>[\s\S]*?<\/thought>/gi, ''); // Remove <thought> blocks
          
          // Only yield if we have clean content
          if (cleanContent.trim()) {
            yield cleanContent;
          }
        }
      }
    } catch (error: any) {
      throw new Error(`Groq API error: ${error.message}`);
    }
  }

  async generateCaption(
    prompt: string,
    context: string = '',
    style: 'professional' | 'casual' | 'creative' = 'professional'
  ): Promise<string[]> {
    const systemPrompt = `You are a social media caption expert specializing in creating engaging captions for Delmi Training Institute.

Context about Delmi Training Institute:
- A leading training institute offering various professional courses
- Focus on practical skills and career development
- Modern, innovative approach to education
- Strong community of learners and professionals

${context ? `Additional context: ${context}` : ''}

Generate 3 different ${style} captions based on the user's request. Each caption should be:
- Engaging and relevant to the content
- Appropriate for social media platforms
- Include relevant hashtags
- Reflect Delmi Training Institute's brand voice

Return only the captions, numbered 1-3, without additional explanation.`;

    const messages: GroqMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    try {
      const response = await this.sendMessage(messages, { temperature: 0.8 });
      
      // Parse the response to extract individual captions
      const captions = response
        .split(/\d+\.\s/)
        .filter(caption => caption.trim())
        .map(caption => caption.trim());

      return captions.length >= 3 ? captions.slice(0, 3) : [response];
    } catch (error) {
      console.error('Caption generation error:', error);
      throw new Error('Failed to generate captions. Please try again.');
    }
  }

  updateConfig(newConfig: Partial<GroqConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.groq = new Groq({
      apiKey: this.config.apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  getConfig(): GroqConfig {
    return { ...this.config };
  }
}

const groqApiService = new GroqApiService();
export default groqApiService;
export type { GroqMessage, GroqResponse, GroqConfig };