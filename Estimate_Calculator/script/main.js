console.log("init main.js");

/* Import title */
var title = "Labour Estimate";

var newtitle = document.getElementById("appname");
newtitle.innerHTML = title;
newtitle.style.cssText = " ";
// title css

// get values
var workhrs = document.getElementById("workHrs");
var workamt = document.getElementById("workamount");
var persons = document.getElementById("noofperson");

// manual values
let profitpercent = 0.25;
// profit of work

// get document Elements

var display = document.getElementById("output");

// get work type

function calculate() {
    reset();

    profit = workhrs.value * workamt.value * persons.value * profitpercent; // profit add 25prercent
    results = workhrs.value * workamt.value * persons.value + profit;
    display.innerHTML = results + ".00/-";

}
function reset() {
    display.innerHTML = " ";
}


// tools import from json file

let handtools,
    powertools,
    heavytools = [],
    alltools = {};

let toolsdb = function () {
    fetch("res/tools.json").then((response) => {
        return response.json();
    }).then((data) => { // console.log(data);
        handtools = data.handtools;
        powertools = data.powertools;
        heavytools = data.heavytools;
        alltools = data;
        newTool();
        typetools();
    }).catch((err) => { // Do something for an error here
    });

    /* this end fetch */
};
