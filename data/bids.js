  
const mongoCollections = require("../database/mongoCollection");
const bidsCollectionObj = mongoCollections.bids;
var ObjectId = require('mongodb').ObjectId; 

/**
 * Adds a bid to the DB
 * @param {object} bidInput 
 */
const addBid = async function addBid(bidInput){

    if(!bidInput.user_id || ! typeof bidInput.user_id === "string") throw "Invalid User Id";
    if(!bidInput.starting_price || ! typeof bidInput.starting_price === "number") throw "Invalid Strating Price";
    if(!bidInput.category || ! Array.isArray(bidInput.category) || bidInput.category.length === 0) throw "Error in category";
    if(!bidInput.item) throw "Error in Item"
    if(! typeof bidInput.item in ['string','object']) throw "You must provide a string or objectId for item";
    if(!bidInput.time_period || ! typeof bidInput.time_period === "object") throw "Error ending time";

    const date = new Date();
    const time = parseInt(bidInput.time_period);
    date.setHours(date.getHours() + time);

    const newBid = {
        "user_id" : bidInput.user_id,
        "starting_price" : bidInput.starting_price,
        "current_price":bidInput.starting_price,
        "category" : bidInput.category,
        "starting_time" : new Date(),
        "ending_time":date,
        "item_id":bidInput.item

    }

    const bidsCollection = await bidsCollectionObj();
    const insertInfo = await bidsCollection.insertOne(newBid);
    if (insertInfo.insertedCount === 0) throw "Could not create Bid";
  
    const newId = insertInfo.insertedId;

    const addedBid = await getBidByID(newId);
    return addedBid;
}

/**
 * This function searches by id and returns a single Bid
 * 
 * @param {string} id 
 */
const getBidByID = async function getBidByID(id) {

    if (!id) throw "You must provide an id to search for";
    if(! typeof id in ['string','object']) throw "You must provide a string or objectId";
    if(typeof id === "string")
        id = ObjectId(id);

    const bidsCollection = await bidsCollectionObj();
    let bid = {};

    try {

    bid = await bidsCollection.findOne({ _id: ObjectId(id) });

    } catch(err){
        throw err;
    }

    if (bid === null) throw "No bids with that id";

    console.log("getbidById res "+bid.ending_time);


    const bidObj = {
        "_id" : bid._id,
        "user_id" : bid.user_id,
        "starting_price": bid.starting_price,
        "current_price":bid.current_price,
        "starting_time": bid.starting_time,
        "ending_time": bid.ending_time
        //"item":itemForBid
    }

    console.log("getbidById ret "+bidObj.ending_time);

    return bidObj;
  }

/**
 * This function returns all the bids
 */
const getAllBids = async function getAllBids() {

    const bidsCollection = await bidsCollectionObj();
    const allbids = await bidsCollection.find({}).toArray();
    return buildBidDisplayData(allbids);
  }

  /**
 * This function returns all the active bids
 */
const getAllActiveBids = async function getAllActiveBids() {

    const bidsCollection = await bidsCollectionObj();
    const allbids = await bidsCollection.find({}).toArray();
    return buildBidDisplayData(allbids);
  }

async function buildBidDisplayData(allbids){
    let allbidsObj = [];
    const itemsDataApi = require("./items");
    const userDataApi = require("./user");

    for(let bid of allbids){

       // const itemForBid = await itemsDataApi.getItemById(bid.item);
        const user = await userDataApi.getuser(bid.user_id);
        const now = new Date();
        const et = new Date(bid.ending_time);
        if(et < now)
            continue;

        const bidObj = {
            "_id" : bid._id,
            "username" : user.username,
            "starting_price": bid.starting_price,
            "starting_time": bid.starting_time,
            "ending_time": bid.ending_time,
            "category":bid.category,
            "current_price":bid.current_price,
            // replace later
            "show_img":"../public/images/placeholder.png",
            "item_title":bid.item_id
        }

        allbidsObj.push(bidObj);
    }

    
    allbidsObj.sort((a, b) => {
        return new Date(a.ending_time) - new Date(b.ending_time) });
    return allbidsObj;
}

/**
 * Finds active bids by category
 * @param {string} category 
 */
const getBidByCategory = async function getBidByCategory(categoryInput){

    if(!categoryInput || typeof categoryInput !== 'string') throw "You must provide a proper category";
    
    const bidsCollection = await bidsCollectionObj();
    let allbids = await bidsCollection.find({category:categoryInput}).toArray();
    return buildBidDisplayData(allbids);
  }


const updateBidPrice =  async function updateBidPrice(id, price) {
    try {
        
    if (!id) throw "You must provide an id to search for";
    if(! typeof id in ['string','object']) throw "You must provide a string or objectId";
    if(typeof id === 'string')
        id = ObjectId(id);
    console.log(price);
    if(!price || isNaN(price))
        throw "price is Not a number";

    const bidCollection = await bidsCollectionObj();
    const bid = await getBidByID(id);

    var et = bid.ending_time;
    var now = new Date();
    
    if(et.valueOf() - now.valueOf() < 3600000)
        et.setMinutes(et.getMinutes() + 10); 

    if(!bid) throw "No bid found";
    if(price < bid.current_price) throw "Invalid price";
         let updatedPost = { $set:{
            current_price : price,
            ending_time : et
    }};

    await bidCollection.updateOne({ _id: id }, updatedPost);

    const resjson = {
        "id":id,
        "price":price,
        "et":et
    }

    return resjson;
    } catch (error) {
        console.log("error in update time" + err);
    }
}


module.exports = {
    addBid,getBidByID, getAllBids,updateBidPrice,getBidByCategory,getAllActiveBids
}
