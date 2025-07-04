import client from "../connect/pgConnect.js"

export const addContentDescription = async (contentId: number, description: string): Promise<void> => {
    const query = `
        INSERT INTO content_description (content_id, description)
        VALUES ($1, $2)
        ON CONFLICT (content_id) 
        DO UPDATE SET 
            description = $2,
            updated_at = CURRENT_TIMESTAMP
    `
    
    try {
        await client.query(query, [contentId, description])
    } catch (error) {
        console.error('Error adding content description:', error)
        throw error
    }
}
