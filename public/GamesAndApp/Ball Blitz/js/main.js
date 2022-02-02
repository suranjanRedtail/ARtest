var cav = cavMain;
var bxt = bg_canvas.getContext("2d");
var cxt = cav.getContext("2d");

var game_orientation = 0;

NAME ="Ball Blitz";

const gameStates ={   
    menu:0,
    game:1,
    gameover:2,
    pause:3,
    orientation:4,
}

var last_platform;


//Object containing names of resources
images = {
    Logo : (gamesandapp?actual_game_path:".")+"/assets/sprites/Title.png",
    Playbutton : (gamesandapp?actual_game_path:".")+"/assets/sprites/play.png",
    Pause : (gamesandapp?actual_game_path:".")+"/assets/sprites/pause.png",
    Playagain : (gamesandapp?actual_game_path:".")+"/assets/sprites/playagain.png",
    resume : (gamesandapp?actual_game_path:".")+"/assets/sprites/resume.png",
    blackdrop : (gamesandapp?actual_game_path:".")+"/assets/sprites/backdrop.png",
    whitedrop : (gamesandapp?actual_game_path:".")+"/assets/sprites/backdrop_w.png",
    board : (gamesandapp?actual_game_path:".")+"/assets/sprites/board.png",
    Background : (gamesandapp?actual_game_path:".")+"/assets/sprites/bg.png",
    P_L : (gamesandapp?actual_game_path:".")+"/assets/sprites/P_L.png",
    game_over_text : (gamesandapp?actual_game_path:".")+"/assets/sprites/gameover_text.png",
    music_btn_on : (gamesandapp?actual_game_path:".")+"/assets/sprites/music_on.png",
    effects_btn_on : (gamesandapp?actual_game_path:".")+"/assets/sprites/sound_on.png",
    music_btn_off : (gamesandapp?actual_game_path:".")+"/assets/sprites/music_off.png",
    effects_btn_off : (gamesandapp?actual_game_path:".")+"/assets/sprites/sound_off.png",
    howto : (gamesandapp?actual_game_path:".")+"/assets/sprites/how_to.png",

    plus : (gamesandapp?actual_game_path:".")+"/assets/sprites/plus1.png",
    
    BG : (gamesandapp?actual_game_path:".")+"/assets/sound/BG.mp3",
    GameOver : (gamesandapp?actual_game_path:".")+"/assets/sound/Gameover.mp3",
    coin : (gamesandapp?actual_game_path:".")+"/assets/sound/coin.wav",
    pop : (gamesandapp?actual_game_path:".")+"/assets/sound/pop1.ogg"
};

music_group = [
    images.BG,    
];

effects_group = [
    images.coin,
    images.GameOver,    
    images.pop
]

//game properties
game_properties = {  
    game_time :0,
    Enemy_speed : 150,
    life :10,
    unit_scale : 10,
    gravity: 200,

    Score:0,   

    ball_speed:300,
    bubble_speed:7,

    
    debug_mode : false,
    base_exp: 50,
    drop : 1,
}

//Entity List
var oldmousestate = false;

var player_sprites =[]; 
var plate;

//player 
var player_entity;



var highScore=0;
var totalScore=0;

var timer = 0;
var nexttimer =2;

text_color = "#2ed6c9";
outline_color = "#000000";
score_color = "#ffffff";
button_color = text_color;
ScoreOutline = false;
notification_color = "#ffffff";

how_to_lines= [
    "Destory the Blocks",
    "with your balls",
    "Dont get overwhelmed!",
]

//customthings


var upper_limit = 1150;
var angle_limit = 1080;
var lower_limit = 120;
var gm;


function init()
{
    gm = new Gamemanager();
    entitylist.push(gm);
    gm.spawnNew();
    Engine.onMouseUp.push(gm.onMouseUp);
    Engine.onClick.push(gm.onMouseDown);

    setInterval(()=>{
        if(currentGameState != gameStates.game)
        {
            return;
        }
        entitylist.forEach(e=>{
            if(e instanceof Ball && !e.remove_next_call)
            {
                e.updatePhys();
            }
        },16.667);
    })

}

var main = () =>{    
   
    switch(currentGameState)
    {
        case gameStates.menu:              
            game_properties.game_time += dt;        
            break;

            case gameStates.game:            
            timer += dt;
            game_properties.game_time += dt; 
            


            if(timer>nexttimer )
            {
                 
            }

            entitylist.forEach(e=>{
                e.updateMain();
                window.draw(e);
            });            
            mainviewport.update(); 

                      

            break;
        case gameStates.pause:

            entitylist.forEach(e=>{
                window.draw(e);
            });
            break;
        case gameStates.gameover: 
        
        game_properties.game_time += dt;  

        mainviewport.update();  

        entitylist.forEach(e=>{
            //e.updateMain();
            //window.draw(e);                        
        });

        break;

        case gameStates.orientation:
            window.drawCall(()=>{
            cxt.fillStyle = "#ffffff";
            cxt.fillRect(0,0,cav.width,cav.height);
            cxt.drawImage(window.resources.get(images.P_L), Math.floor((cavMain.width/2)- (window.resources.get(images.P_L).width/2)),0,window.resources.get(images.P_L).width,window.resources.get(images.P_L).height);
            },11);
            break;
        default:         
        break;       
    }   
}

function resetgame() {    
    game_properties = Object.assign({},game_properties_initial);
    window.SH.resetScore();

    entitylist =[];  
    gm.reset();
    entitylist.push(gm)
   
    mainviewport.posx =0;
    mainviewport.posy =0;
    mainviewport.update();
}

DrawBackground=function()
{     
    let b0 = window.resources.get(images.Background);
        
    window.drawCall(
        ()=>{ 
            bxt.drawImage(b0,0,0,b0.width,b0.height);            
    },-2);     
}

class Box extends Entity{
    constructor(count=Math.floor(Math.random()* 20),pos={x:cav.width/2,y:cav.height/2})
    {
        super(images.board);
        this.color = Box.colors[ Math.floor(Math.random()* 2.99)]
        this.size.x = this.size.y = 144/2;
        this.pos = pos;
        this.count = count;        

        this.hit= ()=>{
            this.count--;
            if(this.count<=0)
            {
                this.count = 0;
                this.remove();
                playSound(images.coin);
            }
        }

        this.pivot = {x:this.size.x/2,y:this.size.y/2};
        this.update = ()=>{
            if(this.pos.y > upper_limit - this.size.y)
            {
                gameOver();
            }
        }

        this.draw = ()=>{
            let old = cxt.strokeStyle;
            cxt.strokeStyle = this.color;
            cxt.lineWidth = 5;
            cxt.strokeRect(this.pos.x-this.pivot.x+5,this.pos.y-this.pivot.y+5,this.size.x-5,this.size.y-5);
            cxt.strokeStyle = old;
            cxt.fillStyle = "#ffffff";
            cxt.font = "30px GameFont";
            cxt.textAlign = "center";
            cxt.fillText(this.count,this.pos.x,this.pos.y+ 30/2);            
        }

    }
    static colors = ["#2ed6c9","#ac68e1","#ffffff"];
    static yscroll = 72;
}

class Powerup extends Entity{
    constructor(pos={x:cav.width/2,y:cav.height/2})
    {
        super(images.plus);
        this.pos = pos;      

        this.hit= ()=>{
            if(this.enabled)
            {
                gm.ballcount++;
                this.remove();
                this.enabled=false;
            }
        }

        this.pivot = {x:this.size.x/2,y:this.size.y/2};        
    }
}

class Ball extends Entity{
    constructor( dir = normalize([Math.random(),Math.random()]))
    {
        super(null,1,1);
        this.color = "#ffffff";
        this.pos.x = cav.width/2;
        this.pos.y = 1200;
        this.dir = dir;
        this.moving = true;
        this.ready_to_die = false;
             

        this.wallCollision =()=> {
            if(this.center.x - this.radius < 0 )
            {
                this.pos.x = this.radius;
                this.dir[0] *= -1;
                playSound(images.pop);
                this.ready_to_die =true;
            }
            if(this.center.x + this.radius > cav.width)
            {
                this.dir[0] *= -1;
                this.pos.x = cav.width - this.radius;
                playSound(images.pop);
                this.ready_to_die =true;
            }
            if(this.center.y - this.radius < lower_limit)
            {
                this.dir[1] *= -1;
                this.pos.y = this.radius + lower_limit;
                playSound(images.pop);
                this.ready_to_die =true;
            }
            if(this.center.y + this.radius > upper_limit && this.ready_to_die)
            {
                
                //this.dir[1] *= -1;
                //this.pos.y = upper_limit - this.radius;
                if(gm.nextLoc == null)
                {
                    gm.nextLoc = this.pos.x;
                }
                gm.ball.splice(gm.ball.indexOf(this),1);
                this.remove();
                playSound(images.pop);
            }
        }

        this.draw = (context)=>{
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
            context.fill();
            cxt.closePath();
        }


        this.updatePhys = ()=>{
            if(this.moving)
            {      
                if(Math.abs(dot(this.dir,[1,0]))>0.99)
                {
                    this.dir[1] += 0.1 * 0.01667 * (this.dir[1]<0?-1:1);
                    this.dir = normalize(this.dir);
                }

                this.pos.x += this.dir[0] * Ball.speed * 0.01667;
                this.pos.y += this.dir[1] * Ball.speed * 0.01667;

                this.wallCollision();

                entitylist.forEach( e=>{
                    if(Math.abs(e.pos.y - this.pos.y) < 100)
                    {    
                        if(e instanceof Box)
                        { 
                            let result = window.Physics.CircleRectangle(this,e);
                            if(result[0])
                            {         
                                this.pos.x = result[1][0] + result[2][0]*this.radius;   
                                this.pos.y = result[1][1] + result[2][1]*this.radius;                 
                                this.dir = reflection(this.dir,result[2]);
                                e.hit();
                                playSound(images.pop);
                                this.ready_to_die =true;
                            }
                        }
                        else if(e instanceof Powerup)
                        {
                            let result = window.Physics.CircleRectangle(this,e);
                            if(result[0])
                            {         
                                e.hit();
                                playSound(images.coin);
                                this.ready_to_die =true;
                            }
                        }
                    }
                });

            }
        }
    }
    static ballrad = 10;
    static speed = 500;
    get center()
    {
        return this.pos;
    }
    get radius()
    {
        return Ball.ballrad;
    }
}

class Gamemanager extends Entity
{
    constructor()
    {
        super(null,1,1);
        this.ballcount=1;
        this.ball =[];
        this.startLocation = cav.width/2;
        this.state = 0;
        this.nextLoc = null;
        this.count = 1;
        this.blocks = [];

        this.currentCount = 1;

        this.target = [0,0];

        this.update =()=>{
            switch(this.state)
            {
                case 1:
                    this.target = mousePos;                    
                    break;
                case 3:
                    if(this.ball.length == 0)
                    {
                        console.log("hey 3->4"); 

                        this.startLocation = this.nextLoc;
                        this.startLocation = clamp(this.startLocation,Ball.ballrad+1,720-Ball.ballrad-1);
                        this.nextLoc = null;

                        this.state = 4;
                        window.SH.addScore(1);
                        this.count ++;                      

                        //blocks logic
                        entitylist.forEach(e=>{
                            if(e instanceof Box || e instanceof Powerup)
                            {
                                e.lastp = Object.assign({},e.pos);
                            }
                        })
                        if( entitylist.find(e=>{if(e instanceof Box|| e instanceof Powerup)return true; return false;}))
                        {
                            new cAnimation(1,(p)=>{
                                entitylist.forEach(e=>{
                                    if(e instanceof Box|| e instanceof Powerup)
                                    {
                                        e.pos.y = e.lastp.y + p.progress*Box.yscroll;
                                    }
                                })
                            },()=>{ 
                                this.state = 0;
                                console.log("hey 4->0");
                                this.spawnNew();
                            });
                        }
                        else
                        {
                            this.state = 0;
                            console.log("hey 4->0");
                            this.startLocation = this.nextLoc;
                            
                            this.spawnNew();
                        }
                    }
            }
        }

        this.spawnNew = ()=>{  
            let count = Math.floor(Math.random()*10.99);            
            count = clamp(count,1,10);
            if(count >5)
            {
                let ncount; 
                if(Math.random()<0.5)
                {
                    ncount = Math.floor(Math.random()*10.99);
                    ncount = clamp(ncount,1,10);
                    count = Math.min(ncount,count);
                }
            }
            let selected = [];
            let powerup =false;
            while(count>0)
            {
                let i = Math.floor(Math.random()*10);
                if(selected.indexOf(i)<0)
                {
                    selected.push(i);
                    if( Math.random() <0.15)
                    {
                        entitylist.push( new Powerup({x: i*72 +36 ,y: lower_limit + 36}));
                        
                    }
                    else
                    {
                        entitylist.push( new Box(this.count, {x: i*72 +36 ,y: lower_limit + 36}));
                    }
                    count--;
                }
            }

            
            
        }

        this.reset = ()=>{
            this.ballcount=1;
            this.ball =[];
            this.startLocation = cav.width/2;
            this.state = 0;
            this.nextLoc = null;
            this.count =1;
            this.spawnNew();
        }

        this.onMouseDown = () => 
        {
            if(currentGameState == gameStates.game)
            {
                switch(this.state)
                {
                    case 0:
                        console.log("________");
                        console.log("hey 0->1");
                        this.state = 1; 
                        this.target = mousePos                              
                }
            }
        }

        this.onMouseUp = ()=>{
            if(currentGameState == gameStates.game)
            {
                switch(this.state)
                {
                    case 1:
                        this.state = 2;
                        if(this.target[1]>angle_limit)
                        {
                            console.log("hey 1->0");
                            this.state = 0;
                            return;
                        }
                        console.log("hey 1->2");

                        this.currentCount = this.ballcount;
                        
                        let dir = normalize([ mousePos[0]-this.startLocation,mousePos[1]-upper_limit]);

                        let t = setInterval(()=>{
                            let tmp = new Ball(dir.slice());
                            tmp.pos.x = this.startLocation;
                            tmp.pos.y = upper_limit;

                            entitylist.push(tmp);
                            this.ball.push(tmp);

                            this.currentCount--;
                            if(this.currentCount==0)
                            {
                                clearInterval(t);
                                this.state = 3;
                                console.log("hey 2->3");
                            }
                        },150);
                }
            }
        }   
        
        this.draw = (context)=>{
            if(this.state < 3 || this.state == 4 )
            {
                context.fillStyle = "#ffffff";
                context.beginPath();
                context.arc(this.startLocation, upper_limit, Ball.ballrad, 0, 2 * Math.PI);
                context.fill();
                context.closePath();
            }
            if(this.nextLoc != null)
            {
                context.arc(this.nextLoc, upper_limit, Ball.ballrad, 0, 2 * Math.PI);
                context.fill();
                context.closePath();
            }
            context.fillStyle = "#ffffff";
            context.font = "50px GameFont";
            context.textAlign = "center";
            context.fillText(this.ballcount,cav.width/2,1225);
            drawLine([0,upper_limit],[720,upper_limit],"#ffffff",3);
            drawLine([0,lower_limit],[720,lower_limit],"#ffffff",3);

            drawLine([0,angle_limit],[720,angle_limit],"#973241",3);

            if(this.state==1)
            {
                drawLine( [this.startLocation,upper_limit],this.target,this.target[1]>angle_limit?"#ff0000":"#ffffff", 3);
            }
        }
    }
}