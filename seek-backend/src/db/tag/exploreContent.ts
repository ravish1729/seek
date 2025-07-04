import client from "../connect/pgConnect.js"

export const exploreContentLatest = async (page = 1, limit = 50) => {
    const offset = (page - 1) * limit;
    const query = `
        SELECT * FROM content 
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2;
    `;

    try {
        const res = await client.query(query, [limit, offset]);
        return res.rows;
    } catch (err) {
        console.error('Error getting content:', err);
        throw err;
    }
}

export const exploreContentTrending = async (page = 1, limit = 50) => {
    const offset = (page - 1) * limit;
    const query = `
        SELECT c.* 
        FROM content c
        WHERE c.created_at >= NOW() - INTERVAL '7 days'
        ORDER BY c.upvotes DESC
        LIMIT $1 OFFSET $2;
    `;

    try {
        const res = await client.query(query, [limit, offset]);
        return res.rows;
    } catch (err) {
        console.error('Error getting popular content:', err);
        throw err;
    }
}

export const exploreContentByUser = async (userId: number, page = 1, limit = 50) => {
    const offset = (page - 1) * limit;
    const query = `
        SELECT * 
        FROM content
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3;
    `;

    try {
        const res = await client.query(query, [userId, limit, offset]);
        return res.rows;
    } catch (err) {
        console.error('Error getting user content:', err);
        throw err;
    }
}
