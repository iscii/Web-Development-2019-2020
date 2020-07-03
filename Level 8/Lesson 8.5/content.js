const CONTENT_TYPES = [{extension: "html", type:"text"}, {extension: "js", type:"text"}, {extension: "css", type:"text"}, 
                       {extension: "txt", type:"text"}, {extension: "jpg", type:"image"}, {extension: "jpeg", type:"image"}, 
                       {extension: "png", type:"image"}, {extension: "ico", type:"image"}];

exports.getFileTypeObject = function(ext){
    for (let c in CONTENT_TYPES)
        if(CONTENT_TYPES[c].extension == ext)
            return CONTENT_TYPES[c];
}