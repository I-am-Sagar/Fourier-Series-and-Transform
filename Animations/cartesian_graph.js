var cartesian_graph = {};

// ************************************************************************************** //
// Create

cartesian_graph.createCanvasElements = function(){
  cartesian_graph.width = 0.9*canvas_width, cartesian_graph.height = 0.238*canvas_height;
  // var tempX = 0.05*canvas_width, tempY = 0.5*cartesian_graph.height + 20;
  var tempX = 0.05*canvas_width, tempY = 1*cartesian_graph.height + 10;
  cartesian_graph.origin =  d3.select('#canvas').append('g').attrs({ transform: 'translate(' +tempX+ ',' +tempY+ ')' });

  cartesian_graph.path = cartesian_graph.origin.append('path').attrs({ id: 'cartesian_graph_path' }); // Path is added first so that the numbers are clearly visible
  cartesian_graph.xAxis = cartesian_graph.origin.append('g');
  cartesian_graph.yAxis = cartesian_graph.origin.append('g');

  cartesian_graph.line = cartesian_graph.origin.append('line').attrs({ 'marker-end': 'url(#arrow)' }).styles({ 'stroke': 'white', 'stroke-width': 3, 'opacity': 0 });
  this.line_winding = this.origin.append('line')
    .attrs({ x1: 0, y1: 0*this.height, x2: 0, y2: -1*this.height })
    .styles({ 'stroke': 'orange', 'stroke-dasharray': '6,6', 'stroke-width': 3 });

  cartesian_graph.freq_ctlr = {};
  cartesian_graph.freq_ctlr.div = d3.select('#container').append('div').styles({ 'position': 'absolute', 'top': cartesian_graph.height+30, 'left': 80 });
  cartesian_graph.freq_ctlr.slider = cartesian_graph.freq_ctlr.div.append('input').attrs({ type: 'range', min: 0.2, max: 2, step: 0.01, value: waves[0].freq }).styles({ width: '10em' });
  cartesian_graph.freq_ctlr.text = cartesian_graph.freq_ctlr.div.append('text').attrs({ class: 'ml-2' }).styles({ 'font-size': '1.4em', 'color': '#bbb', 'vertical-align': 'text-bottom' }).html('Frequency of wave = ' + waves[0].freq + ' Hz');
  cartesian_graph.freq_ctlr.slider.on('input', function(){
    waves[0].freq = this.value;
    cartesian_graph.freq_ctlr.text.html('Frequency of wave = ' + waves[0].freq + ' Hz');
    update();
  })

  cartesian_graph.timeSpan_ctlr = {};
  cartesian_graph.timeSpan_ctlr.div = d3.select('#container').append('div').styles({ 'position': 'absolute', 'top': cartesian_graph.height+30, 'left': 550 });
  cartesian_graph.timeSpan_ctlr.slider = cartesian_graph.timeSpan_ctlr.div.append('input').attrs({ type: 'range', min: 1, max: 50, step: 1, value: timeSpan }).styles({ width: '10em' });
  cartesian_graph.timeSpan_ctlr.text = cartesian_graph.timeSpan_ctlr.div.append('text').attrs({ class: 'ml-2' }).styles({ 'font-size': '1.4em', 'color': '#bbb', 'vertical-align': 'text-bottom' }).html('Duration of signal = ' + timeSpan + ' s');
  cartesian_graph.timeSpan_ctlr.slider.on('input', function(){
    timeSpan = this.value;
    cartesian_graph.timeSpan_ctlr.text.html('Duration of signal = ' + timeSpan + ' s');
    update();
  })
}

// ************************************************************************************** //
// Update

cartesian_graph.updateGraph = function(){
  cartesian_graph.xScale = d3.scaleLinear().domain(d3.extent(time)).range([0, cartesian_graph.width]);
  // cartesian_graph.yScale = d3.scaleLinear().domain(d3.extent(mag)).range([0.5*cartesian_graph.height, -0.5*cartesian_graph.height]);
  cartesian_graph.yScale = d3.scaleLinear().domain(d3.extent(mag)).range([0*cartesian_graph.height, -1*cartesian_graph.height]);

  cartesian_graph.xAxis.call( d3.axisBottom(cartesian_graph.xScale).ticks(3) );
  cartesian_graph.yAxis.call( d3.axisLeft(cartesian_graph.yScale).ticks(2) );
  d3.select('.tick').select('text').styles({ 'display': 'none' });

  var temp_arr = time.map((d,i) => { return { x: cartesian_graph.xScale(time[i]), y: cartesian_graph.yScale(mag[i]) } });
  cartesian_graph.path.attrs({ d: lineGen(temp_arr) });

  d3.selectAll('.guides').remove();
  var winding_time = 1/wind_freq;
  for(var t = winding_time; t < timeSpan; t += winding_time){
    temp_X = cartesian_graph.xScale(t);
    cartesian_graph.origin.append('line')
      // .attrs({ class: 'guides', x1: temp_X, y1: -0.5*cartesian_graph.height, x2: temp_X, y2: 0.5*cartesian_graph.height })
      .attrs({ class: 'guides', x1: temp_X, y1: 0*cartesian_graph.height, x2: temp_X, y2: -1*cartesian_graph.height })
      .styles({ 'stroke': 'white', 'stroke-dasharray': '6,6', 'stroke-width': 2 })
  }
}

// ************************************************************************************** //
// Animate

var temp_X, temp_Y;
cartesian_graph.animate = function(){
  temp_X =  this.xScale(time[winding_animation.index]);
  temp_Y =  this.yScale(mag[winding_animation.index]);
  this.line.attrs({ x1: temp_X, y1: 0, x2: temp_X, y2: temp_Y });
  this.line_winding.attrs({ x1: temp_X, x2: temp_X });
}
