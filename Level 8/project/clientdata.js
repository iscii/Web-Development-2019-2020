var fs = require("fs");
var qs = require("qs"); //had to first run npm install --save qs on cmd prompt
var url = require("url");
var script = require("./js/script");

exports.getClientData = function(pathname, request){
    console.log("pathname = " + pathname);
    if(pathname == "petframe"){
        var data = fs.readFileSync("frame.json"); //reads data as binary buffer
        return data.toString(); //convert buffer to string to be split in getData() function
    }
    if(pathname == "pet"){
        console.log("got it");
        /*
        qdata = parseQueryString(request);
        fs.appendFile("js/Pets/" + qdata.type + "_" + qdata.name + ".json", qdata.name, function(err){
            if(err)
                throw err;
            console.log("Created " + qdata.name + " of " + qdata.type);
        });
        return; */
    }

    return "";
}
function parseQueryString(request){
    var qdata = url.parse(request.url).search.substring(1);
    return qs.parse(qdata);
}