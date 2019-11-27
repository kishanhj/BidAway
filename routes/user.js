const express= require("express")
const router = express.Router();
const data = require("../data");
const userData = data.users

router.get("/" ,async function(req,res){
    res.render("newuser",{title:"Create New User"})
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

router.put("/:id",async function(req,res){
    updateduserinfo=req.body
    
    updateuser={}
    if(!updateduserinfo){
        res.sendStatus(404)
    }
    if(updateduserinfo.newUserName){
        updateuser.newUserName=updateduserinfo.newUserName
    }
    if(updateduserinfo.newEmailId){
        updateuser.newEmailId=updateduserinfo.newEmailId
    }
    if(updateduserinfo.newPhoneNum){
        updateuser.newPhoneNum=updateduserinfo.newPhoneNum
    }
    try{
        await userData.getuser(req.params.id)
    }
    catch(e){
        res.status(404).json({error:e})
    }
    try{
        const user=await userData.updateuser(req.params.id,updateuser)
        res.status(202).json(user)
    }
    catch(e){
        res.sendStatus(500)
    }
})

router.get("/passwordchange/:id", async function(req,res){
    try{
        const user=await userData.getuser(req.params.id)
        res.status(200).render("passwordchange",{title:"Password Change", userinfo:user})

    }
    catch(e){
        res.status(404).json({error:e})
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
       
        if(req.session.isloggedin=true || req.session.isloggedin===undefined){
            const user= await userData.getuser(req.session.userdata)
            
            res.status(200).render("profile",{user:user})

        }
        else{
            res.status(403).json({user:"user has not logged in"})
        }
        
    }
    catch(e){
        res.sendStatus(500)
    }
})

router.post("/userlogin",async function(req,res){
    const userdetail=req.body
    if(!userdetail.username || !userdetail.password){
        res.status(404).json({error:"no username or password entered"})
        return;
    }
    try{
        
        const userlogin=  await userData.verifyuser(userdetail.username,userdetail.password)
        console.log(userlogin);
        req.session.userdata=userlogin._id
        req.session.isloggedin=true
        console.log(req.session)
        res.redirect("userdetails")
    }
    catch(e){
        res.status(400).json({error:e})
        return;
    }
})

module.exports=router