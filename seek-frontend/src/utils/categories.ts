// Common file categories for content organization
export const fileCategories = [
    'website',
    'dataset',
    'image',
    'video',
    'audio',
    'document',
    'archive',
    'code',
    'ebook',
    'presentation',
    'spreadsheet',
    '3d-model',
    'game',
    'app',
    'template',
    'font',
    'icon',
    'texture',
    'animation',
    'simulation',
    'research',
    'educational',
    'entertainment',
    'business',
    'personal',
    'public-domain',
    'creative-commons',
    'proprietary'
];

// Helper function to search categories
export const searchCategories = (query: string): string[] => {
    if (!query.trim()) {
        return [];
    }

    const searchTerm = query.toLowerCase();
    const results: string[] = [];

    // Search through all categories
    fileCategories.forEach(category => {
        if (category.toLowerCase().includes(searchTerm)) {
            results.push(category);
        }
    });

    // Add "Other" option if no exact matches found
    if (results.length === 0) {
        results.push('Other');
    }

    return results.slice(0, 10); // Limit to 10 results
}; 