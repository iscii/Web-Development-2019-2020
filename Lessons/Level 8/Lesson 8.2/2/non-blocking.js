var fs = require("fs");

fs.readFile("input.txt", function (err, data){
    if(err)
        return console.log(err);
    console.log(data.toString());
});

console.log("Program Ended");