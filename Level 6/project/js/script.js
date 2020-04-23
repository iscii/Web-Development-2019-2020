//debugging this program has been a pain in the arse due to how objects work and the difficulty of replicating bugged situations e.e
function initialize()
{
    //Element references
    opP1 = document.getElementById("p1disp");
    opP2 = document.getElementById("p2disp");
    opP3 = document.getElementById("p3disp");
    opP4 = document.getElementById("p4disp");

    opDiscard = document.getElementById("topdiscardcard");
    opDeck = document.getElementById("topdeckcard");
    opRounds = document.getElementById("roundController");
    opReStart = document.getElementById("reStart");
    opPEvents = document.getElementById("playerevents");
    opGEvents = document.getElementById("gameevents");

    //Create players
    players = [new Player("p1"), new Player("p2"), new Player("p3"), new Player("p4")];

    //Create round vars
    round = 0;
    gameEnd = false;
    awaitNextRound = false;
    victor = null; //declaration (i can't set it to 0 since that's p1)

    //Create element vars
    pEventsrc = "";
    gEventsrc = "";

    //Determine dealer & turn - put before card deals cos they display
    dealer = getRandomInteger(p1, p4);
    turn = dealer + 1;
    if(dealer + 1 > p4) //*if there's a way to loop it without this conditional, pls do tell
        turn = p1;
    console.log("First turn: " + turn); //!

    display();
}
function startRound()
{
    /*
    if(checkGameEnd)
    {
        gameEnd = true;
        return display();
    } */

    //Create round vars
    round++;
    userTurn = false;
    canDiscard = false;
    knocked = false;
    awaitNextRound = false;

    //Create deckpile
    deckpile = new CardDeck("Deck");
    discardpile = new CardDeck("Discard");

    //Create element vars
    pEventsrc = players[turn].id.toUpperCase() + "'s turn";
    
    deckpile.generateStandardDeck();
    deckpile.shuffleDeck();
    console.log(deckpile); //!

    //Initialize discard pile. Placed before card deals since display requires discardpile to be initialized.
    discardpile.push(deckpile.shift());
    console.log(discardpile); //!

    //Follow-up rounds initiations
    if(round != 1)
    {
        //sets dealer to next dealer clockwise
        determineDealer();
        while(!players[dealer].strikes) //if the player is out, the dealer is the next. if that one is out, the next.
            determineDealer();

        //sets turn to next turn clockwise
        turn = dealer;
        nextTurn();
        while(!players[turn].strikes) //if the player is out, the turn is the next. 
            nextTurn();

        //resets all players' hands and knocker property
        for(var i = 0; i < players.length; i++)
        {
            players[i].hand = [];
            players[i].knocker = false;
            players[i].isout = false;
        }
    }

    console.log("[Note] Dealer: " + players[dealer].id + " --------------------------");

    //Deal cards
    for(var i = 0; i < 4; i++)
    {  
        if(!players[i].strikes) //skips players that are out
        {
            console.log(players[i].id + " is out! Did not draw");
            continue;
        }   
        players[i].drawCards(3, deckpile);
        //! add a check function to check for 31. If 31, end round and give all other players a strike.
    }
    console.log(players); //!
    
    console.log("[Next Round] --------------------------------------------------------"); //!
    game();
    display();
}
function checkGameEnd()
{
    var ingame = [];
    for(var i = 0; i < players.length; i++)
        if(players[i].strikes)
            ingame.push(i);

    if(ingame.length == 1)
    {
        victor = ingame[0];
        return true;
    }
    return false;
}

//cpu controller
function cpuMoves()
{
    gEventsrc = "";
    pEventsrc = "";
    //check if the drawpile is empty.
    if(!deckpile[0])
    {
        //display the empty deck for visual effect
        display();
        
        var discardlength = discardpile.length; //addresses changing deck sizes due to player outs and addresses only pushing half of discardpile into deckpile, as the for function constantly updates discardpile.length as the deck is shifted
        //move all discarded cards to deck
        for(i = 0; i < discardlength; i++)
            deckpile.push(discardpile.shift());

        deckpile.shuffleDeck(); //shuffle
        discardpile.push(deckpile.shift()); //first card of discard is top of deck pile
        return;
    }
    
    if(!players[turn].strikes) //Check if player in turn has strikes. If not, pass turn and continue with interval
    {
        console.log("[Note] " + players[turn].id + " is out!");
        return nextTurn();
    }
    if(turn == p1 || players[turn].knocker)  //*<- remove this to turn user player into a bot
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
    //only for user
    //hold turn's value to check for lowest score
    if(players[turn].knocker)
        return tally();
    
    if(turn == p1)
    {
        userTurn = true;
        return console.log("user's turn"); //!
    }
    userTurn = false;

    cpuInterval = setInterval(cpuMoves, 1500); //create a variable that holds an interval
}
function nextTurn()
{
    turn++;
    if(turn > p4)
        turn = p1;
    if(!players[turn].knocker)
        pEventsrc = players[turn].id.toUpperCase() + "'s turn";
    console.log(pEventsrc); //!
    display();
}
function determineDealer()
{
    dealer++;
    if(dealer > p4) //loops it back
        dealer = p1;
    console.log("Dealer: " + dealer);
}
function tally(checking31)
{
    /*
    if(checking31)
    {
        for(var i = 0; i < players.length; i++)
        {
            if(players[i].determineHandValue() == 31)
            {
                for(var o = 0; o < players.length; o++)
                {
                    if(o != i)
                        players[o].strikes--;
                }
                return display();
            }
        }
    } */
    pEventsrc = "";
    awaitNextRound = true;
    for(var i = 0; i < players.length; i++)
    {
        if(players[i].strikes)
        {
            var lowestScore = players[i].determineHandValue();
            break;
        } 
    }
    for(var i = 0; i < players.length; i++) //determine the lowest score
    {
        if(!players[i].strikes)
            continue;

        if(players[i].determineHandValue() < lowestScore)
            lowestScore = players[i].determineHandValue();
    }
    
    for(var i = 0; i < players.length; i++) //strike to all with lowest score
    {
        if(!players[i].strikes)
            continue;

        if(players[i].determineHandValue() == lowestScore)
        {
            players[i].strikes--;

            if(players[i].knocker && players[i].strikes) //if the knocker has the lowest score and they aren't at 0 strikes, they lose an additional point.
                players[i].strikes--;
        }

        if(!players[i].strikes) //if this round eliminates the player, set isout to true.
            players[i].isout = true;

        console.log(players[i]); //!
        console.log(players[i].determineHandValue()); //!
    }
    display(); 
}

function display()
{
    //Deck display
    if(!deckpile[0] && round)
        opDeck.src = "./images/cards/empty.png";
    else
        opDeck.src = "./images/cards/back-red-75-3.png";

    //Discard display
    if(discardpile[0] && round)
        opDiscard.src = "./images/cards/" + discardpile[0].rank + "-" + discardpile[0].suit + ".png";
    else
        opDiscard.src = "./images/cards/empty.png";

    //Player display
    for(var i = 0; i < players.length; i++)
    {
        eval("opP" + (i + 1)).innerHTML = ""; //*resets the divs so that the images don't build onto each other (see bug 1)
        //if a player is out, show empty cards instead (addresses format issue 4.18.2020)
        //*cannot put this inside the for loop below since their hand length is 0 so the loop isn't even called for them
        if(!players[i].strikes && !players[i].isout || !round) //check for !knocked so that it doesn't display an empty image upon reveal and tally
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
            //? Is it possible to give the element a class that'll have style properties defined in css? I tried it but the class property never appeared in console.log, whilst id and src did.

            image.src = "./images/cards/" + players[i].hand[o].rank + "-" + players[i].hand[o].suit + ".png"; //*preset shown cards

            if(i == 0) //only for the user player
            {
                image.onclick = function() //*calls the discard function and inputs as parameter the image's id without the "img" portion.
                {
                    players[p1].discardCards(this.id.slice(5), true);
                }
            }
            else if(!players[turn].knocker) //*if not user and if round isn't ended, hide cards
                image.src = "./images/cards/back-red-75-3.png";
            
            eval("opP" + (i + 1)).appendChild(image);
        }
    }

    //Next round button display
    if(awaitNextRound)
        opRounds.style.display = "block";
    else
        opRounds.style.display = "none";

    //cannot click button during gameplay
    if(awaitNextRound || !round || gameEnd)
    {
        if(!round || gameEnd) //I feel that there's a way to greatly simplify these conditionals but I can't seem to think of it
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
}

