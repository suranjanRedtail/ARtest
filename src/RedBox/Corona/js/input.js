var keyState = [];
var mousePos = [0,0];

var mouseStart = [];
var gesture_start = 0;


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
            player_entity.pause_flag = false;
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
        if(currentGameState==gameStates.game)
        {
            if(currentGameState==gameStates.game)
            {
            }
        }       
    }

    mouseStart = mousePos.slice();
    gesture_start = Date.now();  
}



function mouseUp(e){    
    let gesture_time = Date.now() - gesture_start;    
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
        else
        {
            Engine.onMouseUp.forEach(e=>{
                e();
            });
        }
    }
    else
    {
        Engine.onMouseUp.forEach(e=>{
            e();
        });
    }

    keyState["mouse"]=false;
}





