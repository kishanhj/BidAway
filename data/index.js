const userdata=require("./user")
const commments=require("./comments")
const items= require("./items")
const ratings=require("./ratings")
const bids=require("./bids")

// async function main(){
//     try{
//         const item={
    
//             item_title: 'Table',
//             description: 'Wobbly',
//             category: ['Furniture'],
//             time_period: "20",
//             starting_price: "10.67"
//         }
//         item.user_id="5df29845d8ea493e20b732e9"
    
//         // const comment= await items.addItem(item.name,item.category,item.description,item.startPrice,item.startTime,"5df2986fd8ea493e20b732ea")
//        const rating= await bids.addItemForBid(item)
//        console.log(rating)
        
        

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