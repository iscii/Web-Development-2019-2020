//Cards
const JACK = 11, QUEEN = 12, KING = 13, ACE = 1;
const CLUB = 0, DIAMOND = 1, HEART = 2, SPADE = 3;

function Cards(r, s, i) //class Cards; every rank above 10 is valued at 10.
{
    this.rank = r;
    this.suit = s;
    this.imagename = i;
    
    this.value = this.rank;
    if(this.rank > 10)
        this.value = 10;
    if(this.rank == 1)
        this.value = 11;
}

function CardDeck(){}
//a prototype is a storage that applies to all of a class: rather than each class having their own function, you can have every class connected to one function stored in the prototype
CardDeck.prototype = Array.prototype;

CardDeck.prototype.shuffleDeck = function()
{
    var tempDeck = [];
    while(this.length > 0)
    {
        //splices a random item of the array and places it into tempCard. Splice removes the item from the spliced array.
        var tempCard = this.splice(getRandomInteger(0, this.length - 1), 1)[0];
        tempDeck.push(tempCard);
    }
    this.push.apply(this, tempDeck);
}

//creates a deck, ordered by rank. If you swap the positions of the for loops, the deck'll be ordered by suit.
CardDeck.prototype.generateStandardDeck = function()
{
    for(var r = ACE; r <= KING; r++)
    {
        for(var s = CLUB; s <= SPADE; s++)
        {
            this.push(new Cards(r, s, r + "-" + s + ".png"));
        }
    }
}

//Players
const p1 = 0, p2 = 1, p3 = 2, p4 = 3;

function Player(id)
{
    this.id = id;
    this.hand = [];
    this.strikes = 3;
    this.knocker = false;
}

//optional parameter newcard; use parameter to determine the hand's value IF the new card were to be drawn (for cpus).
Player.prototype.determineHandValue = function(newcard) //make it so that only the greatest number of suites are added up
{
    var suitTotals = [0, 0, 0, 0]; //[0] = club, [1] = diamonds, [2] = hearts, [3] = spades
    var rankBank = {}; //hash table

    //set the rankBank indexes to 0
    for(var i = 0; i < this.hand.length; i++)
        rankBank[this.hand[i].rank] = 0;

    //if the there is a parameter, add it to the value.
    if(newcard)
    {
        suitTotals[newcard.suit] += newcard.value;
    }

    for(var i = 0; i < this.hand.length; i++)
    {
        console.log(this.hand[i]); //!
        //add value of hand to corresponding suit position in suitTotals
        suitTotals[this.hand[i].suit] += this.hand[i].value;

        //add matching values to rankBank
        rankBank[this.hand[i].rank] ++;
    }
    console.log(suitTotals); //!
    console.log(rankBank); //!

    var value = suitTotals[0]; //create the returned value

    //set value to the largest number in suitTotals
    for(var o = 1; o < suitTotals.length; o++)
        if(suitTotals[o] > value)
            value = suitTotals[o];

    //if there are 3 cards of matching rank, and the value isn't already 30 or 31, set value to 30.
    for(item in rankBank)
        if(rankBank[item] == 3)
            if(30 > value)
                value = 30;

    console.log("Value: [" + value + "]"); //!
    return value;
}

Player.prototype.drawCards = function(quantity, pile)
{
    for(var i = 0; i < quantity; i++)
    {
        this.hand.push(pile.shift());
    }
    console.log(this); //!

    //this.determineHandValue();

    display();
}

Player.prototype.discardCards = function(card)
{
    discardpile.unshift(this.hand.splice(card, 1)[0]); //*[0] because splice returns an array!!!!! (in lesson)
    console.log(discardpile);
    display();
}

Player.prototype.knockTurn = function() //*ONLY ALLOW KNOCK IF CANDISCARD = FALSE.
{
    this.knocker = true;
    //game(); -> //for the player
    //set knocker = turn
}

Player.prototype.determineDiscardCard = function()
{
    
}
