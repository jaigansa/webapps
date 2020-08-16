function num(val) {
    document.getElementById("telphone").value += val;
}



function chat() {
    no = document.getElementById("telphone").value;
    txt = document.getElementById("txt").value;
    if (no.length === 10) {
        var pre = "https://wa.me/91";
        var txt = encodeURI(txt);
        var final = pre + no + "?text=" + txt;
        console.log(final);
        window.open(final, "_blank");
    } else {
        alert("enter ten number");
    }
}


function clears() {
    x = document.getElementById("telphone").value;
    y = x.slice(0, -1);
    document.getElementById("telphone").value = y;

}

function allclear() {
    document.getElementById("telphone").value = "";
    document.getElementById("txt").value = "";
}

function textAreaAdjust(element) {
    element.style.height = "1px";
    element.style.height = (1 + element.scrollHeight) + "px";
}
