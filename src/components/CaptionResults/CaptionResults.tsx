import React, { useState } from 'react';
import { Card, Button, Badge, Alert } from 'react-bootstrap';
import { Copy, Heart, Check, Share2, Download, Sparkles } from 'lucide-react';

interface GeneratedCaption {
  id: string;
  text: string;
  style: 'professional' | 'casual' | 'creative';
  isFavorite: boolean;
  imageAnalysis?: string;
}

interface CaptionResultsProps {
  captions: GeneratedCaption[];
  onToggleFavorite: (id: string) => void;
  onCopyCaption: (caption: GeneratedCaption) => void;
  className?: string;
}

const CaptionResults: React.FC<CaptionResultsProps> = ({
  captions,
  onToggleFavorite,
  onCopyCaption,
  className = ''
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (caption: GeneratedCaption) => {
    try {
      await navigator.clipboard.writeText(caption.text);
      setCopiedId(caption.id);
      onCopyCaption(caption);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy caption:', error);
    }
  };

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'professional': return 'primary';
      case 'casual': return 'info';
      case 'creative': return 'warning';
      default: return 'secondary';
    }
  };

  const shareCaption = async (caption: GeneratedCaption) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Generated Caption',
          text: caption.text
        });
      } catch (error) {
        console.log('Share was cancelled or failed');
      }
    } else {
      // Fallback to copying to clipboard
      handleCopy(caption);
    }
  };

  if (captions.length === 0) {
    return (
      <div className={`caption-results-empty text-center py-5 ${className}`}>
        <Sparkles size={48} className="text-muted mb-3" />
        <h6 className="fw-bold text-muted mb-2">Your generated captions will appear here</h6>
        <p className="text-muted small mb-0">
          Add a prompt and click generate to start creating amazing captions
        </p>
      </div>
    );
  }

  return (
    <div className={`caption-results ${className}`}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="fw-bold mb-0">
          Generated Captions ({captions.length})
        </h6>
        <Badge bg="success" className="d-flex align-items-center">
          <Sparkles size={12} className="me-1" />
          AI Generated
        </Badge>
      </div>

      <div className="d-flex flex-column gap-3">
        {captions.map((caption, index) => (
          <Card key={caption.id} className="caption-card border">
            <Card.Body className="p-3">
              {/* Caption Text */}
              <div className="caption-text mb-3" style={{ 
                fontSize: '0.95rem', 
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
              }}>
                {caption.text}
              </div>
              
              {/* Caption Footer */}
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <Badge 
                    bg={getStyleColor(caption.style)}
                    className="text-capitalize"
                  >
                    {caption.style}
                  </Badge>
                  
                  {caption.imageAnalysis && (
                    <Badge bg="light" text="dark" className="small">
                      With Image Analysis
                    </Badge>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="d-flex align-items-center gap-1">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => onToggleFavorite(caption.id)}
                    className="p-2"
                    title={caption.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart 
                      size={14} 
                      className={caption.isFavorite ? 'text-danger' : ''} 
                      fill={caption.isFavorite ? 'currentColor' : 'none'}
                    />
                  </Button>
                  
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => shareCaption(caption)}
                    className="p-2"
                    title="Share caption"
                  >
                    <Share2 size={14} />
                  </Button>
                  
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleCopy(caption)}
                    className="p-2"
                    title="Copy to clipboard"
                  >
                    {copiedId === caption.id ? (
                      <Check size={14} className="text-success" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Success message for copy */}
      {copiedId && (
        <Alert 
          variant="success" 
          className="mt-3 d-flex align-items-center"
          style={{ 
            position: 'fixed', 
            bottom: '20px', 
            right: '20px', 
            zIndex: 1050,
            maxWidth: '300px'
          }}
        >
          <Check size={16} className="me-2" />
          Caption copied to clipboard!
        </Alert>
      )}
    </div>
  );
};

export default CaptionResults;