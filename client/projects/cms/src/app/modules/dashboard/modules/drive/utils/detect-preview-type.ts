import {PreviewType} from '../types/preview.type';

export function detectPreviewType(contentType: string): PreviewType {
  if (contentType.startsWith('image/')) {
    return 'image';
  }

  if (contentType.startsWith('video/')) {
    return 'video';
  }

  return 'other';
}
