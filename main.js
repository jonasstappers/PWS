var G = 4;

var dwarf = {
	element: document.getElementById("m"),
	mass: 4,
	velocity: new Vector(1, 1),
	acceleration: new Vector(0, 0),
	position: new Vector(-420, -20)
};

var planet = {
	element: document.getElementById("m"),
	mass: 30,
	position: new Vector(-40, -40)
};

function calc (){
	var force = planet.position.subtract(dwarf.position);
	
	var distance = force.magnitude();
	console.log(force);
	force.normalize();

	var gravForce = (G * dwarf.mass * planet.mass)/(distance * distance);
	force.multiplyScalar(gravForce);

	var a = force.divideScalar(dwarf.mass);

	dwarf.acceleration.add(a);
	dwarf.velocity.add(dwarf.acceleration);
	dwarf.position.add(dwarf.velocity);
	dwarf.acceleration.zero();
}

function draw (){
	dwarf.element.style.marginLeft = dwarf.position.x + "px";
	dwarf.element.style.marginTop = dwarf.position.y + "px";
}

function mainLoop(){
	calc();
	draw();
	requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);



function Vector (x, y) {
    if (!(this instanceof Vector)){
        return new Vector(x, y);
    }
    
    this.x = x || 0;
    this.y = y || 0;
};

Vector.prototype.zero = function(vec) {
	this.x = this.y = 0;
	return this;
};

Vector.prototype.magnitude = function() {
	return Math.sqrt(this.x * this.x + this.y + this.y);
};

Vector.prototype.normalize = function() {
	var magnitude = this.magnitude();

	if (magnitude === 0){
		this.x = 1;
		this.y = 0;
	} else {
		this.divide(new Vector(magnitude, magnitude))
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
