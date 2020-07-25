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
    
    ajax("pets"); //this ajax call must be first in order to create the pets variable for display()
}
function createSelect(type){
    selected = type.toUpperCase();
    display();
}

function ajax(tag){
    console.log("getting data from " + tag);
    var request = new XMLHttpRequest();
    var url = "http://localhost:8081/";
    if(tag == "create"){
        url += "create?type=" + selected.toLowerCase() + "&name=" + nameForm.name.value;
    }
    else if(tag == "petdata"){
        url += "pet?type=" + type + "&name=" + name;
    }
    else{
        url += tag;
    }
    
    console.log(url);

    request.open("GET", url, true)
    request.onreadystatechange = function(){
        if(request.readyState == 4){
            var data = request.responseText;

            if(tag == "pets"){
                pets = JSON.parse(data);
                for(item in pets){
                    pets[item] = JSON.parse(pets[item]);
                }
                if(initialize) currentPet = pets[0];
                initialize = false;
                console.log(pets);
            }
            if(tag == "create"){
                currentPet = JSON.parse(data);
                togglePop("create");
                ajax("pets");
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
    //petsmenu
    if(pets[0]){
        opPet.src = currentPet.basic.image;
        opMenu.innerHTML = "";
        for(item in pets){
            var image = document.createElement("img");
            image.className = "menuimages";
            image.src = pets[item].basic.image;
            opMenu.appendChild(image);
        }
    }

    //createnew
    for(item in NEWPETS){
        document.getElementById(NEWPETS[item]).style.border = "2px solid black";
        if(item == eval(selected)) document.getElementById(NEWPETS[item]).style.border = "2px solid white";
    }
}
