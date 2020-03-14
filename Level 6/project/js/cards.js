const JACK = 11, QUEEN = 12, KING = 13, ACE = 1;
const CLUB = 0, DIAMOND = 1, HEART = 2, SPADE = 3;

function Cards(r, s, i)
{
    this.rank = r;
    this.suit = s;
    this.imagename = i;
    
    this.value = this.rank;
    if(this.rank > 10)
        this.value = 10;
}

function CardDeck(){}
CardDeck.prototype = Array.prototype;

CardDeck.prototype.shuffleDeck = function()
{
    var tempDeck = [];
    while(this.length > 0)
    {
        var tempCard = this.splice(getRandomInteger(0, this.length - 1), 1)[0];
        tempDeck.push(tempCard);
    }
    this.push.apply(this, tempDeck);
}

CardDeck.prototype.generateStandardDeck = function()
{
    var deck = new CardDeck();

    for(var s = CLUB; s < SPADE; s++)
    {
        for(var r = ACE; r < KING; r++)
        {
            deck.push(new Cards(r, s, r + "-" + s + ".png"));
        }
    }

    return deck;
}

function generateStandardDeck()
{
    var deck = new CardDeck();

    for(var s = CLUB; s < SPADE; s++)
    {
        for(var r = ACE; r < KING; r++)
        {
            deck.push(new Cards(r, s, r + " - " + s + ".png"));
        }
    }

    return deck;
}
