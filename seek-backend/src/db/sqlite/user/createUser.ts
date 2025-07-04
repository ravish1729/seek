import db from "../../connect/sqliteConnect.js";

export const createUser = async (publicKey: string): Promise<number> => {
    const insertUserQuery = `
        INSERT INTO users (public_key) VALUES (?) RETURNING id;
    `;

    try {
        const result = db.prepare(insertUserQuery).get(publicKey) as { id: number };
        console.log("User created with ID:", result.id);
        return result.id;
    } catch (err) {
        console.error('Error creating user:', err);
        throw err;
    }
}; 