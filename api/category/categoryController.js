const categoryModel = require('./categoryModel');
const customError = require('../../utils/customError');
const fs = require('fs');
const path = require('path');
exports.addCategory = async (req, res, next)=>{
    try
    {
        if(req.user.role_id === 2)
        {
            if(!req.file) throw customError.BadRequest("No file uploaded or invalid file type");

            const { originalname, filename, mimetype, size } = req.file;
            const { category_name} = req.body;
    
            if(!category_name) throw customError.BadRequest("Category name field required");
            
            // Save image data to the database
            const newImage = await categoryModel.addCategory({category_name,filename, originalname,mimetype,size});
    
            res.status(201).json({success: true, message: 'Record inserted successfully'});
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

exports.updateCategory = async (req, res, next)=>{
    try
    {
        if(req.user.role_id === 2)
         {
            if(!req.file) throw customError.BadRequest("No file uploaded or invalid file type");
            
            const {id} = req.params;
            const { originalname, filename, mimetype, size } = req.file;
            const { category_name} = req.body;

            if(!category_name) throw customError.BadRequest("Category name field required");
            const existingImages = await categoryModel.getCategory(id);

            // Deleting old images (optional)
            const filePath = path.join(__dirname, '../../uploads', existingImages[0].filename);
            fs.unlinkSync(filePath);


            await categoryModel.updateCategory({category_name,filename, originalname,mimetype,size,id});
            res.status(200).json({ message: 'Record updated successfully' });
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

exports.deleteCategory = async (req, res, next)=>{
        try
        {
            if(req.user.role_id === 2)
              {
                const {id} = req.params;
                if(!id) throw customError.BadRequest("Id is required");
                const deleteResult = await categoryModel.deleteCategory(id);
                
                res.status(200).json({success: true, data : deleteResult, message: "Record deleted successfully"});
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

exports.getAllCategory = async (req, res, next)=>{
    try
    {
        const result = await categoryModel.getAllCategory();
        //const fullUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
        const dataResult = result.map((item)=>{
            return {
                id : item.id,
                category_name : item.category_name,
                image : `${req.protocol}://${req.get('host')}/uploads/${item.filename}`
            };
        });
        res.status(200).json({success: true, count: result.length,  data : dataResult, message : "Record loaded succesfully"});
    }
    catch(err)
    {
        next(err);
    }
}