import db from "../../connect/sqliteConnect.js";

export const incrementPoints = async (userId: number): Promise<void> => {
    const updatePointsQuery = `
        UPDATE users 
        SET points = points + 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?;
    `;

    try {
        const result = db.prepare(updatePointsQuery).run(userId);
        
        if (result.changes === 0) {
            throw new Error('User not found');
        }
        
        console.log("Points incremented for user ID:", userId);
    } catch (err) {
        console.error('Error incrementing user points:', err);
        throw err;
    }
}; 