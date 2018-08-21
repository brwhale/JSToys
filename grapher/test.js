let context = document.getElementById('animation').getContext('2d');
context.font = "12px Helvetica";

let screen_height = context.canvas.clientHeight;
let screen_width = context.canvas.clientWidth;
let camera = {x:0,y:0,zoom:10,aspect:screen_width/screen_height};
let gridScale = 1;
let curve_resolution = 0.1;

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
	strokePoints(curveAsPoints(fnc, -10, 10));	
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
function linfunc3lowC(x){
	let c = 0.01;
	let sc = c*Math.tan(x/(c*2));
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
context.strokeStyle = 'red';
plotLine(linfunc1);
context.strokeStyle = 'green';
plotLine(qfunc);
context.strokeStyle = 'blue';
plotLine(trigfnc);
context.strokeStyle = 'purple';
plotLine(weirdfunc);
context.strokeStyle = 'orange';
plotLine(polar);
context.strokeStyle = 'magenta';
plotLine(polarHalf);
context.strokeStyle = 'lightcoral';
plotLine(linfunc2);
context.strokeStyle = 'yellowgreen';
plotLine(linfunc3);
context.strokeStyle = 'Turquoise';
plotLine(linfunc3lowC);