enum TimerPlaybackStates {
    PLAY,
    PAUSE,
    STOPPED
}

class IntervalTimer {

    /**
     * @description Function that is called every timer loop.
     * Also, the timer's `vars` property is passed into the second argument.
     */
    private _callback: (self: this, ...args: any[]) => any = ()=>{};
    
    /**
     * @description additional variables and items for usage in the callback
     */
    public vars: any = {};

    private _maxTime: number = 0;
    private _tick: number = 0;

    /**
     * Maximum number of frames for the loop
     */
    public get maxTime(): number { return this._maxTime; }
    /**
     * Sets the maximum number of frames for the loop, also resets the tick counter
     */
    public set maxTime(value: number) {
        this._maxTime = value;
        this._tick = this._maxTime;
    }
    /**
     * The current ticks value
     */
    public get tick(): number { return this._tick; }
    public set tick(value: number) { this._tick = Math.max(Math.min(value, this._maxTime), 0); }
    /**
     * The number of ticks that have passed since last loop reset
     */
    public get ticksElapsed(): number { return this._maxTime - this._tick; }

    private _playbackState: TimerPlaybackStates = TimerPlaybackStates.STOPPED;
    public get playbackState(): TimerPlaybackStates {
        return this._playbackState;
    }

    public constructor(maxTime: number, cb: (self: any, ...args: any[]) => any, vars: any = {}) {
        this._callback = cb;
        this.vars = vars;
        this._maxTime = maxTime;
        this._tick = this._maxTime;
    }

    /**
     * Sets the callback function for each loop, and optionally sets the object references to be used
     * @param cb Must be a function (either `function` keyword or arrow function)
     * @param objs
     */
    public callback(cb: (self: this, ...args:any[])=>any, objs: any = undefined) {
        this._callback = cb;
        if (objs) this.vars = objs;
    }

    /**
     * Starts the timer.
     * If playback state is already PLAY, does nothing.
     * @param cb_fromStop Optional function to call upon starting. This will only be called if the previous playback state was STOPPED
     * @param cb_fromPause Optional function to call upon starting. This will only be called if the previous playback state was PAUSED
     */
    public start(cb_fromStop: ((self: this) => any) | undefined = ()=>{}, cb_fromPause: ((self: this) => any) | undefined = ()=>{}) {
        if (this._playbackState == TimerPlaybackStates.PLAY) return;
        if (this._playbackState == TimerPlaybackStates.STOPPED) {
            if (cb_fromStop) cb_fromStop(this);
            this._tick = this._maxTime;
        } else {
            if (cb_fromPause) cb_fromPause(this);
        }
        this._playbackState = TimerPlaybackStates.PLAY;
    }

    /**
     * Pauses the timer's counter.
     * This keeps the current tick frozen until {@link start} is called again.
     * If playback state is already STOPPED or PAUSE, does nothing.
     * @param cb Optional function to call upon pausing.
     */
    public pause(cb: ((self: this) => any) | undefined = ()=>{}) {
        if (this._playbackState == TimerPlaybackStates.STOPPED || this._playbackState == TimerPlaybackStates.PAUSE) return;
        if (cb) cb(this);
        this._playbackState = TimerPlaybackStates.PAUSE;
    }

    /**
     * Stops the timer.
     * This resets the tick back to maxTime, and keeps it there until {@link start} is called again.
     * If playback state is already STOPPED, does nothing.
     * @param cb Optional function to call upon stopping. For example, termination functionality, exit functionality, etc.
     */
    public stop(cb: ((self: this) => any) | undefined = ()=>{}) {
        if (this._playbackState == TimerPlaybackStates.STOPPED) return;
        if (cb) cb(this);
        this._tick = this._maxTime;
        this._playbackState = TimerPlaybackStates.STOPPED;
    }

    /**
     * Updates the timer. If playback state is STOPPED, resets the counter; if PAUSED, does nothing; if PLAY, updates the timer.
     * The timer's callback will be called when counter reaches 0, then the counter will be reset for the next loop.
     * @returns 
     */
    public update() {
        switch(this._playbackState) {
            case TimerPlaybackStates.STOPPED:
                this._tick = this._maxTime;
                return;
            case TimerPlaybackStates.PAUSE:
                return;
            default:
                break;
        }
        if (this._tick > 0) this._tick--;
        else {
            this._callback(this, this.vars);
            this._tick = this._maxTime;
        }
    }

}