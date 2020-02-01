//draft 1 - basic Tic Tac Toe Functionalities
const MOVES = ["x", "o"];
const GRID_1 = 1
const ISLOCKED = 0;
const GRID = [/*1*/"false;e", /*2*/"false;e", /*3*/"false;e", 
              /*4*/"false;e", /*5*/"false;e", /*6*/"false;e", 
              /*7*/"false;e", /*8*/"false;e", /*9*/"false;e"];

function initialize()
{
    iRefs();
    iVars();
    iDisplayVars();
    display();
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

    opEvent = document.getElementById("eventDisplay");
    opSelect = document.getElementById("moveSelect");
    opBoard = document.getElementById("board");
    opReset = document.getElementById("reset");
}
function iVars()
{
    cGrid = GRID;
    cpuTimer = 0;
    prevMove = 10;
    turn = false;
}
function iDisplayVars()
{
    eventText = "";
    selectDisplay = "block";
    mainDisplay = "none";
}

function chooseMove(player, cpu)
{
    playerMove = player;
    cpuMove = cpu;
    turn = true;
    eventText = MOVES[playerMove].toUpperCase() + "'s Turn";

    if(cpu == 0)
    {
        turn = false;
        eventText = MOVES[cpuMove].toUpperCase() + "'s Turn";
        cpuTimer = setTimeout(cpuPlay, 550);
    }

    selectDisplay = "none";
    mainDisplay = "block";
    display();
}
function play(gridNum)
{
    if(turn && isPlayable(gridNum, MOVES[playerMove]))
    {
        checkForGridLock(gridNum, MOVES[playerMove]);
        var pPlay = cGrid[gridNum].split(";");

        pPlay[GRID_1] = MOVES[playerMove];
        cGrid[gridNum] = pPlay.join(";");

        cpuTimer = setTimeout(cpuPlay, 750);
        gameController();
        displayMove(gridNum, MOVES[playerMove]);

        prevMove = gridNum;
        modEvent(MOVES[cpuMove].toUpperCase() + "'s Turn");

        console.log("p1moved: " + " [" + gridNum + "] " + cGrid);
        if(checkForWin())
        {
            clearTimeout(cpuTimer);
            //console.log("x wins");
            //conclude();
        }
        display();
    }
}
function cpuPlay()
{
    var rand = getRandomInteger(0,8);
    
    if(isPlayable(rand, MOVES[cpuMove]))
    {
        checkForGridLock(rand, MOVES[cpuMove]);
        var cPlay = cGrid[rand].split(";");
        
        cPlay[GRID_1] = MOVES[cpuMove];
        cGrid[rand] = cPlay.join(";");
        
        turnTimer = setTimeout(gameController, 750);
        displayMove(rand, MOVES[cpuMove]);

        prevMove = rand;
        modEvent(MOVES[playerMove].toUpperCase() + "'s Turn");
        
        console.log("p2moved:" + " [" + rand + "] " + cGrid);
        if(checkForWin())
            clearTimeout(turnTimer);
        display();
    }
    else
        cpuPlay();
}
function isPlayable(move, turn)
{
    //evaluates cGrid[move].split(";")[0] (which is true/false)
    if (eval(cGrid[move].split(";")[ISLOCKED]))
    {
        //display only for player
        if(turn == MOVES[playerMove])
        {
            modEvent("Locked");
        }
        return false;
    }
    if(prevMove == move)
    {
        if(turn == MOVES[playerMove])
        {
            modEvent("Played Last Turn");
        }
        return false;
    }
    return true;
}
function checkForGridLock(move, player)
{
    if(cGrid[move].split(";")[GRID_1] == player)
        cGridLock(move);
    else
        return;
}
function cGridLock(move)
{
    //YOU ARE HERE 12/24. Finished two-layer functions. Move onto UI and representing a locked image and stuff.
    var lockGrid = cGrid[move].split(";");

    lockGrid[ISLOCKED] = "true";
    cGrid[move] = lockGrid.join(";");

    console.log("lock " + move + " [ " + cGrid[move] + " ] ");
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
                if((cGrid[i].split(";")[GRID_1] == MOVES[move]))
                {
                    column++;
                    //console.log("columnCount = " + column + ", " + "turn = " + MOVES[move]);
                    if(column == 3)
                    {
                        temp = indexCount + 1;
                        console.log(MOVES[move] + " wins! (column " + temp + ")");
                        modEvent(MOVES[move].toUpperCase() + " Wins!");
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
                if((cGrid[i].split(";")[GRID_1] == MOVES[move]))
                {
                    row++;
                    //console.log("rowCount = " + row + ", " + "turn = " + MOVES[move]);
                    if(row == 3)
                    {
                        //a cheeky math thing to get the row to display its number from 1-3 (indexCount would say 0, 3, or 6).
                        temp = Math.round((indexCount / 4) + 1);
                        console.log(MOVES[move] + " wins! (row " + temp + ")");
                        modEvent(MOVES[move].toUpperCase() + " Wins!");
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
            if((cGrid[i].split(";")[GRID_1] == MOVES[move]))
            {
                diagNeg++;
               //console.log("diagNegCount = " + diagNeg + ", " + "turn = " + MOVES[move]);
                if(diagNeg == 3)
                {
                    console.log(MOVES[move] + " wins! (negative diagonal)");
                    modEvent(MOVES[move].toUpperCase() + " Wins!");
                    return true;
                }
            }
        }

        //positive diagonal check
        var diagPos = 0;
        //2, 4, 6
        for (var i = 2; i < 7; i += 2)
        {
            if((cGrid[i].split(";")[GRID_1] == MOVES[move]))
            {
                diagPos++;
                //console.log("diagPosCount = " + diagPos + ", " + "turn = " + MOVES[move]);
                if(diagPos == 3)
                {
                    console.log(MOVES[move] + " wins! (positive diagonal)");
                    modEvent(MOVES[move].toUpperCase() + " Wins!");
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
function reset()
{
    //console.log("reset");
    //for some reason, any variable that cGrid is set equal to is modified when cGrid is modified. I've tried this with both the GRID constant and a mGrid global variable - both were modified identically to cGrid. So I'm just gonna do it this way for now
    clearTimeout(cpuTimer);
    cGrid = [/*1*/"false;e", /*2*/"false;e", /*3*/"false;e", 
             /*4*/"false;e", /*5*/"false;e", /*6*/"false;e", 
             /*7*/"false;e", /*8*/"false;e", /*9*/"false;e"];
    //console.log("cGrid = " + cGrid);
    prevMove = 10;
    eventText = "";
    mainDisplay = "none";
    selectDisplay = "block";

    for (var i = 0; i < GRID.length; i++)
    {
        displayLock(i, false);
        displayMove(i, ("g" + (i + 1)));
    }

    display();
}

function modEvent(text)
{
    eventText = text;

    display();
}
function displayLock(move, isOn)
{
    var lTemp = "opL" + (move + 1);

    if(isOn)
        eval(lTemp).style.display = "block";
    else
        eval(lTemp).style.display = "none";
}
function displayMove(parameter, turn)
{
    var gTemp = "opG" + (parameter + 1);
    console.log(gTemp);

    //evaluates a string into an object 
    eval(gTemp).src = "images/" + turn + ".png";
}
function display()
{
    opEvent.innerHTML = eventText;
    opSelect.style.display = selectDisplay;
    opBoard.style.display = mainDisplay;
    opReset.style.display = mainDisplay;
    //console.log("display");
}
