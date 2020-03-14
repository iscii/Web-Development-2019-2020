function initialize()
{
    deck = new CardDeck();

    deck.generateStandardDeck();
    deck.shuffleDeck();
    for(i = 0; i < deck.length; i++)
    {
        console.log(deck[i]); //add <.property> to access it
    }
    console.log(deck);
}
