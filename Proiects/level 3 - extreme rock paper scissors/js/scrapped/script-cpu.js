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

    //log
    opLog = document.getElementById("log");

    /*
    oplRound = document.getElementById("lRound");
    oplRWinner = document.getElementById("lRWinner");
    oplp1Play = document.getElementById("lp1Play");
    oplp1A = document.getElementById("lp1A");
    oplp2Play = document.getElementById("lp2Play");
    oplp2A = document.getElementById("lp2A");
    */

}
function iVars()
{
    p1play = "";
    p2play = "";
    sResult = "";
    p1PrevPlay = "";
    p2PrevPlay = "";
    prevResult = "";
    
    p1Arsenal = [5, 5, 5]; //[0] = Rock, [1] = Paper, [2] = Scissor//
    p2Arsenal = [5, 5, 5];
    
    p1PlayInRowCount = 1;
    p2PlayInRowCount = 1;
    turn = 1;
    tieNum = 1;
    roundNum = 0;
    
    canPlay = true;
    wbreak = false;
    tiebreak = false;
}
function iDisplayVars()
{
    opcB1src = "";
    opcB2src = "";
    opcUIT1src = "";
    opcUIT2src = "&nbsp";
    opp1Rsrc = "5"; //edit this so that these numbers are set by player
    opp1Psrc = "5";
    opp1Ssrc = "5";
    opp2Rsrc = "5";
    opp2Psrc = "5";
    opp2Ssrc = "5";

    opLogsrc = opLog.innerHTML;
    lRsrc = ""; //log elements
    lr1Wsrc = "";
    lp1Playsrc = "";
    lp1Asrc = "";
    lp2Playsrc = "";
    lp2Asrc = "";
    //leTransfersrc = ""; //events
    leTieBreaker1src = "";
    leTieBreaker2src = "";
    leWBreaksrc = "";
    
    /*
    oplRoundsrc = "";
    oplRWinnersrc = "";
    oplp1Playsrc = "";
    oplp1Asrc = "";
    oplp2Playsrc = "";
    oplp2Asrc = "";
    */
}
function iFunctions()
{
    
}

//---------------------------------------------------------------------------------------------------

//main controller; manages turns and selections and calls other functions
function play(pick)
{
    if(canPlay)
    {
        p1play = pick;

        //scrapping isPlayable(pick)
        if(p1Arsenal[aWeaponPosition(p1play)] != 0)
        {
            setTimeout(p2Move, 1000);
            canPlay = false;

            checkForWBreak(p1play, "p1");
            updateCenterPlayer1();
        }
        else
        {
            //if no more weapons in arsenal, game over. lock the image onclicks.
            //also, make a reset button, and prevent the arsenal weapon counts from falling below 0.
            if(p1Arsenal[0] <= 0 && p1Arsenal[1] <= 0 && p1Arsenal[2] <= 0)
            {
                updateCenterGame("P2");
            }
        }
    }
}

//basic cpu function - random move
function p2Move()
{
    //remember to parseInt cos getRandomInteger returns a string
    var temp = parseInt(getRandomInteger(0, 2));
    p2play = arsenal[temp];

    if(p2Arsenal[aWeaponPosition(p2play)] != 0)
    {
        //console.log("p2play isPlayable");
        sResult = shoot(p1play);
        
        checkForWBreak(p2play, "p2"); 
        wTransfer();
        
        roundNum++;
        //console.log("round " + roundNum);
        
        updateCenterPlayer2();
    }
    else
    {
        if(p2Arsenal[0] >= 0 || p2Arsenal[1] >= 0 || p2Arsenal[2] >= 0)
            p2Move();
        else
            updateCenterGame("P1");
    }
}

/*SCRAPPED - too situational. Can prob make a more flexible function but not many use cases in this program
function isPlayable(pick)
{
    if(canPlay)
    {
        if(p1Arsenal[aWeaponPosition(pick)] <= 0)
        {
            console.log("no [p1] " + p1Arsenal[aWeaponPosition(pick)] + " [" + pick + "]");
            return false;
        }
        else
        {
            console.log("yes [p1] " + p1Arsenal[aWeaponPosition(pick)] + " [" + pick + "]");
            return true;
        }
    }
    else
    {
        if(p2Arsenal[aWeaponPosition(pick)] <= 0)
        {
            console.log("no [p2] " + p2Arsenal[aWeaponPosition(pick)] + " [" + pick + "]");
            return false;
        }
        else
        {
            console.log("yes [p2] " + p2Arsenal[aWeaponPosition(pick)] + " [" + pick + "]");
            return true;
        }
    }
}
*/

//very inconsistent parameters. I need to work on them
//check for weapon break if played thrice in a row
function checkForWBreak(pick, checkTurn)
{
    if(checkTurn == "p1")
    {
        if(pick == p1PrevPlay)
        {
            p1PlayInRowCount++;
            
            //RESOLVED 
            //cannot use isPlayable since this function executes simultaneously with the transfer function
            //so it'd check for if the weapon arsenal count is > 0, which it'd be, and then both functions will subtract 1.
            if(p1PlayInRowCount >= 3 && p1Arsenal[aWeaponPosition(p1play)] != 0)
            {
                //console.log("wbreakcheck isPlayable");
                p1Arsenal[aWeaponPosition(pick)]--;
                
                console.log("p1 " + pick + " break " + "[" + p1PlayInRowCount + "]");
                leWBreaksrc = "Player1's " + pick + " broke after 3 consecutive uses"
                //malfunctions, wears out, shatters into pieces, runs away, explodes, cries for its mother, ties the noose
                wbreak = true;
            
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
            p2PlayInRowCount++;
            
            if(p2PlayInRowCount >= 3 && p1Arsenal[aWeaponPosition(p2play)] != 0)
            {
                //console.log("wbreakcheck isPlayable");
                p2Arsenal[aWeaponPosition(pick)]--;		
                
                console.log("p2 " + pick + " break " + "[" + p2PlayInRowCount + "]");
                leWBreaksrc = "Player2's " + pick + " broke after 3 consecutive uses"

                wbreak = true;

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
        //leTransfersrc = "Tie! " + p1play;
    }

    //I've had so many goddamn tiny ass issues with this portion of my code and they keep fucking up my whole program and then I'd spend like 40 minutes fixing each one REEEEE
    //cannot use isPlayable() since it checks based on turn. I need to work on consistency with my functions.
    //DO NOT DO p2Arsenal[aWeaponPosition(p2play)]-- AS AN IF CONDITION, IT EXECUTES THE THING LMAO FUCK
    //DO NOT DO if(sResult == "P1 win" && (p2Arsenal[aWeaponPosition(p2play)] - 1) != 0) since if p2Arsenal[aWeaponPosition(p2play)] = 0 then it'll check if -1 = 0.
    //console.log("p2play: " + p2play);
    //console.log("p2 Arsenal paper count - 1: " + (p2Arsenal[aWeaponPosition(p2play)] - 1));
    if(sResult == "P1 win" && p2Arsenal[aWeaponPosition(p2play)] != 0)
    {
        p1Arsenal[aWeaponPosition(p2play)]++;
        p2Arsenal[aWeaponPosition(p2play)]--;
        //console.log("transfer: item# " + aWeaponPosition(p2play) + " - " + p2Arsenal + " p2");
        //display both the consolelog and both players' arsenals in the log 
        //leTransfersrc = "Player1 robs Player2 of their " + p2play;
    }
    if(sResult == "P2 win" && p1Arsenal[aWeaponPosition(p1play)] != 0)
    {
        //console.log(p1Arsenal[aWeaponPosition(p1play)]);
        p2Arsenal[aWeaponPosition(p1play)]++;
        p1Arsenal[aWeaponPosition(p1play)]--;
        //console.log("transfer: item# " + aWeaponPosition(p2play) + " - " + p1Arsenal + " p1");
        //leTransfersrc = "Player2 robs Player1 of their " + p1play;
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
                tieBreaker();
            }
        }
        else
        {
            tieNum = 1;
        }
    }
    //console.log("tieNum = " + tieNum);
}

function tieBreaker()
{
    var temp = getRandomInteger(0, 2);

    if(p1Arsenal[aWeaponPosition(temp)] != 0)
    {
        p1Arsenal[temp]--;
        console.log("tiebreaker: item# " + temp + " - " + p1Arsenal + " p1");
        //console.log("P1 Tiebreaker: " + arsenal[temp]);
        leTieBreaker1src = "P1 Tiebreaker: " + arsenal[temp];

        tiebreak = true;
    }

    temp = getRandomInteger(0, 2);

    if(p2Arsenal[aWeaponPosition(temp)] != 0)
    {
        p2Arsenal[temp]--;
        console.log("tiebreaker: item# " + temp + " - " + p2Arsenal + " p2");
        //console.log("P2 Tiebreaker: " + arsenal[temp]);
        leTieBreaker2src = "P2 Tiebreaker: " + arsenal[temp];

        tiebreak = true;
    }
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
    
    setTimeout(autoReset, 1500);

    display();
}
function updateCenterRound()
{
    opcUIT2src = sResult;
    
    display();
}
//gg
function updateCenterGame(player)
{
    /*create a div, maybe in the log, maybe hidden, and set this statement equal to the innerHTML and
    maybe set style.display to block.*/
    console.log("Game Over. " + player + " wins.");
    
    display();
}
function updateLog()
{
    //gives each player's play
    opLogsrc = "<tr> <td> <c> Player1 </c> </td> <td> <c> <img src = 'images/" + p1play + ".png' /> </c> </td> <td> <c> -Arsenal- [ " + p1Arsenal + " ] </c> </td> </tr> <tr> <td> <c> Player2 </c> </td> <td> <c> <img src = 'images/" + p2play + ".png' /> </c> </td> <td> <c> -Arsenal- [ " + p2Arsenal + " ] </c> </td> </tr>" + opLogsrc;

    //YOU ARE HERE 11/21 (APPEND EVENTS TO LOG.) -- WORKS (11/22)!!
    if(tiebreak)
    {
        //console.log("tiebreak");
        opLogsrc = "<tr> <td> <c> Event </c> </td> <td colspan = '2'> <c>" + leTieBreaker1src + "</c> </td> </tr> <tr> <td> <c> Event </c> </td> <td colspan = '2'> </c>" + leTieBreaker2src + " </c> </td> </tr>" + opLogsrc;
    }
    if(wbreak)
    {
        //console.log("wbreak");
        opLogsrc = "<tr> <td> <c> Event </c> </td> <td colspan = '2'> <c>" + leWBreaksrc + "</c> </td> </tr>" + opLogsrc;
    }

    //transfer weapon // tie (SCRAPPED)
    //opLogsrc = "<tr> <td colspan = '2'> <c>" + leTransfersrc + "</c> </td> </tr>" + opLogsrc;
    
    //round# and round winner
    opLogsrc = "<tr> <td colspan = '3'> <c> Round <span style = 'font-size: 125%; color: rgb(25, 255, 236)'>" + roundNum + "</span>: " + sResult + "</c> </td> </tr>" + opLogsrc;
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
    
    opp1Rsrc = p1Arsenal[0].toString();
    opp1Psrc = p1Arsenal[1].toString();
    opp1Ssrc = p1Arsenal[2].toString();
    opp2Rsrc = p2Arsenal[0].toString();
    opp2Psrc = p2Arsenal[1].toString();
    opp2Ssrc = p2Arsenal[2].toString();
    
    tiebreak = false;
    wbreak = false;
    
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
