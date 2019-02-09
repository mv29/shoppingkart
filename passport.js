const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./db/models').user;
const FacebookStrategy =require('passport-facebook').Strategy;
const GitHub =require('passport-github').Strategy;
const Twitter =require('passport-twitter').Strategy;

passport.serializeUser((user, done) => {
    return done(null, user.id)
});

passport.deserializeUser((userId, done) => {
    User.find({
        where: {
            id: userId
        }
    }).then(user => done(null, user))
        .catch((err) => console.log(err))
});
const localStrategy = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function(username, password, done) {
         User.findOne({ // searching int the user table for an object with name username
            where: {
                name: username
            }
        }).then((user) => {
          //  console.log(user);
            if (!user) {
                //Wrong username
                console.log("fuck loda");
                return done(null, false, {message: 'Wrong username'})
            }
            if (user.password === password) {
                // Correct user and password
                console.log("two");
                return done(null, user)
            } else {
                // Correct username, wrong password
                console.log("three");
                return done(null, false, {message: 'Wrong password'})
            }
        }).catch((err) => {
             console.log("four");
            console.log(err);
            return done(err)
        })
    }
    );
const github = new GitHub({

        clientID        : 'XYZ',
        clientSecret    : 'XYZ',
        callbackURL     : "http://localhost:3229/login/github/callback",
    },
    function(token, refreshToken, profile, done) {

        //console.log(profile);
        process.nextTick(function() {
            User.findOne({
                where: {
                    name: profile.username
                }
            }).then((user) => {
                // user is the object returned by the findone function User id is the table {always the name of returned object and the table name should be different}
                // if the user is found, then log them in
                console.log(user);
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    User.create({
                        name: profile.username
                    }).then((user) => {
                        return done(null, user); // user created
                    }).catch((err) => {
                        return done(err)
                    });
                }
            }).catch((err) => {
                return done(err)
            })
        });
    });

const twitter = new Twitter({

        consumerKey        : 'XYZ',
        consumerSecret    : 'XYZ',
        callbackURL     : "http://localhost:3229/login/twitter/callback",
    },
    function(token, refreshToken, profile, done) {

        console.log(profile);
        process.nextTick(function() {
            user.findOne({
                where: {
                    name: profile.username
                }
            }).then((user) => {
                // user is the object returned by the findone function User id is the table {always the name of returned object and the table name should be different}
                // if the user is found, then log them in
                console.log(user);
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    User.create({
                        name: profile.username
                    }).then((user) => {
                        return done(null, user); // user created
                    }).catch((err) => {
                        return done(err)
                    });
                }
            }).catch((err) => {
                return done(err)
            })
        });
    });


const facebook= new FacebookStrategy({

        clientID        : 'XYZ',
        clientSecret    : 'XYZ',
        callbackURL     : "http://localhost:3229/login/facebook/callback",
        profileFields: ['id', 'displayName', 'email', 'birthday', 'friends', 'first_name', 'last_name', 'middle_name', 'gender', 'link']
    },
    function(token, refreshToken, profile, done) {

     console.log(profile);
        process.nextTick(function() {
            user.findOne({
                where: {
                    name: profile.displayName
                }
            }).then((user) => {
                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    User.create({
                        name:profile.displayName
                    }).then((user) => {
                        return done(null, user); // user created
                    }).catch((err) => {
                        return done(err)
                    })
                }
            }).catch((err) => {
                return done(err)
            })
        });
    });
passport.use(localStrategy);
passport.use(github);
passport.use(facebook);
passport.use(twitter);
exports = module.exports = passport;
