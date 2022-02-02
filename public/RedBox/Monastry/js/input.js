var keyState = [];
var mousePos = [0,0];

cavMain.addEventListener('keydown',keyDown,false);
cavMain.addEventListener('keypress',keyPress,false);
cavMain.addEventListener('keyup',keyUp,false);
cavMain.addEventListener("touchstart",mouseDown,false);
cavMain.addEventListener("touchend",mouseUp,false);


cavMain.ontouchmove = (e) => {
    
    let mpx = (e.touches[0].clientX/window.innerWidth)*cav.width;
    let mpy = (e.touches[0].clientY/window.innerHeight)*cav.height;
    mousePos[0] = mpx;
    mousePos[1] = mpy;  
    let temp = onhovercheck();
    if(temp!=null)
    {
        if(temp.onhover != null)temp.onhover();
    }
    else
    {
        if(currentGameState== gameStates.game)
        {  
            player_entity.target_point = {
                x: mousePos[0],
                y : mousePos[1]
            }      
        }
    }
}



function keyPress(e){ 
}

function keyDown(e){
    keyState[e.key]=true;
}

function keyUp(e){
    keyState[e.key]=false;
}

function mouseDown(e){
    let mpx = (e.touches[0].clientX/window.innerWidth)*cav.width;
    let mpy = (e.touches[0].clientY/window.innerHeight)*cav.height;
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
       if(currentGameState == gameStates.game)
       {  
        player_entity.target_point = {
            x: mousePos[0],
            y : mousePos[1]
        } 
       }
    }
}

function mouseUp(){
    keyState["mouse"]=false;
}






