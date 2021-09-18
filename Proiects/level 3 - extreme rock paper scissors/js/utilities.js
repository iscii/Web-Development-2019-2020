function getRandomInteger(lower, upper)
{
    var multiplier = upper - (lower - 1);
    var rnd = parseInt(Math.random() * multiplier) + lower;

    return rnd;
}

