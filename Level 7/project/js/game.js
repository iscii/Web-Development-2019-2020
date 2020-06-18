const USER = 1, CPU = 2

function references(){
    opGrid1 = document.getElementById("divG1");
    opGrid2 = document.getElementById("divG2");
}
function initialize(){
    references();

    grid1 = new Grid(USER);
    grid2 = new Grid(CPU);
    console.log(grid1.boxes);

    display();
}

function display(){
    for(let i = USER; i <= CPU; i++){
        var gridNum = eval("opGrid" + i);
        var grid = eval("grid" + i);

        //!make the display commands relative to the grid/box objects

        //display x label
        for(let j = 0; j < XLABELS.length; j++){
            var x = document.createElement("div");
            x.className = "labelStyle";
            x.innerHTML = XLABELS[j].toUpperCase();
            gridNum.appendChild(x);
        }
        for(let j = 0; j < grid.boxes.length; j++){
            if(j % 10 == 0){
                var y = document.createElement("div");
                y.className = "labelStyle";
                y.innerHTML = YLABELS[j/10];
                gridNum.appendChild(y);
            }
            gridNum.appendChild(grid.boxes[j].elem)
        }
        /*
        //display boxes
        for(let j = 0; j < XLABELS.length; j++){
            //display y label
            var y = document.createElement("div");
            y.className = "labelStyle";
            y.innerHTML = YLABELS[j];
            eval(gridNum).appendChild(y);

            for(let k = 0; k < YLABELS.length; k++){
                var box = document.createElement("div");
                box.className = "boxStyle";
                box.innerHTML = "[" + XLABELS[j].toUpperCase() + ", " + YLABELS[k] + "]";
                eval(gridNum).appendChild(box);
            }
        } */
    }
}