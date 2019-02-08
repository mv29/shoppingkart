const route = require('express').Router();
const categorie =require('../db/models').categorie;

let data;
route.get('/',(req,res) =>
    {
        if (!req.user ) {
            console.log("mrinal");
            return res.redirect('/login')
        }
        else if (req.user.active ==false)
        {
            return res.redirect('/email')
        }
        else if(req.user.admin ==false){
            return res.redirect('/profile/user')
        }
        else
        {
            let mv =categorie.findAll().then((mv) =>
            {
                if (req.user.admin==true) {
                    res.render('categories', {admin1: true, login: true ,categories:mv});
                }
                else{
                    res.render('categories',{admin1:false,login:true,categories:mv});
                }

            })
        }
        }
);
route.post('/',(req,res) => {

    let mv=categorie.create({
        name:req.body.name,
        tax:req.body.tax,
    }).then((mv) =>{
            res.redirect('categories')
        }).catch((err)=>{
            console.log(err);
    })
    }
);
exportes=module.exports=route;
