// To start this server:
// $ node file-server.js

// Server settings:
var host = '127.0.0.1';
var port = 8380;

var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {

  var now = new Date();
  console.log('New request:', now.toLocaleString());
  console.log('Request method:', req.method);
  console.log('Requested file:', req.url);

  if ('/' === req.url) { // no file requested
    console.log('No file requested. Sending testing 200 OK response back.');
    res.writeHead(200);
    res.end('<!doctype html><html><head><title>Testing Web File Server' +
      '</title></head><body><h2>Server up and running</h2></body></html>');
  }
  else { // file requested
    try {
      var data = fs.readFileSync(req.url.slice(1));
      console.log('File loaded, sending 200 OK response back.');
      res.writeHead(200);
      res.end(data);
    }
    catch (e) {
      console.log('Error:', e);
      res.writeHead(404);
      res.end();
    }
  }

  console.log('');

}).listen(port, host, function() {

  console.log('');
  console.log('Web File Server running at http://' + host + ':' + port + '/');
  var now = new Date();
  console.log('Started:', now.toLocaleString());
  console.log('');
  console.log('If a file is requested and it can be found in the local');
  console.log('filesystem, the file is returned in 200 OK response.');
  console.log('Otherwise the server returns 404 Not Found.');
  console.log('');
  console.log('To stop the server, press Ctrl-C.');
  console.log('');

});
