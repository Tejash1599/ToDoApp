const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
    new GoogleStrategy(
        {
            clientID : process.env.GOOGLE_CLIENT_ID || '866816832488-dr5irhfe3u074op29r5liue70m6sfe6t.apps.googleusercontent.com',
            clientSecret : process.env.GOOGLE_CLIENT_SECRET || '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',
            callbackURL: "http://localhost:5000/auth/google/callback",
        },
        async function(accessToken,refreshToken,profile,done){
            try {
                let user = await User.findOne({googleId:profile.id});

                if(!user){
                    user = new User({
                        googleId: profile.id,
                        name : profile.displayName,
                        email : profile.emails[0].value,
                        picture: profile.photos[0].value,
                    });
                    await user.save();
                }

                return done(null,user);
            } catch (error) {
                return done(error,null);
            }
        }
    )
);

passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(async function (id,done) {
    try {
        const user = await User.findById(id);
        done(null,user);
    } catch (error) {
        done(error,null);
    }
});

module.exports = passport;