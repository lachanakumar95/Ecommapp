const productModel = require('../products/productModel');
const customError = require('../../utils/customError');
const path = require('path');
const fs = require('fs');
const db = require('../../config/database');

exports.addProducts = async (req, res, next)=>{
    
    let connection  = await db.getConnection();
    try
    {
        if(req.user.role_id === 2)
        {
            await connection.beginTransaction();

            if(req.files.length === 0) throw customError.BadRequest("Image not uploaded");
           
            if(!req.body) throw customError.BadRequest("Some filed required");
    
            
            const {category_id, product_name, description, price, stock_quantity } = req.body;
    
            if(req.files)
            {
                if(!category_id) throw customError.BadRequest("Category ID filed required");
                if(!product_name) throw customError.BadRequest("Product name filed required");
                if(!description) throw customError.BadRequest("Description filed required");
                if(!price) throw customError.BadRequest("Price filed required");
                if(!stock_quantity) throw customError.BadRequest("Stock quantity filed required");
                
                //if(!status) throw customError.BadRequest("Status filed required");
                const {filename} = req.files.thumb[0];
                const productResult = await productModel.addProducts(req.body, filename);
        
                const productInsertId = productResult.insertId;
    
                for(let item of req.files.images)
                {
                    const objOfProductImages = {
                        product_id : productInsertId,
                        originalname : item.originalname,
                        filename : item.filename,
                        mimetype : item.mimetype,
                        size : item.size
                    }
                await productModel.addProductImages(objOfProductImages);
                }
                await connection.commit();
                res.json({success : true, message : 'Record inserted successfully', data: productResult});  
            }
        }
        else
        {
            throw customError.BadRequest("Your role access denied");
        }

    }
    catch(err)
    {
        if (connection) await connection.rollback();
        next(err);
    }
    finally {
        // Release the connection back to the pool
        if (connection) connection.release();
      }
}


exports.getProdducts = async (req, res, next)=>{
    try
    {

            const productResult = await productModel.getProducts();

            let stroeProductImage = [];
    
            for(let item of productResult)
            {
                const productImagesReust = await productModel.getProductImages(item.product_id);
                stroeProductImage.push(productImagesReust);
            }
            const productImages = stroeProductImage.flat();
            const combinedProduct = productResult.map((item)=>{
                return { 
                    ...item,
                    thumb : `${req.protocol}://${req.get('host')}/uploads/${item.thumb}`,
                    images : productImages.filter(image => image.product_id === item.product_id).map(img => `${req.protocol}://${req.get('host')}/uploads/${img.filename}`)
                };
            });
    
            if(combinedProduct.length === 0) res.json({success: true, data : "No recound found"})
           res.json({success: true, data : combinedProduct});
        
       

    }
    catch(err)
    {
        next(err);
    }
}


// Only product update not image update
exports.updateProduct = async (req, res, next)=>{

    try
    {
        const {id} = req.params;
        const {category_id, product_name, description, price, stock_quantity, status} = req.body;
        const {filename} = req.file;
        if(!category_id) throw customError.BadRequest("Category ID filed required");
        if(!product_name) throw customError.BadRequest("Product name filed required");
        if(!description) throw customError.BadRequest("Description filed required");
        if(!price) throw customError.BadRequest("Price filed required");
        if(!stock_quantity) throw customError.BadRequest("Stock quantity filed required");
        if(!status) throw customError.BadRequest("Status filed required");

        

        const existingImages = await productModel.findProduct(id);

        if(existingImages.length === 0) res.json({success : true, message : 'No record found'});
        // Deleting old images (optional)
        existingImages.forEach(image => {
           fs.unlinkSync(path.join(__dirname, '../../uploads', image.thumb));
        });

        await productModel.updateProduct(req.body, filename, id);
        res.json({success : true, message : 'Record updated successfully'});  
        
    }
    catch(err)
    {
        next(err);
    }
   
}


exports.deleteProductImages = async (req, res, next) =>{
    try
    {
        const {id} = req.params;
        const imageList = await productModel.getProductImages(id);
        if(!id) throw customError.BadRequest("Id rerquired");
        console.log(imageList);
        res.json({success : true, data: imageList});

    }
    catch(err)
    {
        next(err);
    }
}