import client from "../connect/pgConnect.js";

export const getTaggedContent = async (id: number, limit: number = 50, offset: number = 0) => {
    const query = {
        text: `
            SELECT c.*, array_agg(t.tag_name) AS tags
            FROM content c
            LEFT JOIN content_tag ct ON c.id = ct.content_id
            LEFT JOIN tags t ON ct.tag_id = t.id
            WHERE c.user_id = $1 
            GROUP BY c.id
            LIMIT $2 OFFSET $3
        `,
        values: [id, limit, offset],
    }

    try {
        const result = await client.query(query)
        return result.rows || null
    } catch (err) {
        console.error('Error fetching tagged content:', err)
        throw err
    }
}
