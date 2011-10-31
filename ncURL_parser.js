(function() {
  var STATS, STATS_COUNT, STATS_PATTERN, parseStats, stat;
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
          parseStats statsStr, STATS.CurrentSpeed, STATS.ReceivedPercentage, STATS.Received, STATS.Total
  */
  parseStats = function() {
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
  exports.parseStats = parseStats;
  exports.STATS = STATS;
}).call(this);
