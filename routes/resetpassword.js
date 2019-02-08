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


route.get('/username',function (req,res) {

    res.render('resetpassword2');
});
route.get('/password',function (req,res) {
    if((req.protocol+"://"+req.get('host'))==("http://"+host)) {
        for (i=0;i<rand.length;i++)
        {
            if (rand[i]==req.query.id)
            {

                if (req.user.admin==true) {
                    res.render('resetpassword', {admin1: true, login: true});
                }
                else{
                    res.render('resetpassword',{admin1:false,login:true});
                }

            }
        }
            rand.splice(i-1, 1);
    }
});
route.post('/password',function (req,res) {

    user.findOne({
        where:{
            name:client
        }
    }).then((user)=> {
        console.log(user);
        user.updateAttributes({
            password:req.body.Password
        }).then((user) => {
            console.log("value update date doneg");
        }).catch((err) => {
            console.log("update " + err);
        })
    }).catch((err) => {
        console.log(err)
    });
    res.redirect('/profile/user');
});

exportes=module.exports=route;

