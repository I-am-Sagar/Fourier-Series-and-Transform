var polar_graph = {};

// ************************************************************************************** //
// Create

polar_graph.createCanvasElements = function(){
  polar_graph.width = 0.4*canvas_width, polar_graph.height = 0.6*canvas_height;
  var tempX = 0.05*canvas_width + 0.5*polar_graph.width, tempY = cartesian_graph.height + 40 + 0.5*polar_graph.height;
  polar_graph.origin_x = tempX; polar_graph.origin_y = tempY;
  polar_graph.origin =  d3.select('#canvas').append('g').attrs({ transform: 'translate(' +tempX+ ',' +tempY+ ')' });

  polar_graph.xAxis = polar_graph.origin.append('line');
  polar_graph.yAxis = polar_graph.origin.append('line');
  polar_graph.path = polar_graph.origin.append('path').attrs({ id: 'polar_graph_path' });

  polar_graph.circle = polar_graph.origin.append('circle').attrs({ r: 5 }).styles({ 'fill': 'red' });
  polar_graph.line = polar_graph.origin.append('line').attrs({ x1: 0, y1: 0, 'marker-end': 'url(#arrow)' }).styles({ 'stroke': 'white', 'stroke-width': 3, 'opacity': 0 });
  this.line_winding = this.origin.append('line')
    .attrs({ x1: 0, y1: 0 })
    .styles({ 'stroke': 'orange', 'stroke-dasharray': '6,6', 'stroke-width': 3 });

  polar_graph.wind_freq_ctlr = {};
  polar_graph.wind_freq_ctlr.div = d3.select('#container').append('div').styles({ 'position': 'absolute', 'top': polar_graph.height+cartesian_graph.height-100, 'left': 540 });
  polar_graph.wind_freq_ctlr.slider = polar_graph.wind_freq_ctlr.div.append('input').attrs({ type: 'range', min: 0.2, max: 2, step: 0.01, value: waves[0].freq }).styles({ width: '10em' });
  polar_graph.wind_freq_ctlr.text = polar_graph.wind_freq_ctlr.div.append('text').attrs({ class: 'ml-2' }).styles({ 'font-size': '1.5em', 'color': '#bbb', 'vertical-align': 'text-bottom' }).html('Winding Frequency = ' + wind_freq + ' Hz');
  polar_graph.wind_freq_ctlr.slider.on('input', function(){
    wind_freq = this.value;
    polar_graph.wind_freq_ctlr.text.html('Winding Frequency = ' + wind_freq + ' Hz');
    update();
  })

  polar_graph.wind_button = d3.select('#container')
    .append('div').styles({ 'position': 'absolute', 'top': polar_graph.height+cartesian_graph.height-50, 'left': 569 })
    .append('button').text('Start Winding').on('click', windingButton_click);
}

// ************************************************************************************** //
// Update

polar_graph.updateGraph = function(){
  var axis_length = 0.4*this.height;
  this.xAxis.attrs({ x1: -axis_length, y1: 0, x2: axis_length, y2: 0, class: 'axis' });
  this.yAxis.attrs({ y1: -axis_length, x1: 0, y2: axis_length, x2: 0, class: 'axis' });

  this.scale = d3.scaleLinear().domain([0, math.max(d3.extent(mag))]).range([0, axis_length]);

  var temp_mag = mag.map(d => { return this.scale(d) });
  var temp_angle = numeric.mul(2*Math.PI*wind_freq, time);
  var temp_x = numeric.mul(temp_mag, numeric.cos(temp_angle));
  var temp_y = numeric.mul(temp_mag, numeric.sin(temp_angle));

  var temp_arr = temp_x.map((d,i) => {
    return { x: temp_x[i], y: temp_y[i] }
  })
  this.data_array = temp_arr;
  this.data_array.forEach(d => { d.x += polar_graph.origin_x; d.y += polar_graph.origin_y; })
  this.x_array = temp_x; this.y_array = temp_y;

  this.animate();
}

// ************************************************************************************** //
// Animate Polar Graph

polar_graph.animate = function(){
  var tempX = 0.05*canvas_width + 0*polar_graph.width, tempY = cartesian_graph.height + 40 + 0*polar_graph.height;
  ctx.fillStyle = 'black';
  ctx.fillRect(tempX, tempY, this.width, this.height);

  ctx.lineWidth = 3; ctx.strokeStyle = '#0a5275';
    ctx.beginPath();
    for(var i = 0; i < winding_animation.index-1; i++){
      if(this.data_array[i+1] != undefined){
        ctx.moveTo(this.data_array[i].x, this.data_array[i].y); ctx.lineTo(this.data_array[i+1].x, this.data_array[i+1].y);
      }
    }
    ctx.stroke();

    if(winding_animation.index){
      polar_graph.line.attrs({ x2: this.data_array[winding_animation.index].x - polar_graph.origin_x, y2: this.data_array[winding_animation.index].y - polar_graph.origin_y });
      polar_graph.line_winding.attrs({ x2: 0.4*this.height*Math.cos(winding_animation.time*wind_freq*2*Math.PI), y2: 0.4*this.height*Math.sin(winding_animation.time*wind_freq*2*Math.PI) });
    }

    // Calculating the centre of mass
    if(winding_animation.index != 0){
      this.com_x = math.mean( this.x_array.slice(0, winding_animation.index) );
      this.com_y = math.mean( this.y_array.slice(0, winding_animation.index) );
      this.circle.attrs({ cx: this.com_x, cy: this.com_y });
      com_amp = Math.sqrt(Math.pow(this.com_x, 2) + Math.pow(this.com_y, 2));
      com_amp = this.scale.invert(com_amp);
    }
}
