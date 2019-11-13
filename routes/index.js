const userroutes = require("./user");
const path = require("path");


const constructorMethod = app => {
    app.get("/",(req,res)=>{
        res.render('index',{title:"User Login"})
    
      })
    app.use("/users", userroutes);



  
    app.use("*", (req, res) => {
      res.sendStatus(404);
    });
  };
  
  module.exports = constructorMethod;