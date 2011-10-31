(function() {
  var STATS, STATS_COUNT, STATS_PATTERN, parseStats, stat, _isInt;
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
      return either an object of all the stats or the specified ones or null if otherwise
      example:
          statsStr = "100 3517k  100 3517k    0     0   215k      0  0:00:16  0:00:16 --:--:-- 47546"
          parseStats statsStr, [STATS.CurrentSpeed, STATS.ReceivedPercentage, STATS.Received, STATS.Total]
  */
  parseStats = function(statsStr, stats) {
    var info, stat, statsArr, _i, _j, _len, _ref, _results;
    if (statsStr == null) {
      statsStr = "";
    }
    statsArr = statsStr.match(STATS_PATTERN);
    if (!(statsArr != null) || statsArr.length < STATS_COUNT) {
      return null;
    }
    if (!(stats != null) || stats.length <= 0) {
      stats = (function() {
        _results = [];
        for (var _i = 0, _ref = STATS_COUNT - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this);
    }
    info = {};
    for (_j = 0, _len = stats.length; _j < _len; _j++) {
      stat = stats[_j];
      if (_isInt(stat) && (0 <= stat && stat < STATS_COUNT)) {
        info[stat] = statsArr[stat];
      }
    }
    return info;
  };
  /* Private */
  _isInt = function(n) {
    return typeof n === 'number' && n % 1 === 0;
  };
  /* exports */
  exports.parseStats = parseStats;
  exports.STATS = STATS;
}).call(this);
