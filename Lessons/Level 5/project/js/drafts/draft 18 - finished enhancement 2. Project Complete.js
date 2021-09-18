
//currency
const B20 = 0, B10 = 1, B5 = 2, B1 = 3, Q = 4, D = 5, N = 6, P = 7;
const VALUES = [20, 10, 5, 1, 0.25, 0.10, 0.05, 0.01];
const TAX = 1.08875;
//menu
const ENTREES = ["Hamburger;1.99", "Chicken_Sandwich;1.99", "Veggie_Sandwich;2.29"];
const SIDES = ["French_Fries;0.99", "Salad;1.39", "Cheese_Sticks;1.49", "Rice;1.19"];
const DESSERTS = ["Ice_Cream;1.89", "Pie;1.69", "Cookie;0.89"];
const DRINKS = ["Soda;1.19", "Bottled_Water;1.25", "Juice;1.69"];
const FOODTYPES = ["ENTREES", "SIDES", "DESSERTS", "DRINKS"];

//const AVGTYPES = ["opHamburger", "opCSw", "opVSw", "opFF", "opSalad", "opCSticks", "opRice", "opIceCream", "opPie", "opCookie", "opSoda", "opWater", "opJuice"];
function initialize(){
    iVars();
    iRefs();
}
function iRefs(){
    //opSims = document.getElementById("sim");
    opLog = document.getElementById("logframe");
    clStyleReceipts = document.getElementsByClassName("receipts");
    clStyleSims = document.getElementsByClassName("cSims");

    opData = document.getElementById("data");
    opItemAvgs = document.getElementById("itemavgs");
    opSaleAvgs = document.getElementById("saleavgs");
    opRegBalAvgs = document.getElementById("regbalavgs");
    opNumSims = document.getElementById("numsims");

    opHamburgerCost = document.getElementById("avghamburgercost");
    opChicken_SandwichCost = document.getElementById("avgchickensandwichcost");
    opVeggie_SandwichCost = document.getElementById("avgveggiesandwichcost");
    opFrench_FriesCost = document.getElementById("avgfrenchfriescost");
    opSaladCost = document.getElementById("avgsaladcost");
    opCheese_SticksCost = document.getElementById("avgcheesestickscost");
    opRiceCost = document.getElementById("avgricecost");
    opIce_CreamCost = document.getElementById("avgicecreamcost");
    opPieCost = document.getElementById("avgpiecost");
    opCookieCost = document.getElementById("avgcookiecost");
    opSodaCost = document.getElementById("avgsodacost");
    opBottled_WaterCost = document.getElementById("avgbottledwatercost");
    opJuiceCost = document.getElementById("avgjuicecost");

    opHamburgerCount = document.getElementById("avghamburgercount");
    opChicken_SandwichCount = document.getElementById("avgchickensandwichcount");
    opVeggie_SandwichCount = document.getElementById("avgveggiesandwichcount");
    opFrench_FriesCount = document.getElementById("avgfrenchfriescount");
    opSaladCount = document.getElementById("avgsaladcount");
    opCheese_SticksCount = document.getElementById("avgcheesestickscount");
    opRiceCount = document.getElementById("avgricecount");
    opIce_CreamCount = document.getElementById("avgicecreamcount");
    opPieCount = document.getElementById("avgpiecount");
    opCookieCount = document.getElementById("avgcookiecount");
    opSodaCount = document.getElementById("avgsodacount");
    opBottled_WaterCount = document.getElementById("avgbottledwatercount");
    opJuiceCount = document.getElementById("avgjuicecount");

    opAvgTotalSaleV = document.getElementById("avgtotalsalevalue");
    opAvgElecSaleV = document.getElementById("avgelecsalevalue");
    opAvgCashSaleV = document.getElementById("avgcashsalevalue");
    opAvgTotalSaleC = document.getElementById("avgtotalsalecount");
    opAvgElecSaleC = document.getElementById("avgelecsalecount");
    opAvgCashSaleC = document.getElementById("avgcashsalecount");

    opRegBalValue = document.getElementById("regbalval");
}
function iVars(){ //updating between simulations
    //sequencing
    canSimulate = true;
    simNum = 0;

    logData = []; //holds the totals of every simulation overall
    avgRegisterBal = 0;
    avgTotalSales = 0;
    avgTotalSalesTotal = 0;
    avgCashSales = 0;
    avgCashSalesTotal = 0;
    avgElecSales = 0;
    avgElecSalesTotal = 0;
    avgEntreeTotals = ["0;0", "0;0", "0;0"]; //count;revenue;times averaged -- enhancement 2
    avgSideTotals = ["0;0", "0;0", "0;0", "0;0"];
    avgDessertTotals = ["0;0", "0;0", "0;0"];
    avgDrinkTotals = ["0;0", "0;0", "0;0"];
    avgTotalTypes = ["avgEntreeTotals", "avgSideTotals", "avgDessertTotals", "avgDrinkTotals"];

    //css
    clReceiptWidth = 0; //class "receipts"
    clOrdersWidth = 0; //class "orders"
}
function semiVars(){ //changing/reset between simulations
    //semi-dynamic
    register = [0, 2, 4, 42, 40, 50, 40, 100];
    registerTotal = 0;
    numOrder = 0;
    orderTime = 0;
    time = 180;
    exactChange = false;
    numCashSales = 0;
    numElecSales = 0;
    totalCashSales = 0;
    totalElecSales = 0;

    simEntreeTotals = ["0;0", "0;0", "0;0"]; //count;revenue
    simSideTotals = ["0;0", "0;0", "0;0", "0;0"];
    simDessertTotals = ["0;0", "0;0", "0;0"];
    simDrinkTotals = ["0;0", "0;0", "0;0"];
    simTotalTypes = ["simEntreeTotals", "simSideTotals", "simDessertTotals", "simDrinkTotals"];
}
function dynamicVars(){ //changing/reset within each iteration of simulation
    //dynamic
    change = 0;
    order = [];
    orderSubTotal = 0;
    orderTotal = 0;
    orderTax = 0;
    cash = [];
    cashGiven = 0;
    paymentMethod = "Cash";
}
function simulate(){
    if(canSimulate){
        canSimulate = false;
        simNum++;
        console.log("SIM " + simNum);
        semiVars();
        dynamicVars();
        dispOrder();
        for(time; time > 0; time -= (orderTime + breakTime)){
            numOrder++;
            console.log("--------------------------------------------- ORDER [" + numOrder + "] ---------------------------------------------");
            //determines the order's length in time
            orderTime = getRandomInteger(1, 5);
            breakTime = getRandomInteger(0, 2);
            if((time - (orderTime + breakTime) <= 0)){
                breakTime = 0;
                orderTime = time;
            }
            console.log("[Note] Length: " + orderTime);
            console.log("[Note] Break: " + breakTime);
            console.log("[Note] Total Length: " + (orderTime + breakTime));
            dOrder();
            dCost();
            dPaymentMethod();
            //logData.push(orderTotal, numCashSales, numElecSales); //orderTotals: 0 + 3n; numCashSales; 1 + 3n; numElecSales; 2 + 3n 
            dispReceipt();
            //manageData();
            
            //everything that happens above this point is logged
            dynamicVars();
        }
        display();
        console.log("[Note] Remaining time: " + time);
        
        setTimeout(cooldown, 1000);
    }
}
function cooldown(){
    canSimulate = true;
}
function dOrder(){
    var foodNum = 0;
    var placeHolder;
    var drinkNum = getRandomInteger(0, 2);
    for (i = 0; i < (FOODTYPES.length - 1); i++){
        if(i == 1) 
            quantity = getRandomInteger(0, 2);
        else
            quantity = getRandomInteger(0, 1);
        for (x = 0; x < quantity; x++){
            foodNum = getRandomInteger(0, (eval(FOODTYPES[i]).length - 1));
            order.push(eval(FOODTYPES[i])[foodNum]);
            placeHolder = eval(simTotalTypes[i])[foodNum].split(";");
            placeHolder[0]++;
            placeHolder[1] = (parseFloat(placeHolder[1]) + parseFloat(eval(FOODTYPES[i])[foodNum].split(";")[1])).toFixed(2);
            eval(simTotalTypes[i])[foodNum] = placeHolder.join(";");
        }
    }
    order[order.length] = eval(FOODTYPES[3])[drinkNum]; //sets the first (drink)
    placeHolder = eval(simTotalTypes[3])[drinkNum].split(";");
    placeHolder[0]++;
    placeHolder[1] = (parseFloat(placeHolder[1]) + parseFloat(eval(FOODTYPES[3])[drinkNum].split(";")[1])).toFixed(2);
    eval(simTotalTypes[3])[drinkNum] = placeHolder.join(";");
    console.log(order);
}
function dCost(){
    for (i = 0; i < order.length; i++){
        orderSubTotal += parseFloat(order[i].split(";")[1]);
    }
    orderSubTotal = orderSubTotal.toFixed(2); //rounds to two decimal places (sometimes floating-point error)
    console.log("Subtotal: " + orderSubTotal); //subtotal
    orderTotal = (orderSubTotal * TAX).toFixed(2);
    orderTax = (orderTotal - orderSubTotal).toFixed(2);
    console.log("Tax: " + orderTax); //tax
    console.log("Total: " + orderTotal); //total
}
function dPaymentMethod(){
    var x = getRandomInteger(1, 10);
    //var x = 1;
    var isExactChange;
    if(x <= 4){
        paymentMethod = "Cash";
        x = getRandomInteger(1, 10);
        //var x = 2;
        if(x == 1){
            isExactChange = true;
            cashGiven = orderTotal;
        }
        else{
            isExactChange = false;
            dCash();
        }
        change = (cashGiven - orderTotal).toFixed(2);
        totalCashSales += parseFloat(orderTotal);
        //totalCashSales = parseFloat(parseFloat(totalCashSales).toFixed(2));
        totalCashSales = roundDecimal(totalCashSales, 2);
        registerChange(isExactChange);
        numCashSales++;
        console.log("Cash: " + cashGiven);
        console.log("Change: " + change);
    }
    else{
        //something extra
        var r = getRandomInteger(0, 4);
        var methods = ["Debit", "Credit", "Google Pay", "Apple Pay", "Gift Card"];
        paymentMethod = methods[r];
        cashGiven = orderTotal;
        totalElecSales += parseFloat(orderTotal);
        //totalElecSales = parseFloat(parseFloat(totalElecSales).toFixed(2));
        totalElecSales = roundDecimal(totalElecSales, 2);
        numElecSales++;
        console.log("Electronic: " + orderTotal);
    }
}
function dCash(){
    cash = [1, getRandomInteger(0, 2), getRandomInteger(0, 3), getRandomInteger(0, 5)]
    console.log("[Note] Customer bills carried: " + cash);
    var billsGiven = [];
    var quantItem;
    //determines cash payment from the lowest denominator
    for(i = 3; i >= 0; i--){ //check lowest value, add from lowest up. If cannot pay for total, check next value, add from lowest up, etc...
        if(cash[i] > 0){
            for(x = 3; x >= i; x--){ //3 being cash[3]
                cashGiven = VALUES[i]; // FIXES ../bugs/1.27.19_-_cash.png
                billsGiven = [VALUES[i]];     
                if(cashGiven - orderTotal >= 0){
                    payToRegister(billsGiven);
                    return;                                                      
                }
                if(x == i){
                    quantItem = (cash[x] - 1);           
                }
                else{
                    quantItem = cash[x];
                }

                for(o = 0; o < quantItem; o++){
                    cashGiven += VALUES[x];
                    billsGiven.push(VALUES[x]);
                    if(cashGiven - orderTotal >= 0){
                        payToRegister(billsGiven);
                        return;
                    }
                }
            }
        }
    }
}
function payToRegister(array){ //cannot put in dCash - check /drafts/draft 15 and ../bugs/2.7.20. Also, require specific bills to be added.
    var billsGiven = array;
    var constname;
    for(i = 0; i < billsGiven.length; i++){
        constname = "B" + billsGiven[i];
        register[eval(constname)]++;
    }
}
function registerChange(isExactChange){
    console.log("[Note] Register b/f change: " + register);
    if(!isExactChange){
        var isDone = false;
        var tempChange = change;
        //break down the change from the largest possible denominations
        loop: for(x = B20; x <= P; x++){ //See ../references (Continue/break for loops)
            for(o = 0; o <= register[x]; o++){
                if((o > 10) && (x >= 4)) //none of the coin* counts (*hence x >= 4) can go beyond 10 without being replacable by the next value coin. Prevents ~86 iterations before next loop
                    continue loop; //passes control to next iteration
                if(!isDone) //doing this cos if checkForDrops is called, isDone must be false.
                    updateRegister(); 
                function updateRegister(){ //nested function
                    if(tempChange - VALUES[x] >= 0){
                        if(register[x]){ 
                            register[x]--;
                            tempChange -= VALUES[x];
                            //console.log("tempb " + tempChange);
                            tempChange = tempChange.toFixed(2);
                            //console.log("tempa " + tempChange);
                            if(tempChange == 0){
                                console.log("[Note] Register a/f change: " + register);
                                //console.log(dRegisterBal());
                                return isDone = true;
                            }
                            return tempChange;
                        }
                        else{
                            console.log("[Event] Register [" + x + "] " + "is empty! Checking for drops..");
                            if(x >= 4)
                                checkForDrops();
                        }
                    }
                }
                if(!register[x]){ //if the currency type is still unreplaced, skip to next value
                    console.log("[Note] Skipped register [" + x + "] ");
                    continue loop; //is out of the updateRegister() function since I don't know of a way to access a loop from a nested function
                }
                
                function checkForDrops(){ //enhancement
                    var roll = [0, 0, 0, 0, 40, 50, 40, 100]; //the coin count of its corresponding roll
                    var quantity;
                    var greater = (x - 3); //sets the larger "droppable" values to the third denomination up from the objective value
                    //check for which coin needs drop; then, check which larger bills are available for exchange.
                    for(o = greater; o <= 7; o++){
                        quantity = ((roll[x] * VALUES[x]) / VALUES[o]); //added VALUES[x] -- might've fixed the issue check it out
                        if(register[o] >= quantity){
                            register[o] -= quantity;
                            register[x] += roll[x];
                            console.log("[Event (Drop)] Exchanged [" + quantity + "] of " + "register [" + o + "]"  + " for [" + roll[x] + "] of register [" + x + "]");
                            updateRegister();
                            return;
                        }
                    }
                }
            }
        }
    }
    else{
        console.log("[Note] Exact change");
        var tempChange = cashGiven; //a little redundant, but the other functions are rather specific 
        for(i = B20; i <= P; i++){
            while(tempChange - VALUES[i] >= 0){ //while loop; See ../references
                register[i]++;
                tempChange -= VALUES[i];
                tempChange = tempChange.toFixed(2);
            }
        }
        console.log("[Note] Register a/f change: " + register);
    }
}
function dispData(){ //enhancement 2
    //item averages
    var valueHolder;
    for(i = 0; i < FOODTYPES.length; i++){
        for(x = 0; x < eval(FOODTYPES[i]).length; x++){
            //YOU ARE HERE 2/9/20. FINISHED THE ADDING, JUST MOVE ONTO THE AVERAGING (value/totaltypes[2]) AND THEN THE NAMING (op + FOODTYPES[i][x].split(";")[0] + Cost);
            valueHolder = eval(avgTotalTypes[i])[x].split(";");
            //console.log(valueHolder);
            
            valueHolder[0] = parseInt(valueHolder[0]);
            valueHolder[0] += parseInt(eval(simTotalTypes[i])[x].split(";")[0]);
            
            valueHolder[1] = parseFloat(valueHolder[1]);
            valueHolder[1] += parseFloat(eval(simTotalTypes[i])[x].split(";")[1]);
            valueHolder[1] = parseFloat(valueHolder[1]).toFixed(2);
            //console.log(valueHolder);
            
            //console.log(eval(FOODTYPES[i])[x].split(";")[0]);
            eval("op" + eval(FOODTYPES[i])[x].split(";")[0] + "Cost").innerHTML = "~$" + (valueHolder[1] / simNum).toFixed(2);
            eval("op" + eval(FOODTYPES[i])[x].split(";")[0] + "Count").innerHTML = "~" + parseInt(valueHolder[0] / simNum);
            opNumSims.innerHTML = simNum;
            eval(avgTotalTypes[i])[x] = valueHolder.join(";");
        }
        //console.log(eval(avgTotalTypes[i]));
    }
    //sales averages
    avgTotalSales += (numElecSales + numCashSales);
    avgTotalSalesTotal += (totalElecSales + totalCashSales);
    avgCashSales += numCashSales;
    avgCashSalesTotal += totalCashSales;
    avgElecSales += numElecSales;
    avgElecSalesTotal += totalElecSales;

    opAvgTotalSaleC.innerHTML = "~" + parseInt(avgTotalSales / simNum);
    opAvgTotalSaleV.innerHTML = "~$" + (avgTotalSalesTotal / simNum).toFixed(2);
    opAvgElecSaleC.innerHTML = "~" + parseInt(avgElecSales / simNum);
    opAvgElecSaleV.innerHTML = "~$" + (avgElecSalesTotal / simNum).toFixed(2);
    opAvgCashSaleC.innerHTML = "~" + parseInt(avgCashSales / simNum);
    opAvgCashSaleV.innerHTML = "~$" + (avgCashSalesTotal / simNum).toFixed(2);
    
    //register balance averages

    avgRegisterBal += parseFloat(dRegisterBal());
    opRegBalValue.innerHTML = "~$" + (avgRegisterBal / simNum).toFixed(2);
}
function dRegisterBal(){ //these loops are starting to get redundant -- i can probably make a more flexible function that'd take in parameters
    var balance = 0;
    for(i = 0; i < register.length; i++){
        for(x = 0; x < register[i]; x++){
            balance += VALUES[i];
        }
    }
    balance = balance.toFixed(2);
    return balance;
}
// Front-end functions
function setClassStyle(){ //YOU ARE HERE 1/31/20 -- Add other stats to receipts
    if(!clOrdersWidth || clOrdersWidth < (numOrder * 80))
        clOrdersWidth = (numOrder * 80); //these numbers were very rough estimates through trial and error and are by no means good parameters.
    if(!clReceiptWidth || clReceiptWidth > (85 / numOrder))
        clReceiptWidth = ((85 / numOrder));
    for(i = 0; i < clStyleReceipts.length; i++){
        clStyleReceipts[i].style.width = clReceiptWidth + "%";
    }
    for(i = 0; i <clStyleSims.length; i++){
        clStyleSims[i].style.width = clOrdersWidth +"%";
    }
}
function dispOrder(){ //e for Element
    var eSim = "<span id = 'sim#" + simNum + "' class = 'cSims'></span>";
    opLog.innerHTML += eSim;
    opSims = document.getElementById("sim#" + simNum);
}
//DISPLAY FUNCTIONS
function dispReceipt(){ //called per order iteration of a simulation
    var eReceipt = "<span class = 'receipts'> <span class = 'rNum'>Order " + numOrder +"</span>";
    var itemName;
    var itemCost;
    //items ordered
    for(i = 0; i < order.length; i++){
        if(order[i].split(";")[0].includes("_")) //i can probably modify this to make it a more flexible function
            itemName = order[i].split(";")[0].split("_").join(" "); //removes the _ in names that includes it
        else
            itemName = order[i].split(";")[0]; 
        itemCost = order[i].split(";")[1];
        eReceipt += "<br/><span class = 'itemname'>" + itemName + "</span><br/><span class = 'itemcost'>" + itemCost + "</span>";
    }
    //cost totals
    eReceipt += "<br/><span class = 'subtotal'><span class = 'subtotalhead'>Subtotal</span><span class = 'subtotalcost'>" + orderSubTotal + "</span></span>" + //subtotal
                "<br/><span class = 'tax'><span class = 'taxhead'>Tax</span><span class = 'taxcost'>" + orderTax + "</span></span>" + //tax
                "<br/><span class = 'total'><span class = 'totalhead'>Total</span><span class = 'totalcost'>" + orderTotal + "</span></span>"; //total
    //numsales
    eReceipt += "<br/><span class = 'paymentmethod'><span class = 'methodname'>" + paymentMethod + "</span><span class = 'payment'>" + cashGiven + "</span></span>";
    if(paymentMethod == "Cash"){
        eReceipt += "<br/><span class = 'paymentchange'><span class = 'changehead'>Change</span><span class = 'changevalue'>" + change + "</span></span>";
    }
    eReceipt += "</span>";

    opSims.innerHTML += eReceipt;
}
function dispSimTotals(){ //these get a bit redundant since i didn't plan it aaaaugh
    var itemName;
    var itemCount;
    var itemCost;
    var simSalesTotal = (totalCashSales + totalElecSales).toFixed(2);
    var regBalDiff = parseFloat(dRegisterBal() - totalCashSales).toFixed(2);
    var regBalResult;
    var eSimTotals = "<span class = 'simtotals'><span class = 'simhead'>Sim <span class = 'simnum'>" + simNum + "</span> Totals</span>"
                     "<br/><span class = 'simlabeltab'>Item -- Revenue (Count)</span>";
    //simitemtotals
    for(i = 0; i < FOODTYPES.length; i++){
        for(x = 0; x < eval(FOODTYPES[i]).length; x++){
            if(eval(FOODTYPES[i])[x].split(";")[0].includes("_")) //i can probably modify this to make it a more flexible function
                itemName = eval(FOODTYPES[i])[x].split(";")[0].split("_").join(" "); //removes the _ in names that includes it
            else
                itemName = eval(FOODTYPES[i])[x].split(";")[0]; 

            itemCount = eval(simTotalTypes[i])[x].split(";")[0];
            itemCost = eval(simTotalTypes[i])[x].split(";")[1];
            eSimTotals += "<br/><span class = 'simitems'><span class = 'simitemname'>" + itemName + "</span> -- <span class = 'simitemcost'>$" 
            + itemCost + "</span> (<span class = 'simitemcount'>" + itemCount + "</span>)</span>";
        }
    } //.toFixed is necessary here for the float to display as "9.70" instead of "9.7"
    //simsaletotalls
    eSimTotals += "<br/><span class = 'simsales'><span class = 'simsalenumhead'>Total Sales</span> -- <span class = 'simsalenumvalue'>$" + simSalesTotal + "</span> (<span class = 'simsalenumnum'>" + (numElecSales + numCashSales) + "</span>)" + 
                  "<br/><span class = 'simsalespecific'><span class = 'simsalenumhead'>Electronic</span> -- <span class = 'simsalenumvalue'>$" + parseFloat(totalElecSales).toFixed(2) + "</span> (<span class = 'simsalenumnum'>" + numElecSales + "</span>)" + 
                  "<br/><span class = 'simsalenumhead'>Cash</span> -- <span class = 'simsalenumvalue'>$" + parseFloat(totalCashSales).toFixed(2) + "</span> (<span class = 'simsalenumnum'>" + numCashSales + "</span>)</span></span>";
    //simregisterbalance
    eSimTotals += "<br/><span class = 'regbal'><span class = 'regbalhead'>Register Balance</span> -- <span class = 'regbalvalue'>$" + dRegisterBal() + "</span>";
    if(regBalDiff == 100)//determines if under, even, or over
        regBalResult = "Even";
    else if(regBalDiff > 100)
        regBalResult = "Over";
    else
        regBalResult = "Under";
        
    eSimTotals += " (<span class = 'regbalresult'>" + regBalResult + "</span>)</span>"
    opSims.innerHTML = eSimTotals + "</span>" + opSims.innerHTML; ///span closes simhead element
}
function display(){
    //display per simulation
    dispSimTotals();
    dispData();
    setClassStyle();
}