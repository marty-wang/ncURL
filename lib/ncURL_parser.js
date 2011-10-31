(function() {
  var STATS, STATS_COUNT, STATS_PATTERN, STAT_NAMES, parseStats, stat, _i, _isInt, _len;
  STAT_NAMES = ["TotalPercentage", "Total", "ReceivedPercentage", "Received", "XferdPercentage", "Xferd", "AverageDload", "SpeedUpload", "TimeTotal", "TimeSpent", "TimeLeft", "CurrentSpeed"];
  STATS_COUNT = 0;
  STATS = {};
  for (_i = 0, _len = STAT_NAMES.length; _i < _len; _i++) {
    stat = STAT_NAMES[_i];
    STATS[stat] = STATS_COUNT++;
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
    var info, stat, statsArr, _j, _k, _len2, _ref, _results;
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
        for (var _j = 0, _ref = STATS_COUNT - 1; 0 <= _ref ? _j <= _ref : _j >= _ref; 0 <= _ref ? _j++ : _j--){ _results.push(_j); }
        return _results;
      }).apply(this);
    }
    info = {};
    for (_k = 0, _len2 = stats.length; _k < _len2; _k++) {
      stat = stats[_k];
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
