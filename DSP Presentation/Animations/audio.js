var sound;
var volume;
var fft;
var filtered;
var spectrum;

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.style('display', 'block');
    cnv.parent('canvas');
    // cnv.mouseClicked(togglePlay);

    sound = loadSound("Assets/song.mp3",loaded);

    // volume = createSlider(0,1,0,0.01);

    fft = new p5.FFT();
    // sound.amp(0.1);

    filtered = new p5.BandPass();

    // noise = new p5.Noise();
    // disconnect unfiltered noise,
    // and connect to filter
    // noise.disconnect();
    // noise.connect(filtered);
    // noise.start();
    
    
    // noise.start();
    // give the filter a narrow band (lower res = wider bandpass)
    // filter.res(5);

}

function loaded(){   
    sound.loop();
    sound.disconnect();
    sound.connect(filtered);
}

function togglePlay() {
    if (sound.isPlaying()) {
      sound.pause();
    } else {
      sound.loop();
    }
  }

// function windowResized() {
//     resizeCanvas(windowWidth,windowHeight);
// }

function draw() {
    background(0);
    filtered.freq(500);    // set this to center frequency
    filtered.res(100);      // increase this for more fine tuning

    spectrum = fft.analyze();
    noStroke();
    fill(0,255,0); // spectrum is green
    for (var i = 0; i< spectrum.length; i++){
      let x = map(i, 0, spectrum.length, 0, width);
      let h = -height + map(spectrum[i], 0, 255, height, 0);
      rect(x, height, width / spectrum.length, h )
    }
  
    let waveform = fft.waveform();
    noFill();
    beginShape();
    stroke(255,0,0); // waveform is red
    strokeWeight(1);
    for (var i = 0; i< waveform.length; i++){
      let x = map(i, 0, waveform.length, 0, width);
      let y = map( waveform[i], -1, 1, 0, height);
      vertex(x,y);
    }
    endShape();
  
    text('click to play/pause', 4, 10);
    

}   