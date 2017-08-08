var virtualbox = require('../vm-service.js');

//virtualbox.import("https://s3-us-west-2.amazonaws.com/projectwikipedia/WindowsXpVMI.ova", "/Users/air/VerticoAppData/WindowsXpVMI.ova");
//virtualbox.startvm("WindowsXpVMI");
const testFolder = '/Users/air/VerticoAppData/';
const fs = require('fs');

fs.readdirSync(testFolder).forEach(file => {
  console.log(file);
})