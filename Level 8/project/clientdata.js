var fs = require("fs");
var qs = require("qs");
const { parse } = require("path");

exports.getClientData = function(pathname, request){
    if(pathname == "petframe"){
        var data = fs.readFileSync("frame.json");
        return data.toString();
    }
    if(pathname == "create"){
        qdata = parseQueryString(request);
        //fs.appendFile("js/Pets/")
    }

    return "";
}
function parseQueryString(request){
    var qdata = url.parse(request.url).search.substring(1);
    return qs.parse(qdata);
}