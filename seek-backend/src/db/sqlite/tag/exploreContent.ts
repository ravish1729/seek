import db from "../../connect/sqliteConnect.js";

export const exploreContentLatest = async (page = 1, limit = 50) => {
    const offset = (page - 1) * limit;
    const query = `
        SELECT * FROM content 
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?;
    `;

    try {
        const result = db.prepare(query).all(limit, offset);
        return result;
    } catch (err) {
        console.error('Error getting content:', err);
        throw err;
    }
};

export const exploreContentTrending = async (page = 1, limit = 50) => {
    const offset = (page - 1) * limit;
    const query = `
        SELECT c.* 
        FROM content c
        WHERE c.created_at >= datetime('now', '-7 days')
        ORDER BY c.upvotes DESC
        LIMIT ? OFFSET ?;
    `;

    try {
        const result = db.prepare(query).all(limit, offset);
        return result;
    } catch (err) {
        console.error('Error getting popular content:', err);
        throw err;
    }
};

export const exploreContentByUser = async (userId: number, page = 1, limit = 50) => {
    const offset = (page - 1) * limit;
    const query = `
        SELECT * 
        FROM content
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?;
    `;

    try {
        const result = db.prepare(query).all(userId, limit, offset);
        return result;
    } catch (err) {
        console.error('Error getting user content:', err);
        throw err;
    }
}; 