const JACK = 11, QUEEN = 12, KING = 13, ACE = 1;
const CLUB = 0, DIAMOND = 1, HEART = 2, SPADE = 3;
const TOP_DECK = 0;

function Card(r, s ,i){ //class Card with properties rank, suit, inagefilname
    this.rank = r;
    this.suit = s;
    this.imageFileName = i;
}
//would CardDeck be considered a class or object? ANS - CLASS
function CardDeck(){
}

CardDeck.prototype = Array.prototype;

//why don't we just declare CardDeck an array and shuffleDeck a separate function? What are the benefits to making it a prototype/class?
CardDeck.prototype.shuffleDeck = function(){//prototype function (of class CardDeck)
    var tmpDeck = [];
    while(this.length > 0){
        var tmpCard = this.splice(getRandomInteger(0, this.length - 1), 1)[0]; //how would this work if deck has no value?

        tempDeck.push(tmpCard);
    }
    this.push.apply(this, tmp); //pg 25
}
function generateStandardDeck(){
    var deck = new CardDeck();

    for(var r = ACE; r <= KING; r++){
        for(var s = CLUB; s <= SPADE; s++){
            deck.push(new Card(r, s, r + "-" + s + ".png"));
        }
    }
    return deck;
}
    