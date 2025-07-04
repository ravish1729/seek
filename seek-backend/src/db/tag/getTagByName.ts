import client from "../connect/pgConnect.js"

export const getTagByName = async (tag_name: string) => {
    const insertUserQuery = `
        SELECT * FROM tags WHERE tag_name = $1;
    `;

    try {
        const res = await client.query(insertUserQuery, [tag_name]);
        return res.rows[0];
    } catch (err) {
        console.error('Error getting tag:', err);
    }
}
