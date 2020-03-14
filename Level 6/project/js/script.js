function initialize()
{
    deck = generateStandardDeck();
    deck.shuffleDeck();
    for(i = 0; i < deck.length; i++)
    {
        console.log(deck[i]);//figure out how to access class properties
    }
}

function Player(id, hand)
{
    id = this.id;
    hand = new CardDeck();
}