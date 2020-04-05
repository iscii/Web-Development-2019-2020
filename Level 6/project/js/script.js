//debugging this program has been a pain in the arse due to how objects work and the difficulty of replicating bugged situations e.e
function initialize()
{
    //Element references
    opP1 = document.getElementById("p1disp");
    opP2 = document.getElementById("p2disp");
    opP3 = document.getElementById("p3disp");
    opP4 = document.getElementById("p4disp");

    opDiscard = document.getElementById("topdiscardcard");

    //Create deckpile
    deckpile = new CardDeck();
    discardpile = new CardDeck();

    //Create players
    players = [new Player("p1"), new Player("p2"), new Player("p3"), new Player("p4")];

    //Create round vars
    round = 1;
    canDiscard = false;
    knocked = false;

    deckpile.generateStandardDeck();
    deckpile.shuffleDeck();
    console.log(deckpile); //!

    //Determine dealer & turn - put before card deals cos they display
    dealer = getRandomInteger(p1, p4);
    turn = dealer + 1;
    if(dealer + 1 > p4) //*if there's a way to loop it without this conditional, pls do tell
        turn = p1;
    console.log("First turn: " + turn); //!
    
    //Initialize discard pile. Placed before card deals since display requires discardpile to be initialized.
    discardpile.push(deckpile.shift());

    //Deal cards
    for(var i = 0; i < 4; i++)
    {  
        players[i].drawCards(3, deckpile);
    }
    console.log(players); //!

    game();
    display();
}

//cpu controller
function cpuMoves()
{
    if(players[turn].strikes < 0) //Check if player in turn has strikes. If not, pass turn and continue with interval
        return nextTurn();
    if(turn == p1 || players[turn].knocker) 
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
    if(discardpile[0] && (players[turn].determineHandValue(discardpile[0])) > players[turn].determineHandValue()) //check if discard has a card and if the card will benefit the hand.
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
    //only for user
    //hold turn's value to check for lowest score
    if(players[turn].knocker)
        return tally();
    
    if(turn == p1) 
        return console.log("user's turn"); //!

    cpuInterval = setInterval(cpuMoves, 1500); //create a variable that holds an interval
}
function nextTurn()
{
    turn += 1;
    if(turn > p4)
        turn = p1;
}
function tally()
{
    //!YOU ARE HERE 4/4/2020. You've just finished the strike/tally system. Move onto round management (next round after tallying) and then the rest in the function semi-pseudocode todo list.
    var lowestScore = players[0].determineHandValue();
    for(var i = 1; i < players.length; i++) //determine the lowest score
    {
        if(players[i].strikes == 0)
            continue;

        if(players[i].determineHandValue() < lowestScore)
            lowestScore = players[i].determineHandValue();
    }
    
    for(var i = 0; i < players.length; i++) //strike to all with lowest score
    {
        if(players[i].strikes == 0)
            continue;

        if(players[i].determineHandValue() == lowestScore)
        {
            players[i].strikes--;

            if(players[i].knocker) //if the knocker has the lowest score, they lose an additional point.
                players[i].strikes--;
        }

        console.log(players[i]);
        console.log(players[i].determineHandValue());
    }
    display();
}

//user draw
function draw(pile)
{
    if(turn != p1 || canDiscard == true || players[turn].knocked) return;
    canDiscard = true; //*flag variable

    console.log("user draws"); //!
    players[p1].drawCards(1, pile);
}
//user discard
function discard(card) //*when appendChild-ing the images, assign to them ids relative to the card name (rank-suit) and give them onclick = discard(this.id.split("-"))
{
    if(turn != p1 || canDiscard == false || players[turn].knocked) return;
    canDiscard = false;

    players[turn].discardCards(card);

    nextTurn();
    game();
    display();
}
//user knock
function knock()
{
    if(turn != p1 || canDiscard == true || knocked) return;

    players[turn].knockTurn();

    nextTurn();
    game();
    display(); //display goes after nextTurn(); for the tally, since its conditional checks for currentTurn's knocker.
}

function display()
{
    //Player display
    for(var i = 0; i < players.length; i++)
    {
        eval("opP" + (i + 1)).innerHTML = ""; //*resets the divs so that the images don't build onto each other (see bug 1)

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
                    discard(this.id.slice(5));
                }
            }
            else if(!players[turn].knocker) //*if not user and if round isn't ended, hide cards
                image.src = "./images/cards/back-red-75-3.png";
            
            eval("opP" + (i + 1)).appendChild(image);
        }
    }

    //Discard display
    if(discardpile[0])
        opDiscard.src = "./images/cards/" + discardpile[0].rank + "-" + discardpile[0].suit + ".png";
    else
        opDiscard.src = "./images/cards/empty.png";
}

