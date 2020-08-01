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
            console.log("writing to " + qdata.file);
            if(qdata.file == "data"){
                var data = JSON.parse(fs.readFileSync("./js/data.json").toString());
                var prevdata = data[qdata.property];
                if(qdata.value == "null") qdata.value = null;
                data[qdata.property] = qdata.value;
                //console.log(data);
                fs.writeFileSync("./js/data.json", JSON.stringify(data, null, 4), function(err){
                    if(err)
                        throw err;
                    console.log("Updated " + qdata.file + "'s from [" + prevdata + "] to [" + qdata.value + "]");
                });
            }
            else{
                var data = JSON.parse(fs.readFileSync("./js/Pets/" + qdata.file + ".json").toString());
                var prevdata = data[qdata.property];
                data[qdata.property] = JSON.parse(qdata.value);
                //console.log(data);
                fs.writeFileSync("./js/Pets/" + qdata.file + ".json", JSON.stringify(data, null, 4), function(err){
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
                petdata.push(fs.readFileSync("./js/Pets/" + pets[item]).toString()); //turns the object into a string
            }
            //console.log(petdata);
            return JSON.stringify(petdata); //turns the array into a string. Apparently only strings can be returned in AJAX? I always get a JSON error
    
        case "create":
            var qdata = parseQueryString(request);

            //check if pet already exists
            var pets = fs.readdirSync("./js/Pets");
            for(item in pets)
                if(pets[item] == qdata.type + "_" + qdata.name + ".json")
                    return "false";

            var frames = JSON.parse(fs.readFileSync("./js/frame.json").toString());
            
            for(item in frames){
                if(frames[item].info.type == qdata.type){
                    frames[item].info.name = qdata.name;
                    var stats = JSON.stringify(frames[item], null, 4);
                }
            }

            fs.appendFile("./js/Pets/" + qdata.type + "_" + qdata.name + ".json", stats, function(err){ //apppendfile, writefile?
                if(err)
                    throw err;
                console.log("Created " + qdata.name + " of " + qdata.type);
            });
            return stats;

        case "delete":
            var qdata = parseQueryString(request);
            fs.unlink("./js/Pets/" + qdata.file + ".json", (err) =>{
                if(err)
                    throw err;
                console.log(qdata.file + " deleted");
            });
    }
    return "";
}
function parseQueryString(request){
    var qdata = url.parse(request.url).search.substring(1);
    return qs.parse(qdata);
}