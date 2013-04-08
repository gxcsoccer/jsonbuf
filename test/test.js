var jsonbuf = require("../jsonbuf"),
	should = require('chai').should(),
	expect = require('chai').expect;;

describe('Encode & Decode', function() {
	it('should be able to encode & decode integer', function() {
		var result = jsonbuf.decode(jsonbuf.encode(2));
		result.should.be.a("number");
		result.should.equal(2);
	});

	it('should be able to encode & decode string', function() {
		var result = jsonbuf.decode(jsonbuf.encode("hello world!"));
		result.should.be.a("string");
		result.should.equal("hello world!");
	});

	it('should be ok with unicode charactor', function() {
		var result = jsonbuf.decode(jsonbuf.encode("高晓晨"));
		result.should.be.a("string");
		result.should.equal("高晓晨");
	});

	it('should be able to encode & decode boolean', function() {
		var result = jsonbuf.decode(jsonbuf.encode(true));
		result.should.be.a("boolean");
		result.should.equal(true);
		result = jsonbuf.decode(jsonbuf.encode(false));
		result.should.be.a("boolean");
		result.should.equal(false);
	});

	it('should be able to encode & decode undefined', function() {
		var result = jsonbuf.decode(jsonbuf.encode(undefined));
		should.not.exist(result);
	});

	it('should be able to encode & decode array', function() {
		var result = jsonbuf.decode(jsonbuf.encode([1, 2, 3]));
		result.should.be.a("array");
		result.should.have.length(3);
		result[0].should.equal(1);
		result[1].should.equal(2);
		result[2].should.equal(3);
	});

	it('should be able to encode & decode a plain object', function() {
		var result = jsonbuf.decode(jsonbuf.encode({
			a: "123"
		}));
		result.should.be.an("object");
		result.should.have.property("a").with.equal("123");
	});

	it('should be ok with null', function() {
		var result = jsonbuf.decode(jsonbuf.encode(null));
		expect(result).to.be.null;
	});

	it('should be ok with complicate object', function() {
		var result = jsonbuf.decode(jsonbuf.encode({
			aaa: 1,
			bbb: "123",
			ccc: true,
			ddd: ["12", 2, 3],
			eee: {
				a: 2
			}
		}));
		result.should.to.be.an("object");
		result.should.have.property("aaa").with.equal(1);
		result.should.have.property("bbb").with.equal("123");
		result.should.have.property("ccc").with.equal(true);
		result.should.have.property("ddd").with.length(3);
		result.should.have.property("eee").with.have.property("a").with.equal(2);
		expect(result["ddd"][0]).to.deep.equal("12");
		expect(result["ddd"][1]).to.deep.equal(2);
		expect(result["ddd"][2]).to.deep.equal(3);

		expect(result).to.deep.equal({
			aaa: 1,
			bbb: "123",
			ccc: true,
			ddd: ["12", 2, 3],
			eee: {
				a: 2
			}
		});
	});
})


// console.log("input: 2");
// buf = json2byte.encode(2);
// console.log(buf);
// console.log(json2byte.decode(buf));
// console.log("---------------------------");
// console.log("input: 'string'");
// buf = json2byte.encode("string");
// console.log(buf);
// console.log(json2byte.decode(buf));
// console.log("---------------------------");
// console.log("input: [1,2,3]");
// buf = json2byte.encode([1, 2, 3]);
// console.log(buf);
// console.log(json2byte.decode(buf));
// console.log("---------------------------");
// console.log("input: {a: 1, b: 'name'}");
// buf = json2byte.encode({
// 	a: 1,
// 	b: 'name'
// });
// console.log(buf);
// console.log(json2byte.decode(buf));
// console.log("---------------------------");
// console.log("input: false");
// buf = json2byte.encode(false);
// console.log(buf);
// console.log(json2byte.decode(buf));
// console.log("---------------------------");
// console.log("input: undefined");
// buf = json2byte.encode(undefined);
// console.log(buf);
// console.log(json2byte.decode(buf));
// console.log("---------------------------");
// var obj = {
// 	"name": "pitaya",
// 	"version": "0.0.1",
// 	"description": "pitaya ======",
// 	"main": "lib/pitaya.js",
// 	"scripts": {
// 		"test": "echo \"Error: no test specified\" && exit 1"
// 	},
// 	"repository": {
// 		"type": "git",
// 		"url": "git://github.com/guileen/pitaya.git"
// 	},
// 	"dependencies": {
// 		"mime": "*",
// 		"connect": "2.x",
// 		"send": "*",
// 		"crc": "*"
// 	},
// 	"author": "",
// 	"license": "BSD"
// }
// console.log("input: obj");
// buf = new Buffer(JSON.stringify(obj));
// console.log(buf.length);
// buf = json2byte.encode(obj);
// console.log(buf.length);
// console.log(json2byte.decode(buf));
// console.log("---------------------------");
// console.time("JSON.stringify");
// for (var i = 0; i < 1000; i++) {
// 	buf = new Buffer(JSON.stringify(obj));
// }
// console.timeEnd("JSON.stringify");
// console.time("json2byte");
// for (var i = 0; i < 1000; i++) {
// 	buf = json2byte.encode(obj);
// }
// console.timeEnd("json2byte");
// buf = new Buffer(JSON.stringify(obj));
// console.time("JSON.stringify");
// for (var i = 0; i < 1000; i++) {
// 	JSON.parse(buf.toString());
// }
// console.timeEnd("JSON.stringify");
// buf = json2byte.encode(obj);
// console.time("json2byte");
// for (var i = 0; i < 1000; i++) {
// 	json2byte.decode(buf);
// }
// console.timeEnd("json2byte");