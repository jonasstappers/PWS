var vDwarf = document.getElementById("vDwarf");
var vPlanet = document.getElementById("vPlanet");
var massPlanet = document.getElementById("Massplanet");
var massDwarf = document.getElementById("Massdwarf");
var gravConst = document.getElementById("Gravconst");
var radius = document.getElementById("Radius");
var deltaTime = document.getElementById("DeltaTime");
var setValue = document.getElementById("Set");
var trail = document.getElementById("trail");
var deleteTrail = document.getElementById("deletetrail");
var background = document.getElementById("gridtoggle");
var x1 = document.getElementById("scalevalue_x1");
var x2 = document.getElementById("scalevalue_x2");
var xMin1 = document.getElementById("scalevalue_x-1");
var xMin2 = document.getElementById("scalevalue_x-2");
var y1 = document.getElementById("scalevalue_y1");
var y2 = document.getElementById("scalevalue_y2");
var yMin1 = document.getElementById("scalevalue_y-1");
var yMin2 = document.getElementById("scalevalue_y-2");
var trailColor = "#1BA39C";
var trailColors = ["#2781A3","#6EA327","#6D27A3 ","#A32761 ","#A35827 ","#A32727","#273FA3","#27A36B",]

var G;
var dt;
var t;
var i = 0;
var scale;

var dwarf;
var planet;

setValue.addEventListener("click", setup);
setValue.addEventListener("click", ChangeColor);
deleteTrail.addEventListener("click", ResetTrail);
background.addEventListener("click", ToggleGrid);

setup();

function setup (){
    sVar = Number(radius.value);
    scale = 400 / sVar;
    
	dwarf = {
		element: document.getElementById("m"),
		mass: massDwarf.value,
		velocity: new Vector(0, -vDwarf.value),
		acceleration: new Vector(0, 0),
		position: new Vector(sVar, 0)
	};

	planet = {
		element: document.getElementById("M"),
		mass: massPlanet.value,
		velocity: new Vector(0, -vPlanet.value),
		acceleration: new Vector(0, 0),
		position: new Vector(0, 0)
	};
    
	G = gravConst.value;
	dtScalar = deltaTime.value;
    
    ScaleValues();
}

function mainLoop(){
	Calc();
	Draw();
	requestAnimationFrame(mainLoop);

	var now = new Date().getTime();
	dt = now - (t || now);
	dt *= dtScalar;
	t = now;
}

requestAnimationFrame(mainLoop);

function Calc (){
	var forceDwarf = planet.position.clone().subtract(dwarf.position);
	
	var distance = forceDwarf.clone().magnitude();
	forceDwarf.normalize();

	var forcePlanet = dwarf.position.clone().subtract(planet.position);
	forcePlanet.normalize();

	var gravforce = (G * dwarf.mass * planet.mass)/(distance * distance);
	forceDwarf.multiplyScalar(gravforce);
	forcePlanet.multiplyScalar(gravforce);

	var aDwarf = forceDwarf.clone().divideScalar(dwarf.mass);
	var aPlanet = forcePlanet.clone().divideScalar(planet.mass);

	dwarf.acceleration.add(aDwarf);
	dwarf.velocity.add(dwarf.acceleration.clone().multiplyScalar(dt));
	dwarf.position.add(dwarf.velocity.clone().multiplyScalar(dt));
	dwarf.acceleration.zero();

	planet.acceleration.add(aPlanet);
	planet.velocity.add(planet.acceleration.clone().multiplyScalar(dt));
	planet.position.add(planet.velocity.clone().multiplyScalar(dt));
	planet.acceleration.zero();
}

function Draw (){
	dwarf.element.style.marginLeft = (dwarf.position.x * scale) + "px";
	dwarf.element.style.marginTop = (dwarf.position.y * scale) + "px";

	planet.element.style.marginLeft = (planet.position.x * scale) + "px";
	planet.element.style.marginTop = (planet.position.y * scale) + "px";

	i++;

	if (i % 5 === 0){
		OrbitTrail();
	}
}

function ScaleValues (){
    x2.innerHTML = Number(radius.value);
    x1.innerHTML = Number(radius.value)/2;
    xMin1.innerHTML = -(Number(radius.value)/2);
    xMin2.innerHTML = -(Number(radius.value));
    y2.innerHTML = Number(radius.value);
    y1.innerHTML = Number(radius.value)/2;
    yMin1.innerHTML = -(Number(radius.value)/2);
    yMin2.innerHTML = -(Number(radius.value));
}

function ToggleGrid(){
    var toggleGrid = document.getElementById("background");
    
    if (toggleGrid.style.display == "block") {
        toggleGrid.style.display = "none";   
    } else {
        toggleGrid.style.display = "block";   
    }
}

function ChangeColor (){
    var randomColor = trailColors[Math.floor(Math.random() * trailColors.length)];
    trailColor = randomColor;
    document.getElementById("m").style.backgroundColor = randomColor;
}

function OrbitTrail(){
    var trailDot = document.createElement("div");
    trailDot.id = "Dot"; 

    trailDot.style.marginLeft = (dwarf.position.x * scale) + "px";
    trailDot.style.marginTop = (dwarf.position.y * scale) + "px";
    trailDot.style.backgroundColor = trailColor;
    
    trail.appendChild(trailDot);
}

function ResetTrail (){
    var elem = document.getElementById("trail")

    while (elem.firstChild){
    	elem.removeChild(elem.firstChild);
    }
}

function Vector (x, y) {
    if (!(this instanceof Vector)){
        return new Vector(x, y);
    }
    
    this.x = x || 0;
    this.y = y || 0;
}

Vector.prototype.clone = function() {
	return new Vector(this.x, this.y);
};

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
		this.divide(new Vector(magnitude, magnitude));
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


