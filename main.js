var earth = {
	element: document.getElementById("m"),
	mass: 20
};

function calc(){

}

function mainLoop(){
	calc();
	requestAnimationFrame(mainLoop);
}
