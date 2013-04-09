jsonbuf
======

A component for encoding & decoding JSON to binary.

inspired by   
https://developers.google.com/protocol-buffers/docs/encoding  
https://github.com/chrisdickinson/varint  

 js

var jsonbuf = require("jsonbuf"),
    buf = jsonbuf.encode({ a: 1 });
console.log(JSON.stringify(jsonbuf.decode(buf)));

