const fs = require("fs");
const qs = require("qs"); //had to first run npm install --save qs on cmd prompt
const url = require("url");

exports.getClientData = function(pathname, request){
    console.log("pathname = " + pathname);
    switch(pathname){
        case "getdata":
            var data = fs.readFileSync("./js/data.json").toString();
            return data;

        case "writedata":
            var qdata = parseQueryString(request);
            if(qdata.file = "data"){
                var data = JSON.parse(fs.readFileSync("./js/data.json").toString());
                var prevdata = data[qdata.property];
                data[qdata.property] = qdata.value;
                console.log(data);
                fs.writeFileSync("./js/data.json", JSON.stringify(data, null, 4), function(err){
                    if(err)
                        throw err;
                    console.log("Updated " + qdata.file + "'s from [" + prevdata + "] to [" + qdata.value + "]");
                });
            }
        break;

        case "getpets":
            var pets = fs.readdirSync("./js/Pets");
            var petdata = [];
            for(item in pets){
                petdata.push(fs.readFileSync("js/Pets/" + pets[item]).toString()); //turns the object into a string
            }
            console.log(petdata);
            return JSON.stringify(petdata); //turns the array into a string. Apparently only strings can be returned in AJAX? I always get a JSON error
    
        case "create":
            var qdata = parseQueryString(request);
            var frames = JSON.parse(fs.readFileSync("./js/frame.json").toString());
            
            for(item in frames){
                if(frames[item].type == qdata.type){
                    frames[item].name = qdata.name;
                    var stats = JSON.stringify(frames[item], null, 4);
                }
            }

            fs.appendFile("./js/Pets/" + qdata.type + "_" + qdata.name + ".json", stats, function(err){ //apppendfile, writefile?
                if(err)
                    throw err;
                console.log("Created " + qdata.name + " of " + qdata.type);
            });
            return stats;
    }
    return "";
}
function parseQueryString(request){
    var qdata = url.parse(request.url).search.substring(1);
    return qs.parse(qdata);
}