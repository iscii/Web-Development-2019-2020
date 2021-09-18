
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

function initialize(){
    iVars();
}
function iVars(){ //updating between simulations
    //sequencing
    canSimulate = true;

    //orderTotals, numCashSales, numElecSales
    logData = []; //holds the totals of every simulation overall -- ASK TURNER WHICH TOTALS TO INCLUDE
    avgOrderTotal = 0;
    avgCashSales = 0;
    avgElecSales = 0;
}
function semiVars(){ //changing/reset between simulations
    //semi-dynamic
    change = 0;
    register = [0, 2, 4, 42, 40, 50, 40, 100];
    registerTotal = 0;
    numOrder = 0;
    orderTime = 0;
    time = 180;
    exactChange = false;
    numCashSales = 0;
    numElecSales = 0;
}
function dynamicVars(){ //changing/reset within each iteration of simulation
    //dynamic
    order = [];
    orderSubTotal = 0;
    orderTotal = 0;
    orderTax = 0;
    cash = [];
    cashGiven = 0;
}
function simulate(){
    if(canSimulate){
        canSimulate = false;
        semiVars();
        dynamicVars();
        for(time; time > 0; time -= orderTime){
            console.log("--------------------------------------------- ORDER [" + numOrder + "] ---------------------------------------------");
            //determines the order's length in time
            orderTime = getRandomInteger(1, 5);
            if(time - orderTime <= 0)
                orderTime = time;
            console.log("[Note] Length: " + orderTime);
            dOrder();
            dCost();
            dPaymentMethod();
            logData.push(orderTotal, numCashSales, numElecSales); //orderTotals: 0 + 3n; numCashSales; 1 + 3n; numElecSales; 2 + 3n 

            //everything that happens above this point is logged
            numOrder++;
            dynamicVars();
        }
        manageData();
        console.log("[Note] Remaining time: " + time);
        
        canSimulate = true;
    }
}
function dOrder(){
    for (i = 0; i < (FOODTYPES.length - 1); i++){
        if(i == 2) 
            quantity = getRandomInteger(0, 2);
        else
            quantity = getRandomInteger(0, 1);
        for (x = 0; x < quantity; x++){
            order.push(eval(FOODTYPES[i])[getRandomInteger(0, (eval(FOODTYPES[i]).length - 1))]);
        }
    }
    order[order.length] = eval(FOODTYPES[3])[getRandomInteger(0, 2)]; //sets the first
    console.log(order);
}
function dCost(){
    for (i = 0; i < order.length; i++){
        orderSubTotal += parseFloat(order[i].split(";")[1]);
    }
    orderSubTotal = orderSubTotal.toFixed(2); //rounds to two decimal places (sometimes floating-point error)
    console.log("subTotal: " + orderSubTotal); //subtotal
    orderTotal = (orderSubTotal * TAX).toFixed(2);
    orderTax = (orderTotal - orderSubTotal).toFixed(2);
    console.log("Tax: " + orderTax); //tax
    console.log("Total: " + orderTotal); //total
}
function dPaymentMethod(){
    var x = getRandomInteger(1, 10);
    var isExactChange;
    if(x <= 4){
        x = getRandomInteger(1, 10);
        if(x == 1){
            isExactChange = true;
            cashGiven = orderTotal;
        }
        else{
            isExactChange = false;
            dCash();
        }
        change = (cashGiven - orderTotal).toFixed(2);
        registerChange(isExactChange);
        numCashSales++;
        console.log("Cash: " + cashGiven);
        console.log("Change: " + change);
    }
    else{
        numElecSales++;
        console.log("Electronic: " + orderTotal);
    }
}
function dCash(){
    cash = [1, getRandomInteger(0, 2), getRandomInteger(0, 3), getRandomInteger(0, 5)]
    var quantItem;
    //determines cash payment from the lowest denominator
    for(i = 3; i >= 0; i--){ //check lowest value, add from lowest up. If cannot pay for total, check next value, add from lowest up, etc...
        if(cash[i] > 0){
            for(x = 3; x >= i; x--){ //3 being cash[3]
                cashGiven = VALUES[i]; // FIXES ../bugs/1.27.19_-_cash.png                
                if(cashGiven - orderTotal >= 0) 
                    return;                                                      
                if(x == i)
                    quantItem = (cash[x] - 1);           
                else
                    quantItem = cash[x];

                for(o = 0; o < quantItem; o++){
                    cashGiven += VALUES[x];
                    register[x]++;
                    if(cashGiven - orderTotal >= 0)
                        return;
                }
            }
        }
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
                            tempChange = tempChange.toFixed(2);
                            if(tempChange == 0){
                                console.log("[Note] Register a/f change: " + register);
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
            }
        }
        console.log("[Note] Register a/f change: " + register);
    }
}
//YOU ARE HERE 1/29/20. WORK ON THE SECOND ENHANCEMENT AND THEN START THE HTML AND CSS AND LOGGING
function manageData(){
    var logStructure = [avgOrderTotal, avgCashSales, avgElecSales]; //if this gets buggy, use strings instead of variables (as items)
    var logItemCount = [0, 0, 0]; //there might be a way to circumvent needing this array but my brain is failing me
    for(z = 0; z < 2; z++){
        for(i = 0; i <= 2; i++){
            if(z == 0){
                for(n = 1; n < (logData.length / 3); n++){
                    //console.log("hello");
                    logStructure[i] += eval(logData[i + (3 * n)]);
                    //console.log(logStructure);
                    logItemCount[i]++;
                }
            }
            else{
                //console.log(logStructure);
                logStructure[i] = logStructure[i] / logItemCount[i];
                logStructure[i] = logStructure[i].toFixed(2);
                //countOccurencesInArray(logData[logStructure[i]]);
            }
        }
    }
    console.log("[Note] Avgs: Order Totals [" + logStructure[0] + "], Cash Sales [" + logStructure[1] + "], Electronic Sales [" + logStructure[2] + "]");
}