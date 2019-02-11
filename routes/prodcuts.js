const route = require('express').Router();
const product =require('../db/models').product;
const categorie =require('../db/models').categorie;
//const {isArray} = require('util'); to be checked
route.get('/',(req,res) => {
  //  console.log(req.user);
    if (!req.user ) {
        return res.redirect('/login')
    }
    else if (req.user.active ==false)
    {
        return res.redirect('email')
    }
    else if (req.user.admin ==false){
        return res.redirect('/profile/user')
    }
    else
    {
        let item = product.findAll(

            {include:[ // this means also add the reqiured data from the categorie table with attributes name and tax
                    {
                        model: categorie,
                        attributes: ['name','tax']
                    }] }
        ).then((item) => {
            if (req.user.admin==true) {
                res.render('product', {admin1: true, login: true ,item: item});
            }
            else{
                res.render('product',{admin1:false,login:true,item: item});
            }
        }).catch((err) => {
            console.log(err);
        })
    }
});


route.post('/',(req,res) => {
      let item= product.create({
            name:req.body.name,
            vendor:req.body.vendor,
            price:req.body.price,
            categorieId:req.body.categorie,
             image:req.body.image,
            // item is model instance
        }).then((item) =>{
            res.redirect('products')
        }).catch((err)=>{
            console.log(err);
        })
    }
);
exportes=module.exports=route;
