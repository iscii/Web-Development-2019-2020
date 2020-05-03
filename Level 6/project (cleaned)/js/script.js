//debugging this program has been a pain in the arse due to how objects work and the difficulty of replicating bugged situations e.e
function initialize()
{
    //Element references
    opP1 = document.getElementById("p1disp");
    opP2 = document.getElementById("p2disp");
    opP3 = document.getElementById("p3disp");
    opP4 = document.getElementById("p4disp");

    opDiscard = document.getElementById("topdiscardcard");
    opDiscard2 = document.getElementById("bottomdiscardcard");
    opDiscardAnim = document.getElementById("topdiscardanim");
    opDeck = document.getElementById("topdeckcard");
    opDeck2 = document.getElementById("bottomdeckcard");
    opDeckAnim = document.getElementById("topdeckanim");
    opRounds = document.getElementById("roundController");
    opReStart = document.getElementById("reStart");
    opPEvents = document.getElementById("playerevents");
    opGEvents = document.getElementById("gameevents");
    opRInfo = document.getElementById("roundinfo");
    opTallies = document.getElementById("tallies");
    opInstMain = document.getElementById("instmain");
    opInstBlock = document.getElementById("instblock");

    opP1Strikes = document.getElementById("p1strikes");
    opP2Strikes = document.getElementById("p2strikes");
    opP3Strikes = document.getElementById("p3strikes");
    opP4Strikes = document.getElementById("p4strikes");

    //Create players
    players = [new Player("p1"), new Player("p2"), new Player("p3"), new Player("p4")];

    //Create round vars
    round = 0;
    userTurn = false;
    gameEnd = false;
    awaitNextRound = false;
    canDiscard = false;
    victor = null;

    //Create element vars
    pEventsrc = "";
    gEventsrc = "";
    rInfosrc = "";
    tallysrc = "";

    //Determine dealer & turn - put before card deals cos they display
    dealer = getRandomInteger(p1, p4);
    turn = dealer + 1;
    if(dealer + 1 > p4) //*if there's a way to loop it without this conditional, pls do tell
        turn = p1;

    display();
}
function startRound()
{
    //Start round vars
    round++;
    userTurn = false; //userTurn is a thing since it's controlled by setTimeout() rather than nextTurn(). It seems rather redundant but it's necessary
    gameEnd = false;
    awaitNextRound = false;
    knocked = false;
    losers = []; 

    //Start deckpile
    deckpile = new CardDeck("Deck");
    discardpile = new CardDeck("Discard");

    deckpile.generateStandardDeck();
    deckpile.shuffleDeck();

    //Initialize discard pile. Placed before card deals since display requires discardpile to be initialized.
    discardpile.push(deckpile.shift());

    //Follow-up rounds initiations
    if(round != 1)
    {
        //sets dealer to next dealer clockwise
        determineDealer();
        
        //sets turn to next turn clockwise
        turn = dealer;
        nextTurn();

        //resets all players' hands and knocker property
        for(var i = 0; i < players.length; i++)
        {
            players[i].hand = [];
            players[i].knocker = false;
            players[i].isout = false;
        }
    }
    //Start display vars
    pEventsrc = players[turn].id.toUpperCase() + "'s turn"; //First turn of game
    rInfosrc = "Round " + round + "<br/>" + "Dealer: " + players[dealer].id.toUpperCase();
    tallysrc = "";

    //Deal cards
    for(var i = 0; i < 4; i++)
    {  
        if(!players[i].strikes) //skips players that are out
            continue;
        players[i].drawCards(3, deckpile);
    }
    
    game();
    display();
}

//cpu controller
function cpuMoves()
{
    gEventsrc = "";
    pEventsrc = "";
    //check if the drawpile is empty.
    if(checkEmpty()) return;
    
    if(turn == p1 || players[turn].knocker || gameEnd)  //*<- remove this to turn user player into a bot
    { 
        clearInterval(cpuInterval); //?for some reason, doing game(); and then return clearInterval(cpuInterval); would call the game() statement but not the clearInterval statement. In fact, it'd call nothing below game(). very strange.
        return game();
    } 
    //cpu decisions
    //knock
    if(players[turn].determineHandValue() > 24 && !knocked)
    {
        players[turn].knockTurn();
        return nextTurn();
    }
    //draw
    if(discardpile[0] && (players[turn].determineHandValue(discardpile[0], false, true)) > players[turn].determineHandValue()) //check if discard has a card and if the card will benefit the hand.
        players[turn].drawCards(1, discardpile);
    else //from deck
        players[turn].drawCards(1, deckpile);
        
    //cpu discard
    setTimeout(function(){
        players[turn].discardCards(players[turn].determineHandValue(null, true));
        nextTurn();
    }, 500);
}

//game managers
function game()
{
    gEventsrc = "";
    //hold turn's value to check for lowest score
    if(players[turn].knocker || gameEnd)
        return tally();
    
    if(turn == p1)
    {
        checkEmpty();
        pEventsrc = players[turn].id.toUpperCase() + "'s turn"; //when the player is the first turn of a round, nextTurn is not called so the display text must be declared here.
        userTurn = true;
        display();
        return 
    }
    userTurn = false;

    cpuInterval = setInterval(cpuMoves, 1500); //create a variable that holds an interval
}
function nextTurn()
{
    turn++;
    if(turn > p4)
        turn = p1;
    if(!players[turn].strikes) //if the player is out, the turn is the next. 
        return nextTurn();

    if(!players[turn].strikes)
        pEventsrc = players[turn].id.toUpperCase() + " is out!";
    else if(!players[turn].knocker)
        pEventsrc = players[turn].id.toUpperCase() + "'s turn";
    
    display();
}
function checkEmpty()
{
    if(!deckpile[0])
    {
        //display the empty deck for visual effect
        var discardlength = discardpile.length; //addresses changing deck sizes due to player outs and addresses only pushing half of discardpile into deckpile, as the for function constantly updates discardpile.length as the deck is shifted
        //move all discarded cards to deck
        for(i = 0; i < discardlength; i++)
            deckpile.push(discardpile.shift());

        deckpile.shuffleDeck(); //shuffle
        discardpile.push(deckpile.shift()); //first card of discard is top of deck pile
        display();
        return true;
    }
}
function determineDealer()
{
    dealer++;
    if(dealer > p4) //loops it back
        dealer = p1;
    if(!players[dealer].strikes) //if the player is out, the dealer is the next. if that one is out, the next.
        return determineDealer();
        
    rInfosrc += "<br/>" + "Dealer: " + players[dealer].id.toUpperCase();
}
function tally()
{
    pEventsrc = "";
    awaitNextRound = true;

    var ingame = [];

    for(var i = 0; i < players.length; i++)
    {
        if(!players[i].strikes)
            continue;
        ingame.push(i);
    }

    for(var i = 0; i < ingame.length; i++)
    {
        if(players[ingame[i]].determineHandValue() == 31)
        {
            gEventsrc = players[ingame[i]].id.toUpperCase() + " 31!";
            for(var j = 0; j < players.length; j++)
            {
                if(j == ingame[i])
                    continue;
                losers.push(j);
                players[j].strikes--;
            }
            checkEndGame();
            return display();
        }
    }

    var lowestScore = players[ingame[0]].determineHandValue();

    for(var i = 0; i < ingame.length; i++) //determine the lowest score
    {
        if(players[ingame[i]].determineHandValue() < lowestScore)
            lowestScore = players[ingame[i]].determineHandValue();
    }

    //check for tie and last round
    if(ingame.length == 2)
    {
        if((players[ingame[0]].determineHandValue() == players[ingame[1]].determineHandValue()) && (players[ingame[0]].strikes == 1 && players[ingame[0]].strikes == 1))
        {
            for(var i = 0; i < players.length; i++)
                players[i].strikes++;
            
            pEventsrc = "Tie!!!";
            return display();
        }
    }

    for(var i = 0; i < ingame.length; i++) //strike to all with lowest score
    {
        var x = ingame[i];
        tallysrc += "P" + (x + 1) + ": " + players[x].determineHandValue() + "<br/>";
        if(players[x].determineHandValue() == lowestScore)
        {
            losers.push(x);
            players[x].strikes--;

            if(players[x].knocker && players[x].strikes) //if the knocker has the lowest score and they aren't at 0 strikes, they lose an additional point.
                players[x].strikes--;
        }

        if(!players[x].strikes) //if this round eliminates the player, set isout to true.
            players[x].isout = true; 
    }

    checkEndGame();
    display(); 
}

function checkEndGame()
{
    var ingame = [];
    for(var i = 0; i < players.length; i++)
        if(players[i].strikes)
            ingame.push(i);

    if(ingame.length == 1)
        victor = ingame[0];
}

function toggleInstructions()
{
    if(opInstMain.style.display == "none")
        opInstMain.style.display = "flex";
    else
        opInstMain.style.display = "none";
}

function display()
{
    //Please email me if there's a simpler way to do these conditionals, I get a feeling that it's too redundant.
    //Deck display
    if(!deckpile[0] && round)
        opDeck.src = "./images/cards/empty.png";
    else
        opDeck.src = "./images/cards/back-red-75-3.png";
    if(!deckpile[1] && round)
        opDeck2.src = "./images/cards/empty.png";
    else
        opDeck2.src = "./images/cards/back-red-75-3.png";

    //Discard display
    if(discardpile[0] && round)
        opDiscard.src = "./images/cards/" + discardpile[0].rank + "-" + discardpile[0].suit + ".png";
    else
        opDiscard.src = "./images/cards/empty.png";
    if(discardpile[1] && round)
        opDiscard2.src = "./images/cards/" + discardpile[1].rank + "-" + discardpile[1].suit + ".png";
    else
        opDiscard2.src = "./images/cards/empty.png";

    //Player displays
    for(var i = 0; i < players.length; i++)
    {
        eval("opP" + (i + 1)).innerHTML = ""; //*resets the divs so that the images don't build onto each other (see bug 1)
        //if a player is out, show empty cards instead (addresses format issue 4.18.2020)
        //*cannot put this inside the for loop below since their hand length is 0 so the loop isn't even called for them
        if(!players[i].strikes && (!players[i].isout || (i != victor)) || !round) //check for !knocked so that it doesn't display an empty image upon reveal and tally
        {
            for(var o = 0; o < 3; o++)
            {
                var image = document.createElement("img");
                image.src = "./images/cards/empty.png";
                eval("opP" + (i + 1)).appendChild(image); 
            }
            continue;
        }

        for(var o = 0; o < players[i].hand.length; o++)
        {
            var image = document.createElement("img");
            image.id = "hand " + o; //*o for card's position in hand (for discard)
            //? Is it possible to give the element a class that'll have style properties defined in css? I tried it but the class property never appeared in 

            image.src = "./images/cards/" + players[i].hand[o].rank + "-" + players[i].hand[o].suit + ".png"; //*preset shown cards

            if(i == 0) //only for the user player
            {
                image.onclick = function() //*calls the discard function and inputs as parameter the image's id without the "img" portion.
                {
                    players[p1].discardCards(this.id.slice(5), true);
                }
                if(userTurn && canDiscard)
                    image.className = "handanim";
                else
                    image.className = null;
            }
            else if(!players[turn].knocker && !gameEnd) //*if not user and if round isn't ended, hide cards
                image.src = "./images/cards/back-red-75-3.png";
            
            eval("opP" + (i + 1)).appendChild(image);
        }
    }

    //Animation control
    if(userTurn && !canDiscard)
    {   
        opDeckAnim.className = "pileanim";
        opDiscardAnim.className = "pileanim";
        opDiscard2.style.boxShadow = "0 0 10px white";
        opDeck2.style.boxShadow = "0 0 10px white";
    }
    else
    {
        opDeckAnim.className = null;
        opDiscardAnim.className = null;
        opDiscard2.style.boxShadow = null;
        opDeck2.style.boxShadow = null;
    }

    //Strikes display
    for(var i = 0; i < players.length; i++)
    {
        eval("opP" + (i + 1) + "Strikes").innerHTML = players[i].strikes;
        if(round)
            eval("opP" + (i + 1) + "Strikes").style.display = "inline-block";
    }

    //Please email me if there's a simpler way to do these conditionals as well.
    //Next round button display
    if(awaitNextRound && (!victor || gameEnd))
    {
        if(losers.length > 1)
            pEventsrc = "Losers: ";
        else
            pEventsrc = "Loser: ";
        
        for(var i = 0; i < losers.length; i++)
            pEventsrc += players[losers[i]].id.toUpperCase() + " ";

        opRounds.style.display = "block";
    }
    else
    {
        if(victor)
            pEventsrc = players[victor].id.toUpperCase() + " Wins!";
        opRounds.style.display = "none";
    }

    //cannot click button during gameplay
    if(awaitNextRound || !round || gameEnd)
    {
        if(!round)
            opReStart.innerHTML = "Start";
        else
            opReStart.innerHTML = "Reset";

        opReStart.style.display = "block";
    }
    else
        opReStart.style.display = "none";

    //Event display
    opPEvents.innerHTML = pEventsrc;
    opGEvents.innerHTML = gEventsrc;
    opRInfo.innerHTML = rInfosrc;
    opTallies.innerHTML = tallysrc;
}