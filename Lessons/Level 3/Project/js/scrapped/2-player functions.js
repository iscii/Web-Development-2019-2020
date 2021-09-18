
//disables and enables image onclicks based on turn
function setTurn()
{
    if (turn == 1)
    {
        opp1A.style.pointerEvents = 'auto';
        opp2A.style.pointerEvents = 'none';

        console.log("--p1's turn--");
    }
    else if (turn == 2)
    {
        opp2A.style.pointerEvents = 'auto';
        opp1A.style.pointerEvents = 'none';

        console.log("--p2's turn--");
    }

    //updateUI();
}

//main controller; manages turns and selections and calls other functions
function play(pick)
{
    if (canPlay)
    {
        //turn remains between 1 and 2.
        if (turn == 1)
        {
            p1play = pick;
            console.log("p1 " + "[" + p1play + "]");
            turn++;
        }
        else
        {
            p2play = pick;
            console.log("p2 " + "[" + p2play + "]");
            sResult = shoot(p1play);
            turn--;
        }

        //disables and enables image onclicks based on turn
        updateCenter(pick);
        setTurn();
    }
}

//returns winner of round
function shoot(pick)
{
    var result;

    if (p1play == p2play)
    {
        result = "tie";
        //console.log("tie");
    }
    else if (p2play == hierarchy(pick))
    {
        result = "P2 win";
        //console.log("p2 win");
    }
    else
    {
        result = "P1 win";
        //console.log("p1 win");
    }

    p1play = "";
    p2play = "";

    return result;
}

//returns rock-paper-scissor heirarchy according to first player's pick to check if player 2 beat player 1
function hierarchy(rps)
{
    var winner;

    if (rps == "rock")
    {
        //console.log("rock");
        winner = "paper";
    }
    if (rps == "paper")
    {
        //console.log("paper");
        winner = "scissor";
    }
    if (rps == "scissor")
    {
        //console.log("scissor");
        winner = "rock";
    }

    return winner;
}

//sorry i'm really bad at naming things
function updateCenter(pick)
{
    //updates image src
    //check if turn == 2 since player 1 would have gone by the time this is updated
    if (turn == 2)
    {
        opcB1src = "images/" + pick + ".png";
        opcUIT1src = "P2";
        //to keep the empty box there since it would set opcB2.src to null without this.
        opcB2src = opcB2.src;
        //console.log(opcB1src);
    }
    else
    {
        opcB2src = "images/" + pick + ".png";
        opcUIT2src = sResult;

        canPlay = false;

        setTimeout(autoReset, 1000);
    }

    display();
}

//I feel like I can squeeze this into updateCenter() but I want to use setTimeout and it's more simplified like this
function autoReset()
{
    opcB1src = "images/empty.png";
    opcB2src = "images/empty.png";

    canPlay = true;

    opcUIT1src = "P1";
    opcUIT2src = "";

    display();
}

function display()
{
    opcB1.src = opcB1src;
    opcB2.src = opcB2src;
    opcUIT1.innerHTML = opcUIT1src;
    opcUIT2.innerHTML = opcUIT2src;
}
