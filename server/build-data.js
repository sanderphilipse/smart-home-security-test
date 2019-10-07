db.users.insertMany([{
    uid: 1,
    "userName": "admin",
    "password": "0192023a7bbd73250516f069df18b500",
    "admin": true,
    "name": "Administrator"
},
{
    uid: 2,
    "userName": "ernstjanbergman",
    "password": "f04a5c13c472f712ef79f0af1e320595",
    "admin": false,
    "name": "Ernst-Jan Bergman"
}]
)

db.lights.insertMany([
    {
        name: 'bedroom',
        status: 0,
        color: '#ffffff',
        owner: 2
    },
    {
        name: 'bedroom 2',
        status: 0,
        color: '#ffffff',
        owner: 2
    },
    {
        name: 'living room',
        status: 1,
        color: '#ffffff',
        owner: 2
    },
    {
        name: 'kitchen',
        status: 1,
        color: '#ffffff',
        owner: 2
    },
    {
        name: 'bathroom',
        status: 1,
        color: '#ffffff',
        owner: 1
    },
    {
        name: 'terrace',
        status: 0,
        color: '#ffffff',
        owner: 1
    }]
)

db.fridges.insertMany([{
    name: 'kitchen',
    owner: 2,
    contents: [
        {item: 'egg', count: 18},
        {item: 'tofu', count: 1},
        {item: 'unidentified bottle', count: 1},
        {item: 'rum', count: 1}
    ],
    contentsWanted: [{item: 'egg', count: 30},
    {item: 'tofu', count: 5},
    {item: 'rum', count: 3}],
    confirmationCode: '22/05/1953'
}])