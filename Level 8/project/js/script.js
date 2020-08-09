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

    initialize = true;
    //empty variables to be retrieved from requests
    selected = null;
    currentPet = null;
    lastsession = null;
    pets = [];
    
    console.log(new Date().getMinutes() - new Date("Fri Aug 07 2020 11:08:43 GMT-0400 (Eastern Daylight Time)").getMinutes());

    ajax(true, "getpets"); //this ajax call must be first in order to create the pets variable for display()
    ajax(true, "getdata");
}

//general
function createSelect(type){
    selected = type.toUpperCase();
    display("menu");
}
function createPet(){
    if(!selected || !nameForm.name.value) return console.log("invalid creation"); //also check if the pet of same type & name's been made already
    ajax(true, 'create');
}
function disownPet(filename){
    if(filename == currentPet.info.type + "_" + currentPet.info.name) return console.log("You cannot disown your current pet");
    ajax(true, "delete", filename)
}
window.onbeforeunload = function(e){
    ajax(true, "writedata", "data", "lastsession", new Date());
    console.log("unload");
}

//time
function timediff(){
    //ajax for data.json lastsession date. if there is none, it's probably first session, so create new date and stuff.
    var date = new Date(); //date is static
    if(lastsession){
        var hoursFLS = date.getHours() - new Date(lastsession).getHours(); //FLS = from last session 
        console.log(hoursFLS);
    }
    for(let i = 0; i < hoursFLS; i++){
        updatePets();
    }

    //write
    for(item in pets){
        ajax(true, "writedata", pets[item].info.type + "_" + pets[item].info.name, "all", JSON.stringify(pets[item]));
        ajax(true, "getdata");
    }

    console.log(date.getSeconds());

    //seconds till next minute
    if(date.getSeconds() == 0){
        updateMin();
    }
    else{
        setTimeout(function(){
            updateMin();
        }, (date.getSeconds()/10 * 1000)); //60  - date.getseconds
        console.log("time left: " + (date.getSeconds()/10));
    }

    //minutes from last session
}
function updateMin(){
    var date = new Date();
    console.log(date.getMinutes());

    setTimeout(function(){ //for testing
        updateMin();
    }, 10000);
    updatePets();

    for(item in pets){
        ajax(true, "writedata", pets[item].info.type + "_" + pets[item].info.name, "all", JSON.stringify(pets[item]));
        ajax(true, "getdata");
    }
    /*
    //minutes till next hour; beings the hourly updates
    if(date.getMinutes() == 0){
        updateHour();
    }
    else{
        setTimeout(function(){
            updateHour();
        }, (60 - date.getMinutes()) * 60000);
        console.log((60 - date.getMinutes()) * 60000);
    }
    */
}
function updateHour(){
    var date = new Date();
    console.log(date.getHours());
    setTimeout(function(){
        updateHour();
    }, 3600000);
    updatePets();

    //write
    for(item in pets){
        ajax(true, "writedata", pets[item].info.type + "_" + pets[item].info.name, "all", JSON.stringify(pets[item]));
        ajax(true, "getdata");
    }
}

//pet
function updatePets(){
    for(item in pets){
        var p = pets[item];
        //appetite
        p.hunger += 1;//Math.round(p.hunger + (p.hunger * (.1 * p.info.appetite)));
        if(p.hunger > 100) p.hunger = 100;
        
        //fatigue
        p.fatigue += 1;//Math.round(p.fatigue + (p.fatigue * (.05 * p.info.energy)));
        if(p.fatigue > 100) p.fatigue = 100;

        //age. [0] = hour, [1] = day.
        p.age[0] += 1;
        if(p.age[0] == 24){
            p.age[0] = 0;
            p.age[1] += 1;
        }
        if(p.age[1] == (p.info.lifespan)){ //make an option for well-being; && p.age[0] > p.wellbeing. Wellbeing serves as extra hours of life and decreases slowly per hour unhealthy.
            //death
        }
    }
}
function actionPet(action){
    switch(action){
        case "feed":

        break;
        case "play":

        break;
        case "sleep":

        break;
    }
}

//server
function ajax(async, tag, file, property, value){
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

    request.open("GET", url, async);
    request.onreadystatechange = function(){
        if(request.readyState == 4){
            var data = request.responseText;

            switch(tag){
                case "getdata":
                    var gamedata = JSON.parse(data);
                    //console.log(pets);
                    for(item in pets){
                        if(pets[item].info.type + "_" + pets[item].info.name == gamedata.currentPet){
                            currentPet = pets[item];
                            display("pet");
                        }
                    }
                    //console.log(gamedata);
                    if(initialize){
                        if(currentPet){
                            lastsession = gamedata.lastsession;
                            timediff();
                        }
                        initialize = false;
                    }
                break;
                case "writedata":
                    if(file == "data"){
                        ajax(true, "getdata");
                    }
                    else ajax(true, "getpets");
                break;
                case "getpets":
                    pets = JSON.parse(data);
                    for(item in pets){
                        pets[item] = JSON.parse(pets[item]);
                    }
                    if(!initialize && currentPet) display("pet");
                    display("menu")
                break;
                case "create":
                    var response = JSON.parse(data);
                    console.log(currentPet);
                    if(!currentPet){
                        ajax(true, "writedata", "data", "currentPet", response.info.type + "_" + response.info.name);
                        timediff();
                    }
                    if(response === false) return console.log("already exists");

                    popMenu(false, 'create', true);
                    ajax(true, "getpets");
                break;
                case "delete":
                    ajax(true, "getpets");
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
    //console.trace();
    //console.log("display " + str);
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
        opPet.src = currentPet.info.image;
        
        opInfo1.innerHTML = "";
        opInfo2.innerHTML = "";
        //info
        for(item in currentPet.info){
            if(item == "image" || item == "lastload") continue;

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
            if(item == "info") continue;
            
            //stats
            var x = capitalize(item);

            if(item == "age"){
                opStats.innerHTML += x + ": " + currentPet[item][1] + " days " + currentPet[item][0] + " hour";
                if(currentPet[item][0] > 1) opStats.innerHTML += "s";
            }
            else{
                opStats.innerHTML += x + ": " + currentPet[item];
                opStats.innerHTML += "%";
                
                var name = "ltrstatbar"
                if(item == "hunger" || item == "fatigue") name = "rtlstatbar";
                var bar = new Bar(currentPet[item], name);
                opStats.appendChild(bar.bar);

            }
            
            opStats.innerHTML += "<br/>";
        }
    }
}
function capitalize(str){
    return str.substr(0, 1).toUpperCase() + str.substr(1, str.length - 1);
}