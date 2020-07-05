var fs = require("fs");
var qs = require("qs"); //had to first run npm install --save qs on cmd prompt
var url = require("url");

exports.getClientData = function(pathname, request){
    var qdata = parseQueryString(request);
    if(pathname == "post"){
        fs.appendFile("posts/" + qdata.title + ".txt", qdata.post, function(err){
            if(err)
                throw err;
            console.log("File Uploaded");
        });
    }
    return "";
}
function parseQueryString(request){
    var qdata = url.parse(request.url).search.substring(1);
    return qs.parse(qdata);
}