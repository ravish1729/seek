// Popular MIME types organized by category
export const mimeTypes = {
    image: [
        'image/jpeg',
        'image/png', 
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/bmp',
        'image/tiff',
        'image/ico'
    ],
    video: [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/avi',
        'video/mov',
        'video/wmv',
        'video/flv',
        'video/mkv'
    ],
    audio: [
        'audio/mpeg',
        'audio/wav',
        'audio/ogg',
        'audio/mp4',
        'audio/aac',
        'audio/flac',
        'audio/webm'
    ],
    document: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'text/html',
        'text/css',
        'text/javascript',
        'application/json',
        'application/xml'
    ],
    archive: [
        'application/zip',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
        'application/gzip',
        'application/x-tar',
        'application/x-bzip2'
    ],
    code: [
        'text/plain',
        'text/html',
        'text/css',
        'text/javascript',
        'application/json',
        'application/xml',
        'text/x-python',
        'text/x-java-source',
        'text/x-c++src',
        'text/x-csrc',
        'text/x-php',
        'text/x-ruby',
        'text/x-go',
        'text/x-rust'
    ]
};

// Helper function to search MIME types
export const searchMimeTypes = (query: string): string[] => {
    if (!query.trim()) {
        return [];
    }

    const searchTerm = query.toLowerCase();
    const results: string[] = [];

    // Search through all categories
    Object.values(mimeTypes).forEach(category => {
        category.forEach(mimeType => {
            if (mimeType.toLowerCase().includes(searchTerm)) {
                results.push(mimeType);
            }
        });
    });

    // Add "Other" option if no exact matches found
    if (results.length === 0) {
        results.push('Other');
    }

    return results.slice(0, 10); // Limit to 10 results
}; 