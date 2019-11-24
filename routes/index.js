const userroutes = require("./user");
const path = require("path");
const bidRoutes = require("../routes/bids");
const itemRoutes = require("../routes/items");

const constructorMethod = app => {
    app.get("/",(req,res,next)=>{
        if(req.session.isloggedin!==undefined || req.session.isloggedin===true){
            res.redirect("users/userdetails");
        }
        else{
            next();
        }
    })
    app.get("/", (req, res) => {
        res.render('index',{title:"User Login"})
    })
    app.use("/users", userroutes);
    app.use("/bids" ,bidRoutes);
    app.use("/item", itemRoutes);
    app.use("*", (req,res) => {
        res.status(404).json({error:"Not Found"});
    });
  };
  
  module.exports = constructorMethod;
