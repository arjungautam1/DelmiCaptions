import React, { useState } from 'react';
import { Card, Button, Badge, Alert } from 'react-bootstrap';
import { Copy, Heart, Check, Sparkles } from 'lucide-react';

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
  onCopyCaption: (caption: GeneratedCaption) => Promise<void>;
  isGenerating?: boolean;
  error?: string | null;
}

const CaptionResults: React.FC<CaptionResultsProps> = ({
  captions,
  onToggleFavorite,
  onCopyCaption,
  isGenerating = false,
  error = null
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (caption: GeneratedCaption) => {
    await onCopyCaption(caption);
    setCopiedId(caption.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isGenerating) {
    return (
      <div className="caption-results-empty text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h6 className="text-muted mb-2">Generating amazing captions...</h6>
        <p className="text-muted small mb-0">
          Please wait while Delmi AI creates your captions
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="caption-results-empty text-center py-5">
        <div className="text-danger mb-3">
          <Sparkles size={48} className="opacity-25" />
        </div>
        <h6 className="text-danger mb-2">Generation failed</h6>
        <p className="text-muted small mb-0">
          {error}
        </p>
      </div>
    );
  }

  if (captions.length === 0) {
    return (
      <div className="caption-results-empty text-center py-5">
        <Sparkles size={48} className="text-muted opacity-25 mb-3" />
        <h6 className="text-muted mb-2">Ready to create amazing captions?</h6>
        <p className="text-muted small mb-0">
          Upload your media, describe your content, and let Delmi AI generate engaging captions 
          that match our training institute's style.
        </p>
      </div>
    );
  }

  return (
    <div className="caption-results">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="fw-bold mb-0">Generated Captions</h6>
        <Badge bg="success" className="px-2 py-1">
          {captions.length} caption{captions.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="results-grid">
        {captions.map((caption, index) => (
          <Card key={caption.id} className="result-card mb-3 border">
            <Card.Body className="p-3">
              {/* Caption Number */}
              <div className="d-flex align-items-center justify-content-between mb-2">
                <Badge bg="light" text="dark" className="small">
                  Caption #{index + 1}
                </Badge>
                <Badge 
                  bg="light" 
                  text="dark" 
                  className="text-capitalize small"
                >
                  {caption.style}
                </Badge>
              </div>

              {/* Caption Text */}
              <div 
                className="caption-text mb-3" 
                style={{ 
                  fontSize: '0.9rem', 
                  lineHeight: '1.5',
                  whiteSpace: 'pre-line',
                  wordWrap: 'break-word'
                }}
              >
                {caption.text}
              </div>

              {/* Action Buttons */}
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => onToggleFavorite(caption.id)}
                    className="d-flex align-items-center"
                  >
                    <Heart 
                      size={14} 
                      className={caption.isFavorite ? 'text-danger' : ''} 
                      fill={caption.isFavorite ? 'currentColor' : 'none'}
                    />
                    <span className="ms-1 small">
                      {caption.isFavorite ? 'Favorited' : 'Favorite'}
                    </span>
                  </Button>
                  
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleCopy(caption)}
                    className="d-flex align-items-center"
                  >
                    {copiedId === caption.id ? (
                      <>
                        <Check size={14} className="text-success" />
                        <span className="ms-1 small text-success">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span className="ms-1 small">Copy</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Character Count */}
                <small className="text-muted">
                  {caption.text.length} characters
                </small>
              </div>

              {/* Image Analysis Info */}
              {caption.imageAnalysis && (
                <Alert variant="info" className="mt-2 py-2 small mb-0">
                  <strong>AI Analysis:</strong> This caption was enhanced using image analysis.
                </Alert>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Tips */}
      <Alert variant="light" className="mt-3 py-2 small border">
        <strong>💡 Pro tip:</strong> Copy your favorite captions and paste them directly into your social media posts. 
        The formatting and emojis are ready to go!
      </Alert>
    </div>
  );
};

export default CaptionResults;