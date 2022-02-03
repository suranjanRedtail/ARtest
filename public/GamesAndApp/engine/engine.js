Howler.html5PoolSize = 10;
var gamesandapp = false;

getArrayFromRange = (Lower, Higher) => {
    if (Lower < Higher) {
        let temp = [];
        for (let i = Lower; i <= Higher; i++) {
            temp.push(i);
        }
        return temp;
    }
    else {
        console.log("stop being a Pepega :/");
    }
};
//draw calls
(function () {
    var DrawCall = [];
    var context;

    function setContext(cxt) {
        context = cxt;
    }
    function draw(call, order) {
        DrawCall.push({ call: call, order: order });
    }
    function renderDrawCalls() {
        DrawCall.sort((a, b) => a.order - b.order);
        DrawCall.forEach((x) => {
            var { call } = x;
            call(context);
        });
        DrawCall = [];
    }

    window.Rendering = {
        draw: draw,
        renderDrawCalls: renderDrawCalls,
        setContext: setContext,
    }
})();

window.draw = (entity) => {
    if (Engine.renderingEntityAABBCheck) {
        let top_left = { x: entity.pos.x - entity.pivot.x, y: entity.pos.y - entity.pivot.y };
        if (entity.ui) {

            if (window.Physics.checkAABB(top_left, { x: top_left.x + entity.sizeDisplayAABB.x, y: top_left.y }, { x: top_left.x, y: top_left.y + entity.sizeDisplayAABB.y }, { x: 0, y: 0 }, { x: mainviewport.width, y: 0 }, { x: 0, y: mainviewport.height })) {
                window.Rendering.draw(entity.draw, entity.order);
                entity.drawCalls.forEach(e => {
                    window.Rendering.draw(e.fn, e.order);
                });
            }
        }
        else {
            if (window.Physics.checkAABB(top_left, { x: top_left.x + entity.sizeDisplayAABB.x, y: top_left.y }, { x: top_left.x, y: top_left.y + entity.sizeDisplayAABB.y }, { x: mainviewport.posx, y: mainviewport.posy }, { x: mainviewport.posx + mainviewport.width, y: mainviewport.posy }, { x: mainviewport.posx, y: mainviewport.posy + mainviewport.height })) {
                window.Rendering.draw(entity.draw, entity.order);
                entity.drawCalls.forEach(e => {
                    window.Rendering.draw(e.fn, e.order);
                });
            }
        }
    }
    else {
        window.Rendering.draw(entity.draw, entity.order);
        entity.drawCalls.forEach(e => {
            window.Rendering.draw(e.fn, e.order);
        });
    }
};

window.drawCall = (call, order) => {
    window.Rendering.draw(call, order);
}

//mobile check
var ismobile = false;
window.isMobileCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};


var audiourls = [];
//resources
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
(function () {

    var resourcesloadedcount = 0;
    var resourcescount = 0;
    var loaded_Resources = [];
    var callBacks = [];
    var loadnext = true;


    function load(urlOrArray, mode = true) {
        if (urlOrArray instanceof Array) {
            window.resources.resourcescount += window.resources.resourcescount == 0 ? urlOrArray.length : 0;

            urlOrArray.forEach(e => {
                _load(e, 0, false);
            })

        }

    }

    function _load(urlArray, index, mode = "true") {
        let url;

        url = urlArray;

        if (typeof url == "object") {
            let tempimp = new Howl({
                src: url.src,
                sprite: url.sprites,
                onload: function () {
                    window.resources.resourcesloadedcount += loaded_Resources[url] ? 0 : 1;
                    loaded_Resources[url] = tempimp;
                }
            });
        }
        else {
            if (loaded_Resources[url]) {
                return loaded_Resources[url];
            }
            else {
                var tempimp;
                let loadaudio = () => {
                    let timeout = 0;

                    if (iOS) {
                        /*tempimp.addEventListener("loadedmetadata", 
                        ()=>{
                            window.resources.resourcesloadedcount +=loaded_Resources[url]?0:1;
                            loaded_Resources[url] = tempimp;
                        }); */

                        setTimeout(() => {
                            window.resources.resourcesloadedcount += loaded_Resources[url] ? 0 : 1;
                            loaded_Resources[url] = tempimp;
                        }
                            , 1000);
                    }
                    else {
                        let tinterval = setInterval(() => {
                            timeout += 100;
                            if (tempimp.readyState >= 2) {
                                window.resources.resourcesloadedcount += loaded_Resources[url] ? 0 : 1;
                                loaded_Resources[url] = tempimp;
                                clearInterval(tinterval);
                                console.log(tempimp.readyState, tempimp.src, timeout / 1000);
                            }
                            if (timeout > 25000) {
                                console.log("Timeout! " + tempimp.src + " wasn't loaded.");
                                //document.location.reload();
                                clearInterval(tinterval);
                            }
                        }, 500);
                    }
                }
                let loadimage = () => {
                    tempimp.onload = function () {
                        window.resources.resourcesloadedcount += loaded_Resources[url] ? 0 : 1;
                        loaded_Resources[url] = loaded_Resources[url] ? loaded_Resources[url] : tempimp;
                    }
                }
                let turl = url.slice(-3).toLowerCase();

                switch (turl) {
                    case "png":
                    case "bmp":
                    case "jpg":
                        tempimp = document.createElement("img");
                        loadimage();
                        break;
                    case "mp3":
                    case "ogg":
                    case "wav":
                        tempimp = new Howl({
                            src: url,
                            onload: function () {
                                window.resources.resourcesloadedcount += loaded_Resources[url] ? 0 : 1;
                                loaded_Resources[url] = tempimp;
                            }
                        });
                        //loadaudio();
                        break;
                    default:
                        tempimp = new Image();
                        loadimage();
                        break;
                }
                loaded_Resources[url] = false;
                tempimp.src = url;
            }
        }
    }

    function get(url) {
        return loaded_Resources[url];
    }

    function addcallback(callback) {
        callBacks.push(callback);
    }

    function isready() {
        var ready = true;
        for (var k in loaded_Resources) {
            if (loaded_Resources.hasOwnProperty(k) &&
                !loaded_Resources[k]) {
                ready = false;
            }
        }
        return ready;
    }

    function set(url, resource) {
        if (loaded_Resources[url]) {
            loaded_Resources[url] = resource;
        }
    }

    window.resources = {
        load: load,
        get: get,
        addcallback: addcallback,
        isready: isready,
        resourcesloadedcount: resourcesloadedcount,
        resourcescount: resourcescount,
        loaded_Resources: loaded_Resources,
        set: set,
    };
}());


//Physics Functions
(function () {
    function checkCollision(obj1, obj2) {
        if (obj1.enabled && obj2.enabled) {
            if (obj1 instanceof Entity && obj1 instanceof Entity) {
                if (obj1.pos.x - obj1.pivot.x < obj2.pos.x - obj2.pivot.x + obj2.size.x && obj1.pos.x - obj1.pivot.x + obj1.size.x > obj2.pos.x - obj2.pivot.x &&
                    obj1.pos.y - obj1.pivot.y < obj2.pos.y - obj2.pivot.y + obj2.size.y && obj1.pos.y - obj1.pivot.y + obj1.size.y > obj2.pos.y - obj2.pivot.y) {
                    return true;
                }
            }
        }
        return false;
    }

    function checkCollisionPoint(element, { x, y }) {
        if (element.pos.x < x && element.pos.x + element.size.x > x &&
            element.pos.y < y && element.pos.y + element.size.y > y) {
            return true;
        }
        return false;
    }

    function checkCollisionCircle(obj1, obj2) {
        if (obj1 instanceof Entity && obj1 instanceof Entity) {
            let dist = Math.sqrt(Math.pow(obj1.center.x - obj2.center.x, 2) + Math.pow(obj1.center.y - obj2.center.y, 2));
            if (dist <= obj1.radius + obj2.radius) {
                return true;
            }
        }
        return false;
    }

    function checkOverlapX_Length(obj1, obj2) {
        if (checkCollision(obj1, obj2)) {
            if (obj1.size.x >= obj2.size.x) {
                if (obj2.pos.x + obj2.size.x <= obj1.pos.x + obj1.size.x) {
                    if (obj2.pos.x < obj1.pos.x) {
                        return Math.abs(obj2.pos.x + obj2.size.x - obj1.pos.x);
                    }
                    else {
                        return Math.abs(obj2.size.x);
                    }
                }
                else {
                    return Math.abs(obj1.pos.x + obj1.size.x - obj2.pos.x);
                }
            }
            else {
                let l = obj1;
                if (l.pos.x + l.size.x <= obj2.pos.x + obj2.size.x) {
                    if (l.pos.x < obj2.pos.x) {
                        return Math.abs(l.pos.x + l.size.x - obj2.pos.x);
                    }
                    else {
                        return Math.abs(l.size.x);
                    }
                }
                else {
                    return Math.abs(obj2.pos.x + obj2.size.x - l.pos.x);
                }
            }


        }
        return -1;
    }

    function checkAABB(p01, p02, p04, p11, p12, p14) {
        if (p01.x < p12.x && p02.x > p11.x && p01.y < p14.y && p04.y > p11.y) {
            return true;
        }
        return false;
    }


    function Circle_Rectangle(circle, rect) {
        try {
            if (rect.rotation !== 0) {
                let angle = (rect.rotation / 180) * Math.PI;
                let ncenter = {
                    x: ((circle.center.x - rect.pos.x) * Math.cos(angle)) - ((circle.center.y - rect.pos.y) * Math.sin(angle)) + rect.pos.x,
                    y: ((circle.center.y - rect.pos.y) * Math.cos(angle)) + ((circle.center.x - rect.pos.x) * Math.sin(angle)) + rect.pos.y
                }
                let result = Circle_Rectangle(
                    { center: ncenter, radius: circle.radius },
                    {
                        pos: rect.pos,
                        size: rect.size,
                        pivot: rect.pivot,
                        rotation: 0,
                    }
                );

                result[1] = [
                    (((result[1][0] - rect.pos.x) * Math.cos(-angle)) - ((result[1][1] - rect.pos.y) * Math.sin(-angle))) + rect.pos.x,
                    (((result[1][1] - rect.pos.y) * Math.cos(-angle)) + ((result[1][0] - rect.pos.x) * Math.sin(-angle))) + rect.pos.y
                ];
                result[2] = [
                    (((result[2][0]) * Math.cos(-angle)) - ((result[2][1]) * Math.sin(-angle))),
                    (((result[2][1]) * Math.cos(-angle)) + ((result[2][0]) * Math.sin(-angle)))
                ];
                return result;
            }
            else {
                let xextrim = [rect.pos.x - rect.pivot.x, rect.pos.x + rect.size.x - rect.pivot.x];
                let yextrim = [rect.pos.y - rect.pivot.y, rect.pos.y + rect.size.y - rect.pivot.y];
                let closestpoint = [
                    clamp(circle.center.x, xextrim[0], xextrim[1]),
                    clamp(circle.center.y, yextrim[0], yextrim[1]),
                ]
                let normal = [0, 0];
                let left, right, top, bottom;

                left = closestpoint[0] == xextrim[0] ? 1 : 0;
                right = closestpoint[0] == xextrim[1] ? 1 : 0;
                top = closestpoint[1] == yextrim[1] ? 1 : 0;
                bottom = closestpoint[1] == yextrim[0] ? 1 : 0;

                let sum = left + right + top + bottom;
                if (sum >= 2) {
                    normal = [circle.center.x - closestpoint[0], circle.center.y - closestpoint[1]];
                    let dist = Math.sqrt(Math.pow(normal[0], 2) + Math.pow(normal[1], 2));
                    normal[0] /= dist;
                    normal[1] /= dist;
                }
                else {
                    if (left == 1) {
                        normal = [-1, 0];
                    }
                    if (right == 1) {
                        normal = [1, 0];
                    }
                    if (top == 1) {
                        normal = [0, 1];
                    }
                    if (bottom == 1) {
                        normal = [0, -1];
                    }
                }

                if ((closestpoint[0] < xextrim[1] && closestpoint[0] > xextrim[0]) && (closestpoint[1] < yextrim[1] && closestpoint[1] > yextrim[0])) {
                    normal = [circle.center.x - rect.pos.x, circle.center.y - rect.pos.y];
                    let dist = Math.sqrt(Math.pow(normal[0], 2) + Math.pow(normal[1], 2));
                    normal[0] /= dist;
                    normal[1] /= dist;
                    return [true, closestpoint, normal];

                }

                if (distance([circle.center.x, circle.center.y], closestpoint) <= circle.radius) {
                    return [true, closestpoint, normal];
                }

                return [false, closestpoint, normal];
            }
        } catch (error) {
            console.log("what da " + error);
        }
    }

    window.Physics = {
        checkCollisionPoint: checkCollisionPoint,
        checkCollision: checkCollision,
        checkOverlapX_Length: checkOverlapX_Length,
        checkCollisionCircle: checkCollisionCircle,
        checkAABB: checkAABB,
        CircleRectangle: Circle_Rectangle,
    }
}
)();

class Sprite {
    constructor(image, posX = 0, posY = 0, width = 0, height = 0) {
        this.ispixel = false;
        if (typeof image == "string") {
            this.image = window.resources.get(image);
        }
        else {
            this.image = image;
        }
        this.posX = posX;
        this.posY = posY;
        if (width == 0) {
            this.width = this.image.width;
            this.height = this.image.height;
        }
        else {
            this.width = width;
        }
        if (height == 0) {
            this.height = this.image.height;
        }
        else {
            this.height = height;
        }
        this.draw = (context, x, y, w, h) => {
            context.imageSmoothingEnabled = !this.ispixel;
            context.drawImage(this.image, this.posX, this.posY, this.width, this.height, x, y, w, h);
        };

        this.update = () => {
        };
    }
}

function SpriteAnimation(image, posX, posY, keyframes, width, height, rate, speed) {
    this.ispixel = false;
    if (typeof image == "string") {
        this.image = window.resources.get(image);
    }
    else {
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
        if (this.play && !this.done) {
            this.currentframe += this.rate * dt * this.speed;
            this.currentframe_modded = this.currentframe % this.keyframes.length;
        }
    }
    this.draw = (context, x, y, w, h) => {
        if (!this.done) {

            context.imageSmoothingEnabled = !this.ispixel;

            let _frame = Math.floor(this.currentframe);
            if (!this.loop && this.currentframe >= keyframes.length) {
                _frame = this.keyframes.length - 1;
                this.done = true;
            }
            _frame = _frame % this.keyframes.length;

            let tpos = { x: this.posX, y: this.posY };
            tpos.x = this.keyframes[_frame] * width;
            context.drawImage(this.image, tpos.x, tpos.y, this.width, this.height, x, y, w, h);
        }
    };

    this.Play = () => {
        this.play = true;
    }
    this.pause = () => {
        this.play = false;
    }

    this.toggle = () => { this.play = !this.play; };

    this.reset = () => {
        this.currentframe = 0;
        this.done = false;
    }
}

function Entity(sprite, sizeX = 0, sizeY = 0, ui = false) {
    if (sprite instanceof Sprite || sprite instanceof SpriteAnimation) {
        this.sprite = sprite;

    }
    else if (sprite != null) {
        this.sprite = new Sprite(sprite, 0, 0, 0, 0);
    }
    this.ui = ui;
    this.pos = { x: 0, y: 0 };
    this.order = 0;
    this.enabled = true;
    this.opacity = 1;
    this.pivot = { x: 0, y: 0 };
    this.rotation = 0;
    this.horizontalflip = false;
    this.verticalflip = false;
    this.size =
    {
        x: 0,
        y: 0,
    }
    this.remove_next_call = false;

    if (sizeX == 0) {
        this.size.x = this.sprite.width;

    }
    else {
        this.size.x = sizeX;
    }

    if (sizeY == 0) {
        this.size.y = this.sprite.height;
    }
    else {
        this.size.y = sizeY;
    }

    this.sizeDisplayAABB = Object.assign({}, this.size);

    this.updateMain = () => {
        if (this.enabled) {
            if (sprite != null) {
                this.sprite.update();
            }
            this.update();
        }
    };
    this.update = () => { };

    this.init = () => { };

    this.draw = (context) => {
        if (this.enabled && !this.done) {
            context.save();


            if (this.opacity < 1) {
                context.globalAlpha = this.opacity;
            }
            else if (this.opacity <= 0) {
                return;
            }

            if (this.ui) {
                context.translate(this.pos.x, this.pos.y);
                context.rotate(-1 * this.rotation * Math.PI / 180);
                if (this.horizontalflip) { context.scale(-1, 1) };
                if (this.verticalflip) { context.scale(1, -1) };
                this.sprite.draw(context, -this.pivot.x, -this.pivot.y, this.size.x, this.size.y);
            }
            else {
                context.translate(this.pos.x - mainviewport.posx, this.pos.y - mainviewport.posy);
                context.rotate(-1 * this.rotation * Math.PI / 180);
                if (this.horizontalflip) { context.scale(-1, 1) };
                if (this.verticalflip) { context.scale(1, -1) };
                this.sprite.draw(context, -this.pivot.x, -this.pivot.y, this.size.x, this.size.y);
            }

            context.restore();
        }
    }

    this.drawCalls = [];

    this.setOrder = (order) => {
        this.order = order;
    };

    this.setSprite = (sprite) => {
        if (this.sprite instanceof Sprite) {
            if (typeof sprite == "string") {
                this.sprite.image = window.resources.get(sprite);
            }
            else if (sprite instanceof Sprite) {
                this.sprite.image = sprite;
            }
        }
        else {
            this.sprite = new Sprite(sprite, 0, 0, 0, 0);
        }
    }
    this.remove = function () {
        this.remove_next_call = true;
    }

    this.centerPivot = () => {
        this.pivot.x = this.size.x / 2;
        this.pivot.y = this.size.y / 2;
    }
}

class Button extends Entity {
    constructor(sprite, sizeX, sizeY) {
        super(typeof sprite == "string" || sprite == null ? sprite : sprite[0], sizeX, sizeY);
        this.onhover = () => { };
        this.onclick = () => { };
        this.order = 10;
        this.ui = true;
        this.clickable = true;

        this.hover_check = true;
        if (typeof sprite == "object" && sprite != null) {
            this.sprites = [];
            sprite.forEach(e => {
                this.sprites.push(new Sprite(window.resources.get(e), 0, 0, 0, 0));
            })
        }

    }
}

class ViewPort {
    constructor(posx, posy, width, height) {
        this.posx = posx;
        this.posy = posy;
        this.width = width;
        this.height = height;
        this.zoomValue = 1;
        this.xmin = this.posx,
            this.xmax = this.posx + this.width;
        this.ymin = this.posy,
            this.ymax = this.posy + this.height;
        this.target = null;
        this.targetoffset = null;
        this.lock_x = false;
        this.lock_y = false;
        this.update_fns = [];
        this.update = () => {
            this.update_fns.forEach(e => {
                e();
            });

            if (this.target != null) {
                let dx = (this.target.pos.x - this.targetoffset[0]) - this.posx;
                let dy = (this.target.pos.y - this.targetoffset[1]) - this.posy;
                if (!this.lock_x) {
                    this.posx += Math.abs(dx) <= 1 ? dx : dx * 0.1;
                }
                if (!this.lock_y) {
                    this.posy += Math.abs(dy) <= 1 ? dy : dy * 0.1;
                }
            }
            this.xmin = this.posx,
                this.xmax = this.posx + this.width;
            this.ymin = this.posy,
                this.ymax = this.posy + this.height;
        }

        this.set_target = (target) => {
            this.target = target;
            this.targetoffset = [target.pos.x - this.posx, target.pos.y - this.posy];
        }
    }
}

class UI_layout {
    constructor() {
        this.ui_entites = [];
        this.drawCalls = [];
        this.drawcallopacity = 1;
        //this.drawcallopacity = 1;        
    }
}

class cAnimation {
    constructor(duration, call, onend, timefunc, rule, loop = false) {
        this.rule = rule;
        this.time = 0;
        this.progress = 0;
        this.die = (do_onend = false) => {
            Engine.Animations.splice(Engine.Animations.indexOf(this), 1);
            if (onend && do_onend) {
                onend();
            }
        }
        this.tick = (delta) => {
            if (this.rule != null) {
                this.time += this.rule(delta);
            }
            else {
                this.time += delta;
            }
            this.progress = Math.min(this.time / duration, 1);

            if (timefunc != null) {
                call({ delta: delta, progress: timefunc(this.progress) });
            }
            else {
                call({ delta: delta, progress: this.progress });
            }

            if (this.progress >= 1) {
                if (loop) {
                    this.progress = 1 - this.progress;
                }
                else {
                    this.die(true);
                }
            }
        }
        Engine.Animations.push(this);
    }
}

var current_hover_obj = null;

function onhovercheck(posX = mousePos[0], posY = mousePos[1]) {
    let templist = [];
    if (Engine.current_UI) {
        Engine.current_UI.ui_entites.forEach(element => {

            if (element.hover_check && element.pos.x - element.pivot.x < posX && element.pos.x + element.size.x - element.pivot.x > posX &&
                element.pos.y - element.pivot.y < posY && element.pos.y + element.size.y - element.pivot.y > posY) {
                templist.push(element);
            }
        });
    }

    templist.sort((a, b) => b.order - a.order);
    if (templist.length > 0) {
        current_hover_obj = templist[0];
    }
    else {
        current_hover_obj = null;
    }
    return templist[0];
}

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

var Engine = {};
Engine.minGestureDistance = 100;
Engine.minGestureTime = 50;
Engine.onSwipeUp = [];
Engine.onSwipeDown = [];
Engine.onSwipeLeft = [];
Engine.onSwipeRight = [];
Engine.onSwipe = [];
Engine.onMouseUp = [];
Engine.onClick = [];
Engine.timeScale = 1;
Engine.notifications = [];
Engine.renderingEntityAABBCheck = true;
Engine.Animations = [];

Engine.initAudioSettings = function () {
    audio_settings_obj = function () {
        this.music = true;
        this.sfx = true;
        this.togglemusic = function (l) {
            if (l) {
                this.music = true;
                localStorage.setItem(NAME + "music", "y");
                unmute(music_group);
            }
            else {
                this.music = false;
                localStorage.setItem(NAME + "music", "n");
                mute(music_group);
            }
        }

        this.togglesfx = function (l) {
            if (l) {
                this.sfx = true;
                localStorage.setItem(NAME + "sfx", "y");
                unmute(effects_group);
            }
            else {
                this.sfx = false;
                localStorage.setItem(NAME + "sfx", "n");
                mute(effects_group);
            }
        }

        if (localStorage.getItem(NAME + "music") == "y") {
            this.music = true;
        }
        else if (localStorage.getItem(NAME + "music") == "n") {
            this.togglemusic(false);
        }
        else {
            this.music = true;
            localStorage.setItem(NAME + "music", "y");
        }

        if (localStorage.getItem(NAME + "sfx") == "y") {
            this.sfx = true;
        }
        else if (localStorage.getItem(NAME + "sfx") == "n") {
            this.togglesfx(false);
        }
        else {
            this.sfx = true;
            localStorage.setItem(NAME + "sfx", "y");
        }


        return this;
    }();
}

Engine.checkMobile = () => {
    ismobile = window.isMobileCheck();
}

Engine.current_UI = null;

Engine.switch_UI = (_layout, skipout = false, skipanim = false) => {



    let tlayout;
    if (typeof _layout == "string") {
        tlayout = ui_list[_layout];
    }
    else {
        tlayout = _layout;
    }

    if (Engine.current_UI == tlayout) {
        return;
    }

    //let tcurrent = ui_list.indexOf(Engine.current_UI);
    if (skipanim) {
        Engine.current_UI = tlayout;
        return;
    }


    if (Engine.current_UI != null) {
        if (skipout) {
            layoutInSide(tlayout);
            Engine.current_UI = tlayout;
        }
        else {
            layoutOutSide(Engine.current_UI, () => {
                layoutInSide(tlayout);
                Engine.current_UI = tlayout;
            });
        }
    }
    else {
        layoutInSide(tlayout);
        Engine.current_UI = tlayout;
    }
}

Engine.updateUI = function () {
    if (Engine.current_UI) {
        Engine.current_UI.ui_entites.forEach(ele => {
            ele.updateMain();
            window.draw(ele);
        })
        Engine.current_UI.drawCalls.forEach(
            e => {
                window.drawCall(e.call, e.order);
            }
        )
    }
}

Engine.backgroundMode = 0;

Engine.init = function () {
    score_init();
    playSound(music_group[0], true);
    SetOrientation();
    window.SH.init();

    prepareButton(images.music_btn_off);
    prepareButton(images.music_btn_on);
    prepareButton(images.effects_btn_off);
    prepareButton(images.effects_btn_on);
    prepareButton(images.howto);


    mainviewport = new ViewPort(0, 0, cav.width, cav.height);
    window.Rendering.setContext(cxt);

    Engine.initAudioSettings();
    init_UIs();
    Engine.switch_UI("home");
    currentGameState = gameStates.menu;


    adjustwrapper();
    window.addEventListener("resize", adjustwrapper);

    last_time = Date.now();

    game_properties_initial = Object.assign({}, game_properties);
    if (Engine.backgroundMode == 0) {
        DrawBackground();
    }

    //init function in main.js
    init();

    entitylist.forEach((_ent) => {
        _ent.init();
    });


    Engine.tick();
}

Engine.tick = function () {
    updateDT();

    Engine.updateUI();

    if (Engine.backgroundMode != 0) {
        DrawBackground();
        cxt.clearRect(0, 0, cav.width, cav.height);
    }
    else {
        cxt.clearRect(0, 0, cav.width, cav.height);
    }

    //main function in main.js
    main();


    //removing objects from entitylist
    entitylist = entitylist.filter(e => {
        if (!e.remove_next_call) {
            return e;
        }
    })

    //notifications
    if (Engine.notifications.length > 0) {
        Engine.notifications[0].updateMain();
        window.draw(Engine.notifications[0]);

        Engine.notifications = Engine.notifications.filter(e => {
            if (!e.remove_next_call) {
                return e;
            }
        });
    }

    //animations
    Engine.Animations.forEach(e => {
        e.tick(dt);
    })


    window.Rendering.renderDrawCalls();

    keyStateOld = Object.assign({}, keyState);

    requestAnimationFrame(Engine.tick);
}

var DrawBackground;

//sound
var music_group = [];
var effects_group = [];

function mute(group) {
    group.forEach(element => {
        window.resources.get(element).mute(true);
    });
}

function unmute(group) {
    group.forEach(element => {
        window.resources.get(element).mute(false);
    });
}

function playSound(soundtoPlay, loop = false) {
    soundtoPlay = window.resources.get(soundtoPlay);
    if (soundtoPlay) {
        soundtoPlay.once("play", () => {
            soundtoPlay.loop(loop);
        })
        soundtoPlay.play();
    }
}

var canvasOffset = { x: 0, y: 0, xx: 0, yy: 0 };

var ui_list = [];

var how_to_lines;

var audio_settings_obj;



function init_UIs() {
    ui_list["home"] = homeUI();
    ui_list["game"] = gameUI();
    ui_list["pause"] = pauseUI();
    ui_list["gameover"] = gameoverUI();
    ui_list["howto"] = howtoUI();

    ui_list["home"].ui_entites.forEach(e => {
        e.oldpos = Object.assign({}, e.pos);
    })
    ui_list["game"].ui_entites.forEach(e => {
        e.oldpos = Object.assign({}, e.pos);
    })
    ui_list["pause"].ui_entites.forEach(e => {
        e.oldpos = Object.assign({}, e.pos);
    })
    ui_list["gameover"].ui_entites.forEach(e => {
        e.oldpos = Object.assign({}, e.pos);
    })
    ui_list["howto"].ui_entites.forEach(e => {
        e.oldpos = Object.assign({}, e.pos);
    })

}

function homeUI() {
    let t = new UI_layout();
    let y = new Entity(images.Logo, 0, 0, true);
    let client_lo = new Entity(client_logo, 0, 0, true);
    let y2 = new Button(images.Playbutton, 0, 0);




    y.pos.x = cav.width / 2 - y.size.x / 2;
    y.pos.y = 350 - y.size.y;

    client_lo.pos = {
        x: cav.width / 2 - client_logo.width / 2,
        y: y.pos.y - client_lo.size.y,
    }

    y2.pos.x = cav.width / 2 - y2.size.x / 2;
    y2.pos.y = 461;

    let music = new Button([images.music_btn_on, images.music_btn_off]);
    let sfx = new Button([images.effects_btn_on, images.effects_btn_off]);
    let how_to = new Button(images.howto);

    music.settings = audio_settings_obj;
    sfx.settings = audio_settings_obj;

    music.update = function () {
        if (this.settings.music) {
            music.sprite = music.sprites[0];
        }
        else {
            music.sprite = music.sprites[1];
        }
    }

    sfx.update = function () {
        if (this.settings.sfx) {
            sfx.sprite = sfx.sprites[0];
        }
        else {
            sfx.sprite = sfx.sprites[1];
        }
    }

    sfx.pos.x = (cav.width / 2) - (sfx.size.x / 2);
    sfx.pos.y = 708;

    music.pos.x = sfx.pos.x - (sfx.size.x * 2);
    music.pos.y = 708;

    how_to.pos = {
        x: sfx.pos.x + (sfx.size.x * 2),
        y: 708,
    }

    music.onclick = function () {
        if (this.settings.music) {
            this.settings.togglemusic(false);
            music.sprite = music.sprites[1];
        }
        else {
            unmute(music_group);
            this.settings.togglemusic(true);
            music.sprite = music.sprites[0];
        }
    }

    sfx.onclick = function () {
        if (this.settings.sfx) {
            mute(effects_group);
            this.settings.togglesfx(false);
            sfx.sprite = sfx.sprites[1];
        }
        else {
            unmute(effects_group);
            this.settings.togglesfx(true);
            sfx.sprite = sfx.sprites[0];
        }
    }

    how_to.onclick = function () {
        Engine.switch_UI("howto");
    }

    y2.onclick = () => {
        if (window.localStorage.getItem(NAME + "howto")) {
            Engine.switch_UI("game");
            currentGameState = gameStates.game;
        } else {
            Engine.switch_UI("howto");
            window.localStorage.setItem(NAME + "howto", "yes");
        }
        y2.clickable = false;
        new cAnimation(1, () => { }, () => { y2.clickable = true });
    };

    y.hover_check = true;
    t.ui_entites.push(y);
    t.ui_entites.push(y2);
    t.ui_entites.push(music);
    t.ui_entites.push(sfx);
    t.ui_entites.push(how_to);
    if (!gamesandapp) {
        t.ui_entites.push(client_lo);
    }


    t.drawCalls.push(
        {
            call: () => {
                cxt.globalAlpha = t.drawcallopacity;

                let lvl_info = window.SH.getLevelInfo();
                cxt.fillStyle = text_color;
                cxt.textAlign = "center";
                cxt.font = "70px GameFont";
                cxt.fillText("Level " + lvl_info.level, cav.width / 2, 916 - (game_orientation == 0 ? 0 : 408));
                cxt.font = "40px GameFont";
                cxt.fillText("Highscore " + window.SH.getHighScore(), cav.width / 2, 959 - (game_orientation == 0 ? 0 : 408));
                cxt.fillText(lvl_info.exp_next - lvl_info.exp + " xp to level " + (lvl_info.level + 1), cav.width / 2, 1076 - (game_orientation == 0 ? 0 : 408));


                let lw = Math.floor(382 * (lvl_info.exp / lvl_info.exp_next));
                Engine.roundedrectangle(cxt, (game_orientation == 0 ? 169 : 450), 998 - (game_orientation == 0 ? 0 : 408), 382, 28, "#ffffff");
                Engine.roundedrectangle(cxt, (game_orientation == 0 ? 169 : 450), 998 - (game_orientation == 0 ? 0 : 408), lw, 28, button_color);

                if (lvl_info.comp) {
                    cxt.fillStyle = button_color;
                    cxt.fillRect((game_orientation == 0 ? 219 : 498), (game_orientation == 0 ? 1130 : 360), 282, 44);

                    cxt.fillStyle = text_color != "#ffffff" ? "#ffffff" : "#000000";
                    cxt.textAlign = "center";
                    cxt.font = "30px GameFont";
                    cxt.fillText("Competition On", cav.width / 2, (game_orientation == 0 ? 1162 : 392));
                    cxt.textAlign = "start";
                }
                else {
                    cxt.fillStyle = button_color;
                    cxt.fillRect((game_orientation == 0 ? 219 : 498), (game_orientation == 0 ? 1130 : 360), 282, 44);

                    cxt.fillStyle = text_color != "#ffffff" ? "#ffffff" : "#000000";
                    cxt.textAlign = "center";
                    cxt.font = "30px GameFont";
                    cxt.fillText("Competition Off", cav.width / 2, (game_orientation == 0 ? 1162 : 392));
                    cxt.textAlign = "start";
                }
                cxt.globalAlpha = 1;
            },

            order: 2
        }
    )

    if (game_orientation == 1) {
        y.centerPivot();
        y.pos.y = 236;
        y.pos.x = cav.width / 2;

        y2.centerPivot();
        y2.pos.x = 1100;
        y2.pos.y = 570;

        music.pos.y = sfx.pos.y = how_to.pos.y = 500;
        music.pos.x = 110;
        sfx.pos.x = 200;
        how_to.pos.x = 290;
    }

    return t;
}

function gameUI() {
    let t = new UI_layout();
    let y = new Button(images.Pause);

    y.pos.x = 40;
    y.pos.y = 46;

    y.onclick = () => {
        Engine.switch_UI("pause");
        window.resources.get(images.BG).volume(0.5);
        currentGameState = gameStates.pause;
        y.clickable = false;
        new cAnimation(1, () => { }, () => { y.clickable = true });
    }

    let tv = () => {
        cxt.globalAlpha = t.drawcallopacity;
        let tin = window.SH.getLevelInfo();
        cxt.textAlign = "start";
        if (ScoreOutline) {
            cxt.strokeStyle = outline_color;
            cxt.lineWidth = 8;
            cxt.font = "35px GameFont";
            cxt.strokeText("Score " + game_properties.Score, 114, 84);
        }
        cxt.fillStyle = score_color;
        cxt.font = "35px GameFont";
        cxt.fillText("Score " + game_properties.Score, 114, 84);

        cxt.textAlign = "end";
        cxt.font = "20px GameFont";
        cxt.fillStyle = text_color;
        cxt.fillText("(Level " + tin.level + ") " + Math.floor(tin.exp_next - tin.exp) + " xp to level " + (tin.level + 1), (game_orientation == 0 ? 680 : 1240), 80);
        cxt.fillStyle = button_color;
        let tw = (tin.exp / tin.exp_next) * cav.width;
        cxt.fillRect(0, 0, tw, 10);
        cxt.fillStyle = "#ffffff";
        cxt.fillRect(tw, 0, cav.width - tw, 10);
        cxt.globalAlpha = 1;
    };

    t.drawCalls.push(
        {
            call: tv,
            order: 2
        }
    )

    t.ui_entites.push(y);
    return t;
}

function pauseUI(btn) {

    let t = new UI_layout();

    let y = new Entity(game_properties.drop == 0 ? images.whitedrop : images.blackdrop, cav.width, cav.height, true);
    let y2 = new Button(images.resume, 0, 0);

    let home = new Button(null, 243, 62);
    home.draw = function () { };

    home.pos.x = 239;
    home.pos.y = 1100;

    home.onclick = function () {
        Engine.switch_UI("home");
        currentGameState = gameStates.menu;
        resetgame();
        home.clickable = false;
        new cAnimation(1, () => { }, () => { home.clickable = true });
    }

    let music = new Button([images.music_btn_on, images.music_btn_off]);
    let sfx = new Button([images.effects_btn_on, images.effects_btn_off]);

    music.dir = 1;
    sfx.dir = 1;

    music.settings = audio_settings_obj;
    sfx.settings = audio_settings_obj;

    music.update = function () {
        if (this.settings.music) {
            music.sprite = music.sprites[0];
        }
        else {
            music.sprite = music.sprites[1];
        }
    }

    sfx.update = function () {
        if (this.settings.sfx) {
            sfx.sprite = sfx.sprites[0];
        }
        else {
            sfx.sprite = sfx.sprites[1];
        }
    }

    sfx.pos.x = 196;
    sfx.pos.y = 651;

    music.pos.x = 196;
    music.pos.y = 535;



    music.onclick = function () {
        if (this.settings.music) {
            this.settings.togglemusic(false);
            music.sprite = music.sprites[1];
        }
        else {
            unmute(music_group);
            this.settings.togglemusic(true);
            music.sprite = music.sprites[0];
        }
    }

    sfx.onclick = function () {
        if (this.settings.sfx) {
            mute(effects_group);
            this.settings.togglesfx(false);
            sfx.sprite = sfx.sprites[1];
        }
        else {
            unmute(effects_group);
            this.settings.togglesfx(true);
            sfx.sprite = sfx.sprites[0];
        }
    }



    y.order = 2;
    y2.pos.x = cav.width / 2 - y2.size.x / 2;
    y2.pos.y = 963;

    y2.onclick = () => {
        Engine.switch_UI("game");
        currentGameState = gameStates.game;
        window.resources.get(images.BG).volume(1);
        y2.clickable = false;
        new cAnimation(1, () => { }, () => { y2.clickable = true });
    }

    y.isfade = true;
    t.ui_entites.push(y);
    
    t.ui_entites.push(y2);
    t.ui_entites.push(music);
    t.ui_entites.push(sfx);
    t.ui_entites.push(home);
    


    let tv = () => {
        cxt.globalAlpha = t.drawcallopacity;
        let tin = window.SH.getLevelInfo();
        cxt.textAlign = "start";
        if (ScoreOutline) {
            cxt.strokeStyle = outline_color;
            cxt.lineWidth = 8;
            cxt.font = "35px GameFont";
            cxt.strokeText("Score " + game_properties.Score, 114, 84);
        }
        cxt.fillStyle = score_color;
        cxt.font = "35px GameFont";
        cxt.fillText("Score " + game_properties.Score, 114, 84);

        cxt.textAlign = "end";
        cxt.font = "20px GameFont";
        cxt.fillStyle = text_color;
        cxt.fillText("(Level " + tin.level + ") " + Math.floor(tin.exp_next - tin.exp) + " xp to level " + tin.level, (game_orientation == 0 ? 680 : 1240), 80);

        let tw = (tin.exp / tin.exp_next) * cav.width;
        cxt.fillStyle = button_color;
        cxt.fillRect(0, 0, tw, 10);
        cxt.fillStyle = "#ffffff";
        cxt.fillRect(tw, 0, cav.width - tw, 10);

        cxt.fillStyle = text_color;
        cxt.textAlign = "center";
        cxt.font = "70px GameFont";
        cxt.fillText("PAUSED", cav.width / 2, 413 - (game_orientation == 0 ? 0 : 200));
        cxt.font = "30px GameFont";
        cxt.fillText("Return To Home", cav.width / 2, game_orientation == 0 ? 1140 : cav.height - 40);
        cxt.textAlign = "start";
        cxt.font = "30px GameFont";
        cxt.fillText("Music : " + (audio_settings_obj.music ? "On" : "Off"), game_orientation == 0 ? 196 + 90 : 476 + 120, 577 - (game_orientation == 0 ? 0 : 250));
        cxt.fillText("Sound : " + (audio_settings_obj.sfx ? "On" : "Off"), game_orientation == 0 ? 196 + 90 : 476 + 120, 700 - (game_orientation == 0 ? 0 : 250));
        cxt.globalAlpha = 1;
    }

    t.drawCalls.push(
        {
            call: tv,
            order: 2
        }
    )

    if (game_orientation == 1) {

        y2.centerPivot();
        y2.pos.x = cav.width / 2;
        y2.pos.y -= 393;

        music.pos.y -= 250;
        sfx.pos.y -= 250;
        home.pos.y -= 393;
        music.pos.x = 476;
        sfx.pos.x = 476;
        home.pos.x = 519;
        home.pos.y = cav.height - 40 - home.size.y;
    }

    return t;
}

function gameoverUI() {
    let t = new UI_layout();
    let y = new Entity(game_properties.drop == 0 ? images.whitedrop : images.blackdrop, cav.width, cav.height, true);

    let y3 = new Entity(images.game_over_text, 0, 0, true);
    let y2 = new Button(images.Playagain, 0, 0);


    y3.pos.x = cav.width / 2 - y3.size.x / 2;
    y3.pos.y = 234;

    y.order = 2;
    y3.order = 3;

    y2.pos.x = cav.width / 2 - y2.size.x / 2;
    y2.pos.y = 1051;



    y2.onclick = () => {
        Engine.switch_UI("game");
        currentGameState = gameStates.game;
        resetgame();
        y2.clickable = false;
        new cAnimation(1, () => { }, () => { y2.clickable = true });
    }

    let home = new Button(null, 243, 62);
    home.draw = function () { };
    home.pos.x = 178;
    home.pos.y = 822;
    home.onclick = function () {
        Engine.switch_UI("home");
        currentGameState = gameStates.menu;
        resetgame();
        home.clickable = false;
        new cAnimation(1, () => { }, () => { home.clickable = true });
    }
    t.ui_entites.push(home);

    y.isfade = true;
    t.ui_entites.push(y);
    
    t.ui_entites.push(y2);
    t.ui_entites.push(y3);



    let tv = () => {
        cxt.globalAlpha = t.drawcallopacity;
        let lvl_info = window.SH.getLevelInfo();
        cxt.fillStyle = text_color;
        cxt.textAlign = "center";
        cxt.font = "70px GameFont";
        cxt.fillText("Score " + window.SH.getScore(), cav.width / 2, 514 - (game_orientation == 0 ? 0 : 200));
        cxt.font = "40px GameFont";
        cxt.fillText("Highscore " + window.SH.getHighScore(), cav.width / 2, 565 - (game_orientation == 0 ? 0 : 200));
        cxt.font = "40px GameFont";
        cxt.fillText(lvl_info.exp_next - lvl_info.exp + " xp to level " + (lvl_info.level + 1), cav.width / 2, 673 - (game_orientation == 0 ? 0 : 200));

        cxt.fillText("Return To Home", cav.width / 2, (game_orientation == 0 ? 880 : 720 - 20));
        cxt.textAlign = "start";

        let lw = Math.floor(382 * (lvl_info.exp / lvl_info.exp_next));
        Engine.roundedrectangle(cxt, (game_orientation == 0 ? 169 : 450), 596 - (game_orientation == 0 ? 0 : 200), 382, 28, "#ffffff");
        Engine.roundedrectangle(cxt, (game_orientation == 0 ? 169 : 450), 596 - (game_orientation == 0 ? 0 : 200), lw, 28, button_color);
        cxt.globalAlpha = 1;
    }

    t.drawCalls.push(
        {
            call: tv,
            order: 2
        }
    )
    t.drawCalls.push({
        call: () => {
            let y = new ImageData(1, 1);
            const data = y.data;
            data[0] = 255;
            data[1] = 255;
            data[2] = 255;
            data[3] = 255;
            cxt.putImageData(y, 0, 0, 0, 0, cav.width, cav.height);
        },
        order: 1.1
    })

    if (game_orientation == 1) {

        y3.centerPivot();
        y3.pos.x = cav.width / 2;
        y3.pos.y -= 100;

        y2.centerPivot();
        y2.pos.x = cav.width / 2;
        y2.pos.y *= 720 / 1280;

        home.pos.x = 519;
        home.pos.y = cav.height - 20 - home.size.y;
    }

    

    return t;
}

function howtoUI() {
    let t = new UI_layout();
    let y = new Entity(images.Logo, 0, 0, true);
    let client_lo = new Entity(client_logo, 0, 0, true);
    let y2 = new Button(null, 238, 50);
    y2.draw = function (x) { };



    let play_btn = new Button(images.Playbutton, 0, 0);
    play_btn.pos = {
        x: 308, y: 873
    }

    play_btn.onclick = function () {
        Engine.switch_UI("game");
        currentGameState = gameStates.game;
    }

    y.pos.x = cav.width / 2 - y.size.x / 2;
    y.pos.y = 350 - y.size.y;

    client_lo.pos = {
        x: cav.width / 2 - client_logo.width / 2,
        y: y.pos.y - client_lo.size.y,
    }

    y2.pos.x = 238;
    y2.pos.y = 1031;

    y2.onclick = () => {
        Engine.switch_UI("home");
        currentGameState = gameStates.main;
        y2.clickable = false;
        new cAnimation(1, () => { }, () => { y2.clickable = true });
    };

    y.hover_check = true;
    t.ui_entites.push(y);
    t.ui_entites.push(y2);
    t.ui_entites.push(play_btn);
    if (!gamesandapp) {
        t.ui_entites.push(client_lo);
    }

    t.drawCalls.push(
        {
            call: () => {
                cxt.globalAlpha = t.drawcallopacity;
                cxt.fillStyle = text_color;
                cxt.textAlign = "center";
                cxt.font = "85px GameFont";
                cxt.fillText("How To Play", cav.width / 2, 455 - (game_orientation == 0 ? 0 : 100));
                let count = 0;
                cxt.font = "40px GameFont";
                how_to_lines.forEach(element => {
                    cxt.fillText(element, cav.width / 2, 625 - (game_orientation == 0 ? 0 : 200) + count * 60);
                    count++;
                });
                cxt.fillText("Return To Home", cav.width / 2, game_orientation == 0 ? 1066 : 720 - 40);
                cxt.textAlign = "start";
                cxt.globalAlpha = 1;
            },
            order: 2
        }
    )

    if (game_orientation == 1) {
        y.centerPivot();
        y.pos.y = 236 - 90;
        y.pos.x = cav.width / 2;

        y2.pos.x = 519;
        y2.pos.y = 720 - 40 - y2.size.y;

        play_btn.centerPivot();
        play_btn.pos.x = 1100;
        play_btn.pos.y = 570;
    }

    return t;
}

function drawCircle(radius, center) {
    cxt.beginPath();
    cxt.arc(center.x - mainviewport.posx, center.y - mainviewport.posy, radius, 0, Math.PI * 2);
    cxt.strokeStyle = "#FF0000";
    cxt.lineWidth = 5;
    cxt.stroke();
    cxt.closePath();
}

function drawLine(A, B, color = "#FF0000", width = 2) {
    cxt.strokeStyle = color;
    cxt.lineWidth = width;
    cxt.beginPath();
    cxt.moveTo(A[0], A[1]);
    cxt.lineTo(B[0], B[1]);
    cxt.stroke();
    cxt.closePath();
}

window.addEventListener("load", function () {
    setTimeout(function () {
        window.scrollTo(0, 1);
    }, 0);
});

function adjustwrapper() {
    Engine.checkMobile();
    SetOrientation();

    let client_dims = { width: wrapper.parentElement.clientWidth, height: wrapper.parentElement.clientHeight };
    let clientRatio = client_dims.width / client_dims.height;
    let matchingbool = clientRatio <= (cavMain.width / cavMain.height);



    if (!matchingbool) {
        wrapper.style.height = client_dims.height + "px";
        wrapper.style.width = Math.floor((client_dims.height / cavMain.height) * cavMain.width) + "px";
    }
    else {
        wrapper.style.width = client_dims.width + "px";
        wrapper.style.height = Math.floor((client_dims.width / cavMain.width) * cavMain.height) + "px";
    }
    wrapper.style.paddingTop = "0px";
    wrapper.style.paddingTop = Math.floor((client_dims.height - wrapper.clientHeight) / 2) + "px";

    cavMain.style.width = "100%";
    //cavMain.style.height ="100%";

    if (ismobile) {
        let ratio = client_dims.height / (cavMain.height);
        let mobile_orientation = client_dims.width < client_dims.height ? 0 : 1;

        console.log("mobile in");
        if (mobile_orientation == game_orientation) {
            console.log("orientation matched");
            if (currentGameState == gameStates.orientation) {
                console.log("orientation fixed");
                currentGameState = previoustate != null ? previoustate : gameStates.main;

                switch (currentGameState) {
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
        else {
            console.log("orientation not matched");
            orientation_conflict = game_orientation == 0 ? 0 : 1;
            if (currentGameState != gameStates.orientation) {
                previoustate = currentGameState;
            }
            currentGameState = gameStates.orientation;
            adjustWrapperByRatio();
        }
    }

    let temp = cavMain.getBoundingClientRect();
    canvasOffset.x = temp.left;
    canvasOffset.y = temp.top;
    canvasOffset.xx = temp.right;
    canvasOffset.yy = temp.bottom;

    if (Engine.backgroundMode == 0) {
        DrawBackground();
    }
}

function adjustWrapperByRatio() {
    let client_dims = { width: wrapper.parentElement.clientWidth, height: wrapper.parentElement.clientHeight };
    let clientRatio = client_dims.width / client_dims.height;

    let target_dims = (client_dims.width <= client_dims.height) ? { width: 720, height: 1280 } : { width: 1280, height: 720 };
    cavMain.width = target_dims.width;
    cavMain.height = target_dims.height;


    let matchingbool = clientRatio <= (target_dims.width / target_dims.height);




    if (!matchingbool) {
        wrapper.style.height = client_dims.height + "px";
        wrapper.style.width = Math.floor((client_dims.height / target_dims.height) * target_dims.width) + "px";
    }
    else {

        wrapper.style.width = client_dims.width + "px";
        wrapper.style.height = Math.floor((client_dims.width / target_dims.width) * target_dims.height) + "px";
        wrapper.style.paddingTop = Math.floor((client_dims.height - wrapper.clientHeight) / 2) + "px";
    }
    wrapper.style.paddingTop = "0px";
    wrapper.style.paddingTop = Math.floor((client_dims.height - wrapper.clientHeight) / 2) + "px";

    cavMain.style.width = "100%";
    //cavMain.style.height ="100%";
}

//loading game 
var images;
let resources_paths = [];

let client_logo;

let y;


window.onload = () => {

    client_logo = document.createElement("img");
    client_logo.src = (gamesandapp ? actual_game_path : ".") + "/assets/sprites/client_logo.png";

    y = document.createElement("img");
    //actual entry point
    y.onload = () => {
        adjustWrapperByRatio();

        for (let [key, value] of Object.entries(images)) {
            resources_paths.push(value);
        }

        let ratio = y.width / y.height;
        let nwidth = ratio * cav.height;

        window.resources.load(resources_paths, false);

        let counter = 0;
        let timeoutcounter = 0;
        let tempcxt = cav.getContext('2d');




        //address bar hide hack
        window.scrollTo(0, 1);



        delay_interval = setInterval(() => {
            let nwidth = ratio * cav.height;
            timeoutcounter += 10;
            if (counter >= 2000 && window.resources.resourcesloadedcount == window.resources.resourcescount) {
                clearInterval(delay_interval);
                Engine.init();
            }
            else {
                tempcxt.fillStyle = "#FFFFFF";
                tempcxt.fillRect(0, 0, cav.width, cav.height);
                tempcxt.drawImage(y, cavMain.width / 2 - nwidth / 2, 0, nwidth, cavMain.height);
                if (!gamesandapp) {
                    tempcxt.drawImage(client_logo, cav.width / 2 - client_logo.width / 2, cav.height / 2 - client_logo.height / 2);
                }
                tempcxt.fillStyle = "#ff0000";
                let delta = (window.resources.resourcesloadedcount / window.resources.resourcescount) < counter / 2000 ? (window.resources.resourcesloadedcount / window.resources.resourcescount) : counter / 2000;
                tempcxt.fillRect(0, cavMain.height - 10, delta * cavMain.width, 10);
                tempcxt.fillStyle = "#000000";
                tempcxt.font = "BOLD 30px Arial"
                tempcxt.fillText(Math.ceil(delta * 100) + "%", cavMain.width * 0.88, cavMain.height - 25);
                counter += counter < 2000 ? 10 : 0;
            }
        }, 10);
    }

    y.src = (gamesandapp ? actual_game_path : ".") + "/assets/sprites/Splash.png";

};

var cavMain = document.getElementById("main_canvas");
var wrapper = document.getElementById("game_wrapper");
var bg_canvas = document.getElementById("bg_canvas");


function SetOrientation() {
    cavMain.width = game_orientation == 0 ? 720 : 1280;
    cavMain.height = game_orientation == 0 ? 1280 : 720;
    bg_canvas.width = cav.width;
    bg_canvas.height = cav.height;
    bg_canvas.style.height = "100%";
    bg_canvas.style.width = "100%";
}

var currentGameState;
var previoustate;
var orentationConflict;

//dt related variables
var last_time = 0;
var dt = 0;

function updateDT() {
    let now = Date.now();
    dt = (now - last_time) / 1000;
    last_time = now;
    dt *= Engine.timeScale;
}

//game properties
var NAME;
var game_properties_initial;
var game_properties;
var entitylist = [];
var game_orientation;

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
var onGameVisibilityChangePause = () => { };
document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        Howler.mute(true);
    }
    if (!document.hidden) {
        last_time = Date.now();
        Howler.mute(false);
    }
});

// notifications
class Notifications extends Entity {
    constructor(duration = 5, title = "Level Up") {
        super(images.board);
        this.order = 2.5;
        this.pos.x = cav.width / 2 - this.size.x / 2;
        this.pos.y = -this.size.y;
        this.title = title;
        this.main = "";
        this.sub = "";
        this.duration = duration;
        this.timer = 0;
        this.state = 0;
        this.ui = true;

        this.update = () => {
            switch (this.state) {
                case 0:
                    this.pos.y += dt * 300;
                    if (this.pos.y > 77) {
                        this.pos.y = 77;
                        this.state = 1;
                    }
                    break;
                case 1:
                    this.duration -= dt;
                    if (this.duration <= 0) {
                        this.state = 2;
                    }
                    break;
                case 2:
                    this.pos.y -= dt * 300;
                    if (this.pos.y <= -this.size.y) {
                        this.remove();
                    }
                    break;
                default:
                    break;
            }
            window.drawCall(() => {
                cxt.fillStyle = notification_color;
                cxt.textAlign = "center";
                cxt.font = "30px GameFont";
                cxt.fillText(this.title, this.pos.x + this.size.x / 2, this.pos.y + 36);
                cxt.font = "70px GameFont";
                cxt.fillText(this.main, this.pos.x + this.size.x / 2, this.pos.y + 116);
                cxt.font = "35px GameFont";
                cxt.fillText(this.sub, this.pos.x + this.size.x / 2, this.pos.y + 164);
            }, 2.51
            )
        }
    }
}

Engine.notify = function (params) {
    var { duration, title, main, sub } = params;
    let y = new Notifications(duration);
    y.title = title;
    y.main = main;
    y.sub = sub;
    Engine.notifications.push(y);
}

//Score
var score_init = function () {
    (function () {

        var Score = 0;
        var highScoreEvents = [];
        var HighScore = 0;
        var totalScore = 0;
        var highscoreFired = false;
        var level = 0;
        var expToNext = 0;
        var currentExp = 0;

        var king_of_game_ = false;
        var is_competition_ = false;
        var base_exp_ = 0;
        var inc_percent_ = 1;

        var first_time = true;

        function addListeners(l) {
            if (highScoreEvents.indexOf(l) < 0) {
                highScoreEvents.push(l);
            }
        }

        function init() {
            if (gamesandapp) {
                syncwithfetched();
            }
            else {
                if (!window.localStorage.getItem("highscore" + NAME)) {
                    window.localStorage.setItem("highscore" + NAME, 0);
                }
                else {
                    HighScore = window.localStorage.getItem("highscore" + NAME);
                }
                HighScore = parseInt(HighScore);

                if (!window.localStorage.getItem("totalscore" + NAME)) {
                    window.localStorage.setItem("totalscore" + NAME, 0);
                }
                else {
                    totalScore = window.localStorage.getItem("totalscore" + NAME);
                }
                totalScore = parseInt(totalScore);
            }

            calc_Level();

            addListeners(() => {
                let s = window.SH.getScore();
                Engine.notify({
                    duration: 2,
                    title: "New High Score",
                    main: s,
                    sub: "Nice!",
                });
            })
        }

        function calc_Level() {
            if (gamesandapp) {
                expToNext = base_exp_;

                let exp = totalScore;
                let l = 0;
                exp -= expToNext;

                let preToNext = inc_percent_;

                while (exp >= 0) {
                    l++;
                    expToNext = Math.floor(expToNext * preToNext);
                    exp -= expToNext;

                }
                level = l;
                currentExp = exp + expToNext;
            }
            else {
                expToNext = game_properties.base_exp;
                let exp = totalScore;
                let l = 0;
                exp -= expToNext;
                let preToNext = 1.1;
                while (exp >= 0) {
                    l++;
                    expToNext = Math.floor(expToNext * preToNext);
                    exp -= expToNext;
                }
                level = l;
                currentExp = exp + expToNext;
            }
        }

        function addScore(amount) {
            Score += amount;
            game_properties.Score = Score;



            if (Score > HighScore && !highscoreFired) {
                highScoreEvents.forEach(e => {
                    e();
                })
                highscoreFired = true;
            }

            currentExp += amount;
            if (currentExp / expToNext >= 1) {
                level += 1;
                currentExp -= expToNext;
                expToNext = Math.floor(expToNext * 1.1);


                Engine.notify({
                    duration: 2,
                    title: "Level Up",
                    main: "Level " + level,
                    sub: expToNext - currentExp + " XP to level " + (level + 1),
                })
            }

        }

        function getScore() {
            return Score;
        }


        function getLevelInfo() {
            return {
                level: level,
                exp: currentExp,
                exp_next: expToNext,
                comp: is_competition_,
            };
        }

        function getTotalScore() {
            return totalScore;
        }

        function getHighScore() {
            return HighScore;
        }

        function resetScore() {
            Score = 0;
            highscoreFired = false;
        }

        function submitScore() {
            if (gamesandapp) {
                syncwithfetched();
                totalScore += Score;

                highScore = getHighScore();
                if (Score > HighScore) {
                    //window.localStorage.setItem("highscore" + NAME, Score);
                    HighScore = Score;
                }
                saveScoreApi(Score, Math.floor(timer));
                increasePlayCount();
                ajaxGetScores();
            }
            else {
                totalScore += Score;
                window.localStorage.setItem("totalscore" + NAME, totalScore);

                highScore = getHighScore();
                if (Score > HighScore) {
                    window.localStorage.setItem("highscore" + NAME, Score);
                    HighScore = Score;
                }
            }

            calc_Level();
        }

        function syncwithfetched() {
            HighScore = global_high_score;
            totalScore = global_total_score;
            king_of_game_ = king_of_game;

            base_exp_ = base_exp;
            inc_percent_ = 1 + (xp_inc / 100);
            is_competition_ = is_competition;
        }

        window.SH = {
            init: init,
            addScore: addScore,
            getScore: getScore,
            getHighScore: getHighScore,
            resetScore: resetScore,
            submitScore: submitScore,
            addhighScoreEvent: addListeners,
            getTotalScore: getTotalScore,
            getLevelInfo: getLevelInfo,
        }
    })();
}

Engine.roundedrectangle = function (context = cxt, x, y, width, height, color) {
    if (width <= 0 || height <= 0) {
        return;
    }
    var c = color;
    if (typeof color == "string") {
        c = hexToRgb(color);
    }
    var w = width;
    width = width - height;


    const imagedata = cxt.getImageData(x, y, w, height);
    const data = imagedata.data;
    const left_center = [((height / 2) - 1), ((height / 2) - 1)];
    const right_center = [((height / 2) - 1 + width), ((height / 2) - 1)];

    const alpha = context.globalAlpha;
    const oneminusalpha = 1 - alpha;
    const alpha_255 = Math.floor(alpha * 255);

    for (var i = 0; i < data.length; i += 4) {
        let coord = [
            ((i / 4) % w),
            Math.floor((i / 4) / w)
        ]

        if (coord[0] < left_center[0]) {
            let d = distance(left_center, coord);
            let off = d - (height / 2);
            if (off < 0) {
                let balpha = data[i + 3] / 255;
                let mix = 1 - (1 - alpha) * (1 - balpha);
                //mix = Math.round(mix*255);
                if (mix == 0) {
                    data[i] = 0;
                    data[i + 1] = 0;
                    data[i + 2] = 0;
                    data[i + 3] = 0;
                }
                else {
                    data[i] = (c.r * alpha) / mix + (data[i] * balpha * oneminusalpha) / mix;
                    data[i + 1] = (c.g * alpha) / mix + (data[i + 1] * balpha * oneminusalpha) / mix;
                    data[i + 2] = (c.b * alpha) / mix + (data[i + 2] * balpha * oneminusalpha) / mix;
                    data[i + 3] = Math.round(mix * 255);
                }
            }

        }
        else if (coord[0] > right_center[0]) {
            let d = distance(right_center, coord);
            let off = d - (height / 2);
            if (off < 0) {
                //data[i]=Math.floor((c.r * alpha)+(data[i]*oneminusalpha));
                //data[i+1]=Math.floor((c.g* alpha)+(data[i+1]*oneminusalpha));
                //data[i+2]=Math.floor((c.b* alpha)+(data[i+2]*oneminusalpha));
                //data[i+3]=Math.floor( Math.min( 1, alpha+(data[i+3]/255)) * 255);
                let balpha = data[i + 3] / 255;
                let mix = 1 - (1 - alpha) * (1 - balpha);
                //mix = Math.round(mix*255);
                if (mix == 0) {
                    data[i] = 0;
                    data[i + 1] = 0;
                    data[i + 2] = 0;
                    data[i + 3] = 0;
                }
                else {
                    data[i] = (c.r * alpha) / mix + (data[i] * balpha * oneminusalpha) / mix;
                    data[i + 1] = (c.g * alpha) / mix + (data[i + 1] * balpha * oneminusalpha) / mix;
                    data[i + 2] = (c.b * alpha) / mix + (data[i + 2] * balpha * oneminusalpha) / mix;
                    data[i + 3] = Math.round(mix * 255);
                }
            }
        }
        else {
            let balpha = data[i + 3] / 255;
            let mix = 1 - (1 - alpha) * (1 - balpha);
            //mix = Math.round(mix*255);
            if (mix == 0) {
                data[i] = 0;
                data[i + 1] = 0;
                data[i + 2] = 0;
                data[i + 3] = 0;
            }
            else {
                data[i] = (c.r * alpha) / mix + (data[i] * balpha * oneminusalpha) / mix;
                data[i + 1] = (c.g * alpha) / mix + (data[i + 1] * balpha * oneminusalpha) / mix;
                data[i + 2] = (c.b * alpha) / mix + (data[i + 2] * balpha * oneminusalpha) / mix;
                data[i + 3] = Math.round(mix * 255);
            }
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

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

function dot(a, b) {
    return (a[0] * b[0]) + (a[1] * b[1]);
}

function reflection(i, n) {
    try {
        if (n[0] == 0 || n[1] == 0) {
            if (n[0] == 0) {
                return [i[0], i[1] * -1];
            }
            else {
                return [i[0] * -1, i[1]];
            }
        }
        let d = 2 * dot(i, n);
        return [
            i[0] - (d * n[0]),
            i[1] - (d * n[1])
        ];

    }
    catch (e) {
        console.log(e);
    }
}

function normalize(v) {
    let d = Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));

    return [
        v[0] / d, v[1] / d
    ];
}

function prepareButton(url) {
    let y = document.createElement("canvas");
    
    y.width = 66;
    y.height = 66;

    let y2 = y.getContext("2d");
    y2.imageSmoothingEnabled = false;
    y2.fillStyle = button_color;
    //y2.fillRect(0, 0, 66, 66);
    y2.drawImage(window.resources.get(url), 0, 0, 66, 66);
    window.resources.set(url, y);
}

function gameOver() {
    window.SH.submitScore();
    currentGameState = gameStates.gameover;
    Engine.switch_UI("gameover", true);
}

function layoutInSide(layout, onend) {
    layout.drawcallopacity = 0;
    let c = 0;
    for (c; c < layout.ui_entites.length; c++) {
        let e = layout.ui_entites[c];
        if(e.isfade)
        {
            new cAnimation(0.5 + c * 0.1,
                (parm) => {
                    e.opacity = parm.progress;
                },()=>{e.opacity=1;});
            continue;
        }

        e.opacity = 1;
        let lastp = e.oldpos.y < cav.height / 2 ? -e.size.y : cav.height;
        let diff = e.oldpos.y < cav.height / 2 ? e.oldpos.y + e.size.y : -(cav.height - e.oldpos.y);
        if (e.dir == 0) {
            lastp = -e.size.y;
            diff = e.oldpos.y + e.size.y;
        }
        if (e.dir == 1) {
            lastp = cav.height;
            diff = -(cav.height - e.oldpos.y);
        }
        new cAnimation(0.5 + c * 0.1,
            (parm) => {
                e.pos.y = lastp + parm.progress * diff;
            },
            c == layout.ui_entites.length - 1 ? () => {
                e.pos.y = e.oldpos.y;
                if (onend) {
                    onend();
                }
            } : () => {
                e.pos.y = e.oldpos.y;
            },
            (x) => {
                const c1 = 1.70158;
                const c2 = c1 * 1.525;

                return x < 0.5
                    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
                    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
            });
    }
    new cAnimation(c * 0.1, (parm) => {
        layout.drawcallopacity = parm.progress;
    }, () => {
        layout.drawcallopacity = 1;
    },
        (x) => {
            return 1 - Math.cos((x * Math.PI) / 2);
        });

}

function layoutOutSide(layout, onend) {
    layout.drawcallopacity = 1;
    let c = 0;
    for (c; c < layout.ui_entites.length; c++) {
        let e = layout.ui_entites[c];

        if(e.isfade)
        {
            new cAnimation(0.5 + c * 0.1,
                (parm) => {
                    e.opacity = 1-parm.progress;
                },()=>{e.opacity=0;});
            continue;
        }

        let lastp = e.pos.y;
        let diff = e.pos.y < cav.height / 2 ? -(cav.height / 2) : (cav.height / 2);
        if (e.dir == 0) {
            diff = -(cav.height / 2);
        }
        if (e.dir == 1) {
            diff = cav.height - e.pos.y;
        }
        new cAnimation(0.5 + c * 0.1,
            (parm) => {
                e.pos.y = lastp + parm.progress * diff;
            },
            () => {
                e.opacity = 0;
                e.pos.y = e.oldpos;
            },
            (x) => {
                const c1 = 1.70158;
                const c2 = c1 * 1.525;

                return x < 0.5
                    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
                    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
            });
    }
    new cAnimation(c * 0.1, (parm) => {
        layout.drawcallopacity = 1 - parm.progress;
    }, () => {
        layout.drawcallopacity = 0;

    }, (x) => {
        return 1 - Math.cos((x * Math.PI) / 2);
    });

    new cAnimation(0.5, () => { }, onend != undefined ? onend : undefined);
}

function MoveTowards(a, b, rate = 0.1) {
    let d = b - a;
    a = a + (d * Math.min(rate, 1));
    return Math.abs(b - a) < 0.01 ? b : a;
}

function calculate_level(total_exp,base_exp,multiplier)
{
    let expToNext = base_exp;
    let exp = total_exp;
    let l = 0;
    exp -= expToNext;
    let preToNext = 1+(multiplier/100);
    while (exp >= 0) {
        l++;
        expToNext = Math.floor(expToNext * preToNext);
        exp -= expToNext;
    }    
    currentExp = exp + expToNext;

    return {
        level:l,
        level_up_score:(expToNext-currentExp)
    }
}