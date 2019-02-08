const route = require('express').Router();
const user = require('../db/models').user ;// reqiuring the user table
const Admin = require('../db/models').admin ;
// signup
route.get('/',function (req,res) {

      res.render('signup',{admin1:false,login:false});

});

route.post('/', (req, res) => {
    let x=  req.body.email.split(' ')[1];
  // retriving the secret from the database
     Admin.findAll()
         .then((Admin) => {
             console.log("fuck you asynch nature");
             console.log(Admin[0].secret);
             if (x==Admin[0].secret) { // admin login
                 user.create({
                     name: req.body.email, // req.body.email provides the username
                     password: req.body.password,
                     active: false,
                     admin:true,
                 }).then((user) => {
                     res.redirect('/login')
                 }).catch((err)=>{
                     console.log(err);
                 })
             }
             else
             {
                 user.create({
                     name: req.body.email, // req.body.email provides the username
                     password: req.body.password,
                     active: false,
                     admin:false,
                 }).then((user) => {
                     res.redirect('/login')
                 })
             }
         }).catch((err) => {
             console.log(err);
     });
});


exportes=module.exports=route;

