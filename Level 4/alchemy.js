const organisM_list = ["Air;None;None", "Earth;None;None", "Fire;None;None", "Water;None;None", 
                       "Alcohol;Fire;Water", "Dust;Air;Earth", "Energy;Air;Fire", "Lava;Earth;Fire", 
                       "Swamp;Earth;Water", "Mud;Dust;Water", "Life;Energy;Swamp", "Bacteria;Life;Swamp",
                       "Fire Elemental;Fire;Life", "Stone;Air;Lava", "Metal;Stone;Fire", "Electricity;Energy;Metal",
                       "Oxygen;Water;Electricity"];

//the first 4 organisms do not have parents
const organisM_offset = 4;
//indices for array
const namE = 0, parenT_1 = 1, parenT_2 = 2;
const nonE = "None";
/*
function getOrganismName(organism)
{
    //; is the delimiter (it separates the string data types)
    //sets organism to an array (organism[name, parent1, parent2]) to you can call each through (organism[0], [1], or [2])
    organism = organism.split(";");
    var orgName = organism[namE];
    return orgName;
    
    return organism.split(";")[namE];
}
function getFirstParent(organism)
{
    return organism.split(";")[parenT_1];
}
function getSecondParent(organism)
{
    return organism.split(";")[parenT_2];
}
*/

//ready fire aim lmao
function initialize()
{
    /* "get" means "return" -- the function returns the "element", an HTML element (a div), given the input parameter, the "Id", which the user assigns to the element.
     The returned element includes the entire element itself -- such as: <div> Hello </div> */
    //opVar = getElementbyId("var");

    //console.log(getOrganismData("Oxygen", namE));

    opMyOrganisms = document.getElementById("orgs");
    opFirstSelection = document.getElementById("1st");
    opSecondSelection = document.getElementById("2nd");
    organismForm = document.getElementById("orgsform");

    myOrganisms = [organisM_list[0], organisM_list[1], organisM_list[2], organisM_list[3]];
    firstSelection = nonE;
    secondSelection = nonE;

    display();
}
/*
function getOrganismData(organism, idx)
{
    //loops forever
    return findOrganism(organism).split(";")[idx];
}
*/
function getOrganismData(organism, idx)
{
    return organism.split(";")[idx];
}
function findOrganism(orgname)
{
    for (var i in organisM_list)
    {
        if(getOrganismData(organisM_list[i], namE) == orgname){
            return organisM_list[i];
        }
    }
}
function areParents(organism, parent1, parent2)
{
    var firstParent = getOrganismData(organism, parenT_1);
    var secondParent = getOrganismData(organism, parenT_2);
    var parent1 = getOrganismData(parent1, namE);
    var parent2 = getOrganismData(parent2, namE);

    if(firstParent == parent1 || secondParent == parent1)
    {
        if(firstParent == parent2 || secondParent == parent2)
        {
            return true;
        }
    }

    return false;
}
function findCombo(org1, org2)
{
    for (var i in organisM_list)
    {
        if(areParents(organisM_list[i]), org1, org2)
            return organisM_list[i];
    }
    return nonE;
}
function selectOrganism()
{
    var idx = parseInt(organismForm.orgsel.value) - 1;

    if(idx < 0 || idx >= myOrganisms.length){
        return;
    }

    if(firstSelection == nonE || (firstSelection != nonE && secondSelection != nonE))
    {
        firstSelection = myOrganisms[idx];
        secondSelection = nonE;
    }
    else
    {
        secondSelection = myOrganisms[idx];
        addNewOrganism();
    }

    organismForm.orgsel.value = "";
    display();
}
function addNewOrganism()
{
    var newOrganism = findCombo(firstSelection, secondSelection);

    if(newOrganism != nonE)
    {
        //checks if the organism is not in list yet. .indexOf returns an integer value: -1 if the value is not on the list; else, the number of times it appears on the list.
        if(myOrganisms.indexOf(newOrganism) < 0)
        myOrganisms.push(newOrganisms);
    }
}
function deleteOrganism()
{
    var idx = parseInt(organism.orsel.value) - 1;
    
    if(idx <organisM_offset || idx >= myOrganisms.length)
    {
        return;
    }

    myOrganisms.splice(idx, 1);

    organismForm.orgsel.value = "";
    display();
}
function display()
{
    opMyOrganisms.innerHTML = "1: " + getOrganismData(myOrganisms[0], namE);

    for (var i = 1; i < myOrganisms.length; i++)
    {
        opMyOrganisms.innerHTML += "<br/>" + (i + 1) + ": " + getOrganismData(myOrganisms[i], namE);
        opFirstSelection.innerHTML = getOrganismData(firstSelection, namE);
        opSecondSelection.innerHTML = getOrganismData(secondSelection, namE);
    }
}