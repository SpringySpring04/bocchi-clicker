type RectConstructor = {
    x: number,
    y: number,
    w: number,
    h: number
};

class Rect {

    public static CollidePointRect(pt: p5.Vector | {x: number, y: number}, rect: RectConstructor): boolean {
        return (
            pt.x >= rect.x && 
            pt.y >= rect.y &&
            pt.x <= rect.x + rect.w && 
            pt.y <= rect.y + rect.h
        );
    }

    public static CollideRects(r1: RectConstructor, r2: RectConstructor): boolean {
        return (
            r1.x + r1.w >= r2.x &&
            r1.x <= r2.x + r2.w &&
            r1.y + r1.h >= r2.y &&
            r1.y <= r2.y + r2.h
        );
    }

    public x: number;
    public y: number;
    public w: number;
    public h: number;

    public outline_color: any;
    public fill_color: any;
    
    protected saved_outline_color: any = null;
    protected saved_fill_color: any    = null;

    /**
     * Determine if this rect is currently being pressed. True when
     * 1) is hovered over and mouse down
     * 2) is or is not hovered over and mouse is/was (still) down
     */
    public get isPressed() { return this._mouseIsPressed; }

    // Determines if the rect was clicked/pressed and the same for the last frame
    protected _mouseIsPressed: boolean = false;
    protected _mouseWasPressed: boolean = false;

    // Determines if the mouse is inside this rect and the same for the last frame
    protected _mouseIsInside: boolean = false;
    protected _mouseWasInside: boolean = false;

    /**
     * Function call the instant that this is hovered over
     */
    protected _mouseHover: (self:this)=>void = ()=>{};
    /**
     * Function call the instant that this is no longer hovered over
     */
    protected _mouseHoverRelease: (self:this)=>void = ()=>{};
    /**
     * Function called every frame that the mouse is currently held down
     */
    protected _mousePressed: (self:this)=>void = ()=>{};
    /**
     * Function called the instant that this is clicked and mouse is hovering over
     */
    protected _mouseDown: (self:this)=>void = ()=>{};
    /**
     * Function called the instant that this is mouse released and was in a state of being pressed
     */
    protected _mouseUp: (self:this)=>void = ()=>{};

    public constructor({x,y,w,h}: RectConstructor) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.outline_color = null;
        this.fill_color = 'green';
    }

    /**
     * Converts this prototype to a single, small object
     * @returns 
     */
    public toRectCon(): RectConstructor {
        return { x: this.x, y: this.y, w: this.w, h: this.h };
    }

    /**
     * Draws the rect
     */
    public render() {
        
        this.update();

        if (!this.outline_color) noStroke();
        else {
            strokeWeight(2); stroke(this.outline_color);
        }
        if (!this.fill_color) noFill();
        else {
            fill(this.fill_color);
        }
        rect(this.x,this.y, this.w,this.h);
    }

    /**
     * Updates mouse events
     */
    public update() {
        this._mouseIsInside = Rect.CollidePointRect({x: mouseX, y: mouseY}, this.toRectCon());
        // Distributive property: if the mouse was pressed and is still pressed, or if the mouse is inside, wasn't pressed, and is now pressed
        this._mouseIsPressed = (this._mouseWasPressed || (this._mouseIsInside && !this._mouseWasPressed)) && mouseIsPressed;

        if (this._mouseIsInside && !this._mouseWasInside) this._mouseHover(this);
        else if (!this._mouseIsInside && this._mouseWasInside) this._mouseHoverRelease(this);

        if (this._mouseIsInside && this._mouseIsPressed && !this._mouseWasPressed) {
            this._mouseDown(this);
        }
        if (this._mouseIsPressed) {
            this._mousePressed(this);
        }
        if (!this._mouseIsPressed && this._mouseWasPressed) {
            this._mouseUp(this);
        }

        this._lateUpdate();
    }   

    private _lateUpdate() {
        this._mouseWasInside = this._mouseIsInside;
        this._mouseWasPressed = this._mouseIsPressed;
    }

    /**
     * Sets the mouseHover event for the moment the mouse enters this rect
     * and returns itself
     * @param callback
     * @returns {this}
     */
    public mouseHover(callback: (self:this)=>void = ()=>{}): this {
        if (typeof callback != 'function') 
            this._mouseHover = () => {};
        else 
            this._mouseHover = callback;
        return this;
    }
    /**
     * Sets the mouseHoverRelease event for the moment the mouse leaves this rect
     * and returns itself
     * @param callback
     * @returns {this}
     */
    public mouseHoverRelease(callback: (self:this)=>void = ()=>{}): this {
        if (typeof callback != 'function')
            this._mouseHoverRelease = () => {};
        else 
            this._mouseHoverRelease = callback;
        return this;
    }

    /**
     * Sets the mousePressed event for the duration as long as the mouse is still down after the mouseDown aka click event
     * and returns itself
     * @param callback
     * @returns {this}
     */
    public mousePressed(callback: (self:this)=>void = ()=>{}): this {
        if (typeof callback != 'function')
            this._mousePressed = () => {};
        else 
            this._mousePressed = callback;
        return this;
    }
    /**
     * Sets the mouseDown event for the moment the mouse clicks this rect while inside of it
     * and returns itself
     * @param callback
     * @returns {this}
     */
    public mouseDown(callback: (self:this)=>void = ()=>{}): this {
        if (typeof callback != 'function')
            this._mouseDown = () => {};
        else 
            this._mouseDown = callback;
        return this;
    }
    /**
     * Sets the mouseUp event for the moment the mouse button releases this rect
     * and returns itself
     * @param callback
     * @returns {this}
     */
    public mouseUp(callback: (self:this)=>void = ()=>{}): this {
        if (typeof callback != 'function')
            this._mouseUp = () => {};
        else 
            this._mouseUp = callback;
        return this;
    }

    /**
     * Sets the fill color to the given value and returns this rect.
     * If value is null, undefined, or otherwise falsey, noFill will be used
     * @param value 
     * @returns {this}
     */
    public fillColor(value: any): this {
        this.fill_color = value;
        return this;
    }

    /**
     * Sets the outline color to the given value and returns this rect
     * If value is null, undefined, or otherwise falsey, noStroke will be used
     * @param value 
     * @returns {this}
     */
    public outlineColor(value: any): this {
        this.outline_color = value;
        return this;
    }

    /**
     * Saves the specified color so that it can be re-loaded later
     * @param option Determine which type of color to save. If `"fill"`, saves only the fill color. If `"outline"`, saves only the outline color. If `"both"`, saves both.1
     */
    public saveColor(option: 'fill' | 'outline' | 'both' = 'both'): this {
        if (option == "fill" || option == "both") this.saved_fill_color = this.fill_color;
        if (option == "outline" || option == "both") this.saved_outline_color = this.outline_color;
        return this;
    }

    /**
     * Re-loads the specified color that was saved
     * @param option Determine which type of color to load. If `"fill"`, loads only the fill color. If `"outline"`, loads only the outline color. If `"both"`, loads both.1
     */
    public loadColor(option: 'fill' | 'outline' | 'both' = 'both'): this {
        if (option == "fill" || option == "both") this.fill_color = this.saved_fill_color;
        if (option == "outline" || option == "both") this.outline_color = this.saved_outline_color;
        return this;
    }
    

}