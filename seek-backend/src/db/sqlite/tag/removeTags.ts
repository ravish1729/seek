import db from "../../connect/sqliteConnect.js";

export const removeTags = async (contentId: number): Promise<void> => {
  const deleteTagsQuery = `
      DELETE FROM content_tag
      WHERE content_id = ?;
  `;

  try {
      db.prepare(deleteTagsQuery).run(contentId);
      console.log(`All tags removed for content ${contentId}`);
  } catch (err) {
      console.error('Error removing tags:', err);
      throw err;
  }
}; 