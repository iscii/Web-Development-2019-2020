var fs = require("fs");

exports.getClientData = function(pathname){
    if(pathname == "getimages"){
        var imageList = fs.readdirSync("images/");
        return imageList.toString();
    }

    return "";
}