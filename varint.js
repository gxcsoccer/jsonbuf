var MSB = 0x80,
	// 1000 0000
	REST = 0x7F,
	// 0111 1111
	MSBALL = ~REST; // 1000 0000
/**
 * varint编码
 * @param {number} num
 */
exports.encode = function(num) {
	var out = [],
		offset = 0;
	//console.log((num).toString(2));

	while (num & MSBALL) {
		out[offset++] = (num & 0xFF) | MSB
		num >>>= 7
	}
	out[offset] = num
	return new Buffer(out);
};

/**
 * varint解码
 * @param {Buffer} buffer
 */
exports.decode = function(buf, offset) {
	var len = buf.length,
		accum = [],
		out = 0,
		msb, byte;

	for (var i = offset || 0; i < len; i++) {
		byte = buf[i];
		msb = byte & MSB;
		accum[accum.length] = byte & REST;

		if (!msb) {
			break;
		}
	}

	offset = i + 1;

	len = accum.length;

	for (var i = 0; i < len; ++i) {
		out |= accum[i] << (7 * i)
	}

	return out;
};