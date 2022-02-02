window.getArrayFromRange = (Lower,Higher) => {
    if(Lower<Higher)
    {
        let temp = [];
        for(let i=Lower;i<=Higher;i++)
        {
            temp.push(i);
        }
        return temp;
    }
    else
    {
        console.log("stop being a Pepega :/");
    }    
};
//draw calls
(function () {
    var DrawCall =[];
    var context;

    function setContext(cxt)
    {
        context = cxt;
    }
    function draw(call , order)
    {
        DrawCall.push( {call : call, order:order});        
    }

    function renderDrawCalls(){
        DrawCall.sort((a,b)=>a.order - b.order);
        DrawCall.forEach( (x) => {
            var {call}=x;
            call(context);            
        });
        DrawCall =[];
    }

    window.Rendering = {
        draw :draw,
        renderDrawCalls : renderDrawCalls,
        setContext : setContext,
    }
})();

window.draw = (entity) => {
    window.Rendering.draw(entity.draw,entity.order);
};
window.drawCall = (call,order) =>{
    window.Rendering.draw(call,order);
}

//resources
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
(function () {

    var resourcesloadedcount=0;
    var resourcescount=0;
    var loaded_Resources = [];
    var callBacks = [];
    var loadnext = true;
     
    function load(urlOrArray,mode=true)
    {
        if(urlOrArray instanceof Array)
        {
            window.resources.resourcescount += window.resources.resourcescount==0? urlOrArray.length:0;
            
            urlOrArray.forEach(e=>{
                _load(e,0,false);
            })
                                          
        }            
        
    }

    function _load(urlArray,index,mode="true")
    {
        let url;
        if(mode)
        {
         url = urlArray[index];
        }
        else
        {
            url = urlArray;
        }

        if(loaded_Resources[url])
        {
            return loaded_Resources[url];
        }        
        else
        {
            var tempimp;
            let loadaudio = () => {
                let timeout = 0;          
                
                if(iOS)
                {   
                    /*tempimp.addEventListener("loadedmetadata", 
                    ()=>{
                        window.resources.resourcesloadedcount +=loaded_Resources[url]?0:1;
                        loaded_Resources[url] = tempimp;
                    }); */

                    setTimeout( ()=>{
                    window.resources.resourcesloadedcount +=loaded_Resources[url]?0:1;
                    loaded_Resources[url] = tempimp;}
                    ,1000); 
                }
                else
                {
                let tinterval = setInterval( ()=>{
                    timeout += 100;
                    if(tempimp.readyState >=2)
                    {
                        window.resources.resourcesloadedcount +=loaded_Resources[url]?0:1;
                        loaded_Resources[url]=tempimp;                        
                        clearInterval(tinterval);
                        console.log(tempimp.readyState,tempimp.src,timeout/1000);
                    }
                    if(timeout> 25000)
                    {
                        console.log("Timeout! "+tempimp.src+" wasn't loaded.");
                        //document.location.reload();
                        clearInterval(tinterval);
                    }                                      
                },500); 
                }                             
            }
        
            let loadimage = () => {
                tempimp.onload = function(){
                    window.resources.resourcesloadedcount +=loaded_Resources[url]?0:1;
                    loaded_Resources[url] =loaded_Resources[url]? loaded_Resources[url]:tempimp;   
                }
            }
            let turl = url.slice(-3).toLowerCase();


            switch(turl)
            {
                case "png":
                case "bmp":
                case"jpg":
                    tempimp = document.createElement("img");
                    loadimage();
                break;
                case "mp3":
                case"ogg":
                case"wav":                    
                    tempimp = new Audio();
                    loadaudio();
                break;
                default:
                     tempimp = new Image();
                     loadimage();
                break;
            }
            
            loaded_Resources[url]= false; 
            tempimp.src = url;
        }
    }

    function get(url)
    {
        return loaded_Resources[url];
    }

    function addcallback(callback)
    {
        callBacks.push(callback);
    }

    function isready()
    {
        var ready = true;
        for(var k in loaded_Resources)
        {
            if(loaded_Resources.hasOwnProperty(k) &&
               !loaded_Resources[k]) {
                ready = false;
            }
        }
        return ready;
    }

    window.resources= {        
        load : load,
        get : get,
        addcallback : addcallback,
        isready : isready,
        resourcesloadedcount : resourcesloadedcount,
        resourcescount : resourcescount,
        loaded_Resources : loaded_Resources,
    };
}());

//pause during visibility change
var onGameVisibilityChangePause = ()=>{};
document.addEventListener("visibilitychange", function() {
    let bg = window.resources.get(images.BG);
    
    if(document.hidden && currentGameState== gameStates.game)
    {
        currentGameState = gameStates.pause;
        onGameVisibilityChangePause();
        loadpauseUI()
    }   
    if(document.hidden){
        if(bg==null)
        {
        return;
        }
        bg.pause();
    } 
    if(!document.hidden)
    {
        last_time=Date.now();
    }
});

//Physics Functions
(function ()
{
  function checkCollision(obj1,obj2)
  {
    if(obj1.enabled && obj2.enabled){
    if(obj1 instanceof Entity && obj1 instanceof Entity){
        if(obj1.pos.x < obj2.pos.x + obj2.size.x && obj1.pos.x + obj1.size.x > obj2.pos.x &&
            obj1.pos.y < obj2.pos.y + obj2.size.y && obj1.pos.y + obj1.size.y > obj2.pos.y)
        {       
            return true;
        }
    }
    }
        return false;
  }

  function checkCollisionPoint(element,{x,y})
  {
    if(element.pos.x < x && element.pos.x + element.size.x > x &&
        element.pos.y < y && element.pos.y + element.size.y > y )
        {
            return true;
        }
        return false;
  }

  function checkCollisionCircle(obj1,obj2)
  {
      if(obj1 instanceof Entity && obj1 instanceof Entity)
      {
        let dist = Math.sqrt(Math.pow( obj1.center.x - obj2.center.x,2) + Math.pow( obj1.center.y - obj2.center.y,2));
        if( dist <= obj1.radius + obj2.radius)
        {
            return true;
        }
      }
      return false;
  }

  function checkOverlapX_Length(obj1,obj2)
  {
    if(checkCollision(obj1,obj2))
    {       
        if(obj1.pos.x <= obj2.pos.x)
        {
           return Math.abs(obj1.pos.x - obj2.pos.x + obj1.size.x); 
        }
        else if(obj1.pos.x > obj2.pos.x)
        {
            return Math.abs(obj2.pos.x - obj1.pos.x + obj2.size.x);
        }
    } 
    return -1; 
  }

  window.Physics = {
    checkCollisionPoint : checkCollisionPoint,
    checkCollision : checkCollision,
    checkOverlapX_Length : checkOverlapX_Length,
    checkCollisionCircle : checkCollisionCircle,
  }
}
)();

class Sprite 
{
    constructor(image, posX=0, posY=0, width=0, height=0) {
        this.ispixel = false;
        if(typeof image == "string")
        {
            this.image = window.resources.get(image);             
        }
        else
        {
            this.image = image;            
        }
        this.posX = posX;
        this.posY = posY;
        if(width ==0)
        {
            this.width = this.image.width;
            this.height = this.image.height;
        }
        else
        {
        this.width = width;
        }
        if(height ==0)
        {
            this.height = this.image.height;
        }
        else
        {
        this.height = height;
        }
        this.draw = (context, x, y, w, h) => 
        {
            context.imageSmoothingEnabled = !this.ispixel;
            context.drawImage(this.image, this.posX, this.posY, this.width, this.height, x, y, w, h);
        };

        this.update = () =>
        {

        };
    }
}

function SpriteAnimation(image,posX,posY,keyframes,width,height,rate,speed)
{
    this.ispixel = false;
    if(typeof image == "string")
    {
        this.image = window.resources.get(image);             
    }
    else
    {
        this.image = image;            
    }
    this.keyframes = keyframes;    
    this.width = width;
    this.height = height;
    this.rate = rate;    
    this.posX = posX;
    this.posY = posY;
    this.speed = speed;

    this.currentframe = 0;
    this.currentframe_modded = 0;
    this.play = true;
    this.done = false;
    this.loop = true;
    
    this.update = () => {
        if(this.play && !this.done)
        {
        this.currentframe += this.rate * dt * this.speed;
        this.currentframe_modded = this.currentframe % this.keyframes.length;
        }
    }
    this.draw = (context, x, y, w, h) => { 
        if(!this.done){
            
        context.imageSmoothingEnabled = !this.ispixel;

        let _frame = Math.floor(this.currentframe);        
        if(!this.loop && this.currentframe >= keyframes.length)
        {
            _frame = this.keyframes.length-1;
            this.done = true;
        }
        _frame = _frame % this.keyframes.length;
        
        let tpos = {x:this.posX,y:this.posY};
        tpos.x= this.keyframes[_frame] * width;
        context.drawImage(this.image,tpos.x,tpos.y,this.width,this.height,x,y,w,h);
    }
    };

    this.Play=()=>{
        this.play = true;
    }
    this.pause=()=>{
        this.play = false;
    }

    this.toggle = () =>{this.play = !this.play;}; 
    
    this.reset = () => {
        this.currentframe =0;
        this.done = false;
    }
}

function Entity(sprite,sizeX=0,sizeY=0,ui=false)
{
    if(sprite instanceof Sprite || sprite instanceof SpriteAnimation)
    {
        this.sprite = sprite;
        
    }
    else if(sprite!=null)
    {
        this.sprite = new Sprite(sprite,0,0,0,0);
    }
    this.ui = ui;
    this.pos = {x:0,y:0};
    this.order = 0;
    this.enabled = true;
    this.opacity = 1;
    this.size =
        {
            x:0,
            y:0,
        }

    if(sizeX==0)
    {
        this.size.x = this.sprite.width;
            
    }
    else
    {
    this.size.x = sizeX;
    }

    if(sizeY==0)
    {
        this.size.y =this.sprite.height;
    }
    else
    {
    this.size.y = sizeY;
    }

    this.updateMain = () => 
    {
        if(this.enabled){
            if(sprite!=null){
                this.sprite.update();
            }
        
        this.update();
        }
    };
    this.update =()=>{};

    this.init = () =>{};

    this.draw = (context) =>
    {
        if(this.enabled && !this.done){
            if(this.opacity<1)
            {
                context.save();
                context.globalAlpha = this.opacity;
            }
            else if(this.opacity<=0)
            {
                return;
            }
            if(this.ui)
            {
            this.sprite.draw(context,this.pos.x,this.pos.y,this.size.x,this.size.y);       
            }
            else{            
                this.sprite.draw(context,this.pos.x- mainviewport.posx,this.pos.y- mainviewport.posy,this.size.x,this.size.y);  
            } 
            if(this.opacity!=1)
            {
                context.restore();
            }     
        }
    }

    this.setOrder = (order) => {
        this.order = order;
    };
    this.setSprite = (sprite) => {
        if(this.sprite instanceof Sprite)
        {
        if(typeof sprite == "string")
        {
        this.sprite.image = window.resources.get(sprite);
        }
        else if(sprite instanceof Sprite)
        {
            this.sprite.image = sprite;
        }
    }
    else
    {
        this.sprite = new Sprite(sprite,0,0,0,0);
    }
    }
}

class Button extends Entity
{
    constructor(sprite,sizeX,sizeY)
    {
        super(sprite,sizeX,sizeY);
        this.onhover =()=>{};
        this.onclick = () => {};
        this.order = 10;
        this.ui =true;        
    }
}

class ViewPort {
    constructor(posx,posy,width,height)
    {
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
        this.zoomValue = 1;
        this.xmin = this.posx,
        this.xmax = this.posx+this.width;
        this.ymin = this.posy,
        this.ymax = this.posy+this.height;
        this.target = null;
        this.targetoffset = null;
        this.lock_x = false;
        this.lock_y = false;
        this.update_fns = [];
        this.update = () => {
            this.update_fns.forEach(e=>{
                e();
            });

            if(this.target!=null)
            {             
                let dx = (this.target.pos.x - this.targetoffset[0]) - this.posx; 
                let dy = (this.target.pos.y - this.targetoffset[1]) - this.posy; 
                if(!this.lock_x)
                {
                this.posx += Math.abs( dx)<=1? dx:  dx * 0.1;
                }
                if(!this.lock_y)
                {
                this.posy += Math.abs( dy)<=1? dy:  dy * 0.1;
                }
            }
            this.xmin = this.posx,
            this.xmax = this.posx+ this.width;
            this.ymin = this.posy,
            this.ymax = this.posy+this.height;
        }

        this.set_target = (target) => {
            this.target = target;
            this.targetoffset = [ target.pos.x - this.posx , target.pos.y - this.posy];
        }
    }
}

var onhoverlist = [];

function onhovercheck(posX = mousePos[0],posY = mousePos[1]) {
    let templist = [];
    onhoverlist.forEach(element => {
        if(element.pos.x < posX && element.pos.x + element.size.x > posX &&
            element.pos.y < posY && element.pos.y + element.size.y > posY )
            {
                templist.push(element);
            }
    });
    templist.sort((a,b)=> b.order-a.order);    
    return templist[0]; 
}

clamp = (num,min,max)=>
{
    return Math.min(Math.max(num,min),max);
} 

function playSound(soundtoPlay)
{
    soundtoPlay = window.resources.get(soundtoPlay);
    if(soundtoPlay)
    {
        soundtoPlay.currentTime =0;
        soundtoPlay.play();
    }
}

var Engine={};
Engine.minGestureDistance = 100;
Engine.minGestureTime = 50;
Engine.onSwipeUp = [];
Engine.onSwipeDown = [];
Engine.onSwipeLeft = [];
Engine.onSwipeRight = [];
Engine.onSwipe = [];
Engine.onMouseUp = [];
Engine.onClick =[];
Engine.timeScale = 1;

function drawCircle(radius,center)
{
    cxt.beginPath();
    cxt.arc(center.x - mainviewport.posx,center.y-mainviewport.posy,radius,0,Math.PI*2);
    cxt.strokeStyle ="#FF0000";
    cxt.lineWidth = 5;
    cxt.stroke();
}

window.addEventListener("load",function() {
    setTimeout(function(){
        window.scrollTo(0, 1);
    }, 0);
});

var cavMain = document.getElementById("main_canvas");
var cav = document.createElement("canvas");
cavMain.style.width = "100%";
cavMain.style.height = "100%";
var cxt = cav.getContext("2d");

var game_orientation = 0;

//resizing canvas
cav.width = game_orientation==0?720:1280;
cav.height = game_orientation==0?1280:720;

cavMain.width = game_orientation==0?720:1280;
cavMain.height = game_orientation==0?1280:720;



const gameStates ={   
    menu:0,
    game:1,
    gameover:2,
    pause:3, 
    orientation:4, 
}



//game state initilization
var currentGameState;

//Object containing names of resources
var images = {
    Logo : "./assets/sprites/Title.png",
    Playbutton : "./assets/sprites/play.png",
    Pause : "./assets/sprites/pause.png",
    Playagain : "./assets/sprites/playagain.png",
    resume : "./assets/sprites/resume.png",
    blackdrop : "./assets/sprites/backdrop.png",
    board : "./assets/sprites/board.png",    
    Help_animation : "./assets/sprites/animations/512_512.png",
    Background : "./assets/sprites/bg.png",
    P_L : "./assets/sprites/P_L.png", 
    help : "./assets/sprites/help.png",
    
    player : "./assets/sprites/neta.png",
    corona : "./assets/sprites/corona.png",
    corona2 : "./assets/sprites/corona2.png",
    explosion : "./assets/sprites/explosion.png",

    BG : "./assets/sound/BG.mp3", 
    GameOver : "./assets/sound/game_over.wav",
    coin : "./assets/sound/coin.wav",
    shoot : "./assets/sound/shoot.mp3",
    t1 :"./assets/sound/T1.mp3",
    t2 :"./assets/sound/T2.mp3",
 };


let resources_paths = [];
for (let [key, value] of Object.entries(images)) {
    resources_paths.push(value);
}

let y = document.createElement("img");
y.src = "./assets/sprites/Splash.png";


y.onload = () => {   
    let ratio = y.width/y.height;
    let nwidth = ratio * cavMain.height;

    window.resources.load(resources_paths,false);

    let counter =0;
    let timeoutcounter =0;
    let tempcxt = cavMain.getContext('2d');
    
    //address bar hide hack
    window.scrollTo(0,1);

    delay_interval = setInterval(() => {
        timeoutcounter += 10;
        if(counter>=2000 && resources.resourcesloadedcount == resources.resourcescount)
        {
            clearInterval(delay_interval);
            init();
        }   
        else
        {    
        tempcxt.fillStyle ="#FFFFFF"; 
        tempcxt.fillRect(0,0,cavMain.width,cavMain.height);
        tempcxt.drawImage(y,cavMain.width/2 - nwidth/2,0,nwidth,cavMain.height);
        tempcxt.fillStyle = "#ff0000";
        let delta =  (resources.resourcesloadedcount/resources.resourcescount)< counter/2000?(resources.resourcesloadedcount/resources.resourcescount):counter/2000;
        tempcxt.fillRect(0,cavMain.height-10, delta*cavMain.width,10);
        tempcxt.fillStyle = "#000000";
        tempcxt.font =  "BOLD 30px Roboto"
        tempcxt.fillText(Math.ceil( delta*100) + "%",cavMain.width*0.88,cavMain.height - 25);
        counter += counter<2000?10:0;                
        }
    }, 10);    
};

//game properties
var game_properties ={  
    game_time :0,
    Score : 0,
    TrueScore :0,
    real_score : 0,
    player_speed : 300,
    fire_rate : 2,

    debug_mode : false,
}


var game_properties_initial = Object.assign({},game_properties);

//dt related variables
var last_time = Date.now();
window.dt = 0;

//Entity List
var entitylist = [];
var uiEntityList = [];
var oldmousestate = false;
var previoustate;


//player 
var player_entity;
var mainviewport;

var timer = 0;
var nexttimer =2;


var text_color = "#ffffff";
var outline_color = "#000000";
var score_color = "#ffffff";


//mainmenu
function loadmainmenu(){

      
        let y = new Entity(images.Logo,0,0,true);
        let y2 = new Button(images.Playbutton,0,0);
    
        y.pos.x= cav.width/2 - y.size.x/2;
        y.pos.y=150;    
    
        y2.pos.x=cav.width/2 - y2.size.x/2;
        y2.pos.y=cav.height * 0.85 - y2.size.y;
    
        y2.onclick = () => {       
            clearUI();
            loadgameUI();
            currentGameState = gameStates.game;
            help.timer = 0;  
            help.enabled = true; 
            setTimeout( ()=>{
                resources.get(images.BG).currentTime=0;
                resources.get(images.BG).loop = true;
                resources.get(images.BG).play();}
                ,50);            
        };    
        uiEntityList.push(y);
        uiEntityList.push(y2); 
      
      
}

function loadgameUI(){
    let y = new Button(images.Pause,70,70);
    y.pos.x = 35;
    y.pos.y = 20;

    y.onclick = () => {
        clearUI();
        loadpauseUI();
        resources.get(images.BG).pause();
        currentGameState = gameStates.pause;
    }
    uiEntityList.push(y);
}

function loadpauseUI() {

    let y2 = new Button(images.resume,0,0);
    let y = new Entity(images.blackdrop,cav.width,cav.height,true);
    let y3 = new Entity(images.board,600,600,true);
    y.order = 1;
    y3.order = 1.1;

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.85 - y2.size.y;

    y3.pos.x=cav.width/2 - y3.size.x/2;
    y3.pos.y=cav.height * 0.1;

    y2.onclick = () => {
        clearUI();
        loadgameUI();
        player_entity.pause_flag=true;

        resources.get(images.BG).play();
        currentGameState = gameStates.game;
    }
    uiEntityList.push(y);
    uiEntityList.push(y2);
    uiEntityList.push(y3);
}

function gameOver() {      
    clearUI();
    currentGameState = gameStates.gameover;
    let y = new Entity(images.blackdrop,cav.width,cav.height,true);
    let y3 = new Entity(images.board,600,600,true);
    let y2 = new Button(images.Playagain,0,0);
    y.order = 1;
    y3.order = 1.1;

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.85 - y2.size.y;

    y3.pos.x=cav.width/2 - y3.size.x/2;
    y3.pos.y=cav.height * 0.1;

    y2.onclick = () => {
        clearUI();
        resetgame(); 
        loadgameUI(); 
        help.timer = 0;  
        help.enabled = true;   
    }    
    uiEntityList.push(y2);
    uiEntityList.push(y);    
    uiEntityList.push(y3);     
}

function clearUI(){
    while(uiEntityList.length !=0)
    {
        uiEntityList.pop();
    }
}

function resetgame() {
    currentGameState = gameStates.game;
    game_properties = Object.assign({},game_properties_initial);

    entitylist =[];

    mainviewport.posx = 0;
    player_entity.posTrue = {x:0,y:0};
    player_entity.posOffset = {x:42,y:420};    
    
    next_obs = cav.width + 500;
    
    entitylist.push(player_entity);    
}

//Initilization function
function init()
{
    uiEntityList = onhoverlist;
    mainviewport = new ViewPort(0,0,cav.width,cav.height);

   

    player_entity = new Player();

    entitylist.push(player_entity); 


    entitylist.forEach((_ent)=>{
        _ent.init();
    })


    Rendering.setContext(cxt);

    currentGameState = gameStates.menu;
    loadmainmenu();
    
    var helpAnimation = new Sprite(images.help,0,0); 
    help = new Entity(helpAnimation,0,0,true);
    help.order = 3;
    help.timer = 0;
    help.update = ()=> {
        if(help.timer>=3)
        {
            help.enabled=false;
        }
        help.timer += dt;
    }
    help.pos.x = cav.width/2 - help.size.x/3;
    help.pos.y = cav.height/2 - help.size.y/2;
    
    main();
}

//main game loop
var main = () =>{
    let now = Date.now();
    dt = (now - last_time)/1000;
    last_time = now;
    dt *= Engine.timeScale;
  
    checkOrientation();
    
    DrawBackground();

    switch(currentGameState)
    {   
        case gameStates.menu:  
            game_properties.game_time += dt;        
            break;

        case gameStates.game:            
            timer += dt;
            game_properties.game_time += dt; 
            //game_properties.TrueScore += dt *5;
            //game_properties.Score = Math.floor(game_properties.TrueScore);

            if(timer > nexttimer)
            {
                let type = Math.random()<0.9;
                let twall =new Wall(type);
                twall.pos.y =-twall.size.y;
                twall.pos.x = (cav.width-twall.size.x) *Math.random();
                entitylist.push(twall);

                timer =0;
                nexttimer=  0.5*(Math.random()+1);
            }            
            


            entitylist.forEach(e=>{
                e.updateMain();
                window.draw(e);
            });            
            mainviewport.update(); 

            window.drawCall(()=>{
                cxt.textAlign = "end";
                cxt.strokeStyle = outline_color;             
                cxt.font = "bold 70px GameFont";   
                cxt.lineWidth = 8;         
                cxt.strokeText(game_properties.Score,cav.width-60,95);
                cxt.fillStyle = score_color;
                cxt.font = "bold 70px GameFont";
                cxt.fillText(game_properties.Score,cav.width-60,95);  
                cxt.textAlign = "start";
                },2);
           
            

            help.updateMain();
            window.draw(help);

            

            break;
        case gameStates.pause:

            entitylist.forEach(e=>{
                window.draw(e);
            });

            window.drawCall(()=>
            {            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center";                    
            cxt.font = "70px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + 550/2 );
            cxt.font = "70px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + 550/2 + 70);
            cxt.textAlign = "start"; 
            },2);
            
            
            window.draw(help);

            break;
        case gameStates.gameover: 
        
        //game_properties.game_time += dt;  

        mainviewport.update();  

        entitylist.forEach(e=>{
            //e.updateMain();
            window.draw(e);  
                        
        });

        window.drawCall(()=>
            {
            cxt.font = "70px GameFont";            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center"; 
            cxt.fillText("GAME OVER",cav.width/2,(cav.height * 0.1) + 500/2-30);
            cxt.fillStyle = text_color; 
            cxt.font = "70px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + 500/2 + 50 );
            cxt.font = "70px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + 500/2 + 120);
            cxt.textAlign = "start"; 
            },2);

            break;
        case gameStates.orientation:
            window.drawCall(()=>{
            cxt.fillStyle = "#ffffff";
            cxt.fillRect(0,0,cav.width,cav.height);
            cxt.drawImage(resources.get(images.P_L),0,0,resources.get(images.P_L).width*2,resources.get(images.P_L).height/2);
            },11);
            break;
        default:         
        break;       
    }
    
    uiEntityList.forEach(e=>{
        window.draw(e);
    });

    entitylist= entitylist.filter(e=>{
        if(e.enabled)
        {
            return e;
        }
    })

    oldmousestate = keyState["mouse"];


    Rendering.renderDrawCalls();
    
    cavMain.getContext("2d").drawImage(cav,0,0,cavMain.width,cavMain.height);

    keyStateOld = JSON.parse(JSON.stringify(keyState));
    
    requestAnimationFrame(main);  
};


class Player extends Entity{
    constructor()
    {
        let playeranim = new SpriteAnimation(images.player,0,0,[0,1,2,3,4,5,6,7],200,200,12,1);
        super(playeranim);
        this.sprite.ispixel=true;
        this.Collider = new Entity(null,42,54);
        this.Collider.posoffset = {x:33,y:27};
        this.fire_timer=0;
        this.pos.x = cav.width/2 - this.size.x/2;
        this.pos.y = cav.height - this.size.y*1.5;
        this.pause_flag = false;
        this.target_location_x = this.pos.x;
        this.target_location_y = this.pos.y;

        this.update = ()=>{
            this.fire_timer+=dt;
            if(this.fire_timer> (1/game_properties.fire_rate))
            {
                this.fire();
                this.fire_timer=0;
            }

            if(!this.pause_flag)
            {
                this.target_location_x = mousePos[0]-this.size.x/2;
            }           
            
            let delta_x = this.target_location_x -this.pos.x;
            if(  Math.abs(delta_x)>1)
            {
                let delta = delta_x * 0.1;
                this.pos.x += Math.abs(delta)>this.speed*dt?this.speed*dt*Math.sign(delta_x):delta;

            }
            else
            {
                this.pos.x = this.target_location_x;
            } 

            let delta_y = this.target_location_y -this.pos.y;
            if(  Math.abs(delta_y)>1)
            {
                let delta = delta_y * 0.1;
                this.pos.y += Math.abs(delta)>this.speed*dt?this.speed*dt*Math.sign(delta_y):delta;

            }
            else
            {
                this.pos.y = this.target_location_y;
            } 

            this.pos.x = clamp(this.pos.x,-this.size.x/2,cav.width-this.size.x/2);
        }
        this.fire = ()=>{
            resources.get(images.shoot).currentTime=0;
            resources.get(images.shoot).play();
            let tbullet = new bullet();
            tbullet.pos.x = this.pos.x + 120;
            tbullet.pos.y = this.pos.y +6;
            entitylist.push(tbullet);
            this.pos.y += 10;
        }
    } 

    get collider() {
        this.Collider.pos.x = this.pos.x + this.Collider.posoffset.x;
        this.Collider.pos.y = this.pos.y + this.Collider.posoffset.y;

        return  this.Collider;
    }  
}

class Wall extends Entity{
    constructor(type=true)
    {
        let coronaAnim = new SpriteAnimation(type?images.corona:images.corona2,0,0,[0,1,2,3,4,5,6,7,8,9,10,11],50,50,12,1);
        super(coronaAnim);
        this.count = type?1:2;
        this.ocount =type?10:20;
        this.sprite.ispixel=true;
        this.speed = game_properties.player_speed *(1 + Math.sin(Math.random()*Math.PI*2)*0.2);

        this.size = {x:100,y:100};
        //this.Collider = new Entity(null,240,93);
        //this.Collider.posoffset = {x:0,y:0};
        
        this.update = () =>{
            this.pos.y += this.speed * dt;

            if(this.pos.y > cav.height)
            {
                this.enabled = false;
                gameOver();
                resources.get(images.GameOver).currentTime=0;
                resources.get(images.GameOver).play();
            }

            entitylist.forEach(e=>{
                if(e instanceof bullet)
                {
                    if(window.Physics.checkCollision(this.collider,e.collider))
                    {
                        this.count--;
                        e.enabled=false;
                        let rsound = Math.random()>0.5? images.t1:images.t2;
                        resources.get(rsound).currentTime=0;
                        resources.get(rsound).play();
                    }
                }
            })

            if(this.count<=0)
            {
                this.enabled=false;
                entitylist.push(new Explosion(Object.assign({},this.pos)));

                game_properties.Score += this.ocount;  
                resources.get(images.coin).currentTime=0;
                resources.get(images.coin).play();              
            }
            
            // if(window.Physics.checkCollision(this.collider,player_entity.collider) && this.enabled)
            // {
            //     gameOver();
            //     resources.get(images.GameOver).currentTime=0;
            //     resources.get(images.GameOver).play(); 
            // }             
        }         
    }

    get collider() {
        //this.Collider.pos.x = this.pos.x + this.Collider.posoffset.x;
        //this.Collider.pos.y = this.pos.y + this.Collider.posoffset.y;

        return  this;
    }  
}

class bullet extends Entity
{
    constructor()
    {
        super(null,10,10);   
        this.speedy = -500;
        this.update = ()=>{
            this.pos.y += dt * this.speedy;
            if(this.pos.y <= -this.size.y || this.pos.y >= cav.height)
            {
                this.enabled = false;
            }
        }

        this.draw =(context)=> {
            context.fillStyle = "#ecaa4c";
            context.beginPath();
            context.arc(this.pos.x+this.size.x/2,this.pos.y+this.size.y/2,this.size.x/2,0,2 * Math.PI);
            context.fill();
            context.lineWidth =1;
            context.strokeStyle = "#000000";
            context.stroke();
            context.closePath();
        }
    }
    get collider() {
        return this;
    }
}

class Explosion extends Entity{
    constructor(pos)
    {
        let explosionAnim = new SpriteAnimation(images.explosion,0,0,[0,1,2,3,4,5,6,7,8,9,10],50,50,24,1);
        super(explosionAnim,100,100);  
        this.sprite.loop = false; 
        this.sprite.ispixel=true;
        this.pos=pos;
        this.speedy = -500;
        this.update = ()=>{
            if(this.sprite.done)
            {
                this.enabled = false;
            }
        }
    }
    
   
}

function DrawBackground()
{     
    let b0 = resources.get(images.Background); 
    
    window.drawCall(
        ()=>{ 
            cxt.drawImage(b0,0,0,b0.width,b0.height);     
    },-2);
     
}

function checkOrientation() {
    if(game_orientation == 0)
    {
        return;
    }
    
    if(window.innerWidth < window.innerHeight && currentGameState != gameStates.orientation){
        previoustate = currentGameState;
        currentGameState = gameStates.orientation;        
    }
    else if(currentGameState == gameStates.orientation && window.innerWidth > window.innerHeight)
    {
        currentGameState = previoustate;
        clearUI();
        switch(currentGameState)
        {
            case gameStates.menu:
                loadmainmenu();
                break;
            case gameStates.pause:
                loadpauseUI();
                break;
            case gameStates.game:
                loadgameUI();
                break;
            case gameStates.gameover:
                gameOver();
                break;
            default:
                loadgameUI();
                break;
        }      
    }
}
onGameVisibilityChangePause = ()=>{
}

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





