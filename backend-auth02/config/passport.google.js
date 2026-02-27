import passport from "passport";
import { Strategy as GoogleStrategy  } from "passport-google-oauth20";
 


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
     
}, function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    done(null, profile);
}
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
     

