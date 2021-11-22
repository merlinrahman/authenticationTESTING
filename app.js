//jshint esversion:6
require('dotenv').config()
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const port = process.env.PORT || 3000 
const mongoose = require("mongoose")  
const encrypt = require("mongoose-encryption")

const app = express()
app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))


//-------------------mongoose connection---------------------------
mongoose.connect("mongodb://localhost:27017/UserDB",{useNewUrlParser:true})

//----------------mongoose schema---------------------------
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
})

// ----------creating a secrete key--------------
// const secret = "Thisisourlittlesecretinthedevelopmentprocess"
// using the secret to encrypt our database
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]})





//----------------mongoose model----------------------------
const User = new mongoose.model("User",userSchema)

// -------------------home route-----------------------
app.get("/", (req,res) =>{
    res.render("home")
})

//------------------login route------------------------
app.get("/login", (req,res) =>{
    res.render("login")
})

app.get("/register", (req,res) =>{
    res.render("register")
})








// ---------------post method for the register route----------------------
app.post("/register", (req,res) =>{
    // -------------create a new user document------------------------
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save((err) =>{
        if(err){
            console.log(err)
        }else{
            res.render("secrets")
        }
    })
})


// ----------------post method for the login route---------------------
app.post("/login", (req,res) =>{
    const username = req.body.username
    const password = req.body.password
    User.findOne({email: username}, (err, foundUser) =>{
        if(err){
            console.log(err)
        }else if(foundUser){
            if(foundUser.password === password){
                res.render("secrets")
            }else{
                console.log("incorrect username or password");
            }
        }
    })
})


















app.listen(port,() =>{
    console.log("Server is running on port " + port)
})

