var http = require("http")
    , heartbleed = require('./lib/heartbleed');

process.on('uncaughtException', function(err) {
  console.error('Error caught in uncaughtException event:', err);
});

http.createServer(function(req, res) {
  try {
    var s = req.url.slice(1).split(':');
    var domain = s[0];
    var port = parseInt(s[1]);

    heartbleed.doCheck(domain, port, function(err, result) {
      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(JSON.stringify(result));
    });
  } catch (e) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify({code: -1}));
  }

}).listen(8088);