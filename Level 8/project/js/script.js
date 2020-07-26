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
    initialize = true;
    
    ajax("getpets"); //this ajax call must be first in order to create the pets variable for display()
    ajax("getdata");
}
function createSelect(type){
    selected = type.toUpperCase();
    displayMenu();
}

function selectPet(filename){
    console.log("select");
    ajax("writedata", "data", "currentPet", filename);
    togglePop("menu");
}

function ajax(tag, file, property, value){
    console.log("getting data from " + tag);
    var request = new XMLHttpRequest();
    var url = "http://localhost:8081/";
    if(tag == "create"){
        url += "create?type=" + selected.toLowerCase() + "&name=" + nameForm.name.value;
    }
    else if (tag == "writedata"){
        url += "writedata?file=" + file + "&property=" + property + "&value=" + value; //file = pet json or data json
    }
    else{
        url += tag;
    }
    
    console.log(url);

    request.open("GET", url, true)
    request.onreadystatechange = function(){
        if(request.readyState == 4){
            var data = request.responseText;

            if(tag == "getdata"){
                gamedata = JSON.parse(data);
                for(item in pets){
                    if(pets[item].type + "_" + pets[item].name == gamedata.currentPet){
                        currentPet = pets[item];
                    }
                }
                console.log(gamedata);
                displayPet();
            }
            if(tag == "writedata"){
                if(file == "data") ajax("getdata");
                else ajax("getpets");
            }
            if(tag == "getpets"){
                pets = JSON.parse(data);
                for(item in pets){
                    pets[item] = JSON.parse(pets[item]);
                }
                console.log(pets);
                displayMenu();
            }
            if(tag == "create"){
                if(!currentPet) ajax("writedata", "data", "currentPet", JSON.parse(data).type + "_" + JSON.parse(data).name);
                togglePop("create");
                ajax("getpets");
                displayMenu();
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
            var image = document.createElement("img");
            image.className = "menuimages";
            image.id = pets[item].type + "_" + pets[item].name;
            image.src = pets[item].basic.image;
            image.onclick = function(){
                selectPet(this.id);
            }
            opMenu.appendChild(image);
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
