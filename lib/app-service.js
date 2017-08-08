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

// todo P1 : for docker apps
function safeScript(script) {
    return true;
}


function runDockerApp(app, instanceID) {
    var appDockerShellLog='';
    APP.info("Running app id=" + app.toString())
    var dockerDeamon;
    if(app.imageLocation != "ajaycs14/ve"){
        // var cmds = app.initScript.replace(/ +(?= )/g, '').split(' ');
        //  APP.info("Running script %s ", cmds)
        //  const spawn = require('child_process').spawn;
        //  dockerDeamon = spawn(cmds[0], cmds.splice(1, cmds.length));
    }else{
        var cmds = ["run","--rm", "-i", "julia:0.3.6", "julia", "-E", "[x^2 for x in 1:10000]"] ;
         APP.info("Running script %s ", cmds)
    const
        spawn = require('child_process').spawn,
        dockerDeamon = spawn("docker",cmds);

    dockerDeamon.stdout.on('data', data => {
       // APP.silly(`${data}`);
        appDockerShellLog += data;
    });

    dockerDeamon.stderr.on('data', data => {
      //APP.error(`${data}`);
       appDockerShellLog += data;
    });

    dockerDeamon.on('close', code => {
        APP.info(`Docker Shell existed with status = ${code}`);
        var appData = getAppData(app, "SERVING", appDockerShellLog, instanceID);
       // APP.info(appDockerShellLog);
        postAppStatus(appData,true);
        timer.done("Done Excuting");
    });
    }
    var timer = APP.startTimer();
    
    
   

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
        dockerDeamon = spawn('docker', ['pause', appId]);

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
            // Util.writeAppsData(data.body);
            var apps = data.body;
            APP.info(JSON.stringify(apps,null, ' '));
            for (var i = 0; i < apps.length; i++) {
                if (apps[i].appType == "container" && apps[i].status == "ACTIVE") {
                    APP.info("Container is active, so excuting the init script");
                    runDockerApp(apps[i], id);
                } else if (apps[i].appType == "container" && apps[i].status == "INACTIVE") {
                    stopDockerApp(apps[i]);
                }
                else if (apps[i].appType == "virtualmachine" && apps[i].status == "ACTIVE") {
                    runVm(apps[i], id);
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
    fs.readFile(VF_CONFIG.installedPath + "vmapp.list", 'utf8', function (err, contents) {
        var vms = contents.split(',');
        APP.silly("list of vms %s", vms);
        for (var i = 0; i <= vms.length - 2; i++) {
            APP.silly("pausing of vm %s", vms[i]);
            virtualbox.pausevm(vms[i].split(":")[1]);
        }
    });
    fs.readFile(VF_CONFIG.installedPath + "containers.list", 'utf8', function (err, contents) {
        APP.debug("list of apps" + contents);
        var containers = contents.split(",");
        for (var i = 0; i <= containers.length - 2; i++) {
            pauseApp(containers[i].split(":")[1]);
        }
    });
}

function runVm(app, instanceID) {
    virtualbox.import(app.imageLocation, VF_CONFIG.installedPath + app.appName + ".ova")
        .then(function (msg) {
            virtualbox.startvm(app.appName);
            APP.info("%s is started", app.appName);
            postAppStatus(getAppData(app, "SERVING", "none", instanceID))
        })
        .catch(function (err) {
            //todo
            APP.error(err);
        });

}

function postAppStatus(appData, isContainer) {
    request.post(cloudAppsEndpoint)
        .set('Content-Type', 'application/json')
        .send(appData)
        .end(function (err, success) {
            if (err) {
                APP.debug(" Error occured while updating the refresh status \n%s", cloudAppsEndpoint);
               // APP.error(err);
                return;
            }
            writeAppData(appData, isContainer);
        });

}

function getAppData(app, status, appLog, iID) {
    return {
        appName: app.appName,
        imageLocation: app.imageLocation,
        appType: app.appType,
        id: app.id,
        status: status,
        applog: appLog,
        deployInstance: { id: iID }
    };
}

function writeAppData(app, isContainer) {
    APP.debug("Cloud app is Updated with latest logs");
    var fileName;
    if (isContainer) { fileName = VF_CONFIG.installedPath + "containers.list"; }
    else {
        fileName = VF_CONFIG.installedPath + "vmapp.list";
    }
    var file = VF_CONFIG.installedPath + app.id + ".json";
    fs.appendFileSync(fileName, app.id + ":" + app.appName + ",");
    fs.outputJson(file, app, function (err) {
        if (err) APP.error(err);
    });

}