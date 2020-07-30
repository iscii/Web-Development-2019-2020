const NEWPETS = ["new0", "new1", "new2"];
const BOOMER = 0, CLIPPER = 1, DRUPPER = 2;

function init(){
    //refs
    opPet = document.getElementById("petimg");
    opMenuSet = document.getElementById("petmenuset");
    opMenu = document.getElementById("petmenu");
    opCreate = document.getElementById("createmenu");
    nameForm = document.getElementById("nameform");
    playTime = document.getElementById("playtime");
    opPlayTime = document.getElementById("playtimespan");
    opStats = document.getElementById("statspanel");
    opInfo1 = document.getElementById("petinfo1");
    opInfo2 = document.getElementById("petinfo2");

    //events
    nameform.onkeypress = function(e){
        if(e.keyCode == 13){
            e.preventDefault();
        }
    }
    playTime.oninput = function(){
        opPlayTime.innerHTML = this.value + " hr";
        if(this.value > 1) opPlayTime.innerHTML += "s";
    }

    selected = null;
    initialize = true;
    pets = [];
    currentPet = null;
    
    ajax("getpets"); //this ajax call must be first in order to create the pets variable for display()
    ajax("getdata");
}

//general
function createSelect(type){
    selected = type.toUpperCase();
    display("menu");
}
function createPet(){
    if(!selected || !nameForm.name.value) return console.log("invalid creation"); //also check if the pet of same type & name's been made already
    ajax('create');
}
function disownPet(filename){
    if(filename == currentPet.info.type + "_" + currentPet.info.name) return console.log("You cannot disown your current pet");
    ajax("delete", filename)
}
window.onbeforeunload = function(){
    
}

//pet
function timediff(){
    var date = new Date(); //date is static
    console.log(date);
    console.log(date.getSeconds());

    //seconds till next minute; begins the minutely updates
    if(date.getSeconds() == 0){
        updateMin();
    }
    else{
        setTimeout(function(){
            updateMin();
        }, (59 - date.getSeconds()) * 1000);
    }

    //mintes from last session
}
function updateMin(){
    var date = new Date();
    console.log(date.getMinutes());
    setTimeout(function(){
        updateMin();
    }, 60000);
}

//server
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
                    var gamedata = JSON.parse(data);
                    for(item in pets){
                        console.log(pets);
                        if(pets[item].info.type + "_" + pets[item].info.name == gamedata.currentPet){
                            currentPet = pets[item];
                        }
                    }
                    console.log(gamedata);
                    if(currentPet){
                        timediff();
                        display("pet");
                    }
                break;
                case "writedata":
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
                    display("menu");
                break;
                case "create":
                    var response = JSON.parse(data);
                    if(!currentPet) ajax("writedata", "data", "currentPet", response.info.type + "_" + response.info.name);
                    if(response === false) return console.log("already exists");

                    selected = null;
                    nameForm.name.value = "";

                    popMenu(false, 'create', true);
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

//display
function popMenu(open, type, nreset){
    if(open){ //open
        if(type == "menu") opMenuSet.style.display = "flex";
        else opCreate.style.display = "flex";
    }
    else{ //close
        if(type != "create") opMenuSet.style.display = "none"; //when both are open, close only the create menu
        opCreate.style.display = "none";
        if(!nreset){
            selected = null;
            nameForm.name.value = "";
        }
    }
    display("menu");
}
function display(str){
    if(str == "menu"){
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
    if(str == "pet"){
        //img
        console.log(currentPet);
        opPet.src = currentPet.image;
        
        opInfo1.innerHTML = "";
        opInfo2.innerHTML = "";
        //info
        for(item in currentPet.info){
            var x = capitalize(item);
            var y = currentPet.info[item];
            var unit = " hours";
        
            if(item == "lifespan") unit = " days";
        
            var sec = opInfo2;
            if(item == "type" || item == "name"){
                sec = opInfo1;
                y = capitalize(currentPet.info[item]);
                unit = "";
            }
            
            sec.innerHTML += x + ": " + y + unit;
            sec.innerHTML += "<br/>";
        }
        
        //stats
        opStats.innerHTML = "";
        for(item in currentPet){
            if(item == "info" || item == "image") continue;
        
            //stats
            var x = capitalize(item);
        
            opStats.innerHTML += x + ": " + currentPet[item];
            
            //unit
            if(item == "health" || item == "spirit" || item == "hunger" || item == "fatigue"){
                opStats.innerHTML += " %";
            }
            if(item == "age" || item == "remaining")
                opStats.innerHTML += " days";
        
            opStats.innerHTML += "<br/>";
        }
    }
}
function capitalize(str){
    return str.substr(0, 1).toUpperCase() + str.substr(1, str.length - 1);
}