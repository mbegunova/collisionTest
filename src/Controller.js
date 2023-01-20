import {GameItem} from "./Item";

class Controller {


    constructor() {
        this.update = this.update.bind(this);
    }

    init({rectangle, circle, container, prejector, rotated}) {
        const {offsetWidth, offsetHeight, offsetLeft, offsetTop} = container;

        this.settings = {
            width: offsetWidth,
            height: offsetHeight,
            left: offsetLeft,
            top: offsetTop
        }

        this.collisionData = {};

        this.rectangle = new GameItem(rectangle, this.settings);
        this.circle = new GameItem(circle, this.settings, true);
        this.prejector = new GameItem(prejector, this.settings, true);
        this.rotated = new GameItem(rotated, this.settings, true);
        this.container = container;


        this.rectangle.x = offsetWidth / 2;
        this.rectangle.y = offsetHeight / 2;
        this.rectangle.angle = .9;


        requestAnimationFrame(this.update);

        this.circle.item.addEventListener("mousedown", this.onDown.bind(this));
        window.addEventListener("mouseup", this.onUp.bind(this));
        window.addEventListener("mousemove", this.onMove.bind(this));
    }

    onUp() {
        this.active = false;
    }

    onDown({clientX, clientY}) {
        this.active = true;
    }

    onMove({clientX, clientY}) {
        if (!this.active) return;

        const x = clientX - this.settings.left;
        const y = clientY - this.settings.top;

        this.circle.x = x;
        this.circle.y = y;
    }


    update() {
        const {
            rectangle, circle,
            rectangle: {x: rx, y: ry, angle},
            circle: {x: cx, y: cy},
            collisionData: {closestX, closestY}
        } = this;

        const collide = collideCircleWithRotatedRectangle(circle, rectangle, this.collisionData)
        circle.item.style.background = collide ? "#e0ad11" : "#55e55e";

        const _vector = {
            x: closestX - rx,
            y: closestY - ry,
        };

        const vector = {
            x: Math.cos(angle) * _vector.x - Math.sin(angle) * _vector.y + rx,
            y: Math.sin(angle) * _vector.x + Math.cos(angle) * _vector.y + ry,
        }

        this.prejector.x = vector.x;
        this.prejector.y = vector.y;

        requestAnimationFrame(this.update);
    }


}


export const controller = new Controller();

function collideCircleWithRotatedRectangle(circle, rect, data) {
    const {angle} = rect;

    const rectX = rect.x - rect.width / 2;
    const rectY = rect.y - rect.height / 2;

    // Rotate circle's center point back
    const unrotatedCircleX = Math.cos(-angle) * (circle.x - rect.x) -
        Math.sin(-angle) * (circle.y - rect.y) + rect.x;
    const unrotatedCircleY = Math.sin(-angle) * (circle.x - rect.x) +
        Math.cos(-angle) * (circle.y - rect.y) + rect.y;

    // Closest point in the rectangle to the center of circle rotated backwards(unrotated)
    let closestX, closestY;

    if (unrotatedCircleX < rectX)
        closestX = rectX;
    else if (unrotatedCircleX > rectX + rect.width)
        closestX = rectX + rect.width;
    else
        closestX = unrotatedCircleX;


    // Find the unrotated closest y point from center of unrotated circle
    if (unrotatedCircleY < rectY)
        closestY = rectY;
    else if (unrotatedCircleY > rectY + rect.height)
        closestY = rectY + rect.height;
    else closestY = unrotatedCircleY;

    const distance = getDistance(unrotatedCircleX, unrotatedCircleY, closestX, closestY);

    const dy0 = Math.abs(unrotatedCircleY - rectY);
    const dy1 = Math.abs(unrotatedCircleY - (rectY + rect.height));
    const dx0 = Math.abs(unrotatedCircleX - rectX);
    const dx1 = Math.abs(unrotatedCircleX - (rectX + rect.width));

    const dx = dx0 < dx1 ? rectX : rectX + rect.width;
    const dy = dy0 < dy1 ? rectY : rectY + rect.height;
    const isHorizontal = Math.abs(closestX - dx) < Math.abs(closestY - dy);

    data.closestX = isHorizontal ? dx : closestX;
    data.closestY = !isHorizontal ? dy : closestY;

    data.unrotatedCircleX = unrotatedCircleX;
    data.unrotatedCircleY = unrotatedCircleY;


    return distance < circle.radius
}

function getDistance(fromX, fromY, toX, toY) {
    var dX = Math.abs(fromX - toX);
    var dY = Math.abs(fromY - toY);

    return Math.sqrt((dX * dX) + (dY * dY));
}