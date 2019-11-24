const mongocollection = require('../database/mongoCollection');
const commentdata=mongocollection.comments
const userdata=mongocollection.users
const itemdata=mongocollection.items
const ObjectID= require("mongodb").ObjectID


async function createcomment(userid,itemid,comment,ratings){
    if(!userid || typeof userid!=="string") throw "No userid defined"
    if(!comment || typeof comment!=="string") throw "No Comment defined"
    if(!ratings || typeof ratings!=="string") throw "No ratings defined"
    if(!itemid || typeof itemid!=="string") throw "No userid defined"

    ratingsnumber=Number.parseInt(ratings)

    if(ratingsnumber>5 || isNaN(ratingsnumber)) throw "Ratings should be a number out of 5"

    const usercollection=await userdata();
    const user= await usercollection.findOne({_id:ObjectID(userid)})

    const itemcollection=await itemdata();
    const item= await itemcollection.findOne({_id:ObjectID(itemid)})

    if(!user) throw "No user with that id"

    if(!item) throw "No item with that id"
    const newcomment={
        comment:comment,
        userid:userid,
        ratings:ratingsnumber,
        itemid:itemid
    }

    const commentcollection= await commentdata()
    const insertedcomment= await commentcollection.insertOne(newcomment)
    if(insertedcomment.insertedCount==0) throw new Error("The comment could not be added")
    return newcomment



}

async function updatecomment(id,commentinfo){
    if(!id) throw "No id given"

    if(!commentinfo) throw "no update info given"

    updatecomment={}
    if(commentinfo.comment){
        if(typeof commentinfo.comment=="String"){
            updatecomment.comment=commentinfo.comment
        }
    }
   
    if(commentinfo.ratings){
        ratingsnumber=Number.parseInt(commentinfo.ratings)
        if(ratingsnumber>5 || isNaN(ratingsnumber)) throw "Ratings should be a number out of 5"
        updatecomment.ratings=commentinfo.ratings
    }

    const commentcollection=await commentdata()
    const commentupdated= await commentcollection.updateOne({_id:ObjectID(id)},{$set:updatecomment})
  
}
async function getcomment(id){
    if(!id) {
        throw "Please enter an id"
    }
    const commentcollection=await commentdata();
    const item= await commentcollection.findOne({_id:ObjectID(id)})
    if(item===undefined) throw "no item with that id"
    return item


}

async function deletecomment(id){
    if(!id) {
        throw "Please enter an id"
    }

    this.getcomment(id)
    const commentcollection=await commentdata();
    const item= await commentcollection.removeOne({_id:ObjectID(id)})
    if(item.deletedCount===0) throw "Item could not be deleted"


}

module.exports={
    createcomment,
    updatecomment,
    getcomment,
    deletecomment
}