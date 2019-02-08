const route = require('express').Router();
const categorie =require('../db/models').categorie;
const product =require('../db/models').product;
const cartitem =require('../db/models').cartItem;
const user =require('../db/models').user;
let data;

// cart is not getting rendered but is getting displayed statically
let mv=require('./catalog').cart;
route.get('/add',(req,res) => { // rendering the cart  page not making the xhr request
    if (!req.user ) { // if user is not logged in
        return res.redirect('/login')
    }else if (req.user.active ==false)
    {
        return res.redirect('/email')
    }
    if (req.user.admin==true) {
        res.render('cart', {admin1: true, login: true});
    }
    else{
        res.render('cart',{admin1:false,login:true});
    }

});
route.get('/senddata',(req,res) => { // sending the cart items array from ajax request for dynamic changes
    res.send(mv);
});
route.get('/adddata',(req, res) => {
    // for adding and then sending the array
    // retriving data from the database changing the cart array at the server which is mv
    let item = cartitem.findOne( // finding the item which is being added to cart from wishlist
        {
            where:{
                productId:req.query.x,
                userId:req.user.id
            }
        }
    ).then(item => {
        console.log(item.quantity);
        for (i = 0; i < mv.length; i++) {
            if(mv[i].productId==req.query.x)
                mv[i].quantity+=item.quantity; // mv updated
        }
    }).catch((err) => {
        console.log(err);
    });
    let item1 = cartitem.destroy( // finding the item which is being added to cart from wishlist
        {
            where:{
                productId:req.query.x,
                userId:req.user.id,
                state:true,
            }
        }
    ).then(item1 => {
        console.log("item array length " +item1.length);
        console.log(item1);
    }).catch((err) => {
        console.log(err);
    });
    res.send(mv);
});
exportes=module.exports=route;

