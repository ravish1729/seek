import db from "../../connect/sqliteConnect.js";

export const tagContent = async (contentId: number, tagId: number): Promise<void> => {
    const insertContentTagQuery = `
        INSERT INTO content_tag (content_id, tag_id)
        VALUES (?, ?)
    `;

    try {
        db.prepare(insertContentTagQuery).run(contentId, tagId);
        console.log(`Content ${contentId} tagged with tag ${tagId}`);
    } catch (err: any) {
        // Ignore constraint violation (tag already exists)
        if (err.code !== 'SQLITE_CONSTRAINT') {
            console.error('Error tagging content:', err);
            throw err;
        }
    }
}; 