import db from "../../connect/sqliteConnect.js";

export const removeComment = async (comment_id: number, user_id: number): Promise<boolean> => {
    try {
        const transaction = db.transaction(() => {
            // First, get the content_id for this comment to update the count
            const getCommentQuery = `
                SELECT content_id FROM comments WHERE id = ? AND user_id = ?;
            `;
            const comment = db.prepare(getCommentQuery).get(comment_id, user_id) as { content_id: number } | undefined;
            
            if (!comment) {
                throw new Error('Comment not found or you do not have permission to delete it');
            }

            // Delete the comment
            const deleteCommentQuery = `
                DELETE FROM comments WHERE id = ? AND user_id = ?;
            `;
            const deleteResult = db.prepare(deleteCommentQuery).run(comment_id, user_id);
            
            if (deleteResult.changes === 0) {
                throw new Error('Comment not found or you do not have permission to delete it');
            }

            // Decrement comment count for the content
            const updateCommentCountQuery = `
                UPDATE content SET comment_count = comment_count - 1 WHERE id = ?;
            `;
            db.prepare(updateCommentCountQuery).run(comment.content_id);
            
            return true;
        });

        const result = transaction();
        console.log("Comment removed with ID:", comment_id);
        return result;
    } catch (err) {
        console.error('Error removing comment:', err);
        throw err;
    }
};
