
function assignIDs()
{
    //card IDs
    op1 = document.getElementById("img1.1");
    op2 = document.getElementById("img1.2");
    op3 = document.getElementById("img1.3");
    op4 = document.getElementById("img1.4");
    op5 = document.getElementById("img2.1");
    op6 = document.getElementById("img2.2");
    op7 = document.getElementById("img2.3");
    op8 = document.getElementById("img2.4");
    op9 = document.getElementById("img3.1");
    op10 = document.getElementById("img3.2");
    op11 = document.getElementById("img3.3");
    op12 = document.getElementById("img3.4");
    op13 = document.getElementById("img4.1");
    op14 = document.getElementById("img4.2");
    op15 = document.getElementById("img4.3");
    op16 = document.getElementById("img4.4");

    opScore = document.getElementById("scoreText");
    opComment = document.getElementById("cpuComment");
}

function cpuComments()
{
    //computer comments. 
    cBad1 = "You could do better... right?";
    cBad2 = "The thought of being created by your kind baffles me.";
    cBad3 = "A pity. Is your RAM from china?";
    cMed1 = "Mediocre."
    cMed2 = "I'd expected more but, it'll pass.";
    cMed3 = "Average.";
    cGood1 = "Incredible. As expected from the companions of my creator!";
    cGood2 = "Good score. I'm impressed.";
    cGood3 = "Nicely done! Now try for 16.";
    cPerfect1 = "Astounding.";
    cPerfect2 = "Pure luck? Or cheats?";
    cPerfect3 = "There's no way...";
}

function start()
{
    //assign IDs to make it slightly more organized
    assignIDs();
    cpuComments();

    //image references
    c1 = "images/tanjiro.png";
    c2 = "images/nezuko.png";
    c3 = "images/zenitsu.png";
    c4 = "images/inosuke.png";
    c5 = "images/tomioka.png";
    c6 = "images/rengoku.png";
    c7 = "images/shinobu.png";
    c8 = "images/kanroji.png";

    //variables
    cardVar = "0";
    clickedImg = "0";
    clickedImgA = "0";
    clickedImgB = "0";
    flippedImgF = "0";
    flippedImgB = "images/logo.png";
    imgNum = 0;
    flipNum = 0;
    matchedNum = 0;
    score = 0;

    //arrays
    assigned = [];
    cardPair = [];
    flipPair = [];
    imgIdPair = [];
    matched = [];
    imgVars = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];

    pair1 = [];
    pair2 = [];
    pair3 = [];
    pair4 = [];
    pair5 = [];
    pair6 = [];
    pair7 = [];
    pair8 = [];
    pairs = ['pair1', 'pair2', 'pair3', 'pair4', 'pair5', 'pair6', 'pair7', 'pair8'];

    //initial functions
    shuffle();
    displayScore();
}

//----------------------------------------------------------------------------- CARD SHUFFLER -----------------------------------------------------------------------------

function shuffle()
{
    srcVars = ['op1', 'op2', 'op3', 'op4', 'op5', 'op6', 'op7', 'op8', 'op9', 'op10', 'op11', 'op12', 'op13', 'op14', 'op15', 'op16'];
    var tempVar = srcVars[Math.floor(Math.random() * 16)]

    assignCardVars(tempVar);
}

function assignCardVars(string)
{
    //if the array already includes the temp variable and the length is still less than 16, reassign card variable and redo. Loops until all card variables and pairs are assigned.
    if (assigned.includes(string))
    {
        if (assigned.length <= 15)
        {
            shuffle();
        }
    }
    else
    {
        cardPair.push(string);

        if (cardPair.length == 2)
        {
            assignToImg();
        }

        assigned.push(string);
        shuffle();
    }
}

//when assigning an array variable to the img tags, make sure it assigns to two imgs and then moving on to the next two. perhaps you can use a for each or a simple variable to lock it.
function assignToImg()
{
    if (imgNum < 8)
    {
        eval(pairs[imgNum]).push(cardPair[0], cardPair[1], imgVars[imgNum]);
        flipToBack();

        console.log("[" + pairs[imgNum] + "]" + " " + eval(pairs[imgNum]));

        imgNum++;
    }

    cardPair = [];
}

function flipToBack()
{
    clickedImgA = cardPair[0];
    clickedImgB = cardPair[1];

    displayBack();
}

function resetCards()
{
    for (pairNum in pairs)
    {
        //modified the length: cannot use eval(pairs[pairNum]) = []; since you can't assign an evaluated variable.
        eval(pairs[pairNum]).length = 0;
    }

    assigned = [];
    imgNum = 0;
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function flip(imgid)
{
    if (!(imgIdPair.includes(imgid)) && !(matched.includes(imgid)))
    {
        var img = eval(findImgPairNum(imgid)[2]);

        if (imgIdPair.length < 2)
        {
            imgIdPair.push(imgid);
            score++;
        }

        checkFlip(imgid, img);

        displayFront();
        displayScore();
    }
}

function findImgPairNum(img)
{
    var temp;

    //looks for which pair contains the img id and returns that pair# for match checking.
    for (itemA in pairs)
    {
        //**console.log("checking itemA " + itemA);
        for (itemB in eval(pairs[itemA]))
        {
            //**console.log("checking itemB " + eval(pairs[itemA])[itemB]);

            if (img == eval(pairs[itemA])[itemB])
            {
                flipPair.push(pairs[itemA]);

                //**console.log("image in [" + pairs[itemA] + "]");
                return eval(pairs[itemA]);
            }
        }
    }
}

function checkFlip(imgid, img)
{
    flipNum++;

    if (flipNum <= 2)
    {
        clickedImg = imgid;
        flippedImgF = img;
        console.log("image id: " + clickedImg);
    }

    if (flipNum == 2)
    {
        checkForMatch(imgid);
        return;
    }
}

function checkForMatch(imgid)
{
    if (flipPair[0] == flipPair[1])
    {
        console.log("match");
        //prevents clicking already matched cards and having them be flipped back if the two overrides don't match and stuff.
        matched.push(imgIdPair[0], imgIdPair[1]);
        //**console.log("matched cards: " + matched.toString());
        if(matchedNum < 8)
            matchedNum++;

        checkForComment();
    }
    else
    {
        noMatch(imgid);
    }

    setTimeout("resetTrackVars();", 1000);
}

function noMatch(imgid)
{
    console.log("no match");
    clickedImgA = imgIdPair[0];
    clickedImgB = imgIdPair[1];

    setTimeout("displayBack();", 1000);
}

function checkForComment()
{
    if (matchedNum <= 8)
    {
        //this console.log tells the sad story of how I FORGOT TO PUT TWO FRICKIN EQUAL SIGNS TO CHECK MATCHNUM RRRRRRRG
        console.log("matchedNum = " + matchedNum);
        var dice = Math.floor(Math.random() * 3) + 1;

        if (score > 80)
        {
            if (dice == 1)
                displayComment(cBad1);
            if (dice == 2)
                displayComment(cBad2);
            if (dice == 3)
                displayComment(cBad3);
        }
        if (score > 32 && score <= 80)
        {
            if (dice == 1)
                displayComment(cMed1);
            if (dice == 2)
                displayComment(cMed2);
            if (dice == 3)
                displayComment(cMed3);
        }
        if (score > 16 && score <= 32)
        {
            if (dice == 1)
                displayComment(cGood1);
            if (dice == 2)
                displayComment(cGood2);
            if (dice == 3)
                displayComment(cGood3);
        }
        if (score == 16)
        {
            if (dice == 1)
                displayComment(cPerfect1);
            if (dice == 2)
                displayComment(cPerfect2);
            if (dice == 3)
                displayComment(cPerfect3);
        }

        //This actually shouldn't be possible. Just an easter egg if it somehow happens idk 
        if (score < 16)
            opComment = "This shouldn't be possible nani";
    }
}

//resets tracker variables. needed in function for setTimeout.
function resetTrackVars()
{
    flipNum = 0;
    flipPair = [];
    imgIdPair = [];
}

function reset()
{
    resetCards();
    shuffle();

    matched = [];
    imgIdPair = [];
    flipNum = 0;
    matchedNum = 0;
    score = 0;

    opComment.innerHTML = "";
    displayScore();
}

function displayBack()
{
    eval(clickedImgA).src = flippedImgB;
    eval(clickedImgB).src = flippedImgB;
}

function displayFront()
{
    eval(clickedImg).src = flippedImgF;
}

function displayScore()
{
    opScore.innerHTML = "<b> Score: " + "[ " + score + " ] </b>";
}

function displayComment(text)
{
    //>>>>>>>>>>>>>>>>>>>>>>>YOU ARE HERE 10/12/19.
    //ASK TURNER FOR SOME HELP DEBUGGIN THIS:
    //WHEN TWO CARDS ARE NOT YET MATCHED BEFORE THE SCORE = 16, THEN THE TEXT IS DISPLAYED. HOWEVER, IF TWO ARE MATCHED BY THEN, THE CONSOLE.LOG DISPLAYS TEXT CORRECTLY BUT
    //SETTING opComment.innerHTML TO TEXT WILL RETURN UNDEFINED FOR WHATEVER REASON. PLEASE DEBUG. 
    //^^THIS ONLY HAPPENS WHEN THE IF FUNCTIONS ARE CALLED WHEN MATCHNUM <= 8. IF I MAKE IT CALLED IF MATCHNUM == 8, IT WORKS FINE FOR WHATEVER REASON. MYSTERIOUS.
    //console.log("text = " + text);
    opComment.innerHTML = "<i> Totally an A.I. </i> says: <br/>" + text;
    //console.log("innerHTML = " + opComment.innerHTML);
    //opComment.innerHTML = "hello";
    //console.log("hello = " + opComment.innerHMTL);
}
