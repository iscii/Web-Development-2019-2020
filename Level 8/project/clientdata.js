const fs = require("fs");
const qs = require("qs"); //had to first run npm install --save qs on cmd prompt
const url = require("url");
const script = require("./js/script");
const { count } = require("console");

exports.getClientData = function(pathname, request){
    console.log("pathname = " + pathname);
    switch(pathname){
        case "petframe":
            var data = fs.readFileSync("frame.json"); //reads data as binary buffer
            return data.toString(); //convert buffer to string to be split in getData() function
    
        case "pet":
            console.log("got it");
    
            var qdata = parseQueryString(request);
            var frames = JSON.parse(fs.readFileSync("frame.json").toString());
            
            for(item in frames){
                if(frames[item].type == qdata.type){
                    frames[item].name = qdata.name;
                    var stats = JSON.stringify(frames[item]);
                }
            }

            fs.appendFile("js/Pets/" + qdata.type + "_" + qdata.name + ".json", stats, function(err){ //apppendfile, writefile?
                if(err)
                    throw err;
                console.log("Created " + qdata.name + " of " + qdata.type);
            });
            return stats;
        
        case "filecount":
            return count;

    }
    /*
    if(pathname == "petframe"){
        var data = fs.readFileSync("frame.json"); //reads data as binary buffer
        return data.toString(); //convert buffer to string to be split in getData() function
    }
    if(pathname == "pet"){
        console.log("got it");
    
        var qdata = parseQueryString(request);
        var frames = JSON.parse(fs.readFileSync("frame.json").toString());
        
        for(item in frames){
            if(frames[item].type == qdata.type){
                frames[item].name = qdata.name;
                var stats = JSON.stringify(frames[item]);
            }
        }

        fs.appendFile("js/Pets/" + qdata.type + "_" + qdata.name + ".json", stats, function(err){ //apppendfile, writefile?
            if(err)
                throw err;
            console.log("Created " + qdata.name + " of " + qdata.type);
        });
        return stats;
    }
    if(pathname == "filecount"){

    }
    */

    return "";
}
function parseQueryString(request){
    var qdata = url.parse(request.url).search.substring(1);
    return qs.parse(qdata);
}