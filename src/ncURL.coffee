fs = require "fs"
spawn = require("child_process").spawn
EventEmitter = require('events').EventEmitter

parser = require "./ncURL_parser"
STATS = parser.STATS

###
    An instance of ncURL is not supposed to be re-used,
    meaning that one instance should be created for one task
###
class ncURL extends EventEmitter
  
    constructor: (url, output) ->
        @_url = url
        @_output = output

        @_statsFilter = [
            STATS.Total, 
            STATS.ReceivedPercentage,
            STATS.Received, 
            STATS.AverageDload,
            STATS.TimeLeft,
            STATS.CurrentSpeed
        ]

        @_curl = null
        @_hasError = false
        @_progress = 0
    
    start: ->
        curl = spawn "curl", ["-o", @_output, @_url]
        @_curl = curl
        _registerEventHandlers.call @, curl
    
    stop: ->
        @_curl.kill()

    ### Private ###
    
    _registerEventHandlers = (curl) ->
        self = this
        statsData = ""
        
        curl.stdout.on "end", () ->
            if self._hasError
                result = 
                    status: "error"
            else if self._progress < 100
                result = 
                    status: "incomplete"
                    data: {
                        progress: self._progress
                    }                
            else
                result =
                    status: "success"
                    data: {
                        filePath: self._output
                    }
                     
            self.emit "end", result

        curl.stderr.setEncoding "utf8"
        curl.stderr.on "data", (data) ->
            statsData += data
            arr = statsData.split "\r"
            lastStatsStr = arr.pop()

            hasError = lastStatsStr.indexOf "\ncurl:"
            if hasError >= 0
                self._hasError = true
                self.emit "error", lastStatsStr
            else
                self._hasError = false
                statsInfo = parser.parseStats lastStatsStr, self._statsFilter
                if statsInfo?
                    self._progress = statsInfo[STATS.ReceivedPercentage]
                    self.emit "statsUpdated", statsInfo 

        curl.on "exit", (code, signal)->
            self.emit "exit", code, signal

### exports ###

exports.ncURL = ncURL