var randomItem = require('random-item');
const uniqueRandom = require('unique-random');
const rand = uniqueRandom(1, 1000);
const VF_CONFIG = require('./config.js').getConfig();
const APP = require('./config.js').getLogger();
var sys = require('./refresh-system-info.js');
const chalk = require('chalk');
const log = require('./config.js').getLogger().info;
const lockFilePath = VF_CONFIG.appLock;
const appDataFile = VF_CONFIG.appsData;
var http = require("http");
var request = require('request');
var progress = require('request-progress');
var vmService = require('./vm-service.js');
var AppService = require('./app-service.js');
var pre = '...';
const fs = require('fs-extra');


exports.getUniqueID = function () {
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
    var str = part1 + "-Tree-" + part2 + "-" + part3 + "-TE" + part4 + "ST";
    return str;
}

exports.AppInit = function () {
    APP.log('debug', 'Creating Installation dir at %s, sub-folders:logs,apps', VF_CONFIG.installedPath);
    fs.ensureDir(VF_CONFIG.installedPath, err => { err == APP.error("error while creating folders") ? '' : APP.log('silly', err); });
}

exports.check = function () {
    return fileExists(lockFilePath);
}

function fileExists(filePath) {

    try {
        // APP.log('warn', 'util::fileExists::Checking %s ', filePath);
        return fs.statSync(filePath).isFile();

    } catch (err) {
        // APP.log('warn', 'App Files doesn\'t exist');
        return false;
    }
}



exports.writeAppsData = function (data) {
    const out = JSON.stringify(data, null, ' ');
    fs.writeFileSync(appDataFile, out, function (err) {
        if (err) {
            return console.error(err);
        }
    });

}


exports.writeCreationLock = function (data) {
    fs.writeFile(lockFilePath, data, function (err) {
        if (err) {
            return console.error(err);
        }
        fs.readFile(lockFilePath, function (err, data) {
            if (err) {
                return console.error(err);
            } // todo
            // console.log("Asynchronous read: " +obj);
        });
    });

}

exports.ls = function () {
    APP.debug("Inside ls");
    vmService.ls();
    AppService.ls();


}

exports.refeshAndUpdate = function () {
    sys.refresh().then(info => {
        // console.log(JSON.stringify(info, null, ' '))
        log("---------------------------------------------------------------------------------");
        if (this.check()) {
            this.readAppData().then(data => {
                log("Name                     :  " + data.name);
                log("Unique Machine ID        :  " + data.id);
                log("OS                       :  " + info.osInfo.distro);
                log("CPU                      :  " + info.cpu.manufacturer + ' ' + info.cpu.brand);
                log("Memory                   :  " + info.memory.total);
                log("DiskSpace Available      :  " + info.fileSystem.free);
                log("PublicIP                 :  " + info.external_ip);
                log("PrivateIP                :  " + info.internal_ip);
                log("Registered               :  " + chalk.green(this.check()));
                log(chalk.red('For more info, try       :  \'vertico --help\''));
                log("---------------------------------------------------------------------------------");

            }, err => { console.log(err) });

        } else {
            log("OS                       :  " + info.osInfo.distro);
            log("CPU                      :  " + info.cpu.manufacturer + ' ' + info.cpu.brand);
            log("Memory                   :  " + info.memory.total);
            log("DiskSpace Available      :  " + info.fileSystem.free);
            log("PublicIP                 :  " + info.external_ip);
            log("PrivateIP                :  " + info.internal_ip);
            log("Registered               :  " + chalk.green(this.check()));
            log(chalk.red('For more info, try       :  \'vertico --help\''));
            log("---------------------------------------------------------------------------------");

        }
    }).
        catch(err => {
            console.log(err);
            console.log('Error While Refreshing the System Status')
        });


}


exports.stats = function () {
    sys.refresh().then(info => {
        // console.log(JSON.stringify(info, null, ' '))
        log("---------------------------------------------------------------------------------");
        if (this.check()) {
            this.readAppData().then(data => {
                log("Name                     :  " + data.name);
                log("Unique Machine ID        :  " + data.id);
                log("OS                       :  " + info.osInfo.distro);
                log("CPU                      :  " + info.cpu.manufacturer + ' ' + info.cpu.brand);
                log("Memory                   :  " + info.memory.total);
                log("DiskSpace Available      :  " + info.fileSystem.free);
                log("PublicIP                 :  " + info.external_ip);
                log("PrivateIP                :  " + info.internal_ip);
                log("Registered               :  " + chalk.green(this.check()));
                log(chalk.red('For more info, try       :  \'vertico --help\''));
                log("---------------------------------------------------------------------------------");

            }, err => { console.log(err) });

        } else {
            log("OS                       :  " + info.osInfo.distro);
            log("CPU                      :  " + info.cpu.manufacturer + ' ' + info.cpu.brand);
            log("Memory                   :  " + info.memory.total);
            log("DiskSpace Available      :  " + info.fileSystem.free);
            log("PublicIP                 :  " + info.external_ip);
            log("PrivateIP                :  " + info.internal_ip);
            log("Registered               :  " + chalk.green(this.check()));
            log(chalk.red('For more info, try       :  \'vertico --help\''));
            log("---------------------------------------------------------------------------------");

        }
    }).
        catch(err => {
            console.log(err);
            console.log('Error While Refreshing the System Status')
        });


}
/**
 * {
        "os": "test os",
        "privateIP": "1.1.2.2",
        "cpu": "i7",
        "publicIP": "1.1.1.1",
        "version": 2,
        "credits": 10000,
        "diskSpace": "100TB",
        "nickname": "test",
        "ram": "16GB",
        "status": "ACTIVE",
        "info": "123",
        "donor":{"id" : "28630a5a-01c4-8a6e-4b64-5e4baef0a7b5"}
        
    }
 */
exports.getInstanceDetails = function () {
    sys.refresh().then(info => {
        var instanceObj = {};
        instanceObj.nickname = this.getID();
        instanceObj.privateIP = info.internal_ip;
        instanceObj.publicIP = info.external_ip;
        instanceObj.cpu = info.cpu.manufacturer + ' ' + info.cpu.brand;
        instanceObj.ram = info.memory.total;
        instanceObj.diskSpace = info.fileSystem.free;
        // instanceObj.info = JSON.stringify(info);

    }).
        catch(err => {
            return err;
            console.log(err)
        });
}

exports.getStatJson = function () {

    sys.refresh().then(info => {
        return info;
    }).
        catch(err => {
            return err;
            console.log('Error While Refreshing the System Status')
        });
}



exports.downloadOva = function (loc, filename) {
    return downloadManager(loc, filename);
  

}

exports.download = function () {
    downloadManager('http://localhost:4181', 's.zip');
}


exports.fileServer = function () {

    var location = "base/test.zip";
    //var location = "/Users/air/VirtualBox VMs/Vertico/UbuntuVMI-beta/UbuntuVMI-beta.vdi";
    var port = 4181;
    fileServerInit(location, port);
}



var fileServerInit = function (loc, port) {
    var serv = http.createServer(function (req, res) {
        var stat = fs.statSync(loc);
        res.writeHeader(200, {
            "Content-Length": stat.size
        });
        var fReadStream = fs.createReadStream(loc);
        fReadStream.on('data', function (chunk) {
            if (!res.write(chunk)) {
                fReadStream.pause();
            }
        });
        fReadStream.on('end', function () {
            console.log("File is uploaded")
            serv.close();
        });
        res.on("drain", function () {
            fReadStream.resume();
        });
    });
    console.log("File is ready " + loc + "\NListening for incoming connection....");
    serv.listen(port);
}




exports.downloadManager = function (url, filename) {
    return new Promise(function (resolve, reject) {
        APP.debug("Inside downloadManager function Downloading %s from %s.", filename, url);
        progress(request(url), {
            throttle: 3000
        }).on('progress', function (state) {
            APP.info("Downloading progress = %s %", (Math.round(state.percent * 100)));
        })
            .on('error', function (err) {
                APP.error("Failed %s from %s.", err);
                resolve(Error(err));
            })
            .on('end', function () {
                APP.info("Download completed");
                resolve("downloaded")
            })
            .pipe(fs.createWriteStream(filename));
    });
};



exports.readAppData = function () {
    return new Promise(function (res, thr) {
        fs.readFile(lockFilePath, function read(err, data) {
            if (err) { thr(err); }
            try {
                res(JSON.parse(data));
            } catch (err) {
                thr(err);
            }
        })
    })
}