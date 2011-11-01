(function() {
  var STATS, VERSION_NUMBER, args, colors, destDir, download, filename, filenameTmp, fs, ncURL, output, outputTmp, packageContent, packageObj, packagePath, path, program, root, targetUrl, url, util;
  url = require("url");
  path = require("path");
  fs = require("fs");
  colors = require("colors");
  program = require("commander");
  ncURL = require("../lib/ncURL").ncURL;
  STATS = require("../lib/ncURL_parser").STATS;
  util = require("../lib/util");
  VERSION_NUMBER = "x.x.x";
  root = path.resolve(__dirname, "..");
  packagePath = path.join(root, "package.json");
  try {
    packageContent = fs.readFileSync(packagePath, "utf8");
    packageObj = JSON.parse(packageContent);
    VERSION_NUMBER = packageObj["version"];
  } catch (e) {
    console.error("Cannot find version number");
  }
  program.version(VERSION_NUMBER).option('-o --output <path>', 'specify the destination').parse(process.argv);
  args = program.args;
  if (args.length <= 0) {
    return console.error("No URL specified!");
  }
  destDir = path.join(process.env['HOME'], "ncURL_downloads");
  if (!path.existsSync(destDir)) {
    fs.mkdirSync(destDir, 0755);
  }
  targetUrl = args[0];
  filename = url.parse(targetUrl).pathname.split("/").pop();
  filename = decodeURIComponent(filename);
  filename = util.getOutputFilename(destDir, filename);
  filenameTmp = filename + ".ncurltmp";
  outputTmp = path.join(destDir, filenameTmp);
  output = path.join(destDir, filename);
  download = new ncURL(targetUrl, outputTmp);
  download.on("statsUpdated", function(info) {
    var progress;
    progress = "Progress: " + info[STATS.ReceivedPercentage].green + "%".green + " at Speed: " + info[STATS.AverageDload].green + " with Time " + info[STATS.TimeLeft].green + " left\r";
    return process.stdout.write(progress);
  });
  download.on("error", function(error) {
    return console.error(error.red);
  });
  download.on("end", function(result) {
    switch (result.status) {
      case "success":
        return fs.rename(result.data.filePath, output, function(err) {
          if (err != null) {
            return console.error(("Failed to rename " + filenameTmp + " to " + filename).red);
          }
          return console.log("Download is saved at " + output.green);
        });
      case "incomplete":
        return console.log("\nDownload stops at progress " + ("" + result.data.progress + "%").yellow);
    }
  });
  download.on("exit", function(code, signal) {
    return console.log("\nncurl exits at code " + code + " signal " + signal);
  });
  download.start();
}).call(this);
