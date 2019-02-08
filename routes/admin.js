const route = require('express').Router();
const user = require('../db/models').user ;// reqiuring the user table
const Admin = require('../db/models').admin ;// reqiuring the user table

// signup
route.get('/',function (req,res) {
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
    if (req.user.admin==true) {
        res.render('admin', {admin1: true, login: true});
    }
    else{
        res.render('admin',{admin1:false,login:true});
    }

});

route.post('/secret', (req, res) => {
    console.log("secret change post request arrived");
    Admin.findOne({
        // checking for authenticated admin
        where: {
            secret: req.body.Previous_Secret,
            password: req.body.Password
        }
    }).then((admin) => {
        console.log(admin);
        console.log("fuck");
        // updating the attribute code (Secret Update)
        admin.updateAttributes(
            {
                secret:req.body.New_Secret ,
            }
        ).then((admin) => {
            console.log("admin updated");
        }).catch((err) => {
            console.log("update " + err);
        });
        // updating the attribute code ends
        //*********************\\
        // finding all admins and deleting all the admins even the req.user one
        user.destroy(
            {
                where: {admin: true},
            }
        ).then((user) => {
            console.log("all admins deleted");
            console.log(user);
        }).catch((err) => {
            console.log(err);
        });
        // deleting code ends
        res.redirect('/admin')
    }).catch((err) => {
        console.log(err);
    });
})


route.post('/password', (req, res) => {
    console.log("secret change post request arrived");
    Admin.findOne({
        // checking for authenticated admin
        where: {
            secret: req.body.Previous_Secret,
            password: req.body.Password
        }
    }).then((admin) => {
        console.log(admin);
        console.log("fuck");
        // updating the attribute code (password update)
        admin.updateAttributes(
            {
                password:req.body.New_Password ,
            }
        ).then((admin) => {
            console.log("password updated");
        }).catch((err) => {
            console.log("update " + err);
        });
        // updating the attribute code ends
        res.redirect('/admin')
    }).catch((err) => {
        console.log(err);
    });

});

exportes=module.exports=route;

