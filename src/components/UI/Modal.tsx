import React from 'react';
import { Modal as BSModal, ModalProps as BSModalProps } from 'react-bootstrap';

interface ModalProps extends Omit<BSModalProps, 'show'> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'lg' | 'xl';
  centered?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen,
  onClose,
  title,
  children,
  size,
  centered = true,
  ...props 
}) => {
  return (
    <BSModal
      show={isOpen}
      onHide={onClose}
      size={size}
      centered={centered}
      {...props}
    >
      {title && (
        <BSModal.Header closeButton>
          <BSModal.Title className="h6 mb-0">{title}</BSModal.Title>
        </BSModal.Header>
      )}
      
      <BSModal.Body>
        {children}
      </BSModal.Body>
    </BSModal>
  );
};

export default Modal;