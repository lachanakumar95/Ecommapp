const db = require("../../config/database");
class Category
{
    static async addCategory(bodyValue)
    {
        const {category_name, originalname, filename, mimetype, size}  = bodyValue;
        const [rows] = await db.query("INSERT INTO category (category_name, originalname, filename, mimetype, size) VALUES (?,?,?,?,?)", [category_name, originalname, filename, mimetype, size]);
        return rows;
    }

    static async updateCategory(bodyValue)
    {
        const {id, category_name, originalname, filename, mimetype, size}  = bodyValue;
        const [rows] = await db.query("UPDATE category SET category_name=?, originalname=?, filename=?, mimetype=?, size=? WHERE id = ?", [category_name, originalname, filename, mimetype, size, id]);
        return rows;
    }
    static async getCategory(id)
    {
        const [rows] = await db.query("SELECT * FROM category WHERE id = ?", [id]);
        return rows;
    }
    static async getAllCategory()
    {
        const [rows] = await db.query("SELECT * FROM category where isdeleted_at = 0");
        return rows;
    }
    static async deleteCategory(id)
    {
        console.log(id);
        const [rows] = await db.query("UPDATE category SET isdeleted_at = 1 WHERE id = ?", [id]);
        return rows;
    }
}

module.exports = Category;