import client from "../connect/pgConnect.js"

export const upvote = async (contentId: number, userId: number): Promise<void> => {
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
            
            if (existingVote === true) {
                // User already upvoted, so remove the upvote (toggle off)
                const deleteVoteQuery = `
                    DELETE FROM content_votes 
                    WHERE content_id = $1 AND user_id = $2;
                `;
                await client.query(deleteVoteQuery, [contentId, userId]);
                console.log("Upvote removed for content ID:", contentId, "by user:", userId);
            } else {
                // User downvoted, so change to upvote
                const updateVoteQuery = `
                    UPDATE content_votes 
                    SET vote_type = true 
                    WHERE content_id = $1 AND user_id = $2;
                `;
                await client.query(updateVoteQuery, [contentId, userId]);
                console.log("Vote changed from downvote to upvote for content ID:", contentId, "by user:", userId);
            }
        } else {
            // User hasn't voted, so add upvote
            const insertVoteQuery = `
                INSERT INTO content_votes (content_id, user_id, vote_type)
                VALUES ($1, $2, true);
            `;
            await client.query(insertVoteQuery, [contentId, userId]);
            console.log("Upvote recorded for content ID:", contentId, "by user:", userId);
        }

        await client.query('COMMIT'); // Commit transaction
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback on any error
        console.error('Error recording upvote:', err);
        throw err;
    }
}
