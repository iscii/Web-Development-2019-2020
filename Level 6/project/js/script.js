function initialize()
{
    //Element references
    opP1 = document.getElementById("p1disp");
    opP2 = document.getElementById("p2disp");
    opP3 = document.getElementById("p3disp");
    opP4 = document.getElementById("p4disp");

    //Create deck
    deck = new CardDeck();

    //Create players
    players = [new Player("p1"), new Player("p2"), new Player("p3"), new Player("p4")];

    //Create round vars
    round = 1;

    deck.generateStandardDeck();
    deck.shuffleDeck();
    console.log(deck); //!

    //Deal cards
    for(var i = 0; i < 4; i++)
    {  
        players[i].drawCards(3, deck);
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

function cpuMoves() //todo: get the rounds and turns working.
{
    //!console.log("cpuMoves");
    //Check if player in turn has strikes. If not, pass turn and continue with interval
    if(players[turn].strikes < 0) 
        return nextTurn();
    if(turn == p1)
    {
        console.log("user's turn"); //!
        return clearInterval(cpuInterval);
    }
    
    players[turn].drawCards(1, deck);

    nextTurn();
}

function game()
{
    if(turn == p1) 
        return console.log("user's turn"); //!
    else
        cpuInterval = setInterval(cpuMoves, 2000); //create a variable that holds an interval
}

function draw()
{
    if(turn != p1) return;
    players[p1].drawCards(1, deck);

    display();
    discard();
}

function discard(card) //*when appendChild-ing the images, assign to them ids relative to the card name (rank-suit) and give them onclick = discard(this.id.split("-"))
{
    if(turn != p1) return;
    players[turn].discardCards(card);
    //code

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

function display()
{
    //Player display
    for(var i = 0; i < players.length; i++)
    {
        for(var o = 0; o < players[i].hand.length; o++)
        {
            var image = document.createElement("img");
            image.id = "img" + players[i].hand[o].rank + "-" + players[i].hand[o].suit;
            if(i == 0) //only for the user player
            {
                image.onclick = "discard(this.id.slice(3))"; //calls the discard function and inputs as parameter the image's id without the "img" portion.
                image.src = "./images/cards/" + players[i].hand[o].rank + "-" + players[i].hand[o].suit + ".png";
            }
            else
                image.src = "./images/cards/back-red-75-3.png";
        
            eval("opP" + (i + 1)).appendChild(image);
        }
    }
}

