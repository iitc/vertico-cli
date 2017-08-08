// var cmds = 'docker run --rm -it julia:0.3.6 julia -E "[x^2 for x in 1:100]"'
var winston = require('winston');
var timer = winston.startTimer()
    const
        spawn = require('child_process').spawn,
      dockerDeamon = spawn("docker", ["run","--rm", "-i", "julia:0.3.6", "julia", "-E", "[x^2 for x in 1:100000]"] );
//    dockerDeamon = spawn("docker", ["run","--rm", "-it", "julia:0.3.6", "-E",   "\" [x^2 for x in 1:100]\""] );

    dockerDeamon.stdout.on('data', data => {
console.log(`${data}`);
       
    });

    dockerDeamon.stderr.on('data', data => {
        console.log(`${data}`);
       
    });

    dockerDeamon.on('close', code => {
        console.log(`Docker Shell existed with status = ${code}`);
        timer.done("Logging message");
    });