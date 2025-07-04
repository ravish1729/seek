import db from "../../connect/sqliteConnect.js";

export const getTaggedContent = async (id: number, limit: number = 50, offset: number = 0) => {
    const query = `
        SELECT c.*, GROUP_CONCAT(t.tag_name) AS tags
        FROM content c
        LEFT JOIN content_tag ct ON c.id = ct.content_id
        LEFT JOIN tags t ON ct.tag_id = t.id
        WHERE c.user_id = ? 
        GROUP BY c.id
        LIMIT ? OFFSET ?
    `;

    try {
        const result = db.prepare(query).all(id, limit, offset);
        // Convert tags string to array
        return result.map((row: any) => ({
            ...row,
            tags: row.tags ? row.tags.split(',') : []
        })) || null;
    } catch (err) {
        console.error('Error fetching tagged content:', err);
        throw err;
    }
}; 