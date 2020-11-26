console.log("***Connected main.js File***");

/* code is title section */

var title = document.getElementById("appname");
var title_text = "Estimate Calculator";
title.innerHTML = "<h1>" + title_text + "</h1>";
title.style.cssText = "border: 1vw solid #fff; padding: 2vw; "; //title border

//get user informations

var workhrs = document.getElementById("workHrs");
var persons = document.getElementById("noofperson");
let profitpercent = 25 / 100; //profit of work

//get document Elements

var display = document.getElementById("output");

//get work type

function workType() {
  var getworktype = document.getElementById("work-type").value;
  switch (parseInt(getworktype)) {
    case 1:
      profit = workhrs.value * persons.value * profitpercent; //profit add 25prercent
      results = workhrs.value * persons.value + profit;
      display.innerHTML = "<h1>Price: " + results + "</h1>";
      break;
    case 2:
      let tools_a = document.getElementById("tools_title");
      tools_a.innerHTML = "Select Type of Tools";
      toolsdb();
      display.innerHTML = "<h1>Labour plus Tools</h1>";
      break;
    case 3:
      display.innerHTML = "<h1>Labour plus Tools plus Material</h1>";
      break;

    default:
      display.innerHTML = "<h1>Select Type Of Work.</h1>";
      break;
  }

  //console.log(workhrs.value * persons.value);
}

//select type of tools

function typetools() {
  let gettypetool = document.getElementById("toolselect").value;
  let gettoolshelf = document.getElementById("toolshelf");
  switch (parseInt(gettypetool)) {
    case 0:
      
      let listHT = Object.keys(handtools);
      console.log(listHT);
    for (let i=0; i < listHT.length; i++){
      let htg = listHT[i];
      console.log(htg); 
      let hti = document.createElement("input");
      let htil =document.createElement("label");
      htil.appendChild(document.createTextNode(htg));
      hti.appendChild(document.createTextNode(htg));
      hti.setAttribute("type", "checkbox");
      gettoolshelf.appendChild(hti);
      gettoolshelf.appendChild(htil);

    }
      
      
      break;
    case 1:
      console.log("powertools");
      break;
    case 2:
      console.log("HeavyTools");
      console.log(alltools);
      break;

    default:
      console.log("alltools");
      break;
  }
}

let heretool = document.getElementById("toolselect");

// create choose tools options
let newTool = function () {
  let listhead = Object.keys(alltools);
  heretool.style.cssText = "display:flex";
  for (let i = 0; i < listhead.length; i++) {
    //console.log(listhead[i]);
    let toolhname = listhead[i];
    let toolself = document.createElement("option");
    toolself.appendChild(document.createTextNode(toolhname));
    toolself.setAttribute("value", i);
    heretool.appendChild(toolself);
  }
  //next shelfs
  let htool = document.getElementById("tools");
  let toolselfs = document.createElement("div");
  toolselfs.setAttribute("id", "toolshelf");
  htool.insertBefore(toolselfs, htool.lastChild);

};

//tools import from json file

let handtools,
  powertools,
  heavytools = [],
  alltools = {};

let toolsdb = function () {
  fetch("res/tools.json")
    .then((response) => {
      return response.json();
    })

    .then((data) => {
      //console.log(data);
      handtools = data.handtools;
      powertools = data.powertools;
      heavytools = data.heavytools;
      alltools = data;
      newTool();
      typetools();
    })

    .catch((err) => {
      // Do something for an error here
    });

  /* this end fetch */
};
