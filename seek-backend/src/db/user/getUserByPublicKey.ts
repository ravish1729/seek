import client from "../connect/pgConnect.js";

export const getUserByPublicKey = async (publicKey: string) => {
    const query = {
        text: 'SELECT * FROM users WHERE public_key = $1',
        values: [publicKey],
    }

    try {
        const result = await client.query(query)
        return result.rows[0] || null
    } catch (err) {
        console.error('Error fetching user by public key:', err)
        throw err
    }
}
