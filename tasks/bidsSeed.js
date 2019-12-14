const bidsDataApi = require("../data/bids");
const userDataApi = require("../data/user");



const addUsers = async function addUsers() {
    const addedUsers = [];
    const users = [{
        "username":"Daniel James",
        "emailid":"dj@mu.com",
        "password":"12345678",
        "phone_num":"1212121212",
        "DOB":"1996-01-01",
        "category":"Electronics"
    },{
        "username":"Harry Kane",
        "emailid":"HK@spurs.com",
        "password":"harrykane",
        "phone_num":"1313131313",
        "DOB":"1996-01-01",
        "category":"Furniture"
    },{
        "username":"Harry Maguire",
        "emailid":"HM@mu.com",
        "password":"1111111111",
        "phone_num":"1212321212",
        "DOB":"1996-01-01",
        "category":"Electronics",
        "isUserAdmin":true
    }];

    users.forEach(async user => {
        
        const addedUser = await userDataApi.createuser(user.username,user.emailid,user.password,
            user.phone_num,user.DOB,user.category,user.isUserAdmin);
        addedUsers.push(addedUser);
        console.log(addedUser.username, 'added');
    });

    return addedUsers;
}

const addItems = async (addedUsers) => {

    const seedItems = [{
        user_id :addedUsers[0]._id.toString(),
        item_title: 'iPhone XV',
        description: 'You can run, You can hide, but can\'t escape our ecosystem',
        category: ['Electronics'],
        time_period: "200",
        starting_price: "100.67"
    },{
        user_id : addedUsers[1]._id.toString(),
        item_title: 'Google Home',
        description: 'I know what you did last summer',
        category: ['Electronics'],
        time_period: "100",
        starting_price: "69.69"
    },{
        user_id : addedUsers[2]._id.toString(),
        item_title: 'Galaxy Nexus',
        description: 'Back when Android was cool',
        category: ['Electronics'],
        time_period: "100",
        starting_price: "330.37"
    },{
        user_id : addedUsers[0]._id.toString(),
        item_title: 'Table',
        description: 'Wobbly',
        category: ['Furniture'],
        time_period: "11",
        starting_price: "10.67"
    },{
        user_id : addedUsers[1]._id.toString(),
        item_title: 'Chair',
        description: 'Two Legs',
        category: ['Furniture'],
        time_period: "167",
        starting_price: "2000.18"
    },{
        user_id : addedUsers[2]._id.toString(),
        item_title: 'Couch',
        description: 'Ouch!',
        category: ['Furniture'],
        starting_price: "5.22",
        time_period: "145"
    }];

    seedItems.forEach(async item => {
        
        await bidsDataApi.addItemForBid(item);
       // console.log(item.item_title, 'added');
    });
}



const main = async () => {
    const addedUsers = await addUsers();
   const interval = setInterval(() => {
       console.log(addedUsers._id)
     addItems(addedUsers);
    clearInterval(interval);
   }, 5000);

}

(async () => await main())()