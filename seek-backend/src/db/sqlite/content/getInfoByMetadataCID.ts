import db from '../../connect/sqliteConnect.js';

export const getInfoByMetadataCID = async (metadata_cid: string) => {
  // First, get all content info from content table
  const contentQuery = `
    SELECT id, user_id, hash, title, file_size, network, upvotes, downvotes, 
           comment_count, file_type, file_category, thumbnail, metadata_cid, 
           created_at, updated_at
    FROM content 
    WHERE metadata_cid = ?
  `;
  
  const contentResult = db.prepare(contentQuery).get(metadata_cid) as {
    id: number;
    user_id: number;
    hash: string;
    title: string;
    file_size: string;
    network: string;
    upvotes: number;
    downvotes: number;
    comment_count: number;
    file_type: string;
    file_category: string;
    thumbnail: string;
    metadata_cid: string;
    created_at: string;
    updated_at: string;
  } | undefined;

  if (!contentResult) {
    return null;
  }

  // Then, get description info using the content ID
  const descriptionQuery = `
    SELECT description, license, created_at as desc_created_at, updated_at as desc_updated_at
    FROM content_description 
    WHERE content_id = ?
  `;
  
  const descriptionResult = db.prepare(descriptionQuery).get(contentResult.id) as {
    description: string;
    license: string;
    desc_created_at: string;
    desc_updated_at: string;
  } | undefined;

  // Get user info using the user_id
  const userQuery = `
    SELECT public_key
    FROM users 
    WHERE id = ?
  `;
  
  const userResult = db.prepare(userQuery).get(contentResult.user_id) as {
    public_key: string;
  } | undefined;

  // Combine the data
  return {
    ...contentResult,
    description: descriptionResult?.description || null,
    license: descriptionResult?.license || null,
    desc_created_at: descriptionResult?.desc_created_at || null,
    desc_updated_at: descriptionResult?.desc_updated_at || null,
    public_key: userResult?.public_key || null
  };
}; 