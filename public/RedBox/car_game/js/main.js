var cav = document.getElementById("main_canvas");
cav.focus();
cav.autofocus = true;
var cxt = cav.getContext("2d");
var ui_div = document.getElementById("UI_div");

//resizing canvas
cav.width = 720;
cav.height = 1280;


const gameStates ={
    Menu:0,
    Game:1,
    Pause:2,
    Restart:3,
}

//game state initilization
var currentGameState = gameStates.Menu;

//Object containing names of resources
var images = {
    "Background_1":"./assets/sprites/Road_grassland.png",
    "E_Car_Black":"./assets/sprites/Cars/ECar_Black.png",
    "E_Car_Grey" : "./assets/sprites/Cars/ECar_Grey.png",
    "E_Car_Purple" : "./assets/sprites/Cars/ECar_Purple.png",
    "E_Car_Red" : "./assets/sprites/Cars/ECar_Red.png",
    "P_Car_Black" : "./assets/sprites/Cars/PCar_Black.png",
    "P_Car_Green" : "./assets/sprites/Cars/PCar_Green.png",
    "P_Car_Grey" : "./assets/sprites/Cars/PCar_Grey.png",
    "P_Car_Red" : "./assets/sprites/Cars/PCar_Red.png",
    "Logo" : "./assets/logo.png",
    testanimation:"./assets/sprites/animations/540_167.png",
    linkanimation:"./assets/sprites/animations/288_288.png",
    Car_A0 : "./assets/sprites/Cars/Car_AO.png",
    icon_Pause : "./assets/sprites/Icons/pause.png",
    explosion:"./assets/sprites/animations/128_128.png"
};

const enemyCarSpriteList = [
    images.E_Car_Red,
    images.E_Car_Purple,
    images.E_Car_Grey,
    images.E_Car_Black
];

const playerCarSpriteList = [
    images.P_Car_Red,
    images.P_Car_Black,
    images.P_Car_Green,
    images.P_Car_Grey,
    
];

//Add init as resources load callback
window.resources.addcallback(init);

//Loading resources
window.resources.load([
    images.Background_1,
    images.E_Car_Black,
    images.E_Car_Grey,
    images.E_Car_Purple,
    images.E_Car_Red,
    images.P_Car_Black,
    images.P_Car_Green,
    images.P_Car_Grey,
    images.P_Car_Red,
    images.Logo,
    images.testanimation,
    images.linkanimation,
    images.Car_A0,
    images.icon_Pause,
    images.explosion,
]);

//game properties
var game_properties ={
    background:null,
    bpos:{x:0,y:0},
    bsize:{w:720,h:0},
    background_scroll : true,
    background_scroll_speed : { x:0,y:0},
    enable_shadows:true,
    pause:false,
    playerCar:null,
    playerScore:0,
    game_score_text:null,
}
var last_time = Date.now();
window.dt = 0;

const lanes = [ cav.width * 0.27 , cav.width * 0.5 , cav.width * 0.74 ];
var entitylist = [];

//Player Entity
var player;
var explosion;
//load main menu function
function loadmainmenu(){
    clearUI();
    let logo = window.resources.get(images.Logo);         
    ui_div.appendChild(logo);
    logo.className = "ui_content";
    logo.setAttribute('draggable', false);
    let playbutton = document.createElement("button");
    playbutton.className = "Play_Button";
    playbutton.innerText = "Play";
    ui_div.appendChild(playbutton);

    playbutton.style.width = "400px";
    playbutton.style.height = "100px";

    playbutton.onclick = () =>{
        loadSelectionMenu();                     
    }
    
}

function loadSelectionMenu(){
    clearUI();
        ui_div.style.gridTemplateRows = "auto auto auto auto auto";
        ui_div.style.backgroundColor = "rgba(64, 64, 64, 0.51)";
        let text = document.createElement("text");
        text.className = "Main_text ui_content";
        text.innerText = "Select Car";
        ui_div.append(text);
        playerCarSpriteList.forEach(
            (e)=>{
                let t0= document.createElement("div");
                t0.style.width = "200px";
                t0.style.marginTop = 0;
                t0.className = "CarSelect ui_content";
                t0.append( resources.get(e));
                t0.onclick = () => {
                    player.setSprite(e);
                    player.enabled = true;
                    entitylist.forEach((x)=>{
                        x.initlocation();
                        x.speed = 5;
                    });
                    loadGameUI();
                    game_properties.playerScore = 0;
                    game_properties.background_scroll_speed.y = 1;
                    currentGameState = gameStates.Game;
                };
                ui_div.append(t0);
            }
        )
}

function loadGameUI(){
    clearUI();

    ui_div.style.gridTemplateRows = "auto";
    ui_div.style.gridTemplateColumns ="auto auto";

    let score_text = document.createElement("Text");
    score_text.className = "Score_Text";
    let score = Math.floor(game_properties.playerScore);
    score_text.innerText = ""+score;
    game_properties.game_score_text = score_text;
    ui_div.append(score_text);


    
    let pause = document.createElement("button");
    pause.className = "Play_Button";
    let pause_icon = resources.get(images.icon_Pause);
    pause_icon.width = 50;
    pause_icon.height = 50;
    pause.append(pause_icon);
    pause.style.marginRight="8px";
    pause.style.marginTop="8px";
    pause.style.padding = "0px";
    pause.style.paddingLeft = "5px";
    pause.style.width = 60;
    pause.style.height = 60;

    pause.onclick= () => {
        currentGameState = gameStates.Pause;
        loadPauseUI();
    };
    ui_div.appendChild(pause);

}

function loadPauseUI(){
    clearUI();    
    ui_div.style.gridTemplateColumns = "auto";
    let playbutton = document.createElement("button");
    playbutton.className = "Play_Button";
    playbutton.innerText = "Play";

    playbutton.onclick = () => {
        currentGameState= gameStates.Game;
        loadGameUI();
    };
    ui_div.appendChild(playbutton);   
}

function loadEndGameUI(){
    clearUI();
    ui_div.style.gridTemplateRows = "auto auto";
    ui_div.style.gridTemplateColumns = "auto";

    let score_text = document.createElement("Text");
    score_text.className = "Score_Text";
    let score = Math.floor(game_properties.playerScore);
    score_text.innerText = "YOUR SCORE";
    score_text.innerHTML += "<br>" + score; 
    score_text.style.textAlign = "center";
    score_text.style.margin = "auto";
    ui_div.append(score_text);

    let playbutton = document.createElement("button");
    playbutton.className = "Play_Button";
    playbutton.innerText = "Play";

    playbutton.onclick = () => {
        currentGameState = gameStates.Menu;
        loadSelectionMenu();

    };
    ui_div.appendChild(playbutton); 
}

function clearUI(){
    ui_div.innerHTML ="";
    ui_div.style.backgroundColor = "rgba(0, 0, 0, 0)";
}

//Initilization function
function init()
{        
    player= new Player(playerCarSpriteList[0],0,0,20);
    player.init();
    player.enabled = false;

    explosion = new Entity (new SpriteAnimation(resources.get(images.explosion),0,0,getArrayFromRange(0,5),128,128,12,1),0,0);
    explosion.sprite.done = true;
    explosion.sprite.loop = false;
    explosion.size = { x:128*2,y:128*2};


    loadmainmenu();   
    
    game_properties.background= window.resources.get(images.Background_1);
    
    game_properties.bsize ={
        w:720,
        h:game_properties.background.height/game_properties.background.width * 720,
    }
    game_properties.bpos = {
        x:0,
        y:0
    }
    game_properties.background_scroll_speed ={
        x:0,
        y:1,
    }

    var car = new Sprite(resources.get(images.E_Car_Red),0,0,0,0);
    car2 = new Enemy(car,0,0,5);
    car3 = new Enemy(images.E_Car_Purple,0,0,5);
    car4 = new Enemy(images.E_Car_Red,0,0,5);
    car5 = new Enemy(images.E_Car_Grey,0,0,5);
    
    car2.pos.y = 0 * cav.height;
    car3.pos.y = 0.3 * cav.height;
    car4.pos.y = 0.6 * cav.height;
    car5.pos.y = 0.8 * cav.height;
    entitylist.push(car2);   
    entitylist.push(car3); 
    entitylist.push(car4); 
    entitylist.push(car5);    

    entitylist.forEach((_ent)=>{
        _ent.init();
    })
    

    Rendering.setContext(cxt);

    main();
}

//main game loop
var main = () =>{
    let now = Date.now();
    dt = (now - last_time)/1000;
    last_time = now;

    switch(currentGameState)
    {
        case gameStates.Menu:{
            drawBackground();
            entitylist.forEach((_ent)=>{
                _ent.updateMain();
                draw(_ent);
            });
            player.init();
            break;
        }
        case gameStates.Game:{
            drawBackground();
            entitylist.forEach((_ent)=>{
                _ent.updateMain();
                draw(_ent);
            });   
            player.updateMain();
            draw(player);
            game_properties.background_scroll_speed.y += 0.00005;
            game_properties.playerScore +=dt * 5;
            game_properties.game_score_text.innerText = "#" + Math.floor(game_properties.playerScore);
            break;
        }
        case gameStates.Pause:{
            break;
        }
        case gameStates.Restart:{
            drawBackground();
            entitylist.forEach((_ent)=>{
                _ent.updateMain();
                draw(_ent);
            });
            explosion.updateMain();
            draw(explosion);
            break;
        }
        default:        
    }
    Rendering.renderDrawCalls();
    requestAnimationFrame(main);
};

var drawBackground = () => {
    let {background,bpos,bsize} = game_properties; 

    bpos.x = bpos.x % bsize.w;
    bpos.y = bpos.y % bsize.h;

    cxt.drawImage(background,bpos.x,bpos.y,bsize.w,bsize.h);
    cxt.drawImage(background,bpos.x,bpos.y-bsize.h,bsize.w,bsize.h);
    cxt.drawImage(background,bpos.x,bpos.y+bsize.h,bsize.w,bsize.h);

    if(game_properties.background_scroll)
    {
        bpos.x += game_properties.background_scroll_speed.x;
        bpos.y += game_properties.background_scroll_speed.y;
    }
};

class Enemy extends Entity{
    constructor(sprite,sizeX,sizeY,speed)
    {
        super(sprite,sizeX,sizeY);
        this.speed = speed;

        this.update = () => {
            if(this.enabled){
            if((this.pos.y) > cav.height)
            {
                this.pos.y =-( this.size.y);
                this.set_random_lane(); 
                this.resetCarColor( Math.floor( Math.random()*enemyCarSpriteList.length));
            }
            if(!game_properties.pause){
            this.pos.y += this.speed;
            this.speed += 0.0005;
            this.speed = game_properties.background_scroll_speed.y>this.speed?game_properties.background_scroll_speed.y:this.speed;
            }
            if(player.enabled){
            if(physics.checkCollision(this,player))
            {                
                player.enabled = false;                
               explosion.pos = player.pos;
               explosion.pos.x -=128/1.5;
               explosion.pos.y -=128/1.5;
               explosion.sprite.reset();
               currentGameState = gameStates.Restart;
                loadEndGameUI();
            }
        }
        }
        };
        this.set_random_lane = () => {            
            let rand = Math.ceil( Math.random() * 3);
            this.pos.x = lanes[rand-1];
            this.pos.x -= this.size.x/2;
        };
        this.init = () => {
            this.set_random_lane();
        };

        this.resetCarColor = (index) => {
            this.sprite.image = resources.get(enemyCarSpriteList[index]);
        }      
        this.draw = (context) => {
            if(this.enabled){
            if(game_properties.enable_shadows) {
            let tempsprrite = new Sprite(images.Car_A0,0,0,0,0);
            tempsprrite.draw(context,this.pos.x,this.pos.y,this.size.x,this.size.y);
            }
                       
            this.sprite.draw(context,this.pos.x,this.pos.y,this.size.x,this.size.y);
        }
        }  
        this.initlocation = () => {
            this.pos.y -= cav.height * 1.5; 
        }
    }    
}


class Player extends Entity{
    constructor(sprite,sizeX,sizeY,speed)
    {
        super(sprite,sizeX,sizeY);
        this.speed = speed;
        this.currentLane = lanes[1];
        this.targetLane = lanes[1];
        this.update = () => {
            if(this.enabled){
            if(this.currentLane != this.targetLane)
            {
                let delta = this.targetLane - this.currentLane;
                delta /= Math.abs(delta);
                this.pos.x += delta * this.speed;
                if(delta<0 && this.pos.x  <= this.targetLane - this.size.x/2)
                {
                    this.pos.x = this.targetLane - this.size.x/2;
                    this.currentLane = this.targetLane;
                }   
                else if(delta>0 && this.pos.x  >= this.targetLane - this.size.x/2)
                {
                    this.pos.x = this.targetLane - this.size.x/2;
                    this.currentLane = this.targetLane;
                }           
            }
        }
        };
        
        this.init = () => {      
            this.pos.x = this.currentLane - this.size.x/2;
            this.pos.y = cav.height * 0.85;      
        };
    
        this.draw = (context) => {
        if(this.enabled)
        {
            if(game_properties.enable_shadows) 
            {
                let tempsprrite = new Sprite(images.Car_A0,0,0,0,0);
                tempsprrite.draw(context,this.pos.x,this.pos.y,this.size.x,this.size.y);
            }                       
            this.sprite.draw(context,this.pos.x,this.pos.y,this.size.x,this.size.y);
        }  
    }
    }    
}

function handleInput()
{
    
}
