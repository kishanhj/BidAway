const userdata=require("./user")
const commments=require("./comments")
const items= require("./items")

// async function main(){
//     try{
//         const comment= await commments.getcommentbyitem("5dd72b4764cd8f8f3dfa772d")
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