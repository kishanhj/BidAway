const express= require("express")
const router = express.Router();
const data = require("../data");
const userData = data.users


router.get("/" ,async function(req,res){
    console.log(req.body._method)
    console.log(req)
    res.status(200).render("newuser",{title:"Create New User"})

})



router.post("/",async function(req,res){
    const userinfo=req.body
    const error=[]
    if(!userinfo){
        error.push("No Data Entered")
    }
    if(!userinfo.username){
        error.push("No User Name Entered")
    }
    if(!userinfo.emailid){
        error.push("No Email ID Entered")
    }
    if(!userinfo.phone_num){
        error.push("No Phone Number Entered")
    }
    if(!userinfo.password){
        error.push("No Password Entered")
    }
    if(!userinfo.DOB){
        error.push("No Date of Birth Entered")
    }
    

    if(error.length>0){
        res.status(400).render('newuser',{title:"Create New User",hasErrors:true,errors:error,userinfo:userinfo})
        return;
    }
    try{
        const newuser= await userData.createuser(userinfo.username,userinfo.emailid,userinfo.password,userinfo.phone_num,userinfo.DOB,userinfo.category)
        date1= new Date(userinfo.DOB)
        
        date2= new Date()
        
        let age = date2.getFullYear() - date1.getFullYear();
        
        if (date2.getMonth() < date1.getMonth() || (date2.getMonth() == date1.getMonth() && date2.getDate() < date1.getDate())) {
            age=age-1;
        }
       
        res.status(200).render('profile',{user: newuser,age:age})
        return;
    }
    catch(e){
        res.status(400).render('newuser',{title:"Create New User",error:e,hasErrors:true,userinfo:userinfo})
        return;
    }
})

router.get("/edituser",async function(req,res){
    if(req.session.isloggedin===true){

        const userdata=await userData.getuser(req.session.userdata)
        console.log(req.session)
        res.render('edituser',{userinfo:userdata,isloggedin:req.session.isloggedin,user:userdata})
    }
    else{
        res.sendStatus(403)
    }
})

router.put("/edituser",async function(req,res){
    
    updateduserinfo1=req.body
    console.log(1)
    console.log(updateduserinfo1)
  
    errors=[]
    const olduserdata= await userData.getuser(req.session.userdata)
    
    
    updateuser={}
    if(!updateduserinfo1){
        res.sendStatus(404)
    }
    if(updateduserinfo1.username){
        updateuser.newUserName=updateduserinfo1.username
    }
    if(updateduserinfo1.emailid){
        updateuser.newEmailId=updateduserinfo1.emailid
    }
    if(updateduserinfo1.phone_num){
        updateuser.newPhoneNum=updateduserinfo1.phone_num
    }
    if(updateduserinfo1.DOB){
        updateuser.newDOB=updateduserinfo1.DOB
    }
    
  
   
    try{
        console.log(updateuser)
        
        const user=await userData.updateuser(req.session.userdata,updateuser)
        
        res.redirect("userdetails")
    }
    catch(e){
        console.log(e)
        console.log(updateduserinfo1)
        errors.push(e)
        res.status(400).render('edituser',{userinfo:updateduserinfo1,isloggedin:req.session.isloggedin,user:olduserdata,errors:errors,hasErrors:true})
    }
    return;
})

router.get("/passwordchange/:id", async function(req,res){
    try{
        const user=await userData.getuser(req.params.id)
        res.status(200).render("passwordchange",{title:"Password Change", userinfo:user})

    }
    catch(e){
        error.push(e)
        res.status(404).json({userinfo:userdata,isloggedin:req.session.isloggedin,user:userdata,errors:e,hasErrors:true})
    }
    
})

router.put("/:id/passwordchange", async function(req,res){
    const passwords=req.body

    if(!passwords){
        res.sendStatus(404)
        return;
    }
    if(passwords.oldpassword===undefined || passwords.newpassword===undefined){
        res.sendStatus(404)
        return;
    }
    try{
        await userData.getuser(req.params.id)
    }
    catch(e){
        res.status(404).json({error:e})
        return;
    }
    try{
        const passwordchange= await userData.changepassword(req.params.id,passwords.oldpassword,passwords.newpassword)
        res.status(200).json(passwordchange)
        return;
    }
    catch(e){
        res.sendStatus(505)
        return;
    }

})

router.get("/userdetails", async function(req,res){
    try{
       console.log(req.session);
        if(req.session.isloggedin==true){
            const user= await userData.getuser(req.session.userdata)
            
            res.status(200).render("profile",{user:user,isloggedin:req.session.isloggedin})
            return;

        }
        else{
            res.status(403).redirect("/")
            return;
        }
        
    }
    catch(e){
        res.sendStatus(500)
        return;
    }
})

router.get("/userlogin",async function(req,res){
    
    res.status(200).render("index")
})

router.post("/userlogin",async function(req,res){
    
    const userdetail=req.body
    console.log(1)
    error=[]
    if(!userdetail.username){
        error.push("no username entered")
        res.status(404).render("index",{hasErrors:true,errors:error})
        return;
    } 
    if(!userdetail.password){
        error.push("no passsword entered")
        res.status(404).render("index",{hasErrors:true,errors:error})
        return;
        
    }
    try{
        
        const userlogin=  await userData.verifyuser(userdetail.username,userdetail.password)
        console.log(userlogin);
        req.session.userdata=userlogin._id
        req.session.isloggedin=true
        const user= await userData.getuser(req.session.userdata)
        res.redirect("/item")
    }
    catch(e){
        error.push(e)
        res.status(401).render("index",{hasErrors:true,errors:error})
        return;
    }
})

router.get("/logout",async function(req,res){
    if(req.session.isloggedin===undefined || req.session.isloggedin===false){
        res.redirect("/item");
        return;
      }
      req.session.isLoggedIn=false
      req.session.destroy();
      
      
      res.redirect("/item")
    
      return;
})

module.exports=router