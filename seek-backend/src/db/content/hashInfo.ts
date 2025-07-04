import client from '../connect/pgConnect.js'

export const hashInfo = async (hash: string) => {
  const query = 'SELECT * FROM content WHERE hash = $1'
  const result = await client.query(query, [hash])
  return result.rows[0] || null
}
