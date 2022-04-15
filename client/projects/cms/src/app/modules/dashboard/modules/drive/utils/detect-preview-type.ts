import {PreviewType} from '../types/preview.type';

export function detectPreviewType(contentType: string): PreviewType {
  if (contentType.startsWith('image/')) {
    return 'image';
  }

  if (contentType.startsWith('video/')) {
    return 'video';
  }

  if (contentType.startsWith('audio/')) {
    return 'audio';
  }

  if (contentType === 'application/pdf') {
    return 'pdf';
  }

  return 'other';
}
