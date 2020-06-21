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
    
    ships();
    
    display();
}

function react(g, e){
    if(e.target.className == "box"){ //only react if click target was a box
        console.log(g.getBox(e, true)); //< here
    }
}

function display(){
    for(let i = USER; i <= CPU; i++){
        var gridNum = eval("opGrid" + i);
        var grid = eval("grid" + i);

        //display x label
        for(let j = 0; j < XLABELS.length; j++){
            var x = document.createElement("div");
            x.className = "label";
            x.innerHTML = XLABELS[j].toUpperCase();
            gridNum.appendChild(x);
        }
        for(let j = 0; j < grid.boxes.length; j++){
            if(j % 10 == 0){
                var y = document.createElement("div");
                y.className = "label";
                y.innerHTML = YLABELS[j/10];
                gridNum.appendChild(y);
            }
            if(grid.boxes[j].occupied)
                grid.boxes[j].elem.innerHTML = "X";
            gridNum.appendChild(grid.boxes[j].elem);
        }
    }
}