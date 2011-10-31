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

        # TotalPercentage   : 0
        # Total             : 1
        # ReceivedPercentage: 2
        # Received          : 3
        # XferdPercentage   : 4
        # Xferd             : 5
        # AverageDload      : 6
        # SpeedUpload       : 7
        # TimeTotal         : 8
        # TimeSpent         : 9
        # TimeLeft          : 10
        # CurrentSpeed      : 11
        @_statsFilter = [
            STATS.Total, 
            STATS.ReceivedPercentage, 
            STATS.Received, 
            STATS.AverageDload,
            STATS.TimeLeft,
            STATS.CurrentSpeed
        ]
    
    start: ->
        statsData = ""
        curl = spawn "curl", ["-o", @_output, @_url]
        _registerEventHandlers.call @, curl, statsData

    ### Private ###
    
    _registerEventHandlers = (curl, statsData) ->
        self = this
        
        curl.stdout.on "end", () ->
            # TODO: need to test if it gets called when failure
            # if it gets called in success/failure, specify in the event payload
            self.emit "completed", self._output

        curl.stderr.setEncoding "utf8"
        curl.stderr.on "data", (data) ->
            statsData += data
            arr = statsData.split "\r"
            lastStatsStr = arr.pop()
            statsInfo = parser.parseStats lastStatsStr, self._statsFilter
            self.emit "statsUpdated", statsInfo if statsInfo?

        curl.on "exit", (code)->
            console.log "ncurl exits at code #{code}"


### exports ###

exports.ncURL = ncURL