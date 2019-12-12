const userdata=require("./user")
const commments=require("./comments")
const items= require("./items")
const ratings=require("./ratings")

async function main(){
    try{
        const item={name: 'Iphone 14',
        description: 'Trust me i got it',
        category: 'Electronics',
        startPrice: 169.69,
        startTime: new Date('2019-12-19 11:11')
    }
        // const comment= await items.addItem(item.name,item.category,item.description,item.startPrice,item.startTime,"5df2986fd8ea493e20b732ea")
       const rating= await ratings.createrating("5df29845d8ea493e20b732e9","5df2ba8c2e51f3471a1b8aa4","2")
        
        

    }
    catch(e){
        console.log(e)
    }
    
}

main()

module.exports={
    users:userdata,
    comments:commments,
    items:items
}