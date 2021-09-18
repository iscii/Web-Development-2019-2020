
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
    cashTotal = 0;
    register = [0, 2, 4, 42, 30, 50, 40, 100];
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
    numSales = 0;
    numCashSales = 0;
    numElecSales = 0;
}
function iFunctions(){
}
function simulate(){
    if(canSimulate){
        canSimulate = false;
        iVariables();
        iFunctions();
        for (time; time > 0; time -= orderTime){
            console.log("ORDER [" + numOrder + "] ---------------------------------------------");
            //determines the order's length in time
            orderTime = getRandomInteger(1, 5);
            if(time - orderTime <= 0)
                orderTime = time;
            console.log("length: " + orderTime);
            dOrder();
            dCost();

            //everything that happens above this point is logged
            numOrder++;
            order = [];
            orderSubTotal = 0;
        }
        console.log("remaining time: " + time);
        
        canSimulate = true;
    }
}
function dOrder(){
    for (i = 0; i < (FOODTYPES.length - 1); i++){
        //console.log("Food Type: " + FOODTYPES[i]);
        if(i == 2) 
            quantity = getRandomInteger(0, 2);
        else
            quantity = getRandomInteger(0, 1);
        //console.log("number of " + FOODTYPES[i] +": " + quantity);
        for (x = 0; x < quantity; x++){
            order.unshift(eval(FOODTYPES[i])[getRandomInteger(0, (eval(FOODTYPES[i]).length - 1))]);
            //console.log(order);
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