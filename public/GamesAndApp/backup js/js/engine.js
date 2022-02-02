Howler.html5PoolSize=10;

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

//mobile check
var ismobile=false;
window.isMobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};


var audiourls=[];
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
        
        url = urlArray;
        
        if(typeof url == "object")
        {
            let tempimp = new Howl({
                src:url.src,
                sprite : url.sprites,
                onload:function(){
                    window.resources.resourcesloadedcount +=loaded_Resources[url]?0:1;
                    loaded_Resources[url]=tempimp;
                }
            });
        }
        else
        {
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
                    tempimp = new Howl({
                        src:url,
                        onload:function(){
                            window.resources.resourcesloadedcount +=loaded_Resources[url]?0:1;
                            loaded_Resources[url]=tempimp;
                        }
                    });
                    //loadaudio();
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

    function set(url,resource)
    {
        if(loaded_Resources[url])
        {
            loaded_Resources[url]=resource;
        }
    }

    window.resources= {        
        load : load,
        get : get,
        addcallback : addcallback,
        isready : isready,
        resourcesloadedcount : resourcesloadedcount,
        resourcescount : resourcescount,
        loaded_Resources : loaded_Resources,
        set : set,
    };
}());


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
    this.remove_next_call = false;

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
    this.remove = function(){
        this.remove_next_call = true;
    }
}

class Button extends Entity
{
    constructor(sprite,sizeX,sizeY)
    {
        super( typeof sprite=="string"|| sprite ==null?sprite:sprite[0],sizeX,sizeY);
        this.onhover =()=>{};
        this.onclick = () => {};
        this.order = 10;
        this.ui =true; 
       
        this.hover_check=true; 
        if(typeof sprite=="object" && sprite!=null)
        {            
            this.sprites = [];
            sprite.forEach(e=>{
                this.sprites.push(  new Sprite(window.resources.get(e),0,0,0,0));
            })
        }
             
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

class UI_layout {
    constructor()
    {
        this.ui_entites=[];
        this.drawCalls=[];
    }
}

var current_hover_obj =null;

function onhovercheck(posX = mousePos[0],posY = mousePos[1]) {
    let templist = [];
    if(Engine.current_UI)
    {
        Engine.current_UI.ui_entites.forEach(element => {

            if(element.hover_check && element.pos.x < posX && element.pos.x + element.size.x > posX &&
                element.pos.y < posY && element.pos.y + element.size.y > posY )
                {
                    templist.push(element);
                }
        });
    }

    templist.sort((a,b)=> b.order-a.order);
    if(templist.length>0)
    {
        current_hover_obj = templist[0];
    }    
    else
    {
        current_hover_obj = null;
    }
    return templist[0]; 
}

clamp = (num,min,max)=>
{
    return Math.min(Math.max(num,min),max);
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
Engine.notifications =[];
Engine.checkMobile =()=>{
    ismobile = window.isMobileCheck();
}
Engine.current_UI = null;
Engine.switch_UI = (_layout)=>{
    if(typeof _layout == "string")
    {
        Engine.current_UI = ui_list[_layout];
    }
    else
    {
        Engine.currentUI = _layout;
    }
}
Engine.updateUI = function(){
    if(Engine.current_UI)
    {
        Engine.current_UI.ui_entites.forEach(ele=>{
            ele.updateMain();
            window.draw(ele);
        })
        Engine.current_UI.drawCalls.forEach(
            e=>{
                window.drawCall(e.call,e.order);
            }
        )
    }
}
Engine.updatefunction = function(){
    updateDT();
    Engine.updateUI();
    if(Engine.backgroundMode!=0)
    {
        DrawBackground();
    }
    else
    {
        cxt.clearRect(0,0,cav.width,cav.height);
    }
    //removing objects from entitylist
    entitylist= entitylist.filter(e=>{
        if(!e.remove_next_call)
        {
            return e;
        }
    })
    //notifications
    if(Engine.notifications.length>0)
    {        
    Engine.notifications[0].updateMain();
    window.draw(Engine.notifications[0]);

    Engine.notifications= Engine.notifications.filter(e=>{
        if(!e.remove_next_call)
        {
            return e;
        }
    });
    }
}

Engine.backgroundMode = 0;

var DrawBackground;

//sound
var music_group=[];
var effects_group=[];

function mute(group)
{
    group.forEach(element => {
        window.resources.get(element).mute(true);
    });
}

function unmute(group)
{
    group.forEach(element => {
        window.resources.get(element).mute(false);
    });
}

function playSound(soundtoPlay,loop=false)
{
    soundtoPlay = window.resources.get(soundtoPlay);
    if(soundtoPlay)
    {      
        soundtoPlay.once("play",()=>{
            soundtoPlay.loop(loop);
        })  
        soundtoPlay.play();        
    }
}

var canvasOffset ={x:0,y:0,xx:0,yy:0};

var ui_list=[];

function init_UIs()
{
    let music = new Button([images.music_btn_on,images.music_btn_off]);
    let sfx = new Button([images.effects_btn_on,images.effects_btn_off]);
    music.on = true;
    sfx.on = true;

    music.pos.x=261;
    music.pos.y=959;

    sfx.pos.x=393;
    sfx.pos.y=959;

    music.onclick = function(){ 
        if(music.on)
        {
            mute(music_group);
            music.on = false;
            music.sprite = music.sprites[1];            
        }
        else
        {
            unmute(music_group);
            music.on = true;
            music.sprite = music.sprites[0];  
        }
    }

    sfx.onclick = function(){
        if(sfx.on)
        {
            mute(effects_group);
            sfx.on = false;
            sfx.sprite = sfx.sprites[1];
        }
        else
        {
            unmute(effects_group);
            sfx.on = true;
            sfx.sprite = sfx.sprites[0]; 
        }
    }

    let btns = {music:music,sfx:sfx};
    ui_list["home"]=homeUI(btns);
    ui_list["game"]=gameUI();
    ui_list["pause"]=pauseUI(btns);
    ui_list["gameover"]=gameoverUI();
    ui_list["howto"]=howtoUI();
}

function homeUI(btn)
{
    let t = new UI_layout();
    let y = new Entity(images.Logo,0,0,true);
    let y2 = new Button(images.Playbutton,0,0);

    y.pos.x= cav.width/2 - y.size.x/2;
    y.pos.y=106;

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=1142;

    y2.onclick = () => {  
        Engine.switch_UI("howto"); 
    };    

    y.hover_check = true;    
    t.ui_entites.push(y);
    t.ui_entites.push(y2);
    t.ui_entites.push(btn.music);
    t.ui_entites.push(btn.sfx);

    t.drawCalls.push(
        {
            call:()=>
            {  
            let lvl_info = window.SH.getLevelInfo();          
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center";                    
            cxt.font = "70px GameFont";   
            cxt.fillText("Level "+lvl_info.level,cav.width/2,514);   
            cxt.font = "40px GameFont";               
            cxt.fillText("Highscore "+window.SH.getHighScore(),cav.width/2,558 );                     
            cxt.fillText(lvl_info.exp_next-lvl_info.exp+ " xp to level "+(lvl_info.level+1),cav.width/2,673 ); 
            cxt.textAlign = "start"; 
            
            let lw=Math.floor(382*(lvl_info.exp/lvl_info.exp_next));           
            Engine.roundedrectangle(cxt,169,596,382,28,"#ffffff");
            Engine.roundedrectangle(cxt,169,596,lw,28,text_color);
            },
            
            order :2
        }
        )

    return t;
}

function gameUI(){
    let t = new UI_layout();
    let y = new Button(images.Pause);
    
    y.pos.x = 41;
    y.pos.y = 42;

    y.onclick = () => {
        Engine.switch_UI("pause");
        window.resources.get(images.BG).volume(0.5);
        currentGameState = gameStates.pause;
    }

    let tv = ()=>{
        let t = window.SH.getLevelInfo();
        cxt.textAlign = "end";
        if(ScoreOutline)
        {
            cxt.strokeStyle = outline_color;             
            cxt.font = "70px GameFont";   
            cxt.lineWidth = 8;         
            cxt.strokeText(game_properties.Score,cav.width-50,95);
        }
        cxt.fillStyle = score_color;
        cxt.font = "70px GameFont";
        cxt.fillText(game_properties.Score,cav.width-50,90);  
        cxt.textAlign = "center";

        cxt.fillStyle =text_color;
        cxt.font = "30px GameFont";
        cxt.fillText("Level "+t.level,cav.width/2,79);
        let tw = (t.exp/t.exp_next)*cav.width;
        cxt.fillRect(0,0,tw,10);
        cxt.fillStyle="#ffffff";
        cxt.fillRect(tw,0,cav.width-tw,10);    
        };

    t.drawCalls.push(
        {
            call:tv,
            order:2
        }
    )

    t.ui_entites.push(y);
    return t;
}

function pauseUI(btn){

    let t = new UI_layout();

    let y = new Entity(game_properties.drop==0?images.whitedrop:images.blackdrop,cav.width,cav.height,true);
    
    let y3 = new Entity(images.pause_text,0,0,true);
    
    let y2 = new Button(images.resume,0,0);

    y3.pos.x = cav.width/2 - y3.size.x/2;
    y3.pos.y = 234;
    
    y.order = 2;
    y3.order = 3;

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=1142;

    let y4 = new Button(images.home_btn,0,0);
    y4.pos.x = cav.width/2 - y4.size.x/2;
    y4.pos.y = 818;
    y4.onclick = ()=>{
        Engine.switch_UI("home");
        currentGameState = gameStates.menu;
        resetgame();
    }
    t.ui_entites.push(y4);

    y2.onclick = () => {
        Engine.switch_UI("game");
        currentGameState = gameStates.game;  
        window.resources.get(images.BG).volume(1);        
    }    

    t.ui_entites.push(y);
    t.ui_entites.push(y2);
    t.ui_entites.push(y3);  
    
    t.ui_entites.push(btn.music);
    t.ui_entites.push(btn.sfx);


    let tv = ()=>
    {  
        
            let t = window.SH.getLevelInfo();
            cxt.textAlign = "center";
            if(ScoreOutline)
            {
                cxt.strokeStyle = outline_color;             
                cxt.font = "70px GameFont";   
                cxt.lineWidth = 8;         
                cxt.strokeText(game_properties.Score,cav.width/2,cav.height/2);
            }
            cxt.fillStyle = text_color;
            cxt.font = "70px GameFont";
            cxt.fillText("Score "+game_properties.Score,cav.width/2,cav.height/2.5);  
            cxt.textAlign = "center";
    
            cxt.font = "30px GameFont";
            cxt.fillText("Level "+t.level,cav.width/2,79);
            let tw = (t.exp/t.exp_next)*cav.width;
            cxt.fillRect(0,0,tw,10);
            cxt.fillStyle="#ffffff";
            cxt.fillRect(tw,0,cav.width-tw,10);    
            
    }

    t.drawCalls.push(
        {
            call:tv,
            order:2
        }
    )

    return t;
}

function gameoverUI()
{
    let t = new UI_layout();
    let y = new Entity(game_properties.drop==0?images.whitedrop:images.blackdrop,cav.width,cav.height,true);
        
    let y3 = new Entity(images.game_over_text,0,0,true);
    let y2 = new Button(images.Playagain,0,0);
    

    

    y3.pos.x = cav.width/2 - y3.size.x/2;
    y3.pos.y = 234;
    
    y.order = 2;
    y3.order = 3;

    y2.pos.x=cav.width/2 - y2.size.x/2;
    y2.pos.y=1142;

    

    y2.onclick = () => {
        Engine.switch_UI("game");
        currentGameState = gameStates.game;
        resetgame();           
    }    

    let y4 = new Button(images.home_btn,0,0);
    y4.pos.x = cav.width/2 - y4.size.x/2;
    y4.pos.y = 818;
    y4.onclick = ()=>{
        Engine.switch_UI("home");
        currentGameState = gameStates.menu;
        resetgame();
    }
    t.ui_entites.push(y4);


    t.ui_entites.push(y);
    t.ui_entites.push(y2);
    t.ui_entites.push(y3);    



    let tv = ()=>
    {  
    let lvl_info = window.SH.getLevelInfo();          
    cxt.fillStyle = text_color;            
    cxt.textAlign = "center";                    
    cxt.font = "70px GameFont";   
    cxt.fillText("Level "+lvl_info.level,cav.width/2,514);   
    cxt.font = "40px GameFont";               
    cxt.fillText("Highscore "+window.SH.getHighScore(),cav.width/2,558 );                     
    cxt.fillText(lvl_info.exp_next-lvl_info.exp+ " xp to level "+(lvl_info.level+1),cav.width/2,673 ); 
    cxt.textAlign = "start"; 
    
    let lw=Math.floor(382*(lvl_info.exp/lvl_info.exp_next));           
    Engine.roundedrectangle(cxt,169,596,382,28,"#ffffff");
    Engine.roundedrectangle(cxt,169,596,lw,28,text_color);
    }

    t.drawCalls.push(
        {
            call:tv,
            order:2
        }
    )
    t.drawCalls.push( {
        call:()=>{
            let y = new ImageData(1,1);
            const data = y.data;
            data[0]=255;
            data[1]=255;
            data[2]=255;
            data[3]=255;
            cxt.putImageData(y,0,0,0,0,cav.width,cav.height);
        },
        order:1.1
    })

    return t;
}

function howtoUI()
{
    let t = new UI_layout();
    let y = new Entity(images.Logo,0,0,true);
    let y2 = new Button(null,cav.width,cav.height);
    y2.draw = function(x){};

    var lines = [
        "Click to jump up",
        "Avoid falling down",
        "Sucessfull jumps award points",
    ]
    y.pos.x= cav.width/2 - y.size.x/2;
    y.pos.y=106;

    y2.pos.x=0;
    y2.pos.y=0;

    y2.onclick = () => {       
        Engine.switch_UI("game");
        currentGameState = gameStates.game;
    };    

    y.hover_check = true;    
    t.ui_entites.push(y);
    t.ui_entites.push(y2);

    t.drawCalls.push(
        {
            call:()=>
            {            
            cxt.fillStyle = text_color;            
            cxt.textAlign = "center";                    
            cxt.font = "85px GameFont";                    
            cxt.fillText("How To Play",cav.width/2,455);
            let count =0;
            cxt.font = "45px GameFont";  
            lines.forEach(element => {
                cxt.fillText(element,cav.width/2,625 + count*60);
                count++;
            });            
            cxt.textAlign = "start"; 
            },            
            order :2
        }
        )

    return t;
}

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

function adjustwrapper()
{
    Engine.checkMobile();
    SetOrientation();

    let client_dims = {width:wrapper.parentElement.clientWidth,height:wrapper.parentElement.clientHeight};
    let clientRatio = client_dims.width/client_dims.height;
    let matchingbool = clientRatio<= (cavMain.width/cavMain.height);

    

    if(!matchingbool)
    {  
        wrapper.style.height = client_dims.height+"px";
        wrapper.style.width = Math.floor((client_dims.height/cavMain.height)*cavMain.width)+"px"; 
    }
    else
    { 
        wrapper.style.width = client_dims.width+"px";
        wrapper.style.height = Math.floor((client_dims.width/cavMain.width)*cavMain.height)+"px";         
    }    
    wrapper.style.paddingTop="0px";
    wrapper.style.paddingTop = Math.floor((client_dims.height-wrapper.clientHeight)/2) + "px";

    cavMain.style.width ="100%";
    //cavMain.style.height ="100%";

    if(ismobile)
    {
        let ratio =  client_dims.height/(cavMain.height);
        let mobile_orientation = client_dims.width<client_dims.height?0:1;
        
        console.log("mobile in");
        if(mobile_orientation==game_orientation)
        {
            console.log("orientation matched");
            if(currentGameState == gameStates.orientation)
            {
                console.log("orientation fixed");
                currentGameState = previoustate!=null?previoustate:gameStates.main;
                
                switch(currentGameState)
                {
                    case gameStates.menu:
                        Engine.switch_UI("home");
                        break;
                    case gameStates.pause:
                        Engine.switch_UI("pause");
                        break;
                    case gameStates.game:
                        Engine.switch_UI("game");
                        break;
                    case gameStates.gameover:
                        Engine.switch_UI("gameover");
                        break;
                    default:
                        Engine.switch_UI("game");
                        break;
                }  
            }
        }
        else
        {
            console.log("orientation not matched");
            orientation_conflict = game_orientation==0?0:1;
            if(currentGameState!=gameStates.orientation)
            {
                previoustate = currentGameState;
            }
            currentGameState = gameStates.orientation;
            adjustWrapperByRatio();
        }
    }

    let temp = cavMain.getBoundingClientRect();
    canvasOffset.x = temp.left;
    canvasOffset.y = temp.top;
    canvasOffset.xx= temp.right;
    canvasOffset.yy= temp.bottom;

    if(Engine.backgroundMode==0)
    {
        DrawBackground();
    }
}

function adjustWrapperByRatio()
{
    let client_dims = {width:wrapper.parentElement.clientWidth,height:wrapper.parentElement.clientHeight};
    let clientRatio = client_dims.width/client_dims.height;
    
    let target_dims = (client_dims.width<=client_dims.height)?{width:720,height:1280}:{width:1280,height:720};
    cavMain.width = target_dims.width;
    cavMain.height = target_dims.height;   
        
        
    let matchingbool = clientRatio<= (target_dims.width/target_dims.height);
    
    
   

    if(!matchingbool)
    {
        wrapper.style.height = client_dims.height+"px";
        wrapper.style.width = Math.floor((client_dims.height/target_dims.height)*target_dims.width)+"px"; 
    }
    else
    {
        
        wrapper.style.width = client_dims.width+"px";
        wrapper.style.height = Math.floor((client_dims.width/target_dims.width)*target_dims.height)+"px"; 
        wrapper.style.paddingTop = Math.floor((client_dims.height-wrapper.clientHeight)/2) + "px";
    }    
    wrapper.style.paddingTop="0px";
    wrapper.style.paddingTop = Math.floor((client_dims.height-wrapper.clientHeight)/2) + "px";

    cavMain.style.width ="100%";
    //cavMain.style.height ="100%";
}

//loading game 
var images;
let resources_paths = [];

let y = document.createElement("img");
y.src = "./assets/sprites/Splash.png";

window.onload = () => {   
    adjustWrapperByRatio();

    for (let [key, value] of Object.entries(images)) {
        resources_paths.push(value);
    }

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
        if(counter>=2000 && window.resources.resourcesloadedcount == window.resources.resourcescount)
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
        let delta =  (window.resources.resourcesloadedcount/window.resources.resourcescount)< counter/2000?(window.resources.resourcesloadedcount/window.resources.resourcescount):counter/2000;
        tempcxt.fillRect(0,cavMain.height-10, delta*cavMain.width,10);
        tempcxt.fillStyle = "#000000";
        tempcxt.font =  "BOLD 30px Roboto"
        tempcxt.fillText(Math.ceil( delta*100) + "%",cavMain.width*0.88,cavMain.height - 25);
        counter += counter<2000?10:0;                
        }
    }, 10);    
};

var cavMain = document.getElementById("main_canvas");
var wrapper = document.getElementById("game_wrapper");
var bg_canvas = document.getElementById("bg_canvas");


function SetOrientation()
{
    cavMain.width = game_orientation==0?720:1280;
    cavMain.height = game_orientation==0?1280:720;
    bg_canvas.width = cav.width;
    bg_canvas.height=cav.height;
    bg_canvas.style.height= "100%";
    bg_canvas.style.width= "100%";
}

var currentGameState;
var previoustate;
var orentationConflict;

//dt related variables
var last_time =0;
var dt = 0;

function updateDT(){
    let now = Date.now();
    dt = (now - last_time)/1000;
    last_time = now;
    dt *= Engine.timeScale;
}

//game properties
var game_properties_initial;
var game_properties;

//viewport
var mainviewport;
//text color
var button_color;
var text_color;
var outline_color;
var score_color;
var notification_color;
var ScoreOutline = false;

//pause during visibility change
var onGameVisibilityChangePause = ()=>{};
document.addEventListener("visibilitychange", function() { 
    if(document.hidden){
        Howler.mute(true);
    } 
    if(!document.hidden)
    {
        last_time=Date.now();
        Howler.mute(false);
    }
});

// notifications
class Notifications extends Entity{
    constructor(duration=5,title="Level Up")
    {
        super(images.board);
        this.order = 2.5;
        this.pos.x = cav.width/2-this.size.x/2;
        this.pos.y = -this.size.y;
        this.title = title;
        this.main = "";
        this.sub= "";
        this.duration=duration;
        this.timer =0;
        this.state =0;
        this.ui = true;
        
        this.update =()=>{
            switch(this.state)
            {
                case 0:
                    this.pos.y += dt * 300;                    
                    if(this.pos.y>77)
                    {
                        this.pos.y = 77;
                        this.state=1;
                    }
                    break;
                case 1:
                    this.duration -= dt;
                    if(this.duration<=0)
                    {
                        this.state =2;
                    }
                    break;
                case 2:
                    this.pos.y -= dt * 300;
                    if(this.pos.y <= -this.size.y)
                    {
                        this.remove();
                    }
                    break;
                default:
                    break;
            }
            window.drawCall(()=>{
                cxt.fillStyle = notification_color;            
                cxt.textAlign = "center";                    
                cxt.font = "30px GameFont";                    
                cxt.fillText(this.title,this.pos.x+this.size.x/2,this.pos.y + 36 );
                cxt.font = "70px GameFont"; 
                cxt.fillText(this.main,this.pos.x+this.size.x/2,this.pos.y + 116 );
                cxt.font = "35px GameFont";
                cxt.fillText(this.sub,this.pos.x+this.size.x/2,this.pos.y + 164 );
            },2.51
            )
        }
    }
}

Engine.notify=function(params)
{
    var {duration,title,main,sub}=params;
    let y = new Notifications(duration);
    y.title = title;
    y.main = main;
    y.sub = sub;
    Engine.notifications.push(y);
}

//Score
var score_init = function(){
    (function(){

        var Score=0;
        var highScoreEvents=[];
        var HighScore=0;
        var totalScore=0;
        var highscoreFired=false;
        var level = 0;
        var expToNext=0;
        var currentExp=0;
    
        function addListeners(l)
        {
            if(highScoreEvents.indexOf(l)<0)
            {
                highScoreEvents.push(l);
            }
        }
    
        function init()
        {
            if(!window.localStorage.getItem("highscore"+NAME))
            {
                window.localStorage.setItem("highscore"+NAME,0);
            }
            else
            {
                HighScore = window.localStorage.getItem("highscore"+NAME);
            }
            HighScore = parseInt(HighScore);
    
            if(!window.localStorage.getItem("totalscore"+NAME))
            {
                window.localStorage.setItem("totalscore"+NAME,0);
            }
            else
            {
                totalScore = window.localStorage.getItem("totalscore"+NAME);
            }
    
            totalScore = parseInt(totalScore);
            calc_Level();


            addListeners( ()=>{
                let s = window.SH.getScore();
                Engine.notify({
                    duration:2,
                    title:"New High Score",
                    main : s,
                    sub : "Nice!",
                });
            } )
        }

        function calc_Level(){
            expToNext = game_properties.base_exp;
            let exp = totalScore;
            let l =0;
            exp -= expToNext;
            while(exp>=0)
            {
                l++;
                expToNext = Math.floor(expToNext*1.1);
                exp-= expToNext;
            }        
            level =l;
            currentExp = exp + expToNext;          
        }
    
        function addScore(amount)
        {
            Score += amount;
            game_properties.Score = Score;


    
            if(Score>HighScore && !highscoreFired)
            {
                highScoreEvents.forEach(e=>{
                    e();
                })
                highscoreFired=true;
            }

            currentExp += amount;
            if(currentExp/expToNext >=1)
            {
                level+=1;
                currentExp -= expToNext;
                expToNext = Math.floor(expToNext*1.1);
                
                
                Engine.notify({
                    duration:2,
                    title:"Level Up",
                    main :"Level "+level,
                    sub: expToNext - currentExp + " XP to level " + (level+1),
                })
            }
            
        }
    
        function getScore()
        {
            return Score;
        }


        function getLevelInfo(){
            return {
                level: level,
                exp : currentExp,
                exp_next : expToNext,
            };
        }
    
        function getTotalScore(){
            return totalScore;
        }
    
        function getHighScore()
        {
            return HighScore;
        }
    
        function resetScore()
        {
            Score=0;
            highscoreFired=false;
        }
    
        function submitScore(){
            totalScore += Score;
            window.localStorage.setItem("totalscore"+NAME,totalScore);
    
            highScore = getHighScore();
            if(Score>HighScore)
            {
                window.localStorage.setItem("highscore"+NAME,Score);
                HighScore = Score;
            }

            calc_Level();
        }
        
        window.SH ={
            init: init,
            addScore : addScore,
            getScore : getScore,
            getHighScore : getHighScore,
            resetScore : resetScore,
            submitScore : submitScore,
            addhighScoreEvent : addListeners,
            getTotalScore : getTotalScore,
            getLevelInfo:getLevelInfo,
        }
    })();
}

Engine.roundedrectangle = function(context=cxt,x,y,width,height,color)
{
    if(width<=0 || height<=0)
    {
        return;
    }
    var c=color;
    if(typeof color == "string")
    {
        c = hexToRgb(color);
    }
    var w = width;
    width = width-height;
    

    const imagedata= cxt.getImageData(x,y,w, height);
    const data = imagedata.data;
    const left_center = [ ((height/2)-1),((height/2)-1)];
    const right_center = [ ((height/2)-1+width),((height/2)-1)];

    for(var i=0;i< data.length;i+=4)
    {
        let coord = [ 
            ((i/4) % w),
            Math.floor((i/4)/w)
        ]
        
        if(coord[0]< left_center[0] )
        {
            let d = distance(left_center,coord);
            let off = d-(height/2);
            if(off<0)
            {
                data[i]=c.r;
                data[i+1]=c.g;
                data[i+2]=c.b;
                data[i+3]=255;
            }            
            
        }
        else if(coord[0] > right_center[0])
        {
            let d = distance(right_center,coord);
            let off = d-(height/2);
            if(off<0)
            {
                data[i]=c.r;
                data[i+1]=c.g;
                data[i+2]=c.b;
                data[i+3]=255;
            }     
        }
        else
        {
            data[i]=c.r;
            data[i+1]=c.g;
            data[i+2]=c.b;
            data[i+3]=255;
        }
    }
    imagedata.data = data;
    context.putImageData(imagedata, x, y);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

function distance (p1,p2)
{
    return Math.sqrt(Math.pow( p1[0]-p2[0],2)+ Math.pow( p1[1]-p2[1],2));
}

function prepareButton(url)
{
    let y = document.createElement("canvas");
    y.width = 66;
    y.height = 66;

    let y2 = y.getContext("2d");
    y2.fillStyle=button_color;
    y2.fillRect(0,0,66,66);
    y2.drawImage(window.resources.get(url),0,0,66,66);
    window.resources.set(url,y);
}
