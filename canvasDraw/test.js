let context = document.getElementById('animation').getContext('2d');
context.font = "12px Helvetica";
context.strokeStyle = 'red';
context.lineWidth = 3;
var startpoint = {x:400,y:400,ang:0,gc:0};
var points = [startpoint];
var running = true;
var rendering = false;

function toggleimg() {
	rendering = !rendering;
}

function toggle() {
	running = !running;
}

function rot(input) {
	if (input < 0) input += 2*Math.PI;
	if (input > 2*Math.PI) input -= 2*Math.PI;
	return input;
}

var mm = 9;
function animate(frametime) {
	if (running) {
		points.forEach(function(point){
			context.beginPath();
			context.moveTo(point.x,point.y);
			point.ang = rot(point.ang + 2*(1-Math.random()));	
			point.x += mm*Math.cos(point.ang);
			point.y += mm*Math.sin(point.ang);
			context.lineTo(point.x,point.y);
			context.strokeStyle = "hsl("+(point.ang*180/Math.PI)+",100%,"+(10+point.gc)+"%)";
			context.stroke();
		});
		if (frametime % 4 < 0.1) {
			var temp = (Object.assign({}, points[points.length-1]));
			temp.gc++;
			points.push(temp);
			console.log('splitting');
			if (frametime % 8 < 0.1) {
				makeimg();
			}
		}
	}
	window.requestAnimationFrame(animate);
}

function makeimg() {
	if (rendering) {
		var image = document.createElement("img");
		image.src =	document.getElementById('animation').toDataURL("img/png");
		document.getElementById('imgdrop').prepend(image);
	}
}
window.requestAnimationFrame(animate);
