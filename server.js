const express = require('express');
const hbs = require('express-hbs');
const path = require('path');
const session = require('express-session');
const passport = require('./passport');
const app =express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'lsdgdkhfbdkgbdk',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// routes

app.use('/categories', require('./routes/categories'));
app.use('/products', require('./routes/prodcuts'));
app.use('/cart', require('./routes/cart'));
app.use('/catalog', require('./routes/catalog'));
app.use('/login', require('./routes/login'));
app.use('/signup', require('./routes/signup'));
app.use('/profile', require('./routes/profile'));
app.use('/email', require('./routes/email'));
app.use('/admin', require('./routes/admin'));
app.use('/resetpassword', require('./routes/resetpassword'));
app.use('/home', require('./routes/home'));
app.use('/address', require('./routes/address'));

app.get('/logout', (req, res) => {
    req.user = null;
    req.logOut();
    req.session.destroy((err) => {
        res.redirect('/login')
    })
});

// hbs
app.set('view engine', 'hbs');
app.engine('hbs', hbs.express4({
    defaultLayout: path.join(__dirname, 'views/layout.hbs'),
    //partialsDir: path.join(__dirname, 'views/partials'),
    layoutsDir: path.join(__dirname, 'views/layouts')
}));


// other stuff
app.set('views', path.join(__dirname, 'views/pages'))
app.use('/', express.static(__dirname + '/public')); // app.use returns a function
app.listen('3229',()=> {  // inline arrow function
     console.log("server running on https://localhost:3229");
});
