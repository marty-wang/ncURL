#!/usr/bin/env node

var ncURL = require("./lib/ncURL").ncURL;

testUrl = "http://www.lopers.net/students/p/pedersendm/images/USA%20Map%20Only.jpg"
output = "/Users/mowang/Desktop/holly.jpg"

var obj = new ncURL(testUrl, output);
obj.on("statsUpdated", function(info) {
    console.log(info); 
});
    
obj.start();