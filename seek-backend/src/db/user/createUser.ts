import client from "../connect/pgConnect.js"

export const createUser = async (publicKey: string): Promise<number> => {
    const insertUserQuery = `
        INSERT INTO users (public_key) VALUES ($1) RETURNING id;
    `;

    try {
        const res = await client.query(insertUserQuery, [publicKey]);
        console.log("User created with ID:", res.rows[0].id);
        return res.rows[0].id as number;
    } catch (err) {
        console.error('Error creating user:', err);
        throw err
    }
}
