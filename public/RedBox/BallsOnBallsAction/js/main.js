var cavMain = document.getElementById("main_canvas");
var cav = document.createElement("canvas");
cavMain.style.width = "100%";
cavMain.style.height = "100%";
var cxt = cav.getContext("2d");


//resizing canvas
cav.width = 720;
cav.height = 1280;

cavMain.width = 720;
cavMain.height = 1280;



const gameStates ={   
    menu:0,
    game:1,
    gameover:2,
    pause:3,  
}

const colors = [
    "#296A7A",
    "#649933",
    "#417A29",
    "#2CB57A",
    "#2D69B2",
    "#AF622E",
    "#AA2FAD",
    "#6D2F8E",
    "#3091CE",
    "#6227D6",
    "#C6A105",
    "#DB7F23",
    "#C43535",
    "#DD1F83",
    "#798A2E"];

    var text_color = "#A35F0D";
    var pause_text_color = "#FFEFDC";

//game state initilization
var currentGameState;

//Object containing names of resources
var images = {    
    Background : "./assets/sprites/BG.png",
    Logo : "./assets/sprites/Logo.png",
    Playbutton : "./assets/sprites/playbutton.png",
    Pause : "./assets/sprites/pausebutton.png",
    Playagain : "./assets/sprites/playagain.png",
    resume : "./assets/sprites/resume.png",
    blackdrop : "./assets/sprites/backdrop.png",
    GameOver : "./assets/sound/game_over.wav",
    BG : "./assets/sound/BG.mp3",
    Help_animation : "./assets/sprites/animations/512_512.png", 
    tap_1 : "./assets/sound/T1.mp3",
    tap_2 : "./assets/sound/T2.mp3",
    Pop : "./assets/sound/pop.wav",  
    Pop2 : "./assets/sound/pop2.mp3", 
    explosion : "./assets/sprites/animations/500_500.png",
    super : "./assets/sound/super.mp3", 
    player_animation : "./assets/sprites/animations/500_500_archer.png",
    arrow : "./assets/sprites/arrow_final.png",
    w1 : "./assets/sound/W1.mp3",
    w2 : "./assets/sound/W2.mp3",
    wind : "./assets/sound/wind1.mp3",
};


let resources_paths = [];
for (let [key, value] of Object.entries(images)) {
    resources_paths.push(value);
}

let y = document.createElement("img");
y.src = "./assets/sprites/Splash.png";


var delay_interval;

y.onload = () => {    
    cavMain.getContext('2d').drawImage(y,0,0,cavMain.width,cavMain.height);

    //window.resources.addcallback(init);
    window.resources.load(resources_paths);

    let counter =0;
    let tempcxt = cavMain.getContext('2d');
    delay_interval = setInterval(() => {
        if(counter>=2000 && resources.resourcesloadedcount == resources.resourcescount)
        {
            clearInterval(delay_interval);
            init();
        }   
        else
        {     
        tempcxt.drawImage(y,0,0,cavMain.width,cavMain.height);
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
    min:15,
    speed:100,
    spawn_interval : 3,
    game_time :0,
    fire_rate :1,
    charge : 0,
    charge_toggle : false, 
    max_charge : 3,    
}

//dt related variables
var last_time = Date.now();
window.dt = 0;

//Entity List
var entitylist = [];
var uiEntityList = [];
var oldmousestate = false;

var counter=0;
var next_interval=game_properties.spawn_interval;

//player 
var player_entity;
var arrow_scale;


//mainmenu
function loadmainmenu(){

    let y = new Entity(images.Logo,553,242);
    let y2 = new Button(images.Playbutton,405,159);

    y.pos.x=139;
    y.pos.y=116;    

    y2.pos.x=168;
    y2.pos.y=753;

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
    let y2 = new PowerBtn();
    y2.pos.x = 580;
    y2.pos.y = 900;

    y.onclick = () => {
        clearUI();
        loadpauseUI();
        currentGameState = gameStates.pause;
    }
    uiEntityList.push(y);
    uiEntityList.push(y2);
}

function loadpauseUI() {

    let y = new Button(images.resume,405,159);
    let y2 = new Entity(images.blackdrop,cav.width,cav.height);
    y.order = 2;
    y2.order = 1;

    y.pos.x=168;
    y.pos.y=753;

    y.onclick = () => {
        clearUI();
        loadgameUI();
        currentGameState = gameStates.game;
    }
    uiEntityList.push(y);
    uiEntityList.push(y2);
}

function gameOver() {    
    resources.get(images.GameOver).play();
    clearUI();
    currentGameState = gameStates.gameover;
    let y2 = new Button(images.Playagain,405,159);

    y2.pos.x=168;
    y2.pos.y=753;

    y2.onclick = () => {
        clearUI();
        loadgameUI();
        resetgame();  
        resources.get(images.BG).play();    
        help.timer = 0;  
        help.enabled = true;   
    }    
    uiEntityList.push(y2);       
}

function clearUI(){
    while(uiEntityList.length !=0)
    {
        uiEntityList.pop();
    }
}

function resetgame() {
    currentGameState = gameStates.game;
    game_properties ={  
        Score:0,
        min:15,
        speed:100,
        spawn_interval : 3,
        game_time :0,
        fire_rate :1,
        charge : 0,
        charge_toggle : false, 
        max_charge : 3,
    }
    entitylist = [];

    let player_sa = new SpriteAnimation(images.player_animation,0,0,[0,1,1,2,3,3,4,4,0],500,500,12,1);    
    player_entity = new Player(player_sa,720/2,720/2);
    player_entity.pos.y = 930;   
    entitylist.push(player_entity);
    player_entity.pos.x = cav.width/2 - player_entity.size.x/2;
    player_entity.targetposx = player_entity.pos.x;
    player_entity.sprite.reset();
}

//Initilization function
function init()
{    
    uiEntityList = onhoverlist;
    let player_sa = new SpriteAnimation(images.player_animation,0,0,[0,1,1,2,3,3,4,4,0],500,500,12,1);
    arrow_scale = 500/(720/2);
    player_entity = new Player(player_sa,720/2,720/2);
    player_entity.pos = {x:cav.width/2 - player_entity.size.x/2,y:930};
    player_entity.targetposx = player_entity.pos.x;
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
    help = new Entity(helpAnimation,0,0);
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

    
    cxt.drawImage(resources.get(images.Background),0,0,cav.width,cav.height);

    switch(currentGameState)
    {        
        case gameStates.menu:        
        break;
        case gameStates.game:

            entitylist.forEach(e=>{
                e.updateMain();
                draw(e);
            });

            counter+=dt;
            game_properties.game_time += dt;
            game_properties.speed += dt * 0.05;
            if(counter> next_interval)
            {
                let tcount = (Math.max( 20, (Math.random()* 150))* Math.min(game_properties.game_time/200,1)) + game_properties.min; 
                let temp = new Balls( Math.max(tcount,30) * 2.5,Math.floor(tcount),(Math.random() *  game_properties.speed/2) + game_properties.speed,colors[ Math.floor( Math.random() * colors.length)]);
                temp.pos.x = Math.random()* cav.width * 0.6 + cav.width* 0.2;
                temp.pos.y = - temp.radius;
                entitylist.push(temp);
                counter =0;
                next_interval =  game_properties.spawn_interval +  (game_properties.spawn_interval - next_interval) + 4 * (game_properties.game_time/120000) ;
            }

            drawCall(()=>{
            cxt.textAlign = "center";
            cxt.strokeStyle = "#ffffff";             
            cxt.font = "bold 80px Nepali";   
            cxt.lineWidth = 8;         
            cxt.strokeText(game_properties.Score,cav.width-35-100,95);
            cxt.fillStyle = text_color;
            cxt.font = "bold 80px Nepali";
            cxt.fillText(game_properties.Score,cav.width-35-100,95);  
            cxt.textAlign = "start";  
            },2);
            

            help.updateMain();
            draw(help);
            break;
        case gameStates.pause:

            entitylist.forEach(e=>{
                draw(e);
            })

            drawCall(()=>
            {
            cxt.font = "bold 70px GameFont";            
            cxt.fillStyle = pause_text_color; 
            cxt.textAlign = "center"; 
            cxt.fillText("SCORE",cav.width/2,(cav.height/2)- 100);
            cxt.font = "bold 90px Nepali";
            cxt.fillText(game_properties.Score,cav.width/2,cav.height/2);
            cxt.textAlign = "start"; 
            },2);
            
            
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
            cxt.font = "bold 70px GameFont";            
            cxt.fillStyle = pause_text_color; 
            cxt.textAlign = "center"; 
            cxt.fillText("YOUR SCORE",cav.width/2,(cav.height/2)- 100);
            cxt.font = "bold 90px Nepali";
            cxt.fillText(game_properties.Score,cav.width/2,cav.height/2);
            cxt.textAlign = "start";   
            },2); 
                    
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
    cxt.drawImage(resources.get(images.Background),0,0,cav.width,cav.height);
}

class Balls extends Entity{
    constructor(radius,count,speed,color)
    {
        super(null,1,1);
        this.color = color;
        this.radius = radius;
        this.currentradious = radius;
        this.count = count;
        this.initialcount = count;
        this.detonated = false;
        this.order =1;
        
        this.special = Math.random()<0.1?true:false;
        if(this.special)
        {
            this.count = Math.floor( Math.max(count,15)* 1.5);            
        }

        this.update = () => {

            if(this.pos.y > cav.height + this.radius && !this.done)
            {
                gameOver();
                entitylist.forEach(e=>{
                    e.done = true;
                })
            }

            if(this.count <= 0 & !this.done)
            {
                this.done = true;
                game_properties.Score += this.initialcount;
                game_properties.fire_rate += this.special? 0.05:0.01;
                game_properties.charge = Math.min( game_properties.charge + 0.1 ,game_properties.max_charge);
                    entitylist.forEach(e=>{                        
                        if(this.special)
                        {                            
                            e.count = 0;                        
                        }
                        else if(!this.detonated)
                        {
                        e.count =  Math.max( e.count - Math.floor(this.initialcount/ (2+(Math.random()*2.5))),0);
                        e.radius =  Math.max(e.count , 30)  * 2.5;  
                        e.currentradious = e.radius * 0.8; 
                                           
                        }
                        else
                        {
                            e.count =  Math.max( e.count - 1,0);
                            e.radius =  Math.max(e.count , 30)  * 2.5;  
                            e.currentradious = e.radius * 0.9;  
                            game_properties.Score++; 
                        }
                        if(e!=this)
                        {
                            e.detonated = true;
                        }
                        
                    })
                
                
            }
            if(this.done)
            {
                this.radius -= 1000* dt;
                this.currentradious = this.radius;
                if(this.radius < 1)
                {
                    this.enabled = false;
                    if(this.special && currentGameState == gameStates.game)
                    {
                        let t = resources.get(images.super)
                        t.pause();
                        t.currentTime = 0;
                        t.play();
                    }
                    
                    let BA = [resources.get(images.Pop).cloneNode(true),resources.get(images.Pop2).cloneNode(true)];
                    let randroll = Math.floor(Math.random() * 2);
                    BA[randroll].currentTime = 0;
                    BA[randroll].play();
                    
                    
                    let tas = new SpriteAnimation(resources.get(images.explosion),0,0,getArrayFromRange(1,13),500,500,24,1);
                    let temp_anim = new Entity(tas, Math.max(30,this.initialcount) *2 *2.5, Math.max(30,this.initialcount)*2*2.5);
                    tas.currentframe = 0;
                    tas.loop = false;
                    temp_anim.update = () => {
                        if(temp_anim.sprite.done)
                        {
                            temp_anim.enabled = false;
                        }
                    }
                    temp_anim.pos.x = this.pos.x - temp_anim.size.x/2;
                    temp_anim.pos.y = this.pos.y - temp_anim.size.y/2;
                    entitylist.push(temp_anim);
                }
            }
            

            this.pos.y += game_properties.speed * dt;

            let delta = this.radius - this.currentradious;

            if(Math.abs(delta)>1)
            {
                this.currentradious += 0.1 * delta; 
            }
            
        }
        this.draw = (context) =>
        {
        if(this.enabled){
            context.beginPath();
            context.arc(this.pos.x, this.pos.y, this.currentradious, 0, 2 * Math.PI, false);
            context.fillStyle = this.color;
            context.fill();
            context.lineWidth = 10;            
            context.strokeStyle = "#000300";
            context.stroke();

            if(this.special)
            {
            context.lineWidth = 5;            
            context.strokeStyle = "#FFD700";
            context.stroke();
            }            
              
            context.font = "bold "+ this.currentradious/1.5+"px Nepali";            
            context.fillStyle = "#eeeeee"; 
            context.textAlign = "center"; 
            context.lineWidth = 1;
            context.fillText(this.count,this.pos.x,this.pos.y + (this.currentradious/1.5)/2);  
            //context.strokeText(this.count,this.pos.x,this.pos.y+ (this.currentradious/1.5)/2); 
            }      
        }
        this.checkmouse=(x,y,damage)=>{
            let distfrommouse = Math.sqrt( Math.pow( this.pos.x - x,2) + Math.pow( this.pos.y - y,2));
            
            if(distfrommouse < this.radius)
            {
                this.count = Math.max( this.count - damage , 0);
                this.detonated = false;
                this.currentradious = this.radius * 0.9;
                let TA = [resources.get(images.tap_1),resources.get(images.tap_2)];
                let randroll = Math.floor(Math.random() * 2);
                TA[randroll].pause();
                TA[randroll].currentTime = 0;
                TA[randroll].play();
                this.radius =  Math.max(this.count , 30)  * 2.5;
                return true;                
            }
            else
            {
                return false;
            }
        }     
           
    }
}

class Player extends Entity{
    constructor(sprite,sizex,sizey){
        super(sprite,sizex,sizey);
        this.has_shot = false;
        this.speed = 1;
        this.targetposx = 0;
        this.shoot =() => {            
            if(!this.has_shot)
            {                
                this.has_shot = true;
                let tarrow = new Arrow( 1500, this.pos.x + this.size.x/2 , this.pos.y - (118/2),5);
                entitylist.push(tarrow);
                let TA = [resources.get(images.w1).cloneNode(true),resources.get(images.w2).cloneNode(true)];
                let randroll = Math.floor(Math.random() * 2);
                TA[randroll].pause();
                TA[randroll].currentTime = 0;
                TA[randroll].play();
            }
        }
        this.update = () => {
            if(game_properties.charge_toggle)
            {
                if(game_properties.charge>0)
                {
                    this.sprite.speed = game_properties.fire_rate*2;
                    game_properties.charge -= dt;
                }
                else
                {
                    game_properties.charge_toggle = false;
                    game_properties.charge =0; 
                }
            }
            else
            {
            this.sprite.speed = game_properties.fire_rate;
            }
            
            let delta = this.targetposx - this.pos.x;
            if(Math.abs(delta)>1)
            {
                this.pos.x += Math.sign(delta)*   Math.abs(delta) * 0.1 ;
            }
            else
            {
                this.pos.x = this.targetposx;
            }            

            if(Math.abs(delta)>75 && !game_properties.charge)
            {
                this.sprite.currentframe=0;
            }

            let spriteframe = Math.floor(this.sprite.currentframe_modded);

            if(spriteframe == 1)
            {
                this.has_shot = false;
            }
            else if( spriteframe == 4)
            {
                this.shoot();
            }
        }
    }
}

class Arrow extends Entity{
    constructor(speed,posx,posy,damage){
        let arrow_size_x = resources.get(images.arrow).width / arrow_scale;
        let arrow_size_y = resources.get(images.arrow).height / arrow_scale;;
        super(images.arrow, arrow_size_x,arrow_size_y);
        this.pos.x = posx;
        this.pos.y = posy;
        this.speed = speed;
        this.damage = damage;
        

        this.update = () => {
            this.speed -= 0.01 * this.speed;
            
            if(this.pos.y + this.size.y < 0)
            {
                this.enabled = false;
            }
            else
            {
                this.pos.y -= this.speed * dt;
            }

            entitylist.forEach(e=>{
                if( e instanceof Balls)
                {
                    let t_status = e.checkmouse(this.pos.x + this.size.x/2,this.pos.y,this.damage);
                    if(t_status)
                    {
                        this.enabled = false;
                        //break;
                    }
                }
            }
            )
        }
        
    }
}

class PowerBtn extends Button {
    constructor()
    {
        super(null,100,100);
        this.onclick = () => {
            game_properties.charge_toggle = true;
            this.currentradious = 40;
            resources.get(images.wind).currentTime = 0;
            resources.get(images.wind).play();
        }
        this.color = text_color;
        this.power_color = "#ffffff" 
        this.radius = 50; 
        this.currentradious = 30; 
        this.draw = (context)=>{
            let percent = Math.max( game_properties.charge,0)/game_properties.max_charge;
            let redhex = Math.floor(percent * 255).toString(16).toUpperCase();
            let greenhex = Math.floor((1-percent) * 255).toString(16).toUpperCase();
            redhex = redhex.length==1? ("0"+redhex) : redhex;
            greenhex = greenhex.length==1? ("0"+greenhex) : greenhex;

            this.power_color = "#" + greenhex +""+ redhex +"00";
            if(this.enabled && !this.done){

                let delta = this.radius - this.currentradious;

            if(Math.abs(delta)>1)
            {
                this.currentradious += 0.1 * delta; 
            }
            else 
            this.currentradious = this.radius;

                context.beginPath();
                context.arc(this.pos.x + this.size.x/2, this.pos.y+ this.size.y/2, this.currentradious, 0, 2 * Math.PI, false);
                context.fillStyle = this.color;
                context.fill();
                context.lineWidth = 5;            
                context.strokeStyle = "#ffffff";
                context.stroke();
                context.beginPath();
                context.arc(this.pos.x + this.size.x/2, this.pos.y+ this.size.y/2, this.radius+12, Math.PI * 0.5, (Math.PI * 0.5)+ ((percent)*Math.PI*2), false);
                context.lineWidth = 10;            
                context.strokeStyle = this.power_color;
                context.stroke();
                context.font = "bold 50px GameFont";            
                context.fillStyle = "#ff8844"; 
                context.textAlign = "center"; 
                context.fillText("⚡",this.pos.x + this.size.x/2,this.pos.y+ this.size.x/1.5);

            }
        }
    }
}

document.addEventListener("visibilitychange", function() {
    if(document.hidden && currentGameState== gameStates.game)
    {
        currentGameState = gameStates.pause;
        loadpauseUI()
    } 
});

