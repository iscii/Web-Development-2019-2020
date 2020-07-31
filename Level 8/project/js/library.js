
function Menupet(pet){
    this.div = document.createElement("div");
    this.div.className = "menupet";
    this.div.id = pet.info.type + "_" + pet.info.name;
    this.div.onclick = function(){
        if(opCreate.style.display == "flex") return;
        ajax("writedata", "data", "currentPet", this.id);
        console.log("selected " + this.id);
        popMenu(false);
    }
    this.div.oncontextmenu = function(e){
        e.preventDefault();
        disownPet(this.id);
    }
    
    this.img = document.createElement("img");
    this.img.src = pet.image;
    this.img.style.width = "70%"; //100% of div
    this.img.className = "menupetimg";
    
    this.div.appendChild(this.img);
    this.div.innerHTML += "<br/>" + pet.info.name;
}

function Bar(value){
    this.bar = document.createElement("progress");
    this.bar.className = "statbar";
    this.bar.min = 0;
    this.bar.max = 10;
    this.bar.value = value/10;
}