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
var earthSun = document.getElementById("earth_sun");
var precession = document.getElementById("precession");
var ellips = document.getElementById("ellips");
var trailColor = "#1BA39C";
var trailColors = ["#2781A3","#6EA327","#1BA39C ","#CD518B ","#A35827 ",
				   "#F4B683","#3754CB","#27A36B","#D2106A",
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

var orbittrailvalue = 5;

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
var velocity;
var velocityscale;
var minRadius = 0;
var maxRadius = 0;

var maxradiuspositionx = [];
var maxradiuspositiony = [];
var onetime = 0;
var maxradiuspositionxMidvalue = 0;
var maxradiuspositionxLasttwo = [0,0];
var maxradiuspositionyMidvalue = 0;
var maxradiuspositionyLasttwo = [0,0];

var maxradiusCurrent = [];
var maxradiusCurrentLargest;
var largestArrayposition;

var verschilX = 0;
var verschilY = 0;
var zijdetussentweepunten = 0;
var precessionAngle = 0;


setValue.addEventListener("click", setup);
setValue.addEventListener("click", ChangeColor);
deleteTrail.addEventListener("click", ResetTrail);
background.addEventListener("click", ToggleGrid);
earthSun.addEventListener("click", EarthSun);
precession.addEventListener("click", Precession);
ellips.addEventListener("click", Ellips);
dashboardbutton.addEventListener("click", ToggleDashboard);
setup();



// Setting variables 
function setup (){
    sVar = Number(radius.value);
    scale = 400 / sVar;

		velocity = Number(vDwarf.value);
		velocityscale = 100 / velocity;

    radiocheck = document.getElementById('terms').checked;

	dwarf = {
		element: document.getElementById("m"),
		mass: Number(massDwarf.value),
		velocity: new Vector(0, -Number(vDwarf.value)),
		acceleration: new Vector(0, 0),
		position: new Vector(sVar, 0)
	};

	planet = {
		element: document.getElementById("M"),
		mass: Number(massPlanet.value),
		velocity: new Vector(0, -Number(vPlanet.value)),
		acceleration: new Vector(0, 0),
		position: new Vector(0, 0)
	};

	G = Number(gravConst.value);
	dtScalar = deltaTime.value;

    	ScaleValues();
    	
	maxRadius = 0;
	minRadius = 0;
	maxradiuspositionx = [];
	maxradiuspositiony = [];
	maxradiusCurrent = [];
	maxradiuspositionxLasttwo = [0,0];
	maxradiuspositionyLasttwo = [0,0];
	precessionAngle = 0;
}

// function that loops the main functions
function mainLoop(){
	Calc();
	Draw();
	MaxRadius();
	MinRadius();
	PrecessionAngle();
	Value();
	//VectorLines();

	requestAnimationFrame(mainLoop);

	var now = new Date().getTime();
	dt = now - (t || now);
	dt *= dtScalar;
	t = now;
}

requestAnimationFrame(mainLoop);

//Does all the physics calculations
function Calc (){

	forceDwarf = planet.position.clone().subtract(dwarf.position);
	forcePlanet = dwarf.position.clone().subtract(planet.position);
	distance = forceDwarf.clone().magnitude();

	forceDwarf.normalize();
	forcePlanet.normalize();

	console.clear();

	var h = 0.1;

	mu = (dwarf.mass * planet.mass) / (dwarf.mass + planet.mass);
	//console.log("mu: " + mu);
	// console.log("L: " + L);
	var firstTerm = (FirstTerm(distance + h) - FirstTerm(distance)) / h;
	var secondTerm = (SecondTerm(distance + h) - SecondTerm(distance)) / h;
	var thirdTerm = (ThirdTerm(distance + h) - ThirdTerm(distance)) / h;

	//console.log("secondTerm: " + secondTerm(distance));

	// var angle = Math.acos(dwarf.velocity.clone().normalize().dot(forceDwarf));
	// var L = distance * dwarf.mass * dwarf.velocity.clone().magnitude() * Math.sin(Math.PI - angle);

	// var firstTerm = (G * planet.mass * dwarf.mass) / Math.pow(distance, 2);
	// var secondTerm = Math.pow(L, 2) / (mu * Math.pow(distance, 3));
	// var thirdTerm = (3 * G * planet.mass * Math.pow(L, 2)) / (Math.pow(c, 2) * Math.pow(distance, 4));

	// console.log("g: " + firstterm);
	// console.log("m: " + secondterm);
	// console.log("r: " + thirdterm);

	if (radiocheck){
		var force = firstTerm + secondTerm + thirdTerm;
	} else{
		var force = firstTerm;
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

//calculates the first term
function FirstTerm (r){
	var grav = (G * dwarf.mass * planet.mass) / r;
	return -grav;
}

//calculates the second term
function SecondTerm(r) {
	var angle = Math.acos(dwarf.velocity.clone().normalize().dot(forceDwarf));
	// console.log("Angle: " + angle);
	var L = r * Number(dwarf.mass) * dwarf.velocity.clone().magnitude() * Math.sin(angle);
	// console.log("L: " + L);
	var sec = (L * L) / (2 * mu * r * r);
	// console.log("Mom: " + mom);
	// console.log("r: " + r);
	return sec;
}

//calculates the third term
function ThirdTerm(r) {
	var angle = Math.acos(dwarf.velocity.clone().normalize().dot(forceDwarf));
	var L = r * Number(dwarf.mass) * dwarf.velocity.clone().magnitude() * Math.sin(angle);
	var thi = ((G * dwarf.mass + G * planet.mass) * (L * L)) / (c * c * mu * r * r * r);
	return -thi;
}

//displays the calulated values on the screen
function Draw (){
	dwarf.element.style.marginLeft = (dwarf.position.x * scale) + "px";
	dwarf.element.style.marginTop = (dwarf.position.y * scale) + "px";

	planet.element.style.marginLeft = (planet.position.x * scale) + "px";
	planet.element.style.marginTop = (planet.position.y * scale) + "px";

	i++;

	if (i % orbittrailvalue === 0){
		OrbitTrail();
	}

}

// function VectorLines (){
// 		var windowHeigth = window.innerHeight;
// 		var windowWidth = window.innerWidth;
//
// 		var dwarfpositionx = ((0.5*windowWidth)+(dwarf.position.x * scale));
// 		var dwarfpositiony = ((0.5*windowHeigth)+(dwarf.position.y * scale));
//
// 		var dwarfvelocityx = dwarf.velocity.x * velocityscale;
// 		var dwarfvelocityy = dwarf.velocity.y * velocityscale;
//
// 		var dwarfaccelerationx = forceDwarf.clone().divideScalar(dwarf.mass).x;
// 		var dwarfaccelerationy = forceDwarf.clone().divideScalar(dwarf.mass).y;
//
// 		var dwarfforcex = (dwarfaccelerationx * Number(deltaTime.value)*100);
// 		var dwarfforcey = (dwarfaccelerationy * Number(deltaTime.value)*100);
//
// 		console.log(velocityscale);
// 		console.log(dwarfforcex);
// 		console.log(dwarf.velocity);
// 		console.log(dwarfaccelerationx);
// 		console.log(forceDwarf.magnitude());
// 		console.log(Number(deltaTime.value));
//
//
// 		var svg = document.getElementById('svg');
// 		svg.setAttribute("height",windowHeigth);
// 		svg.setAttribute("width",windowWidth);
//
//
// 		var line1 = document.getElementById("line1");
// 		var line2 = document.getElementById('line2');
//
// 		line1.setAttribute("x1",(dwarfpositionx + dwarfvelocityx));
// 		line1.setAttribute("y1",(dwarfpositiony + dwarfvelocityy));
// 		line1.setAttribute("x2",dwarfpositionx);
// 		line1.setAttribute("y2",dwarfpositiony);
// }

// Function to display the radiusvalues on the grid
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

// Set values Earth and Sun
function EarthSun() {
    vDwarf.value = 29780;
    radius.value = 1.4960e11;
    massDwarf.value = 5.972e24;
    massPlanet.value = 1.989e30;
    gravConst.value = 6.67408e-11;
    deltaTime.value = 1000;
		orbittrailvalue = 10;

    trailColor = "#0389FB";
    document.getElementById("m").style.backgroundColor = "#0389FB";

    setup();
}
// Set fictional values to visualize precession
function Precession() {
    vDwarf.value = 1;
    radius.value = 20;
    massDwarf.value = 1;
    massPlanet.value = 10;
    gravConst.value = 10;
    deltaTime.value = 0.0015;
		orbittrailvalue = 20;

    trailColor = "#FEE1B6";
    document.getElementById("m").style.backgroundColor = "#FEE1B6";

    setup();
}

// Set fictional values to visualize Ellips
function Ellips() {
    vDwarf.value = 5;
    radius.value = 400;
    massDwarf.value = 4;
    massPlanet.value = 2000;
    gravConst.value = 10;
    deltaTime.value = 0.04;
	orbittrailvalue = 5;

    trailColor = "#27A36B";
    document.getElementById("m").style.backgroundColor = "#27A36B";

    setup();
}

// Function to switch the grid on and of
function ToggleGrid(){
    var toggleGrid = document.getElementById("background");

    if (toggleGrid.style.display == "block") {
        toggleGrid.style.display = "none";
    } else {
        toggleGrid.style.display = "block";
    }
}

// Function to switch the Dashboard on and off
function ToggleDashboard(){
    var toggleDashboard = document.getElementById("dashboard");

    if (toggleDashboard.style.display == "block") {
        toggleDashboard.style.display = "none";
    } else {
        toggleDashboard.style.display = "block";
    }
}

// Function to randomly change the color of the trail and the planet
function ChangeColor (){
    var randomColor = trailColors[Math.floor(Math.random() * trailColors.length)];
    trailColor = randomColor;
    document.getElementById("m").style.backgroundColor = randomColor;
}

// Function to display a trail behind the planet
function OrbitTrail(){
    var trailDot = document.createElement("div");
    trailDot.id = "Dot";

    trailDot.style.marginLeft = (dwarf.position.x * scale) + "px";
    trailDot.style.marginTop = (dwarf.position.y * scale) + "px";
    trailDot.style.backgroundColor = trailColor;

    trail.appendChild(trailDot);
}

// Function to delete the trail
function ResetTrail (){
    var elem = document.getElementById("trail")

    while (elem.firstChild){
    	elem.removeChild(elem.firstChild);
    }
}

// Function to display values in the dashboard
function Value () {
	var speedvalueLength = dwarfSpeed.toFixed(1).toString().length;
	var radiusvalueLength = dwarfRadius.toFixed(1).toString().length;
	var minradiusvalueLength = minRadius.toFixed(1).toString().length;
	var maxradiusvalueLength = maxRadius.toFixed(1).toString().length;
	
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
	
	if (maxradiusvalueLength > 8) {
		document.getElementById('maxradiusvalue').innerHTML = maxRadius.toExponential(3);
	}
	else {
		document.getElementById('maxradiusvalue').innerHTML = maxRadius.toFixed(2);
	}
	
	if (minradiusvalueLength > 8) {
		document.getElementById('minradiusvalue').innerHTML = minRadius.toExponential(3);
	}
	else {
		document.getElementById('minradiusvalue').innerHTML = minRadius.toFixed(2);
	}
	
	if (precessionAngle == 0 || precessionAngle == NaN) {
		document.getElementById('precessionanglevalue').innerHTML = "";
	}
	else if(precessionAngle > 0.1) {
		document.getElementById('precessionanglevalue').innerHTML = precessionAngle.toFixed(2) + " &deg";
	}
	else if (precessionAngle <= 0.1 && precessionAngle >= 0.005) {
		document.getElementById('precessionanglevalue').innerHTML = (precessionAngle.toFixed(2) * 60) + " '";
	}
	else if (precessionAngle <= 0.005) {
		document.getElementById('precessionanglevalue').innerHTML = (precessionAngle.toFixed(2) * 3600) + " ''";
	}
}

// Function to get the maximum  radius
function MaxRadius () {
		if (dwarfRadius > maxRadius) {
			maxRadius = dwarfRadius;
		}

}

// Function to get the minimum radius
function MinRadius () {
		if (minRadius == 0) {
			minRadius = Number(Radius.value);
		}

		if (dwarfRadius < minRadius) {
			minRadius = dwarfRadius;
		}

}

// Function to calculate the precession angle
function PrecessionAngle () {
	var roundedRadius = Number(dwarfRadius.toFixed(0));
	var roundedmaxRadius = Number(maxRadius.toFixed(0));
	var roundedpositionX = Number(dwarf.position.x).toFixed(0);
	var inaccuracyvalue = Number(maxRadius * 0.02);

	if (Number(dwarfRadius) >= (Number(maxRadius) - inaccuracyvalue) && Number(dwarfRadius) <= (Number(maxRadius) + inaccuracyvalue)){
		maxradiuspositionx.unshift(dwarf.position.x);
		maxradiuspositiony.unshift(dwarf.position.y);
		maxradiusCurrent.unshift(dwarfRadius);
	}

	if (roundedpositionX < 0){
		if (onetime < 1){
			onetime++;

			maxradiusCurrentLargest = Math.max.apply(Math, maxradiusCurrent);
			largestArrayposition = maxradiusCurrent.indexOf(maxradiusCurrentLargest);
			maxradiusCurrent = [];

			maxradiuspositionxMidvalue = maxradiuspositionx[largestArrayposition];
			maxradiuspositionxLasttwo.unshift(maxradiuspositionxMidvalue);
			maxradiuspositionxLasttwo.pop();
			maxradiuspositionx = [];

			maxradiuspositionyMidvalue = maxradiuspositiony[largestArrayposition];
			maxradiuspositionyLasttwo.unshift(maxradiuspositionyMidvalue);
			maxradiuspositionyLasttwo.pop();
			maxradiuspositiony = [];


			verschilX = Math.abs(maxradiuspositionxLasttwo[0] - maxradiuspositionxLasttwo[1]);
			verschilY = Math.abs(maxradiuspositionyLasttwo[0] - maxradiuspositionyLasttwo[1]);

			zijdetussentweepunten = Math.sqrt((verschilX * verschilX) + (verschilY * verschilY));

			precessionAngle = (2 * (Math.asin((zijdetussentweepunten / 2) / (maxRadius)))) * (180 / Math.PI);



		}


	}

	if (roundedpositionX > 0){
		onetime = 0;
	}

}

//Funtions for the vector calulations
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
