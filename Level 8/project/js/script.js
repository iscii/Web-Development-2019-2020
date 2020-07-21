const NEWPETS = ["new0", "new1", "new2"];
const BOOMER = 0, CLIPPER = 1, DRUPPER = 2;

function init(){
    //refs
    opPet = document.getElementById("petimg");
    opMenu = document.getElementById("petmenuset");
    opCreate = document.getElementById("createmenu");
    nameForm = document.getElementById("nameform");

    selected = null;

    getData("petframe");
}
function createNew(){
    //take selected
    //take name
    //uhh apple pen
    //getdata
    //appendfile
    //redirect back to normal link?
        //if not, every pet will have their own querystring url
    //display pet depending on qdata

    getData("pet");
    //display();
}
function createSelect(type){
    selected = type.toUpperCase();
    display();
    console.log(selected);
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
                return display();
            }
        }
    }
    request.send();
}

function togglePop(type){
    if(type == "menu") var target = opMenu;
    if(type == "create") var target = opCreate;

    if(target.style.display == "none")
        return target.style.display = "flex";
    target.style.display = "none";
    
    if(type == "menu" && opCreate.style.display == "flex") opCreate.style.display = "none";
}
function display(){
    opPet.src = petBase[0].basic.image;
    for(item in NEWPETS){
        document.getElementById(NEWPETS[item]).style.border = "2px solid black";
        if(item == eval(selected)) document.getElementById(NEWPETS[item]).style.border = "2px solid white";
    }
}
