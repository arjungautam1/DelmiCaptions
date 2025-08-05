import React, { useState } from 'react';
import { 
  Row, Col, Card, Form, Button, Badge, Alert, 
  ButtonGroup, Collapse, Spinner 
} from 'react-bootstrap';
import { 
  Wand2, Copy, Heart, Upload, Sparkles, 
  Eye, EyeOff, Check, ChevronDown, ChevronUp 
} from 'lucide-react';
import { Groq } from 'groq-sdk';
import { KnowledgeBaseContextGenerator } from '../../knowledge-base';

interface GeneratedCaption {
  id: string;
  text: string;
  style: 'professional' | 'casual' | 'creative';
  isFavorite: boolean;
  imageAnalysis?: string;
}

const CaptionGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<'professional' | 'casual' | 'creative'>('professional');
  const [generatedCaptions, setGeneratedCaptions] = useState<GeneratedCaption[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [useModernAnalysis, setUseModernAnalysis] = useState<boolean>(true);
  const [showImageAnalysis, setShowImageAnalysis] = useState<boolean>(false);

  // Initialize Groq SDK
  const groq = new Groq({
    apiKey: process.env.REACT_APP_GROQ_API_KEY || '',
    dangerouslyAllowBrowser: true
  });

  // Initialize Knowledge Base Context Generator
  const contextGenerator = new KnowledgeBaseContextGenerator();

  const styleDescriptions = {
    professional: 'Business-focused, formal tone suitable for corporate social media',
    casual: 'Friendly and approachable, perfect for everyday posts',
    creative: 'Fun and engaging, designed to capture attention and spark interest'
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        
        // Analyze image with Groq Vision
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
                      url: result
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
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCaptions = async () => {
    if (!prompt.trim() && !imageAnalysis) return;

    setIsGenerating(true);
    try {
      const context = contextGenerator.generateContext(
        selectedStyle,
        prompt,
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

${modernAnalysisPrompt}

Generate 3 different caption variations that:
1. Match the selected tone (${selectedStyle})
2. Include relevant course information when applicable
3. Use appropriate hashtags from the provided list
4. Are optimized for engagement
5. Maintain Delmi Training Institute's brand voice
6. Are appropriate length for social media (under 2200 characters)

Format as JSON array: [{"caption": "caption text here"}, {"caption": "caption text here"}, {"caption": "caption text here"}]`
          },
          {
            role: 'user',
            content: `Create captions for: ${prompt}${imageAnalysis ? `\n\nImage context: ${imageAnalysis}` : ''}`
          }
        ],
        model: 'deepseek-r1-distill-llama-70b',
        max_tokens: 1500,
        temperature: 0.8
      });

      const content = response.choices[0]?.message?.content || '';
      
      try {
        const jsonMatch = content.match(/\[.*\]/s);
        if (jsonMatch) {
          const captionsData = JSON.parse(jsonMatch[0]);
          const newCaptions: GeneratedCaption[] = captionsData.map((item: any, index: number) => ({
            id: `${Date.now()}-${index}`,
            text: item.caption,
            style: selectedStyle,
            isFavorite: false,
            imageAnalysis: imageAnalysis || undefined
          }));
          setGeneratedCaptions(newCaptions);
        } else {
          throw new Error('No valid JSON found');
        }
      } catch (parseError) {
        const fallbackCaption: GeneratedCaption = {
          id: `${Date.now()}`,
          text: content,
          style: selectedStyle,
          isFavorite: false,
          imageAnalysis: imageAnalysis || undefined
        };
        setGeneratedCaptions([fallbackCaption]);
      }
    } catch (error) {
      console.error('Error generating captions:', error);
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

  return (
    <div className="h-100 d-flex flex-column">
      <Row className="g-4 flex-grow-1">
        {/* Left Panel - Input */}
        <Col lg={6} className="d-flex flex-column">
          <Card className="card-modern h-100 glass-effect">
            <Card.Header style={{ 
              background: 'var(--gradient-primary)', 
              border: 'none',
              borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
              color: 'white',
              padding: 'var(--space-lg)'
            }}>
              <div className="d-flex align-items-center">
                <Wand2 size={20} className="me-2" />
                <span className="fw-bold">AI Caption Studio</span>
                <span className="badge-modern badge-success ms-auto">Pro</span>
              </div>
            </Card.Header>
            
            <Card.Body className="d-flex flex-column">
              {/* 🖼️ Modern Image Upload */}
              <div className="mb-4">
                <Form.Label className="form-label">
                  <Upload size={16} className="me-2" />
                  Image Upload (Optional)
                </Form.Label>
                <div className="file-upload-area p-4 text-center animate-float">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input-hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                    {imagePreview ? (
                      <div className="w-100">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          style={{ 
                            width: '100%', 
                            maxHeight: '200px', 
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-modern)'
                          }}
                        />
                        <div className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                          ✨ Click to change image
                        </div>
                      </div>
                    ) : (
                      <div className="py-4">
                        <div style={{ 
                          width: '80px', 
                          height: '80px', 
                          background: 'var(--gradient-accent)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto var(--space-md)',
                          boxShadow: 'var(--shadow-modern)'
                        }}>
                          <Upload size={32} className="text-white" />
                        </div>
                        <div className="fw-medium" style={{ color: 'var(--text-primary)' }}>
                          Drop your image here
                        </div>
                        <div className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                          Or click to browse • AI will analyze it for better captions
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                
                {/* Image Analysis Toggle */}
                {imageAnalysis && (
                  <div className="mt-2">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setShowImageAnalysis(!showImageAnalysis)}
                      className="p-0 text-decoration-none small"
                    >
                      {showImageAnalysis ? <EyeOff size={14} /> : <Eye size={14} />}
                      <span className="ms-1">
                        {showImageAnalysis ? 'Hide' : 'Show'} Image Analysis
                      </span>
                      {showImageAnalysis ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </Button>
                    
                    <Collapse in={showImageAnalysis}>
                      <Alert variant="light" className="mt-2 mb-0 text-sm">
                        {imageAnalysis}
                      </Alert>
                    </Collapse>
                  </div>
                )}
              </div>

              {/* 🎨 Modern Style Selection */}
              <div className="mb-4">
                <Form.Label className="form-label">
                  <Sparkles size={16} className="me-2" />
                  Caption Style
                </Form.Label>
                <div className="d-flex flex-column gap-3">
                  {Object.entries(styleDescriptions).map(([style, description]) => (
                    <div
                      key={style}
                      onClick={() => setSelectedStyle(style as any)}
                      className="cursor-pointer"
                      style={{
                        padding: 'var(--space-lg)',
                        borderRadius: 'var(--radius-md)',
                        border: selectedStyle === style 
                          ? '2px solid transparent' 
                          : '2px solid var(--glass-border)',
                        background: selectedStyle === style 
                          ? 'var(--gradient-primary)' 
                          : 'var(--bg-surface)',
                        color: selectedStyle === style ? 'white' : 'var(--text-primary)',
                        transition: 'var(--transition-smooth)',
                        boxShadow: selectedStyle === style 
                          ? 'var(--shadow-glow)' 
                          : 'var(--shadow-glass)',
                        transform: selectedStyle === style ? 'scale(1.02)' : 'scale(1)'
                      }}
                    >
                      <div className="fw-bold text-capitalize mb-1">{style}</div>
                      <div className="text-sm opacity-90">{description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modern Analysis Toggle */}
              <Form.Check
                type="switch"
                id="modern-analysis"
                label="Use modern social media analysis"
                checked={useModernAnalysis}
                onChange={(e) => setUseModernAnalysis(e.target.checked)}
                className="mb-3 small"
              />

              {/* Prompt Input */}
              <div className="flex-grow-1 d-flex flex-column">
                <Form.Label className="small fw-medium">Description/Prompt</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to post about... (e.g., 'Students practicing network cabling installation')"
                  className="flex-grow-1"
                />
              </div>

              {/* 🚀 Ultra-Modern Generate Button */}
              <button
                onClick={generateCaptions}
                disabled={isGenerating || (!prompt.trim() && !imageAnalysis)}
                className="btn-modern btn-primary-modern mt-4"
                style={{
                  padding: 'var(--space-lg) var(--space-xl)',
                  fontSize: '1rem',
                  fontWeight: '700',
                  background: isGenerating 
                    ? 'var(--gradient-secondary)' 
                    : 'var(--gradient-primary)',
                  boxShadow: 'var(--shadow-glow)',
                  transform: isGenerating ? 'scale(0.98)' : 'scale(1)',
                  opacity: (isGenerating || (!prompt.trim() && !imageAnalysis)) ? 0.7 : 1
                }}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-pulse me-2">⚡</div>
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <Wand2 size={20} className="me-2" />
                    Generate AI Captions
                  </>
                )}
              </button>
            </Card.Body>
          </Card>
        </Col>

        {/* 💎 Right Panel - AI Generated Results */}
        <Col lg={6} className="d-flex flex-column">
          <Card className="card-modern h-100 glass-effect">
            <Card.Header style={{ 
              background: 'var(--gradient-accent)', 
              border: 'none',
              borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
              color: 'white',
              padding: 'var(--space-lg)'
            }}>
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <Sparkles size={20} className="me-2" />
                  <span className="fw-bold">AI Generated Captions</span>
                </div>
                {generatedCaptions.length > 0 && (
                  <span className="badge-modern badge-primary">
                    {generatedCaptions.length} results
                  </span>
                )}
              </div>
            </Card.Header>
            
            <Card.Body className="overflow-auto" style={{ padding: 'var(--space-lg)' }}>
              {generatedCaptions.length === 0 ? (
                <div className="text-center py-5 animate-float">
                  <div style={{ 
                    width: '120px', 
                    height: '120px', 
                    background: 'var(--gradient-primary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto var(--space-xl)',
                    boxShadow: 'var(--shadow-glow)',
                    opacity: 0.8
                  }}>
                    <Sparkles size={48} className="text-white" />
                  </div>
                  <div className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    ✨ Ready to create magic
                  </div>
                  <div style={{ color: 'var(--text-muted)' }}>
                    Your AI-generated captions will appear here<br/>
                    Add a prompt and let the magic begin!
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-4">
                  {generatedCaptions.map((caption, index) => (
                    <div
                      key={caption.id}
                      className="caption-preview"
                      style={{
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-xl)',
                        border: '1px solid var(--glass-border)',
                        boxShadow: 'var(--shadow-modern)',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-intense)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-modern)';
                      }}
                    >
                      {/* Gradient accent line */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: index % 2 === 0 ? 'var(--gradient-primary)' : 'var(--gradient-secondary)'
                      }} />
                      
                      <div className="mb-3" style={{ 
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        color: 'var(--text-primary)'
                      }}>
                        {caption.text}
                      </div>
                      
                      <div className="d-flex align-items-center justify-content-between">
                        <span 
                          className="badge-modern text-capitalize"
                          style={{
                            background: index % 2 === 0 ? 'var(--gradient-primary)' : 'var(--gradient-secondary)',
                            color: 'white'
                          }}
                        >
                          {caption.style} style
                        </span>
                        
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => toggleFavorite(caption.id)}
                            className="btn-compact btn-ghost-modern"
                            style={{
                              background: caption.isFavorite ? 'var(--gradient-danger)' : 'transparent',
                              color: caption.isFavorite ? 'white' : 'var(--text-muted)'
                            }}
                          >
                            <Heart 
                              size={16} 
                              fill={caption.isFavorite ? 'currentColor' : 'none'}
                            />
                          </button>
                          
                          <button
                            onClick={() => copyToClipboard(caption)}
                            className="btn-compact btn-secondary-modern"
                            style={{
                              background: copiedId === caption.id ? 'var(--gradient-success)' : 'var(--glass-white)',
                              color: copiedId === caption.id ? 'white' : 'var(--text-primary)'
                            }}
                          >
                            {copiedId === caption.id ? (
                              <Check size={16} />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CaptionGenerator;