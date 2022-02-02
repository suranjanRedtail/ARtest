var keyState = [];
var mousePos = [0,0];

var mouseStart = [];
var gesture_start = 0;


document.body.addEventListener('keydown',keyDown,false);
document.body.addEventListener('keypress',keyPress,false);
document.body.addEventListener('keyup',keyUp,false);
cavMain.addEventListener("touchstart",touchDown,false);
cavMain.addEventListener("touchend",touchUp,false);
cavMain.addEventListener("mouseup",mouseUp,false);
cavMain.addEventListener("mousedown",mouseDown,false);

cavMain.ontouchmove = (e) => {     

    setMousePos(e,true);
    let temp = onhovercheck();
    if(temp!=null)
    {
        if(temp.onhover != null)temp.onhover();
    }
    else
    {
        if(currentGameState== gameStates.game)
        {    

        }
    }
}

cavMain.onmousemove = (e) =>{
    setMousePos(e); 
    let temp = onhovercheck();
    
    if(temp!=null)
    {
        if(temp.onhover != null)temp.onhover();
    }
    else
    {
        if(currentGameState== gameStates.game)
        {    

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

function touchDown(e){     
    setMousePos(e,true);
    keyState["mouse"]=true;    
    let temp = onhovercheck();
    if(temp!=null )
    {
        if(temp.onclickdown != null)temp.onclickdown();
    }
    else
    {
        if(currentGameState==gameStates.game)
        {
            Engine.onClick.forEach(element => {                
                element.onClick();               
            });
        }       
    }

    mouseStart = mousePos.slice();
    gesture_start = Date.now();  
    
}


function touchUp(e)
{
    
    let gesture_time = Date.now() - gesture_start;   
    let temp = onhovercheck();
    if(temp!=null )
    {
        if(temp.onclick != null)
        {
            temp.onclick();
        }
        
    }
    else
    {
        if(gesture_time > Engine.minGestureTime)
        {
            let dmy = -mouseStart[1]+mousePos[1];
            let dmx = -mouseStart[0]+mousePos[0];
            let dist = Math.sqrt(Math.pow(dmx,2)+Math.pow(dmy,2));
            if(dist>Engine.minGestureDistance)
            {
                let angle = Math.atan(dmy/dmx);
                let swipe_direction = "";
                
                if(dmx < 0)
                {
                    angle += Math.PI;
                }
                if(angle < 0)
                {
                    angle += Math.PI * 2;
                }
                angle = (Math.PI *2)-angle;
                angle *= (180/Math.PI);    
                
                Engine.onSwipe.forEach( e=>{
                    e(
                        {
                            angle:angle,
                            lenght:dist,
                            vector : {x:dmx,y:dmy},
                            start : mouseStart,
                        }
                    );
                });
    
                swipe_direction = angle <= 45 || angle>= 315? "right": angle>=45 && angle <= 135 ? "up": angle>=135 && angle <= 225?"left":"down";
    
                switch(swipe_direction)
                {
                    case "up":
                        Engine.onSwipeUp.forEach(e=>{
                            e();
                        });
                        break;
                    case "down":
                        Engine.onSwipeDown.forEach(e=>{
                            e();
                        });
                        break;
                    case "left":
                        Engine.onSwipeLeft.forEach(e=>{
                            e();
                        });
                        break;
                    case "right":
                        Engine.onSwipeRight.forEach(e=>{
                            e();
                        });
                        break;
                }   
            }
            Engine.onMouseUp.forEach(e=>{
                e();
            });        
        }
        else
        {
            Engine.onMouseUp.forEach(e=>{
                e();
            });
        }
    }
    keyState["mouse"]=false;
}
function mouseUp(e){
    if(ismobile)
    {
        return;
    }
    let gesture_time = Date.now() - gesture_start;   
    let temp = onhovercheck();
    if(temp!=null )
    {
        if(temp.onclick != null)temp.onclick();
        
    }
    else
    {
        if(gesture_time > Engine.minGestureTime)
        {
            let dmy = -mouseStart[1]+mousePos[1];
            let dmx = -mouseStart[0]+mousePos[0];
            let dist = Math.sqrt(Math.pow(dmx,2)+Math.pow(dmy,2));
            if(dist>Engine.minGestureDistance)
            {
                let angle = Math.atan(dmy/dmx);
                let swipe_direction = "";
                
                if(dmx < 0)
                {
                    angle += Math.PI;
                }
                if(angle < 0)
                {
                    angle += Math.PI * 2;
                }
                angle = (Math.PI *2)-angle;
                angle *= (180/Math.PI);    
                
                Engine.onSwipe.forEach( e=>{
                    e(
                        {
                            angle:angle,
                            lenght:dist,
                            vector : {x:dmx,y:dmy},
                            start : mouseStart,
                        }
                    );
                });
    
                swipe_direction = angle <= 45 || angle>= 315? "right": angle>=45 && angle <= 135 ? "up": angle>=135 && angle <= 225?"left":"down";
    
                switch(swipe_direction)
                {
                    case "up":
                        Engine.onSwipeUp.forEach(e=>{
                            e();
                        });
                        break;
                    case "down":
                        Engine.onSwipeDown.forEach(e=>{
                            e();
                        });
                        break;
                    case "left":
                        Engine.onSwipeLeft.forEach(e=>{
                            e();
                        });
                        break;
                    case "right":
                        Engine.onSwipeRight.forEach(e=>{
                            e();
                        });
                        break;
                }   
            }
            Engine.onMouseUp.forEach(e=>{
                e();
            });        
        }
        else
        {
            Engine.onMouseUp.forEach(e=>{
                e();
            });
        }
    }
    keyState["mouse"]=false;
} 

function mouseDown(e){ 
    if(ismobile)
    {
        return;
    }
    setMousePos(e); 
    keyState["mouse"]=true;    
    let temp = onhovercheck();
    if(temp!=null )
    {
        if(temp.onclickdown != null)temp.onclickdown();
    }
    else
    {
        if(currentGameState==gameStates.game)
        {
            Engine.onClick.forEach(element => {                
                element.onClick();               
            });
        }       
    }

    mouseStart = mousePos.slice();
    gesture_start = Date.now();  
}

function setMousePos(e,touch=false)
{
    let tx,ty;
    if(touch)
    {
        tx = e.touches[0].clientX;
        ty = e.touches[0].clientY;              
    }
    else
    {
        tx = e.clientX;
        ty = e.clientY;    
    }
    let mpx = ((tx-canvasOffset.x) / (canvasOffset.xx-canvasOffset.x))*cavMain.width;
    let mpy = ((ty-canvasOffset.y) / (canvasOffset.yy-canvasOffset.y))*cavMain.height;
    mousePos[0] = mpx;
    mousePos[1] = mpy;
}






