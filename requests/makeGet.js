var http = require('http');
var sleep = require('sleep');
var async = require('async');
var config = require('../config');

function makeGetRequest(id, tryNumber, cb) {
  var options = {
    host: config.documentService.host,
    path: config.documentService.path + id,
    port: config.documentService.port
  };

  callback = function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      var responseCode = JSON.parse(str).httpStatus;
      console.log('    GET Req # ' + tryNumber + ' for ' + options.path + ' (sample: ', str.substring(0,50), '... )');
      if(responseCode) {
        cb(responseCode);
      }
      else {
        cb(200)
      }

    });
  }

  http.request(options, callback).end();
}

function makeGet(id, cb) {
  var tries = 0;
  var errorCode = 0;

  async.whilst(function test() { return tries < config.perDoc.maxGetRequests && errorCode != 200},
    function fn(iterationDone) {
      sleep.sleep(config.perDoc.secondsBtwRequests);
      tries++;

      makeGetRequest(id, tries, function(error) {
        errorCode = error;
        iterationDone();
      })
    },
    function error(err) {
      cb(tries, errorCode);
    }
  );
}

module.exports = {
    makeGet: makeGet
};
