#!/usr/bin/env node

var url = require("url");
var path = require("path");

var colors = require("colors");

var ncURL = require("./lib/ncURL").ncURL;
var STATS = require("./lib/ncURL_parser").STATS;

targetUrl = "http://www.lopers.net/students/p/pedersendm/images/USA%20Map%20Only.jpg"
filename = url.parse(targetUrl).pathname.split("/").pop();
filename = decodeURIComponent(filename);

destDir = __dirname
output = path.join(destDir, filename);

var obj = new ncURL(targetUrl, output);
obj.on("statsUpdated", function(info) {
    var progress = "Progress: " + info[STATS.ReceivedPercentage].green + "%".green +
                    " at Speed: " + info[STATS.AverageDload].green +
                    " with Time " + info[STATS.TimeLeft].green + " left\r";
    process.stdout.write(progress); 
});
    
obj.start();