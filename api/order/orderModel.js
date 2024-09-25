const db = require('../../config/database');
class Order
{
    static async OrderItem(bodyValue)
    {
        const {user_id, product_id, quantity, price} = bodyValue;
    }
}

module.exports = Order;