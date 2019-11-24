const userdata=require("./user")
const commments=require("./comments")

// async function main(){
//     try{
//         const comment= await commments.deletecomment("5ddaec0af7c634cd7088a417")
        

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