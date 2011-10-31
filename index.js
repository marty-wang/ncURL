#!/usr/bin/env node

var url = require("url");
var path = require("path");
var fs = require("fs");

var colors = require("colors");
var program = require("commander");

var ncURL = require("./lib/ncURL").ncURL;
var STATS = require("./lib/ncURL_parser").STATS;

var VERSION_NUMBER = "0.0.1";

program
    .version(VERSION_NUMBER)
    .option('-o --output <path>', 'specify the destination')
    .parse(process.argv)

var args = program.args;
if (args.length <= 0) {
    console.error("No URL specified!");
    return;
}

// http://www.lopers.net/students/p/pedersendm/images/USA%20Map%20Only.jpg
// TODO: need to verfiy if it is legit url
var targetUrl = args[0];
var filename = url.parse(targetUrl).pathname.split("/").pop();
filename = decodeURIComponent(filename);

var destDir = path.join(process.env['HOME'], "ncURL_downloads");
if (!path.existsSync(destDir)) {
    fs.mkdirSync(destDir, 0755);
}

var output = path.join(destDir, filename);

var download = new ncURL(targetUrl, output);
download.on("statsUpdated", function(info) {
    var progress = "Progress: " + info[STATS.ReceivedPercentage].green + "%".green +
                    " at Speed: " + info[STATS.AverageDload].green +
                    " with Time " + info[STATS.TimeLeft].green + " left\r";
    process.stdout.write(progress); 
});
download.on("completed", function(output) {
    console.log("\nDownload is saved at " + output.green);
});

download.start();
