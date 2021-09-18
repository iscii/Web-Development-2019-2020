/*
	getNumericSuffix
	
	Pairs a proper English suffix with a number.
	
	parameters:
			num - integer - the number for which the suffix is being generated.
			
	returns:
			String
			The suffix that goes with the number.
			
	Base Case - "th" - almost every number is given the "th" suffix.
	Special Case - "st" - almost any number ending in 1 is given the "st" suffix.
	Special Case - "nd" - almost any number ending in 2 is given the "nd" suffix.
	Special Case - "rd" - almost any number ending in 3 is given the "rd" suffix.
	Special Case - 11, 12, 13 - These 3 numbers are all given the "th" suffix despite ending in 1, 2, and 3 respectively.
*/
function getNumericSuffix(num)
{
	//The condition checks first to make sure the number doesn't end in 11 before checking to see if the number ends in 1.
	/*
		Modulus (%) is a mathematical operation that returns the remainder of an integer divide.
	*/
	if (num % 100 != 11 && num % 10 == 1)
	{
		return "st";
	}
	else
	{
		if (num % 100 != 12 && num % 10 == 2)
		{
			return "nd";
		}
		else
		{
			if (num % 100 != 13 && num % 10 == 3)
			{
				return "rd";
			}
			else
			{
				/*
					As the base case, placing the "th" into the default else makes the most sense.  Attempting to discover conditions that trigger it (as opposed to the conditions that trigger the special cases) would be tedious.
				*/
				return "th";
			}
		}
	}		
}

/*
	getRandomInteger
	
	generates a random number between the lower bound (inclusive) and the upper bound (inclusive).
	
	In order to work through the algorithm, you need to consider the different conditions that might exist.
	
	Generating a number from 0 to x is parseInt(Math.random() * (x + 1))
	What about generating a number from 1 to x?
	What about generating a number from x to y?
	What about generating a number from -x to y?

	parameters:
		lower - the lower bound of the range of random numbers.
		upper - the upper bound of the range or random numbers.
		
	returns:
		a random number between lower and upper, inclusive.
		a random number between lower and upper, inclusive.
*/
function getRandomInteger(lower, upper)
{
	//R = parseInt(rnd * (upper - (lower - 1)) + lower
	var multiplier = upper - (lower - 1);
	var rnd = parseInt(Math.random() * multiplier) + lower;
	
	return rnd;
}
