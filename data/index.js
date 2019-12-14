const userdata=require("./user")
const commments=require("./comments")
const items= require("./items")
const ratings=require("./ratings")
const bids=require("./bids")

// async function main(){
//     try{
//         item={
//     item_title: 'iPhone XV',
//     description: 'You can run, You can hide, but can\'t escape our ecosystem',
//     category: ['Electronics'],
//     time_period: "2",
//     starting_Price: "100.67",
//     user_id:"5df297a72d325e3dc28d00b2"
    

//         }
        
       
//         const comment= await bids.addItemForBid(item)
       
//        console.log(comment)
        
        

//     }
//     catch(e){
//         console.log(e)
//     }
    
// }

// main()

module.exports={
    users:userdata,
    comments:commments,
    items:items,
    ratings:ratings
}