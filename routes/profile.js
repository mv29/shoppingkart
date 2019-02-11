const route = require('express').Router();
const product =require('../db/models').product;
const categorie =require('../db/models').categorie;
const cartitem =require('../db/models').cartItem;
const user =require('../db/models').user;
//const {isArray} = require('util'); to be checked


let mv=require('./catalog').cart;

// only for wish list adding handling the wishlist button on cart page
route.get('/wishlist',(req,res) => {
    if (!req.user) {
        return res.redirect('/login')
    }
    else if (req.user.active ==false)
    {
        return res.redirect('/email')
    }
    else
    {
        // mv array all the prodcuts are added to wishlist
         for (i = 0; i < mv.length; i++) {
             let lol=mv[i].quantity;
             if(lol<1)
                 continue;
             console.log(mv[i].name);
             // there can be a product all ready present in the wishlist which is present in the cart so updating the quantity of that product
                cartitem.findCreateFind({
                 where: {
                     productId: mv[i].productId,
                     userId: req.user.id,
                     state:true
                 },
                 defaults: {
                     productId: mv[i].productId,
                     quantity: mv[i].quantity,
                     userId: req.user.id,
                     state: true,
                 }
             }).spread((user, created) => {
                    if(!created)
                    {
                        user.updateAttributes(
                            {
                                quantity: lol,
                            }
                        ).then((user) => {
                            console.log("value update date done");
                        }).catch((err) => {
                            console.log("update " + err);
                        })
                    }
             })
                 .catch((err) => {
                     console.log("createfindcreate "+ err);
                 })
         }
     }
        mv.splice(0,mv.length);
        res.redirect('/profile/user');
});

// for adding items in cartitems as bought handling the payment button on cart page
route.get('/bought',(req,res) => {
    if (!req.user ) {
        return res.redirect('/login')
    }
    else if (req.user.active ==false)
    {
        return res.redirect('/email')
    }
    else
    {
        for (i = 0; i < mv.length; i++) {
            let lol=mv[i].quantity;
            if(lol<1)
                continue;
            let item=cartitem.create({
                productId: mv[i].productId,
                quantity: mv[i].quantity,
                userId: req.user.id,
                state: false,
            }).then( item => {
            })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
    mv.splice(0,mv.length);
    console.log("items add to as bought in cartitems");
    res.redirect('/profile/user');
});


// route for rendering the cartitems
route.get('/user',(req,res) => { // retriving information form the database
    if (!req.user ) {
        return res.redirect('/login')
    }
    else if (req.user.active ==false)
    {
        return res.redirect('/email')
    }
    else
    {
        let mv = cartitem.findAll(
            {
                where:{
                    userId:req.user.id
                },
              include:[
              {
                model: product,
                  attributes: ['name','vendor','price','id'],
                  include:[
                      {
                        model :categorie,
                          attributes: ['name','tax'],
                      }
                  ]

              }]
            }
        ).then(mv => {
            if (req.user.admin===true) {
                res.render('profile', {admin1: true, login: true,item: mv});
            }
            else{
                res.render('profile',{admin1:false,login:true,item: mv});
            }
   }).catch((err) => {
            console.log(err);
        })
    }


});
exportes=module.exports=route;
