import client from "../connect/pgConnect.js";

export const tagContent = async (contentId: number, tagId: number): Promise<void> => {
    const insertContentTagQuery = `
        INSERT INTO content_tag (content_id, tag_id)
        VALUES ($1, $2)
        ON CONFLICT (content_id, tag_id) DO NOTHING;
    `;

    try {
        await client.query(insertContentTagQuery, [contentId, tagId]);
        console.log(`Content ${contentId} tagged with tag ${tagId}`);
    } catch (err) {
        console.error('Error tagging content:', err);
        throw err;
    }
}
