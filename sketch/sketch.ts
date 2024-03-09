
const _bocchiFaces = {
    normal: p5.Image.prototype,
    shock: p5.Image.prototype,
    xi: p5.Image.prototype
};

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
    createCanvas(windowWidth, windowHeight);
    hitbox = new Rect({x: 50, y: 50, w: 50, h: 50})
    .fillColor('#00aa00')
    .outlineColor(null)
    // below is for debugging
    .mouseHover((self)=>{
        self.fill_color = '#00ff00';
    })
    .mouseHoverRelease((self)=>{
        self.fill_color = '#00aa00';
    })
    .mouseDown((self)=>{
        console.log("hitbox clicked!");
    })
    .mouseUp((self)=>{
        console.log("hitbox release!");
    })
}

function draw() {
    background(0);
    image(_bocchiFaces.normal, 20, 20);
    hitbox.render();
}
