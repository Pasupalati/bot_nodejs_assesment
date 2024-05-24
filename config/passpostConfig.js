const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { getDb } = require('./dbConfig');
const { ObjectId } = require('mongodb');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new Strategy(opts, async (jwt_payload, done) => {
    try {
        const db = getDb();
        const user = await db.collection('users').findOne({ _id: new ObjectId(jwt_payload.id) });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));
