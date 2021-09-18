const http = require("http");
const fs = require("fs");
const url = require("url");
const content = require("./content");
const client = require("./clientdata");

http.createServer(function(request, response){
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    response.setHeader("Access-Control-Allow-Headers", "X-Requested-With, contenttype");
    response.setHeader("Access-Control-Allow-Credentials", true);

    var pathname = url.parse(request.url).pathname.substring(1);
    if(pathname == "") //automatically loads index.html without having to put it in the pathname
        pathname = "index.html";
    //console.log("Request for " + pathname + " received.");

    var ext = pathname.substring(pathname.indexOf(".") + 1); //takes pathname, returns the string after the "." character (filetype). ext = extension
    
    if(ext == pathname)
        response.end(client.getClientData(pathname, request)); //calls the clientdata function
    else{
        fs.readFile(pathname, function(err, data){
            var contentType = content.getFileTypeObject(ext);
            //console.log("File type is " + contentType.type + "/" + contentType.extension);
            
            if(err){
                console.log(err);
                response.writeHead(404, {"Content-Type": contentType.type + "/" + contentType.extension});
            }
            else{
                response.writeHead(200, {"Content-Type": contentType.type + "/" + contentType.extension});
                
                if(contentType.type != "text"){
                    response.write(data, "binary");
                }
                else{
                    response.write(data.toString());
                }
            }
            response.end();
        });
    }
}).listen(8081);

console.log("Server running at http://localhost:8081")