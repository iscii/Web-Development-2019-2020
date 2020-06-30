const USER = 0, CPU = 1;

//Initialization functions
function references(){
    opBody = document.getElementById("body");    
    opGrid0 = document.getElementById("divgrid0");
    opGrid1 = document.getElementById("divgrid1");
    opLogBox = document.getElementById("logbox");
    opLog = document.getElementById("log");
    opStart = document.getElementById("start");
    opReset = document.getElementById("reset");
    opEvent = document.getElementById("event");
}

function initialize(resetting){
    references();
    if(resetting){
        //*calling grids[CPU] = new Grid(CPU) doesn't seem to reset the boxes' ship properties. This is because you're not setting grid1 to a new Grid, you're setting grids[1] to a new Grid, which doesn't change grid1. Also, the grids[] array must be declared after both grid1 and 0 have been declared, as the objects within will not update with the new object (hence declaring the grids[] array after declaring all grid objects).
        clearInterval(cpuInterval);
        for(box in grids[USER].boxes)
            grids[USER].boxes[box].hit = false;
        for(ship in grids[USER].ships)
            grids[USER].ships[ship].sunken = false;
        
        opBody.removeEventListener("mouseover", trace);
    }
    else{
        grid0 = new Grid(USER);
        opBody.addEventListener("mouseover", function(){ //addresses an error that'd occur with onmouseover which would call the mouseover function before initialize is completely called, so that some variables may not have been initialized yet.
        trace(event);
        }); 
    }
    
    grid1 = new Grid(CPU);
    grids = [grid0, grid1]; //readability and cycling through both grids
    for(i in grids)
        for(j in grids[i].ships)
            grids[i].ships[j].occupy();

    ingame = false;
    playerturn = true;
    selected = null; //ship object
    salvo = eval(window.sessionStorage.getItem("salvo")); //if you don't start from the menu, salvo will be null (default classic)
    shots = 0;
    gameEnd = false;
    
    //cpu vars
    direction = [[XLABELS, "-1"],[XLABELS, "+1"],[YLABELS, "-1"],[YLABELS, "+1"]];
    cpuInterval = null; //interval
    cpuTarget = null; //box object
    cpuTrackBox = null; //box object
    tracking = false;
    tries = 0;
    stepsTaken = [];

    traceBox = null;
    opLog.innerHTML = "";
    display();
}

//Event functions
function react(g, e){
    if(!playerturn || gameEnd) return;
    if(e.type == "contextmenu") e.preventDefault();
    if(e.target.className == "box"){ //only react if click target is a box
        var box = g.getBox(e.target.id);

        if(!ingame && (g == grids[USER])){
            if(selected){
                selected.control = box; //sets the ship's control as the new box
                if(!selected.occupy(false)) return display(); //performs both the check and occupancy
                selected = null;
                return display(); 
            }
            if(box.ship){
                selected = box.ship;
                traceBox = box.elem;
                selected.deoccupy();
                selected.control = selected.grid.getBox(e.target.id);
                display(); //remove letters, add a bunch of highlighted boxes showcasing the position of ship, with a bigger outline box being the control box
            }
        }
        else if(playerturn && (g == grids[CPU]) && !gameEnd) //not setup and clicking cpu box
            attack(box);
    }
}
function trace(e){ //update display when mousing over grids
    var gridNum = e.target.parentNode.id.substring(e.target.parentNode.id.length - 1, e.target.parentNode.id.length); //e.target.parentNode gets the parent element of the target element, and .id.substring(id.length - 1, id.length) takes the last character of its id.
    if((e.target.className != "box" || !ingame && (gridNum == CPU) || (ingame && gridNum == USER)) && !gameEnd){
        traceBox = null;
        return display();
    }
    if(((selected && e.target.className != "box") || gameEnd)) return; 
    traceBox = e.target;
    display();
}
function rotate(e){ //rotate
    if(!selected) return;
    if(e.code == "KeyR" || e.type == "contextmenu"){ //e.code since it ignores caps lock
        e.preventDefault();
        selected.horizontal = !selected.horizontal; //toggle
        display();
    }
}

//Game functions
function startGame(){
    if(selected) return; //prevents starting while having a ship selected
    ingame = true;
    traceBox = null;
    for(item in grids[CPU].ships)
        cpuShips(item);
}
function attack(box){
    if(!playerturn || !ingame || box.hit || gameEnd) return;
    box.hit = true; 
    var event = "You sent a torpedo to " + "[" + box.id[0].toUpperCase() + "," + box.id[1] + "]";
    if(salvo){
        shots++; //putting shots after the check will require me to start it off at 1, which is unhealthy for the sequencing of cpuAttack();
        var shipCount = 0;
        for(item in grids[USER].ships)
            if(!grids[USER].ships[item].sunken) shipCount++;
        if(shots == shipCount || box.ship){
            if(box.ship){
                event += "<br/> The torpedo hit Cpu's " + box.ship.name;
                if(box.ship.checkSink(USER)) event += "<br/> <span class = 'bigevent'>Cpu's " + box.ship.name + " has been sunk</span>";
            }
            else if(shots == shipCount) event += "<br/> The torpedo missed";
            shots = 0;
            playerturn = !playerturn;
            display(event, USER);
            return cpuInterval = setInterval(function(){
                cpuAttack(cpuTarget);
            }, 750); //750 default
        }
        event += "<br/> The torpedo missed";
        return display(event, USER);
    }
    
    if(!box.ship){
        playerturn = !playerturn;
        event += "<br/> The torpedo missed";
        display(event, USER);
        return cpuInterval = setInterval(function(){
            cpuAttack(cpuTarget);
        }, 750);
    }
    event += "<br/> The torpedo hit Cpu's " + box.ship.name;
    if(box.ship.checkSink(USER)) event += "<br/> <span class = 'bigevent'>Cpu's " + box.ship.name + " has been sunk</span>";
    display(event, USER);
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
    else
        cpuShips(item);
}
function cpuAttack(box){
    if(gameEnd) return clearInterval(cpuInterval);
    if(!box){
        cpuTrackBox = null;
        var available = indexesOfArray(grids[USER].boxes.map(item => item.hit == false), true);
        var box = grids[USER].boxes[available[getRandomInteger(0, available.length - 1)]];
    }
    if(salvo){
        var shipCount = 0;
        for(item in grids[CPU].ships)
            if(!grids[CPU].ships[item].sunken) shipCount++;
    }
    if(box.hit){
        if(!cpuTrackBox) return cpuAttack();
        tries++;
        if(step) nextStep();
        determineTarget();
        return display();
    }
    box.hit = true;
    var event = "Cpu sent a torpedo to " + "[" + box.id[0].toUpperCase() + "," + box.id[1] + "]"
    if(box.ship){
        event += "<br/> The torpedo hit your " + box.ship.name;
        if(!cpuTrackBox){ //prevents track box from being updated upon every ship hit
            tries = 0;
            cpuTrackBox = box; //the "control" of ship tracking
            step = getRandomInteger(0, 3);
            determineTarget();
            if(salvo) cpuReset();
            display(event, CPU);
            return box.ship.checkSink(CPU);
        }
        else
            determineTarget(true);
        if(box.ship.checkSink(CPU)){
            event += "<br/> <span class = 'bigevent'>Your " + box.ship.name + " has been sunk</span>";
            cpuTrackBox = null;
            cpuTarget = null;
        }
        if(salvo) cpuReset();
        return display(event, CPU);
    }
    else if(cpuTrackBox){ //tracking until ship is sunken
        if(!salvo) cpuReset(); else shots++;
        determineTarget();
    }
    else{
        if(!salvo) cpuReset(); else shots++;
        cpuTarget = null;
        cpuTrackBox = null;
    }
    if(shots == shipCount)
        cpuReset();
    event += "<br/> The torpedo missed";
    display(event, CPU);
}
function cpuReset(){
    clearInterval(cpuInterval);
    stepsTaken = [];
    playerturn = !playerturn;
    tries = 0;
    shots = 0;
}
function nextStep(){
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
    var target = cpuTrackBox;
    if(tracking){
        if(cpuTarget == null){
            nextStep();
            tries++;
            return determineTarget;
        }
        target = cpuTarget;
    }
    var axis = 0;
    if(step < 2)
        axis = 1;
    start = indexesOfArray(direction[step][0], target.id[+ !axis])[0];
    if(axis)
        target = grids[USER].getBox([direction[step][0][start + eval(direction[step][1])], target.id[axis]]);
    else
        target = grids[USER].getBox([target.id[axis], direction[step][0][start + eval(direction[step][1])]]);
    if(tries > 6)
        return cpuTarget = null;
    if(target === undefined || target.hit){
        nextStep();
        tries++;
        return determineTarget();
    }
    stepsTaken = [];
    tries = 0;
    cpuTarget = target;
}

//Display
function reveal(){
    var opInst = document.getElementById("instructionsbox");
    if(opInst.style.display == "none")
        opInst.style.display = "block";
    else
        opInst.style.display = "none";
}
function display(logEvent, player){
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
            if(i == USER){ //comment out this if conditional to reveal enemy ships
                if(grid.boxes[j].ship)
                    grid.boxes[j].elem.style.background = SHIPCOLORS[indexesOfArray(grid.ships, grid.boxes[j].ship)];
                else
                    grid.boxes[j].elem.style.background = "none";
            }
            grid.boxes[j].elem.style.border = "2px solid rgb(0, 69, 94)";
                
            if(grid.boxes[j].hit){
                grid.boxes[j].elem.style.background = "rgb(51, 153, 255)"; //making it blue instead of white because ocean
                grid.boxes[j].elem.style.border = "1px solid rgb(204, 102, 153)";
                if(grid.boxes[j].ship){
                    grid.boxes[j].elem.style.background = "rgb(179, 0, 0)";
                }
            }
            gridNum.appendChild(grid.boxes[j].elem);
        }
    }
    
    if(traceBox){
        if(!ingame && selected){
            selected.control = selected.grid.getBox(traceBox.id);
            var boxes = selected.getBoxes();
            var color = SHIPCOLORS[indexesOfArray(selected.grid.ships, selected)];
            
            var band = "rgb(102, 255, 102)";
            if(!selected.occupy(true))
                band = "rgb(255, 0, 0)";
            
            var inBounds = indexesOfArray(boxes.map(item => item != undefined), true);
            for(item in inBounds){
                boxes[inBounds[item]].elem.style.background = color;
                boxes[inBounds[item]].elem.style.border = "2px solid " + band;
            }
        }
        else if(playerturn){
            traceBox.style.border = "6px solid rgb(255, 77, 77)";
        }
    }
    
    if(ingame){
        opStart.style.display = "none";
        opReset.style.display = "flex";
        opLogBox.style.display = "inline-block";
    }
    else{
        opStart.style.display = "flex";
        opReset.style.display = "none";
        opLogBox.style.display = "none";
    }

    if(logEvent){
        if(player == USER)
            opLog.innerHTML = "<div class = 'playerevent'>" + logEvent + "</div>" + opLog.innerHTML;//inserts element on top. Doing the long way because insertChild() doesn't seem to work, as getFirstChild()/firstChild() [from google] is not a function.
        else
            opLog.innerHTML = "<div class = 'cpuevent'>" + logEvent + "</div>" + opLog.innerHTML;
    }

    if(playerturn)
        opEvent.innerHTML = "Your Turn";
    else
        opEvent.innerHTML = "Cpu's Turn";

    if(gameEnd && player != undefined){
        if(player == USER)
            opEvent.innerHTML = "Game Over. Your Victory!";
        else
            opEvent.innerHTML = "Game Over. Cpu Victory...";
    }
}