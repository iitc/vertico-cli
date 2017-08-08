var virtualbox = require('../vm-service.js');

//negative test case
virtualbox.startvm("sl");
virtualbox.stopvm("stop");
virtualbox.poweroffvm("ki");

// WindowsXpVMI

virtualbox.startvm("WindowsXpVMI");