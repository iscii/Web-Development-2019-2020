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
        updateStats();
    }

    updatePets();

    console.log(date.getSeconds());

    //seconds till next minute
    if(date.getSeconds() == 0){
        updateMin();
    }
    else{
        setTimeout(function(){
            updateMin();
        }, 10000); //60  - date.getseconds
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
    updateStats();
    updatePets();
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
    updateStats();

    updatePets();
}

//pet
function updateStats(){
    for(item in pets){
        var p = pets[item];
        //last played
        p.played += 1;

        //spirit
        if(p.played > p.info.energy){
            p.spirit -= 1; //p.spirit *= 0.9;
        }

        //hunger
        p.hunger += 1;//p.hunger + (p.hunger * (.1 * p.info.appetite));
        
        //fatigue
        p.fatigue += 1;//p.fatigue + (p.fatigue * (.05 * p.info.energy));

        //health
        switch(true){
            //separating these since I think they are meant to stack
            case p.hunger > 50:
                p.health[0] *= 0.9;
                p.fatigue *= 1.1;
            break;
            case p.health[0] < 50:
                p.health[0] *= 0.95;
                p.fatigue *= 1.1;
            break; 
            case p.spirit < 50:
                p.health[0] *= 0.9;
                p.fatigue *= 1.1;
            break;
            case p.fatigue > 50:
                p.health[0] *= 0.9;    
            break;
        }
        
        //age. [0] = hour, [1] = day.
        p.age[0] += 1;
        if(p.age[0] == 24){
            p.age[0] = 0;
            p.age[1] += 1;

            if(p.age[1] >= (p.info.lifespan)){
                p.health[1] -= 10;
            }
        }
        capStats(p);
    }

    checkDeath();
}
function actionPet(action){
    for(item in pets){
        if(pets[item].info.type + "_" + pets[item].info.name == currentPet.info.type + "_" + currentPet.info.name){
            var p = pets[item];
        }
    }
    switch(action){
        case "feed":
            if(p.hunger == 10) return console.log(p.info.name + " is full!");
            if(p.hunger < 20){
                p.health[0] *= 0.95;
            }
            else{
                p.health[0] *= 1.05;
            }
            p.hunger -= 30; //allow the user to feed the pet multiple times 'cause the health < 50 causing the health to deplete further makes it very difficult to make the pet healthy again

            checkDeath();
        break;
        case "play":
            if(p.played == 0) console.log(p.info.name + " does not want to play.");
            if(p.played < p.info.energy){
                p.fatigue += 0.2; //p.fatigue *= 1.2;
            }

            //duration = 1-3 hrs (slider value)

            //call this at the end
            p.played = 0;
            p.spirit += 30; // * duration
        break;
        case "sleep":
            if(p.fatigue < 40) return console.log(p.info.name + " is not tired");
            
            //duration = p.energy * 2
            p.fatigue = 10;
            p.spirit *= 1.5;
            p.health[0] *= 1.1;
            console.log(p.health[0]);
        break;
    }

    capStats(p);
    checkDeath();

    updatePets();
}
function updatePets(){
    for(item in pets){
        ajax(true, "writedata", pets[item].info.type + "_" + pets[item].info.name, "all", JSON.stringify(pets[item]));
        ajax(true, "getdata");
    }
}
function checkDeath(){
    for(item in pets){
        if(pets[item].health[0] <= 10){
            //death
            console.log("death");
        }
    }
}
function capStats(p){
    //round
    p.health[0] = Math.ceil(p.health[0])
    p.spirit = Math.ceil(p.spirit);
    p.hunger = Math.ceil(p.hunger);
    p.fatigue = Math.ceil(p.fatigue);

    //health
    if(p.health[0] > p.health[1]) p.health[0] = p.health[1];
    //spirit
    if(p.spirit > 100) p.spirit = 100;
    if(p.spirit < 0) p.spirit = 0;
    //hunger
    if(p.hunger > 100) p.hunger = 100;
    if(p.hunger < 10) p.hunger = 10;
    //fatigue
    if(p.fatigue > 100) p.fatigue = 100;
    if(p.fatigue < 10) p.fatigue = 10;
    
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
                    display("menu");
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
            if(item == "info" || item == "played" || item == "busy") continue;
            
            //stats
            var x = capitalize(item);
            var y = currentPet[item];

            if(item == "age"){
                opStats.innerHTML += x + ": " + y[1] + " days " + y[0] + " hour";
                if(y[0] > 1 || y[0] == 0) opStats.innerHTML += "s";
            }
            else{
                if(item == "health") y = y[0];

                opStats.innerHTML += x + ": " + y;
                opStats.innerHTML += "%";
                
                var name = "ltrstatbar";
                if(item == "hunger" || item == "fatigue") name = "rtlstatbar";

                var bar = new Bar(y, name);
                opStats.appendChild(bar.bar);
            }
            
            opStats.innerHTML += "<br/>";
        }
    }
}
function capitalize(str){
    return str.substr(0, 1).toUpperCase() + str.substr(1, str.length - 1);
}