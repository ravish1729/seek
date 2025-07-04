import client from "../connect/pgConnect.js"

export const removeComment = async (comment_id: number, user_id: number): Promise<boolean> => {
    try {
        await client.query('BEGIN'); // Start transaction

        // First, get the content_id for this comment to update the count
        const getCommentQuery = `
            SELECT content_id FROM comments WHERE id = $1 AND user_id = $2;
        `;
        const commentResult = await client.query(getCommentQuery, [comment_id, user_id]);
        
        if (commentResult.rowCount === 0) {
            await client.query('ROLLBACK');
            throw new Error('Comment not found or you do not have permission to delete it');
        }

        const content_id = commentResult.rows[0].content_id;

        // Delete the comment
        const deleteCommentQuery = `
            DELETE FROM comments WHERE id = $1 AND user_id = $2;
        `;
        const deleteResult = await client.query(deleteCommentQuery, [comment_id, user_id]);
        
        if (deleteResult.rowCount === 0) {
            await client.query('ROLLBACK');
            throw new Error('Comment not found or you do not have permission to delete it');
        }

        // Decrement comment count for the content
        const updateCommentCountQuery = `
            UPDATE content SET comment_count = comment_count - 1 WHERE id = $1;
        `;
        await client.query(updateCommentCountQuery, [content_id]);

        await client.query('COMMIT'); // Commit transaction
        console.log("Comment removed with ID:", comment_id);
        return true;
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback on error
        console.error('Error removing comment:', err);
        throw err;
    }
} 