var MSB = 0x80,
	REST = 0x7F,
	MSBALL = ~REST;

/**
 * 只向前的BufferReader
 * @param
 */
var BufferReader = function(buf) {
		if (!(this instanceof BufferReader)) {
			return new BufferReader(buf);
		}

		this.buffer = buf;
		this.offset = 0;
		this.bufLength = buf.length;
	};


/**
 * 读取一个字符串
 */
BufferReader.prototype.readString = function(byteLength) {
	var out = this.buffer.toString("utf-8", this.offset, this.offset + byteLength);
	this.offset += byteLength;
	return out;
};

/**
 * 读取一个varint
 */
BufferReader.prototype.readVarInt = function() {
	var byte, msb, out = 0,
		i = 0;

	while (this.offset < this.bufLength) {
		byte = this.buffer[this.offset];
		out |= (byte & REST) << (7 * i++);

		this.offset++;

		msb = byte & MSB;
		if (!msb) {
			break;
		}
	}
	return out;
};

module.exports = BufferReader;