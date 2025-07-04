import db from "../../connect/sqliteConnect.js";

export const addContentDescription = async (contentId: number, description: string): Promise<void> => {
    const query = `
        INSERT INTO content_description (content_id, description)
        VALUES (?, ?)
        ON CONFLICT (content_id) 
        DO UPDATE SET 
            description = ?,
            updated_at = CURRENT_TIMESTAMP
    `;
    
    try {
        db.prepare(query).run(contentId, description, description);
    } catch (error) {
        console.error('Error adding content description:', error);
        throw error;
    }
}; 