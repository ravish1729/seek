import db from '../../connect/sqliteConnect.js';

export const hashInfo = async (hash: string) => {
  const query = 'SELECT * FROM content WHERE hash = ?';
  const result = db.prepare(query).get(hash);
  return result || null;
}; 