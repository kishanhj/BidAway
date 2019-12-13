const userdata=require("./user")
const commments=require("./comments")
const items= require("./items")
const ratings=require("./ratings")

// async function main(){
//     try{
//         const item={name: 'Iphone 14',
//         description: 'Trust me i got it',
//         category: 'Electronics',
//         startPrice: 169.69,
//         startTime: new Date('2019-12-19 11:11')
//     }
//         // const comment= await items.addItem(item.name,item.category,item.description,item.startPrice,item.startTime,"5df2986fd8ea493e20b732ea")
//        const rating= await ratings.createrating("5df3882c7361db5f5e5cf0c6","5df383462014de5da3aa8e49","4")
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