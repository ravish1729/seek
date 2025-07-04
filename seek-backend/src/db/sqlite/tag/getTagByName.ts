import db from "../../connect/sqliteConnect.js";

export const getTagByName = async (tag_name: string) => {
    const query = `SELECT * FROM tags WHERE tag_name = ?;`;

    try {
        const result = db.prepare(query).get(tag_name);
        return result;
    } catch (err) {
        console.error('Error getting tag:', err);
        throw err;
    }
}; 