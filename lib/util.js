(function() {
  var extractFilename, fixFilename, fs, getOutputFilename, path;
  fs = require("fs");
  path = require("path");
  extractFilename = function(filename) {
    var filenameBase, filenameExt, lastDot;
    lastDot = filename.lastIndexOf(".");
    if (lastDot >= 0) {
      filenameBase = filename.substr(0, lastDot);
      filenameExt = filename.substr(lastDot + 1);
    } else {
      filenameBase = filename;
      filenameExt = null;
    }
    return [filenameBase, filenameExt];
  };
  getOutputFilename = function(dir, filename) {
    var counter, extracts, filePath, filenameBase, filenameExt;
    extracts = extractFilename(filename);
    filenameBase = extracts[0];
    filenameExt = extracts[1];
    counter = 0;
    filePath = path.join(dir, filename);
    while (path.existsSync(filePath)) {
      filename = filenameBase + "-" + (++counter);
      if (filenameExt != null) {
        filename += "." + filenameExt;
      }
      filePath = path.join(dir, filename);
    }
    return filename;
  };
  fixFilename = function(filename, fix) {
    var regEx;
    if (fix == null) {
      fix = "_";
    }
    regEx = /[^0-9a-zA-Z.-_() ]+/g;
    return filename.replace(regEx, fix);
  };
  exports.fixFilename = fixFilename;
  exports.getOutputFilename = getOutputFilename;
}).call(this);
