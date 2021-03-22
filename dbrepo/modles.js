var mongoose = require('mongoose');



// let dbURI = "mongodb+srv://ahmerali:ahmerali@cluster0.slkv6.mongodb.net/ahmerali"
let dbURI = process.env.MONGOOSE_DBURI
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })

///////////************** Mongodb connected or disconnected Events ***********/////////////

mongoose.connection.on('connected', function () {
    console.log("Mongoose is connected")

})

mongoose.connection.on('disconnectes', function () {
    console.log("mongoose is disconnected")
    process.exit(1)
})


mongoose.connection.on('error', function (err) {
    console.log('mongoose connecion is in error: ', err)
    process.exit(1)

})

mongoose.connection.on('SIGNIT', function () {
    console.log('app is turminating')
    mongoose.connection.close(function () {
        console.log('mongoose default connection is closed')
        process(0)
    })


})


///////////************** Mongodb connected or disconnected Events ***********/////////////


var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    role: {type: String , "default": "user"},
    createdOn: { type: Date, 'default': Date.now },
    activeSince: Date

})

var userModle = mongoose.model("sweetShopUser", userSchema)
var otpSchema = new mongoose.Schema({
    "email": String,
    "otpCode": String,
    "createdOn": { "type": Date, "default": Date.now },
});
var otpModel = mongoose.model("otps", otpSchema);
var shopCart = new mongoose.Schema({
    "title": String,
    "price": String,
    "availability": String,
    "description": String,
    "cartimage": String,
    "createdOn": { "type": Date, "default": Date.now },
});
var shopCartModel = mongoose.model("shopCart", shopCart);
var sweetOrders = new mongoose.Schema({
    "name": String,
    "email": String,
    "phone": String,
    "address": String,
    "total": String,
    "status" : {"type": String, "default" : "Your Order in Review" },
    "orders": Array,
    "createdOn": { "type": Date, "default": Date.now },
});
var sweetOrdersModel = mongoose.model("orders", sweetOrders);

module.exports = {
    userModle: userModle,
    otpModel: otpModel,
    shopCartModel : shopCartModel,
    sweetOrdersModel: sweetOrdersModel,
}