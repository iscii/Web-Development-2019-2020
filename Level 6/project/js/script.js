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
        //drawCards(i, 3);   
        Players[i].drawCards(3, deck); //!lastest commit: player prototype function drawCards works. 
        //() =>{Player, player.id = player.i
    }
    console.log(deck);
    console.log(Players);
}

function draw()
{

}
/*
function drawCards(x, quantity){
    var i;
    while(i < quantity)
    {
        Player[x].hand.push(deck.shift());
    }
    console.log(deck);
    console.log(Players);
} */