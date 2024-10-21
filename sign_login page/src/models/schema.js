const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/first-try")
    .then(()=> console.log("database connection established"))
    .catch((err)=> console.log(err));

const userschema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    age:Number
});

const user = mongoose.model("user", userschema);

module.exports = user;