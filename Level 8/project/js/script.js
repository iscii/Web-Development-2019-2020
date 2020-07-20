function init(){
    //refs
    opPet = document.getElementById("petimg");

    getData("petbase");
}
function getData(pathname){
    var request = new XMLHttpRequest();

    request.open("GET", "http://localhost:8081/" + pathname, true)
    request.onreadystatechange = function(){
        if(request.readyState == 4){
            data = request.responseText;
            petBase = JSON.parse(data);
            console.log(petBase);
        }
    }
    request.send();
}