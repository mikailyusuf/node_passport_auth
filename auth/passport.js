const passport = require('passport');
const passportJwt = require('passport-jwt');
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;

const db = require('../model')
const User  = db.User;


passport.use(new StrategyJwt({
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:process.env.JWT_SECRET},
    (jwtPayload,done)=>{
        return User.findOne({where:{id:jwtPayload.id}})
        .then((user)=>{
            console.log(`"User phone == ${user.username}`)
            return done(null,user);
        })
        .catch((err)=>{
            console.log(`Error that occured == ${err}`)
            return (done(err));
        })
    }
));
