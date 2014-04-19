var util = require('util');

/**
 * SSL消息缓冲区（用于解包）
 * @constructor
 */
function SSLMsgBuffer() {
  this._buffer = null;
  this._pos = 0;
  this._totalData = 0;
  this._bufSize = 0;
}

/**
 * 写入数据
 * @param {Buffer} buf
 * @param {Number} len
 */
SSLMsgBuffer.prototype.write = function(buf, len) {
  if(!len || !buf) return;
  //console.log('writelen:', len, 'buf:', buf.toString('hex'));

  var n = this._totalData + len;

  if(n > this._bufSize) {
    this._bufSize = Math.ceil(n / 8192) * 8192;
    var tmpBuf = new Buffer(this._bufSize);
    //console.log('bufSize:', tmpBuf.length);

    if (this._buffer) {
      this._buffer.copy(tmpBuf);
    }
    this._buffer = tmpBuf;
  }

  buf.copy(this._buffer, this._pos + this._totalData, 0, len);
  this._totalData += len;
};

/**
 * 读取SSL消息
 * @returns {Buffer} 包不完整返回null
 */
SSLMsgBuffer.prototype.readMsg = function() {
  if (!this._buffer || this._totalData < 5) return null;

  var len = this._buffer.readUInt16BE(this._pos + 3) + 5;

//  console.log(this._buffer.slice(this._pos, this._pos +5).toString('hex'));
//  console.log(util.format('pos:%d, len:%d, totalData:%d, resSize:%s', this._pos, len, this._totalData, this._buffer.length));
  if (this._totalData < len) return null;

  var msg = this._buffer.slice(this._pos, this._pos + len);
  this._pos += len;
  this._totalData -= len;
  return msg;
};

/**
 * 剩余数据长度
 */
SSLMsgBuffer.prototype.__defineGetter__('length', function() {
  return this._totalData;
});

exports.SSLMsgBuffer = SSLMsgBuffer;