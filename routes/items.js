const express = require("express");
const ObjectID = require('mongodb').ObjectID;
const router = express.Router();
const items = require("../data/items");
const userData = require("../data/user");
const itemsForBid = require("../data/bids");

const isValidString = (str) => {
    return typeof str === 'string' && str.length > 0;
};

const parseDate = (dtstr) => {
    return new Date();
};

router.get("/", async (req, res) => {
    const categories = ["Electronics", "Furniture"];

    const allItems = {};
    try {
        for (let i = 0; i < categories.length; ++i) {
            const cat = categories[i];
            allItems[cat] = await items.getItemsByCategory(cat);

            allItems[cat] = allItems[cat].map(i => {
                i.startTime = i.startTime.toLocaleString();
                return i;
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    let user={}
    if(req.session.userdata!==undefined){
        user= await userData.getuser(req.session.userdata)
    }
    console.log(req.session);
    res.render('browse', {
        categories,
        items: allItems,
        isloggedin:req.session.isloggedin,
        user:user
    });
});

router.get('/additem', (req, res) => {
    res.render("additem");
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    req.session.itemid=req.params.id;
    
    try {
        ObjectID(id);
    } catch (e) {
        res.status(400).json({ error: 'Invalid Item Id' });
        return;
    }

    let item;
    try {
       
        item = await items.getItemById(id);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }

    if (!item) {
        res.status(404).json({ error: 'Item Not Found' });
        return;
    }
    let user={}

    if(req.session.userdata!==undefined){
        user= await userData.getuser(req.session.userdata)
    }

    const itemForBid = await itemsForBid.getItemForBidByItemID(id);
    if(!itemForBid){
        console.log(Invalid);
    }

    itemForBid.bids = itemForBid.bids.slice(0,10);
    
    const isUserAdmin = req.session.isUserAdmin || false;
    res.render('itemfullview', {
        isloggedin: req.session.isloggedin,
        item: item,
        itemid: id,
        user: user,
        showItem: (isUserAdmin || !item.removed),
        isUserAdmin: isUserAdmin,
        user_id:user._id,
        itemForBid:itemForBid
    });
});

router.get("/cat/:cat", async (req, res) => {
    const cat = req.params.cat;

    let catItems;
    try {
        catItems = await items.getItemsByCategory(cat);
    } catch (e) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }

    res.json(catItems);
});

router.post("/", async (req, res) => {
    const item = req.body;

    const err = [];
    if (!isValidString(item.name))
        err.push('Invalid Item Name');

    if (!isValidString(item.category))
        err.push('Invalid Item Category');

    if (!isValidString(item.description))
        err.push('Invalid Item Description');

    if (!isValidString(item.image))
        err.push('Invalid Item image');

    const startDateTime = parseDate(item.startDateTime);
    if (!startDateTime)
        err.push('Invalid Item Start DateTime');

    const startPrice = item.startPrice | 0;
    if (startPrice <= 0)
        err.push('Invalid Item Start Price');

    if (err.length !== 0) {
        res.status(400).json({ error: err });
        return;
    }

    let itemObj;
    try {
        itemObj = await items.addItem(item.name,
                                item.category,
                                item.description,
                                startPrice,
                                startDateTime,
                                item.image,
                                req.session.userdata,
                                );
    } catch (e) {}

    if (!itemObj) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }

    res.json(itemObj);
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    let removedItem;
    try {
        removedItem = await items.markItemRemove(id);
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
        return;
    }

    if (removedItem == null) {
        res.status(404).json({ success: false, error: 'Item Not Found' });
        return;
    }

    res.status(200).json({ success: true,
        removedItem
    });

});

module.exports = router;
