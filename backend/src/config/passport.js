const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.API_BASE_URL}/api/v1/auth/google/callback`,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ "oauth.googleId": profile.id });

          if (!user) {
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              user.oauth.googleId = profile.id;
              await user.save();
            } else {
              user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                "oauth.googleId": profile.id,
                isEmailVerified: true,
              });
            }
          }

          const tokenPayload = { id: user._id, email: user.email };
          user.accessToken = generateAccessToken(tokenPayload);
          user.refreshToken = generateRefreshToken(tokenPayload);
          await user.save();

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

module.exports = passport;