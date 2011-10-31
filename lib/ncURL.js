(function() {
  var EventEmitter, STATS, fs, ncURL, parser, spawn;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  fs = require("fs");
  spawn = require("child_process").spawn;
  EventEmitter = require('events').EventEmitter;
  parser = require("./ncURL_parser");
  STATS = parser.STATS;
  /*
      An instance of ncURL is not supposed to be re-used,
      meaning that one instance should be created for one task
  */
  ncURL = (function() {
    var _registerEventHandlers;
    __extends(ncURL, EventEmitter);
    function ncURL(url, output) {
      this._url = url;
      this._output = output;
      this._statsFilter = [STATS.Total, STATS.ReceivedPercentage, STATS.Received, STATS.AverageDload, STATS.TimeLeft, STATS.CurrentSpeed];
    }
    ncURL.prototype.start = function() {
      var curl, statsData;
      statsData = "";
      curl = spawn("curl", ["-o", this._output, this._url]);
      return _registerEventHandlers.call(this, curl, statsData);
    };
    /* Private */
    _registerEventHandlers = function(curl, statsData) {
      var self;
      self = this;
      curl.stdout.on("end", function() {
        return console.log("stdout end");
      });
      curl.stderr.setEncoding("utf8");
      curl.stderr.on("data", function(data) {
        var arr, lastStatsStr, statsInfo;
        statsData += data;
        arr = statsData.split("\r");
        lastStatsStr = arr[arr.length - 1];
        statsInfo = parser.parseStats(lastStatsStr, self._statsFilter);
        if (statsInfo != null) {
          return self.emit("statsUpdated", statsInfo);
        }
      });
      return curl.on("exit", function(code) {
        return console.log(code);
      });
    };
    return ncURL;
  })();
  /* exports */
  exports.ncURL = ncURL;
}).call(this);
