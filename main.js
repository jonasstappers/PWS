var vDwarf = document.getElementById("vDwarf");
//var vPlanet = document.getElementById("vPlanet");
var massPlanet = document.getElementById("Massplanet");
var massDwarf = document.getElementById("Massdwarf");
var gravConst = document.getElementById("Gravconst");
var radius = document.getElementById("Radius");
var deltaTime = document.getElementById("DeltaTime");
var setValue = document.getElementById("Set");
var trail = document.getElementById("trail");
var deleteTrail = document.getElementById("deletetrail");
var background = document.getElementById("gridtoggle");
var earthSun = document.getElementById("earth_sun");
var trailColor = "#1BA39C";
var trailColors = ["#2781A3","#6EA327","#1BA39C ","#CD518B ","#A35827 ",
				   "#F4B683","#3754CB","#27A36B","#6D27A3","#D2106A",
				   "#D1590B","#63C02A","#88F7C5","#78DEF6","#BADA64",
				   "#8078F5","#5DFBF6","#FEE1B6"];

var x1 = document.getElementById("scalevalue_x1");
var x2 = document.getElementById("scalevalue_x2");
var xMin1 = document.getElementById("scalevalue_x-1");
var xMin2 = document.getElementById("scalevalue_x-2");
var y1 = document.getElementById("scalevalue_y1");
var y2 = document.getElementById("scalevalue_y2");
var yMin1 = document.getElementById("scalevalue_y-1");
var yMin2 = document.getElementById("scalevalue_y-2");

var windowHeigth = window.innerHeight;
var windowWidth = window.innerWidth;

var G;
var dt;
var t;
var c = 299792458;
var i = 0;
var scale;
var dwarf;
var planet;
var forceDwarf;
var forcePlanet;
var distance;
var radiocheck;
var dwarfSpeed;
var dwarfRadius;
var mu;

setValue.addEventListener("click", setup);
setValue.addEventListener("click", ChangeColor);
deleteTrail.addEventListener("click", ResetTrail);
background.addEventListener("click", ToggleGrid);
earthSun.addEventListener("click", EarthSun);
dashboardbutton.addEventListener("click", ToggleDashboard);
setup();




function setup (){
    sVar = Number(radius.value);
    scale = 400 / sVar;

    radiocheck = document.getElementById('terms').checked;

	dwarf = {
		element: document.getElementById("m"),
		mass: Number(massDwarf.value),
		velocity: new Vector(0, Number(vDwarf.value)),
		acceleration: new Vector(0, 0),
		position: new Vector(sVar, 0)
	};

	planet = {
		element: document.getElementById("M"),
		mass: Number(massPlanet.value),
		velocity: new Vector(0, Number(vPlanet.value)),
		acceleration: new Vector(0, 0),
		position: new Vector(0, 0)
	};

	G = Number(gravConst.value);
	dtScalar = deltaTime.value;

    ScaleValues();
}

function mainLoop(){
	Calc();
	Draw();
	Value();
	requestAnimationFrame(mainLoop);

	var now = new Date().getTime();
	dt = now - (t || now);
	dt *= dtScalar;
	t = now;
}

requestAnimationFrame(mainLoop);

function Calc (){
	forceDwarf = planet.position.clone().subtract(dwarf.position);
	forcePlanet = dwarf.position.clone().subtract(planet.position);
	
	fone = planet.position.clone().subtract(dwarf.position);
	ftwo = dwarf.position.clone().subtract(planet.position);
	
	distance = forceDwarf.clone().magnitude();
	
	forceDwarf.normalize();
	forcePlanet.normalize();
	
	console.clear();

	var h = 0.1;

	mu = (dwarf.mass * planet.mass) / (dwarf.mass + planet.mass);
	//console.log("mu: " + mu);
	// console.log("L: " + L);

	var gravforce = (GravForce(distance + h) - GravForce(distance)) / h;
	var momentum = (Momentum(distance + h) - Momentum(distance)) / h;
	var relativity = (Relativity(distance + h) - Relativity(distance)) / h;

	console.log("momentum: " + Momentum(distance));


	// console.log("g: " + gravforce);
	// console.log("m: " + momentum);
	// console.log("r: " + relativity);

	if (radiocheck){
		var force = gravforce + momentum + relativity;
	} else{
		var force = gravforce;
	}

	// console.log(force);

	forceDwarf.multiplyScalar(force);
	forcePlanet.multiplyScalar(force);

	dwarf.acceleration.add(forceDwarf.clone().divideScalar(dwarf.mass));
	dwarf.velocity.add(dwarf.acceleration.clone().multiplyScalar(dt));
	dwarf.position.add(dwarf.velocity.clone().multiplyScalar(dt));
	dwarf.acceleration.zero();

	if (!radiocheck) {
		planet.acceleration.add(forcePlanet.clone().divideScalar(planet.mass));
		planet.velocity.add(planet.acceleration.clone().multiplyScalar(dt));
		planet.position.add(planet.velocity.clone().multiplyScalar(dt));
		planet.acceleration.zero();
	}
	
	dwarfSpeed = dwarf.velocity.clone().magnitude();
	dwarfRadius = dwarf.position.clone().magnitude();
}

function GravForce (r){
	var grav = (G * dwarf.mass * planet.mass) / r;
	return -grav;
}

function Momentum(r) {
	var angle = Math.acos(dwarf.velocity.clone().dot(fone)/(dwarf.velocity.clone().magnitude() * fone.magnitude()));
	// console.log("Angle: " + angle);
	var L = r * Number(dwarf.mass) * dwarf.velocity.clone().magnitude() * Math.sin(180 - angle);
	console.log("L: " + L);
	var mom = (L * L) / (2 * mu * r * r);
	// console.log("Mom: " + mom);
	// console.log("r: " + r);
	return mom;
}

function Relativity(r) {
	// the angle out 
	var angle = Math.acos(dwarf.velocity.clone().dot(fone)/(dwarf.velocity.clone().magnitude() * fone.clone().magnitude()));
	var L = r * Number(dwarf.mass) * dwarf.velocity.clone().magnitude() * Math.sin(180 - angle);
	var rel = ((G * dwarf.mass + G * planet.mass) * (L * L)) / (c * c * mu * r * r * r);
	return -rel;
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

    var radiusLength = radius.value.toString().length;

    if (radiusLength < 6){
        x2.innerHTML = (Number(radius.value));
        x1.innerHTML = (Number(radius.value)/2);
        xMin1.innerHTML = (-(Number(radius.value)/2));
        xMin2.innerHTML = (-(Number(radius.value)));
        y2.innerHTML = (Number(radius.value));
        y1.innerHTML = (Number(radius.value)/2);
        yMin1.innerHTML = (-(Number(radius.value)/2));
        yMin2.innerHTML = (-(Number(radius.value)));
    }
    else {
        x2.innerHTML = (Number(radius.value)).toExponential(3);
        x1.innerHTML = (Number(radius.value)/2).toExponential(3);
        xMin1.innerHTML = (-(Number(radius.value)/2)).toExponential(3);
        xMin2.innerHTML = (-(Number(radius.value))).toExponential(3);
        y2.innerHTML = (Number(radius.value)).toExponential(3);
        y1.innerHTML = (Number(radius.value)/2).toExponential(3);
        yMin1.innerHTML = (-(Number(radius.value)/2)).toExponential(3);
        yMin2.innerHTML = (-(Number(radius.value))).toExponential(3);
    }
}

function EarthSun() {
    vDwarf.value = 29780;
    radius.value = 1.4960e11;
    massDwarf.value = 5.972e24;
    massPlanet.value = 1.989e30;
    gravConst.value = 6.67408e-11;
    deltaTime.value = 1000;

    trailColor = "#0389FB";
    document.getElementById("m").style.backgroundColor = "#0389FB";

    setup();
}

function ToggleGrid(){
    var toggleGrid = document.getElementById("background");

    if (toggleGrid.style.display == "block") {
        toggleGrid.style.display = "none";
    } else {
        toggleGrid.style.display = "block";
    }
}

function ToggleDashboard(){
    var toggleDashboard = document.getElementById("dashboard");

    if (toggleDashboard.style.display == "block") {
        toggleDashboard.style.display = "none";
    } else {
        toggleDashboard.style.display = "block";
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

function Value () {
		var speedvalueLength = dwarfSpeed.toFixed(1).toString().length;
		var radiusvalueLength = dwarfRadius.toFixed(1).toString().length;

		if (speedvalueLength > 8) {
			document.getElementById('speedvalue').innerHTML = dwarfSpeed.toExponential(3);
		}
		else {
			document.getElementById('speedvalue').innerHTML = dwarfSpeed.toFixed(2);
		}

		if (radiusvalueLength > 8) {
			document.getElementById('radiusvalue').innerHTML = dwarfRadius.toExponential(3);
		}
		else {
			document.getElementById('radiusvalue').innerHTML = dwarfRadius.toFixed(2);
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
		console.log("normerror")
	} else {
		this.divide(new Vector(magnitude, magnitude));
	}
	return this;
};

Vector.prototype.dot = function (vec) {
    return this.x * vec.x + this.y * vec.y;
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
