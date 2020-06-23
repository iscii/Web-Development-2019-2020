const XLABELS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
const YLABELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const AIRCRAFT = 0, BATTLESHIP = 1, DESTROYER = 2, SUBMARINE = 3, PATROL = 4;

function Grid(player){
    this.player = player;
    this.boxes = [];
    for(let j = 0; j < YLABELS.length; j++){
        for(let i = 0; i < XLABELS.length; i++){
            this.boxes.push(new Box(XLABELS[i], YLABELS[j]));
        }
    }
    this.ships = [new Ship("Aircraft Carrier", 5, this.getBox(['a', 1]), this),
                  new Ship("Battleship", 4, this.getBox(['a', 2]), this),
                  new Ship("Destroyer", 3, this.getBox(['a', 3]), this),
                  new Ship("Submarine", 3, this.getBox(['a', 4]), this),
                  new Ship("Patrol Boat", 2, this.getBox(['a', 5]), this)];

    console.log(this.ships);
}

Grid.prototype.getBox = function(id){ //returns box object in grid from event. id must be an array
    //*strange interaction: [ console.log("a,1" == ['a', 1]); ] when conditionals are <array == array> the condition is false, even if both arrays are equal. However, if it is <string == array> with id being "a,1" and array being ['a', 1], the condition is true.
    return this.boxes[indexesOfArray(this.boxes.map(item => item.elem.id == id), true)];
}

function Box(letter, number){
    this.ship = null;
    this.elem = document.createElement("div");
    this.elem.className = "box";
    this.elem.id = [letter, number]; //note in getBox prototype
    this.id = [letter, number]; //this may seem redundant, but this.elem.id is a string and this.id is an array.
}

function Ship(name, size, control, grid){
    this.name = name;
    this.size = size;
    this.grid = grid;
    this.control = control; //control is the core box which it rotates off
    this.boxes = [];
    this.sunken = false;
    this.horizontal = true;
}

Ship.prototype.occupy = function(){ //maybe parameters for checking but i'm not sure
    label = YLABELS;
    if(this.horizontal) label = XLABELS;
    
    var boxes = [];
    //find boxes
    var start = indexesOfArray(label, this.control.id[+ !this.horizontal])[0];
    for(let i = start; i < (start + this.size); i++){
        if(this.horizontal)
            boxes.push(this.grid.getBox([label[i], this.control.id[+ this.horizontal]]));
        else
            boxes.push(this.grid.getBox([this.control.id[+ !this.horizontal], label[i]]));
    }
    console.log(boxes);

    //check if occupiable
    for(item in boxes){
        if(boxes[item] == undefined || boxes[item].ship){
            console.log("cannot occupy");
            return false; 
        }
    }

    //occupy
    for(item in boxes){
        this.boxes.push(boxes[item]);
        boxes[item].ship = this;
    }
}

Ship.prototype.deoccupy = function(){
    for(item in this.boxes)
        this.boxes[item].ship = null;
    this.boxes = [];
}