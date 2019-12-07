const express= require("express")
const router = express.Router();
const data = require("../data");
const commmentdata=data.comments


router.post("/", async function(req,res){
 
    const comment=req.body.description
    const userid=req.session.userdata
    const itemid= req.session.itemid

    const commentinfo= await commmentdata.createcomment(userid,itemid,comment,"0")

    console.log(commentinfo)
    res.render("partials/comment_data",{layout: null, ...commentinfo})

})

module.exports = router;