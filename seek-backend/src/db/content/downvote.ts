import client from "../connect/pgConnect.js"

export const downvote = async (contentId: number, userId: number): Promise<void> => {
    try {
        await client.query('BEGIN'); // Start transaction

        // First, check if user has already voted on this content
        const existingVoteQuery = `
            SELECT vote_type FROM content_votes 
            WHERE content_id = $1 AND user_id = $2;
        `;
        const existingVoteResult = await client.query(existingVoteQuery, [contentId, userId]);

        if (existingVoteResult.rowCount && existingVoteResult.rowCount > 0) {
            const existingVote = existingVoteResult.rows[0].vote_type;
            
            if (existingVote === false) {
                // User already downvoted, so remove the downvote (toggle off)
                const deleteVoteQuery = `
                    DELETE FROM content_votes 
                    WHERE content_id = $1 AND user_id = $2;
                `;
                await client.query(deleteVoteQuery, [contentId, userId]);
                console.log("Downvote removed for content ID:", contentId, "by user:", userId);
            } else {
                // User upvoted, so change to downvote
                const updateVoteQuery = `
                    UPDATE content_votes 
                    SET vote_type = false 
                    WHERE content_id = $1 AND user_id = $2;
                `;
                await client.query(updateVoteQuery, [contentId, userId]);
                console.log("Vote changed from upvote to downvote for content ID:", contentId, "by user:", userId);
            }
        } else {
            // User hasn't voted, so add downvote
            const insertVoteQuery = `
                INSERT INTO content_votes (content_id, user_id, vote_type)
                VALUES ($1, $2, false);
            `;
            await client.query(insertVoteQuery, [contentId, userId]);
            console.log("Downvote recorded for content ID:", contentId, "by user:", userId);
        }

        await client.query('COMMIT'); // Commit transaction
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback on any error
        console.error('Error recording downvote:', err);
        throw err;
    }
}
