const route = require('express').Router();
const user = require('../db/models').user ;// reqiuring the user table
const passport = require('../passport');// rqiured the passport directory

route.get('/',function (req,res) {
   // console.log("verma");
       res.render('login',{admin1:false,login:false});
});

route.post('/', passport.authenticate('local', {
    successRedirect: '/email',
    failureRedirect: '/login',
}));

// facebook
route.get('/facebook', passport.authenticate('facebook', {
    scope : ['public_profile', 'email']
}));
route.get('/facebook/callback',
    passport.authenticate('facebook',
        {
            successRedirect: '/email',
            failureRedirect: '/user/signin',
        }
    )
);
//
// github
route.get('/github', passport.authenticate('github'));

route.get('/github/callback',
    passport.authenticate('github',
        {
            successRedirect: '/email',
            failureRedirect: '/login',
        }
    )
);
function lol (req,res,next) {
    console.log("fuck");
    next();
}
route.get('/twitter', passport.authenticate('twitter', {
    scope : ['public_profile', 'email']
}));

route.get('/twitter/callback',
    passport.authenticate('github',
        {
            successRedirect: '/email',
            failureRedirect: '/login',
        }
    )
);


exportes=module.exports=route;

