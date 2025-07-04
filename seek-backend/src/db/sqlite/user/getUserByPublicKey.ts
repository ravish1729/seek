import db from "../../connect/sqliteConnect.js";

export const getUserByPublicKey = async (publicKey: string) => {
    const query = 'SELECT * FROM users WHERE public_key = ?';

    try {
        const result = db.prepare(query).get(publicKey);
        return result || null;
    } catch (err) {
        console.error('Error fetching user by public key:', err);
        throw err;
    }
}; 