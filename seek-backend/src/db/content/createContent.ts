import client from "../connect/pgConnect.js"

export const createContent = async (
    userId: number,
    hash: string,
    fileSize: string,
    network: string,
    thumbnail: string | null
): Promise<number> => {
    const insertContentQuery = `
        INSERT INTO content (
            user_id,
            hash,
            file_size,
            network,
            thumbnail
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
    `;

    try {
        const res = await client.query(insertContentQuery, [
            userId,
            hash,
            fileSize,
            network,
            thumbnail || null
        ]);
        console.log("Content created with ID:", res.rows[0].id);
        return res.rows[0].id as number;
    } catch (err) {
        console.error('Error creating content:', err);
        throw err;
    }
}
