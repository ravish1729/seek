import client from "../connect/pgConnect.js"

export const removeDownvote = async (contentId: number, userId: number): Promise<void> => {
    try {
        await client.query('BEGIN'); // Start transaction

        // First verify this was actually a downvote
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

        if (voteCheck.rows[0].vote_type) {
            await client.query('ROLLBACK');
            throw new Error('Cannot remove downvote: Vote was an upvote');
        }

        // Delete the vote record
        const deleteVoteQuery = `
            DELETE FROM content_votes 
            WHERE content_id = $1 AND user_id = $2;
        `;

        await client.query(deleteVoteQuery, [contentId, userId]);

        // Decrease the downvote count
        const updateDownvoteQuery = `
            UPDATE content 
            SET downvotes = downvotes - 1 
            WHERE id = $1;
        `;

        await client.query(updateDownvoteQuery, [contentId]);
        await client.query('COMMIT');

        console.log("Downvote removed for content ID:", contentId, "by user:", userId);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error removing downvote:', err);
        throw err;
    }
}
