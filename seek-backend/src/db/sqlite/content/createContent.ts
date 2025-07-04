import db from "../../connect/sqliteConnect.js";

export const createContent = async (
    userId: number,
    hash: string,
    fileSize: string,
    network: string,
    metadataCID: string,
    thumbnail: string | null,
    title: string,
    fileType: string,
    fileCategory: string
): Promise<number> => {
    const insertContentQuery = `
        INSERT INTO content (
            user_id,
            hash,
            file_size,
            network,
            thumbnail,
            metadata_cid,
            title,
            file_type,
            file_category
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id;
    `;

    try {
        const result = db.prepare(insertContentQuery).get(
            userId,
            hash,
            fileSize,
            network,
            thumbnail || null,
            metadataCID,
            title,
            fileType,
            fileCategory
        ) as { id: number };
        console.log("Content created with ID:", result.id);
        return result.id;
    } catch (err) {
        console.error('Error creating content:', err);
        throw err;
    }
}; 