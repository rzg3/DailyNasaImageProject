const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
    clientID: "58915137153-hk0sv694s7erml8d5gcb0b0taornk8s4.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://daily-nasa-image-project.vercel.app/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
    done(null,user);
});

passport.deserializeUser(function(user, done) {
    done(null,user);
});