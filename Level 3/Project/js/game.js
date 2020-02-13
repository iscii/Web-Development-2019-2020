const arsenal = ["Rock", "Paper", "Scissor"];

function initialize()
{
    iReferences();
    iVars();
    iDisplayVars();
    iFunctions();
}
function iReferences()
{
    opp1A = document.getElementById("p1A");
    opp2A = document.getElementById("p2A");
    opcB1 = document.getElementById("cBox1");
    opcB2 = document.getElementById("cBox2");
    opcUIT1 = document.getElementById("cUIText1");
    opcUIT2 = document.getElementById("cUIText2");
    opp1R = document.getElementById("p1rock");
    opp1P = document.getElementById("p1paper");
    opp1S = document.getElementById("p1scissor");
    opp2R = document.getElementById("p2rock");
    opp2P = document.getElementById("p2paper");
    opp2S = document.getElementById("p2scissor");
    oprDiv = document.getElementById("resetDiv");

    //log
    opLog = document.getElementById("log");
}
function iVars()
{
    p1play = "";
    p2play = "";
    sResult = "";
    p1PrevPlay = "";
    p2PrevPlay = "";
    prevResult = "";
    
    p1ArsenalD = [parseInt(window.sessionStorage.getItem("p1A1")), parseInt(window.sessionStorage.getItem("p1A2")), parseInt(window.sessionStorage.getItem("p1A3"))];
    p2ArsenalD = [parseInt(window.sessionStorage.getItem("p2A1")), parseInt(window.sessionStorage.getItem("p2A2")), parseInt(window.sessionStorage.getItem("p2A3"))];
    console.log(p1ArsenalD + "p1");
    console.log(p2ArsenalD + "p2");

    //the array is always changing, so I use variables that store default values.
    p1Arsenal = [p1ArsenalD[0], p1ArsenalD[1], p1ArsenalD[2]]; //[0] = Rock, [1] = Paper, [2] = Scissor//
    p2Arsenal = [p2ArsenalD[0], p2ArsenalD[1], p2ArsenalD[2]];
    console.log(p2Arsenal);
    
    p1PlayInRowCount = 1;
    p2PlayInRowCount = 1;
    turn = 1;
    tieNum = 1;
    roundNum = 0;
    
    canPlay = true;
    gameEnd = false;
    wbreak1 = false;
    wbreak2 = false;
    tiebreak = false;
}
function iDisplayVars()
{
    opcB1src = "images/empty.png";
    opcB2src = "images/empty.png";
    opcUIT1src = "P1";
    opcUIT2src = "&nbsp";
    opp1Rsrc = p1Arsenal[0].toString(); //edit this so that these numbers are set by player
    opp1Psrc = p1Arsenal[1].toString();
    opp1Ssrc = p1Arsenal[2].toString();
    opp2Rsrc = p2Arsenal[0].toString();
    opp2Psrc = p2Arsenal[1].toString();
    opp2Ssrc = p2Arsenal[2].toString();

    logD = opLog.innerHTML;
    opLogsrc = opLog.innerHTML;
    lRsrc = ""; //log elements
    lr1Wsrc = "";
    lp1Playsrc = "";
    lp1Asrc = "";
    lp2Playsrc = "";
    lp2Asrc = "";
    leTieBreaker1src = "";//events
    leTieBreaker2src = "";
    leWBreak1src = "";
    leWBreak2src = "";
}
function iFunctions()
{
    display();
}

function resetGame()
{
    console.log("game reset");
    
    //iVars()
    p1play = "";
    p2play = "";
    sResult = "";
    p1PrevPlay = "";
    p2PrevPlay = "";
    prevResult = "";
    
    p1Arsenal = [p1ArsenalD[0], p1ArsenalD[1], p1ArsenalD[2]]; //[0] = Rock, [1] = Paper, [2] = Scissor//
    p2Arsenal = [p2ArsenalD[0], p2ArsenalD[1], p2ArsenalD[2]];
    
    p1PlayInRowCount = 1;
    p2PlayInRowCount = 1;
    turn = 1;
    tieNum = 1;
    roundNum = 0;
    
    canPlay = true;
    gameEnd = false;
    wbreak1 = false;
    wbreak2 = false;
    tiebreak = false;

    //iDisplayVars()
    opcB1src = "images/empty.png";
    opcB2src = "images/empty.png";
    opcUIT1src = "P1";
    opcUIT2src = "&nbsp";
    opp1Rsrc = p1Arsenal[0].toString(); //edit this so that these numbers are set by player
    opp1Psrc = p1Arsenal[1].toString();
    opp1Ssrc = p1Arsenal[2].toString();
    opp2Rsrc = p2Arsenal[0].toString();
    opp2Psrc = p2Arsenal[1].toString();
    opp2Ssrc = p2Arsenal[2].toString();
    console.log(p2Arsenal[2]);

    //other
    opp1A.style.pointerEvents = 'auto';
    
    opLogsrc = "<tr> <td colspan = '3' style = 'font-size: 150%'> <c> <b> Game Reset </b> </c> </td> </tr>" + opLogsrc;
    //iFunctions()
    display();
}

function resetLog()
{
    console.log("log reset");

    opLogsrc = logD;
    lRsrc = ""; //log elements
    lr1Wsrc = "";
    lp1Playsrc = "";
    lp1Asrc = "";
    lp2Playsrc = "";
    lp2Asrc = "";
    leTieBreaker1src = "";//events
    leTieBreaker2src = "";
    leWBreak1src = "";
    leWBreak2src = "";

    display();
}

function resetBoth()
{
    console.log("both reset");

    //iVars()
    p1play = "";
    p2play = "";
    sResult = "";
    p1PrevPlay = "";
    p2PrevPlay = "";
    prevResult = "";
    
    p1Arsenal = [p1ArsenalD[0], p1ArsenalD[1], p1ArsenalD[2]]; //[0] = Rock, [1] = Paper, [2] = Scissor//
    p2Arsenal = [p2ArsenalD[0], p2ArsenalD[1], p2ArsenalD[2]];
    
    p1PlayInRowCount = 1;
    p2PlayInRowCount = 1;
    turn = 1;
    tieNum = 1;
    roundNum = 0;
    
    canPlay = true;
    gameEnd = false;
    wbreak1 = false;
    wbreak2 = false;
    tiebreak = false;

    //iDisplayVars()
    opcB1src = "images/empty.png";
    opcB2src = "images/empty.png";
    opcUIT1src = "P1";
    opcUIT2src = "&nbsp";
    opp1Rsrc = p1Arsenal[0].toString();
    opp1Psrc = p1Arsenal[1].toString();
    opp1Ssrc = p1Arsenal[2].toString();
    opp2Rsrc = p2Arsenal[0].toString();
    opp2Psrc = p2Arsenal[1].toString();
    opp2Ssrc = p2Arsenal[2].toString();

    opLogsrc = logD;
    lRsrc = ""; //log elements
    lr1Wsrc = "";
    lp1Playsrc = "";
    lp1Asrc = "";
    lp2Playsrc = "";
    lp2Asrc = "";
    leTieBreaker1src = "";//events
    leTieBreaker2src = "";
    leWBreak1src = "";
    leWBreak2src = "";

    opp1A.style.pointerEvents = 'auto';

    display();
}

//---------------------------------------------------------------------------------------------------

//main controller; manages turns and selections and calls other functions
function play(pick)
{
    if(canPlay)
    {
        p1play = pick;

        if(p1Arsenal[aWeaponPosition(p1play)] != 0)
        {
            setTimeout(p2Move, 1000);
            canPlay = false;

            checkForWBreak(p1play, "p1");
            updateCenterPlayer1();
        }
    }
    //re-enabled in autoReset. Prevents clicking reset while a play is in progress.
    oprDiv.style.pointerEvents = 'none';
}

//basic cpu function - random move
function p2Move()
{
    var temp = parseInt(getRandomInteger(0, 2));
    p2play = arsenal[temp];

    if(p2Arsenal[aWeaponPosition(p2play)] != 0)
    {
        sResult = shoot(p1play);
        
        checkForWBreak(p2play, "p2"); 
        wTransfer();
        
        roundNum++;
        
        updateCenterPlayer2();
    }
    else
    {
        //if can't play a move, but another move is available, then loop
        if(p2Arsenal[0] > 0 || p2Arsenal[1] > 0 || p2Arsenal[2] > 0)
            p2Move();
        else
        {
            return;
            console.log("break");
        }
    }
}

//check for weapon break if played thrice in a row
function checkForWBreak(pick, checkTurn)
{
    if(checkTurn == "p1")
    {
        if(pick == p1PrevPlay)
        {
            console.log("p1play in row " + p1PlayInRowCount);
            p1PlayInRowCount++;
            
            if(p1PlayInRowCount >= 3 && p1Arsenal[aWeaponPosition(p1play)] != 0)
            {
                p1Arsenal[aWeaponPosition(pick)]--;
                
                console.log("p1 " + pick + " break " + "[" + p1PlayInRowCount + "]");
                leWBreak1src = "Player1's " + pick + " broke after 3 consecutive uses"
                //malfunctions, wears out, shatters into pieces, runs away, explodes, cries for its mother, ties the noose
                wbreak1 = true;
            
                //set to 0 since it occurs after p1PlayInRowCount++;
                p1PlayInRowCount = 0;
            }
        }
        else
        {
            p1PlayInRowCount = 1;
        }
        
        p1PrevPlay = p1play;
    }
    if(checkTurn == "p2")
    {	
        if(pick == p2PrevPlay)
        {
            console.log("p2play in row " + p2PlayInRowCount);
            p2PlayInRowCount++;
            
            if(p2PlayInRowCount >= 3 && p2Arsenal[aWeaponPosition(p2play)] != 0)
            {
                //console.log("wbreakcheck isPlayable");
                p2Arsenal[aWeaponPosition(pick)]--;		
                
                console.log("p2 " + pick + " break " + "[" + p2PlayInRowCount + "]");
                leWBreak2src = "Player2's " + pick + " broke after 3 consecutive uses"

                wbreak2 = true;

                p2PlayInRowCount = 0;
            }
        }
        else
        {
            p2PlayInRowCount = 1;
        }
        
        p2PrevPlay = pick;
    }
}

//weapon transfer to winner
function wTransfer()
{
    if(sResult == "Tie")
    {
        checkForTieBreak();
    }

    if(sResult == "P1 win" && p2Arsenal[aWeaponPosition(p2play)] != 0)
    {
        p1Arsenal[aWeaponPosition(p2play)]++;
        p2Arsenal[aWeaponPosition(p2play)]--;
    }
    if(sResult == "P2 win" && p1Arsenal[aWeaponPosition(p1play)] != 0)
    {
        p2Arsenal[aWeaponPosition(p1play)]++;
        p1Arsenal[aWeaponPosition(p1play)]--;
    }
    
    prevResult = sResult;
}

function checkForTieBreak()
{
    //tieNum starts at 1 since the function is called during a tie.
    if(prevResult != "")
    {
        if(prevResult == sResult)
        {
            tieNum++;
            
            if(tieNum >= 3)
            {
                tieBreaker1();
                tieBreaker2();
            }
        }
        else
        {
            tieNum = 1;
        }
    }
}

function tieBreaker1()
{
    var temp = getRandomInteger(0, 2);

    if(p1Arsenal[temp] != 0)
    {
        p1Arsenal[temp]--;
        console.log("tiebreaker: item# " + temp + " - " + p1Arsenal + " p1");
        leTieBreaker1src = "P1 Tiebreaker: " + arsenal[temp];

        tiebreak = true;
    }
    else
        tieBreaker1();
}

function tieBreaker2()
{
    var temp = getRandomInteger(0, 2);

    if(p2Arsenal[temp] != 0)
    {
        p2Arsenal[temp]--;
        console.log("tiebreaker: item# " + temp + " - " + p2Arsenal + " p2");
        leTieBreaker2src = "P2 Tiebreaker: " + arsenal[temp];

        tiebreak = true;
    }
    else
        tieBreaker2();
}


//---------------------------------------------------------------------------------------------------------		

//returns winner of round
function shoot(pick)
{
    var result;

    if (p1play == p2play)
    {
        result = "Tie";
    }
    else if (p2play == hierarchy(pick))
    {
        result = "P2 win";
    }
    else
    {
        result = "P1 win";
    }

    return result;
}

//returns rock-paper-scissor heirarchy according to first player's pick to check if player 2 beat player 1
function hierarchy(rps)
{
    var winner;

    if (rps == "Rock")
    {
        winner = "Paper";
    }
    if (rps == "Paper")
    {
        winner = "Scissor";
    }
    if (rps == "Scissor")
    {
        winner = "Rock";
    }

    return winner;
}

/*Returns the position of a pick from the arsenal in order to subtract the weapon counts.*/
function aWeaponPosition(pick)
{
    if(pick == "Rock")
        return 0;
    if(pick == "Paper")
        return 1;
    if(pick == "Scissor")
        return 2;
}

//--------------------------------------------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------

//sorry i'm really bad at naming things
function updateCenterPlayer1()
{
    opcB1src = "images/" + p1play + ".png";
    opcUIT1src = "P2";
    opcB2src = opcB2.src;
    
    display();
}
function updateCenterPlayer2()
{
    opcB2src = "images/" + p2play + ".png";
    
    setTimeout(updateCenterRound, 500);

    display();
}
function updateCenterRound()
{
    opcUIT2src = sResult;

    opp1Rsrc = p1Arsenal[0].toString();
    opp1Psrc = p1Arsenal[1].toString();
    opp1Ssrc = p1Arsenal[2].toString();
    opp2Rsrc = p2Arsenal[0].toString();
    opp2Psrc = p2Arsenal[1].toString();
    opp2Ssrc = p2Arsenal[2].toString();

    checkForGameEnd();
    
    display();
}
function checkForGameEnd()
{
    if(p2Arsenal[0] <= 0 && p2Arsenal[1] <= 0 && p2Arsenal[2] <= 0)
    {
        updateCenterGame("P1");
    }
    else if(p1Arsenal[0] <= 0 && p1Arsenal[1] <= 0 && p1Arsenal[2] <= 0)
    {
        updateCenterGame("P2"); 
    }
    else
    {
        setTimeout(autoReset, 1000);
    }
}
//gg
function updateCenterGame(player)
{
    opcUIT2src = player + " Victory";

    gameEnd = true;
    updateLog();

    //prevents further clicking
    opp1A.style.pointerEvents = 'none';
    oprDiv.style.pointerEvents = 'auto';
    
    display();
}
function updateLog()
{
    opLogsrc = "<tr> <td> <c> Player1 </c> </td> <td> <c> <img src = 'images/" + p1play + ".png' /> </c> </td> <td> <c> Arsenal<br/>[" + p1Arsenal + "] </c> </td> </tr> <tr> <td> <c> Player2 </c> </td> <td> <c> <img src = 'images/" + p2play + ".png' /> </c> </td> <td> <c> Arsenal<br/>[" + p2Arsenal + "] </c> </td> </tr>" + opLogsrc;

    if(tiebreak)
    {
        opLogsrc = "<tr> <td> <c> Event </c> </td> <td colspan = '2'> <c>" + leTieBreaker1src + "</c> </td> </tr> <tr> <td> <c> Event </c> </td> <td colspan = '2'> </c>" + leTieBreaker2src + " </c> </td> </tr>" + opLogsrc;
    }
    if(wbreak1)
    {
        opLogsrc = "<tr> <td> <c> Event </c> </td> <td colspan = '2'> <c>" + leWBreak1src + "</c> </td> </tr>" + opLogsrc;
    }
    if(wbreak2)
    {
        opLogsrc = "<tr> <td> <c> Event </c> </td> <td colspan = '2'> <c>" + leWBreak2src + "</c> </td> </tr>" + opLogsrc;
    }

    //round# and round winner
    opLogsrc = "<tr> <td colspan = '3'> <c> Round <span style = 'font-size: 125%; color: rgb(25, 255, 236)'>" + roundNum + "</span>: " + sResult + "</c> </td> </tr>" + opLogsrc;

    if(gameEnd)
    {
        opLogsrc = "<tr> <td colspan = '3'> GAME OVER <br/> " + opcUIT2src + "</td> <tr>" + opLogsrc;
    }
}

function autoReset()
{
    updateLog();

    opcB1src = "images/empty.png";
    opcB2src = "images/empty.png";
    
    canPlay = true;
    
    p1play = "";
    p2play = "";

    opcUIT1src = "P1";
    opcUIT2src = "&nbsp";
    
    tiebreak = false;
    wbreak1 = false;
    wbreak2 = false;

    oprDiv.style.pointerEvents = 'auto';
    
    display();
}
function display()
{
    opcB1.src = opcB1src;
    opcB2.src = opcB2src;
    opcUIT1.innerHTML = opcUIT1src;
    opcUIT2.innerHTML = opcUIT2src;

    //arsenals
    opp1R.innerHTML = opp1Rsrc;
    opp1P.innerHTML = opp1Psrc;
    opp1S.innerHTML = opp1Ssrc;
    opp2R.innerHTML = opp2Rsrc;
    opp2P.innerHTML = opp2Psrc;
    opp2S.innerHTML = opp2Ssrc;

    //log
    opLog.innerHTML = opLogsrc;
}