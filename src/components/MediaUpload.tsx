import React, { useRef, useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { Upload, X, FileText, Image, Video, File } from 'lucide-react';

export interface MediaFile {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'video' | 'document';
  size: string;
  textContent?: string;
}

interface MediaUploadProps {
  onFilesSelect: (files: MediaFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  disabled?: boolean;
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  onFilesSelect,
  maxFiles = 5,
  maxSize = 20,
  disabled = false
}) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (file: File): 'image' | 'video' | 'document' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const getFileIcon = (type: 'image' | 'video' | 'document') => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      default: return FileText;
    }
  };

  const readTextFile = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!file.type.includes('text') && !file.name.endsWith('.txt') && !file.name.endsWith('.srt')) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string || null);
      };
      reader.onerror = () => resolve(null);
      reader.readAsText(file);
    });
  };

  const createImagePreview = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string || null);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    setError(null);
    const fileArray = Array.from(selectedFiles);

    // Validate file count
    if (files.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate file sizes
    const oversizedFiles = fileArray.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    const newMediaFiles: MediaFile[] = [];

    for (const file of fileArray) {
      const type = getFileType(file);
      const preview = await createImagePreview(file);
      const textContent = await readTextFile(file);

      const mediaFile: MediaFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: preview || undefined,
        type,
        size: formatFileSize(file.size),
        textContent: textContent || undefined
      };

      newMediaFiles.push(mediaFile);
    }

    const updatedFiles = [...files, ...newMediaFiles];
    setFiles(updatedFiles);
    onFilesSelect(updatedFiles);
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesSelect(updatedFiles);
  };

  return (
    <div className="media-upload">
      <Card className="upload-card mb-3">
        <Card.Body 
          className="upload-area text-center p-3"
          onClick={() => !disabled && fileInputRef.current?.click()}
          style={{ 
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1
          }}
        >
          <Upload size={24} className="text-primary mb-2" />
          <div className="small fw-medium">Upload Media</div>
          <div className="text-muted" style={{ fontSize: '11px' }}>
            Images, videos, or text files
          </div>
        </Card.Body>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.txt,.srt,.vtt,.doc,.docx,.pdf"
        onChange={(e) => handleFileSelect(e.target.files)}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {error && (
        <Alert variant="danger" className="py-2 small mb-2">
          {error}
        </Alert>
      )}

      {files.length > 0 && (
        <div className="uploaded-files">
          {files.map((mediaFile) => {
            const IconComponent = getFileIcon(mediaFile.type);
            return (
              <Card key={mediaFile.id} className="mb-2 border">
                <Card.Body className="p-2">
                  <div className="d-flex align-items-start">
                    {mediaFile.preview ? (
                      <img 
                        src={mediaFile.preview} 
                        alt="Preview" 
                        className="me-2 rounded"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                    ) : (
                      <IconComponent size={20} className="me-2 text-muted mt-1" />
                    )}
                    
                    <div className="flex-fill">
                      <div className="small fw-medium">{mediaFile.file.name}</div>
                      <div className="text-muted" style={{ fontSize: '10px' }}>
                        {mediaFile.size} • {mediaFile.type}
                        {mediaFile.textContent && ' • Text content detected'}
                      </div>
                    </div>
                    
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-danger"
                      onClick={() => removeFile(mediaFile.id)}
                      disabled={disabled}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MediaUpload;