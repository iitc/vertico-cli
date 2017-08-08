var request = require('superagent');
var uniqueNames = ['Emma','Olivia','Ava','Isabella','Sophia','Mia','Amelia','Charlotte','Harper','Yuvan','Ella','Aria','Abigail','Evelyn','Emily','Ankit','Avery','Madison','Scarlett','Sofia','Piyush','Kanda','Mila','Lily','Chloe','Riley','Layla','Ellie','Zoey','Poornima','Grace','Elizabeth','Penelope','Victoria','Aubrey','Luna','Hannah','Indu','Nora','Stella','Addison','Camila','Natalie','Maya','Lillian','Bella','Savannah','Hazel','Paisley','Skylar','Aurora','Brooklyn','Lucy','Audrey','Pannaga','Zoe','Anna','Aarav','Vivaan','Aditya','Vihaan','Arjun','Reyansh','Rekha','Muhammad','Sai','Nisha','Arnav','Ayaan','Krishna','Ishaan','Shaurya','Atharv','Advik','Pranav','Advaith','Aryan','Neel','Dhruv','Kabir','Ritvik','Aarush','Kayaan','Darsh','Veer','Saanvi','Aanya','Chikku','Avi','Aadhya','Uma','Aaradhya','Ananya','Pari','Anika','Navya','Angel','Diya','Varun','Avani','Myra','Sara','Ira','Aahana','Anvi','Prisha','Riya','Aarohi','Anaya','Akshara','Eva','Veronica','Shanaya','Kyra','Siya','Liam','Noah','Anusha','Deepika','Venki','Lucas','Mason','Oliver','Logan','Ethan','Elijah','Giji','Aiden','Peeku','James','Benjamin','Jackson','Alexander','Kyle','Sebastian','Carter','Jacob','Jayden','Daniel','Govind','Michael','Matthew','Jack','Luke','Wyatt','William','Grayson','Gabriel','Surya','Henry','Julian','Owen','Jaxon','Levi','Ryan','Sanjay','Manoj','Isaiah','David','Abhi','Lincoln','Samuel','Eli','Nathan','Adam','Leo','Josiah','Hemanth','Joseph','Karthi','Isaac','John','Caleb','Andrew','Dylan','Anthony','Hunter','Muhammad'];
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



function postUser() {
  var url = 'http://129.114.108.1:6765/verticofactory/rest/v2/entities/vertico$Donors'
  var name = randomItem(uniqueNames);
  var user = {
    secretKey: uuidv2(),
    active: true,
    credits: randCredits(),
    email: name+userSub()+'@iitcs.edu',
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
       timer.done('success:'+user.username);
      }
      
      setTimeout(postUser, 50 );
    });
}