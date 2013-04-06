var varint = require("./varint"),
	toString = Object.prototype.toString,
	hasOwnProperty = Object.prototype.hasOwnProperty;

/* Supported Type
	0  -- number 
	1  -- string  
	2  -- array
	3  -- object
	4  -- undefined
	5  -- true
	6  -- false
*/
exports.encode = function(input) {
	//return new Buffer(encode(input));
	return encode(input);
}

function encode(input) {
	var type = getType(input),
		length = Buffer.byteLength("" + JSON.stringify(input)) * 2,
		buf = new Buffer(length),
		offset = 0,
		tmp;

	switch (type) {
	case "number":
		tmp = varint.encode(0);
		tmp.copy(buf, offset);
		offset += tmp.length;
		tmp = varint.encode(input);
		tmp.copy(buf, offset);
		offset += tmp.length;
		break;
	case "string":
		tmp = varint.encode(1);
		tmp.copy(buf, offset);
		offset += tmp.length;
		var strLen = Buffer.byteLength(input);
		tmp = varint.encode(strLen);
		tmp.copy(buf, offset);
		offset += tmp.length;
		buf.write(input, offset);
		offset += strLen;
		break;
	case "boolean":
		tmp = varint.encode(input ? 5 : 6);
		tmp.copy(buf, offset);
		offset += tmp.length;
		break;
	case "array":
		tmp = varint.encode(2);
		tmp.copy(buf, offset);
		offset += tmp.length;
		tmp = varint.encode(input.length);
		tmp.copy(buf, offset);
		offset += tmp.length;

		input.forEach(function(item) {
			tmp = encode(item)
			tmp.copy(buf, offset);
			offset += tmp.length;
		});

		break;
	case "object":
		tmp = varint.encode(3);
		tmp.copy(buf, offset);
		offset += tmp.length;

		var props = []

		for (var name in input) {
			if (hasOwnProperty.call(input, name)) {
				props.push(name);
			}
		}

		tmp = varint.encode(props.length);
		tmp.copy(buf, offset);
		offset += tmp.length;

		props.forEach(function(name) {
			tmp = encode(name);
			tmp.copy(buf, offset);
			offset += tmp.length;

			tmp = encode(input[name]);
			tmp.copy(buf, offset);
			offset += tmp.length;
		});


		break;
	case "undefined":
		tmp = varint.encode(4);
		tmp.copy(buf, offset);
		offset += tmp.length;
		break;
	}

	return buf.slice(0, offset);
}


exports.decode = function(buf) {
	return decode(buf, 0).data;
};


function decode(buf, offset) {
	offset = offset || 0;
	var o = varint.decode(buf, offset),
		type = o.data,
		out;
	offset = o.offset;

	switch (type) {
	case 0:
		o = varint.decode(buf, offset);
		offset = o.offset;
		out = o.data;
		break;
	case 1:
		o = varint.decode(buf, offset);
		var strLen = o.data;
		offset = o.offset;
		out = buf.toString("utf-8", offset, offset + strLen);
		offset += strLen;
		break;
	case 2:
		o = varint.decode(buf, offset);
		var arrLen = o.data;
		offset = o.offset;
		out = [];
		for (var i = 0; i < arrLen; i++) {
			o = decode(buf, offset);
			out.push(o.data);
			offset = o.offset;
		}
		break;
	case 3:
		o = varint.decode(buf, offset);
		var objLen = o.data;
		offset = o.offset;
		out = {};
		for (var i = 0; i < objLen; i++) {
			o = decode(buf, offset);
			var name = o.data;
			offset = o.offset;
			o = decode(buf, offset);
			var value = o.data;
			offset = o.offset;
			out[name] = value;
		}
		break;
	case 4:
		out = undefined;
		break;
	case 5:
		out = false;
		break;
	case 6:
		out = false;
		break;
	}

	return {
		data: out,
		offset: offset
	}
}

/**
 * 获得输入的类型
 */

function getType(input) {
	var type = typeof input;
	if (type === "object" && toString.call(input) === "[object Array]") {
		type = "array";
	}

	return type;
}