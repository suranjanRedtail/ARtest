var keyState = [];
var mousePos = [0,0];


cavMain.ontouchmove = (e) => {
    
    let mpx = (e.touches[0].clientX/window.innerWidth)*720;
    let mpy = (e.touches[0].clientY/window.innerHeight)*1280;
    mousePos[0] = mpx;
    mousePos[1] = mpy;  
    let temp = onhovercheck();
    if(temp!=null)
    {
        if(temp.onhover != null)temp.onhover();
    }
}


function keyPress(e){ 
}

function keyDown(e){
    console.log(e.key);
    keyState[e.key]=true;
}

function keyUp(e){    
    keyState[e.key]=false;
}

function mouseDown(e){
    let mpx = (e.touches[0].clientX/window.innerWidth)*720;
    let mpy = (e.touches[0].clientY/window.innerHeight)*1280;
    mousePos[0] = mpx;
    mousePos[1] = mpy; 
    keyState["mouse"]=true;    
    let temp = onhovercheck();
    if(temp!=null )
    {
        if(temp.onclick != null)temp.onclick();
    }
    else
    {
    }
}

function mouseUp(){
    keyState["mouse"]=false;
}

document.body.addEventListener("keydown",keyDown,false);
document.body.addEventListener("keypress",keyPress,false);
document.body.addEventListener("keyup",keyUp,false);
document.body.addEventListener("touchstart",mouseDown,false);
document.body.addEventListener("touchend",mouseUp,false);



