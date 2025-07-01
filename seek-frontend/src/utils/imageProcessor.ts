export interface ProcessedThumbnail {
    file: File;
    preview: string;
    originalName: string;
}

// Convert image to optimal format for backend storage
export const processImage = async (file: File): Promise<ProcessedThumbnail> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            // YouTube thumbnail dimensions: 1280x720 (16:9 aspect ratio)
            const thumbnailWidth = 1280;
            const thumbnailHeight = 720;
            
            canvas.width = thumbnailWidth;
            canvas.height = thumbnailHeight;
            
            // Calculate scaling to maintain aspect ratio and crop to fit 16:9
            const imgAspectRatio = img.width / img.height;
            const targetAspectRatio = thumbnailWidth / thumbnailHeight;
            
            let sourceX = 0;
            let sourceY = 0;
            let sourceWidth = img.width;
            let sourceHeight = img.height;
            
            if (imgAspectRatio > targetAspectRatio) {
                // Image is wider than 16:9, crop from center
                sourceWidth = img.height * targetAspectRatio;
                sourceX = (img.width - sourceWidth) / 2;
            } else {
                // Image is taller than 16:9, crop from center
                sourceHeight = img.width / targetAspectRatio;
                sourceY = (img.height - sourceHeight) / 2;
            }
            
            // Draw image on canvas with cropping
            ctx?.drawImage(
                img,
                sourceX, sourceY, sourceWidth, sourceHeight, // Source rectangle
                0, 0, thumbnailWidth, thumbnailHeight // Destination rectangle
            );
            
            // Try WebP first, fallback to JPEG
            const tryWebP = () => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        const processedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                            type: 'image/webp',
                            lastModified: Date.now()
                        });
                        
                        resolve({
                            file: processedFile,
                            preview: URL.createObjectURL(blob),
                            originalName: file.name
                        });
                    } else {
                        // Fallback to JPEG if WebP fails
                        canvas.toBlob((jpegBlob) => {
                            if (jpegBlob) {
                                const processedFile = new File([jpegBlob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                                    type: 'image/jpeg',
                                    lastModified: Date.now()
                                });
                                
                                resolve({
                                    file: processedFile,
                                    preview: URL.createObjectURL(jpegBlob),
                                    originalName: file.name
                                });
                            } else {
                                reject(new Error('Failed to process image'));
                            }
                        }, 'image/jpeg', 0.7);
                    }
                }, 'image/webp', 0.7);
            };
            
            tryWebP();
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
};

export const validateImageFile = (file: File): string | null => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        return 'Please select a valid image file';
    }
    
    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
        return 'File size must be less than 2MB';
    }
    
    return null;
}; 