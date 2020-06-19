const XLABELS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
const YLABELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function Grid(player){
    this.player = player;
    this.boxes = [];
    for(let i = 0; i < XLABELS.length; i++){
        for(let j = 0; j < YLABELS.length; j++){
            this.boxes.push(new Box(XLABELS[i], YLABELS[j]));
        }
    }
}

Grid.prototype.getBox = function(e){ //returns box object in grid from event
    var array = this.boxes.map(item => item.elem.id == e.target.id);
    var index = indexesOfArray(array, true);
    return this.boxes[index];
}

function Box(letter, number){
    this.occupied = false;
    this.elem = document.createElement("div");
    this.elem.className = "box";
    this.elem.id = [letter, number];
}