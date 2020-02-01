//------------------------------------------------- MISCELLANEOUS ----------------------------------------------------------------
/*  getRandomInteger

    Returns a random integer between the lower and upper bounds

    Parameters:
        lower - the lower bound
        upper - the upper bound
    Returns:
        A random integer between the lower and upper bounds
*/
function getRandomInteger(lower, upper)
{
    var multiplier = upper - (lower - 1);
    var rnd = Math.floor(Math.random() * multiplier) + lower; //parseInt is buggy

    return rnd;
}

//---------------------------------------------------- ARRAYS --------------------------------------------------------------------
/*  countOccurences

    Searches an array for a specific item and returns the number of times that item appears in the array

    Parameters: 
        array - the array
        itm - the search item
    Returns:
        The number of times the itm appears in the array
*/
function countOccurencesInArray(array, itm)
{
    itmCount = 0;

    for (var i = 0; i < array.length; i++)
        if(itm == array[i])
            itmCount++;

    return itmCount;
}
/*  indexesOf

    Searches an array for a specific item and returns the index(es) in which it is found

    Parameters:
        array - the array
        itm - the search item
    Returns: 
        An array including all of the indices at which the item appears (empty if item is not in the list)
*/
function indexesOfArray(array, itm)
{
    var idxList = [];

    for(var i = 0; i < array.length; i++)
        if(itm == array[i])
            idxList.push(i);
    
    return idxList;
}
/*  getRandomOf

    Returns a random item of an array

    Parameters:
        array - the array
*/
function getRandomOfArray(array)
{
    return array[getRandomInteger(0, (array.length - 1))];
}
/*  shuffleArray (Fisher-Yates algorithm)

    Returns a shuffled version of an array

    Parameters:
        array - the array   
*/
function shuffleArray(array)
{
    var j, x, i;
    for (i = array.length - 1; i > 0; i--) 
    {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array;
}