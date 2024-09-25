const db = require('../../config/database');

class Products
{
    static async addProducts(bodyValue, filename)
    {   
        const {category_id, product_name, description, price, stock_quantity}  = bodyValue;
        const [rows] = await db.query("INSERT INTO products (category_id, name, description, price, stock_quantity, thumb) VALUES (?,?,?,?,?,?)", [category_id, product_name, description, price, stock_quantity, filename]);
        return rows;
    }
    
    static async addProductImages(bodyValue)
    {
        const {product_id, originalname, filename, mimetype, size} = bodyValue;
        const [rows] = await db.query("INSERT INTO product_images (product_id, originalname, filename, mimetype, size) VALUES (?,?,?,?,?)", [product_id, originalname, filename, mimetype, size]);
        return rows;
    }

    static async updateProduct(bodyValue, thumb, id)
    {
        const {category_id, product_name, description, price, stock_quantity, status}  = bodyValue;
        const [rows] = await db.query("UPDATE products SET category_id = ?, name = ?, description = ?, price = ?, stock_quantity= ?, status = ?, thumb = ? WHERE  product_id = ?", [category_id, product_name, description, price, stock_quantity, status, thumb, id]);
        return rows;
    }

    static async getProductImages(id)
    {
        const [rows] = await db.query("SELECT * FROM product_images WHERE product_id = ?", [id]);
        return rows;
    }

    static async getProducts()
    {
        const[rows] = await db.query("SELECT p.product_id, p.name, c.category_name, p.description, p.price, p.stock_quantity, p.status, p.thumb FROM products P LEFT JOIN category c ON c.id = p.category_id where p.isdeleted_at = 0 ");
        return rows;
    }

    static async findProduct(id)
    {
        const [rows] = await db.query("SELECT * FROM products WHERE product_id = ?", [id]);
        return rows;
    }
    
}

module.exports = Products;