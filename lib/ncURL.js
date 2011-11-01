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
      this._curl = null;
      this._hasError = false;
      this._progress = 0;
    }
    ncURL.prototype.start = function() {
      var curl;
      curl = spawn("curl", ["-o", this._output, this._url]);
      this._curl = curl;
      return _registerEventHandlers.call(this, curl);
    };
    ncURL.prototype.stop = function() {
      return this._curl.kill();
    };
    /* Private */
    _registerEventHandlers = function(curl) {
      var self, statsData;
      self = this;
      statsData = "";
      curl.stdout.on("end", function() {
        var result;
        if (self._hasError) {
          result = {
            status: "error"
          };
        } else if (self._progress < 100) {
          result = {
            status: "incomplete",
            data: {
              progress: self._progress
            }
          };
        } else {
          result = {
            status: "success",
            data: {
              filePath: self._output
            }
          };
        }
        return self.emit("end", result);
      });
      curl.stderr.setEncoding("utf8");
      curl.stderr.on("data", function(data) {
        var arr, hasError, lastStatsStr, parseResult;
        statsData += data;
        arr = statsData.split("\r");
        lastStatsStr = arr.pop();
        hasError = lastStatsStr.indexOf("\ncurl:");
        if (hasError >= 0) {
          self._hasError = true;
          return self.emit("error", lastStatsStr);
        } else {
          self._hasError = false;
          parseResult = parser.parseStats(lastStatsStr, self._statsFilter);
          if (parseResult != null) {
            self._progress = parseResult.progress;
            return self.emit("statsUpdated", parseResult.info);
          }
        }
      });
      return curl.on("exit", function(code, signal) {
        return self.emit("exit", code, signal);
      });
    };
    return ncURL;
  })();
  /* exports */
  exports.ncURL = ncURL;
}).call(this);
