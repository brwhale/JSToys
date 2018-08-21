let context = document.getElementById('animation').getContext('2d');
context.font = "12px Helvetica";

let screen_height = context.canvas.clientHeight;
let screen_width = context.canvas.clientWidth;
let camera = {x:0,y:0,zoom:10,aspect:screen_width/screen_height};
let gridScale = 1;
let curve_resolution = 0.1;

let playing = false;

// functions to draw lines
function mapPointToScreenSpace(point) {
	let scale = screen_width/(2*camera.zoom);
	return {x:(camera.zoom+point.x)*scale,y:(camera.zoom-point.y)*scale}
}

function getNPoints(fnc, min, n) {
	if (n <= 0) return;
	let points = [];
	for(let i = 0; i < n; i++){
		let x = min+i*curve_resolution;
		points.push(fnc(x));
	}
	return points;
}
function curveAsPoints(fnc, min, max) {
	let n = (max-min)/curve_resolution;
	return getNPoints(fnc,min,n);
}
function strokePoints(points){
	context.beginPath();
	let p0 = mapPointToScreenSpace(points[0]);
	context.moveTo(p0.x,p0.y);
	points.forEach(function(p){
		let point = mapPointToScreenSpace(p);
		context.lineTo(point.x,point.y);
	});
	context.stroke();
}
function plotLine(fnc) {
	strokePoints(curveAsPoints(fnc, -camera.zoom, camera.zoom));	
}

function makeimg() {
	if (rendering) {
		let image = document.createElement("img");
		image.src =	document.getElementById('animation').toDataURL("img/png");
		document.getElementById('imgdrop').prepend(image);
	}
}

//test funcions to graph
function linfunc1(x){
	return {x:x,y:x};
}
function qfunc(x){
	return {x:x,y:x*x};
}
function trigfnc(x){
	return {x:x,y:Math.cos(x)};
}
let lastVal = null;
function weirdfunc(x) {
	if (lastVal == null) {
		lastVal = x;
	}
	lastVal = lastVal+0.00003*lastVal*lastVal*lastVal*lastVal;
	return {x:x,y:lastVal};
}
function polar(x) {
	let sc = x * 0.5;
	return {x:sc*Math.cos(x),y:sc*Math.sin(x)};
}

// WTF IS GOING ON HERE?
// as c approaches inf, this function converges
// onto the other function, polar(x)
// inf*tan(x/(2*inf)) = x/2?
function polarHalf(x) {
	let c = 1/0.000000000000000000000000000000001;
	let sc = c*Math.tan(x/(c*2));
	return {x:sc*Math.cos(x),y:sc*Math.sin(x)};
}

// non polar example
function linfunc2(x){
	return {x:x,y:x*0.5};
}
function linfunc3(x){
	let c = 1/0.000000004;
	let sc = c*Math.tan(x/(c*2));
	return {x:x,y:sc};
}
// looks like 5/x but wiggly?
function linfunc3lowC(x){
	let c = 0.006366296506402909;
	let sc = c*Math.tan(x/(c*2));
	return {x:x,y:sc};
}
// looks weird as shit
function linfunc3lowCSolvedtry1(x){
	let c = (0.02)/Math.PI;
	let sc = c*Math.tan(x/(c*2));
	return {x:x,y:sc};
}
// looks weird as shit
function linfunc3lowCSolved(x){
	let c = 0.006366197723675815; // last digit here makes prety dramatic changes
	let sc = c*Math.tan(x/(c*2));
	return {x:x,y:sc};
}
// 50/x but wiggly
function linfunc3lowC2(x){
	let c = 0.06366341738721865;
	let sc = c*Math.tan(x/(c*2));
	return {x:x,y:sc};
}
let animC = 0.00000000000001;
let changeamt = 0.000001;
function linfunc3animC(x){
	let sc = animC*Math.tan(x/(animC*2));
	return {x:x,y:sc};
}

// draw grid
context.strokeStyle = 'white';
context.lineWidth = 1;
for (let i = -camera.zoom; i < camera.zoom; i+=gridScale) {
	strokePoints([{x:-camera.zoom,y:i},{x:camera.zoom,y:i}]);
	strokePoints([{x:i,y:-camera.zoom},{x:i,y:camera.zoom}]);
}
context.lineWidth = 3;
strokePoints([{x:-camera.zoom,y:0},{x:camera.zoom,y:0}]);
strokePoints([{x:0,y:-camera.zoom},{x:0,y:camera.zoom}]);

// test lines
// context.strokeStyle = 'red';
// plotLine(linfunc1);
// context.strokeStyle = 'green';
// plotLine(qfunc);
// context.strokeStyle = 'blue';
// plotLine(trigfnc);
// context.strokeStyle = 'purple';
// plotLine(weirdfunc);
// context.strokeStyle = 'orange';
// plotLine(polar);
// context.strokeStyle = 'magenta';
// plotLine(polarHalf);
context.strokeStyle = 'lightcoral';
plotLine(linfunc2);
context.strokeStyle = 'Turquoise';
plotLine(linfunc3lowC);
context.strokeStyle = 'Maroon';
plotLine(linfunc3lowC2);
context.strokeStyle = 'yellow';
plotLine(linfunc3lowCSolved);

function rot(input) {
	while (input < 0) input += 360;
	while (input > 360) input -= 360;
	return input;
}
let count = 0;
let max_frames = 3000;
function animate(frametime) {
	if (playing && count < max_frames) {
		count++;
		context.strokeStyle = "hsl("+rot(count)+",100%,50%)";
		animC+=changeamt;
		changeamt+=0.01*changeamt;
		console.log(animC);
		plotLine(linfunc3animC);
	}
	window.requestAnimationFrame(animate);
}
function toggle() {
	if (!playing) {
		if (count > max_frames) {
			count = 0;
		}
	}
	playing = !playing;
}
animate(0);