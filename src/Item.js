export class GameItem {

    _x = 0;
    _y = 0;

    vx = 0;
    vy = 0;

    _angle = 0;

    constructor(item, settings, isCircle = false) {
        const {offsetWidth, offsetHeight} = item;
        this.settings = settings;
        if (isCircle) {
            this.radius = offsetWidth / 2;
        } else {
            this.width = offsetWidth;
            this.height = offsetHeight;
        }

        this.item = item;
    }


    get x() {
        return this._x;
    }

    set x(value) {
        const {settings} = this;
        this._x = Math.max(0, Math.min(settings.width, value));
        this.update();
    }

    get y() {
        return this._y;
    }

    set y(value) {
        const {settings} = this;
        this._y = Math.max(0, Math.min(settings.height, value));
        this.update();
    }

    set angle(value) {
        this._angle = value;
        this.update();
    }

    get angle() {
        return this._angle;
    }

    update() {
        this.item.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.angle}rad)`
    }

}