
import {pool} from '../helper/bd.js'

export const insertUser = async (email,hashedPassword) => {
    return await pool.query('INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword])

}

export const selectUserByEmail = async (email) => {
    return await pool.query('SELECT * FROM account WHERE email = $1', [email])
}

