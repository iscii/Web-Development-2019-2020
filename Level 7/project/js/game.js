const USER = 1, CPU = 2;

function references(){
    opGrid1 = document.getElementById("divG1");
    opGrid2 = document.getElementById("divG2");
}
function ships(){
    for(i in grids)
        for(j in grids[i].ships)
            grids[i].ships[j].occupy();
}
function initialize(){
    references();
    
    grid1 = new Grid(USER);
    grid2 = new Grid(CPU);
    grids = [grid1, grid2];
    console.log(grid1.boxes);

    selected = null;
    round = 0;
    
    ships();
    
    display();
}

function react(g, e){
    if(e.target.className == "box"){ //only react if click target is a box
        var box = g.getBox(e.target.id);
        console.log(box);

        if(!round){ //round 0 = setup round
            if(selected){
                console.log(selected);
                selected.control = box; //sets the ship's control as the new box
                
                if(!selected.occupy()) return display(); //calls function and receives return value;
                
                display();
                selected = null;
                return console.log(selected);
            }
    
            if(box.ship){
                selected = box.ship;
                console.log(selected);
                for(item in box.ship.boxes){
                    //console.log(selected.boxes[item].ship);
                    selected.boxes[item].ship = null; //removes occupancy
                }
                console.log(selected);
                display(); //remove letters, add a bunch of highlighted boxes showcasing the position of ship, with a bigger outline box being the control box
            }
        }
    }
}

function display(){
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
}