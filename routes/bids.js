const express = require("express");
const router = express.Router();
const itemForBidDataApi = require("../data/bids");
const userData = require("../data/user");

router.get("/:id", async (req, res) => {
  try {
    const bid = await itemForBidDataApi.getItemForBidByID(req.params.id);
    res.status(200).json(bid);
  } catch (e) {
    res.status(404).json();
  }
});

router.get("/", async (req, res) => {
  try {
    var bidList = {};
    let user={}
    if(req.session.userdata!==undefined){
        user= await userData.getuser(req.session.userdata)
    }
    var category;
    if(!user || !user.categoryinterest){
    bidList = await itemForBidDataApi.getAllActiveItemsForBid();
    category = "All"
    } else {
    bidList = await itemForBidDataApi.getItemsForBidByCategory(user.categoryinterest);
    category = user.categoryinterest;
    }


    res.render("searchMain",{
      activeBidList:bidList,
      user_id:req.session.userdata,
      isloggedin:req.session.isloggedin,
      user:user,
      category:category,
      isMainPage:true});

  } catch (e) {
    console.log("Error in bids/ route get(\"/\") method");
    console.log(e);
    res.status(500).send();
  }
});

router.post("/search", async (req, res) => {
    try {

      let user={}
      if(req.session.userdata!==undefined){
        user= await userData.getuser(req.session.userdata)
      }
      
      const activeBidList = await itemForBidDataApi.getItemsForBidByCategory(req.body.category);

      res.render("searchMain",{
        activeBidList:activeBidList,
        category:req.body.category,
        user_id:req.session.userdata,
        isloggedin:req.session.isloggedin,
        user:user,
        category:req.body.category,
        isSearch:true});
      
    } catch (e) {
      console.log("Error in bids /search route post(\"/\") method");
      console.log(e);
      res.sendStatus(500);
    }
  });

router.post("/", async (req, res) => {

    let ItemInput = req.body;
    console.log(ItemInput)

    if(!ItemInput){
        res.sendStatus(500);
        return;
    }

    try {
      
        ItemInput.user_id=req.session.userdata;
        const catArr = [];
        catArr.push(ItemInput.category);
        ItemInput.category = catArr;
        const newItems = await itemForBidDataApi.addItemForBid(ItemInput);
        res.redirect("/item/"+newItems.item_id);
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
});

router.post("/:id",async (req,res) => {
  try {

    if(!req.body.price || !req.body.user_id){
      res.sendStatus(400);
      return;
    }

    await itemForBidDataApi.addNewBid(req.params.id,req.body.price,req.body.user_id);
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }

});



module.exports = router;