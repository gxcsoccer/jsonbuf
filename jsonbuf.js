var BufferReader = require("./bufferReader"),
	BufferWriter = require("./bufferWriter"),
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
	var buf = new Buffer(Buffer.byteLength("" + JSON.stringify(input)) * 2),
		bw = new BufferWriter(buf);

	encode(input, bw);
	return bw.toBuffer();
}

function encode(input, bw) {
	var type = getType(input);

	switch (type) {
	case "number":
		bw.writeVarInt(0);
		bw.writeVarInt(input);
		break;
	case "string":
		bw.writeVarInt(1);
		bw.writeString(input);
		break;
	case "boolean":
		bw.writeVarInt(input ? 5 : 6);
		break;
	case "array":
		bw.writeVarInt(2);
		bw.writeVarInt(input.length);

		input.forEach(function(item) {
			encode(item, bw);
		});
		break;
	case "object":
		bw.writeVarInt(3);

		var props = []

		for (var name in input) {
			if (hasOwnProperty.call(input, name)) {
				props.push(name);
			}
		}

		bw.writeVarInt(props.length);

		props.forEach(function(name) {
			encode(name, bw);
			encode(input[name], bw);
		});
		break;
	case "undefined":
		bw.writeVarInt(4);
		break;
	case "null":
		bw.writeVarInt(7);
	}
}

exports.decode = function(buf) {
	var br = new BufferReader(buf);
	return decode(br);
};

function decode(br) {
	var type = br.readVarInt(),
		out;

	switch (type) {
	case 0:
		out = br.readVarInt();
		break;
	case 1:
		out = br.readString(br.readVarInt());
		break;
	case 2:
		var arrLen = br.readVarInt();
		out = [];
		for (var i = 0; i < arrLen; i++) {
			out.push(decode(br));
		}
		break;
	case 3:
		var objLen = br.readVarInt(),
			name, value;
		out = {};
		for (var i = 0; i < objLen; i++) {
			name = decode(br);
			value = decode(br);
			out[name] = value;
		}
		break;
	case 4:
		out = undefined;
		break;
	case 5:
		out = true;
		break;
	case 6:
		out = false;
		break;
	case 7:
		out = null;
	}

	return out;
}

/**
 * 获得输入的类型
 */

function getType(input) {
	var type = typeof input,
		desc = toString.call(input);

	if(type === "object") {
		switch(desc) {
			case "[object Array]":
				type = "array";
				break;
			case "[object Null]":
				type = "null";
				break;
			case "[object Object]":
				type = "object";
				break;
			default:
				type = "unknown";
				break;
		}
	}

	return type;
}