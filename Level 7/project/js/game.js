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

    round = 0;
    playerturn = true;
    selected = null; //ship object
    cpuInterval = null //interval
    cpuTarget = null; //box object
    cpuTrackBox = null; //box object
    tracking = false;
    tries = 1;
    stepsTaken = [];
    direction = [[XLABELS, "-1"],[XLABELS, "+1"],[YLABELS, "-1"],[YLABELS, "+1"]];
    //increment = ["+ 1", "- 1"];
    //salvo = false; //normal or salvo
    
    ships();
    //cpuAttack();

    display();
}

//Event functions
function react(g, e){
    if(e.type == "contextmenu") e.preventDefault();
    if(e.target.className == "box"){ //only react if click target is a box
        var box = g.getBox(e.target.id);
        console.log(box);

        if(!round && (g == grids[USER])){ //round 0 = setup round
            if(selected){
                //console.log(selected);
                selected.control = box; //sets the ship's control as the new box
                
                if(!selected.occupy(false)) return display(selected.control.elem); //performs both the check and occupancy

                display();
                return selected = null;
            }
    
            if(box.ship){
                //console.log(box.ship);
                selected = box.ship;
                selected.deoccupy();
                selected.control = selected.grid.getBox(e.target.id);
                display(selected.control.elem); //remove letters, add a bunch of highlighted boxes showcasing the position of ship, with a bigger outline box being the control box
            }
        }
        else if(playerturn){ //not setup round and clicking cpu box
            attack(box);
            display();
        }
        else console.log("it is not your turn");
    }
}
function trace(g, e){ //update display when mousing over grids
    if(!selected || g == grids[CPU]) return; //maybe remove grid2 conditional when working on attack hover animations
    display(e.target);
}
function rotate(e){ //rotate
    if(!selected) return;
    if(e.code == "KeyR" || e.type == "contextmenu"){ //e.code since it ignores caps lock
        e.preventDefault();
        selected.horizontal = !selected.horizontal; //toggle
        console.log("[Rotate] " + selected.name);
        display(selected.control.elem);
    }
}

//Game functions
function startGame(button){
    if(selected) return; //prevents starting while having a ship selected
    round++;
    button.style.display = "none";
    opLog.style.display = "inline-block";
    console.log(grids[CPU]);
    for(item in grids[CPU].ships){
        cpuShips(item);
    }
}
function attack(box){
    if(!playerturn || !round || box.hit) return;
    console.log("attacked");
    box.hit = true; 
    if(!box.ship){
        playerturn = !playerturn;
        return cpuInterval = setInterval(function(){
            cpuAttack(cpuTarget);
        }, 1000);
        return setTimeout(function(){
            cpuAttack();
        }, 1000);
    }
    box.ship.checkSink();
}
//Cpu functions
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
function cpuAttack(box){
    console.log("CPU ATtACKU");
    if(!box){
        //var box = grids[USER].getBox(['e', 2]);  
        var available = indexesOfArray(grids[USER].boxes.map(item => item.hit == false), true);
        var box = grids[USER].boxes[available[getRandomInteger(0, available.length - 1)]];
    }
    console.log("Hit: ");
    console.log(box);
    if(box.hit){
        console.log(cpuTrackBox);
        console.log(cpuTarget);
        if(!cpuTrackBox) return cpuAttack();
        console.log("Already Hit -----");
        //if(tries == 17) return cpuTrackBox = null;
        tries++;
        if(step) nextStep();
        determineTarget();
        return display();
    }
    box.hit = true;
    
    if(box.ship){
        if(!cpuTrackBox){ //prevents track box from being updated upon every ship hit
            console.log("No Track Box");
            cpuTrackBox = box; //the "control" of ship tracking
            step = getRandomInteger(0, 3);
            determineTarget();
            return display();
        }
        else{
            console.log("Track Box");
            console.log(cpuTarget);
            determineTarget(true);
        }
        console.log("Hit a ship: ");
        if(box.ship.checkSink()){
            cpuTrackBox = null;
            cpuTarget = null;
        }

        //determineTarget();

        //determineTarget(step, true, c1, c2); //in a function because it needs to be looped of target grid is out of bounds
        /*setTimeout(function(){
            cpuAttack(determineTarget(tracking));
        }, 1000); */
    }
    else if(cpuTrackBox){ //tracking until ship is sunken
        console.log("Still tracking");
        //determineTarget(step, true, c1, c2);
        playerturn = !playerturn;
        clearInterval(cpuInterval);
        tries = 1;
    }
    else{
        cpuTarget = null;
        cpuTrackBox = null;
        playerturn = !playerturn;
        stepsTaken = [];
        clearInterval(cpuInterval);
        tries = 1;
    }
    
    display();
}
function nextStep(){
    console.log(stepsTaken);
    stepsTaken.push(step);
    if(step == 1 && !stepsTaken.includes(0)) //fully checks an axis before moving to next
        return step = 0;
    if(step == 3 && !stepsTaken.includes(2))
        return step = 2;
    step++;
    if(step > 3)
        step = 0;
}
function determineTarget(tracking){
    console.log("--------------------");
    console.log(direction[step]);

    var target = cpuTrackBox;
    console.log("Target: cpuTrackBox");
    if(tracking){
        console.log("Target: cpuTarget"); 
        target = cpuTarget;
    }
    console.log(target);

    var axis = 0;

    console.log("Step: " + step);

    if(step < 2)
        axis = 1;
        
    console.log("Axis: " + axis);
    console.log(target.id[axis]);

    start = indexesOfArray(direction[step][0], target.id[+ !axis])[0];

    console.log(start);
    console.log(direction[step][0]);
    //console.log(direction[step][0][start + eval(direction[step][1])]);
    console.log(target.id[axis]);

    if(axis)
        target = grids[USER].getBox([direction[step][0][start + eval(direction[step][1])], target.id[axis]]);
    else
        target = grids[USER].getBox([target.id[axis], direction[step][0][start + eval(direction[step][1])]]);

    console.log("Next Target: ");
    console.log(target);

    if(tries == 5){
        console.log("NULL");
        return cpuTarget = null;
    }

    if(target === undefined || target.hit){
        nextStep();
        tries++;
        console.log("TRIES: " + tries);
        return determineTarget();
    }
    /*
    if(!playerturn){
        setTimeout(function(){
            cpuAttack(determineTarget(tracking));
        }, 1000);
    }
    */
    
    //determineTarget(true, target);
    cpuTarget = target;
}
/*
function determineTarget(step, tracking, coin, coin2){ //determine cpuTarget
    //determine x or y label
    //determine + or - grid index
    //check if grid is out of bounds. if so, loop

    //determine x/y label and +/- grid index
    var box = cpuTarget;
    if(!tracking){
        var coin = getRandomInteger(0, 1);
        var coin2 = getRandomInteger(0, 1);
        box = cpuTrackBox;
    }

    var start;
    console.log(coin + " " + increment[coin2]);
    
    if(coin){  
        start = indexesOfArray(XLABELS, cpuTrackBox.id[0])[0];
        console.log("Start: " + start + " || " + XLABELS[start + eval(increment[coin2])] + ", " + cpuTrackBox.id[1]);
        cpuTarget = grids[USER].getBox([XLABELS[start + eval(increment[coin2])], cpuTrackBox.id[1]]);
    }
    else{
        start = indexesOfArray(YLABELS, cpuTrackBox.id[1])[0];
        console.log("Start: " + start + " || " + cpuTrackBox.id[0] + ", " + YLABELS[start + eval(increment[coin2])]);
        cpuTarget = grids[USER].getBox([cpuTrackBox.id[0], YLABELS[start + eval(increment[coin2])]]);
    }
    console.log(cpuTarget);

    if(cpuTarget == undefined){
        if(tracking){
            if(step >= 2)
                return determineTarget(step, true, + !coin, coin2);
            determineTarget(step, true, coin, + !coin2);
        }
        else
            determineTarget();
    }
}
*/

//Display
function display(traceBox){
    for(let i = USER; i <= CPU; i++){
        var gridNum = eval("opGrid" + i);
        gridNum.innerHTML = "<div></div>"; //resets gridNum so appendChild() doesn't pile up. The div is for that extra little space in the top left corner
        var grid = grids[i];

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

            if(grid.boxes[j].hit)
                grid.boxes[j].elem.innerHTML = "X";
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