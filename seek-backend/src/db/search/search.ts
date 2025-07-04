import client from "../connect/pgConnect.js"
import { incrementPoints } from "../user/incrementPoints.js";

export const search = async (searchQuery: string) => {
    try {
        // Use FTS to get relevant content with ranking
        const query = {
            text: `
                SELECT 
                    c.*,
                    cd.description,
                    cd.license,
                    u.public_key as user_public_key,
                    string_agg(t.tag_name, ',') as tags
                FROM content c
                LEFT JOIN content_description cd ON c.id = cd.content_id
                LEFT JOIN users u ON c.user_id = u.id
                LEFT JOIN content_tag ct ON c.id = ct.content_id
                LEFT JOIN tags t ON ct.tag_id = t.id
                LEFT JOIN content_tag_vector ctv ON c.id = ctv.content_id
                WHERE ctv.tsv_tags @@ plainto_tsquery('english', $1)
                GROUP BY c.id, cd.description, cd.license, u.public_key, ctv.tsv_tags
                ORDER BY ts_rank(ctv.tsv_tags, plainto_tsquery('english', $1)) DESC
                LIMIT 20;
            `,
            values: [searchQuery],
        };

        const result = await client.query(query);
        
        if (result.rows.length === 0) {
            return [];
        }

        // Convert tags string to array and add relevance score
        const processedResults = result.rows.map((row: any) => ({
            ...row,
            tags: row.tags ? row.tags.split(',') : [],
            relevance_score: calculateRelevanceScore(row, searchQuery)
        })).sort((a: any, b: any) => b.relevance_score - a.relevance_score);

        // Increment points for users whose content appears in search results
        const uniqueUserIds = [...new Set(processedResults.map((row: any) => row.user_id))];
        for (const userId of uniqueUserIds) {
            try {
                await incrementPoints(userId);
            } catch (err) {
                console.error(`Failed to increment points for user ${userId}:`, err);
                // Continue processing other users even if one fails
            }
        }

        return processedResults;
    } catch (err) {
        console.error('Error searching content:', err);
        throw err;
    }
};

// Helper function to calculate relevance score (same as SQLite version)
const calculateRelevanceScore = (content: any, searchQuery: string): number => {
    let score = 0;
    const query = searchQuery.toLowerCase();
    
    // Hash match (highest priority)
    if (content.hash.toLowerCase().includes(query)) {
        score += 100;
    }
    
    // Title match (high priority)
    if (content.title && content.title.toLowerCase().includes(query)) {
        score += 80;
        // Exact title match gets bonus
        if (content.title.toLowerCase() === query) {
            score += 20;
        }
    }
    
    // Tag matches (high priority)
    if (content.tags && Array.isArray(content.tags) && content.tags.length > 0) {
        const tagMatches = content.tags.filter((tag: string) => 
            tag.toLowerCase().includes(query)
        ).length;
        score += tagMatches * 60;
        
        // Exact tag match gets bonus
        const exactTagMatch = content.tags.some((tag: string) => 
            tag.toLowerCase() === query
        );
        if (exactTagMatch) {
            score += 30;
        }
    }
    
    // Description match (medium priority)
    if (content.description && content.description.toLowerCase().includes(query)) {
        score += 40;
        
        // Check for multiple occurrences in description
        const occurrences = (content.description.toLowerCase().match(new RegExp(query, 'g')) || []).length;
        score += occurrences * 5;
    }
    
    // Network match (lower priority)
    if (content.network && content.network.toLowerCase().includes(query)) {
        score += 20;
    }
    
    // File type/category match (lower priority)
    if (content.file_type && content.file_type.toLowerCase().includes(query)) {
        score += 15;
    }
    if (content.file_category && content.file_category.toLowerCase().includes(query)) {
        score += 15;
    }
    
    // Popularity boost (upvotes increase relevance)
    score += Math.min(content.upvotes || 0, 50) * 0.5;
    
    // Recency bonus (newer content gets slight boost)
    const daysSinceCreation = (Date.now() - new Date(content.created_at).getTime()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 10 - daysSinceCreation);
    
    return score;
};
