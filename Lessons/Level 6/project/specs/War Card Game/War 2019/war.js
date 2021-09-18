/*
	awardCards
	
	Gives all of the played cards from the round to a single player, based on the result.
	
	Parameters
		result - who won the round.
		pCards - the array of cards played by the left player.
		cCards - the array of cards played by the right player.
*/
function awardCards(result, pCards, cCards)
{
	if (result == PLAYER)
		playerDeck = playerDeck.concat(cCards).concat(pCards);
	else
		computerDeck = computerDeck.concat(pCards).concat(cCards);
}

/*
	checkCards
	
	Returns the result of the round based on the comparison of the two cards.
	
	Parameters
		pCard - the card played by the left player.
		cCard - the card played by the right player.
		
	Returns
		The result of the round.
*/
function checkCards(pCard, cCard)
{
	if (pCard.rank == cCard.rank)
		return WAR;
	
	/*
		The aces are special cases.  Since they are the lowest rank, they need to be checked individually.  All of the other cards can be compared by rank.
	*/
	if (pCard.rank == ACE)
		return PLAYER;
		
	if (cCard.rank == ACE)
		return COMPUTER;
		
	if (pCard.rank > cCard.rank)
		return PLAYER;
		
	return COMPUTER;
}

/*
	checkWinner
	
	Checks to see if there's a winner of the game based on the possibility of one player's deck being empty.
	
	Returns
		The winner or -1 if there is no winner yet.
*/
function checkWinner()
{
	if (playerDeck.length == 0)
		return COMPUTER;
		
	if (computerDeck.length == 0)
		return PLAYER;
		
	return -1;
}

/*
	displayCard
	
	Creates an image element for a single card and adds it to a specified element.
	
	Parameters
		cardImg - the filename of the card image.
		el - the HTML element to which the image will be added.
		addBorder - handles the special circumstance under which a border will be placed around the image.
*/
function displayCard(cardImg, el, addBorder)
{
	var newImg = document.createElement("img");
	newImg.src = "cardimages/" + cardImg;
	
	if (addBorder)
		newImg.style.border = "medium solid white";

	el.appendChild(newImg);
}

/*
	displayCards
	
	Displays an array of cards to a specified element.  This function is specific to the war card game.
	
	Parameters
		cards - the array of cards.
		el - The HTML element to which the image will be added.
*/
function displayCards(cards, el)
{
	//If the array is empty or non-existent, do nothing.
	if (cards == null || cards.length == 0)
		return;

	//Display each card individually using the displayCard function.
	displayCard(cards[0].imgFile, el, true);
	for (var i = 1; i < cards.length; i++)
	{
		var addBorder = false;
		if (i % 4 == 0 || i == cards.length - 1)
			addBorder = true;
			
		displayCard(cards[i].imgFile, el, addBorder);
	}
}
