import client from "../connect/pgConnect.js"

export const createComment = async (user_id: number, content_id: number, comment: string): Promise<number> => {
    try {
        await client.query('BEGIN'); // Start transaction

        const insertCommentQuery = `
            INSERT INTO comments (user_id, content_id, comment) VALUES ($1, $2, $3) RETURNING id;
        `;
        const res = await client.query(insertCommentQuery, [user_id, content_id, comment]);
        
        // Increment comment count for the content
        const updateCommentCountQuery = `
            UPDATE content SET comment_count = comment_count + 1 WHERE id = $1;
        `;
        await client.query(updateCommentCountQuery, [content_id]);

        await client.query('COMMIT'); // Commit transaction
        console.log("Comment created with ID:", res.rows[0].id);
        return res.rows[0].id as number;
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback on error
        console.error('Error creating comment:', err);
        throw err
    }
}
