import db from "../../connect/sqliteConnect.js";

export const createComment = async (user_id: number, content_id: number, comment: string): Promise<number> => {
    try {
        const transaction = db.transaction(() => {
            // Insert the comment
            const insertCommentQuery = `
                INSERT INTO comments (user_id, content_id, comment) VALUES (?, ?, ?) RETURNING id;
            `;
            const result = db.prepare(insertCommentQuery).get(user_id, content_id, comment) as { id: number };
            
            // Increment comment count for the content
            const updateCommentCountQuery = `
                UPDATE content SET comment_count = comment_count + 1 WHERE id = ?;
            `;
            db.prepare(updateCommentCountQuery).run(content_id);
            
            return result.id;
        });

        const commentId = transaction();
        console.log("Comment created with ID:", commentId);
        return commentId;
    } catch (err) {
        console.error('Error creating comment:', err);
        throw err;
    }
}; 