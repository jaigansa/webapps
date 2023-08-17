const tamilNumbers = ["௦", "௧", "௨", "௩", "௪", "௫", "௬", "௭", "௮", "௯"];



let iodisplay = document.getElementById("io-display");

function display(num) {
    iodisplay.value += num;
    console.log("ok");
};

function clr() {
    iodisplay.value = "";
};

function del() {
    iodisplay.value = iodisplay.value.slice(0, -1);
};

function calculate() {
    try {
        iodisplay.value = eval(iodisplay.value);
    }
    catch (err) {
        alert("Invalid");
    }
};