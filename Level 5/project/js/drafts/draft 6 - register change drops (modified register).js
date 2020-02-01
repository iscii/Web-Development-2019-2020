
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
    //sequencing
    canSimulate = true;
}
function iVariables(){
    //dynamic
    cash = [];
    cashGiven = 0;
    change = 0;
    register = [0, 2, 4, 42, 0, 0, 0, 0];
    registerTotal = 0;
    numOrder = 0;
    order = [];
    orderTime = 0;
    orderSubTotal = 0;
    orderTotal = 0;
    orderTax = 0;
    time = 10;
    log = [];

    //semi-static
    numCashSales = 0;
    numElecSales = 0;
}
function simulate(){
    if(canSimulate){
        canSimulate = false;
        iVariables();
        for(time; time > 0; time -= orderTime){
            console.log("ORDER [" + numOrder + "] ---------------------------------------------");
            //determines the order's length in time
            orderTime = getRandomInteger(1, 5);
            if(time - orderTime <= 0)
                orderTime = time;
            console.log("length: " + orderTime);
            dOrder();
            dCost();
            //dPaymentMethod();
            dCash();
            registerChange();

            //everything that happens above this point is logged
            numOrder++;
            order = [];
            orderSubTotal = 0;
            orderTotal = 0;
            orderTax = 0;
            cash = [];
            cashTotal = 0;
            cashGiven = 0;
        }
        console.log("remaining time: " + time);
        
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
    if(x <= 4){
        x = getRandomInteger(1, 10)
        if(x == 1){
            cashGiven = orderTotal;
        }
        else{
            dCash();
            registerChange();
        }
        numCashSales++;
        console.log("Cash: " + cashGiven);
    }
    else{
        numElecSales++;
        console.log("Electronic: " + orderTotal);
    }
}
function dCash(){
    cash = [1, getRandomInteger(0, 2), getRandomInteger(0, 3), getRandomInteger(0, 5)]
    var quantItem;
    //var paid = []; //to check which bills are being used
    //determines cash payment from the lowest denominator
    for(i = 3; i >= 0; i--){ //check lowest value, add from lowest up. If cannot pay for total, check next value, add from lowest up, etc...
        if(cash[i] > 0){
            for(x = 3; x >= i; x--){
                cashGiven = VALUES[i]; // FIXES ../bugs/1.27.19_-_cash.png
                paid = [VALUES[i]];                 
                if(cashGiven - orderTotal >= 0){   
                    console.log("paid: " + paid);   
                    return;                         
                }                              
                if(x == i)
                    quantItem = (cash[x] - 1);           
                else
                    quantItem = cash[x];

                for(o = 0; o < quantItem; o++){
                    cashGiven += VALUES[x];
                    //paid.push(VALUES[x]);
                    register[x]++;
                    if(cashGiven - orderTotal >= 0){
                        console.log("paid: " + paid);
                        return;
                    }
                }
            }
        }
    }
}
function registerChange(){
    console.log(register);
    change = (cashGiven - orderTotal).toFixed(2);
    console.log("change: " + change);
    //var given = []; //to check which currencies were given
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
                    //console.log("register [" + x +  "] = " + register[x]);
                    if(register[x]){ //YOU ARE HERE 1/28/2020; Figure out why the else statement on ln 172 is not being called when register[x] = 0.
                        register[x]--;
                        //given.push(VALUES[x]);
                        tempChange -= VALUES[x];
                        tempChange = tempChange.toFixed(2);
                        console.log("change = " + tempChange);
                        if(tempChange == 0){
                            //console.log(given);
                            console.log("done; register: " + register);
                            return isDone = true;
                        }
                        return tempChange;
                    }
                    else{
                        console.log("register [" + x + "] " + "is empty! Checking for drops..");
                        if(x >= 4)
                            checkForDrops();
                    }
                }
            }
            if(!register[x]){ //if the currency type is still unreplaced, skip to next value
                console.log("skipped register [" + x + "] ");
                continue loop; //is out of the updateRegister() function since I don't know of a way to access a loop from a nested function
            }
            
            function checkForDrops(){ //enhancement
                //DITCHED COS USELESS >> could also make it reverse; 20$ can be obtained from 20 1$ bills
                //>>working on *******this could probably be much more simplified with some clever for functions
                /*
                if(x == Q){ //check the required coin type
                    //check if there are any available "changers"
                    if(register[B10]){ //1 10$ bill
                        register[B10]--;
                        register[x] += 40;
                        console.log("1 10B for 40 P");
                    }
                    else if(register[B5] >= 2){ //2 5$ bills
                        register[B5] -= 2;
                        register[x] += 40;
                        console.log("2 5B for 40 P");
                    }
                    else if(register[B1] >= 10){ //10 1$ bills
                        register[B1] -= 10;
                        register[x] += 40;
                        console.log("10 1B for 40 P");
                    }
                    updateRegister();
                }
                if(x == D){
                    if(register[B5]){
                        register[B5]--;
                        register[x] += 50;
                        console.log("1 5B for 50 D");
                    }
                    else if(register[B1] >= 5){
                        register[B1] -= 5;
                        register[x] += 50;
                        console.log("5 1B for 50 D");
                    }
                    else if(register[Q] >= 20){ //adding...
                        register[Q] -= 20;
                        register[x] += 50;
                    }
                    updateRegister();
                }
                if(x == N){
                    if(register[B1] >= 2){
                        register[B1] -= 2;
                        register[x] += 40;
                        console.log("2 1B for 40 N");
                    }
                    elseif(register[Q] >= 8){ //adding this 1/29/20 to make the for statement easier to think about and conceptually understand
                        register[Q] -= 8;
                        register[x] += 40;
                    }
                    else if(register[D] >= 20){
                        register[D] -= 20;
                        register[x] += 40;
                    }
                    updateRegister();
                }
                if(x == P){
                    if(register[Q] >= 2){
                        register[Q] -= 2;
                        register[x] += 50;
                        console.log("2 Q for 50 P");
                    }
                    else if(register[D] >= 5){
                        register[D] -= 5;
                        register[x] += 50;
                        console.log("5 D for 50 P");
                    }
                    else if(register[N] >= 10){ //if register[6] >= 50/5 (list[x]/VALUES[x])
                        register[N] -= 10;
                        register[x] += 50;
                        console.log("10 N for 50 P");
                    }
                    updateRegister();
                } */
                //var cP = 100;
                //var cN = 40;
                //var cD = 50;
                //var cQ = 40;
                var roll = [0, 0, 0, 0, 40, 50, 40, 100]; //the coin count of its corresponding roll
                var quantity;
                //check for which coin needs drop; then, check which larger bills are available for exchange.
                var greater = (x - 3); //sets the larger "droppable" values to the third denomination up from the objective value
                for(o = greater; o <= 7; o++){
                    console.log("roll = " + roll[x]);
                    console.log("value x = " + VALUES[x]);
                    console.log("value o = " + VALUES[o]);
                    quantity = ((roll[x] * VALUES[x]) / VALUES[o]); //added VALUES[x] -- might've fixed the issue check it out
                    console.log("quantity = " + quantity);
                    if(register[o] >= quantity){
                        register[o] -= quantity;
                        register[x] += roll[x];

                        console.log("[Drop] Exchanged [" + quantity + "] of " + "register [" + o + "]"  + " for [" + roll[x] + "] of register [" + x + "]");

                        updateRegister();
                        return;
                    }
                }
            }
        }
    }
}
