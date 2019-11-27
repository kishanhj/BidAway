const userdata=require("./user")
const commments=require("./comments")
const items= require("./items")

// async function main(){
//     try{
//         const comment= await items.removeItem("5dd72b4764cd8f8f3dfa772c")
//         console.log(comment)
        

//     }
//     catch(e){
//         console.log(e)
//     }
    
// }

//main()

module.exports={
    users:userdata,
    comments:commments
}