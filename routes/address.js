const route = require('express').Router();
const nodemailer= require('nodemailer');
const user = require('../db/models').user ;// reqiuring the user table
const config= require('../../config.json');
const emailid =config.email.emailid;
const password =config.email.password;

// allowing access to less secure apps should be on in the Gmail account for sending the emails otherwise emails will not ne send
// transporter defined
const smtpTransport = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user:emailid,
        pass:password
    }
});

let host,client;
let rand=[];
route.get('/send',function(req,res){
    let token=Math.floor((Math.random() * Math.random()) + Math.random());
    rand.push(Math.floor((Math.random() * Math.random()) + Math.random()));
    host=req.get('host');
    link="http://"+req.get('host')+"/resetpassword/password?id="+token;
    client=req.query.x;
    user.findOne({
        where:{
            name:req.query.x
        }
    }).then((user) => {
        mailOptions={
            from:emailid,
            to : user.email,
            subject : "Please confirm your Email account",
            html : "Hello,<br> Please Click on the link to reset your password.<br><a href="+link+">Click here to verify</a>"
        };
        console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
                res.send("error");
            }else{
                console.log("Message sent: " + response.message);
                res.send("sent");
            }
        });
    })
        .catch((err) => {
            console.log(err);
        })
});


route.get('/',function (req,res) {
    if (!req.user ) { // if user is not logged in
        return res.redirect('/login')
    }else if (req.user.active ==false)
    {
        return res.redirect('/email')
    }
    if (req.user.admin==true) {
        res.render('address', {admin1: true, login: true});
    }
    else{
        res.render('address',{admin1:false,login:true});
    }

});


route.post('/detail',function (req,res) {
    user.findOne({
             where:{
                 name:req.user.name,
             }
         }).then((user)=>{
             console.log("user foumd and updatting attributes");
             user.updateAttributes({
                 address:req.body.address,
                 pincode:req.body.pincode,
                 state:req.body.state,
             }).then((user) =>{
                 console.log("updates done");
                 let link= "http://localhost:3210/cart/add";
                 let profilename =req.user.name;
                 mailOptions={
                     from:emailid,
                     to : req.user.email,
                     subject : "Thanks for shopping with us",
                     html : "Hello,<br> Thanks for shopping with us "+profilename+".<br><a href="+link+">profile link</a><br>Payment done securely"
                 };
                 console.log(mailOptions);
                 smtpTransport.sendMail(mailOptions, function(error, response){
                     if(error){
                         console.log(error);
                         res.send("error");
                     }else{
                         console.log("Message sent: " + response.message);
                         res.send("sent");
                     }
                 });
             }).catch((err) => {
                 console.log(err);
             })
         }).catch((err) => {
             console.log(err);
         })
    res.redirect('/profile/bought');
});

exportes=module.exports=route;

