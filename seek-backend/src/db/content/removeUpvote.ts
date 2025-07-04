import client from "../connect/pgConnect.js"

export const removeUpvote = async (contentId: number, userId: number): Promise<void> => {
    try {
        await client.query('BEGIN'); // Start transaction

        // First verify this was actually an upvote
        const checkVoteQuery = `
            SELECT vote_type 
            FROM content_votes 
            WHERE content_id = $1 AND user_id = $2;
        `;

        const voteCheck = await client.query(checkVoteQuery, [contentId, userId]);
        
        if (voteCheck.rowCount === 0) {
            await client.query('ROLLBACK');
            throw new Error('No vote found for this content');
        }

        if (!voteCheck.rows[0].vote_type) {
            await client.query('ROLLBACK');
            throw new Error('Cannot remove upvote: Vote was a downvote');
        }

        // Delete the vote record
        const deleteVoteQuery = `
            DELETE FROM content_votes 
            WHERE content_id = $1 AND user_id = $2;
        `;

        await client.query(deleteVoteQuery, [contentId, userId]);

        // Decrease the upvote count
        const updateUpvoteQuery = `
            UPDATE content 
            SET upvotes = upvotes - 1 
            WHERE id = $1;
        `;

        await client.query(updateUpvoteQuery, [contentId]);
        await client.query('COMMIT');

        console.log("Upvote removed for content ID:", contentId, "by user:", userId);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error removing upvote:', err);
        throw err;
    }
}
