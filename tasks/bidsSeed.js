const bidsDataApi = require("../data/bids");

const seedItems = [{
    
    item_title: 'iPhone XV',
    description: 'You can run, You can hide, but can\'t escape our ecosystem',
    category: ['Electronics'],
    time_period: "20",
    starting_price: "100.67"
},{
   
    item_title: 'Google Home',
    description: 'I know what you did last summer',
    category: ['Electronics'],
    time_period: "20",
    starting_price: "69.69"
},{
    
    item_title: 'Galaxy Nexus',
    description: 'Back when Android was cool',
    category: ['Electronics'],
    time_period: "20",
    starting_price: "330.37"
},{
    
    item_title: 'Table',
    description: 'Wobbly',
    category: ['Furniture'],
    time_period: "20",
    starting_price: "10.67"
},{
    
    item_title: 'Chair',
    description: 'Two Legs',
    category: ['Furniture'],
    time_period: "20",
    starting_price: "2000.18"
},{
    
    item_title: 'Couch',
    description: 'Ouch!',
    category: ['Furniture'],
    starting_price: "5.22",
    time_period: "20"
}];

const main = async () => {
    seedItems.forEach(async item => {
        
        await bidsDataApi.addItemForBid(item);
        console.log(item.item_title, 'added');
    });
}

main();
