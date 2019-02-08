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

let mailOptions,host,link,user_email;
let tokens=[];

route.get('/send',function(req,res){
    let token=Math.floor((Math.random() * 100) + 54);
    tokens.push(token)
    host=req.get('host');
    link="http://"+req.get('host')+"/email/verify?id="+token;
    user_email=req.query.x;
    mailOptions={
        from:emailid,
        to : req.query.x,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
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
});

route.get('/verify',function(req,res){
 //   console.log("request for verification came");
    console.log(req.protocol+":/"+req.get('host'));
    if((req.protocol+"://"+req.get('host'))==("http://"+host)) {

        console.log("Domain is matched. Information is from Authentic email");

        for (i = 0; i < tokens.length; i++) {
            if (tokens[i] == req.query.id)
            {
                // if the random id given matches
                console.log("email is verified");
                // updating user email and active to true
                user.findOne({
                        where:{
                            name:req.user.name
                        }
                    }
                )
                    .then((user) => {

                        user.updateAttributes(
                            {
                                email:user_email ,
                                active:true
                            }
                        ).then((user) => {
                            console.log("value update date done");
                            res.redirect('/profile/user');
                        }).catch((err) => {
                            console.log("update " + err);
                            res.redirect('/email');
                        })

                    }).catch((err) => {
                    console.log(err);
                });
                break;
            }
            else
            {
                // if the random id given does not matches
                console.log("email is not verified");
                res.end("<h1>Bad Request</h1>");
                break;
            }
        }
        tokens.splice(i - 1, 1);
    }
    else
    {
        // if host or protocol does not match
        res.end("<h1>Request is from unknown source");
    }
});
// signup
route.get('/',function (req,res) {

    if (!req.user)
        return res.redirect('/login');
    if (req.user.active ==true)
    {
        return res.redirect('/profile/user')
    }
    if (req.user.admin==true) {
        res.render('email', {admin1: true, login: true});
    }
    else{
        res.render('email',{admin1:false,login:true});
    }

});

exportes=module.exports=route;

