var fs = require("fs");

exports.getClientData = function(pathname){
    if(pathname == "petbase"){
        var data = fs.readFileSync("frame.json");
        return data.toString();
    }

    return "";
}