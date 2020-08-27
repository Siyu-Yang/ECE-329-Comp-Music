var pieces, radius, fft, playButton, mapMouseX, mapMouseY, audio, uploadBtn, uploadedAudio, uploadAnim;
//var colorPalette = ["#726a95", "#5b0ff5", "#f50fac", "#f50fac"];
var colorPalette = ["#726a95", "#5c95ff", "#f87575", "#5b0ff5"];
var uploadLoading = false;

/*=============================================
  SETUP
=============================================*/

function preload() {
	audio = loadSound("music/fish.mp3");
}

function uploaded(file) {
	uploadLoading = true;
	uploadedAudio = loadSound(file.data, uploadedAudioPlay);
}


function uploadedAudioPlay(audioFile) {

	uploadLoading = false;

	if (audio.isPlaying()) {
		audio.pause();
	}

	audio = audioFile;
	audio.loop();
}

function setup() {

	uploadAnim = select('#uploading-animation');

	createCanvas(windowWidth, windowHeight);

	startScreen = createDiv();
	startScreen.addClass('startScreen');
	
	header = createDiv("Audio Visualizers");
	header.addClass('header');

	playButton = createButton("Play");
	playButton.addClass('toggle-btn');
	playButton.mousePressed(start);


	uploadBtn = createFileInput(uploaded);

	uploadBtn.addClass("upload-btn");


	fft = new p5.FFT();

	audio.loop();
	audio.pause();

}



/*=============================================
  DRAW
=============================================*/
function draw() {

	background(colorPalette[0]);

	fft.analyze();

	var bass = fft.getEnergy(100, 150);
	var treble = fft.getEnergy(150, 250);
	var mid = fft.getEnergy("mid");

	var mapMid = map(mid, 0, 255, -100, 200);
	var scaleMid = map(mid, 0, 255, 1, 1.5);
	var mapTreble = map(treble, 0, 255, 200, 350);
	var scaleTreble = map(treble, 0, 255, 0, 1);
	var mapbass = map(bass, 0, 255, 50, 200);
	var scalebass = map(bass, 0, 255, 0.05, 1.2);

	mapMouseX = map(mouseX, 0, width, 1, 50);
	mapMouseXbass = map(mouseX, 0, width, 1, 5);
	mapMouseY = map(mouseY, 0, height, 2, 6);

	pieces = 30;
	radius = 80;
	
	translate(windowWidth / 2, windowHeight / 2);

	for (i = 0; i < pieces; i += 0.6) {
	
		rotate(TWO_PI / (pieces / 2));

		noFill();

		/*----------  BASS  ----------*/
		push();
		stroke(colorPalette[1]);
		rotate(frameCount * 0.002);
		strokeWeight(0.5);
		ellipse(mapbass+i, mapbass+i, mapMouseXbass * i,mapMouseXbass * i);
		pop();


		/*----------  MID  ----------*/
		push();
		stroke(colorPalette[2]);
		strokeWeight(0.9);
		polygon(mapMid/4, mapMid/4, mapMouseX * i/2, 5);
		pop();


		/*----------  TREMBLE  ----------*/
		push();
		stroke(colorPalette[3]);
		strokeWeight(2);
		scale(mouseX * 0.0005);
		rotate((mouseX * 0.002));
		polygon(mapTreble + i / 2, mapTreble - i / 2, mapMouseY * i / 2, 3);
		pop();

	}

}


function start() {
		audio.play();
		startScreen.remove();
		header.remove();
		playButton.remove();
}




function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function polygon(x, y, radius, npoints) {
	var angle = TWO_PI / npoints;
	beginShape();
	for (var a = 0; a < TWO_PI; a += angle) {
		var sx = x + cos(a) * radius;
		var sy = y + sin(a) * radius;
		vertex(sx, sy);
	}
	endShape(CLOSE);
}