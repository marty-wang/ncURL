(function() {
  var STATS, curl, fs, output, parser, spawn, statsData, testUrl;
  parser = require("./ncURL_parser");
  STATS = parser.STATS;
  fs = require("fs");
  spawn = require("child_process").spawn;
  testUrl = "http://www.lopers.net/students/p/pedersendm/images/USA%20Map%20Only.jpg";
  output = "/Users/mowang/Desktop/holly.jpg";
  curl = spawn("curl", ["-o", output, testUrl]);
  curl.stdout.on("data", function(data) {
    return console.log("stdout " + data);
  });
  curl.stdout.on("end", function() {
    return console.log("stdout end");
  });
  statsData = "";
  curl.stderr.setEncoding("utf8");
  curl.stderr.on("data", function(data) {
    var arr, lastStatsStr, statsInfo;
    statsData += data;
    arr = statsData.split("\r");
    lastStatsStr = arr[arr.length - 1];
    statsInfo = parser.parseStats(lastStatsStr, STATS.CurrentSpeed, STATS.ReceivedPercentage, STATS.Received, STATS.Total);
    if (statsInfo != null) {
      return console.log(statsInfo);
    }
  });
  curl.on("exit", function(code) {
    return console.log(code);
  });
}).call(this);
