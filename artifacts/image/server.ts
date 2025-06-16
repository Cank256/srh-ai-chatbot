import { createDocumentHandler } from '@/lib/artifacts/server';

export const imageDocumentHandler = createDocumentHandler<'image'>({
  kind: 'image',
  onCreateDocument: async ({ title, dataStream }) => {
    // Image generation is not supported, only processing of uploaded images
    // This is a placeholder for when no image is uploaded yet
    const placeholderContent = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBsZWFzZSB1cGxvYWQgYW4gaW1hZ2UgdG8gcHJvY2VzczwvdGV4dD4KICA8dGV4dCB4PSI1MCUiIHk9IjcwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U3VwcG9ydHMgUE5HLCBKUEVHLCBHSUYsIGV0Yy48L3RleHQ+Cjwvc3ZnPg==';

    dataStream.writeData({
      type: 'image-delta',
      content: placeholderContent,
    });

    return placeholderContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    // Process the existing image based on the description
    // For now, we just return the existing image as processing is not implemented
    // In a real implementation, this would apply filters or transformations based on the description
    const existingImage = document.content;
    
    // If there's no existing image, show a placeholder
    const placeholderContent = existingImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBsZWFzZSB1cGxvYWQgYW4gaW1hZ2UgdG8gcHJvY2VzczwvdGV4dD4KICA8dGV4dCB4PSI1MCUiIHk9IjcwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U3VwcG9ydHMgUE5HLCBKUEVHLCBHSUYsIGV0Yy48L3RleHQ+Cjwvc3ZnPg==';

    dataStream.writeData({
      type: 'image-delta',
      content: placeholderContent,
    });

    return placeholderContent;
  },
});
