function init(){
    //refs
    opPet = document.getElementById("petimg");
    opMenu = document.getElementById("petmenuset");
    opSel = document.getElementById("newselection");

    getData("petframe");
}
function createNew(type){
    getData("create");
    display();
}

function getData(pathname){
    var request = new XMLHttpRequest();

    request.open("GET", "http://localhost:8081/" + pathname, true)
    request.onreadystatechange = function(){
        if(request.readyState == 4){
            var data = request.responseText;

            if(pathname == "petframe")
                return petBase = JSON.parse(data);
        }
    }
    request.send();
}

function togglePop(type){
    if(type == "menu") var target = opMenu;
    if(type == "create") var target = opSel;

    if(target.style.display == "none")
        return target.style.display = "flex";
    target.style.display = "none";
    
    if(type == "menu" && opSel.style.display == "flex") opSel.style.display = "none";
}
function display(){

}