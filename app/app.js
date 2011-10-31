(function() {
  var STATS, VERSION_NUMBER, args, colors, destDir, download, filename, fs, ncURL, output, packageContent, packageObj, packagePath, path, program, root, targetUrl, url;
  url = require("url");
  path = require("path");
  fs = require("fs");
  colors = require("colors");
  program = require("commander");
  ncURL = require("../lib/ncURL").ncURL;
  STATS = require("../lib/ncURL_parser").STATS;
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
  targetUrl = args[0];
  filename = url.parse(targetUrl).pathname.split("/").pop();
  filename = decodeURIComponent(filename);
  destDir = path.join(process.env['HOME'], "ncURL_downloads");
  if (!path.existsSync(destDir)) {
    fs.mkdirSync(destDir, 0755);
  }
  output = path.join(destDir, filename);
  download = new ncURL(targetUrl, output);
  download.on("statsUpdated", function(info) {
    var progress;
    progress = "Progress: " + info[STATS.ReceivedPercentage].green + "%".green + " at Speed: " + info[STATS.AverageDload].green + " with Time " + info[STATS.TimeLeft].green + " left\r";
    return process.stdout.write(progress);
  });
  download.on("completed", function(output) {
    return console.log("\nDownload is saved at " + output.green);
  });
  download.start();
}).call(this);
