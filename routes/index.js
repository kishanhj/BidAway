const userroutes = require("./user");
const path = require("path");
const bidRoutes = require("../routes/bids");

const constructorMethod = app => {
    app.get("/",(req,res)=>{
        res.render('index',{title:"User Login"})
      })
    app.use("/users", userroutes);
    app.use("/bids",bidRoutes);
    app.use("*", (req,res) => {
        res.sendStatus(404).json({error:"Not Found"});
    });
  };
  
  module.exports = constructorMethod;