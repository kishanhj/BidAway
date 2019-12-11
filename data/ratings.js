const mongocollection = require('../database/mongoCollection');
const commentdata=mongocollection.comments
const userdata=mongocollection.users
const itemdata=mongocollection.items
const ObjectID= require("mongodb").ObjectID
const ratingsdata=mongocollection.ratings

async function createrating(userid,ratings){
    if(!userid || typeof userid!=="string") throw "No userid defined"
    if(!ratings || typeof ratings!=="string") throw "No ratings defined"


    ratingsnumber=Number.parseInt(ratings)

    if(ratingsnumber>5 || isNaN(ratingsnumber)) throw "Ratings should be a number out of 5"

    const usercollection=await userdata();
    const user= await usercollection.findOne({_id:ObjectID(userid)})



    if(!user) throw "No user with that id"

    const newratings={
        userid:userid,
        ratings:ratingsnumber,
        hasrated:true
    }

    const ratingscollection= await ratingsdata()
    const insertedratings= await ratingscollection.insertOne(newratings)
    const newid= insertedratings.insertedId;
    if(insertedratings.insertedCount==0) throw new Error("The comment could not be added")

    const useradd=await usercollection.update({_id:ObjectID(userid)},{$addToSet:{ratings:String(newid)}})
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

module.exports={
    createrating,
    getrating
}