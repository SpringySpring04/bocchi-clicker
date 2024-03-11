
const _bocchiFaces = {
    normal: p5.Image.prototype,
    shock: p5.Image.prototype,
    xi: p5.Image.prototype
};

var current_bocchi_face: p5.Image;

var hitbox: Rect;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function preload() {
    _bocchiFaces.normal = loadImage('assets/bocchi.png');
    _bocchiFaces.shock  = loadImage('assets/bocchi_Dx.png');
    _bocchiFaces.xi     = loadImage('assets/bocchi_x.png');
}

function setup() {
    current_bocchi_face = _bocchiFaces.normal;
    createCanvas(windowWidth, windowHeight);
    hitbox = new Rect({x: 180, y: 220, w: 230, h: 210})
    .fillColor(null)
    .outlineColor(null)
    .mouseHover((self)=>{
        if (self.isPressed) return;
        current_bocchi_face = _bocchiFaces.xi;
    })
    .mouseHoverRelease((self)=>{
        if (self.isPressed) return;
        current_bocchi_face = _bocchiFaces.normal;
    })
    .mouseDown((self)=>{
        current_bocchi_face = _bocchiFaces.shock;
        // console.log("hitbox clicked!");
    })
    .mouseUp((self)=>{
        if (Rect.CollidePointRect({x:mouseX,y:mouseY}, self.toRectCon()))
            current_bocchi_face = _bocchiFaces.xi;
        else
            current_bocchi_face = _bocchiFaces.normal;
        // console.log("hitbox release!");
    })
}

function draw() {
    background(37);
    image(current_bocchi_face, 20, 20);
    hitbox.render();
}
