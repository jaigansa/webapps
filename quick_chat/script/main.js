/* WhatsApp quick Chat using url open method */

/*
  ___          _        _      ____  _             _   
 / _ \  _   _ (_)  ___ | | __ / ___|| |__    __ _ | |_ 
| | | || | | || | / __|| |/ /| |    | '_ \  / _` || __|
| |_| || |_| || || (__ |   < | |___ | | | || (_| || |_ 
 \__\_\ \__,_||_| \___||_|\_\ \____||_| |_| \__,_| \__|
*/

// Number Pad
function num(val) {
    document.getElementById("cellnum").value += val;
}

// number only
function cellnumonly(input) {
    var reqex = /[^0-9]/gi;
    input.value = input.value.replace(reqex, "");
}


// chat button

//variable 
const pre = "https://wa.me/";
const addtext = "?text=";
// get datas







function chat_open() {
    var dcod = document.getElementById("dCode").value;
    var cn = document.getElementById("cellnum").value;
    var txt = document.getElementById("txt").value; // get message data

    if (cn.length === 10) {
        newtxt = encodeURI(txt);
        final = pre + dcod + cn + addtext + newtxt;
        //alert(final);
        window.open(final, "_blank");
    } else {
        alert("enter ten number");
    }
}

//clear buttom
function clears() {
    x = document.getElementById("cellnum").value;
    y = x.slice(0, -1);
    document.getElementById("cellnum").value = y;

}
// allclear button
function allclear() {
    document.getElementById("cellnum").value = "";
    document.getElementById("txt").value = "";
}

//textarea auto height
function textAreaAdjust(element) {
    element.style.height = "1px";
    element.style.height = (1 + element.scrollHeight) + "px";
}
