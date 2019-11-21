const items = require("../data/items");

const seedItems = [{
    name: 'iPhone XV',
    description: 'You can run, You can hide, but can\'t escape our ecosystem',
    category: 'Electronics',
    startPrice: 100.67,
    startTime: new Date('2019-11-20 12:54')
},{
    name: 'Google Home',
    description: 'I know what you did last summer',
    category: 'Electronics',
    startPrice: 69.69,
    startTime: new Date('2019-11-19 11:11')
},{
    name: 'Galaxy Nexus',
    description: 'Back when Android was cool',
    category: 'Electronics',
    startPrice: 330.37,
    startTime: new Date('2019-11-19 10:32')
},{
    name: 'Table',
    description: 'Wobbly',
    category: 'Furniture',
    startPrice: 10.67,
    startTime: new Date('2019-12-01 12:54')
},{
    name: 'Chair',
    description: 'Two Legs',
    category: 'Furniture',
    startPrice: 2000.18,
    startTime: new Date('2019-11-21 14:00')
},{
    name: 'Couch',
    description: 'Ouch!',
    category: 'Furniture',
    startPrice: 5.22,
    startTime: new Date('2019-12-01 12:54')
}];

const main = async () => {
    seedItems.forEach(async item => {
        await items.addItem(item.name,
                            item.category,
                            item.description,
                            item.startPrice,
                            item.startTime);
        console.log(item.name, 'added');
    });
}

main();
