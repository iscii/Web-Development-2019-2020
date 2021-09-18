//draft 1 - basic Tic Tac Toe Functionalities
const MOVES = ["x", "o"];
const GRID_1 = 1
const ISLOCKED = 0;

function initialize()
{
    iRefs();
    iVars();
}
function iRefs()
{
    opG1 = document.getElementById("g1");
    opG2 = document.getElementById("g2");
    opG3 = document.getElementById("g3");
    opG4 = document.getElementById("g4");
    opG5 = document.getElementById("g5");
    opG6 = document.getElementById("g6");
    opG7 = document.getElementById("g7");
    opG8 = document.getElementById("g8");
    opG9 = document.getElementById("g9");

    opL1 = document.getElementById("l1");
    opL2 = document.getElementById("l2");
    opL3 = document.getElementById("l3");
    opL4 = document.getElementById("l4");
    opL5 = document.getElementById("l5");
    opL6 = document.getElementById("l6");
    opL7 = document.getElementById("l7");
    opL8 = document.getElementById("l8");
    opL9 = document.getElementById("l9");
}
function iVars()
{
    grid = [/*1*/"false;e", /*2*/"false;e", /*3*/"false;e", 
            /*4*/"false;e", /*5*/"false;e", /*6*/"false;e", 
            /*7*/"false;e", /*8*/"false;e", /*9*/"false;e"];

    turn = true;
    cpuTimer = 0;
}

function play(gridNum)
{
    if(turn && isPlayable(gridNum))
    {
        checkForGridLock(gridNum, "x");
        var pPlay = grid[gridNum].split(";");

        pPlay[GRID_1] = MOVES[0];
        grid[gridNum] = pPlay.join(";");

        cpuTimer = setTimeout(cpuPlay, 750);
        gameController();

        display(gridNum, "x");
        console.log("p1moved: " + " [" + gridNum + "] " + grid);
        if(checkForWin())
        {
            clearTimeout(cpuTimer);
            console.log("x wins");
            //conclude();
        }
    }
}

function cpuPlay()
{
    var rand = getRandomInteger(0,8);
    
    if(isPlayable(rand))
    {
        checkForGridLock(rand, "o");
        var cPlay = grid[rand].split(";");
        
        cPlay[GRID_1] = MOVES[1];
        grid[rand] = cPlay.join(";");
        
        setTimeout(gameController, 750);
        display(rand, "o");
        
        console.log("p2moved:" + " [" + rand + "] " + grid);
        if(checkForWin())
        {
            console.log("o wins");
            //conclude();
        }
    }
    else
        cpuPlay();
}

function isPlayable(move)
{
    //evaluates grid[move].split(";")[0] (which is true/false)
    if (eval(grid[move].split(";")[ISLOCKED]))
    {
        console.log("locked");
        return false;
    }
    return true;
}

function checkForGridLock(move, player)
{
    if(grid[move].split(";")[GRID_1] == player)
        gridLock(move);
    else
        return;
}

function gridLock(move)
{
    //YOU ARE HERE 12/24. Finished two-layer functions. Move onto UI and representing a locked image and stuff.
    var lockGrid = grid[move].split(";");

    lockGrid[ISLOCKED] = "true";
    grid[move] = lockGrid.join(";");

    console.log("lock " + move + " [ " + grid[move] + " ] ");
    displayLock(move, true);
}

function checkForWin()
{
    for (var move = 0; move < MOVES.length; move++)
    {
        var temp;
        //column check
        //0, 3, 6 -- 1, 4, 7 -- 2, 5, 8
        for (var indexCount = 0; indexCount < 3; indexCount++)
        {
            var column = 0;
            for (var i = indexCount; i < (indexCount + 7); i += 3)
            {
                if((grid[i].split(";")[GRID_1] == MOVES[move]) && eval(grid[i].split(";")[ISLOCKED]))
                {
                    column++;
                    //console.log("columnCount = " + column + ", " + "turn = " + MOVES[move]);
                    if(column == 3)
                    {
                        temp = indexCount + 1;
                        console.log(MOVES[move] + " wins! (column " + temp + ")");
                        return true;
                    }
                }              
            }
        }

        //row check
        //0, 1, 2 -- 3, 4, 5 -- 6, 7, 8
        for (var indexCount = 0; indexCount < 7; indexCount += 3)
        {
            var row = 0;
            //(i < indexCount + 3) since indexCount can go beyond 3.
            for (var i = indexCount; i < (indexCount + 3); i++)
            {
                if((grid[i].split(";")[GRID_1] == MOVES[move]) && eval(grid[i].split(";")[ISLOCKED]))
                {
                    row++;
                    //console.log("rowCount = " + row + ", " + "turn = " + MOVES[move]);
                    if(row == 3)
                    {
                        //a cheeky math thing to get the row to display its number from 1-3 (indexCount would say 0, 3, or 6).
                        temp = Math.round((indexCount / 4) + 1);
                        console.log(MOVES[move] + " wins! (row " + temp + ")");
                        return true;
                    }
                }
            }
        }

        //neg/pos = slope of diagonal

        //negative diagonal check
        var diagNeg = 0;
        //0, 4, 8
        for (var i = 0; i < 9; i += 4)
        {
            if((grid[i].split(";")[GRID_1] == MOVES[move]) && eval(grid[i].split(";")[ISLOCKED]))
            {
                diagNeg++;
               //console.log("diagNegCount = " + diagNeg + ", " + "turn = " + MOVES[move]);
                if(diagNeg == 3)
                {
                    console.log(MOVES[move] + " wins! (negative diagonal)");
                    return true;
                }
            }
        }

        //positive diagonal check
        var diagPos = 0;
        //2, 4, 6
        for (var i = 2; i < 7; i += 2)
        {
            if((grid[i].split(";")[GRID_1] == MOVES[move]) && eval(grid[i].split(";")[ISLOCKED]))
            {
                diagPos++;
                //console.log("diagPosCount = " + diagPos + ", " + "turn = " + MOVES[move]);
                if(diagPos == 3)
                {
                    console.log(MOVES[move] + " wins! (positive diagonal)");
                    return true;
                }
            }
        }
    }
    return false;
}

function gameController()
{
    turn = !turn;
}

function displayLock(move, isOn)
{
    var lTemp = "opL" + (move + 1);

    if(isOn)
        eval(lTemp).style.display = "block";
    else
        eval(lTemp).style.display = "none";
}

function display(parameter, turn)
{
    var gTemp = "opG" + (parameter + 1);
    console.log(gTemp);

    //evaluates a string into an object 
    eval(gTemp).src = "images/" + turn + ".png";
}