var Benchmark = require("benchmark"),
	_ = require("underscore"),
	jsonbuf = require("../jsonbuf"),
	suite = new Benchmark.Suite;

var obj = {
	"id": 1,
	"opensource": true,
	"name": "pitaya",
	"version": "0.0.1",
	"description": "pitaya ======",
	"main": "lib/pitaya.js",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1"
	},
	"repository": {
		"type": "git",
		"url": "git://github.com/guileen/pitaya.git"
	},
	"dependencies": {
		"mime": "*",
		"connect": "2.x",
		"send": "*",
		"crc": "*"
	},
	"author": "",
	"license": "BSD"
};

// add tests
suite.add('JSON.stringify', function() {
	new Buffer(JSON.stringify(obj));
}).add('jsonbuf#Encode', function() {
	jsonbuf.encode(obj);
})
// add listeners
.on('cycle', function(event) {
	console.log(String(event.target));
}).on('complete', function() {
	console.log('Fastest is ' + _.pluck(this.filter('fastest'), 'name'));
})
// run async
.run({
	'async': true
});