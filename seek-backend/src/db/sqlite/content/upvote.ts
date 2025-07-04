import db from "../../connect/sqliteConnect.js";
import { updateContentVoteCounts } from "../../connect/sqliteTableSetup.js";

export const upvote = async (contentId: number, userId: number): Promise<void> => {
    try {
        const transaction = db.transaction(() => {
            // First, check if user has already voted on this content
            const existingVoteQuery = `
                SELECT vote_type FROM content_votes 
                WHERE content_id = ? AND user_id = ?
            `;
            const existingVote = db.prepare(existingVoteQuery).get(contentId, userId) as { vote_type: number } | undefined;

            if (existingVote) {
                if (existingVote.vote_type === 1) {
                    // User already upvoted, so remove the upvote (toggle off)
                    const deleteVoteQuery = `
                        DELETE FROM content_votes 
                        WHERE content_id = ? AND user_id = ?
                    `;
                    db.prepare(deleteVoteQuery).run(contentId, userId);
                    console.log("Upvote removed for content ID:", contentId, "by user:", userId);
                } else {
                    // User downvoted, so change to upvote
                    const updateVoteQuery = `
                        UPDATE content_votes 
                        SET vote_type = 1 
                        WHERE content_id = ? AND user_id = ?
                    `;
                    db.prepare(updateVoteQuery).run(contentId, userId);
                    console.log("Vote changed from downvote to upvote for content ID:", contentId, "by user:", userId);
                }
            } else {
                // User hasn't voted, so add upvote
                const insertVoteQuery = `
                    INSERT INTO content_votes (content_id, user_id, vote_type)
                    VALUES (?, ?, 1)
                `;
                db.prepare(insertVoteQuery).run(contentId, userId);
                console.log("Upvote recorded for content ID:", contentId, "by user:", userId);
            }

            // Update vote counts
            updateContentVoteCounts(contentId);
        });

        transaction();
    } catch (err) {
        console.error('Error recording upvote:', err);
        throw err;
    }
}; 