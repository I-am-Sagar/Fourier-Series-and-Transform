var sound;
var noisey;
var tuning;
var band;
var fft;
var filtered;
var spectrum;
var path = "Assets/noise/fetal_doppler.mp3";

function preload(){
    sound = loadSound(path);
    noisey = loadSound(path);
}

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent('canvas');

    fft = new p5.FFT();
    noise_fft = new p5.FFT();
 
    filtered = new p5.BandPass();
     
    noisey.disconnect();
    noisey.connect(noise_fft);
    noisey.loop();

    sound.disconnect();
    sound.connect(filtered);
    sound.loop();

}

function draw() {
    background(0);
    tuning = parseInt(document.getElementById('tuning').value);
    band = parseInt(document.getElementById('band').value);
    filtered.freq(tuning);    // set this to center frequency
    filtered.res(band);      // increase this for more fine tuning
  
    let waveform = fft.waveform();
    noFill();
    beginShape();
    stroke(0,255,0); 
    strokeWeight(1);
    for (var i = 0; i< waveform.length; i++){
      let x = map(i, 0, waveform.length, 0, width);
      let y = map( waveform[i], -1, 1, 0, height);
      vertex(x,y);
    }
    endShape();

    noise_spectrum = noise_fft.analyze();
    noStroke();
    fill(255,255,255); // spectrum is green
    for (var i = 0; i< noise_spectrum.length/2; i++){
      let x = map(i, 0, noise_spectrum.length/2, 0, width);
      let h = -height + map(noise_spectrum[i], 0, 255, height, 0);
      rect(x, height, width / noise_spectrum.length , h )
    }
    
    spectrum = fft.analyze();
    noStroke();
    fill(255,0,0); 
    for (var i = 0; i< spectrum.length/2; i++){
      let x = map(i, 0, spectrum.length/2, 0, width);
      let h = -height + map(spectrum[i], 0, 255, height, 0);
      rect(x, height, width / spectrum.length , h )
    }

}   