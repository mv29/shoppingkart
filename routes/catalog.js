const route = require('express').Router();
const categorie =require('../db/models').categorie;
const product =require('../db/models').product;
const user =require('../db/models').user;
const cartitem =require('../db/models').cartItem;



let cart =[ ]; // to make this into hashmap



route.get('/',(req,res) =>{


   if (!req.user ) { // if user is not logged in
       return res.redirect('/login')
    }
    else if (req.user.active ===false)
   {
       return res.redirect('/email')
   }
   else {


       let mv = product.findAll(
           {include:[
                   {
                       model: categorie,
                       attributes: ['name','tax']
                   }] }
       ).
       then((mv) => {

           if (cart.length===0) {
               for (i = 0; i < mv.length; i++) {
                   cart.push({
                       // hashing my products in an array for not retriving it again and again rom my database
                       name: mv[i].name,
                       vendor: mv[i].vendor,
                       tax: mv[i].categorie.tax,
                       price: mv[i].price,
                       productId: mv[i].id,
                       quantity: 0,
                   })
               }
           }
           console.log("******************************************************************")
           console.log(mv)
           if (req.user.admin===true)
           {
               res.render('catalog', {admin1: true, login: true,item: mv});
           }
           else {
               res.render('catalog',{admin1:false,login:true,item: mv});
           }
       }).catch((err) =>
       {
           res.status(500).json({message: err.message})
       });
   }
});



route.get('/senddata',(req,res)=>{
    res.send(cart);
});



route.get('/adddata',(req, res) => {

    // for adding and then sending the array

    for (let i = 0; i < cart.length; i++)
    {

      if(cart[i].productId===req.query.x)
          cart[i].quantity++;

    }

    res.redirect('/catalog/senddata');
});


exports=module.exports=route;

module.exports.cart=cart;