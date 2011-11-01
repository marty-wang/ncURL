(function() {
  var extractFilename, fixFilename, fs, getOriginalFilenameBase, getOutputFilename, path;
  fs = require("fs");
  path = require("path");
  getOriginalFilenameBase = function(filenameBase) {
    var dupIdx, lastMark, nonNegativeIntRegEx, origFilenameBase;
    nonNegativeIntRegEx = /^([\d])+$/g;
    lastMark = filenameBase.lastIndexOf("-");
    origFilenameBase = filenameBase;
    if (lastMark >= 0) {
      dupIdx = filenameBase.substr(lastMark + 1);
      if (nonNegativeIntRegEx.test(dupIdx)) {
        origFilenameBase = filenameBase.substr(0, lastMark);
      }
    }
    return origFilenameBase;
  };
  extractFilename = function(filename) {
    var filenameBase, filenameExt, lastDot, origFilenameBase, result;
    result = null;
    lastDot = filename.lastIndexOf(".");
    if (lastDot >= 0) {
      filenameBase = filename.substr(0, lastDot);
      filenameExt = filename.substr(lastDot + 1);
      origFilenameBase = getOriginalFilenameBase(filenameBase);
    } else {
      filenameBase = filename;
      origFilenameBase = getOriginalFilenameBase(filenameBase);
      filenameExt = null;
    }
    return result = [origFilenameBase, filenameExt];
  };
  getOutputFilename = function(dir, filename) {
    var counter, extracts, filePath, filenameBase, filenameExt, newFilename;
    extracts = extractFilename(filename);
    filenameBase = extracts[0];
    filenameExt = extracts[1];
    counter = 0;
    filePath = path.join(dir, filename);
    newFilename = filename;
    while (path.existsSync(filePath)) {
      newFilename = filenameBase + "-" + (++counter);
      if (filenameExt != null) {
        newFilename += "." + filenameExt;
      }
      filePath = path.join(dir, newFilename);
    }
    return newFilename;
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
