const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const morgan = require("morgan");
const http = require("http");
const https = require("https");
const path = require("path");
const axios = require("axios");
const unirest = require("unirest");


const msg_fordisp = null;
const obj = {};
const reqcust = {};
const object = {
    name:"hello"
}
const temp = {};
const errors = [];


app.use(bodyParser.urlencoded({extended:true}));

// express 4
app.set('views', path.join(__dirname, 'views'))


app.use(express.static("public"));

app.use(session(
    {
        name:"sid",
        resave:false,
        saveUninitialized:false,
        secret:"realmadrid",
        cookie:{
            maxAge: 1000*60*60 ,
            sameSite: true,
        }
    }
    ))
    
    app.set("view engine","ejs");
    
    
    
    
    //////////
    /// multer///
    ////
    var storage  = multer.diskStorage({
        destination: "./public/uploads",
        filename: function(req,file,cb){
            cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname));
        }
    });
    var upload = multer({
        storage:storage
    });
    //////////////////
    //////////////////
    /////////////////
    
    mongoose.connect("mongodb://localhost/Newapp2", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const productSchema = new mongoose.Schema(
    {
        name : String,
        description : String,
        quantity : Number,
        available : Boolean,
        image:String,
        companyName :String
    }
    );
    const userSchema = new mongoose.Schema({
        userName:String,
        email : String,
        password: String,
    });
    const categorySchema = new mongoose.Schema({
        name:String,
        number:Number
    });
    const authStrategySchema = new mongoose.Schema({
        email:String,
        userName:String,
        password:String,
        city:String,
        province:String
    });
    
    
    const Category = mongoose.model("Category",categorySchema);
    const Product = mongoose.model("Product",productSchema);
    const User = mongoose.model("User",userSchema);
    const authStrategy = mongoose.model("authStratgy",authStrategySchema);
    
    
    ////////////////
    ///////////////
    //////////////
    
    
    app.get("/",function(req,res){
        //"https://swapi.co/api/people/"
        
        
        // axios.get("https://swapi.co/api/people/")
        // .then((response)=>{
        //     console.log(response);
        //     console.log("fetch made it");
        // }).catch((err)=>{
        //     console.log(err);
        // });
        
        
        
        res.render("home");
    })
    app.get("/admin",function(req,res){
        res.render("admin",{
            msg:msg_fordisp
        });
        
    });
    
    
    // app.get("/admin",function(req,res){
    //     res.render("admin",{
    //         msg:msg_fordisp
    //     });
    // });
    
    app.get("/signup",function(req,res){
        res.render("signup");
    });

    app.get("/login",function(req,res){
        res.render("login");
    });


    app.get("/addproduct",function(req,res){
        res.render("addproduct");
    })
    app.get ("/about",(req,res)=>{
        res.render("about");
    });
    app.get("/admin_viewProducts",function(req,res){
        Product.find({},function(err,obj){
            if(err){
                console.log("error in finding tours" + err);
            }
            else{
                console.log("tour find successful");
                console.log(obj);
                
                res.render( "admin_disp_products",{
                    obj : obj,
                    obj_length : obj.length
                });
                
                
                
                
            }
        });
    });
    app.post('/addproduct', upload.single('prodDetail[image]'), function (req, res, next) {
        // req.file is the `avatar` file
        // req.body will hold the text fields, if there were any
        reqcust = JSON.stringify(req.body, null, 2);
        obj = JSON.parse(reqcust);
        console.log(typeof obj);
        console.log(typeof object);
        console.log(req.file);
        
        if(obj.prodDetail)
        {
            msg_fordisp = "Product Added successfully..!!";
            Product.create({
                name: obj.prodDetail.prodName,
                description : obj.prodDetail.desc,
                quantity : parseInt(obj.prodDetail.Quantity),
                available : true,
                image : "uploads/" + req.file.filename,
                companyName : obj.prodDetail.compName
            },function(err,obj){
                if(err){
                    console.log("Error in saving object" + err);
                }
                else{
                    console.log(obj);
                }
            });
        }
        else{
            msg_fordisp = "Error in adding product";
        }
        res.render("admin",{
            msg:msg_fordisp
        });
    });
    
    app.post('/signup',(req,res)=>{
        const entity = req.body.signup;
        //console.log(req.body.login);
        if(!entity.email || !entity.userName ||!entity.password ||!entity.password2 ||!entity.city )
        {
            msg_fordisp = "From incomplete";
            errors.push(msg_fordisp);
        }
        
        
        if(entity.password !== entity.password2){
            msg_fordisp = "From incomplete";
            errors.push(msg_fordisp);
            if(entity.password.length && entity.password2.length < 6){
                msg_fordisp = "too short password";
                errors.push(msg_fordisp);
            }
        }
        
        authStrategy.create({
            email:String,
            userName:String,
            password:String,
            city:String,
            province:String
        });
        
    })
    app.post("/uploads",function(req,res){
    });
    
    ///////////////
    ///////////////
    //////////////
    app.listen(8000,function(){
        console.log("server started at port 3000");
    })