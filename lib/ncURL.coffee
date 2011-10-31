parser = require "./ncURL_parser"
STATS = parser.STATS

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
    statsInfo = parser.parseStats lastStatsStr, STATS.CurrentSpeed, STATS.ReceivedPercentage, STATS.Received, STATS.Total
    console.log statsInfo if statsInfo?

curl.on "exit", (code)->
    console.log code  