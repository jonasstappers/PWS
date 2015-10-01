var beginSpeed = document.getElementById("Beginspeed");
var massPlanet = document.getElementById("Massplanet");
var massDwarf = document.getElementById("Massdwarf");
var gravConst = document.getElementById("Gravconst");
var setValue = document.getElementById("Set");
var trail = document.getElementById("trail");

var G;
var dt = 1;
var t = 0;

var dwarf;
var planet;

setValue.addEventListener("click", setup);

setup();

function setup (){
	dwarf = {
		element: document.getElementById("m"),
		mass: massDwarf.value,
		velocity: new Vector(0, -beginSpeed.value),
		acceleration: new Vector(0, 0),
		position: new Vector(410, 10)
	};

	planet = {
		element: document.getElementById("M"),
		mass: massPlanet.value,
		velocity: new Vector(0, 0),
		acceleration: new Vector(0, 0),
		position: new Vector(-40, -40)
	};

	G = gravConst.value;
}

function mainLoop(){
	Calc();
	Draw();
	requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);

function Calc (){
	t += dt;

	var forceDwarf = planet.position.subtract(dwarf.position);
	
	var distance = forceDwarf.magnitude();
	forceDwarf.normalize();

	var forcePlanet = new Vector(forceDwarf.x * -1, forceDwarf.y * -1);

	var gravforce = (G * dwarf.mass * planet.mass)/(distance * distance);
	forceDwarf.multiplyScalar(gravforce);
	forcePlanet.multiplyScalar(gravforce);

	var aDwarf = forceDwarf.divideScalar(dwarf.mass);
	var aPlanet = forcePlanet.divideScalar(planet.mass);

	dwarf.acceleration.add(aDwarf);
	dwarf.velocity.add(dwarf.acceleration);
	dwarf.position.add(dwarf.velocity);
	dwarf.acceleration.zero();

	planet.acceleration.add(aPlanet);
	planet.velocity.add(planet.acceleration);
	planet.position.add(planet.velocity);
	planet.acceleration.zero();
}

function Draw (){
	dwarf.element.style.marginLeft = dwarf.position.x + "px";
	dwarf.element.style.marginTop = dwarf.position.y + "px";

	planet.element.style.marginLeft = planet.position.x + "px";
	planet.element.style.marginTop = planet.position.y + "px";

    if (t % 10 === 0){
    	OrbitTrail();
    }
}

function OrbitTrail(){
    var trailDot = document.createElement("div");
    trailDot.id = "Dot"; 
    var dotX = dwarf.position.x + 10;
    var dotY = dwarf.position.y + 10;
    trailDot.style.marginLeft = dotX + "px";
    trailDot.style.marginTop = dotY + "px";
    trail.appendChild(trailDot);
}

function Vector (x, y) {
    if (!(this instanceof Vector)){
        return new Vector(x, y);
    }
    
    this.x = x || 0;
    this.y = y || 0;
}

Vector.prototype.zero = function() {
	this.x = this.y = 0;
	return this;
};

Vector.prototype.magnitude = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.normalize = function() {
	var magnitude = this.magnitude();

	if (magnitude === 0){
		this.x = 1;
		this.y = 0;
	} else {
		this.divide(new Vector(magnitude, magnitude);
	}
	return this;
};

Vector.prototype.addX = function (vec) {
    this.x += vec.x;
    return this;
};

Vector.prototype.addY = function (vec) {
    this.y += vec.y;
    return this;
};

Vector.prototype.add = function (vec) {
	this.x += vec.x;
	this.y += vec.y;
	return this;
};

Vector.prototype.subtractX = function (vec) {
    this.x -= vec.x;
    return this;
};

Vector.prototype.subtractY = function (vec) {
    this.y -= vec.y;
    return this;
};

Vector.prototype.subtract = function (vec) {
	this.x -= vec.x;
	this.y -= vec.y;
	return this;
};

Vector.prototype.divideX = function (vec) {
    this.x /= vec.x;
    return this;
};

Vector.prototype.divideY = function (vec) {
    this.y /= vec.y;
    return this;
};

Vector.prototype.divide = function (vec) {
	this.x /= vec.x;
	this.y /= vec.y;
	return this;
};

Vector.prototype.divideScalar = function (scalar) {
	if (scalar !== 0) {
		this.x /= scalar;
		this.y /= scalar;
	} else {
		this.x = 0;
		this.y = 0;
	}
	return this;
};

Vector.prototype.multiplyX = function (vec) {
    this.x *= vec.x;
    return this;
};

Vector.prototype.multiplyY = function (vec) {
    this.y *= vec.y;;
    return this;
};

Vector.prototype.multiply = function (vec) {
	this.x *= vec.x;
	this.y *= vec.y;
	return this;
};

Vector.prototype.multiplyScalar = function (scalar) {
	this.x *= scalar;
	this.y *= scalar;
	return this;
};
