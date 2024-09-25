const db = require('../../config/database');

class Cart
{
    static async addToCart(userid, bodyValue)
    {
        const {product_id, quantity} = bodyValue;
        const [rows] = await db.query ("INSERT INTO cart_items(user_id, product_id, quantity) VALUES (?,?,?)", [userid, product_id, quantity]);
        return rows;
    }

    static async updateCart(quantity, productid, userid)
    {
        const [rows] = await db.query("UPDATE cart_items SET quantity = ? WHERE product_id = ? AND user_id = ?", [quantity, productid, userid]);
        return rows;
    }
    static async checkProducts(product_id, userid)
    {
        const [rows] = await db.query("SELECT * FROM cart_items WHERE product_id = ? AND user_id = ?", [product_id, userid]);
        return rows;
    }
    static async checkProductStock(id)
    {
        const [rows] = await db.query("SELECT * FROM products WHERE product_id = ?", [id]);
        return rows;
    }

    static async getCart(userid)
    { 
        const [rows] = await db.query("SELECT p.product_id, p.name, c.category_name, p.description, p.thumb, p.price, ci.quantity, (p.price * ci.quantity) AS total_price, p.stock_quantity FROM products p LEFT JOIN category c ON p.product_id = c.id LEFT JOIN cart_items ci ON p.product_id = ci.product_id WHERE ci.user_id = ? AND ci.isdeleted_at = 0", [userid]);
        return rows;
    }
//     SELECT  SUM(p.price * ci.quantity) AS TOTAL  -- Grouping by price
// FROM products p
// LEFT JOIN category c ON p.category_id = c.id
// LEFT JOIN cart_items ci ON p.product_id = ci.product_id
// WHERE ci.user_id = 3
}
module.exports = Cart;