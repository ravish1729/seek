import db from "../../connect/sqliteConnect.js";
import { updateContentVoteCounts } from "../../connect/sqliteTableSetup.js";

export const downvote = async (contentId: number, userId: number): Promise<void> => {
    try {
        const transaction = db.transaction(() => {
            // First, check if user has already voted on this content
            const existingVoteQuery = `
                SELECT vote_type FROM content_votes 
                WHERE content_id = ? AND user_id = ?
            `;
            const existingVote = db.prepare(existingVoteQuery).get(contentId, userId) as { vote_type: number } | undefined;

            if (existingVote) {
                if (existingVote.vote_type === 0) {
                    // User already downvoted, so remove the downvote (toggle off)
                    const deleteVoteQuery = `
                        DELETE FROM content_votes 
                        WHERE content_id = ? AND user_id = ?
                    `;
                    db.prepare(deleteVoteQuery).run(contentId, userId);
                    console.log("Downvote removed for content ID:", contentId, "by user:", userId);
                } else {
                    // User upvoted, so change to downvote
                    const updateVoteQuery = `
                        UPDATE content_votes 
                        SET vote_type = 0 
                        WHERE content_id = ? AND user_id = ?
                    `;
                    db.prepare(updateVoteQuery).run(contentId, userId);
                    console.log("Vote changed from upvote to downvote for content ID:", contentId, "by user:", userId);
                }
            } else {
                // User hasn't voted, so add downvote
                const insertVoteQuery = `
                    INSERT INTO content_votes (content_id, user_id, vote_type)
                    VALUES (?, ?, 0)
                `;
                db.prepare(insertVoteQuery).run(contentId, userId);
                console.log("Downvote recorded for content ID:", contentId, "by user:", userId);
            }

            // Update vote counts
            updateContentVoteCounts(contentId);
        });

        transaction();
    } catch (err) {
        console.error('Error recording downvote:', err);
        throw err;
    }
}; 