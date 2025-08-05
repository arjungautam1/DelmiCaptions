import React, { useState, useRef } from 'react';
import { Container, Row, Col, Nav, Card, Button, Form, InputGroup, Spinner, Badge, Alert } from 'react-bootstrap';
import { MessageSquare, Wand2, Send, Paperclip, Upload, Sparkles, Brain, BookOpen, CreditCard, Users, Zap, Copy, Heart, Check, X, FileText } from 'lucide-react';
import { useChat } from './hooks/useChat';
import MessageBubble from './components/Chat/MessageBubble';
import MediaUpload from './components/MediaUpload';
import CaptionStyleSelector, { CaptionStyle } from './components/CaptionStyleSelector';
import CaptionResults from './components/CaptionResults';
import { Groq } from 'groq-sdk';
import { KnowledgeBaseContextGenerator } from './knowledge-base';

interface MediaFile {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'video' | 'document';
  size: string;
  textContent?: string;
}

interface GeneratedCaption {
  id: string;
  text: string;
  style: 'professional' | 'casual' | 'creative';
  isFavorite: boolean;
  imageAnalysis?: string;
}

function App() {
  const { messages, isLoading, isTyping, sendMessage, clearMessages } = useChat();
  const [activeTab, setActiveTab] = useState<'chat' | 'captions'>('chat');
  const [inputValue, setInputValue] = useState('');
  const [captionPrompt, setCaptionPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<CaptionStyle>('professional');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaptions, setGeneratedCaptions] = useState<GeneratedCaption[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [imageAnalysis, setImageAnalysis] = useState<string | null>(null);
  const [transcriptContent, setTranscriptContent] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [useModernAnalysis, setUseModernAnalysis] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Remove unused ref as we'll use the MediaUpload component

  // Initialize Groq SDK and Knowledge Base
  const groq = new Groq({
    apiKey: process.env.REACT_APP_GROQ_API_KEY || '',
    dangerouslyAllowBrowser: true
  });
  const contextGenerator = new KnowledgeBaseContextGenerator();

  // Function to fix mixed Unicode bold text formatting
  const fixUnicodeBoldText = (text: string): string => {
    // Define mapping for Unicode bold characters
    const boldMap: { [key: string]: string } = {
      // Lowercase
      'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
      'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
      'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
      'y': '𝘆', 'z': '𝘇',
      // Uppercase
      'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
      'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣',
      'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫',
      'Y': '𝗬', 'Z': '𝗭',
      // Numbers
      '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳',
      '8': '𝟴', '9': '𝟵'
    };

    // Define sets of Unicode bold characters for easier checking
    const boldChars = new Set([
      '𝗮', '𝗯', '𝗰', '𝗱', '𝗲', '𝗳', '𝗴', '𝗵', '𝗶', '𝗷', '𝗸', '𝗹', '𝗺', '𝗻', '𝗼', '𝗽',
      '𝗾', '𝗿', '𝘀', '𝘁', '𝘂', '𝘃', '𝘄', '𝘅', '𝘆', '𝘇',
      '𝗔', '𝗕', '𝗖', '𝗗', '𝗘', '𝗙', '𝗚', '𝗛', '𝗜', '𝗝', '𝗞', '𝗟', '𝗠', '𝗡', '𝗢', '𝗣',
      '𝗤', '𝗥', '𝗦', '𝗧', '𝗨', '𝗩', '𝗪', '𝗫', '𝗬', '𝗭',
      '𝟬', '𝟭', '𝟮', '𝟯', '𝟰', '𝟱', '𝟲', '𝟳', '𝟴', '𝟵'
    ]);
    
    // Split text into words and process each word
    return text.split(/(\s+)/).map(word => {
      // Skip if it's just whitespace
      if (/^\s+$/.test(word)) return word;
      
      // Check if word contains both bold Unicode and regular characters
      let hasBold = false;
      let hasRegular = false;
      
      for (const char of word) {
        if (boldChars.has(char)) {
          hasBold = true;
        } else if (/[a-zA-Z0-9]/.test(char)) {
          hasRegular = true;
        }
        
        // Early exit if we found both
        if (hasBold && hasRegular) break;
      }
      
      // If word has mixed formatting, convert all characters to bold
      if (hasBold && hasRegular) {
        return word.split('').map(char => boldMap[char] || char).join('');
      }
      
      return word;
    }).join('');
  };

  // Chat functionality
  const handleSend = () => {
    if (inputValue.trim() || attachments.length > 0) {
      sendMessage(inputValue.trim(), attachments);
      setInputValue('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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

  // Media files handling
  const handleMediaFilesSelect = async (files: MediaFile[]) => {
    setMediaFiles(files);
    
    // Check for transcript files
    const transcriptFile = files.find(f => f.textContent);
    if (transcriptFile && transcriptFile.textContent) {
      setTranscriptContent(transcriptFile.textContent);
    } else {
      setTranscriptContent(null);
    }
    
    // Analyze the first image file if available
    const firstImage = files.find(f => f.type === 'image' && f.preview);
    if (firstImage && firstImage.preview) {
      try {
        const response = await groq.chat.completions.create({
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this image and describe what you see. Focus on elements that would be relevant for social media captions (people, activities, setting, mood, objects, etc.). Be concise but detailed.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: firstImage.preview
                  }
                }
              ]
            }
          ],
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          max_tokens: 300
        });

        const analysis = response.choices[0]?.message?.content || 'Unable to analyze image';
        setImageAnalysis(analysis);
      } catch (error) {
        console.error('Error analyzing image:', error);
        setImageAnalysis('Image uploaded successfully but analysis failed. You can still generate captions based on your text prompt.');
      }
    } else {
      setImageAnalysis(null);
    }
  };

  const generateCaptions = async () => {
    if (!captionPrompt.trim() && !imageAnalysis && !transcriptContent) return;

    setIsGenerating(true);
    try {
      const context = contextGenerator.generateContext(
        selectedStyle,
        captionPrompt,
        imageAnalysis || undefined,
        undefined,
        undefined
      );

      let modernAnalysisPrompt = '';
      if (useModernAnalysis) {
        modernAnalysisPrompt = `
        
MODERN SOCIAL MEDIA ANALYSIS:
Consider current social media trends, engagement patterns, and what makes content shareable in 2024:
- Authentic, behind-the-scenes content performs well
- Educational content mixed with personality drives engagement
- Community-building and user-generated content trends
- Video-first content strategy (even for image posts, think about motion/action)
- Micro-communities and niche targeting
- Interactive elements (questions, polls, calls-to-action)
- Accessibility considerations (alt text, inclusive language)
- Cross-platform optimization
        `;
      }

      // Read the caption style examples
      const captionStyleExamples = `
EXAMPLE CAPTION STYLES FROM DELMI TRAINING INSTITUTE:

1. Course Completion/Student Success:
"Mohamed shares his journey of completing 𝗻𝗲𝘁𝘄𝗼𝗿𝗸 𝗰𝗮𝗯𝗹𝗶𝗻𝗴, 𝗖𝗖𝗧𝗩, 𝗲𝗹𝗲𝗰𝘁𝗿𝗼𝗻𝗶𝗰𝘀/𝗿𝗲𝗹𝗮𝘆𝘀 𝗮𝗻𝗱 𝗮𝗰𝗰𝗲𝘀𝘀 𝗰𝗼𝗻𝘁𝗿𝗼𝗹 training at 𝗗𝗲𝗹𝗺𝗶 𝗧𝗿𝗮𝗶𝗻𝗶𝗻𝗴 𝗜𝗻𝘀𝘁𝗶𝘁𝘂𝘁𝗲! 💡 🔐\nHands-on experience turned into real-world skills—𝗵𝗶𝘀 𝗷𝗼𝘂𝗿𝗻𝗲𝘆 𝗽𝗿𝗼𝘃𝗲𝘀 𝘁𝗵𝗲 𝗶𝗺𝗽𝗮𝗰𝘁 𝗼𝗳 𝗹𝗲𝗮𝗿𝗻𝗶𝗻𝗴 𝗯𝘆 𝗱𝗼𝗶𝗻𝗴.\n📍 Ready to level up your career in 𝗰𝗮𝗯𝗹𝗶𝗻𝗴 𝗮𝗻𝗱 𝗲𝗹𝗲𝗰𝘁𝗿𝗼𝗻𝗶𝗰 𝘀𝗲𝗰𝘂𝗿𝗶𝘁𝘆?\n👉 𝗘𝗻𝗿𝗼𝗹𝗹 𝘁𝗼𝗱𝗮𝘆 : www.delmitraining.com"

2. Course Launch/Training Day:
"🚨 𝗖𝗖𝗧𝗩 𝗦𝘂𝗿𝘃𝗲𝗶𝗹𝗹𝗮𝗻𝗰𝗲 𝗧𝗲𝗰𝗵𝗻𝗶𝗰𝗶𝗮𝗻 Course kicks off at 𝗗𝗲𝗹𝗺𝗶 𝗧𝗿𝗮𝗶𝗻𝗶𝗻𝗴 𝗜𝗻𝘀𝘁𝗶𝘁𝘂𝘁𝗲! 🎥\nStudents begin their hands-on journey into 𝗖𝗖𝗧𝗩, 𝘀𝘆𝘀𝘁𝗲𝗺 𝗶𝗻𝘁𝗲𝗴𝗿𝗮𝘁𝗶𝗼𝗻, 𝗮𝗻𝗱 𝘀𝗲𝗰𝘂𝗿𝗶𝘁𝘆 𝘁𝗲𝗰𝗵—learning to install & configure IP/analog cameras, program DVR/NVRs, and manage bandwidth.\nThis 5‑day intensive features real-world tools and top brands like 𝗛𝗶𝗸𝘃𝗶𝘀𝗶𝗼𝗻, 𝗗𝗮𝗵𝘂𝗮, 𝗔𝘃𝗶𝗴𝗶𝗹𝗼𝗻, 𝗟𝗲𝗴𝗲𝗻𝗱 𝗡𝗫, and more—preparing them with field‑ready skills.\n🚀 Want to become a 𝗡𝗲𝘁𝘄𝗼𝗿𝗸 𝗖𝗮𝗯𝗹𝗶𝗻𝗴 𝗮𝗻𝗱 𝗘𝗹𝗲𝗰𝘁𝗿𝗼𝗻𝗶𝗰 𝗦𝗲𝗰𝘂𝗿𝗶𝘁𝘆 𝗧𝗲𝗰𝗵𝗻𝗶𝗰𝗶𝗮𝗻 in Canada? 🇨🇦\n👉 𝗘𝗻𝗿𝗼𝗹𝗹 𝘁𝗼𝗱𝗮𝘆 at www.delmitraining.com"

3. Challenge/Competition Style:
"𝗖𝗮𝘁𝟲 𝗰𝗮𝗯𝗹𝗲 𝘁𝗲𝗿𝗺𝗶𝗻𝗮𝘁𝗶𝗼𝗻 𝘀𝗽𝗲𝗲𝗱 𝗰𝗵𝗮𝗹𝗹𝗲𝗻𝗴𝗲—using 𝗻𝗼𝗻-𝗽𝗮𝘀𝘀 𝘁𝗵𝗿𝗼𝘂𝗴𝗵 𝗥𝗝𝟰𝟱 𝗰𝗼𝗻𝗻𝗲𝗰𝘁𝗼𝗿𝘀! 💪 ⏱️ #Part1\nIt's all about speed and precision—who will finish the 𝗳𝗮𝘀𝘁𝗲𝘀𝘁?\n𝙒𝙖𝙩𝙘𝙝 𝙋𝙖𝙧𝙩 𝟮 𝙩𝙤 𝙨𝙚𝙚 𝙬𝙝𝙤 𝙬𝙞𝙣𝙨 𝙩𝙝𝙚 𝙩𝙞𝙢𝙞𝙣𝙜 𝙗𝙖𝙩𝙩𝙡𝙚!"

KEY STYLE ELEMENTS TO FOLLOW:
- Use bold Unicode text for emphasis (𝗯𝗼𝗹𝗱 𝘁𝗲𝘅𝘁)
- Include relevant emojis strategically
- Use specific course names and technical terms
- Always include call-to-action with website
- Mention Delmi Training Institute name prominently
- Use line breaks for readability
- Include relevant hashtags
- Keep professional yet engaging tone
- Focus on hands-on learning and field-ready skills
`;

      const response = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a social media caption specialist for Delmi Training Institute. Create engaging captions based on the provided context and style guidelines.

${context.instituteInfo}

STYLE: ${selectedStyle} - ${context.styleGuidelines}

${context.courseContext ? `COURSE CONTEXT: ${context.courseContext}` : ''}

${context.platformGuidelines ? `PLATFORM GUIDELINES: ${context.platformGuidelines}` : ''}

HASHTAGS TO USE: ${context.hashtags.join(' ')}

${captionStyleExamples}

${modernAnalysisPrompt}

Generate 3 different caption variations that:
1. Match the selected tone (${selectedStyle})
2. Follow the EXACT style format from the examples above
3. Use bold Unicode text for emphasis (𝗯𝗼𝗹𝗱 𝘁𝗲𝘅𝘁)
4. Include strategic emoji placement
5. Use proper line breaks and formatting
6. Include call-to-action with www.delmitraining.com
7. Mention Delmi Training Institute prominently
8. Include relevant course names and technical terms
9. Use appropriate hashtags from the provided list
10. Keep length similar to examples (typically 3-5 lines plus CTA)

IMPORTANT: Return ONLY a valid JSON array in this exact format:
[{"caption": "your first caption here"}, {"caption": "your second caption here"}, {"caption": "your third caption here"}]

FORMATTING REQUIREMENTS:
- Use actual line breaks (\n) in the JSON strings for proper formatting
- Each caption should be 3-5 lines with proper line breaks
- Include emojis and bold Unicode text as shown in examples
- CRITICAL: Keep ALL letters in bold Unicode text CONSISTENT - no mixing of regular and bold characters
- Use bold Unicode for: course names, company name, technical terms, key phrases
- End with call-to-action and hashtags on separate lines
- Ensure proper spacing and readability

EXAMPLE CORRECT BOLD TEXT:
✅ 𝗻𝗲𝘁𝘄𝗼𝗿𝗸 𝗰𝗮𝗯𝗹𝗶𝗻𝗴 (all letters consistent)
✅ 𝗮𝗰𝗰𝗲𝘀𝘀 𝗰𝗼𝗻𝘁𝗿𝗼𝗹 (all letters consistent)
❌ 𝗮𝗰𝗰𝗲𝘀𝘀 𝗰𝗼𝗻𝘁𝗿𝗼L (mixing regular L with bold text)

Do not include any other text, formatting, numbering, or explanations. Just the clean JSON array with properly formatted captions that match the style examples exactly.`
          },
          {
            role: 'user',
            content: `Create captions for: ${captionPrompt}${imageAnalysis ? `\n\nImage context: ${imageAnalysis}` : ''}${transcriptContent ? `\n\nVideo/Audio Transcript: ${transcriptContent.substring(0, 2000)}` : ''}\n\nEnsure the captions follow the exact formatting style from the examples, including bold Unicode text, proper emoji placement, line breaks, and call-to-action with www.delmitraining.com`
          }
        ],
        model: 'deepseek-r1-distill-llama-70b',
        max_tokens: 1500,
        temperature: 0.8
      });

      const content = response.choices[0]?.message?.content || '';
      
      // Clean the response to remove any thinking blocks and extra formatting
      let cleanedContent = content.replace(/<think>[\s\S]*?<\/think>/gi, '')
                                  .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
                                  .replace(/thinking:\s*[\s\S]*?(?=\n\n|\n[A-Z]|$)/gi, '')
                                  .replace(/Here are.*?captions.*?:/gi, '')
                                  .replace(/\*\*Caption \d+:\*\*/gi, '')
                                  .replace(/\d+\. \*\*Caption \d+:\*\*/gi, '')
                                  .replace(/\n\s*\n/g, '\n')
                                  .trim();
      
      try {
        // Try to find JSON array in the response
        const jsonMatch = cleanedContent.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const captionsData = JSON.parse(jsonMatch[0]);
          const newCaptions: GeneratedCaption[] = captionsData.map((item: any, index: number) => ({
            id: `${Date.now()}-${index}`,
            text: fixUnicodeBoldText(item.caption.replace(/\\n/g, '\n')), // Convert escaped \n and fix Unicode
            style: selectedStyle,
            isFavorite: false,
            imageAnalysis: imageAnalysis || undefined
          }));
          setGeneratedCaptions(newCaptions);
        } else {
          // If no JSON found, try to parse the content as separate captions
          const captionLines = cleanedContent.split('\n').filter(line => line.trim().length > 20);
          if (captionLines.length > 0) {
            const newCaptions: GeneratedCaption[] = captionLines.slice(0, 3).map((caption, index) => ({
              id: `${Date.now()}-${index}`,
              text: fixUnicodeBoldText(caption.replace(/^\d+\./g, '').replace(/^\*/g, '').replace(/\\n/g, '\n').trim()),
              style: selectedStyle,
              isFavorite: false,
              imageAnalysis: imageAnalysis || undefined
            }));
            setGeneratedCaptions(newCaptions);
          } else {
            throw new Error('No valid captions found');
          }
        }
      } catch (parseError) {
        console.error('Parse error:', parseError);
        const fallbackCaption: GeneratedCaption = {
          id: `${Date.now()}`,
          text: fixUnicodeBoldText((cleanedContent || 'Unable to generate captions. Please try again.').replace(/\\n/g, '\n')),
          style: selectedStyle,
          isFavorite: false,
          imageAnalysis: imageAnalysis || undefined
        };
        setGeneratedCaptions([fallbackCaption]);
      }
    } catch (error) {
      console.error('Error generating captions:', error);
      alert('Error generating captions. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (caption: GeneratedCaption) => {
    try {
      await navigator.clipboard.writeText(caption.text);
      setCopiedId(caption.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const toggleFavorite = (id: string) => {
    setGeneratedCaptions(prev =>
      prev.map(caption =>
        caption.id === id
          ? { ...caption, isFavorite: !caption.isFavorite }
          : caption
      )
    );
  };

  const quickStartOptions = [
    { icon: BookOpen, title: "Course Info", query: "What are the courses you offer?" },
    { icon: Users, title: "Enrollment", query: "How do I enroll?" },
    { icon: Zap, title: "Course Details", query: "Tell me about the course details" },
    { icon: CreditCard, title: "Payment Plans", query: "What are the payment options?" }
  ];

  return (
    <div className="app-container">
      {/* Compact Header */}
      <div className="compact-header">
        <Container fluid>
          <Row className="align-items-center">
            <Col xs="auto">
              <div className="d-flex align-items-center">
                <div className="brand-icon">
                  <Brain size={24} />
                </div>
                                  <div className="ms-2 d-none d-sm-block">
                    <h5 className="mb-0 fw-bold">Delmi AI</h5>
                    <small className="text-muted">Ask anything about Delmi Training Institute</small>
                  </div>
                  <div className="ms-2 d-block d-sm-none">
                    <h6 className="mb-0 fw-bold">Delmi AI</h6>
                  </div>
              </div>
            </Col>
            <Col>
              <Nav variant="pills" className="justify-content-center compact-nav">
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'chat'} 
                    onClick={() => setActiveTab('chat')}
                    className="px-3 py-2"
                  >
                    <MessageSquare size={16} className="me-1" />
                    Chat
                    {messages.length > 0 && <span className="badge bg-primary ms-1">{messages.length}</span>}
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeTab === 'captions'} 
                    onClick={() => setActiveTab('captions')}
                    className="px-3 py-2"
                  >
                    <Wand2 size={16} className="me-1" />
                    Captions
                    <span className="badge bg-success ms-1">AI</span>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col xs="auto">
              <Button variant="outline-secondary" size="sm" onClick={clearMessages}>
                Clear
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Content - Tab-Based Layout */}
      <Container fluid className="main-content">
        {activeTab === 'chat' && (
          <div className="chat-layout d-flex flex-column h-100">
            {/* Chat Header */}
            <div className="chat-header p-3 border-bottom">
              <Container>
                <Row className="justify-content-center">
                  <Col lg={10} xl={9}>
                    <div className="d-flex align-items-center">
                      <MessageSquare size={18} className="me-2 text-primary" />
                                             <span className="fw-semibold">Delmi AI Chat</span>
                      <span className="badge bg-primary ms-auto">AI</span>
                      {isTyping && <span className="badge bg-warning ms-2">Typing...</span>}
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-auto">
              <Container className="py-4">
                <Row className="justify-content-center">
                  <Col lg={10} xl={9}>
                    {messages.length === 0 ? (
                      <div className="text-center py-5">
                        <MessageSquare size={64} className="text-muted mb-4" />
                                                 <h4 className="fw-bold text-muted mb-3">Welcome to Delmi AI</h4>
                         <p className="text-muted mb-4">Ask me anything about our courses, enrollment, or technical training programs.</p>
                        
                        {/* Quick Start Options */}
                        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                          {quickStartOptions.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline-primary"
                              size="sm"
                              onClick={() => sendMessage(option.query)}
                              disabled={isLoading}
                              className="d-flex align-items-center"
                            >
                              <option.icon size={14} className="me-2" />
                              {option.title}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="messages-container">
                        {messages.map((message) => (
                          <div key={message.id} className="mb-4">
                            <MessageBubble message={message} />
                          </div>
                        ))}
                        {isTyping && (
                          <div className="typing-indicator d-flex align-items-center p-3 bg-light rounded mb-4">
                            <div className="typing-dots me-2">
                              <span></span><span></span><span></span>
                            </div>
                            <small className="text-muted">AI is thinking...</small>
                          </div>
                        )}
                      </div>
                    )}
                  </Col>
                </Row>
              </Container>
            </div>

            {/* Bottom Input Area - ChatGPT Style */}
            <div className="chat-input-area border-top bg-white">
              <Container className="py-3">
                <Row className="justify-content-center">
                  <Col lg={10} xl={9}>
                    <div className="position-relative">
                      <Form.Control
                        as="textarea"
                        rows={1}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask anything about Delmi Training Institute..."
                        disabled={isLoading}
                        className="resize-none pe-5"
                        style={{ 
                          minHeight: '56px',
                          maxHeight: '200px',
                          paddingRight: '60px',
                          border: '1px solid #e9ecef',
                          borderRadius: '28px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          fontSize: '18px',
                          padding: '16px 20px'
                        }}
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isLoading}
                        className="position-absolute end-0 top-50 translate-middle-y me-3 rounded-circle"
                        style={{ width: '42px', height: '42px', padding: '0' }}
                      >
                        {isLoading ? (
                          <Spinner size="sm" />
                        ) : (
                          <Send size={16} />
                        )}
                      </Button>
                    </div>
                    <div className="text-center mt-2">
                      <small className="text-muted">
                        Press Enter to send • Shift+Enter for new line
                      </small>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        )}

        {activeTab === 'captions' && (
          <div className="caption-layout">
            {/* Scrollable Content Area */}
            <div className="content-area">
              <Row className="justify-content-center">
                <Col lg={11} xl={10}>
                  <Card className="content-card">
                    <Card.Header className="py-3">
                      <div className="d-flex align-items-center">
                        <Wand2 size={18} className="me-2 text-success" />
                                                 <span className="fw-semibold">Delmi AI Captions</span>
                        <span className="badge bg-success ms-auto">AI</span>
                      </div>
                    </Card.Header>
                    
                    <Card.Body className="p-4">
                      <Row>
                        {/* Left Column - Input Controls */}
                        <Col md={3}>
                          {/* Media Upload */}
                          <div className="mb-3">
                            <MediaUpload
                              onFilesSelect={handleMediaFilesSelect}
                              maxFiles={5}
                              maxSize={20}
                              disabled={isGenerating}
                            />
                          </div>

                          {/* Transcript Indicator */}
                          {transcriptContent && (
                            <div className="mb-2">
                              <Badge bg="info" className="d-flex align-items-center w-100 p-2">
                                <FileText size={14} className="me-2" />
                                <span className="small">Transcript detected - AI will use this content for captions</span>
                              </Badge>
                            </div>
                          )}

                          {/* Description/Prompt Input */}
                          <div className="mb-3">
                            <Form.Label className="fw-medium mb-2">What's your post about?</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              value={captionPrompt}
                              onChange={(e) => setCaptionPrompt(e.target.value)}
                              placeholder={transcriptContent ? "Add additional context (optional)..." : "Describe your content..."}
                              className="resize-none"
                              disabled={isGenerating}
                            />
                          </div>

                          {/* Caption Style Selection */}
                          <div className="mb-3">
                            <CaptionStyleSelector
                              selectedStyle={selectedStyle}
                              onStyleChange={setSelectedStyle}
                              disabled={isGenerating}
                            />
                          </div>

                          {/* Modern Analysis Toggle */}
                          <div className="mb-3">
                            <Form.Check
                              type="switch"
                              id="modern-analysis"
                              label="Enhanced AI analysis"
                              checked={useModernAnalysis}
                              onChange={(e) => setUseModernAnalysis(e.target.checked)}
                              disabled={isGenerating}
                              className="fw-medium"
                            />
                          </div>

                          {/* Generate Button */}
                          <div className="d-grid">
                            <Button 
                              variant="primary" 
                              size="lg"
                              onClick={generateCaptions}
                              disabled={isGenerating || (!captionPrompt.trim() && !imageAnalysis && !transcriptContent)}
                              className="fw-semibold"
                            >
                              {isGenerating ? (
                                <>
                                  <Spinner size="sm" className="me-2" />
                                  Generating Amazing Captions...
                                </>
                              ) : (
                                <>
                                  <Sparkles size={18} className="me-2" />
                                  Generate AI Captions
                                </>
                              )}
                            </Button>
                          </div>
                        </Col>

                        {/* Right Column - Results */}
                        <Col md={9}>
                          <div className="results-section h-100">
                            <CaptionResults
                              captions={generatedCaptions}
                              onToggleFavorite={toggleFavorite}
                              onCopyCaption={copyToClipboard}
                            />
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>

            {/* No bottom input area needed anymore */}
          </div>
        )}
      </Container>
    </div>
  );
}

export default App;