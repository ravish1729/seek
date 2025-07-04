import client from "../connect/pgConnect.js"

export const updateContent = async (
  id: number,
  fileSize: string,
  network: string,
  thumbnail: string | null
): Promise<void> => {
  const updateContentQuery = `
      UPDATE content
      SET file_size = $1,
          network = $2,
          thumbnail = $3
      WHERE id = $4;
  `;

  try {
      await client.query(updateContentQuery, [
          fileSize,
          network,
          thumbnail || null,
          id
      ]);
      console.log("Content updated for ID:", id);
  } catch (err) {
      console.error('Error updating content:', err);
      throw err;
  }
}
