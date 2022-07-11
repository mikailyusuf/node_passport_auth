require('dotenv').config()
const {Sequelize, DataTypes}  = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB,
    process.env.USER_NAME,
    process.env.PASSWORD,
    {
        host:process.env.HOST,
        dialect:process.env.DIALECT,
        operatorAliases:false,

        pool:{
            max:Number(process.env.MAX_POOL),
            min:Number(2),
            acquire:Number(process.env.ACQUIRE),
            idle:Number(process.env.IDLE)
        }
    }
)

sequelize
.authenticate()
.then(()=> {
    console.log("Connection has been established successfully ");
})
.catch(err=> {
    console.log("Unable to connect to database", err)
})

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize

db.User = require('./userModel.js')(sequelize,DataTypes);
db.sequelize.sync({force:false}).then(()=>{
    console.log('Sync Success');
})

module.exports = db