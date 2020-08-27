var pieces, radius, fft, mapMouseX, mapMouseY, playButton, audio, uploadBtn, uploadedAudio, uploadAnim;
var colorPalette = ["#004643", "rgba(100, 89, 62, 0.7)", "#d1ac00", "#795800"];
var uploadLoading = false;

function preload() {
	audio = loadSound("music/hmm.mp3");
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

function draw() {


	background(colorPalette[0]);

	noFill();

	fft.analyze();

	var bass = fft.getEnergy("bass");
	var treble = fft.getEnergy("treble");
	var mid = fft.getEnergy("mid");

	var mapMid = map(mid, 0, 255, -radius, radius);
	var scaleMid = map(mid, 0, 255, 1, 1.5);

	var mapTreble = map(treble, 0, 255, -radius/4, radius/4);
	var scaleTreble = map(treble, 0, 255, 1, 1.5);

	var mapbass = map(bass, 0, 255, -100, 800);
	var scalebass = map(bass, 0, 255, 0, 0.8);

	mapMouseX = map(mouseX, 0, width, 3, 10);
	mapMouseY = map(mouseY, 0, height, windowHeight / 4, windowHeight/2);

	pieces = mapMouseX;
	radius = mapMouseY;

	translate(windowWidth / 2, windowHeight / 2);

	strokeWeight(1);

	for (i = 0; i < pieces; i += 0.25) {

		rotate(TWO_PI / pieces);


		/*----------  BASS  ----------*/
		push();
		strokeWeight(5);
		stroke(colorPalette[1]);
		scale(scalebass);
		rotate(frameCount * -0.5);
		line(mapbass, radius / 2, radius, radius);
		line(-mapbass, -radius / 2, radius, radius);
		pop();



		/*----------  MID  ----------*/
		push();
		strokeWeight(0.5);
		stroke(colorPalette[2]);
		scale(scaleMid);
		line(mapMid, radius / 2, radius/2, radius/2);
		//line(-mapMid, -radius / 2, radius, radius);
		pop();


		/*----------  TREMBLE  ----------*/
		push();
		stroke(colorPalette[3]);				  
		scale(scaleTreble);
		line(mapTreble, radius / 2, radius*2, radius);
		//line(-mapTreble, -radius / 2, radius, radius);
		rect(-mapTreble, -radius / 2, radius, radius)
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