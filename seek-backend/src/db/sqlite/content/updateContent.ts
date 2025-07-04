import db from "../../connect/sqliteConnect.js";

export const updateContent = async (
  id: number,
  fileSize: string,
  network: string,
  thumbnail: string | null
): Promise<void> => {
  const updateContentQuery = `
      UPDATE content
      SET file_size = ?,
          network = ?,
          thumbnail = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?;
  `;

  try {
      db.prepare(updateContentQuery).run(
          fileSize,
          network,
          thumbnail || null,
          id
      );
      console.log("Content updated for ID:", id);
  } catch (err) {
      console.error('Error updating content:', err);
      throw err;
  }
}; 