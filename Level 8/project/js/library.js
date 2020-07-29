
function Menupet(pet){
    this.div = document.createElement("div");
    this.div.className = "menupet";
    this.div.id = pet.type + "_" + pet.name;
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
    this.img.src = pet.basic.image;
    this.img.style.width = "70%"; //100% of div
    
    this.div.appendChild(this.img);
    this.div.innerHTML += "<br/>" + pet.name;
}