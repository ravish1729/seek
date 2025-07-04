import client from "../connect/pgConnect.js";

export const removeTags = async (contentId: number): Promise<void> => {
  const deleteTagsQuery = `
      DELETE FROM content_tag
      WHERE content_id = $1;
  `;

  try {
      await client.query(deleteTagsQuery, [contentId]);
      console.log(`All tags removed for content ${contentId}`);
  } catch (err) {
      console.error('Error removing tags:', err);
      throw err;
  }
}
