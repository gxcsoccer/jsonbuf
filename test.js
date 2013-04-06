var json2byte = require("./json2byte"),
	buf;

console.log("input: 2");
buf = json2byte.encode(2);
console.log(buf);
console.log(json2byte.decode(buf));
console.log("---------------------------");


console.log("input: 'string'");
buf = json2byte.encode("string");
console.log(buf);
console.log(json2byte.decode(buf));
console.log("---------------------------");

console.log("input: [1,2,3]");
buf = json2byte.encode([1, 2, 3]);
console.log(buf);
console.log(json2byte.decode(buf));
console.log("---------------------------");

console.log("input: {a: 1, b: 'name'}");
buf = json2byte.encode({
	a: 1,
	b: 'name'
});
console.log(buf);
console.log(json2byte.decode(buf));
console.log("---------------------------");

console.log("input: false");
buf = json2byte.encode(false);
console.log(buf);
console.log(json2byte.decode(buf));
console.log("---------------------------");

console.log("input: undefined");
buf = json2byte.encode(undefined);
console.log(buf);
console.log(json2byte.decode(buf));
console.log("---------------------------");

var obj = {
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
}

console.log("input: obj");
buf = new Buffer(JSON.stringify(obj));
console.log(buf.length);
buf = json2byte.encode(obj);
console.log(buf.length);
console.log(json2byte.decode(buf));
console.log("---------------------------");


console.time("JSON.stringify");

for(var i = 0; i < 1000; i++) {
	buf = new Buffer(JSON.stringify(obj));
}

console.timeEnd("JSON.stringify");

console.time("json2byte");

for(var i = 0; i < 1000; i++) {
	buf = json2byte.encode(obj);
}

console.timeEnd("json2byte");





buf = new Buffer(JSON.stringify(obj));
console.time("JSON.stringify");

for(var i = 0; i < 1000; i++) {
	JSON.parse(buf.toString());
}

console.timeEnd("JSON.stringify");

buf = json2byte.encode(obj);
console.time("json2byte");

for(var i = 0; i < 1000; i++) {
	json2byte.decode(buf);
}

console.timeEnd("json2byte");