Array.prototype.last = function(){
    return this[ this.length-1 ];
  }
  
  // ************************************************************************************** //
  // Variables
  
  var canvas_width = 1024, canvas_height = 768;
  var canvas_size = 400;
  d3.select('#canvas').styles({ width: canvas_width, height: canvas_height });
  d3.select('#canvas_1').attrs({ width: canvas_width, height: canvas_height });
  d3.select('#container').attrs({ class: 'mx-auto' }).styles({ width: canvas_width, height: canvas_height });
  
  var canvas = d3.select("#canvas_1");
  var ctx = canvas.node().getContext("2d");
  
  var timeSpan = 5, dt = 0.01;
  var waves = [ {freq: 0.8, amp: 1, phase: 0}, {freq: 1.2, amp: 0, phase: 0} ];
  var time = [], mag = [], com_amp_arr = [], wind_freq_arr = [];
  var wind_freq_to_index_scale, com_amp;
  var wind_freq = 1;
  
  var winding_animation = {};
  winding_animation.active = false; winding_animation.time = 0;
  
  var lineGen = d3.line().x(function(d){ return d.x }).y(function(d){ return d.y });
  
  // ************************************************************************************** //
  // Computation
  
  function createGraphArray(){
    time = []; mag = [];
    for(var t = 0; t <= timeSpan; t += dt){ time.push(t); mag.push(0); }
    waves.forEach(d => {
      mag = numeric.add(mag, numeric.mul(d.amp, numeric.cos( numeric.mul(d.freq*2*Math.PI, time) )));
      mag = numeric.add(mag, d.amp)
    });
    winding_animation.index = time.length - 1;
    createFrequencyAnalysis();
  }
  
  function createFrequencyAnalysis(){
    var temp_wind_freq = d3.range(0.2, 2, 0.01);
    var temp_angle = temp_wind_freq.map(freq => { return numeric.mul(2*Math.PI*freq, time); });
    var temp_mag = temp_wind_freq.map(d => { return mag });
  
    var temp_x = numeric.mul(temp_mag, numeric.cos(temp_angle));
    var temp_y = numeric.mul(temp_mag, numeric.sin(temp_angle));
  
    var com_x_arr = temp_x.map(d => { return math.mean(d) });
    var com_y_arr = temp_y.map(d => { return math.mean(d) });
    com_amp_arr = numeric.add( numeric.pow(com_x_arr, 2), numeric.pow(com_y_arr, 2) );
    wind_freq_arr = temp_wind_freq;
  
    wind_freq_to_index_scale = d3.scaleLinear().domain([0.2, 2]).range([0, temp_wind_freq.length-1]);
  }
  
  // ************************************************************************************** //
  // Setup and Update
  
  function setup(){
    cartesian_graph.createCanvasElements();
    polar_graph.createCanvasElements();
    frequency_graph.create();
  }
  
  function update(){
    createGraphArray();
    cartesian_graph.updateGraph();
    polar_graph.updateGraph();
    frequency_graph.update();
  
    stop_windingAnimation();
  }
  
  setup(); update();
  
  // ************************************************************************************** //
  // Widning button
  
  function windingButton_click(){
    if(winding_animation.active == false){
      start_windingAnimation();
      return
    };
  
    if(winding_animation.active == true){
      stop_windingAnimation();
    }
  }
  
  function start_windingAnimation(){
    winding_animation.active = true;
    polar_graph.wind_button.text('Stop Winding');
  
    winding_animation.timer = d3.interval(function(t){
      winding_animation.time = t*0.4/1000;
      winding_animation.index = parseInt(winding_animation.time/dt);
      if(winding_animation.index >= time.length){ winding_animation.index = time.length-1; stop_windingAnimation(); }
      polar_graph.animate(); cartesian_graph.animate();
    }, 20);
  
    polar_graph.line.styles({ 'display': null });
    polar_graph.line_winding.styles({ 'display': null });
    cartesian_graph.line.styles({ 'display': null });
    cartesian_graph.line_winding.styles({ 'display': null });
  }
  
  function stop_windingAnimation(){
    winding_animation.active = false;
    polar_graph.wind_button.text('Start Winding');
  
    polar_graph.line.styles({ 'display': 'none' });
    polar_graph.line_winding.styles({ 'display': 'none' });
    cartesian_graph.line.styles({ 'display': 'none' });
    cartesian_graph.line_winding.styles({ 'display': 'none' });
  
    if(winding_animation.timer){ winding_animation.timer.stop(); }
    winding_animation.index = time.length - 1;
    polar_graph.animate(); cartesian_graph.animate();
  }
  