import React, { useRef, useState, useCallback } from 'react';
import { Card, Button, Badge, Alert, Row, Col } from 'react-bootstrap';
import { Upload, Plus, X, Image, Video, FileText, Trash2, Check } from 'lucide-react';

interface MediaFile {
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
  className?: string;
}

export type { MediaFile };

const MediaUpload: React.FC<MediaUploadProps> = ({
  onFilesSelect,
  maxFiles = 10,
  maxSize = 50,
  disabled = false,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const getFileType = (file: File): 'image' | 'video' | 'document' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const readTextFile = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsText(file);
      } else {
        resolve(null);
      }
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const createPreview = useCallback((file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  }, []);

  const processFiles = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    
    // Check file count limit
    if (mediaFiles.length + fileArray.length > maxFiles) {
      setUploadError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newMediaFiles: MediaFile[] = [];
    let hasError = false;

    for (const file of fileArray) {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setUploadError(`File "${file.name}" is too large. Maximum size is ${maxSize}MB.`);
        hasError = true;
        break;
      }

      // Create preview if it's an image
      const preview = await createPreview(file);
      
      // Read text content if it's a text file
      const textContent = await readTextFile(file);
      
      const mediaFile: MediaFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview,
        type: getFileType(file),
        size: formatFileSize(file.size),
        textContent: textContent || undefined
      };

      newMediaFiles.push(mediaFile);
    }

    if (!hasError) {
      setUploadError(null);
      const updatedFiles = [...mediaFiles, ...newMediaFiles];
      setMediaFiles(updatedFiles);
      onFilesSelect(updatedFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    processFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = mediaFiles.filter(f => f.id !== fileId);
    setMediaFiles(updatedFiles);
    onFilesSelect(updatedFiles);
  };

  const clearAllFiles = () => {
    setMediaFiles([]);
    onFilesSelect([]);
    setUploadError(null);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image size={16} />;
      case 'video': return <Video size={16} />;
      default: return <FileText size={16} />;
    }
  };

  return (
    <div className={`media-upload-container ${className}`}>
      {/* Main Upload Area */}
      <Card
        className={`upload-drop-zone ${isDragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Card.Body className="text-center py-4">
          {mediaFiles.length === 0 ? (
            <>
              <div className="upload-icon mb-3">
                <Upload size={48} className="text-muted" />
              </div>
              <h6 className="fw-bold mb-2">Upload Files</h6>
              <p className="text-muted mb-3">
                Drag and drop or click to browse
              </p>
              <Button
                variant="primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                <Plus size={16} className="me-2" />
                Choose Files
              </Button>
            </>
          ) : (
            <>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0">
                  {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''} selected
                </h6>
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || mediaFiles.length >= maxFiles}
                    className="me-2"
                  >
                    <Plus size={14} className="me-1" />
                    Add More
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={clearAllFiles}
                    disabled={disabled}
                  >
                    <Trash2 size={14} className="me-1" />
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Media Files Grid */}
              <Row className="g-2">
                {mediaFiles.map((mediaFile) => (
                  <Col key={mediaFile.id} xs={6} sm={4} md={3}>
                    <Card className="media-file-card position-relative">
                      <div className="media-preview">
                        {mediaFile.preview ? (
                          <img
                            src={mediaFile.preview}
                            alt={mediaFile.file.name}
                            className="img-fluid"
                            style={{ 
                              width: '100%', 
                              height: '120px', 
                              objectFit: 'cover',
                              borderRadius: '8px 8px 0 0'
                            }}
                          />
                        ) : mediaFile.textContent ? (
                          <div 
                            className="d-flex flex-column align-items-center justify-content-center bg-light p-2 text-center"
                            style={{ height: '120px', borderRadius: '8px 8px 0 0' }}
                          >
                            {getFileIcon(mediaFile.type)}
                            <div className="small text-muted mt-1 text-truncate" style={{ maxWidth: '100%' }}>
                              Transcript: {mediaFile.textContent.substring(0, 50)}...
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="d-flex align-items-center justify-content-center bg-light"
                            style={{ height: '120px', borderRadius: '8px 8px 0 0' }}
                          >
                            {getFileIcon(mediaFile.type)}
                          </div>
                        )}
                      </div>
                      
                      <Card.Body className="p-2">
                        <div className="small fw-medium text-truncate" title={mediaFile.file.name}>
                          {mediaFile.file.name}
                        </div>
                        <div className="d-flex align-items-center justify-content-between mt-1">
                          <Badge 
                            bg={mediaFile.textContent ? "info" : "light"} 
                            text={mediaFile.textContent ? "white" : "dark"} 
                            className="text-capitalize"
                          >
                            {mediaFile.textContent ? "transcript" : mediaFile.type}
                          </Badge>
                          <span className="text-muted small">{mediaFile.size}</span>
                        </div>
                      </Card.Body>
                      
                      {/* Remove button */}
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 m-1 rounded-circle p-1"
                        onClick={() => removeFile(mediaFile.id)}
                        style={{ width: '24px', height: '24px' }}
                      >
                        <X size={12} />
                      </Button>
                      
                      {/* Success indicator */}
                      <Badge
                        bg="success"
                        className="position-absolute bottom-0 start-0 m-1"
                      >
                        <Check size={10} />
                      </Badge>
                    </Card>
                  </Col>
                ))}
                
                {/* Add more placeholder */}
                {mediaFiles.length < maxFiles && (
                  <Col xs={6} sm={4} md={3}>
                    <Card 
                      className="add-more-card h-100 d-flex align-items-center justify-content-center cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ minHeight: '180px' }}
                    >
                      <div className="text-center">
                        <Plus size={24} className="text-muted mb-2" />
                        <div className="small text-muted">Add More</div>
                      </div>
                    </Card>
                  </Col>
                )}
              </Row>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,.pdf,.doc,.docx,.txt,text/plain"
        multiple
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {/* Error Alert */}
      {uploadError && (
        <Alert variant="danger" className="mt-3" dismissible onClose={() => setUploadError(null)}>
          {uploadError}
        </Alert>
      )}
    </div>
  );
};

export default MediaUpload;