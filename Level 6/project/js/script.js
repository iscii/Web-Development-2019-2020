function initialize()
{
    //Create deck
    deck = new CardDeck();

    deck.generateStandardDeck();
    deck.shuffleDeck();
    for(i = 0; i < deck.length; i++)
    {
        console.log(deck[i]); //*add <.property> to access it
    }
    console.log(deck);

    //Create players
    Players = [new Player("p1"), new Player("p2"), new Player("p3"), new Player("p4")];

    //Deal cards
    for(var i = 0; i < 4; i++)
    {  
        Players[i].drawCards(3, deck); //!lastest commit: player prototype function drawCards works. 
    }
    console.log(deck);
    console.log(Players);
}
/*
function draw()
{

}*/