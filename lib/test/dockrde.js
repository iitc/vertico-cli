var Docker = require('dockerode');
var docker = new Docker({socketPath: '/var/run/docker.sock'});

//callback
docker.run('ajaycs14/hello-world', [ '-d'], process.stdout, function (err, data, container) {
    console.log(err);
  console.log(data);
});

// docker run --rm -it julia:0.3.6 julia -E "[x^2 for x in 1:100]"'