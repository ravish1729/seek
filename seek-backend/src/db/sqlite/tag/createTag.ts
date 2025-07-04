import db from "../../connect/sqliteConnect.js";

export const createTag = async (tag_name: string): Promise<number> => {
    const insertTagQuery = `
        INSERT INTO tags (tag_name) VALUES (?) RETURNING id;
    `;

    try {
        const result = db.prepare(insertTagQuery).get(tag_name) as { id: number };
        console.log("Tag created with ID:", result.id);
        return result.id;
    } catch (err) {
        console.error('Error creating tag:', err);
        throw err;
    }
}; 