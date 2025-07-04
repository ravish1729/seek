import client from '../connect/pgConnect.js'

export const deleteContent = async (contentId: number) => {
  try {
      await client.query('BEGIN'); // Start transaction

      // Delete from content_tag_vector
      await client.query('DELETE FROM content_tag_vector WHERE content_id = $1', [contentId]);

      // Delete from content_tag mappings
      await client.query('DELETE FROM content_tag WHERE content_id = $1', [contentId]);

      // Delete from content_votes
      await client.query('DELETE FROM content_votes WHERE content_id = $1', [contentId]);

      // Delete from content_description
      await client.query('DELETE FROM content_description WHERE content_id = $1', [contentId]);

      // Delete from comments
      await client.query('DELETE FROM comments WHERE content_id = $1', [contentId]);

      // Finally delete the content itself
      await client.query('DELETE FROM content WHERE id = $1', [contentId]);

      await client.query('COMMIT'); // Commit transaction
      return true;
  } catch (err) {
      await client.query('ROLLBACK'); // Rollback on error
      console.error('Error deleting content:', err);
      throw err;
  }
}
