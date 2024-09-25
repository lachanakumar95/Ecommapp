const customError = require('../../utils/customError');
const authModel = require('./authModel');
const jwtUtils = require('../../utils/jwt');

exports.createUser = async (req, res, next)=>{
    try
    {
        const {username, password, email, phone_number} = req.body;
        if(!username || !password || !email || !phone_number) throw customError.BadRequest("All fileds are required");
        
        const emailCheck = await authModel.checkEmail(email);
        if(emailCheck.length > 0)
        {
            throw customError.Unauthorized("Email address already in use.");
        }
    
        const checkPhoneNumber = await authModel.checkPhoneNumber(phone_number);
        if(checkPhoneNumber.length > 0)
        {
            throw customError.Unauthorized("Phone Number already in use.");
        }

        const createUser = await authModel.createUser(req.body);
        res.status(201).json({success : true, data : {...req.body}, message : "Record insert successfully"});
    }
    catch(err)
    {
        next(err);
    }
}



exports.forgetPassword = async (req, res, next)=>{
        try
        {
            const {email, password} = req.body;

            if(!email) throw customError.BadRequest("Email filed required");
            if(!password) throw customError.BadRequest("Password filed required");

            const checkMail = await authModel.checkEmail(email);

            if(checkMail.length > 0)
            {
                const result = await authModel.changePassword(req.body);
                if(result.affectedRows > 0)
                {
                    res.status(201).json({ success : true, message: 'Password Update Successfully' });
                }
                else
                {
                    throw customError.Unauthorized("Password not update");
                }

            }
            else
            {
                throw customError.Unauthorized("No record found");
            }
        }
        catch(err)
        {
            next(err);
        }
}

exports.login = async (req, res, next)=>{
    try
    {
        const {email, password} = req.body;

        if(!email) throw customError.BadRequest("Email filed required");
        if(!password) throw customError.BadRequest("Password filed required");
        const loginRecord = await authModel.login(req.body);

        if(loginRecord)
        {
            const user = {id: loginRecord.id, email : loginRecord.email, role_id : loginRecord.role_id};
            const accessToken = jwtUtils.generateAccessToken(user);
            const refreshToken = jwtUtils.generateRefreshToken(user);

            await authModel.storeToken(loginRecord.id, refreshToken); // new token store by different user

            res.status(200).json({ accessToken, refreshToken });
        }
        else
        {
            throw customError.BadRequest("Invalid credentials");
        }
    }
    catch(err)
    {
        next(err);
    }
}

exports.refreshToken = async (req, res, next)=>{
    try
    {
        const {refreshToken} = req.body;
        if(!refreshToken) throw customError.BadRequest("No token provided");
   
        const decoded = jwtUtils.verifyToken(refreshToken);
        const storetokenUser = {id: decoded.id, email: decoded.email, role_id : decoded.role_id}

        const user = await authModel.getToken(decoded.id);

        if (user[0].refresh_token !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        //const newAccessToken = jwtUtils.generateAccessToken(storetokenUser);
        const newRefreshToken = jwtUtils.generateRefreshToken(storetokenUser);
        
        await authModel.storeToken(user.user_id, newRefreshToken); // new token store by different user
        res.status(200).json({ accessToken: newRefreshToken });


    }
    catch(err)
    {
        next(err);
    }
}