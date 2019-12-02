const express = require("express");
const router = express.Router();
const bidsDataApi = require("../data/bids");

router.get("/:id", async (req, res) => {
  try {
    const bid = await bidsDataApi.getBidByID(req.params.id);
    res.status(200).json(bid);
  } catch (e) {
    res.status(404).json();
  }
});

router.get("/", async (req, res) => {
  try {
    const activeBidList = await bidsDataApi.getAllActiveBids();
    res.render("searchMain",{activeBidList:activeBidList});
  } catch (e) {
    console.log("Error in bids/ route get(\"/\") method")
    console.log(e)
    res.status(500).send();
  }
});

router.post("/search", async (req, res) => {
    try {
      if(req.body.category) {
      const activeBidList = await bidsDataApi.getBidByCategory(req.body.category);
      res.render("searchMain",{activeBidList:activeBidList});
      } else {
      res.render("searchMain",{activeBidList:{}});
      }
    } catch (e) {
      res.sendStatus(500);
    }
  });

router.post("/", async (req, res) => {

    let BidInput = req.body;

    if(!BidInput ){
        res.sendStatus(500);
    }

    try {
        const newBid = await bidsDataApi.addBid(BidInput);
        res.status(200).json(newBid);
      } catch (e) {
        res.sendStatus(500);
      }
});

router.post("/:id",async (req,res) => {
  try {
    const bid = await bidsDataApi.updateBidPrice(req.params.id,req.body.price);
    res.status(200).json(bid);
  } catch (e) {
    res.status(500).json();
  }

});

// router.post("/:id",(req,res,next) => {
//   var method;
//   var key = "_method";
//   req.originalMethod = req.originalMethod || req.method;
//   if (req.body && typeof req.body === 'object' && key in req.body) {
//     method = req.body[key].toLowerCase();
//   }
//   const suppMethods = ["POST","PUT","GET","PATCH"];
//   if (suppMethods.indexOf(method)) req.method = method.toUpperCase();
//   res.redirect("/:id");
//     next();
// });


module.exports = router;