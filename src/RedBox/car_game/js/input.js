var keyState = [];
var mousePos = [0,0];


ui_div.addEventListener('keydown',keyDown,false);
ui_div.addEventListener('keypress',keyPress,false);
ui_div.addEventListener('keyup',keyUp,false);
ui_div.addEventListener("mousedown",mouseDown,false);
ui_div.addEventListener("mouseup",mouseUp,false);
ui_div.onmousemove = (e) => {
    mousePos[0] = e.clientX;
    mousePos[1] = e.clientY; 
}


function keyPress(e){ 

}

function keyDown(e){
    keyState[e.key]=true;
}

function keyUp(e){
    keyState[e.key]=false;
}

function mouseDown(){
    keyState["mouse"]=true;
    if(mousePos[0] > 650 && mousePos[1]<80){
        return;
    }
    if(currentGameState == gameStates.Game  )
    {
    if(mousePos[0]<player.pos.x){
        player.targetLane = player.currentLane <= lanes[0]?lanes[0]: lanes[lanes.indexOf(player.currentLane)-1]; 
    }
    if(mousePos[0]>player.pos.x +player.size.x){
        player.targetLane = player.currentLane >= lanes[2]?lanes[2]: lanes[lanes.indexOf(player.currentLane)+1]; 
    }
}
}

function mouseUp(){
    keyState["mouse"]=false;
}






