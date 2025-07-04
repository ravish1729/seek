import db from "../../connect/sqliteConnect.js";

export const getComments = async (content_id: string) => {
    const query = `
        SELECT 
            c.id,
            c.comment,
            c.content_id,
            c.created_at,
            c.updated_at,
            u.public_key
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.content_id = ?
        ORDER BY c.created_at DESC;
    `;

    try {
        const result = db.prepare(query).all(content_id);
        return result;
    } catch (err) {
        console.error('Error getting comments:', err);
        throw err;
    }
}; 