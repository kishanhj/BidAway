  
const mongoCollections = require("../database/mongoCollection");
const itemForBidCollectionObj = mongoCollections.itemsForBid;
var ObjectId = require('mongodb').ObjectId; 

/**
 * Adds a bid to the DB
 * @param {object} bidInput 
 */
const addItemForBid = async function addItemForBid(itemForBid){

    if(!itemForBid.user_id || ! typeof itemForBid.user_id === "string") throw "Invalid User Id";
    if(!itemForBid.starting_price || ! typeof itemForBid.starting_price === "number") throw "Invalid Strating Price";
    if(!itemForBid.category || ! Array.isArray(itemForBid.category) || itemForBid.category.length === 0) throw "Error in category";
    if(!itemForBid.item) throw "Error in Item"
    if(! typeof itemForBid.item in ['string','object']) throw "You must provide a string or objectId for item";
    if(!itemForBid.time_period || ! typeof itemForBid.time_period === "object") throw "Error ending time";

    const date = new Date();
    const time = parseInt(itemForBid.time_period);
    date.setMinutes(date.getMinutes() + time);

    const newItemForBid = {
        "user_id" : itemForBid.user_id,
        "starting_price" : itemForBid.starting_price,
        "current_price":itemForBid.starting_price,
        "category" : itemForBid.category,
        "starting_time" : new Date(),
        "ending_time":date,
        "item_id":itemForBid.item,
        "bids":[]

    }

    const itemforBidCollection = await itemForBidCollectionObj();
    const insertInfo = await itemforBidCollection.insertOne(newItemForBid);
    if (insertInfo.insertedCount === 0) throw "Could not create Bid";
  
    const newId = insertInfo.insertedId;

    const addedBid = await getItemForBidByID(newId);
    return addedBid;
}

/**
 * This function searches by id and returns a single Bid
 * 
 * @param {string} id 
 */
const getItemForBidByID = async function getItemForBidByID(id) {

    if (!id) throw "You must provide an id to search for";
    if(! typeof id in ['string','object']) throw "You must provide a string or objectId";
    if(typeof id === "string")
        id = ObjectId(id);

    const itemForBidCollection = await itemForBidCollectionObj();
    ItemForBid = await itemForBidCollection.findOne({ _id: ObjectId(id) });
    if (!ItemForBid) throw "No Items with that id";
    return ItemForBid;
  }

/**
 * This function returns all the bids
 */
const getAllItemsForBid = async function getAllItemsForBid() {

    const bidsCollection = await itemForBidCollectionObj();
    const allbids = await bidsCollection.find({}).toArray();
    return buildItemForBidDisplayData(allbids,false);
  }

  /**
 * This function returns all the active bids
 */
const getAllActiveItemsForBid = async function getAllActiveItemsForBid() {

    const bidsCollection = await itemForBidCollectionObj();
    const allbids = await bidsCollection.find({}).toArray();
    return buildItemForBidDisplayData(allbids,true);
  }

async function buildItemForBidDisplayData(allbids,shouldBeActive){
    let allbidsObj = [];
    const itemsDataApi = require("./items");
    const userDataApi = require("./user");

    for(let bid of allbids){

       // const itemForBid = await itemsDataApi.getItemById(bid.item);
        const user = await userDataApi.getuser(bid.user_id);
        const now = new Date();
        const et = new Date(bid.ending_time);
        if(shouldBeActive && et < now)
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
const getItemsForBidByCategory = async function getItemsForBidByCategory(body){
    if(!body || !body.category) throw "Invalid input";
    const categoryInput = body.category;
    const textInput = body.searchInput;
    if(!categoryInput || typeof categoryInput !== 'string') 
        throw "You must provide a proper category";
    
    if(categoryInput == "All" && !body.searchInput) 
        return getAllActiveItemsForBid();
    
    const bidsCollection = await itemForBidCollectionObj();
    let allbids = await bidsCollection.find({category:categoryInput}).toArray();

    return buildItemForBidDisplayData(allbids,true);
  }


const addNewBid = async function addNewBid(id,price,user_id){
    try {
    
    if (!id) throw "You must provide an id to search for";
    if(! typeof id in ['string','object']) throw "You must provide a string or objectId";
    if(typeof id === 'string')
        id = ObjectId(id);
    if(!price || isNaN(price))
        throw "price is Not a number";
    if (!user_id) throw "You must provide an user id";
    if(! typeof user_id in ['string','object']) throw "You must provide a string or objectId";
    if(typeof user_id === 'string')
        user_id = ObjectId(user_id);

    const user = await require("./user").getuser(user_id);
    if(!user) throw "No user with that Id"

    const bidCollection = await itemForBidCollectionObj();
    const itemForBid = await getItemForBidByID(id);

    if(!itemForBid) "Bid not found";

    var et = itemForBid.ending_time;
    var now = new Date();

    if(et.valueOf() < now.valueOf())
        throw "Bid Over";
    
    if(et.valueOf() - now.valueOf() < 10000){
        var c = 10000 - (et.valueOf() - now.valueOf());
        c = c/1000;
        et.setSeconds(et.getSeconds() + Math.ceil(c)); 
    }

    if(price < itemForBid.current_price) throw "Invalid price";

    const bid = {
        user : user.username,
        price : price,
        time : now
    }

    const bids = itemForBid.bids;
    bids.push(bid);

    let updatedPost = { $set:{
            current_price : price,
            ending_time : et,
            bids : bids
    }};

    await bidCollection.updateOne({ _id: id }, updatedPost);

    const resjson = {
        "id":id,
        "price":price,
        "et":et
    }

    return resjson;
    

    } catch (error) {
        throw error;
    }
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

    const bidCollection = await itemForBidCollectionObj();
    const bid = await getItemForBidByID(id);

    var et = bid.ending_time;
    var now = new Date();
    
    if(et.valueOf() - now.valueOf() < 3600000)
        et.setMinutes(et.getMinutes() + 10); 

    

    if(!bid) throw "No bid found";
    if(price < bid.current_price) throw "Invalid price";
         let updatedPost = { $set:{
            current_price : price,
            ending_time : et,
            bids : bids
    }};

    await bidCollection.updateOne({ _id: id }, updatedPost);

    const resjson = {
        "id":id,
        "price":price,
        "et":et
    }

    return resjson;
    } catch (error) {
        console.log("error in update time" + error);
    }
}


module.exports = {
    addItemForBid,
    getItemForBidByID, 
    getAllItemsForBid,
    updateBidPrice,
    getItemsForBidByCategory,
    getAllActiveItemsForBid,
    addNewBid
}
