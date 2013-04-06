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
	return new Buffer(encode(input));
}

function encode(input) {
	var type = getType(input),
		accum = [];

	switch (type) {
	case "number":
		accum.push.apply(accum, varint.encode(0).toJSON());
		accum.push.apply(accum, varint.encode(input).toJSON())
		break;
	case "string":
		accum.push.apply(accum, varint.encode(1).toJSON());
		accum.push.apply(accum, varint.encode(Buffer.byteLength(input)).toJSON());
		accum.push.apply(accum, (new Buffer(input)).toJSON());
		break;
	case "boolean":
		accum.push.apply(accum, varint.encode(input ? 5 : 6).toJSON());
		break;
	case "array":
		accum.push.apply(accum, varint.encode(2).toJSON());
		accum.push.apply(accum, varint.encode(input.length).toJSON());
		input.forEach(function(item) {
			accum.push.apply(accum, encode(item));
		});
		break;
	case "object":
		accum.push.apply(accum, varint.encode(3).toJSON());
		var offset = accum.length,
			i = 0;

		for (var name in input) {
			if (hasOwnProperty.call(input, name)) {
				accum.push.apply(accum, encode(name));
				accum.push.apply(accum, encode(input[name]));
				i++;
			}
		}

		accum.splice.apply(accum, [offset, 0].concat(varint.encode(i).toJSON()));
		break;
	case "undefined":
		accum.push.apply(accum, varint.encode(4).toJSON());
		break;
	}

	return accum;
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
		for(var i = 0; i < objLen; i++) {
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