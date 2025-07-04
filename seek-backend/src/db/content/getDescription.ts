import client from '../connect/pgConnect.js'

export const getDescription = async (content_id: number) => {
  const query = 'SELECT description FROM content_description WHERE content_id = $1'
  const result = await client.query(query, [content_id])
  return result.rows[0]?.description || null
}
