const XLABELS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
const YLABELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const AIRCRAFT = 0, BATTLESHIP = 1, DESTROYER = 2, SUBMARINE = 3, PATROL = 4;

function Grid(player){
    this.player = player;
    this.boxes = [];
    for(let i = 0; i < XLABELS.length; i++){
        for(let j = 0; j < YLABELS.length; j++){
            this.boxes.push(new Box(XLABELS[i], YLABELS[j]));
        }
    }
    this.ships = [new Ship("Aircraft Carrier", 5, ['a', 1]), new Ship("Battleship", 4, ['b', 1]), new Ship("Destroyer", 3, ['c', 1]), new Ship("Submarine", 3, ['d', 1]), new Ship("Patrol Boat", 2, ['e', 1])];
    /*
    this.aircraft = new Ship("Aircraft Carrier", 5, ['a', 1]);
    this.battleship = new Ship("Battleship", 4, ['b', 1]);
    this.destroyer = new Ship("Destroyer", 3, ['c', 1]);
    this.submarine = new Ship("Submarine", 3, ['d', 1]);
    this.patrol = new Ship("Patrol Boat", 2, ['e', 1]); */
}

Grid.prototype.getBox = function(id, isEvent){ //returns box object in grid from event
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

function Ship(name, size, control){
    this.sunken = false;
    this.name = name;
    this.size = size;
    this.control = control; //control is the core box which it rotates off
}