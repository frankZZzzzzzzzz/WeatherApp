let Scrolling = false;
let yPos;

window.onmousedown = (e) => {
    Scrolling = true;
    yPos = e.clientY;
}
window.onmousemove = (e) => {
    /*window.scroll(window.scrollY + e.clientY);*/
    if (Scrolling){
        window.scrollBy(0, yPos-e.clientY);
        yPos = e.clientY;
    }
}
window.onmouseup = () => {
    Scrolling = false;
}
function initialize() {
    for (let i = 0; i <= 24; i++){
        document.getElementById(`hour${i}-bar`).onclick = () => {
            document.getElementById(`hour${i}-info`).classList.toggle('hidden');
        };
    }
}
window.onload = () => {
    initialize();
}