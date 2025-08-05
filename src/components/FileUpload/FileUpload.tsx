import React, { useRef, useState } from 'react';
import { Card, Button, Badge, Alert } from 'react-bootstrap';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  acceptedTypes?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes = "*/*",
  multiple = false,
  maxSize = 10,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File "${file.name}" is too large. Maximum size is ${maxSize}MB.`;
    }
    return null;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    let hasError = false;

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        hasError = true;
        break;
      }
      validFiles.push(file);
    }

    if (!hasError) {
      setUploadError(null);
      setUploadedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
      onFileSelect(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      onFileSelect(newFiles);
      return newFiles;
    });
  };

  const clearError = () => {
    setUploadError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      {/* Upload Area */}
      <Card
        className={`file-upload-area ${isDragOver ? 'dragover' : ''} ${disabled ? 'opacity-50' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Card.Body className="text-center py-4">
          <Upload size={32} className="text-muted mb-3" />
          <div className="fw-medium mb-2">
            {isDragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
          </div>
          <div className="text-muted small">
            {acceptedTypes === "*/*" ? "Any file type" : acceptedTypes} • Max {maxSize}MB
            {multiple && " • Multiple files allowed"}
          </div>
        </Card.Body>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="file-input-hidden"
        disabled={disabled}
      />

      {/* Error Alert */}
      {uploadError && (
        <Alert variant="danger" className="mt-3 d-flex align-items-center" dismissible onClose={clearError}>
          <AlertCircle size={16} className="me-2" />
          {uploadError}
        </Alert>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-3">
          <div className="small fw-medium text-muted mb-2">Uploaded Files:</div>
          <div className="d-flex flex-column gap-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="d-flex align-items-center justify-content-between p-2 bg-light rounded">
                <div className="d-flex align-items-center">
                  <File size={16} className="text-muted me-2" />
                  <div>
                    <div className="small fw-medium">{file.name}</div>
                    <div className="text-muted text-xs">{formatFileSize(file.size)}</div>
                  </div>
                </div>
                
                <div className="d-flex align-items-center">
                  <Badge bg="success" className="me-2">
                    <Check size={12} />
                  </Badge>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;