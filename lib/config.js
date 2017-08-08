
// const VF_CONFIG = {
//   register: 'http://localhost:6765/verticofactory/rest/v2/entities/vertico$Donors',
//   appLock:'lib/app-lock.json',
//   appsData: 'lib/app-data.json',
//   validateAPIKey: 'http://localhost:6765/verticofactory/rest/v2/queries/vertico$Donors/getUserInfo',
//   registerInstance: 'http://localhost:6765/verticofactory/rest/v2/entities/vertico$Instance',
//   myapps: 'http://localhost:6765/verticofactory/rest/v2/queries/vertico$Applications/list?instanceID='
// };

const winston = require('winston');
const os = require('os');
const fs = require('fs-extra');
var INSTALLED_PATH;
if(os.platform()  == 'darwin') {
   INSTALLED_PATH = os.homedir() + '/VerticoAppData/';
}else if(os.platform()  != 'win32') {
   INSTALLED_PATH = '/etc/opt/VerticoAppData/'
  fs.ensureDir(INSTALLED_PATH, err => {
    console.log(err)
  })
}else {
  // windows
   INSTALLED_PATH = os.homedir() + '/VerticoAppData/';
}


var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'silly', colorize: true, timestamp: function () {
        return Date();
      },
    }),
    new (winston.transports.File)({ filename: INSTALLED_PATH + 'dev-log.log', level: 'silly' })
  ]
});


const applockPath = INSTALLED_PATH + 'lock.json';
const appDataPath = INSTALLED_PATH + 'data.json';

const VF_CONFIG = {
  installedPath: INSTALLED_PATH,
  appEndpoint:'http://cs595demo.j.layershift.co.uk/rest/v2/entities/vertico$Applications',
  register: 'http://cs595demo.j.layershift.co.uk/rest/v2/entities/vertico$Donors',
  instanceEndpoint:'http://cs595demo.j.layershift.co.uk/rest/v2/entities/vertico$Instance',
  appLock: applockPath,
  appsData: appDataPath,
  validateAPIKey: 'http://cs595demo.j.layershift.co.uk/rest/v2/queries/vertico$Donors/getUserInfo',
  registerInstance: 'http://cs595demo.j.layershift.co.uk/rest/v2/entities/vertico$Instance',
  myapps: 'http://cs595demo.j.layershift.co.uk/rest/v2/queries/vertico$Applications/list?instanceID='
};

// const VF_CONFIG = {
//   installedPath: INSTALLED_PATH,
//   appEndpoint:'http://129.114.108.1:6765/verticofactory/rest/v2/entities/vertico$Applications',
//   register: 'http://129.114.108.1:6765/verticofactory/rest/v2/entities/vertico$Donors',
//   instanceEndpoint:'http://129.114.108.1:6765/verticofactory/rest/v2/entities/vertico$Instance',
//   appLock: applockPath,
//   appsData: appDataPath,
//   validateAPIKey: 'http://129.114.108.1:6765/verticofactory/rest/v2/queries/vertico$Donors/getUserInfo',
//   registerInstance: 'http://129.114.108.1:6765/verticofactory/rest/v2/entities/vertico$Instance',
//   myapps: 'http://129.114.108.1:6765/verticofactory/rest/v2/queries/vertico$Applications/list?instanceID='
// };




function getLogger() {
  // todo: check dev or prod and return the config obj
  return logger;
}

function getConfig() {
  // todo: check dev or prod and return the config obj
  return VF_CONFIG;
}


module.exports = {
  getConfig: getConfig,
  getLogger: getLogger
};

