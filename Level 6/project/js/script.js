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
    //tempturn = []; //creates a turn storage for cpu discards - > DITCHED since discard has to occur within the ssame turn as draw

    deckpile.generateStandardDeck();
    deckpile.shuffleDeck();
    console.log(deckpile); //!
    
    //Initialize discard pile. Placed before card deals since display requires discardpile to be initialized.
    discardpile.push(deckpile.shift());

    //Deal cards
    for(var i = 0; i < 4; i++)
    {  
        players[i].drawCards(3, deckpile);
    }
    console.log(players); //!

    //Determine dealer & turn
    dealer = getRandomInteger(p1, p4);
    turn = dealer + 1;
    if(dealer + 1 > p4) //*if there's a way to loop it without this conditional, pls do tell
        turn = p1;
    console.log("First turn: " + turn);

    game();
    display();
}

function cpuMoves()
{
    //Check if player in turn has strikes. If not, pass turn and continue with interval
    if(players[turn].strikes < 0) 
        return nextTurn();
    if(turn == p1)
    {
        console.log("user's turn"); //!
        return clearInterval(cpuInterval);
    }
    
    //CPU draw
    console.log("draw");
    console.log(turn);
    players[turn].drawCards(1, deckpile);
    //tempturn.push[turn];  

    //CPU discard
    //players[turn].discardCards(players[turn].determineDiscardCard());
    setTimeout(function(){
        console.log("discard");
        //console.log(tempturn);
        players[turn].discardCards(0); //todo: YOU ARE HERE 3/21: work on the cpu discard specifics.
        nextTurn();
    }, 500);
}

function game()
{
    if(turn == p1) 
        return console.log("user's turn"); //!
    else
        cpuInterval = setInterval(cpuMoves, 1500); //create a variable that holds an interval
}

//User draw
function draw()
{
    if(turn != p1 || canDiscard == true) return;
    canDiscard = true; //*flag variable

    players[p1].drawCards(1, deckpile);
}

//User discard
function discard(card) //*when appendChild-ing the images, assign to them ids relative to the card name (rank-suit) and give them onclick = discard(this.id.split("-"))
{
    if(turn != p1 || canDiscard == false) return;
    canDiscard = false;

    players[turn].discardCards(card);

    nextTurn();
    display();
    game();
}

function nextTurn()
{
    turn += 1;
    if(turn > p4)
        turn = p1;
}

function display() //todo: YOU ARE HERE 3/18/2020. You've just finished the display function. fix the display formatting and get working on the discard function.
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

            if(i == 0) //only for the user player
            {
                image.onclick = function() //*calls the discard function and inputs as parameter the image's id without the "img" portion.
                {
                    discard(this.id.slice(5));
                }
                image.src = "./images/cards/" + players[i].hand[o].rank + "-" + players[i].hand[o].suit + ".png";
            }
            else
                image.src = "./images/cards/back-red-75-3.png";
        
            eval("opP" + (i + 1)).appendChild(image);
        }
    }

    //Discard display
    opDiscard.src = "./images/cards/" + discardpile[0].rank + "-" + discardpile[0].suit + ".png";
}

