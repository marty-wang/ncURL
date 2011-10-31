url = require "url"
path = require "path"
fs = require "fs"

colors = require "colors"
program = require "commander"

ncURL = require("../lib/ncURL").ncURL
STATS = require("../lib/ncURL_parser").STATS

VERSION_NUMBER = "0.0.1"

program
    .version(VERSION_NUMBER)
    .option('-o --output <path>', 'specify the destination')
    .parse(process.argv)

args = program.args
if args.length <= 0
    return console.error "No URL specified!"

# http://www.lopers.net/students/p/pedersendm/images/USA%20Map%20Only.jpg
# TODO: need to verfiy if it is legit url
targetUrl = args[0]
filename = url.parse(targetUrl).pathname.split("/").pop()
filename = decodeURIComponent(filename);

destDir = path.join process.env['HOME'], "ncURL_downloads"
unless path.existsSync destDir
    fs.mkdirSync destDir, 0755

output = path.join destDir, filename

download = new ncURL targetUrl, output
download.on "statsUpdated", (info) ->
    progress = "Progress: " + info[STATS.ReceivedPercentage].green + "%".green +
               " at Speed: " + info[STATS.AverageDload].green +
               " with Time " + info[STATS.TimeLeft].green + " left\r"
    process.stdout.write progress

download.on "completed", (output) ->
    console.log "\nDownload is saved at " + output.green

download.start();