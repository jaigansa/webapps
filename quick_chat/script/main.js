/* WhatsApp quick Chat using url open method */

/*
  ___          _        _      ____  _             _   
 / _ \  _   _ (_)  ___ | | __ / ___|| |__    __ _ | |_ 
| | | || | | || | / __|| |/ /| |    | '_ \  / _` || __|
| |_| || |_| || || (__ |   < | |___ | | | || (_| || |_ 
 \__\_\ \__,_||_| \___||_|\_\ \____||_| |_| \__,_| \__|
*/

// button value add to display
function num(val) {
    document.getElementById("display").value += val;
}

// number only
function digitonly(input) {
    var reqex = /[^0-9]/gi;
    input.value = input.value.replace(reqex, "");
}


// chat button

//variable 
const pre = "https://api.whatsapp.com/send?phone=";
const addtext = "&text=";
// get datas

function chat_open() {
    var dcod = document.getElementById("dCode").value;
    var cn = document.getElementById("display").value;
    var txt = document.getElementById("txt").value; // get message data

    if (cn.length === 10) {
        newtxt = encodeURI(txt);
        final = pre + dcod + cn + addtext + newtxt;
        //alert(final);
        //window.open(final, "_self");
        //location.href = final;
        location.replace(final);
    } else {
        alert("enter ten number");
    }
}

//clear buttom
function clears() {
    x = document.getElementById("display").value;
    y = x.slice(0, -1);
    document.getElementById("display").value = y;

}
// allclear button
function allclear() {
    document.getElementById("display").value = "";
    document.getElementById("txt").value = "";
}




//textarea auto height
function textAreaAdjust(element) {
    element.style.height = "0.1em";
    element.style.height = (0.1 + element.scrollHeight) + "px";
}
