//Cards
const JACK = 11, QUEEN = 12, KING = 13, ACE = 1;
const CLUB = 0, DIAMOND = 1, HEART = 2, SPADE = 3;

function Cards(r, s, i) //class Cards; every rank above 10 is valued at 10.
{
    this.rank = r;
    this.suit = s;
    this.imagename = i;
    
    this.value = this.rank;
    if(this.rank > 10) //all face cards are worth 10
        this.value = 10;
    if(this.rank == 1) //aces are worth 11
        this.value = 11;
    
    //*value of hand may never exceed 31 due to the way the game works - value is grouped by suit, so the value of any two aces will never add up.
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
Player.prototype.determineHandValue = function(newcard, cpudiscard) //make it so that only the greatest number of suites are added up
{
    var suitTotals = [0, 0, 0, 0]; //[0] = club, [1] = diamonds, [2] = hearts, [3] = spades
    var rankBank = {}; //hash table

    //set the rankBank indexes to 0
    for(var i = 0; i < this.hand.length; i++)
        rankBank[this.hand[i].rank] = 0;

    //if the there is a parameter, add it to the value.
    if(newcard)
    {
        suitTotals[newcard.suit] += newcard.value; //*input null for newcard to access cpudiscard without using newcard
    }

    //for checking if hands has 3 matching card ranks
    for(var i = 0; i < this.hand.length; i++)
    {
        //add value of hand to corresponding suit position in suitTotals
        suitTotals[this.hand[i].suit] += this.hand[i].value;

        //add matching values to rankBank
        rankBank[this.hand[i].rank]++;
    }

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

    //determine the card for discarding
    if(cpudiscard)
    {
        //checks for matching card pairs
        var paircount = 0;
        var unmatch = [];

        for(item in rankBank) //sets paircount to 2 if there are two pairs.
            if(rankBank[item] == 2)
                paircount++;
        if(paircount == 2) //highly unlikely but addresses having two pairs of matching rank cards.
        {
            console.log("[Note] double pair");
            return this.hand[getRandomInteger(0, 4)];
        }

        for(item in rankBank) //checks for the bank's item (card pair's value)
        {
            if(rankBank[item] >= 2)
            {
                //*let initializes a variable local to the LOOP and not the function. var initializes it local to the function.
                for(let i = 0; i < this.hand.length; i++) //pushes the non-matching card positions into unmatch
                    if(this.hand[i].rank != item)
                        unmatch.push(i);
                
                if(this.hand[unmatch[1]]) //if rankBank[item] > 2, check for smaller value
                    if(this.hand[unmatch[1]] < this.hand[unmatch[0]])
                        return unmatch[1];

                console.log("[Note] unmatch position: " + unmatch[0]);
                return unmatch[0];
            }
        }

        //standard procedure (no matching card value pairs)

        //determine discard card
        for(item in suitTotals)
        {
            if(suitTotals[item] != 0)
            {
                var lowestsuit = item;       
                break;
            }
        }

        console.log(" --------------------------- "); //!

        //find the lowest value suitTotal
        for(var i = 1; i < suitTotals.length; i++)
            if(suitTotals[i] < suitTotals[lowestsuit] && suitTotals[i] != 0) //skips the 0s
                lowestsuit = i;

        console.log("Suit " + lowestsuit); //!        
        var lowestranks = [];

        //find the lowest value cards in that suit group
        for(i = 0; i < this.hand.length; i++)
            if(this.hand[i].suit == lowestsuit)
                lowestranks.push(this.hand[i].rank);
        
        console.log("Ranks " + lowestranks); //!
        var lowestvalue = lowestranks[0];

        //find the lowest value card.
        if(lowestranks[1])
            for(i = 1; i < lowestranks.length; i++)
                if(lowestranks[i] < lowestvalue)
                    lowestvalue = lowestranks[i];

        console.log("Value " + lowestvalue); //!   
                 
        //find the card's position in the hand
        for(i = 0; i < this.hand.length; i++)
            if(this.hand[i].suit == lowestsuit && this.hand[i].rank == lowestvalue)
                value = i;

        console.log("Position " + value); //!
        console.log(" ---------------------------- "); //!

        return value; //just reusing value variable since it's returned anyway
    }

    //console.log(value); //!
    return value;
}

Player.prototype.drawCards = function(quantity, pile) //*it's hard to console.log these since logged objects' properties are updated upon the object's update. 
{
    if(pile == deckpile) var name = "deckpile"; else var name = "discardpile"; //!
    console.log("[Note] " + this.id + " draws -----------------------------"); //!
    console.log(pile[0]); //!
    console.log(this); //!
    console.log(name); //!
    for(var i = 0; i < quantity; i++)
    {
        this.hand.push(pile.shift());
    }

    display();
}

Player.prototype.discardCards = function(card)
{
    console.log("[Note] " + this.id + " discards -----------------------------"); //!
    console.log(this.hand[card]); //!
    discardpile.unshift(this.hand.splice(card, 1)[0]); //*[0] because splice returns an array!!!!! (in lesson)
    console.log(discardpile); //!
    this.determineHandValue(); //!

    display();
}

Player.prototype.knockTurn = function()
{
    console.log(this.id + " knocks"); //!
    this.knocker = true;
    knocked = true;
}