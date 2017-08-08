#!/usr/bin/env node
const ver = '0.0.1';
const logo = `
\\ \\    / /         | |  (_)            
 \\ \\  / /___  _ __ | |_  _   ___  ___  
  \\ \\/ // _ \\| '__|| __|| | / __|/ _ \\ 
   \\  /|  __/| |   | |_ | || (__| (_) |
    \\/  \\___||_|    \\__||_| \\___|\\___/ ` + ' Beta-' + ver;
console.log(logo);




const debug = require('debug')('main-entrypoint')  
const name = 'vertico-cli'  
const chalk = require('chalk');
const util = require('util');
const log = console.log;
const setTimeoutPromise = util.promisify(setTimeout);
const running = false;
const pullInterval = 300; 

var program = require('commander');
var request = require('superagent');

var volunteer = require('./register.js');
var AppService = require('./app-service.js');
var Util = require('./util.js');
const APP = require('./config.js').getLogger();

program
    .version(ver)
    .option('-r, --register <args>', 'Register this machine to my account using email and secret. \n\t\t\t      Example: `vertico -r test@gmail.com,secretkey`',list)
    .option('-s, --start', 'start the vertico Service')
    .option('-f, --fetch', 'fetch the vertico Service(availble only for developers)')
    .option('-p, --pause', 'stop the vertico Service')
    .option('-u, --unregister <args>', 'UnRegister this machine to my account using email and secret. \n\t\t\t      Example: `vertico -r test@gmail.com,secretkey`',list)
    .parse(process.argv);

if (program.start) {
    Util.AppInit();
    debug('starting the %s', name)  
    if(!Util.check()) { debug('No registered instance found the %s', name) }
    debug('Starting the infinite deamon to pull the jobs ' )
    // startVerticoService(new Date().toISOString()+' Vertico Started', false);
    setTimeout(startVerticoService, pullInterval, new Date().toISOString()+' - tick tick');
}

if (program.pause) {
    APP.debug('pausing all the container')
    if(!Util.check()) { APP.debug("Not registered!")  }
    AppService.pause();
    return; 
}
if (program.register) {
    Util.AppInit();
    console.log('list: %j', program.register);
    if(program.register.length != 2) {
        log(chalk.red('Invalid Parameters,please try \'vertico --help\''));
        return;
    }
    volunteer.register(program.register[0], program.register[1]);
}

if (program.unregister) {
    console.log('list: %j', program.unregister);
    if(program.unregister.length != 2) {
        log(chalk.red('Invalid Parameters,please try \'vertico --help\''));
        return;
    }
    volunteer.unregister(program.unregister[0], program.unregister[1]);
}

if (program.fetch) {
  var timer = APP.startTimer();
  if(!Util.check()) { console.log("Not registered!")  }
  startVerticoService(new Date().toISOString()+' Vertico Started', true);
  timer.done("Logging message");
}


if (program.list == undefined) {
   Util.stats();
   Util.ls();
}

function list(val) {
  return val.split(',');
}

function startVerticoService(arg, force) {
  // fetch the job from vf
  // next if job is docker 
  // excute docker run command only if the status is Active
  // excute docker stop command only if the status is Inactive
  // if virtual machine then run vm command
  // updateStatus
  // fetch list of apps
  // for all apps : 
    // if docker app : run start script
    // if inactive and : stop the script
  APP.info("Triggered Vertico Daemon process(pull model)");
  if(!Util.check()) return;
  Util.readAppData().then(
            data => {
                APP.debug('Reading instance meta data from the local db :\nName = %s, id = %s',data.name, data.id)
                AppService.runApps( data.id);
                volunteer.refreshMyStatus(data.userId, data.id);
            }, err => { console.log(err) } );
  console.log(`: ${arg}`);
  if(!force)  setTimeout(startVerticoService, 10000, new Date().toISOString()+' - tick tick');
}