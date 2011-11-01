(function() {
  var filename, testDir, util;
  util = require("../lib/util.js");
  testDir = "/Users/mo.wang/ncURL_downloads";
  filename = "USA Map Only.jpg";
  console.log(util.getOutputFilename(testDir, filename));
}).call(this);
