import client from "../connect/pgConnect.js"

export const createTag = async (tag_name: string): Promise<number> => {
    const insertTagQuery = `
        INSERT INTO tags (tag_name) VALUES ($1) RETURNING id;
    `;

    try {
        const res = await client.query(insertTagQuery, [tag_name]);
        console.log("Tag created with ID:", res.rows[0].id);
        return res.rows[0].id as number;
    } catch (err) {
        console.error('Error creating tag:', err);
        throw err
    }
}
