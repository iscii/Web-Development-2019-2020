function init(){
    //refs
    opPet = document.getElementById("petimg");
    opMenu = document.getElementById("petmenuset");
    opSel = document.getElementById("newselectionset");

    getData("petbase");
}
function createNew(type){

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

function togglePop(type){
    if(type == "menu") var target = opMenu;
    if(type == "create") var target = opSel;

    if(target.style.display == "none")
        return target.style.display = "block";
    target.style.display = "none";
    
    if(type == "menu" && opSel.style.display == "block") opSel.style.display = "none";
}
function display(){

}