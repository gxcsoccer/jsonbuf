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

	it('should be able to ignore the unsupported type', function() {
		var result = jsonbuf.decode(jsonbuf.encode({
			aaa: 1,
			fn: function() {
				return '';
			}
		}));

		should.exist(result);
		should.not.exist(result.fn);
		result.should.have.property("aaa").with.equal(1);
	});
});