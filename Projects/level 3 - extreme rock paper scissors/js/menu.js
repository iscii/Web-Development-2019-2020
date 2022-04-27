function initialize()
{
    opInputs = document.getElementById("inputform");
    opButton = document.getElementById("submit");

    p1AD = [5, 5, 5];
    p2AD = [5, 5, 5];

    yes = true;
}
function submit()
{
    window.sessionStorage.clear();

    if(opInputs.p1Ari.value > 0)
    {   
        p1AD[0] = opInputs.p1Ari.value;
    }
    if(opInputs.p1Api.value > 0)
    {
        p1AD[1] = opInputs.p1Api.value;
    }
    if(opInputs.p1Asi.value > 0)
    {
        p1AD[2] = opInputs.p1Asi.value;
    }
    if(opInputs.p2Ari.value > 0)
    {   
        p2AD[0] = opInputs.p2Ari.value;
    }
    if(opInputs.p2Api.value > 0)
    {
        p2AD[1] = opInputs.p2Api.value;
    }
    if(opInputs.p2Asi.value > 0)
    {
        p2AD[2] = opInputs.p2Asi.value;
    }

    window.sessionStorage.setItem("p1A1", p1AD[0]);
    window.sessionStorage.setItem("p1A2", p1AD[1]);
    window.sessionStorage.setItem("p1A3", p1AD[2]);
    window.sessionStorage.setItem("p2A1", p2AD[0]);
    window.sessionStorage.setItem("p2A2", p2AD[1]);
    window.sessionStorage.setItem("p2A3", p2AD[2]);

    document.location.href = "game.html";
}
function options()
{
    if(yes)
    {
        opInputs.style.display = "initial";
        opButton.style.display = "initial";
    }
    else
    {
        opInputs.style.display = "none";
        opButton.style.display = "none";
    }
    
    yes = !yes;
}