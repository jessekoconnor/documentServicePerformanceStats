var http = require('http');
var config = require('../config')
var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('./requests/content.json', 'utf8'));

function makePost(cb) {
var options = {
  host: config.documentService.host,
  path: config.documentService.path,
  port: config.documentService.port,
  method: 'POST',
  headers: {
      'Content-Type': 'application/json'
    },
};

callback = function(response) {
  var str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    var json = JSON.parse(str);
    cb(json.documentId)
  });
}

var req = http.request(options, callback);
  req.write(JSON.stringify(obj));
  req.end();
}

module.exports = {
    makePost: makePost
};
