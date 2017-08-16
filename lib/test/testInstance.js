var request = require('superagent');
var uniqueNames = ['Blue', 'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Amelia', 'Charlotte', 'Harper', 'Yuvan', 'Ella', 'Aria', 'Abigail', 'Evelyn', 'Emily', 'Ankit', 'Avery', 'Madison', 'Scarlett', 'Sofia', 'Piyush', 'Kanda', 'Mila', 'Lily', 'Chloe', 'Riley', 'Layla', 'Ellie', 'Zoey', 'Poornima', 'Grace', 'sandy', 'alex', 'Ioan', 'Elizabeth', 'Penelope', 'Victoria', 'Aubrey', 'Luna', 'Hannah', 'Indu', 'Nora', 'Stella', 'Addison', 'Camila', 'Natalie', 'Maya', 'Lillian', 'Bella', 'Savannah', 'Hazel', 'Paisley', 'Skylar', 'Aurora', 'Brooklyn', 'Lucy', 'Audrey', 'Anusha', 'Pannaga', 'Zoe', 'Anna', 'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Reyansh', 'Koms', 'Karthi', 'Praveen', 'Rekha', 'Rekha', 'Muhammad', 'Sai', 'Nisha', 'Arnav', 'Ayaan', 'Krishna', 'Harsha', 'Ishaan', 'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Advaith', 'Aryan', 'Neel', 'Dhruv', 'Kabir', 'Ritvik', 'Aarush', 'Kayaan', 'Darsh', 'Veer', 'Saanvi', 'Aanya', 'Chikku', 'Avi', 'Aadhya', 'Uma', 'Aaradhya', 'Ananya', 'Pari', 'Anika', 'Navya', 'Angel', 'Diya', 'Varun', 'Avani', 'Myra', 'Sara', 'Ira', 'Aahana', 'Anvi', 'Prisha', 'Riya', 'Aarohi', 'Anaya', 'Akshara', 'Eva', 'Veronica', 'Shanaya', 'Kyra', 'Siya', 'Liam', 'Noah', 'Anusha', 'Deepika', 'Venki', 'Lucas', 'Mason', 'Oliver', 'Logan', 'Ethan', 'Elijah', 'Giji', 'Aiden', 'Peeku', 'James', 'Benjamin', 'Jackson', 'Alexander', 'Kyle', 'Sebastian', 'Carter', 'Jacob', 'Jayden', 'Daniel', 'Govind', 'Michael', 'Matthew', 'Jack', 'Luke', 'Wyatt', 'William', 'Grayson', 'Gabriel', 'Surya', 'Henry', 'Julian', 'Owen', 'Jaxon', 'Levi', 'Ryan', 'Sanjay', 'Manoj', 'Isaiah', 'David', 'Abhi', 'Lincoln', 'Samuel', 'Eli', 'Nathan', 'Adam', 'Leo', 'Josiah', 'Hemanth', 'Joseph', 'Karthi', 'Isaac', 'John', 'Caleb', 'Andrew', 'Dylan', 'Anthony', 'Hunter', 'Muhammad'];
console.log(uniqueNames.length)
var randomItem = require('random-item');
const uuidv4 = require('uuid/v4');
const uuidv2 = require('uuid/v4');
const uniqueRandom = require('unique-random');
const rand = uniqueRandom(1, uniqueNames.length);
var count = 1;
const randCredits = uniqueRandom(1, 1000000);
const userSub = uniqueRandom(1, 100000);
var winston = require('winston');


const iID = 'ebe0213a-09b3-c61d-a7c1-c4f4a020e89e';

function getUniqueID() {
    // todo - scales only 10,000 users. add more tree varieties 
    var part1 = randomItem([
        'Baobab',
        'Chapel',
        'Dragonblood',
        'Wisteria',
        'Boojum',
        'Banyan',
        'Sequoia',
        'Redwoods',
        'Linden',
        'Coconut',
    ]);
    var part3 = randomItem([
        'Asia',
        'Africa',
        'Antarctica',
        'Australia',
        'Europe',
        'NorthAmerica',
        'SouthAmerica'

    ]);
    var part2 = rand();
    var part4 = rand();
    var str = part1 + "-Tree-" + part2 + "-" + part3 + "-TST";
    return str;
}


var win = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'silly', colorize: true, timestamp: function () {
                return Date();
            },
        }),
        new (winston.transports.File)({ filename: 'appLog.log', level: 'silly' })
    ]
});


function postInstance() {
    console.log(getUniqueID());
    var instanceData = getInstanceData();
    var timer = winston.startTimer()
    request.post('http://129.114.109.103:6765/verticofactory/rest/v2/entities/vertico$Instance')
        .set('Content-Type', 'application/json')
        .send(instanceData)
        .end(function (err, success) {
            if (err) {
                timer.done('error::');
                return;
            }
            timer.done('success::' + success.body.nickname + ',' + success.body.id);
             setTimeout(postInstance, 30);
        });
}

postInstance();

function getAppData() {
    return {
        appName: getUniqueID(),
        imageLocation: "imageLoc",
        appType: "virtualmachine",
        status: "ACTIVE",
        applog: 'appLog-test',
        deployInstance: { id: iID }
    };


}
function getInstanceData() {
    return {
        os: 'ubuntu',
        privateIP: '34.2.3.4',
        cpu: randomItem([
        'i5',
        'i3',
        'i7',
        'AMD',
        'xeon',
        'CUDA'
    ]),
        publicIP: '1.1.1.12',
        credits: 100.000,
        diskSpace: randomItem([
        '1TB',
        '100GB',
        '50GB',
        '100GB',
        '2TB',
        '500GB'
    ]),
        nickname: getUniqueID(),
        ram: randomItem([
        '8GB',
        '16GB',
        '6GB',
        '5GB',
        '120GB',
        '12GB',
        '2GB'
    ]),
        status: 'ACTIVE',
        donor: { id: iID }
    }
}

// function postAppStatus(appData, isContainer) {
//     request.post(cloudAppsEndpoint)
//         .set('Content-Type', 'application/json')
//         .send(appData)
//         .end(function (err, success) {
//             if (err) {
//                 APP.debug(" Error occured while updating the refresh status \n%s", cloudAppsEndpoint);
//                 // APP.error(err);
//                 return;
//                 timer.done('error');
//             }
//             timer.done('success:' + success.appName);
//             setTimeout(postUser, 50);
//         });

// }