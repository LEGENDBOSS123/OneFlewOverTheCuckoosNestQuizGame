const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const BALL_SPEED = 12;
const PARTICLE_SPEED = 4;
var deltaTime = 0;
var previousFrameTime = performance.now();

var allQuestions = ["McMurphy is the narrator of the book",
"McMurphy strangles Chief to death in the end at the end of the novel",
"Nurse Ratched strangles McMurphy by the throat at the end of the book",
"McMurphy’s full name is Randolph McMurphy",
"McMurphy is admitted to the ward because he is schizophrenic",
"The ward is a true democracy",
"Billy Bibbit started stuttering when he was 8 years old",
"There are only female nurses and male patients",
"Vera is Harding's wife",
"McMurphy bets that he can get the nurse to lose her temper within 1 week",
"Mr.Turkle helps Chief by untying his sheets",
"The fog disappears for Chief later in the novel",
"Chief is able to lift the panel in the end of the book",
"McMurphy fails to lift the panel but inspires the other patients",
"Chief likes the fog because he can hide in it as it is a safe place"];
var allAnswers = [false, false, false, false, false, false, false, true, true, true, true, true, true, true, true];
var lengthQuestionsOG = allQuestions.length;
var basketBallImage = new ImageHolder("https://www.shutterstock.com/image-vector/basketball-ball-pattern-background-texture-260nw-2038032416.jpg");


var currentQuestion = "";
var currentAnswer = true;
var currentIndex = -1;

var falseball = new Ball(10,10,10,"red");
falseball.isBasketBall = false;
falseball.gravity = 0;
var trueball = new Ball(10,10,10,"blue");
trueball.isBasketBall = false;
trueball.gravity = 0;
var roundOver = false;
var roundOverTime = 150;
var score = 0;
var winScreen = false;
var drawText = function(text, v, s = 30, fs = "black", f="Arial"){
    ctx.fillStyle = fs;
    ctx.font = s + "px " + f;
    ctx.textAlign = "center";
    ctx.fillText(text, v.x, v.y);
}

function splitText(text, chunkSize = 50) {
    text = text.split(" ");
    let chunks = [];
    var i = 0;
    while(i < text.length){
        var b = 0;
        var a = [];
        for(var j = i; j < text.length; j++){
            a.push(text[j]);
            b+=text[j].length;
            if(b>=chunkSize){
                break;
            }
        }
        i += j + 1;
        chunks.push(a.join(" "));
    }
    return chunks;
}

var randomizeBallPositions = function(){
    falseball.opacity = 1;
    trueball.opacity = 1;
    falseball.x = Math.random()*canvas.width;
    falseball.y = Math.random()*canvas.height * 0.5 + canvas.height * 0.15;
    trueball.x = Math.random()*canvas.width;
    trueball.y = Math.random()*canvas.height * 0.5 + canvas.height * 0.15;
    while((new Vector2(falseball)).distance(new Vector2(trueball)) < 300){
        trueball.x = Math.random()*canvas.width;
        trueball.y = Math.random()*canvas.height * 0.5 + canvas.height * 0.15;  
    }
    if(Math.random()<0.5){
        falseball.x = falseball.x^trueball.x;
        trueball.x = falseball.x^trueball.x;
        falseball.x = falseball.x^trueball.x;
        falseball.y = falseball.y^trueball.y;
        trueball.y = falseball.y^trueball.y;
        falseball.y = falseball.y^trueball.y;
    }
    if(currentIndex!=-1){
        allQuestions.splice(currentIndex, 1);
        allAnswers.splice(currentIndex, 1);
    }
    if(allQuestions.length==0){
        winScreen = true;
        return;
    }
    currentIndex = Math.floor(Math.random()*allQuestions.length);
    currentQuestion = allQuestions[currentIndex];
    currentAnswer = allAnswers[currentIndex];
}
randomizeBallPositions();

var getOffset = function(){
    var aspectRatio = canvas.width/canvas.height;
    var apparentAspectRatio = canvas.clientWidth/canvas.clientHeight;
    if(apparentAspectRatio > aspectRatio){
        return new Vector2((canvas.clientWidth - canvas.clientHeight * aspectRatio)/2,0);
    }else{
        return new Vector2(0,(canvas.clientHeight-canvas.clientWidth/aspectRatio)/2);
    }
}

var toCanvasCoords = function(v){
    var rect = canvas.getBoundingClientRect()
    var scaleFactorX = canvas.width/rect.width;
    var scaleFactorY = canvas.height/rect.height;
    var scale = Math.max(scaleFactorX, scaleFactorY);
    v = v.subtract(getOffset());
    v = v.scale(scale);
    return v;
}

var randomColor = function(){
    var r = Math.floor(Math.random()*256);
    var g = Math.floor(Math.random()*256);
    var b = Math.floor(Math.random()*256);
    return `rgb(${r},${g},${b})`;
}

var makeParticles = function(number, v){
    for(var i = 0;i<number;i++){
        var p = new Ball(v.x, v.y, Math.random()*2+1, randomColor());
        p.isBasketBall = false;
        var angle = Math.random()*Math.PI*2;
        p.vx = Math.cos(angle)*(Math.random()*PARTICLE_SPEED);
        p.vy = Math.sin(angle)*(Math.random()*PARTICLE_SPEED);
        p.gravity/=3;
        particles.push(p);
    }
}


var mousepos = new Vector2(0, 0);
var mouseball = new Ball(0, 0, 5, "red");


document.addEventListener("mousemove", function (e) {
    mousepos = toCanvasCoords(new Vector2(e.clientX, e.clientY));
    mouseball.x = mousepos.x;
    mouseball.y = mousepos.y;
});

document.addEventListener("click", function (e) {
    if(ammo == 100){
        var b = centerBall.copy();
        var v = toMouseVector();
        b.vx = v.x*BALL_SPEED;
        b.vy = v.y*BALL_SPEED;
        balls.push(b);
        ammo = 0;
    }
});



var balls = [];


var particles = [];

var centerBall = new Ball(400,450, 15, "red");


var ammo = 100;


var toMouseVector = function(){
    mouseposScaled = mousepos;
    var v = new Vector2(mouseposScaled.x - centerBall.x, mouseposScaled.y - centerBall.y);
    v = v.scale(0.003);
    return v;
}

var drawAmmoBar = function(){

    ctx.fillStyle = "grey";
    ctx.fillRect(200, 500, 400, 30);

    ctx.fillStyle = ammo==100?"green":"red";
    ctx.fillRect(200 + 200*(100-ammo)/100, 500, 400*ammo/100, 30);
}


var drawToMouse = function(){
    var v = toMouseVector();
    var b = centerBall.copy();
    b.isBasketBall = false;
    b.vx = v.x*BALL_SPEED;
    b.vy = v.y*BALL_SPEED;
    var radius = centerBall.radius;
    var radius2 = 6;
    b.color = "gray";
    for(var i = 0; i<21;i++){
        b.radius = radius2;
        b.draw(0);
        b.radius = radius;
        for(var i2 = 0;i2<8;i2++){
            
            b.update();
        }
        b.opacity *= 0.93;
        radius2 *= 0.97;
    }
}


var animate = function () {

    if(winScreen){
        ctx.fillStyle = "rgb(100,100,100)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawText("YOU WIN!!!", new Vector2(400, 280), 70, "white");
        drawText("SCORE: " + score, new Vector2(400, 350), 40, "white");
        drawText("RELOAD TO PLAY AGAIN", new Vector2(400, 400), 20, "white");
        return;
    }

    
    deltaTime = 60*(performance.now() - previousFrameTime)/1000;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawAmmoBar();
    drawToMouse();
    for (var ball of balls) {
        ball.draw(deltaTime);
    }
    for (var p of particles) {
        p.draw(deltaTime);
    }
    centerBall.draw(deltaTime);
    mouseball.draw(deltaTime);
    drawText("SCORE: " + score, new Vector2(400, 575), 40);
    drawText((lengthQuestionsOG - allQuestions.length + 1) + "/" + lengthQuestionsOG, new Vector2(700, 575), 30);
    if(!roundOver){
        falseball.draw(deltaTime);
        trueball.draw(deltaTime);
    }
    ctx.globalAlpha = Math.max(falseball.opacity, 0);
    drawText("FALSE", new Vector2(falseball.x, falseball.y+25), 10);
    ctx.globalAlpha = 1;
    ctx.globalAlpha = Math.max(trueball.opacity, 0);
    drawText("TRUE", new Vector2(trueball.x, trueball.y+25), 10);
    
    var aa = splitText(currentQuestion, 50);
    for(var i = 0;i<aa.length;i++){
        drawText(aa[i], new Vector2(400, 30 + i*25), 20);
    }

    ctx.globalAlpha = 1;


    
    requestAnimationFrame(animate);
}

var update = function(){
    previousFrameTime = performance.now();
    var deleteAll = false;
    if(winScreen){
        return;
    }
    for (var b = balls.length-1;b>=0;b--) {
        balls[b].update();
        if(!roundOver){
            if(balls[b].collidesWith(trueball)){
                if(currentAnswer == true){
                    makeParticles(300, balls[b]);
                    falseball.timeAlive = 0;
                    trueball.timeAlive = 0;
                    particles.push(falseball);
                    particles.push(trueball);
                    deleteAll = true;
                    roundOver = true;
                    score += 100 + balls[b].wallBounces * 50;
                    break;
                }
                else{
                    balls[b].timeAlive = 40;
                    particles.push(balls[b]);
                    balls.splice(b, 1);
                    score-=500;
                    continue;
                }
            }
            else if(balls[b].collidesWith(falseball)){
                if(currentAnswer == false){
                    makeParticles(300, balls[b]);
                    falseball.timeAlive = 0;
                    trueball.timeAlive = 0;
                    particles.push(falseball);
                    particles.push(trueball);
                    deleteAll = true;
                    roundOver = true;
                    score += 100 + balls[b].wallBounces * 50;
                    break;
                }
                else{
                    balls[b].timeAlive = 40;
                    particles.push(balls[b]);
                    balls.splice(b, 1);
                    score-=500;
                    continue;
                }
            }
        }
        if(balls[b].outOfBounds()){
            makeParticles(100, balls[b]);
            balls.splice(b, 1);
            score -= 50;
            continue;
        }
    }
    if(roundOver){
        roundOverTime -= 1;
        if(roundOverTime<0){
            roundOver = false;
            randomizeBallPositions();
            roundOverTime = 150;
        }
    }
    if(deleteAll){
        for(var b of balls){
            b.timeAlive = 0;
            particles.push(b);
        }
        balls = [];
    }
    for (var p = particles.length-1;p>=0;p--) {
        particles[p].update();
        var t = 80;
        particles[p].opacity = (t-particles[p].timeAlive)/t;
        if(particles[p].timeAlive>t){
            particles.splice(p, 1);
        }
    }
    ammo+=1.5;
    if(ammo>100){
        ammo = 100;
    }
    
    setTimeout(update, 1000/60);
}
update();
animate();