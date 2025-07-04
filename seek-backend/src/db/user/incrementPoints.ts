import client from "../connect/pgConnect.js";

export const incrementPoints = async (userId: number): Promise<void> => {
    const updatePointsQuery = `
        UPDATE users 
        SET points = points + 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1;
    `;

    try {
        const result = await client.query(updatePointsQuery, [userId]);
        
        if (result.rowCount === 0) {
            throw new Error('User not found');
        }
        
        console.log("Points incremented for user ID:", userId);
    } catch (err) {
        console.error('Error incrementing user points:', err);
        throw err;
    }
}; 