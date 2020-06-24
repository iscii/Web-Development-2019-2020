const USER = 0, CPU = 1;

//Initialization functions
function references(){
    opGrid0 = document.getElementById("divG1");
    opGrid1 = document.getElementById("divG2");
    opLog = document.getElementById("log");
}
function ships(){
    for(i in grids)
        for(j in grids[i].ships)
            grids[i].ships[j].occupy();
}
function initialize(){
    references();
    
    grid0 = new Grid(USER);
    grid1 = new Grid(CPU);
    grids = [grid0, grid1]; //readability and cycling through both grids
    console.log(grid0.boxes);

    selected = null;
    round = 0;
    
    ships();

    display();
}

//Event functions
function react(g, e){
    if(e.target.className == "box"){ //only react if click target is a box
        var box = g.getBox(e.target.id);
        console.log(box);

        if(!round && !(g == grids[CPU])){ //round 0 = setup round
            if(selected){
                console.log(selected);
                selected.control = box; //sets the ship's control as the new box
                
                if(!selected.occupy(false)) return display(selected.control.elem); //performs both the check and occupancy

                display();
                return selected = null;
            }
    
            if(box.ship){
                console.log(box.ship);
                selected = box.ship;
                selected.deoccupy();
                selected.control = selected.grid.getBox(e.target.id);
                display(selected.control.elem); //remove letters, add a bunch of highlighted boxes showcasing the position of ship, with a bigger outline box being the control box
            }
        }
    }
}
function trace(g, e){ //update display when mousing over grids
    if(!selected || g == grids[CPU]) return; //maybe remove grid2 conditional when working on attack hover animations
    display(e.target);
}
function logKey(e){ //rotate
    if(!selected) return;
    if(e.code == "KeyR"){ //e.code since it ignores caps lock
        selected.horizontal = !selected.horizontal; //toggle
        console.log("[Rotate] " + selected.name);
        display(selected.control.elem);
    }
}
//Game functions
function startGame(button){
    button.style.display = "none";
    console.log(grids[CPU]);
    for(item in grids[CPU].ships){
        cpuShips(item);
    }
}
function cpuShips(item){ //randomizes cpu ship locations
    var ship = grids[CPU].ships[item];
    ship.deoccupy();
    ship.control = grids[CPU].boxes[(getRandomInteger(0, grids[CPU].boxes.length - 1))];
    ship.horizontal = !!getRandomInteger(0, 1); //sets 0 or 1 to its boolean value

    if(ship.occupy(true)){
        ship.occupy();
        display();
    }
    else{
        cpuShips(item);
    }
}

//Display
function display(traceBox){
    for(let i = USER; i <= CPU; i++){
        var gridNum = eval("opGrid" + i);
        gridNum.innerHTML = "<div></div>"; //resets gridNum so appendChild() doesn't pile up. The div is for that extra little space in the top left corner
        var grid = eval("grid" + i);

        //display x label
        for(let j = 0; j < XLABELS.length; j++){
            var x = document.createElement("div");
            x.className = "label";
            x.innerHTML = XLABELS[j].toUpperCase();
            gridNum.appendChild(x);
        }
        //display y label
        for(let j = 0; j < grid.boxes.length; j++){
            if(j % 10 == 0){
                var y = document.createElement("div");
                y.className = "label";
                y.innerHTML = YLABELS[j/10];
                gridNum.appendChild(y);
            }
            if(grid.boxes[j].ship)
                grid.boxes[j].elem.innerHTML = grid.boxes[j].ship.name[0];
            else
                grid.boxes[j].elem.innerHTML = " ";
            gridNum.appendChild(grid.boxes[j].elem);
        }
    }
    
    if(traceBox){
        selected.control = selected.grid.getBox(traceBox.id);
        var boxes = selected.getBoxes();
        var text = selected.name[0];//this should be temporary. Represent the ships through colored boxes cos text messes the box sizes.
        if(!selected.occupy(true)){
            text = "X";
            //console.log(boxes);
        }
        var inBounds = indexesOfArray(boxes.map(item => item != undefined), true);
        for(item in inBounds)
            boxes[inBounds[item]].elem.innerHTML = text;
    } 
}