const userdata=require("./user")
const commments=require("./comments")
const items= require("./items")

// async function main(){
//     try{
//         const item={name: 'Google Home',
//         description: 'I know what you did last summer',
//         category: 'Electronics',
//         startPrice: 69.69,
//         startTime: new Date('2019-11-19 11:11')
//     }
//         const comment= await items.getItemById("5df174c90ee74e1e6a622d7a")
//         console.log(comment)
        

//     }
//     catch(e){
//         console.log(e)
//     }
    
// }

// main()

module.exports={
    users:userdata,
    comments:commments
}