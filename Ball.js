
var Ball = class {

    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.gravity = 0.1;
        this.radius = radius;
        this.color = color;
        this.timeAlive = 0;
        this.opacity = 1;
        this.wallBounces = 0;
        this.image = null;
        this.isBasketBall = true;
    }

    draw(dt) {
        ctx.save();
        ctx.translate(this.x + this.vx*dt, this.y + this.vy*dt);
        ctx.beginPath();
        ctx.arc(0,0, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        
        ctx.globalAlpha = this.opacity;
        if(this.isBasketBall){
            ctx.clip();
            var scale = 1.2;
            
            ctx.rotate(Math.PI * Math.pow(this.timeAlive,0.5)/3);
            ctx.drawImage(basketBallImage.getImage(),-this.radius*scale,- this.radius*scale, this.radius*scale*2, this.radius*scale*2);
        }
        else{
            ctx.fill();
        }
        ctx.restore();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;

        if(this.x + this.radius > canvas.width || this.x - this.radius < 0){
            this.vx *= -1;
            this.wallBounces++;
        }
        this.timeAlive++;
    }

    copy(){
        return new Ball(this.x, this.y, this.radius, this.color);
    }

    outOfBounds(){
        return this.x < -this.radius || this.x > canvas.width+this.radius || this.y < -this.radius || this.y > canvas.height+this.radius;
    }

    collidesWith(otherBall){
        return (this.x - otherBall.x)**2 + (this.y - otherBall.y)**2 < (this.radius + otherBall.radius)**2
    }
}