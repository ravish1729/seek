import db from '../../connect/sqliteConnect.js';

export const getDescription = async (content_id: number) => {
  const query = 'SELECT description FROM content_description WHERE content_id = ?';
  const result = db.prepare(query).get(content_id) as { description: string } | undefined;
  return result?.description || null;
}; 