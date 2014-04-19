heartbleed.js
=============

openssl Heartbleed bug check for Node.js

check result
============
```
{"code":0,"data":"1803021003020ff0d8030253435b909d9b720bbc0cbc2b92a84897cfbd3904cc160a8503909..."}
```
* `code: 0` vulnerable. (存在漏洞)
* `code: 1` not vulnerable. (不存在漏洞)


Demo
=====
```
npm install heartbleed-check
```

```javascript
var heartbleed = require('heartbleed-check');

app.get('/:domain/:port', function(req, res) {
    heartbleed.doCheck(req.param('domain'), req.param('port'), function(err, result) {
        res.json(result);
    });
});
```
