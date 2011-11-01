# url = require "url"
# path = require "path"
# fs = require "fs"

# colors = require "colors"
# program = require "commander"

# ncURL = require("../lib/ncURL").ncURL
# STATS = require("../lib/ncURL_parser").STATS

# VERSION_NUMBER = "x.x.x"

# root = path.resolve __dirname, ".."
# packagePath = path.join root, "package.json"

# try
#     packageContent = fs.readFileSync packagePath, "utf8"
#     packageObj = JSON.parse packageContent
#     VERSION_NUMBER = packageObj["version"]
# catch e
#     console.error "Cannot find version number"

# program
#     .version(VERSION_NUMBER)
#     .option('-o --output <path>', 'specify the destination')
#     .parse(process.argv)

# args = program.args
# if args.length <= 0
#     return console.error "No URL specified!"

# # http://www.lopers.net/students/p/pedersendm/images/USA%20Map%20Only.jpg
# # TODO: need to verfiy if it is legit url
# targetUrl = args[0]
# filename = url.parse(targetUrl).pathname.split("/").pop()
# filename = decodeURIComponent(filename) # need to fix file name
# filenameTmp = filename + ".ncurltmp"

# destDir = path.join process.env['HOME'], "ncURL_downloads"
# unless path.existsSync destDir
#     fs.mkdirSync destDir, 0755

# outputTmp = path.join destDir, filenameTmp
# output = path.join destDir, filename

# download = new ncURL targetUrl, outputTmp
# download.on "statsUpdated", (info) ->
#     progress = "Progress: " + info[STATS.ReceivedPercentage].green + "%".green +
#                " at Speed: " + info[STATS.AverageDload].green +
#                " with Time " + info[STATS.TimeLeft].green + " left\r"
#     process.stdout.write progress

# download.on "completed", (outputPath) ->
#     fs.rename outputPath, output, (err) ->
#         if err?
#             return console.error "Failed to rename #{filenameTmp} to #{filename}".red
#         console.log "Download is saved at " + output.green

# download.start();

util = require "../lib/util.js"

testDir = "/Users/mo.wang/ncURL_downloads"
filename = "USA Map Only.jpg"

console.log util.getOutputFilename testDir, filename
            