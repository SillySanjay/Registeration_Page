const express = require('express');
const app = express();

const usermodel= require("./src/models/schema");

const jwt = require("jsonwebtoken");
const cookieparser = require('cookie-parser');
const bcrypt = require("bcrypt");

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieparser());

app.get('/',(req,resp)=>{
    resp.render("index");
});
app.post('/create', (req,resp)=>{
    let{username,email,password,age} = req.body;
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt, async(err,hash)=>{
            let createduser = await usermodel.create({
                username,
                email,
                password:hash,
                age
            })
            let token = jwt.sign({email},"sanjubaba");
            resp.cookie("token",token);
            resp.status(200).send(createduser);

        })
    })

});

app.get('/login',(req,resp)=>{
    resp.render("login");
})

app.post("/login", async(req,resp)=>{
    const user = await usermodel.findOne({email:req.body.email});
    if(!user) return resp.send("something went wrong");
    // console.log(user);

    bcrypt.compare(req.body.password, user.password,(err,result)=>{
        console.log(result);
        if(result){
            let token = jwt.sign({email:user.email},"sanjubaba");
            resp.cookie("token",token);
            resp.send("yes you can login");
        }    
        else resp.send("something went wrong");
    })
})

app.get('/logout',(req,resp)=>{
    resp.cookie("token","");
})

app.listen(3000);