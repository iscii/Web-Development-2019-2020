function initialize()
{
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
    //Check if player in turn has strikes
    if(players[turn].strikes < 0) return;
    //if(turn == p1) return console.log("User's turn");
    
    nextTurn();
    console.log(turn);
}

function game()
{
    if(turn == p1) return console.log("user's turn");

    setInterval(cpuMoves, 10000);
}

function draw()
{
    if(turn != p1) return;
    players[p1].drawCards(1, deck);
}

function discard()
{
    //code

    nextTurn();
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

}

