function getRandomInteger(lower, upper)
{
	//R = parseInt(rnd * (upper - (lower - 1)) + lower
	var multiplier = upper - (lower - 1);
	var rnd = parseInt(Math.random() * multiplier) + lower;
	
	return rnd;
}
