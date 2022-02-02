var cavMain = document.getElementById("main_canvas");
var cav = document.createElement("canvas");
cavMain.style.width = "100%";
cavMain.style.height = "100%";
var cxt = cav.getContext("2d");


//resizing canvas
cav.width = 1280;
cav.height = 720;

cavMain.width = 1280;
cavMain.height = 720;



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
    GameOver : "./assets/sound/game_over.wav",
    board : "./assets/sprites/board.png",    
    Help_animation : "./assets/sprites/animations/512_512.png",
    Background : "./assets/sprites/bg.png",
    P_L : "./assets/sprites/P_L.png",

    clouds : "./assets/sprites/clouds.png",
    p1 : "./assets/sprites/paralex-1.png",
    player :"./assets/sprites/player_320.png",   
    coin : "./assets/sound/coin.wav",      
    BG : "./assets/sound/BG.mp3", 
    hills : "./assets/sprites/hills_409.png",
    fuel :"./assets/sprites/fuel.png",
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
    Score:0,
    game_time :0,
    player_speed : 200,
    max_fuel : 100,
    remaining_fuel : 100,    
    unit_scale : 10,
    fuel_rate : 12,
    fuel_acceleration:20,
    pickup_amount : 50,
    fuel_chance : 0.4,

    debug_mode : false,
}



var game_properties_initial = Object.assign({},this.game_properties);

//dt related variables
var last_time = Date.now();
window.dt = 0;

//Entity List
var entitylist = [];
var uiEntityList = [];
var oldmousestate = false;
var previoustate;
var lasthill = null;

//player 
var player_entity;
var mainviewport;

var hillsprites;

var timer = 0;
var nexttimer =2;

var text_color = "#F6D121";
var pause_text_color = "#0D346E";




//mainmenu
function loadmainmenu(){

      
        let y = new Entity(images.Logo,0,0,true);
        let y2 = new Button(images.Playbutton,0,0);
    
        y.pos.x= cav.width/2 - y.size.x/2;
        y.pos.y=150;    
    
        y2.pos.x=cav.width/2 - y2.size.x/2;
        y2.pos.y=cav.height * 0.85 - y2.size.y;
    
        y2.onclick = () => {
            setTimeout(() => {
                resources.get(images.BG).play();
            }, 200);        
            clearUI();
            loadgameUI();
            currentGameState = gameStates.game;
            help.timer = 0;  
            help.enabled = true; 
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
        currentGameState = gameStates.pause;
    }
    uiEntityList.push(y);
}

function loadpauseUI() {

    let y2 = new Button(images.resume,0,0);
    let y = new Entity(images.blackdrop,cav.width,cav.height,true);
    let y3 = new Entity(images.board,0,0,true);
    y.order = 1;
    y3.order = 1.1;

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.85 - y2.size.y;

    y3.pos.x=cav.width/2 - y3.size.x/2;
    y3.pos.y=cav.height * 0.1;

    y2.onclick = () => {
        clearUI();
        loadgameUI();
        currentGameState = gameStates.game;
    }
    uiEntityList.push(y);
    uiEntityList.push(y2);
    uiEntityList.push(y3);
}

function gameOver() {      
    clearUI();
    resources.get(images.GameOver).currentTime =0;
    resources.get(images.GameOver).play();
    currentGameState = gameStates.gameover;
    let y = new Entity(images.blackdrop,cav.width,cav.height,true);
    let y3 = new Entity(images.board,0,0,true);
    let y2 = new Button(images.Playagain,0,0);
    y.order = 1;
    y3.order = 1.1;

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=cav.height * 0.85 - y2.size.y;

    y3.pos.x=cav.width/2 - y3.size.x/2;
    y3.pos.y=cav.height * 0.1;

    y2.onclick = () => {
        clearUI();
        loadgameUI();
        resetgame();  
        resources.get(images.BG).play();    
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

    game_properties = Object.assign({},this.game_properties_initial);

    entitylist =[];
    player_entity.speedy =0;
    player_entity.pos.x = 10;
    player_entity.pos.y = 0;
    mainviewport.posx = 0;
    lasthill = null;
    
    entitylist.push(player_entity);

}

//Initilization function
function init()
{    
    uiEntityList = onhoverlist;
    mainviewport = new ViewPort(0,0,cav.width,cav.height);

    hillsprites = [
        new Sprite(images.hills,0,0,409,285),
        new Sprite(images.hills,409,0,409,285),
        new Sprite(images.hills,2*409,0,409,285)
    ]
    
    player_entity = new Player();

    entitylist.push(player_entity);

    entitylist.forEach((_ent)=>{
        _ent.init();
    })
    
    Rendering.setContext(cxt);

    currentGameState = gameStates.menu;

    loadmainmenu();

    resources.get(images.BG).loop = true;
    resources.get(images.BG).oncanplay = () =>
    {
        try{
        resources.get(images.BG).play();
        }
        catch(e){}        
    };
    
    var helpAnimation = new SpriteAnimation(images.Help_animation,0,0,[0,1,0],500,500,2,1); 
    helpAnimation.loop = true;
    help = new Entity(helpAnimation,0,0,true);
    help.order = 3;
    help.timer = 0;
    help.update = ()=> {
        if(help.timer>=2.2)
        {
            help.enabled=false;
        }
        help.timer += dt;
    }
    help.pos.x = cav.width/2 - help.size.x/2;
    help.pos.y = cav.height/2 - help.size.y/2;
    main();
}

//main game loop
var main = () =>{
    let now = Date.now();
    dt = (now - last_time)/1000;
    last_time = now;

    checkOrientation();
    
    DrawBackground();
    switch(currentGameState)
    {        
        case gameStates.menu:        
        break;
        case gameStates.game:
            mainviewport.update();           
            mainviewport.posx += dt * game_properties.player_speed;
            timer += dt;
            game_properties.game_time += dt;
            game_properties.Score = Math.floor(game_properties.game_time);

            if(timer>nexttimer)
            {
                entitylist.push(new Clouds());
                entitylist[entitylist.length-1].reset();
                nexttimer = 0.5 + Math.random()*0.5;
                timer=0;
            }

            if(lasthill == null)
            {
                let tempHill = new Hill( cav.width/2,Math.floor(Math.random()*3), 1+ Math.random());
                entitylist.push(tempHill);
                lasthill = tempHill;
            }else if(lasthill.nextpos < mainviewport.posx + mainviewport.width)
            {
                let tempHill = new Hill( lasthill.nextpos,Math.floor(Math.random()*3), 1+ Math.random());
                entitylist.push(tempHill);
                lasthill = tempHill; 
            }

            entitylist.forEach(e=>{
                e.updateMain();
                draw(e);
            });

            drawCall(()=>{
                cxt.textAlign = "center";
                cxt.strokeStyle = pause_text_color;             
                cxt.font = "bold 60px GameFont";   
                cxt.lineWidth = 8;         
                cxt.strokeText(game_properties.Score,cav.width-100,95);
                cxt.fillStyle = text_color;
                cxt.font = "bold 60px GameFont";
                cxt.fillText(game_properties.Score,cav.width-100,95);  
                cxt.textAlign = "start";  

                },2);

            
                drawCall(()=>{
                    cxt.strokeStyle = "#0D346E";
                    cxt.lineWidth = 3;
                    cxt.strokeRect( 280,642,764,38);
                    let percent = Math.max( game_properties.remaining_fuel,0)/game_properties.max_fuel;
                    cxt.fillStyle = "#F6D121";
                    cxt.fillRect(284,646,758*percent,28);
                    },0.99);
            

            help.updateMain();
            draw(help);
            break;
        case gameStates.pause:

            entitylist.forEach(e=>{
                draw(e);
            })

            drawCall(()=>
            {            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center";                    
            cxt.font = "60px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 );
            cxt.font = "60px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 70);
            cxt.textAlign = "start"; 
            },2);

            drawCall(()=>{
                cxt.strokeStyle = "#0D346E";
                cxt.lineWidth = 3;
                cxt.strokeRect( 280,642,764,38);
                let percent = Math.max( game_properties.remaining_fuel,0)/game_properties.max_fuel;
                cxt.fillStyle = "#F6D121";
                cxt.fillRect(284,646,758*percent,28);
                },0.99);
            
            
            draw(help);

            break;
        case gameStates.gameover: 

        entitylist.forEach(e=>{
            if(! (e instanceof Player) ){
            e.updateMain();
            draw(e);
            }
        });

        drawCall(()=>
            {
            cxt.font = "60px GameFont";            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center"; 
            cxt.fillText("GAME OVER",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2-30);
            cxt.fillStyle = text_color; 
            cxt.font = "60px GameFont";                    
            cxt.fillText("SCORE",cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 50 );
            cxt.font = "60px GameFont";            
            cxt.fillText(game_properties.Score,cav.width/2,(cav.height * 0.1) + resources.get(images.board).height/2 + 120);
            cxt.textAlign = "start"; 
            },2);

            break;
        case gameStates.orientation:
            drawCall(()=>{
            cxt.fillStyle = "#ffffff";
            cxt.fillRect(0,0,cav.width,cav.height);
            cxt.drawImage(resources.get(images.P_L),0,0,resources.get(images.P_L).width*2,resources.get(images.P_L).height/2);
            },11);
            break;
        default:         
        break;       
    }
    
    uiEntityList.forEach(e=>{
        draw(e);
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

function DrawBackground()
{   
    let p1 = resources.get(images.p1);
    let p1x = - Math.floor(mainviewport.posx/1.5 % p1.width);

    drawCall(()=>{ cxt.drawImage(resources.get(images.Background),0,0,cav.width,cav.height)},-1.9);   

    drawCall(
        ()=>{
        cxt.drawImage(resources.get(images.p1),p1x,cav.height - p1.height,p1.width,p1.height);
        if(p1x + p1.width <= cav.width)
        {
        cxt.drawImage(resources.get(images.p1),p1x+p1.width-1,cav.height - p1.height,p1.width,p1.height); 
        } 
    },-1);    
}

class Player extends Entity{
    constructor(scale=0.7)
    {
        let ts = new SpriteAnimation(images.player,0,0,getArrayFromRange(0,19),320,400,12,1);
        super(ts);
        this.speedy = 0;

        this.size.x *= scale;
        this.size.y *= scale;
        this.order = 0.25;

        this.c = [ [168 * scale,144*scale,122*scale],[172*scale,346*scale,15*scale]];

        this.update = ()=>{
            this.speedy += dt * 5 * game_properties.unit_scale;
            this.pos.x += dt * game_properties.player_speed;
            this.pos.y += dt * this.speedy;
            this.pos.y = Math.max(-this.size.y * 0.7 , this.pos.y);
            if(this.pos.y <= -this.size.y * 0.7 && this.speedy < 0)
            {
                this.speedy =0;
            }
            if(keyState["mouse"] && game_properties.remaining_fuel >0 && this.pos.y >-this.size.y * 0.7 )
            {
                this.speedy -= dt * game_properties.fuel_acceleration * game_properties.unit_scale;
                game_properties.remaining_fuel -= dt * game_properties.fuel_rate;
                game_properties.remaining_fuel = game_properties.remaining_fuel>0?game_properties.remaining_fuel:0;
            }
        }
        this.draw= (context)=> {
            if(this.enabled && !this.done){
                if(this.ui)
                {
                this.sprite.draw(context,this.pos.x,this.pos.y,this.size.x,this.size.y);       
                }
                else{            
                    this.sprite.draw(context,this.pos.x- mainviewport.posx,this.pos.y- mainviewport.posy,this.size.x,this.size.y);  
                }      
            }
            if(game_properties.debug_mode)
            {
            drawcircle( this.radius(0),this.center(0));
            drawcircle( this.radius(1),this.center(1));
            }
        }
        this.center=(index)=>
        {
            return {x:this.pos.x + this.c[index][0] ,y:this.pos.y + this.c[index][1] };
        } 

        this.radius=(index)=>
        {
            return this.c[index][2];
        } 
                
    }    
      
}

class Hill extends Entity{
    constructor(posx,type,scale)
    {
        let ts = hillsprites[type];
        super(ts);
        this.order += Math.floor( Math.random()*4)/6;
        
        this.size.x *= scale;
        this.size.y *= scale;

        this.pos.x = posx;
        this.pos.y = cav.height - this.size.y* 0.9;

        this.nextpos = this.pos.x + (this.size.x * 0.5) + Math.random()*this.size.x*0.5;
        
        this.fuel_pos = [[330*scale +this.pos.x,0*scale +this.pos.y],[50*scale +this.pos.x,20*scale +this.pos.y],[222*scale +this.pos.x,-60*scale +this.pos.y]];

        if(Math.random()<game_properties.fuel_chance)
        {            
            entitylist.push( new Pickup(this.fuel_pos[Math.floor( Math.random() * 3 ) ]));
        }

        this.c1 = [ 222 * scale,
            48 * scale,
            (91/2) * scale];
        
        
        this.c2 = [ 222* scale,
            128* scale,
            (190/2) * scale];
        
        this.c3 = [ 209* scale,
            282 * scale,
            (343/2) * scale];
        

        this.checkCollision = (obj) => {

            for (let index = 0; index < 2; index++) {               
            
            let dist = Math.sqrt(  Math.pow (obj.center(index).x - this.pos.x - this.c1[0],2) + Math.pow (obj.center(index).y - this.pos.y - this.c1[1],2));
            let distmax = this.c1[2] + obj.radius(index);

            if( dist < distmax)
            {
                console.log(0);
                return true;
            }

            dist = Math.sqrt( Math.pow (obj.center(index).x - this.pos.x - this.c2[0],2) + Math.pow (obj.center(index).y - this.pos.y - this.c2[1],2));
            distmax = this.c2[2] + obj.radius(index);

            if( dist < distmax)
            {
                console.log(1);
                return true;
            }

            dist = Math.sqrt( Math.pow (obj.center(index).x - this.pos.x - this.c3[0],2) + Math.pow (obj.center(index).y - this.pos.y - this.c3[1],2));
            distmax = this.c3[2] + obj.radius(index);

            if( dist < distmax)
            {
                console.log(2);
                return true;
            }

            
        }
        return false;
        }

        this.update = () =>{
            if(this.pos.x < mainviewport.posx - this.size.x)
            {
                this.enabled = false;
            }
            if( currentGameState == gameStates.game &&this.checkCollision(player_entity))
            {
                gameOver();
            }
        }

        this.draw = (context) => {
            if(this.enabled && !this.done){
                if(this.ui)
                {
                this.sprite.draw(context,this.pos.x,this.pos.y,this.size.x,this.size.y);       
                }
                else{            
                    this.sprite.draw(context,this.pos.x- mainviewport.posx,this.pos.y- mainviewport.posy,this.size.x,this.size.y);  
                }      
            }
            if(game_properties.debug_mode)
            {
            drawcircle( this.c1[2],{x:this.c1[0]+this.pos.x,y:this.c1[1]+this.pos.y});
            drawcircle( this.c2[2],{x:this.c2[0]+this.pos.x,y:this.c2[1]+this.pos.y});
            drawcircle( this.c3[2],{x:this.c3[0]+this.pos.x,y:this.c3[1]+this.pos.y});
            }
        }
    }

}

class Clouds extends Entity{
    constructor()
    {
        super(images.clouds);
        this.basespeed = 50;
        this.speedx = 50; 
        let order_random_roll =Math.random()*1.6;
        this.order =  -0.9 + order_random_roll;
        order_random_roll /= 0.9;
        order_random_roll += 0.2;
        this.size.x *= order_random_roll;
        this.size.y *= order_random_roll;        

        this.reset = () =>
        {
            this.speedx = this.basespeed * (0.5 + (Math.random()*0.8))
            this.speedx *= Math.random()>0.5? -1:1;
            this.pos.x = mainviewport.posx + mainviewport.width;
            this.pos.y = 0 + Math.random()* cav.height/2;
        }

        this.reset();

        this.update = () => {
            this.pos.x += this.speedx * dt;
            if(this.pos.x < mainviewport.posx - this.size.x)
            {
                this.enabled = false;
            }
        }
    }
}

class Pickup extends Entity
{
    constructor(pos)
    {
        super(images.fuel,49,49);
        this.pos= {x:pos[0],y:pos[1]}; 
        this.order = 0.25;
        this.update = ()=>{
            if(this.pos.x < mainviewport.posx - this.size.x)
            {
                this.enabled = false;
            }

            for (let index = 0; index < 2; index++) { 
                let dist = Math.sqrt(  Math.pow (player_entity.center(index).x - this.center.x,2) + Math.pow (player_entity.center(index).y -  this.center.y,2));
                let distmax = this.radius + player_entity.radius(index);

                if( dist < distmax)
                {
                    game_properties.remaining_fuel = Math.min( game_properties.remaining_fuel+ game_properties.pickup_amount,game_properties.max_fuel);
                    this.enabled = false; 
                    resources.get(images.coin).currentTime =0;
                    resources.get(images.coin).play();
                }
            }

        }
        this.draw = (context) =>{
            if(this.enabled && !this.done){
                if(this.ui)
                {
                this.sprite.draw(context,this.pos.x,this.pos.y,this.size.x,this.size.y);       
                }
                else{            
                    this.sprite.draw(context,this.pos.x- mainviewport.posx,this.pos.y- mainviewport.posy,this.size.x,this.size.y);  
                }      
            }
            if(game_properties.debug_mode)
            {
            drawcircle( this.radius,this.center);
            }
        }
    }

    get center()
    {
        return {x:this.pos.x + this.size.x/2 ,y:this.pos.y + this.size.y/2};
    } 
    get radius()
    {
        return this.size.y/2;
    }  
}

function drawcircle(radius,center)
{
    cxt.beginPath();
    cxt.arc(center.x - mainviewport.posx,center.y-mainviewport.posy,radius,0,Math.PI*2);
    cxt.strokeStyle ="#FF0000";
    cxt.lineWidth = 5;
    cxt.stroke();
}

function checkOrientation() {
    
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