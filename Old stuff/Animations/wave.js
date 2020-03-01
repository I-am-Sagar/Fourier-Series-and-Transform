let time = 0
let wave = []
let sliderlist
let preset = []
let phases = []

function sine_default() {
    preset = []
    phases = []
    for (let n = 1; n <= 13; n++) {
      preset.push( n==1 ? 1:0)  
    }                                                              
}

function windowResized() {
    resizeCanvas(windowWidth,windowHeight);
}

function drawGrid(){      
    push();
    translate(0,0);
    stroke('#262626');
    strokeWeight(1);			
    for(i=0;i<=windowWidth;i+=10)
        line(i,0,i,windowHeight);
    for(i=0;i<=windowHeight;i+=10)
        line(0,i,windowWidth,i);
    pop();
}

function setup () {
    let cnv = createCanvas(windowWidth,windowHeight)
    cnv.parent('canvas')
    sine_default()

    document.getElementById('sine-wave').onclick = e => {
  
            preset = []
            phases = []
            for (let n = 1; n <= 13; n++) {
              preset.push( n==1 ? 1:0) 
            }                           
    }
    document.getElementById('square-wave').onclick = e => {
      preset = []
      phases = []
      for (let n = 1; n <= 13; n++) {
        preset.push(n % 2 ? (4 / (Math.PI * n)) / (4 / Math.PI) : 0)  // taking only odd valued frequencies
      }                                                               // fourier coefficient of square wave is 4/pi*n x odd terms of sine
    } 

    document.getElementById('sawtooth-wave').onclick = e => {
      preset = []
      phases = []
      for (let n = 1; n <= 13; n++) {
        preset.push(1/n)
      }
    }

    document.getElementById('triangle-wave').onclick = e => {
        preset = []
        phases = []
        for (let n = 1; n <= 13; n++) {
        preset.push(n % 2 ? 9.8 / ((n * Math.PI) ** 2) : 0)
        phases.push(n % 4 === 3)
      }
    }
}

function draw () {
    
    background(75)
    drawGrid()
    translate(400, 300)
    
    let x = 0
    let y = 0
  
    for (let i = 0; i < 13; i++) {  // no of circles
      let prevx = x   // endpoint of previous circle set to center of 
      let prevy = y
      let radius = 100*preset[i] // radius of each circle
      if (phases[i]) {
        radius *= -1
      }
  
      x += radius * cos(time * (i + 1))  // new tip of circle combinations till now
      y += radius * sin(time * (i + 1))
  
      stroke(255, 100)
      noFill()
      ellipse(prevx, prevy, 2 * radius) // reference circle
  
      stroke(255)
      line(prevx, prevy, x, y)          // vector rotating on the circel
      ellipse(x, y, 2)                  // draws a small circle on the tip of each vector
    }
    wave.unshift(y)                     // the y coordinate of the vector on last circle (our main signal)
  
    translate(200, 0)
    line(x - 200, y, 0, wave[0])        // the horizontal extension line from 
    beginShape()
    noFill()
    for (let i = 0; i < wave.length; i++) {
      vertex(i, wave[i])                // will plot all y obtained till now at x=0,1,...
    }
    endShape()
  
    time += 0.05
  
    if (wave.length > 500) {            // change this value to increase length of wave
      wave.pop()
    }
  }
