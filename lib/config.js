
const VF_CONFIG_DEV = {
  host: 'http://localhost:6765/verticofactory/',
  register: this.host+'rest/v2/entities/vertico$Donors',
  appLock:'lib/app-lock.json',
  appsData: 'lib/app-data.json',
  validateAPIKey: this.host+'rest/v2/queries/vertico$Donors/getUserInfo',
  registerInstance: this.host + 'rest/v2/entities/vertico$Instance',
  myapps: this.host + 'rest/v2/queries/vertico$Applications/list?instanceID='
};



// const VF_CONFIG_PROD = {
//   host: 'http://localhost:6765/verticofactory/',
//   register: this.host+'rest/v2/entities/vertico$Donors',
//   appLock:'lib/app-lock.json',
//   appsData: 'lib/app-data.json',
//   validateAPIKey: this.host+'rest/v2/queries/vertico$Donors/getUserInfo',
//   registerInstance: this.host + 'rest/v2/entities/vertico$Instance',
//   myapps: this.host + 'rest/v2/queries/vertico$Applications/list?instanceID='
// };


function getConfig(){
  // todo: check dev or prod and return the config obj
  return VF_CONFIG_DEV;
}


module.exports = {
  getConfig: getConfig
};

