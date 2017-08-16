var request = require('superagent');
var uniqueNames = ['Blue','Emma','Olivia','Ava','Isabella','Sophia','Mia','Amelia','Charlotte','Harper','Yuvan','Ella','Aria','Abigail','Evelyn','Emily','Ankit','Avery','Madison','Scarlett','Sofia','Piyush','Kanda','Mila','Lily','Chloe','Riley','Layla','Ellie','Zoey','Poornima','Grace','sandy','alex','Ioan','Elizabeth','Penelope','Victoria','Aubrey','Luna','Hannah','Indu','Nora','Stella','Addison','Camila','Natalie','Maya','Lillian','Bella','Savannah','Hazel','Paisley','Skylar','Aurora','Brooklyn','Lucy','Audrey','Anusha','Pannaga','Zoe','Anna','Aarav','Vivaan','Aditya','Vihaan','Arjun','Reyansh','Koms','Karthi','Praveen','Rekha','Rekha','Muhammad','Sai','Nisha','Arnav','Ayaan','Krishna','Harsha','Ishaan','Shaurya','Atharv','Advik','Pranav','Advaith','Aryan','Neel','Dhruv','Kabir','Ritvik','Aarush','Kayaan','Darsh','Veer','Saanvi','Aanya','Chikku','Avi','Aadhya','Uma','Aaradhya','Ananya','Pari','Anika','Navya','Angel','Diya','Varun','Avani','Myra','Sara','Ira','Aahana','Anvi','Prisha','Riya','Aarohi','Anaya','Akshara','Eva','Veronica','Shanaya','Kyra','Siya','Liam','Noah','Anusha','Deepika','Venki','Lucas','Mason','Oliver','Logan','Ethan','Elijah','Giji','Aiden','Peeku','James','Benjamin','Jackson','Alexander','Kyle','Sebastian','Carter','Jacob','Jayden','Daniel','Govind','Michael','Matthew','Jack','Luke','Wyatt','William','Grayson','Gabriel','Surya','Henry','Julian','Owen','Jaxon','Levi','Ryan','Sanjay','Manoj','Isaiah','David','Abhi','Lincoln','Samuel','Eli','Nathan','Adam','Leo','Josiah','Hemanth','Joseph','Karthi','Isaac','John','Caleb','Andrew','Dylan','Anthony','Hunter','Muhammad'];
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
postUser();


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


function postUser() {
  var url = 'http://129.114.109.103:6765/verticofactory/rest/v2/entities/vertico$Donors'
  var name = randomItem(uniqueNames);
  var user = {
    secretKey: uuidv2(),
    active: false,
    credits: randCredits(),
    email: name+userSub()+'@demot79.edu',
    username: name+'_'+userSub()
  }
 // console.log(user)
 var timer = winston.startTimer()
  request.post(url)
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(user))
    .end(function (err, success) {
      if (err) {
        timer.done('error');
       // return;
      }else{
       timer.done();
      }
      
      setTimeout(postUser, 20 );
    });
}