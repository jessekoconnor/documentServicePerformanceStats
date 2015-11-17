var postIt = require('./requests/makePost');
var getIt = require('./requests/makeGet');
var config = require('./config');
var async = require('async')

function postAndGet(done) {
	var startTime = new Date();

	// Post the contents of content.json
	postIt.makePost(function(param) {
		console.log('-- Doc ' + (runs+1) + ' posted --> ' + param)

		// Post the contents of content.json
		getIt.makeGet(param, function(tries, error) {

			var finishTime = new Date();
			var timeTaken = finishTime.getTime() - startTime.getTime();
			if(error == 200) {
				console.log('    Document retrievable in ' + timeTaken)
				runningTotalTime += timeTaken;
			} else {
				unretrievableDocs++;
				console.log( '    Document not retrievable :(' )
			}
			done();
		})
	})
}

var runs = 0;
var unretrievableDocs = 0;
var runningTotalTime = 0;

// pretty
function printSummary() {
	console.log('-----------------------------------------');
	console.log('done with', runs, 'runs!');
	console.log(unretrievableDocs + ' documents were not retrievable');
	console.log((runs - unretrievableDocs) + ' were retrieved averaging to', (runningTotalTime/(runs-unretrievableDocs)));
}

// run tests one after the other (synchronously)
function runTestsSynchronously() {
	async.whilst(function test() { return  runs < config.totalRuns },
		function fn(iterationComplete) {
			postAndGet(iterationComplete);
			runs++;
		},
	printSummary
	);
}

// Kick things off
runTestsSynchronously();


process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  printSummary();
  process.exit(1)
})