varint
======

A javascript implement varint encode/decode.

inspired by https://github.com/chrisdickinson/varint

# example

## encode & decode
``` test.js
var varint = require('varint');

var buf = varint.encode(300);
console.log(buf);
console.log(varint.decode(buf));

```
output:

```
$ node test.js
<Buffer ac 02>
300
```
