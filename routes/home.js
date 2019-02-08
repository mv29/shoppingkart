const route = require('express').Router();
const user = require('../db/models').user ;// reqiuring the user table
const Admin = require('../db/models').admin ;
// signup
route.get('/',function (req,res) {
    if (!req.user ) { // if user is not logged in
        return res.redirect('/login')
    }else if (req.user.active ==false)
    {
        return res.redirect('/email')
    }
    if (req.user.admin==true) {
        res.render('home', {admin1: true, login: true});
    }
    else{
        res.render('home',{admin1:false,login:true});
    }

});


exportes=module.exports=route;

