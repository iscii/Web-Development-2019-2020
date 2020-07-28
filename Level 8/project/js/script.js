const NEWPETS = ["new0", "new1", "new2"];
const BOOMER = 0, CLIPPER = 1, DRUPPER = 2;

function init(){
    //refs
    opPet = document.getElementById("petimg");
    opMenuSet = document.getElementById("petmenuset");
    opMenu = document.getElementById("petmenu");
    opCreate = document.getElementById("createmenu");
    nameForm = document.getElementById("nameform");

    nameform.onkeypress = function(e){
        if(e.keyCode == 13){
            e.preventDefault();
        }
    }

    selected = null;
    initialize = true;
    pets = [];
    currentPet = null;
    
    ajax("getpets"); //this ajax call must be first in order to create the pets variable for display()
    ajax("getdata");
}
function createSelect(type){
    selected = type.toUpperCase();
    displayMenu();
}

function selectPet(filename){
    console.log("selected " + filename);
    togglePop("menu");
    ajax("writedata", "data", "currentPet", filename);
}
function disownPet(filename){
    if(filename == currentPet.type + "_" + currentPet.name) return console.log("You cannot disown your current pet");
    ajax("delete", filename)
}

function ajax(tag, file, property, value){
    console.log("getting data from " + tag);
    var request = new XMLHttpRequest();
    var url = "http://localhost:8081/";

    switch(tag){
        case "writedata":
            url += "writedata?file=" + file + "&property=" + property + "&value=" + value; //file = pet json or data json
        break;
        case "create":
            url += "create?type=" + selected.toLowerCase() + "&name=" + nameForm.name.value;
        break;
        case "delete":
            url += "delete?file=" + file;
        break;
        default:
            url += tag;
    }

    console.log(url);

    request.open("GET", url, true)
    request.onreadystatechange = function(){
        if(request.readyState == 4){
            var data = request.responseText;

            switch(tag){
                case "getdata":
                    gamedata = JSON.parse(data);
                    //if(!pets[0]) ajax("writedata", "data", "currentPet", null);
                    for(item in pets){
                        if(pets[item].type + "_" + pets[item].name == gamedata.currentPet){
                            currentPet = pets[item];
                        }
                    }
                    console.log(gamedata);
                    displayPet();
                break;
                case "writedata":
                    //if(gamedata.currentPet == null) break;
                    if(file == "data"){
                        ajax("getdata");
                    }
                    else ajax("getpets");
                break;
                case "getpets":
                    pets = JSON.parse(data);
                    for(item in pets){
                        pets[item] = JSON.parse(pets[item]);
                    }
                    console.log(pets);
                    displayMenu();
                break;
                case "create":
                    if(!currentPet) ajax("writedata", "data", "currentPet", JSON.parse(data).type + "_" + JSON.parse(data).name);
                    togglePop("create");
                    ajax("getpets");
                break;
                case "delete":
                    ajax("getpets");
                break;
            }
        }
    }
    request.send();
}

function togglePop(type){
    console.log("pop! " + type);
    if(type == "menu") var target = opMenuSet;
    if(type == "create") var target = opCreate;

    if(target.style.display == "none")
        return target.style.display = "flex";
    target.style.display = "none";
    
    if(type == "menu" && opCreate.style.display == "flex") opCreate.style.display = "none";
}
function displayMenu(){
    //petsmenu
    if(pets[0]){
        opMenu.innerHTML = "";
        for(item in pets){
            var pet = new Menupet(pets[item]);
            opMenu.appendChild(pet.div);
        }
    }

    //createnew
    for(item in NEWPETS){
        document.getElementById(NEWPETS[item]).style.border = "2px solid black";
        if(item == eval(selected)) document.getElementById(NEWPETS[item]).style.border = "2px solid white";
    }
}
function displayPet(){
    opPet.src = currentPet.basic.image;
}