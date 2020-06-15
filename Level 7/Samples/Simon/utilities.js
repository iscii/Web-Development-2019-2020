function getNumericSuffix(num)
{
	if (num % 100 != 11 && num % 10 == 1)
	{
		return "st";
	}
	
	if (num % 100 != 12 && num % 10 == 2)
	{
		return "nd";
	}
	
	if (num % 100 != 13 && num % 10 == 3)
	{
		return "rd";
	}
	
	return "th";
}

function getRandomInteger(lower, upper)
{
	//R = (rnd * (u - (L - 1)) + L
	multiplier = upper - (lower - 1);
	rnd = parseInt(Math.random() * multiplier) + lower;
	
	return rnd;
}

function generateRandomColor()
{
	redValue = parseInt(Math.random() * 256);
	greenValue = parseInt(Math.random() * 256);
	blueValue = parseInt(Math.random() * 256);
	
	return "rgb(" + redValue + ", " + greenValue + ", " + blueValue + ")";
}
			
