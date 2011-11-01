fs   = require "fs"
path = require "path"

extractFilename = (filename) ->
    lastDot = filename.lastIndexOf "."
    if lastDot >= 0
        filenameBase = filename.substr 0, lastDot
        filenameExt = filename.substr lastDot+1
    else
        filenameBase = filename
        filenameExt = null

    [filenameBase, filenameExt]

getOutputFilename = (dir, filename) ->
    extracts = extractFilename filename
    filenameBase = extracts[0]
    filenameExt = extracts[1]
    counter = 0
    filePath = path.join dir, filename

    while path.existsSync filePath
        filename = filenameBase+"-"+(++counter)
        filename += ("."+filenameExt) if filenameExt?
        filePath = path.join dir, filename

    filename

fixFilename = (filename, fix = "_") ->
    regEx = /[^0-9a-zA-Z.-_() ]+/g
    filename.replace regEx, fix

exports.fixFilename = fixFilename
exports.getOutputFilename = getOutputFilename