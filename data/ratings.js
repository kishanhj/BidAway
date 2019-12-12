const mongocollection = require('../database/mongoCollection');
const commentdata=mongocollection.comments
const userdata=mongocollection.users
const itemdata=mongocollection.items
const ObjectID= require("mongodb").ObjectID
const ratingsdata=mongocollection.ratings

async function createrating(userid,itemid,ratings){
    if(!userid || typeof userid!=="string") throw "No from userid defined"
    if(!itemid || typeof itemid!=="string") throw "No Item id defined"
    if(!ratings || typeof ratings!=="string") throw "No ratings defined"


    ratingsnumber=Number.parseInt(ratings)

    if(ratingsnumber>5 || isNaN(ratingsnumber)) throw "Ratings should be a number out of 5"

    

    const itemcollection=await itemdata();
    const item= await itemcollection.findOne({_id:ObjectID(itemid)})

    const usercollection=await userdata();
    const user= await usercollection.findOne({_id:ObjectID(userid)})
    
    


    if(!item) throw "No Item with that id"
    if(!user) throw "No user with that id"

    
    if(await this.getratingbyuseranditem(userid,itemid)===true) throw "User cannot rate same item twice"


    const newratings={
        userid:userid,
        itemid:itemid,
        ownerid:item.userid,
        ratings:ratingsnumber,
        hasrated:true
    }

    const ratingscollection= await ratingsdata()
    const insertedratings= await ratingscollection.insertOne(newratings)
    const newid= insertedratings.insertedId;
    if(insertedratings.insertedCount==0) throw new Error("The ratings could not be added")

    const itemadd=await itemcollection.update({_id:ObjectID(itemid)},{$addToSet:{rating:String(newid)}})
    return await this.getrating(newid)



}

async function getrating(id){
    if(!id) {
        throw "Please enter an id"
    }
    const ratingscollection= await ratingsdata()
    const ratings= await ratingscollection.findOne({_id:ObjectID(id)})
    if(ratings===undefined) throw "no item with that id"

    
    
    return ratings


}

async function getratingbyuseranditem(userid,itemid){
    if(!userid) {
        throw "Please enter an user id"
    }
    if(!itemid) {
        throw "Please enter an item id"
    }
    const ratingscollection= await ratingsdata()
    const ratings= await ratingscollection.findOne({userid:String(userid)})

    if(ratings !== null && ratings.itemid === itemid) {
        return true;
    }
    else{
        return false;
    }

}

module.exports={
    createrating,
    getrating,
    getratingbyuseranditem
}