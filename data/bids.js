  
const mongoCollections = require("../database/mongoCollection");
const bidsCollectionObj = mongoCollections.bids;
var ObjectId = require('mongodb').ObjectId; 

/**
 * Adds a bid to the DB
 * @param {object} bidInput 
 */
const addBid = async function addBid(bidInput){

    if(!bidInput.user_id || ! typeof bidInput.user_id === "string") throw "Invalid User Id";
    if(!bidInput.starting_time || ! typeof bidInput.starting_time === "object") throw "Invalid Starting time";
    if(!bidInput.starting_price || ! typeof bidInput.starting_price === "number") throw "Invalid Strating Price";
    if(!bidInput.category || ! Array.isArray(bidInput.category) || bidInput.category.length === 0) throw "Error in category";
    if(!bidInput.item) throw "Error in Item"
    if(! typeof bidInput.item in ['string','object']) throw "You must provide a string or objectId for item";
    if(!bidInput.ending_time || ! typeof bidInput.ending_time === "object") throw "Error ending time";


    const bidsCollection = await bidsCollectionObj();
    const insertInfo = await bidsCollection.insertOne(bidInput);
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

    const itemDataApi = require("./items")
    let itemForBid = {};

    try{

        itemForBid = await itemDataApi.getItemById(bid.item);

    } catch(err) {
        throw "No author"
    }

    const bidObj = {
        "_id" : bid._id,
        "user_id" : bid.user_id,
        "starting_price": bid.starting_price,
        "starting_time": bid.starting_time,
        "ending_time": bid.time_period,
        "item":itemForBid
    }

    return bidObj;
  }

/**
 * This function returns all the bids
 */
const getAllBids = async function getAllBids() {

    const bidsCollection = await bidsCollectionObj();
    const allbids = await bidsCollection.find({}).toArray();

    const allbidsObj = [];
    const itemsDataApi = require("./items");

    for(let bid of allbids){

        let itemForBid = {};
        try{
            itemForBid = await itemsDataApi.getItemById(bid.item);
        } catch(err) {
            throw "No item"
        }

        const bidObj = {
            "_id" : bid._id,
            "user_id" : bid.user_id,
            "starting_price": bid.starting_price,
            "starting_time": bid.starting_time,
            "time_period": bid.time_period,
            "is_active":bid.is_active,
            "category":bid.category,
            "item":itemForBid
        }

        allbidsObj.push(bidObj);
    }

    return allbidsObj;
  }

  /**
 * This function returns all the active bids
 */
const getAllActiveBids = async function getAllActiveBids() {

    const bidsCollection = await bidsCollectionObj();
    const allbids = await bidsCollection.find({}).toArray();

    const allbidsObj = [];
    const itemsDataApi = require("./items");

    for(let bid of allbids){

        let itemForBid = {};
        try{
            itemForBid = await itemsDataApi.getItemById(bid.item);
        } catch(err) {
            throw "No item"
        }

        const bidObj = {
            "_id" : bid._id,
            "user_id" : bid.user_id,
            "starting_price": bid.starting_price,
            "starting_time": bid.starting_time,
            "ending_time": bid.ending_time,
            "category":bid.category,
            "item":itemForBid
        }

        allbidsObj.push(bidObj);
    }

    return allbidsObj;
  }

/**
 * Finds active bids by category
 * @param {string} category 
 */
const getBidByCategory = async function getBidByCategory(categoryInput){

    if(!categoryInput || typeof categoryInput !== 'string') throw "You must provide a proper category";
    const bidsCollection = await bidsCollectionObj();
    let activeBids = await bidsCollection.find({category:categoryInput}).toArray();

    const allbidsObj = [];
    const itemsDataApi = require("./items");

    for(let bid of activeBids){

        let itemForBid = {};
        try{
            itemForBid = await itemsDataApi.getItemById(bid.item);
        } catch(err) {
            throw "No item"
        }

        const bidObj = {
            "_id" : bid._id,
            "user_id" : bid.user_id,
            "starting_price": bid.starting_price,
            "starting_time": bid.starting_time,
            "time_period": bid.time_period,
            "is_active":bid.is_active,
            "category":bid.category,
            "item":itemForBid
        }

        allbidsObj.push(bidObj);
    }

    return allbidsObj;
  }



// TODO: Not yet Implemented just copy code
const updateBid =  async function updateBid(id, title, content) {
    if (!id) throw "You must provide an id to search for";
    if(! typeof id in ['string','object']) throw "You must provide a string or objectId";
    if(typeof id === 'string')
        id = ObjectId(id);

    const postCollection = await bidsCollectionObj();
    let updatedPost = {};
    
    if(!title) {
        updatedPost = { $set:{
            content: content
          }};
    } else if(!content) {
        updatedPost = { $set:{
            title: title
          }};
    } else {
        updatedPost = { $set:{
            title: title,
            content:content
          }};
    }
    

    await postCollection.updateOne({ _id: id }, updatedPost);

    return await getBidByID(id);
}


module.exports = {
    addBid,getBidByID, getAllBids,updateBid,getBidByCategory,getAllActiveBids
}
