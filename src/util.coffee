fs   = require "fs"
path = require "path"

getOriginalFilenameBase = (filenameBase) ->
    nonNegativeIntRegEx = /^([\d])+$/g
    lastMark = filenameBase.lastIndexOf "-"
    origFilenameBase = filenameBase
    if lastMark >= 0
        dupIdx = filenameBase.substr lastMark+1
        if nonNegativeIntRegEx.test dupIdx
            origFilenameBase = filenameBase.substr 0, lastMark
    
    origFilenameBase

extractFilename = (filename) ->
    result = null
    lastDot = filename.lastIndexOf "."
    if lastDot >= 0
        filenameBase = filename.substr 0, lastDot
        filenameExt = filename.substr lastDot+1
        origFilenameBase = getOriginalFilenameBase filenameBase
    else
        filenameBase = filename
        origFilenameBase = getOriginalFilenameBase filenameBase
        filenameExt = null

    result = [origFilenameBase, filenameExt]

getOutputFilename = (dir, filename) ->
    counter = 0
    filePath = path.join dir, filename
    while path.existsSync filePath
        extracts = extractFilename filename
        newFilename = extracts[0]+"-"+(++counter)
        newFilename += ("."+extracts[1]) if extracts[1]?
        filePath = path.join dir, newFilename

    filePath

fixFilename = (filename, fix = "_") ->
    regEx = /[^0-9a-zA-Z.-_() ]+/g
    filename.replace regEx, fix

exports.fixFilename = fixFilename
exports.getOutputFilename = getOutputFilename