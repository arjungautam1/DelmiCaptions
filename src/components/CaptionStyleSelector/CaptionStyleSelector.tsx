import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { Briefcase, Coffee, Palette } from 'lucide-react';

export type CaptionStyle = 'professional' | 'casual' | 'creative';

interface StyleOption {
  value: CaptionStyle;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface CaptionStyleSelectorProps {
  selectedStyle: CaptionStyle;
  onStyleChange: (style: CaptionStyle) => void;
  disabled?: boolean;
  className?: string;
}

const styleOptions: StyleOption[] = [
  {
    value: 'professional',
    label: 'Professional',
    icon: Briefcase,
    color: 'primary'
  },
  {
    value: 'casual',
    label: 'Casual',
    icon: Coffee,
    color: 'info'
  },
  {
    value: 'creative',
    label: 'Creative',
    icon: Palette,
    color: 'warning'
  }
];

const CaptionStyleSelector: React.FC<CaptionStyleSelectorProps> = ({
  selectedStyle,
  onStyleChange,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`caption-style-selector ${className}`}>
      <Form.Label className="fw-medium mb-2">Caption Style</Form.Label>
      
      <div className="d-flex gap-2">
        {styleOptions.map((option) => {
          const IconComponent = option.icon;
          const isSelected = selectedStyle === option.value;
          
          return (
            <Button
              key={option.value}
              variant={isSelected ? option.color : `outline-${option.color}`}
              size="sm"
              onClick={() => !disabled && onStyleChange(option.value)}
              disabled={disabled}
              className="flex-fill text-center"
            >
              <div className="d-flex flex-column align-items-center">
                <IconComponent size={14} className="mb-1" />
                <span className="small">{option.label}</span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CaptionStyleSelector;