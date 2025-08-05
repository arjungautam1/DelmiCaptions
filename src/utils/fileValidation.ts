export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const MAX_FILE_SIZE = {
  image: 10 * 1024 * 1024, // 10MB
  pdf: 50 * 1024 * 1024,   // 50MB
  text: 5 * 1024 * 1024    // 5MB
};

export const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  pdf: ['application/pdf'],
  text: ['text/plain', 'text/markdown', 'text/csv', 'application/json']
};

export const validateFile = (file: File): FileValidationResult => {
  // Check file size
  let maxSize = MAX_FILE_SIZE.text;
  let fileType = 'text';

  if (ALLOWED_TYPES.image.includes(file.type)) {
    maxSize = MAX_FILE_SIZE.image;
    fileType = 'image';
  } else if (ALLOWED_TYPES.pdf.includes(file.type)) {
    maxSize = MAX_FILE_SIZE.pdf;
    fileType = 'pdf';
  } else if (!ALLOWED_TYPES.text.includes(file.type)) {
    return {
      isValid: false,
      error: `File type "${file.type}" is not supported. Please upload images, PDFs, or text files.`
    };
  }

  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      isValid: false,
      error: `File size exceeds the ${maxSizeMB}MB limit for ${fileType} files.`
    };
  }

  return { isValid: true };
};

export const getFileType = (file: File): 'image' | 'pdf' | 'text' => {
  if (ALLOWED_TYPES.image.includes(file.type)) return 'image';
  if (ALLOWED_TYPES.pdf.includes(file.type)) return 'pdf';
  return 'text';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};