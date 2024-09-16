const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const flash = require('connect-flash');
const app = express();

require('dotenv').config();

const index = require('./routes/index');
const ownerRouter = require('./routes/ownerRouter');
const products = require('./routes/products');
const user = require('./routes/user');
const dbConnect = require('./config/dataBase');
const productModel = require('./models/product-model');
const isLoggedIn = require('./middleware/isLoggedIn');

dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    expressSession({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: process.env.NODE_ENV === 'production' } 
    })
);
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
    res.redirect('/user');
});

app.use('/index', index);
app.use('/owner', ownerRouter);
app.use('/product', products);
app.use('/user', user);

const PORT = process.env.PORT || 3001;
app.listen(3000, () => {
    console.log(`Server running on PORT NO. ${PORT}`);
});
