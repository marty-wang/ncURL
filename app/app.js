(function() {
  var destDir, filename, path, targetUrl, url, util;
  url = require("url");
  path = require("path");
  util = require("../lib/util.js");
  destDir = path.join(process.env['HOME'], "ncURL_downloads");
  targetUrl = "http://www.lopers.net/students/p/pedersendm/images/USA%20Map%20Only.jpg";
  filename = decodeURIComponent(url.parse(targetUrl).pathname.split("/").pop());
  console.log(util.getOutputFilename(destDir, filename));
}).call(this);
