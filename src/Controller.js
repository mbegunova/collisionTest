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
        this.rectangle.angle = .5;


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
        }

        const vector = {
            x: Math.cos(angle) * _vector.x - Math.sin(angle) * _vector.y + rx,
            y: Math.sin(angle) * _vector.x + Math.cos(angle) * _vector.y + ry,
        }

        this.prejector.x = vector.x;
        this.prejector.y = vector.y;


        const delta = {
            x: (cx - rx) - (vector.x - rx),
            y: (cy - ry) - (vector.y - ry),
        }

        //todo: минимальный вектор, нужно найти вектор направления меча относительно середины и применять минимальный по направлению
        const minVector = {
            x: rectangle.width / 2,
            y: rectangle.height / 2,
        }

        if (delta.x === 0)
            this.circle.x = vector.x;
        if (delta.y === 0)
            this.circle.y = vector.y;


        console.log(delta);

        requestAnimationFrame(this.update)
    }


}


export const controller = new Controller();

function collideCircleWithRotatedRectangle(circle, rect, data) {
    const {angle} = rect;
    const circleX = circle.x;
    const circleY = circle.y;

    const rectMidPointX = rect.x;
    const rectMidPointY = rect.y;

    const rectX = rectMidPointX - rect.width / 2;
    const rectY = rectMidPointY - rect.height / 2;

    const rectWidth = rect.width;
    const rectHeight = rect.height;

    // Rotate circle's center point back
    const unrotatedCircleX = Math.cos(-angle) * (circleX - rectMidPointX) -
        Math.sin(-angle) * (circleY - rectMidPointY) + rectMidPointX;
    const unrotatedCircleY = Math.sin(-angle) * (circleX - rectMidPointX) +
        Math.cos(-angle) * (circleY - rectMidPointY) + rectMidPointY;

    // Closest point in the rectangle to the center of circle rotated backwards(unrotated)
    let closestX, closestY;

    if (unrotatedCircleX < rectX)
        closestX = rectX;
    else if (unrotatedCircleX > rectX + rectWidth)
        closestX = rectX + rectWidth;
    else
        closestX = unrotatedCircleX;

    // Find the unrotated closest y point from center of unrotated circle
    if (unrotatedCircleY < rectY)
        closestY = rectY;
    else if (unrotatedCircleY > rectY + rectHeight)
        closestY = rectY + rectHeight;
    else
        closestY = unrotatedCircleY;

    const distance = getDistance(unrotatedCircleX, unrotatedCircleY, closestX, closestY);


    data.unrotatedCircleX = unrotatedCircleX;
    data.unrotatedCircleY = unrotatedCircleY;
    data.closestX = closestX;
    data.closestY = closestY;

    return distance < circle.radius
}

function getDistance(fromX, fromY, toX, toY) {
    var dX = Math.abs(fromX - toX);
    var dY = Math.abs(fromY - toY);

    return Math.sqrt((dX * dX) + (dY * dY));
}