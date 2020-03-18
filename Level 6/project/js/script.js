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

    //Determine dealer
    dealer = getRandomInteger(p1, p4);
    turn = dealer + 1;
    if(dealer + 1 > p4) //*if there's a way to loop it without this conditional, pls do tell
        dealer = p1;

    rounds();
    display();
}

function rounds() //todo: get the rounds and turns working.
{

}

function draw()
{
    if(turn != p1) return;
    players[p1].drawCards(1, deck);
}

function nextTurn()
{
    turn += 1;
    if(turn + 1 > p4)
        turn = p1;
}

function display()
{

}

