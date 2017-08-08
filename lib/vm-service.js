// Goals - start, stop, pause, resume, poweroff, import
var virtualbox = require('virtualbox');
const VF_CONFIG = require('./config.js').getConfig();
const APP = require('./config.js').getLogger();
var Util = require('./util.js');
var winston = require('winston');
const fs = require('fs-extra');

exports.startvm = function (vmid) {
    APP.debug("Start Vm function triggered")
    virtualbox.start(vmid, false, function start_callback(error) {
        if (error) {
            APP.debug("Starting  VM failed");
            APP.error(error);
            return;
        }
        APP.debug("%s Vm started in headlessmode", vmid);
    });
}

exports.pausevm = function (vmid) {
    APP.debug("Pausing Vm function triggered")
    virtualbox.pause(vmid, function start_callback(error) {
        if (error) {
            APP.debug("Pausing VM failed");
            APP.error(error);
            return;
        }
        APP.debug("%s Vm paused", vmid);
    });
}

exports.stopvm = function (vmid) {
    APP.debug("Stop Vm function triggered")
    virtualbox.stop(vmid, function start_callback(error) {
        if (error) {
            APP.debug("Stopping  VM failed");
            APP.error(error);
            return;
        }
        APP.debug("%s Vm stopped", vmid);
    });
}

exports.poweroffvm = function (vmid) {
    APP.debug("powering off  function triggered")
    virtualbox.poweroff(vmid, function start_callback(error) {
        if (error) {
            APP.debug("Stopping  VM failed");
            APP.error(error);
            return;
        }
        APP.debug("%s - powered off", vmid);
    });
}

exports.import = function (loc, file) {
    return new Promise(function (resolve, reject) {
        APP.debug("import function is triggered loc = %s, filename = %s ", loc, file);
        if (!checkLocally(file)) {
            Util.downloadManager(loc, file).then(function (msg) {
                APP.debug("Image is present at loc = %s", file);
                APP.debug("Importing the vm %s", file);
                const
                    spawn = require('child_process').spawn,
                    vboxmanage = spawn('vboxmanage', ['import', file]);

                vboxmanage.stdout.on('data', data => {
                    APP.debug(`${data}`);
                });

                vboxmanage.stderr.on('data', data => {
                    APP.warn(`${data}`);
                });
                vboxmanage.on('close', code => {
                    APP.debug(`Imported vm exist code = ${code}`);
                    resolve("Stuff worked!, resolving");
                });
            }).catch(function(data){
                APP.error("Error downloading");
                reject("Stuff dint worked!, rejecting");
            });
        }else{
                APP.debug("Image is present at loc = %s", file);
                APP.debug("Importing the vm %s", file);
                const
                    spawn = require('child_process').spawn,
                    vboxmanage = spawn('vboxmanage', ['import', file]);

                vboxmanage.stdout.on('data', data => {
                    APP.debug(`${data}`);
                });

                vboxmanage.stderr.on('data', data => {
                    APP.warn(`${data}`);
                });
                vboxmanage.on('close', code => {
                    APP.debug(`Imported vm exist code = ${code}`);
                    resolve("Stuff worked!, resolving");
                });
        };

    });

    reject("Error while importing");
}

exports.ls = function (vmid) {
    APP.debug("Listing all Virtual Machines")
    APP.debug("todo: list only vm which are registered to vertico")
    virtualbox.list(function list_callback(machines, error) {
        if (error) throw error;
        APP.info(JSON.stringify(machines, null, ' '))
    });
}

function checkLocally(filePath) {
    APP.debug("Checking %s locally if  file exits?", filePath);
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        APP.silly(err);
        APP.debug("%s doesn't exist", filePath);
        return false;
    }
}

