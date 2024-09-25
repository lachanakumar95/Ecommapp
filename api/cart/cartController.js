const customError = require('../../utils/customError');
const cartModel = require('./cartModel');

exports.addToCart = async (req, res, next)=>{
    try
    {

        if(req.user.role_id === 1)
        {
        if(Object.keys(req.body).length === 0) throw customError.BadRequest("Body Value Empty. Please provide the value");
      
        const {product_id, quantity} = req.body;
        const id = req.user.id;

        if(!product_id) throw customError.BadRequest("Product ID filed required");
        if(!quantity) throw customError.BadRequest("Quantity filed required");

        const productResult = await cartModel.checkProductStock(product_id, id);

        if(quantity <= productResult[0].stock_quantity)
        {
            const checkProduct = await cartModel.checkProducts(product_id, id);
            if(checkProduct.length > 0)
            {
                throw customError.BadRequest("Already Insert Cart Item of this product");
            }
            else
            {
                await cartModel.addToCart(id, req.body);
            }
     
        }
        else
        {
            throw customError.BadRequest("Product Stock only " + productResult[0].stock_quantity);
        }

            res.json({success: true, data : {...req.body}, message : 'Record inserted successfully'});
        }
        else
        {
            throw customError.BadRequest("Your role access denied");
        }

    }
    catch(err)
    {
        next(err);
    }
}

exports.updateCarts = async (req, res, next)=>{
    try
    {
        if(req.user.role_id === 1)
        {
            const {quantity, product_id} = req.body;

            if(!product_id) throw customError.BadRequest("Product ID filed required");
            if(!quantity) throw customError.BadRequest("Quantity filed required");
    
            const productResult = await cartModel.checkProductStock(product_id);
    
            if(quantity <= productResult[0].stock_quantity)
            {
                console.log("in");
                await cartModel.updateCart(quantity, product_id, req.user.id);
            }
            else
            {
                throw customError.BadRequest("Product Stock only " + productResult[0].stock_quantity);
            }
    
            res.json({success: true, message : 'Quantity updated successfully'});
        }
        else
        {
            throw customError.BadRequest("Your role access denied");
        }
       

    }
    catch(err)
    {
        next(err);
    }
}

exports.getCard = async (req, res, next)=>{
    try
    {
        const result = await cartModel.getCart(req.user.id);
       const combined =  result.map((item)=>{
            return {
                ...item,
                thumb : `${req.protocol}://${req.get('host')}/uploads/${item.thumb}`
            };
        });
        res.json({success: false, count: result.length, data : combined});
    }
    catch(err)
    {
        next(err);
    }
}