var winston = require('winston');

  winston.log('info', 'Hello distributed log files!');
  winston.info('Hello again distributed logs');

  winston.level = 'debug';
  winston.log('debug', 'Now my debug messages are written to console!');
   winston.add(winston.transports.File, { filename: 'somefile.log' });
  winston.remove(winston.transports.Console);

    var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'somefile.log' })
    ]
  });

  logger.log('info', 'Hello distributed log files!');
  logger.info('Hello again distributed logs');


  winston.profile('test');

  setTimeout(function () {
    //
    // Stop profile of 'test'. Logging will now take place:
    //   "17 Jan 21:00:00 - info: test duration=1000ms"
    //
    winston.profile('test');
  }, 1000);


  // Returns an object corresponding to a specific timing. When done
   // is called the timer will finish and log the duration. e.g.:
   //
   var timer = winston.startTimer()
   setTimeout(function(){
     timer.done("Logging message");
   }, 1000);
