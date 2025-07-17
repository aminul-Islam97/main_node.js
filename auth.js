const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Person = require('./models/Person');

passport.use(
  new LocalStrategy(
    { usernameField: 'username', passwordField: 'password' }, // explicit fields
    async (username, password, done) => {
      try {
        // Find the user by username
        const user = await Person.findOne({ username });
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        // Compare password (assuming comparePassword is defined on Person schema)
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Session serialization (if using sessions)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Person.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;

//const localAuthMiddleware = passport.authenticate('local',{session:false});