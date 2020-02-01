/*
    Searches an array for a specific item and returns the number of times that item appears in the array

    Parameters: 
        array - the array
        itm - the search item
    Returns:
        The number of times the itm appears in the array
*/
function countDuplicates(array, itm)
{
    itmCount = 0;

    for (var i = 0; i < array.length; i++)
        if(itm == array[i])
            itmCount++;

    return itmCount;
}
/*
    Searches an array for a specific item and returns the index(es) in which it is found

    Parameters:
        array - the array
        itm - the search item
    Returns: 
        An array including all of the indices at which the item appears (empty if item is not in the list)
*/
function indexesOf(array, itm)
{
    var idxList = [];

    for(var i = 0; i < array.length; i++)
        if(itm == array[i])
            idxList.push(i);
    
    return idxList;
    //use array.unshift() function to add item to front of array, array.push() to add to back. 
}