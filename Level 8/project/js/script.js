const NEWPETS = ["new0", "new1", "new2"];
const BOOMER = 0, CLIPPER = 1, DRUPPER = 2;

function init(){
    //refs
    opPet = document.getElementById("petimg");
    opMenuSet = document.getElementById("petmenuset");
    opMenu = document.getElementById("petmenu");
    opCreate = document.getElementById("createmenu");
    nameForm = document.getElementById("nameform");

    selected = null;
    currentPet = null;

    getData("petframe");
}
function createNew(){
    getData("pet");
    getData("filecount");
}

function createSelect(type){
    selected = type.toUpperCase();
    display();
}

function getData(pathname){
    console.log("getting data from " + pathname);
    var request = new XMLHttpRequest();
    var url = "http://localhost:8081/";
    if(pathname == "pet"){
        url += "pet?type=" + selected.toLowerCase() + "&name=" + nameForm.name.value;
    }
    else{
        url += pathname;
    }

    console.log(url);

    request.open("GET", url, true)
    request.onreadystatechange = function(){
        if(request.readyState == 4){
            var data = request.responseText;

            if(pathname == "petframe"){
                petBase = JSON.parse(data);
            }
            if(pathname == "pet"){
                currentPet = JSON.parse(data);
            }
            if(pathname == "filecount"){
                petcount = data;
            }
            display();
        }
    }
    request.send();
}

function togglePop(type){
    if(type == "menu") var target = opMenuSet;
    if(type == "create") var target = opCreate;

    if(target.style.display == "none")
        return target.style.display = "flex";
    target.style.display = "none";
    
    if(type == "menu" && opCreate.style.display == "flex") opCreate.style.display = "none";
}
function display(){
    //currentpet
    if(currentPet)
        opPet.src = currentPet.basic.image;

    //petsmenu


    //createnew
    for(item in NEWPETS){
        document.getElementById(NEWPETS[item]).style.border = "2px solid black";
        if(item == eval(selected)) document.getElementById(NEWPETS[item]).style.border = "2px solid white";
    }
}
