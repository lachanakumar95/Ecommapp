require('dotenv').config(); // required of dotenv package
require('./config/database');// required database connection

const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//List of Router Required
const routerAuth = require('./api/auth/authRouter');
const routerCategory = require('./api/category/categoryRouter');
const routerProduct = require('./api/products/productRouter');
const routerCart = require('./api/cart/cartRouter');

app.use('/api', routerAuth);
app.use('/api', routerCategory);
app.use('/api', routerProduct);
app.use('/api', routerCart);



// Catch-all 404 handler
const customError  = require('./utils/customError');
app.use((req, res, next) => {
    next(customError.NotFound('The requested resource could not be found'));
});




//List of Middleware for required
const errorHandlerMiddleware = require('./middleware/errorHandler');
app.use(errorHandlerMiddleware);

//PORT number for Server Connect
const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log("Server Connected on "+ PORT);
});