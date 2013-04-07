var varint = require("./varint"),
	toString = Object.prototype.toString,
	hasOwnProperty = Object.prototype.hasOwnProperty;

var MSB = 0x80,
	// 1000 0000
	REST = 0x7F,
	// 0111 1111
	MSBALL = ~REST; // 1000 0000
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
	var buf = new Buffer(Buffer.byteLength("" + JSON.stringify(input)) * 2);
	encode(input, buf, 0);
	return buf;
}

function encode(input, buf, offset) {
	buf = buf || new Buffer(Buffer.byteLength("" + JSON.stringify(input)) * 2);
	offset = offset || 0;
	var type = getType(input),
		tmp;

	switch (type) {
	case "number":
		offset = writeVarInt(buf, 0, offset);
		offset = writeVarInt(buf, input, offset);
		break;
	case "string":
		offset = writeVarInt(buf, 1, offset);
		var strLen = Buffer.byteLength(input);
		offset = writeVarInt(buf, strLen, offset);
		buf.write(input, offset);
		offset += strLen;
		break;
	case "boolean":
		offset = writeVarInt(buf, input ? 5 : 6, offset);
		break;
	case "array":
		offset = writeVarInt(buf, 2, offset);
		offset = writeVarInt(buf, input.length, offset);

		input.forEach(function(item) {
			offset = encode(item, buf, offset);
		});

		break;
	case "object":
		offset = writeVarInt(buf, 3, offset);

		var props = []

		for (var name in input) {
			if (hasOwnProperty.call(input, name)) {
				props.push(name);
			}
		}

		offset = writeVarInt(buf, props.length, offset);

		props.forEach(function(name) {
			offset = encode(name, buf, offset);
			offset = encode(input[name], buf, offset);
		});
		break;
	case "undefined":
		offset = writeVarInt(buf, 4, offset);
		break;
	}

	return offset;
}


function writeVarInt(buf, num, offset) {
	offset = offset || 0;

	while (num & MSBALL) {
		buf.writeInt8((num & 0xFF) | MSB, offset++);
		num >>>= 7
	}
	buf.writeInt8(num, offset++);
	return offset;
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