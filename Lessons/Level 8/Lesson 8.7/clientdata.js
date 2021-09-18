var fs = require("fs");

exports.getClientData = function(pathname){ //when does this get called?
    console.log(pathname);
    if(pathname == "getdata"){
        console.log("yes");
        var data = fs.readFileSync("itemdata.txt"); //reads data as binary buffer
        return data.toString(); //convert buffer to string to be split in getData() function
    }

    return "";
}