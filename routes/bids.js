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
    res.status(200).json(activeBidList);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/:category", async (req, res) => {
    try {
      const activeBidList = await bidsDataApi.getBidByCategory(req.params.category);
      res.status(200).json(activeBidList);
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

module.exports = router;