var MSB = 0x80,
	REST = 0x7F,
	MSBALL = ~REST;

var BufferWriter = function(buf) {
		if (!(this instanceof BufferWriter)) {
			return new BufferWriter(buf);
		}

		this.buffer = buf;
		this.offset = 0;
	};

/**
 * 写入一个varint
 */
BufferWriter.prototype.writeVarInt = function(num) {
	while (num & MSBALL) {
		buf.writeInt8((num & 0xFF) | MSB, this.offset++);
		num >>>= 7;
	}
	this.buffer.writeInt8(num, this.offset++);
};

/**
 * 写入一个字符串
 */
BufferWriter.prototype.writeString = function(str) {
	var strLen = Buffer.byteLength(str);
	this.writeVarInt(strLen);
	this.buffer.write(str, this.offset);
	this.offset += strLen;
};

BufferWriter.prototype.toBuffer = function() {
	return this.buffer.slice(0, this.offset);
};

module.exports = BufferWriter;