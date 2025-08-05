import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Briefcase, Coffee, Palette } from 'lucide-react';

export type CaptionStyle = 'professional' | 'casual' | 'creative';

interface CaptionStyleSelectorProps {
  selectedStyle: CaptionStyle;
  onStyleChange: (style: CaptionStyle) => void;
  disabled?: boolean;
}

const CaptionStyleSelector: React.FC<CaptionStyleSelectorProps> = ({
  selectedStyle,
  onStyleChange,
  disabled = false
}) => {
  const styles = [
    {
      value: 'professional' as CaptionStyle,
      label: 'Professional',
      description: 'Business-focused, formal tone',
      icon: Briefcase,
      color: 'primary'
    },
    {
      value: 'casual' as CaptionStyle,
      label: 'Casual',
      description: 'Friendly and approachable',
      icon: Coffee,
      color: 'success'
    },
    {
      value: 'creative' as CaptionStyle,
      label: 'Creative',
      description: 'Fun and engaging',
      icon: Palette,
      color: 'warning'
    }
  ];

  return (
    <div className="caption-style-selector">
      <Form.Label className="fw-medium mb-2">Caption Style</Form.Label>
      <div className="d-grid gap-2">
        {styles.map((style) => {
          const IconComponent = style.icon;
          const isSelected = selectedStyle === style.value;
          
          return (
            <Button
              key={style.value}
              variant={isSelected ? style.color : `outline-${style.color}`}
              size="sm"
              onClick={() => onStyleChange(style.value)}
              disabled={disabled}
              className="text-start d-flex align-items-center p-2"
            >
              <IconComponent size={16} className="me-2" />
              <div className="flex-fill">
                <div className="fw-medium">{style.label}</div>
                <div className="small opacity-75">{style.description}</div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CaptionStyleSelector;