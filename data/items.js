const { items } = require("../database/mongoCollection");
const mongocollection = require('../database/mongoCollection');
const commentdata=mongocollection.comments
const ObjectID = require('mongodb').ObjectID;

const  ensureValidString = (str, name) => {
    if (typeof str !== 'string' || str.length === 0)
        throw new Error('Invalid ' + name);
}

const getAllItems = async () => {
    const itemsCollection = await items();
    const allItems = await itemsCollection.find().toArray();

    return allItems;
};

const getItemById = async (id) => {
    id = ObjectID(id);
    comments=[]

    const itemsCollection = await items();
    const item = await itemsCollection.findOne({ _id: id });
    const commentcollection= await commentdata();
    if(item.comments.length>0){
        for(let i=0;i<item.comments.length;i++){
            console.log(item.comments[i])
            let commentdata= await commentcollection.findOne({_id:ObjectID(item.comments[i])})
            comments.push({id:commentdata._id,comment:commentdata.comment,ratings:commentdata.ratings})
        }
    }
    item.comments=comments
    return item;
};

const getItemsByCategory = async (category) => {
    ensureValidString(category, 'Category');

    const itemsCollection = await items();
    const allItems = await itemsCollection.find({ category }).toArray();

    return allItems;
};

const addItem = async (name, category, description, startPrice, startTime) => {
    ensureValidString(name, 'Item Name');
    ensureValidString(category, 'Item Category');
    ensureValidString(description, 'Item Description');

    if (typeof startPrice !== 'number' || isNaN(startPrice) || startPrice <= 0)
        throw new Error('Invalid Item Start Price');

    if (!startTime instanceof Date)
        throw new Error('Invalid Item Start Item');

    const itemObj = {
        name,
        category,
        description,
        startPrice,
        startTime,

        endTime: null,
        bids: [],
        comments: [],
        rating: 0
    };

    const itemsCollection = await items();
    const insertInfo = await itemsCollection.insertOne(itemObj);

    if (insertInfo.insertedCount === 0)
        throw new Error('Could not create a new Item');

    const id = insertInfo.insertedId;
    itemObj._id = id;

    return itemObj;
};

const removeItem = async (id) => {
    id = ObjectID(id);

    const toBeDeleted = await getItemById(id)
    console.log(toBeDeleted)

    if (!toBeDeleted)
        return null;
    const commentcollection= await commentdata();
    if(toBeDeleted.comments.length>0){
            for(let i=0;i<toBeDeleted.comments.length;i++){
                await commentcollection.deleteOne({_id:ObjectID(toBeDeleted.comments[i].id)})
            }
    }

    const itemsCollection = await items();
    const deleteInfo = itemsCollection.deleteOne({ _id: id });

    if (deleteInfo.deletedCount === 0)
        throw new Error('Could not delete item');
    
    

    return toBeDeleted;
};

module.exports = {
    getAllItems,
    getItemById,
    getItemsByCategory,
    addItem,
    removeItem
};
