(function() {
  var STATS, STATS_COUNT, STATS_PATTERN, curl, fs, output, spawn, stat, statsData, testUrl, _getStatsInfo;
  var __slice = Array.prototype.slice;
  STATS = {
    TotalPercentage: 0,
    Total: 1,
    ReceivedPercentage: 2,
    Received: 3,
    XferdPercentage: 4,
    Xferd: 5,
    AverageDload: 6,
    SpeedUpload: 7,
    TimeTotal: 8,
    TimeSpent: 9,
    TimeLeft: 10,
    CurrentSpeed: 11
  };
  STATS_COUNT = 0;
  for (stat in STATS) {
    STATS_COUNT++;
  }
  STATS_PATTERN = /[a-zA-Z0-9:-]+/g;
  /*
      get the stat info based on stats string and stat type
      return either an array of all the stats or the specified one of string type or null if otherwise
      example:
          statsStr = "100 3517k  100 3517k    0     0   215k      0  0:00:16  0:00:16 --:--:-- 47546"
          _getStatsInfo statsStr, STATS.CurrentSpeed, STATS.ReceivedPercentage, STATS.Received, STATS.Total
  */
  _getStatsInfo = function() {
    var stat, stats, statsArr, statsStr, _i, _len, _results;
    statsStr = arguments[0], stats = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (statsStr == null) {
      statsStr = "";
    }
    statsArr = statsStr.match(STATS_PATTERN);
    if (!(statsArr != null) || statsArr.length < STATS_COUNT) {
      return null;
    }
    if (stats == null) {
      return statsArr;
    }
    _results = [];
    for (_i = 0, _len = stats.length; _i < _len; _i++) {
      stat = stats[_i];
      _results.push(statsArr[stat]);
    }
    return _results;
  };
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
    statsInfo = _getStatsInfo(lastStatsStr, STATS.CurrentSpeed, STATS.ReceivedPercentage, STATS.Received, STATS.Total);
    if (statsInfo != null) {
      return console.log(statsInfo);
    }
  });
  curl.on("exit", function(code) {
    return console.log(code);
  });
}).call(this);
