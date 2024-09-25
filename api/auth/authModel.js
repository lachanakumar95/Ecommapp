const db = require('../../config/database');

class Auth
{
    static async createUser(bodyValue)
    {
        const {username, password, email, phone_number} = bodyValue;
        const [rows] = await db.query("INSERT INTO users (username, password, email, phone_number, role_id) VALUES (?,MD5(?),?,?,?)", [username, password, email, phone_number, 1]);
        return rows;
    }
    static async checkEmail(email)
    {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        return rows;
    }
    static async checkPhoneNumber(phone_number)
    {
        const [rows] = await db.query("SELECT * FROM users WHERE phone_number = ?", [phone_number]);
        return rows;
    }
    static async changePassword(bodyValue)
    {   
        const {email, password} = bodyValue;
        const [rows] = await db.query("UPDATE users SET password = MD5(?) WHERE email = ?", [password, email]);
        return rows;
    }

    static async login(bodyValue)
    {
        const {email, password} = bodyValue;
        const [rows] = await db.query("SELECT * FROM users WHERE email= ? AND password = MD5(?)", [email, password]);
        return rows[0];
    }

    static async storeToken(userid, token)
    {
        const [rows] = await db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [token, userid]);
        return rows;
    }

    static async getToken(id)
    {
        const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
        return rows;
    }
   
}

module.exports = Auth;