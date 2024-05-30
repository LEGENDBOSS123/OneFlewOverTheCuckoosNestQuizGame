var Vector2 = class {
    constructor(x, y) {
        this.x = x?.x ?? x ?? 0;
        this.y = x?.y ?? y ?? 0;
    }
    
    cross(v) {
        return this.x * v.y - this.y * v.x;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    angle(v) {
        return Math.acos(this.dot(v) / (this.magnitude() * v.magnitude()));
    }

    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    subtract(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    multiply(v) {
        return new Vector2(this.x * v.x, this.y * v.y);
    }

    divide(v) {
        return new Vector2(this.x / v.x, this.y / v.y);
    }

    addTo(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    subtractTo(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    multiplyTo(v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    divideTo(v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }

    scale(s, s2=s) {
        return new Vector2(this.x * s, this.y * s2);
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    magnitudeSquared() {
        return this.x ** 2 + this.y ** 2;
    }

    normalize() {
        const mag = this.magnitude();
        return new Vector2(this.x / mag, this.y / mag);
    }

    distance(v) {
        return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
    }

    distanceSquared(v) {
        return (this.x - v.x) ** 2 + (this.y - v.y) ** 2;
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    reset() {
        this.x = 0;
        this.y = 0;
        return this;
    }

    set(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    toJSON(){
        return {
            x: this.x,
            y: this.y
        }
    }

    static fromJSON(jsondata){
        return new Vector2(jsondata.x, jsondata.y);
    }
}


if (typeof (module) != "undefined") {
    module.exports = Vector2;
}