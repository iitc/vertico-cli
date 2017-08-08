// todo : redundant code, remove it
// Author : Ajay Ramesh
'use strict';
var request = require('superagent');

const VF_CONFIG = require('./config.js').getConfig();
const myAppsEndpoint = VF_CONFIG.myapps;
const cloudAppsEndpoint = VF_CONFIG.appEndpoint;
const fs = require('fs-extra');
const APP = require('./config.js').getLogger();

var Util = require('./util.js');
var sys = require('./refresh-system-info.js');
var virtualbox = require('./vm-service.js');


exports.ls = function () {
    APP.debug("listing docker apps")
    const
        spawn = require('child_process').spawn,
        dockerDeamon = spawn('docker', ['ps']);

    dockerDeamon.stdout.on('data', data => {
        APP.info(`\n${data}`);
    });

    dockerDeamon.stderr.on('data', data => {
        APP.error(`${data}`);
    });
    dockerDeamon.on('close', code => {
        APP.silly(`done executing the docker ps command code = ${code}`);
    });
}

function safeScript(script){
    return true;
}
function runDockerApp(app, instanceID) {
    APP.info("Running app id=" + app.toString())
    // removes the extra space creates an array
    var cmds = app.initScript.replace(/ +(?= )/g, '').split(' ');
    APP.info("Running script %s ", cmds)
    const
        spawn = require('child_process').spawn,
        dockerDeamon = spawn(cmds[0], cmds.splice(1, cmds.length));

    dockerDeamon.stdout.on('data', data => {
        APP.info(`${data}`);
                 var appData = {
                     appName:app.appName,
                     imageLocation:app.imageLocation,
                     appType:app.appType,
                     id:app.id,
                     status: "SERVING",
                     applog:data.toString(),
                     deployInstance: {  id: instanceID }
                };
                request.post(cloudAppsEndpoint)
                    .set('Content-Type', 'application/json')
                    .send(appData)
                    .end(function (err, success) {
                        if (err) {
                            APP.debug(" Error occured while updating the refresh status \n%s",cloudAppsEndpoint);
                            APP.error(err);
                            return;
                        }
                        APP.debug("Cloud app is Updated with latest logs")
                        fs.appendFileSync(VF_CONFIG.installedPath+"vmapp.list",fileName+"," );
                    });
    });

    dockerDeamon.stderr.on('data', data => {
        APP.error(`${data}`);
        var appData = {
                     appName:app.appName,
                     imageLocation:app.imageLocation,
                     appType:app.appType,
                     id:app.id,
                     status: "LOST",
                     applog:data.toString(),
                     deployInstance: {  id: instanceID }
                };
                request.post(cloudAppsEndpoint)
                    .set('Content-Type', 'application/json')
                    .send(appData)
                    .end(function (err, success) {
                        if (err) {
                            APP.debug(" Error occured while updating the refresh status \n%s",cloudAppsEndpoint);
                            APP.error(err);
                            return;
                        }
                        APP.debug("Cloud app is Updated with latest logs")
                    });
    });

    dockerDeamon.on('close', code => {
        APP.info(`Docker Shell existed with status = ${code}`);
    });
}


function stopDockerApp(app) {
    APP.info("Running app id=" + app.id)
    // removes the extra space creates an array
    var cmds = app.stopscript.replace(/ +(?= )/g, '').split(' ');
    APP.info("stop script %s ", cmds)
    const
        spawn = require('child_process').spawn,
        dockerDeamon = spawn(cmds[0], cmds.splice(1, cmds.length));

    dockerDeamon.stdout.on('data', data => {
        APP.info(`${data}`);
    });

    dockerDeamon.stderr.on('data', data => {
        APP.error(`${data}`);
    });

    dockerDeamon.on('close', code => {
        APP.info(`Docker Shell existed with status = ${code}`);
    });
}

function pauseApp(appId) {
    APP.info("Running app id=" + appId)
    const
        spawn = require('child_process').spawn,
        dockerDeamon = spawn('docker',['pause',appId]);

    dockerDeamon.stdout.on('data', data => {
        APP.info(`${data}`);
    });

    dockerDeamon.stderr.on('data', data => {
        APP.error(`${data}`);
    });

    dockerDeamon.on('close', code => {
        APP.info(`Docker Shell existed with status = ${code}`);
    });
}

exports.runApps = function (id) {
    request.get(myAppsEndpoint + id)
        .set('Content-Type', 'application/json')
        .end(function (err, data) {
            Util.writeAppsData(data.body);
            var apps = data.body;
            APP.info(apps);
            for (var i = 0; i < apps.length; i++) {
                if (apps[i].appType == "container" && apps[i].status == "ACTIVE") {
                    APP.info("Container is active, so excuting the init script");
                    runDockerApp(apps[i],id);
                } else if (apps[i].appType == "container" && apps[i].status == "INACTIVE") {
                    stopDockerApp(apps[i]);
                }
                else if (apps[i].appType == "virtualmachine" && apps[i].status == "ACTIVE") {
                   runVm(apps[i],id);
                }
            }
            if (err) {
                console.log(err);
                return;
            }

        });
}

exports.pause = function () {
    APP.silly("Pausing the container");
    fs.readFile(VF_CONFIG.installedPath+"vmapp.list", 'utf8', function(err, contents) {
        var vms = contents.split(',');
        APP.silly("list of vms %s", vms);
        for(var i = 0; i <= vms.length-2 ; i++ ){
            APP.silly("pausing of vm %s", vms[i]);
            virtualbox.pausevm(vms[i]);
        }
    });
    fs.readFile(VF_CONFIG.installedPath+"containers.list", 'utf8', function(err, contents) {
        APP.debug("list of apps" + contents);
        var containers = contents.split(",");
        for(var i = 0; i <= containers.length-2 ; i++ ){
            pauseApp(containers[i]);
        }
    });
}

function runVm(app, instanceID) { 
     virtualbox.import(app.imageLocation, VF_CONFIG.installedPath + app.appName + ".ova")
     .then(function(msg){
         virtualbox.startvm(app.appName);
         APP.info("%s is started",app.appName);
                 var appData = {
                     appName:app.appName,
                     imageLocation:app.imageLocation,
                     appType:app.appType,
                     id:app.id,
                     status: "SERVING",
                     applog:"none",
                     deployInstance: {  id: instanceID }
                };
                request.post(cloudAppsEndpoint)
                    .set('Content-Type', 'application/json')
                    .send(appData)
                    .end(function (err, success) {
                        if (err) {
                            APP.debug(" Error occured while updating the refresh status \n%s",cloudAppsEndpoint);
                            APP.error(err);
                            return;
                        }
                        APP.debug("Cloud app is Updated with latest logs");
                        fs.appendFileSync(VF_CONFIG.installedPath+"vmapp.list",app.appName+"," );
                    });

     })
     .catch(function(err){
        //todo
        APP.error(err);
     });
     
}