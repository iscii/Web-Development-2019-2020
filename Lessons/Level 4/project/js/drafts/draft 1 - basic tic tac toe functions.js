//draft 1 - basic Tic Tac Toe Functionalities
const MOVES = ["x", "o"];
const GRID_1 = 1, GRID_2 = 2
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
}
function iVars()
{
    grid = [/*1*/"false;e;e", /*2*/"false;e;e", /*3*/"false;e;e", 
            /*4*/"false;e;e", /*5*/"false;e;e", /*6*/"false;e;e", 
            /*7*/"false;e;e", /*8*/"false;e;e", /*9*/"false;e;e"];

    turn = true;
}

function play(gridNum)
{
    //don't think i can make this code any more compact. I can't set variables twice in a single line.
    if(turn)
    {
        var pPlay = grid[gridNum].split(";");

        pPlay[GRID_1] = MOVES[0];
        grid[gridNum] = pPlay.join(";");

        setTimeout(cpuPlay, 750);
        gameController();

        display(gridNum, "x");
    }
    console.log("p1moved: " + " [" + gridNum + "] " + grid);
    checkForWin();

    //console.log(gridNum);
    //don't think i can make this code any more compact. I can't set variables twice in a single execute.
    //this doesn't work lol
    //grid[gridNum] = (grid[gridNum].split(";")[1][1] = "x").join(";");
    //console.log(grid[gridNum]);
    //console.log(pPlay);
    //grid[gridNum] = pPlay;
    
    //gameController();
}

function cpuPlay()
{
    //YOU ARE HERE 12/19. Make the images react to the clicks n shit, and then move on to draft 2.
    var rand = getRandomInteger(0,8);
    var cPlay = grid[rand].split(";");

    cPlay[GRID_1] = MOVES[1];
    grid[rand] = cPlay.join(";");
    
    setTimeout(gameController, 750);
    //gameController();
    display(rand, "o");

    console.log("p2moved:" + " [" + rand + "] " + grid);
    checkForWin();
}

function checkForWin()
{
    //YOU ARE HERE 12/23. finished winchecks. move on to gridlocks and UI.
    //make a for function for the number of items in MOVES, and run this entire thing that searches for that variable. It'll happen twice.
    for (var move = 0; move < MOVES.length; move++)
    {
        var temp;
        //var column;
        //column check
        //0, 3, 6 -- 1, 4, 7 -- 2, 5, 8
        for (var indexCount = 0; indexCount < 3; indexCount++)
        {
            var column = 0;
            for (var i = indexCount; i < (indexCount + 7); i += 3)
            {
                //console.log("column [ " + i + " ] ");
                //console.log("column: " + MOVES[move] + " [ " + column + " ] " + grid[i].split(";")[GRID_1]);
                if(grid[i].split(";")[GRID_1] == MOVES[move])
                {
                    column++;
                    //console.log("column: " + MOVES[move] + " [ " + column + " ] ");
                    if(column == 3)
                    {
                        temp = indexCount + 1;
                        console.log(MOVES[move] + " wins! (column " + temp + ")");
                        //return MOVES[move];
                    }
                }              
            }
        }
        
        //var row;
        //row check
        //0, 1, 2 -- 3, 4, 5 -- 6, 7, 8
        for (var indexCount = 0; indexCount < 7; indexCount += 3)
        {
            var row = 0;
            //(i < indexCount + 3) since indexCount can go beyond 3.
            for (var i = indexCount; i < (indexCount + 3); i++)
            {
                //console.log("indexCount " + indexCount)
                //console.log("row [ " + i + " ] ");
                //console.log("row: " + MOVES[move] + " [ " + row + " ] : " + grid[i].split(";")[GRID_1]);
                if(grid[i].split(";")[GRID_1] == MOVES[move])
                {
                    row++;
                    //console.log("row: " + MOVES[move] + " [ " + row + " ] ");
                    if(row == 3)
                    {
                        //a cheeky math thing to get the row to display its number from 1-3 (indexCount would say 0, 3, or 6).
                        temp = Math.round((indexCount / 4) + 1);
                        console.log(MOVES[move] + " wins! (row " + temp + ")");
                        //return MOVES[move];
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
            //console.log("diagneg [ " + i + " ] ");
            //console.log("diagneg: " + MOVES[move] + " [ " + diagNeg + " ] : " + grid[i].split(";")[GRID_1]);
            //diagNeg = 0;
            if(grid[i].split(";")[GRID_1] == MOVES[move])
            {
                diagNeg++;
                //console.log("diagNeg = " + diagNeg)
                if(diagNeg == 3)
                {
                    console.log(MOVES[move] + " wins! (negative diagonal)");
                }
            }
        }

        //positive diagonal check
        var diagPos = 0;
        //2, 4, 6
        for (var i = 2; i < 7; i += 2)
        {
            //console.log("diagpos [ " + i + " ] ");
            //console.log("diagpos: " + MOVES[move] + " [ " + diagPos + " ] : " + grid[i].split(";")[GRID_1]);
            //diagPos = 0;
            if(grid[i].split(";")[GRID_1] == MOVES[move])
            {
                diagPos++;
                //console.log("diagPos = " + diagNeg)
                if(diagPos == 3)
                {
                    console.log(MOVES[move] + " wins! (positive diagonal)");
                }
            }
        }
    }
}

//I might use this some other time -- USING LMAO
function gameController()
{
    turn = !turn;
}

function display(parameter, turn)
{
    var gTemp = "opG" + (parameter + 1);
    console.log(gTemp);

    //evaluates a string into an object 
    eval(gTemp).src = "images/" + turn + ".png";
}