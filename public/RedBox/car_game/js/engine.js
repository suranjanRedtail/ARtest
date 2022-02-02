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
    Rendering.draw(entity.draw,entity.order);
};

//resources
(function () {

    var loaded_Resources = [];
    var callBacks = [];
     
    function load(urlOrArray)
    {
        if(urlOrArray instanceof Array)
        {
            urlOrArray.forEach(function(url)
            {
                _load(url);
            }
            );           
        }
        else 
        _load(urlOrArray);
    }

    function _load(url)
    {
        if(loaded_Resources[url])
        {
            return loaded_Resources[url];
        }        
        else
        {
            var tempimp = new Image();
            tempimp.onload = function(){

                loaded_Resources[url] = tempimp;

                if(isready()){
                    callBacks.forEach(function(k){k();})
                }
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
        isready : isready
    };
}());

//Physics Functions
(function ()
{
  function checkCollision(obj1,obj2)
  {
    if(obj1 instanceof Entity && obj1 instanceof Entity){
        if(obj1.pos.x < obj2.pos.x + obj2.size.x && obj1.pos.x + obj1.size.x > obj2.pos.x &&
            obj1.pos.y < obj2.pos.y + obj2.size.y && obj1.pos.y + obj1.size.y > obj2.pos.y)
        {       
            return true;
        }
    }
        return false;
  }

  window.physics = {
      checkCollision : checkCollision
  }
}
)();

class Sprite 
{
    constructor(image, posX, posY, width, height) {
        if(typeof image == "string")
        {
            this.image = resources.get(image);             
        }
        else
        {
            this.image = image;            
        }
        this.posX = posX;
        this.posY = posY;
        if(width == height && width ==0)
        {
            this.width = this.image.width;
            this.height = this.image.height;
        }
        else
        {
        this.width = width;
        this.height = height;
        }
        this.draw = (context, x, y, w, h) => 
        {
            context.drawImage(this.image, this.posX, this.posY, this.width, this.height, x, y, w, h);
        };

        this.update = () =>
        {
        };
    }
}



function SpriteAnimation(image,posX,posY,keyframes,width,height,rate,speed)
{
    if(typeof image == "string")
    {
        this.image = resources.get(image);             
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
    this.play = true;
    this.done = false;
    this.loop = true;
    
    this.update = () => {
        if(this.play && !this.done)
        {
        this.currentframe += this.rate * dt * this.speed;
        }
    }
    this.draw = (context, x, y, w, h) => { 
        if(!this.done){
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

    this.play=()=>{
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

function Entity(sprite,sizeX,sizeY)
{
    if(sprite instanceof Sprite || sprite instanceof SpriteAnimation)
    {
        this.sprite = sprite;
        
    }
    else
    {
        this.sprite = new Sprite(sprite,0,0,0,0);
    }
    this.pos = {x:0,y:0};
    this.order = 0;
    this.enabled = true;
    if(sizeX==sizeY && sizeX==0)
    {
        this.size =
        {
            x:this.sprite.width,
            y:this.sprite.height,
        }
    }
    else
    {
    this.size = {x:sizeX,y:sizeY};
    }

    this.updateMain = () => 
    {
        if(this.enabled){
        this.sprite.update();
        this.update();
        }
    };
    this.update =()=>{};


    this.draw = (context) =>
    {
        if(this.enabled && !this.done){
        this.sprite.draw(context,this.pos.x,this.pos.y,this.size.x,this.size.y);  
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
        this.sprite.image = resources.get(sprite);
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
