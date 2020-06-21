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
    this.ships = [new Ship("Aircraft Carrier", 5, ['a', 1], this),
                  new Ship("Battleship", 4, ['a', 2], this),
                  new Ship("Destroyer", 3, ['a', 3], this),
                  new Ship("Submarine", 3, ['a', 4], this),
                  new Ship("Patrol Boat", 2, ['a', 5], this)];

    console.log(this.ships);
}

Grid.prototype.getBox = function(id, isEvent){ //returns box object in grid from event. id must be an array
    if(isEvent)
        id = id.target.id;
    var array = this.boxes.map(item => item.elem.id == id);
    var index = indexesOfArray(array, true);
    
    return this.boxes[index];
}

function Box(letter, number){
    this.occupied = false;
    this.elem = document.createElement("div");
    this.elem.className = "box";
    this.elem.id = [letter, number];
}

function Ship(name, size, control, grid){
    this.name = name;
    this.sunken = false;
    this.horizontal = true;
    this.size = size;
    this.grid = grid;
    this.control = control; //control is the core box which it rotates off
}

Ship.prototype.occupy = function(){
    label = YLABELS;
    if(this.horizontal) label = XLABELS;
    
    var start = parseInt(indexesOfArray(label, this.control[+ !this.horizontal]));
    for(let i = start; i < (start + this.size); i++){
        if(this.horizontal){ //horizontal count
            if(!this.grid.getBox([label[i], this.control[+ this.horizontal]]).occupied)
                this.grid.getBox([label[i], this.control[+ this.horizontal]]).occupied = true;
            else return console.log(label[i] + ", " + this.control[+ this.horizontal] + " is occupied");
        }
        else{ //vertical count
            if(!this.grid.getBox([this.control[+ this.horizontal], label[i]]))
                this.grid.getBox([this.control[+ this.horizontal], label[i]]).occupied = true;
            else return console.log(this.control[+ this.horizontal] + ", " + label[i] + " is occupied");
        }
    }


    /*
    //HARDCODE (can be greatly simplified)
    //Tests for getting the ids correct
    var occIDs = []; //ids of occupied boxes
    if(this.horizontal){
        var x = parseInt(indexesOfArray(XLABELS, this.control[0]));
        for(let i = x; i < (x + this.size); i++){
            //console.log("x = " + x + " size = " + this.size + " i = " + i + " x + size = " + (x + this.size));
            occIDs.push([XLABELS[i], this.control[1]]);
        }
    }
    else{
        var x = parseInt(indexesOfArray(YLABELS, this.control[1]));
        for(let i = x; i < (x + this.size); i++){
            //console.log("x = " + x + " size = " + this.size + " i = " + i + " x + size = " + (x + this.size));
            occIDs.push([YLABELS[i], this.control[0]]);
        }
    }
    //detects if the ship is out of bounds
    for(let i = 0; i < occIDs.length; i++){
        for(let j = 0; j < occIDs[i].length; j++){
            if(occIDs[i][j] === undefined)
                return console.log("does not fit");
        }
    }
    */
}