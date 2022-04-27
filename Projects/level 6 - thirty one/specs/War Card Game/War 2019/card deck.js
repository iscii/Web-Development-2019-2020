const JACK = 11, QUEEN = 12, KING = 13, ACE = 1;
const CLUB = 0, DIAMOND = 1, HEART = 2, SPADE = 3;
const BLUE_BACK = "back-blue-75-3.png";
const RANK_STRINGS = ["", "Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];
const SUIT_STRINGS = ["Clubs", "Diamonds", "Hearts", "Spades"];

/*
	generateStandardDeck
	
	Creates a standard deck of 52 card objects and puts them into an array.
	
	Each card object will consist of a rank, suit, an image file, and a string to represent the card.
	
	Returns
		The array of cards.
*/
function generateStandardDeck()
{
	var deck = [];
	
	/*
		The double for loop goes through each suit for each rank, creating the card objects one at a time and pushing them into the array.
	*/
	for (var r = ACE; r <= KING; r++)
		for (var s = CLUB; s <= SPADE; s++)
		{
			var card = {};
			card.rank = r;
			card.suit = s;
			card.imgFile = r + "-" + s + ".png";
			card.cardString = RANK_STRINGS[r] + " of " + SUIT_STRINGS[s];
			deck.push(card);
		}
		
	return deck;
}

/*
	shuffleDeck
	
	Takes a deck of cards and mixes them up.
	
	Returns
		The shuffled array.
*/
function shuffleDeck(deck)
{
	/*
		Creates a temporary array and pulls cards in a random order from the original array.
	*/
	var tmp = [];
	while (deck.length > 0)
		tmp.push(deck.splice(getRandomInteger(0, deck.length - 1), 1)[0]);
	
	return tmp;
}

/*
	dealCard
	
	Returns the first card of a specified deck.
	
	Paramters
		deck - the array of cards
		
	Returns
		The specific card take off of the deck.
*/
function dealCard(deck)
{
	return deck.splice(0, 1)[0];
}