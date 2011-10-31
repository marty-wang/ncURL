STATS = 
    TotalPercentage   : 0
    Total             : 1
    ReceivedPercentage: 2
    Received          : 3
    XferdPercentage   : 4
    Xferd             : 5
    AverageDload      : 6
    SpeedUpload       : 7
    TimeTotal         : 8
    TimeSpent         : 9
    TimeLeft          : 10
    CurrentSpeed      : 11

STATS_COUNT = 0
STATS_COUNT++ for stat of STATS

STATS_PATTERN = /[a-zA-Z0-9:-]+/g

###
    get the stat info based on stats string and stat type
    return either an array of all the stats or the specified one of string type or null if otherwise
    example:
        statsStr = "100 3517k  100 3517k    0     0   215k      0  0:00:16  0:00:16 --:--:-- 47546"
        _getStatsInfo statsStr, STATS.CurrentSpeed, STATS.ReceivedPercentage, STATS.Received, STATS.Total
###
_getStatsInfo = (statsStr = "", stats...) ->
    statsArr = statsStr.match STATS_PATTERN

    return null if not statsArr? or statsArr.length < STATS_COUNT
    return statsArr unless stats?
    statsArr[stat] for stat in stats


#####################################################################################

fs = require "fs"
spawn = require("child_process").spawn

testUrl = "http://www.lopers.net/students/p/pedersendm/images/USA%20Map%20Only.jpg"
output = "/Users/mowang/Desktop/holly.jpg"

curl = spawn "curl", ["-o", output, testUrl] 

curl.stdout.on "data", (data) ->
    console.log "stdout #{data}"

curl.stdout.on "end", () ->
    console.log "stdout end"

statsData = ""
curl.stderr.setEncoding "utf8"
curl.stderr.on "data", (data) ->
    statsData += data
    arr = statsData.split "\r"
    lastStatsStr = arr[arr.length-1]
    statsInfo = _getStatsInfo lastStatsStr, STATS.CurrentSpeed, STATS.ReceivedPercentage, STATS.Received, STATS.Total 
    console.log statsInfo if statsInfo?

curl.on "exit", (code)->
    console.log code  