var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({

    el: $('#paper'), model: graph,
    width: window.innerWidth, height: window.innerHeight, gridSize: 5,
    snapLinks: true,
    defaultLink: new joint.shapes.logic.Wire,

    validateConnection: function(vs, ms, vt, mt, e, vl) {

        if (e === 'target') {

            // target requires an input port to connect
            if (!mt || !mt.getAttribute('class') || mt.getAttribute('class').indexOf('input') < 0) return false;

            // check whether the port is being already used
            var portUsed = _.find(this.model.getLinks(), function(link) {

                return (link.id !== vl.model.id &&
                        link.get('target').id === vt.model.id &&
                        link.get('target').port === mt.getAttribute('port')); 
            });

            return !portUsed;

        } else { // e === 'source'

            // source requires an output port to connect
            return ms && ms.getAttribute('class') && ms.getAttribute('class').indexOf('output') >= 0; 
        }
    }
});

// zoom the viewport by 25%
paper.scale(1.25, 1.25);

var addPosition = 20;

var gates = {
//    repeater: new joint.shapes.logic.Repeater({ position: { x: 1245, y: 0 }}),
    or: new joint.shapes.logic.Or({ position: { x: 15, y: 150 + addPosition }}),
    and: new joint.shapes.logic.And({ position: { x: 15, y: 200 + addPosition }}),
    not: new joint.shapes.logic.Not({ position: { x: 15, y: 250 + addPosition }}),
    nand: new joint.shapes.logic.Nand({ position: { x: 15, y: 300 + addPosition }}),
    nor: new joint.shapes.logic.Nor({ position: { x: 15, y: 350 + addPosition }}),
    xor: new joint.shapes.logic.Xor({ position: { x: 15, y: 400 + addPosition }}),
    xnor: new joint.shapes.logic.Xnor({ position: { x: 15, y: 450 + addPosition }}),
    input: new joint.shapes.logic.Input({ position: { x: 10, y: 80 + addPosition }}),
    output: new joint.shapes.logic.Output({ position: { x: 45, y: 120 + addPosition }})
}
graph.addCells(_.toArray(gates));

function toggleLive(model, signal) {
    // add 'live' class to the element if there is a positive signal
    V(paper.findViewByModel(model).el).toggleClass('live', signal > 0);
}

function broadcastSignal(gate, signal) {
    // broadcast signal to all output ports
    _.defer(_.invoke, graph.getConnectedLinks(gate, { outbound: true }), 'set', 'signal', signal);
}

function initializeSignal() {

    var signal = Math.random();
    // > 0 wire with a positive signal is alive
    // < 0 wire with a negative signal means, there is no signal 
    // 0 none of the above - reset value

    // cancel all signals stores in wires
    _.invoke(graph.getLinks(), 'set', 'signal', 0);

    // remove all 'live' classes
    $('.live').each(function() { V(this).removeClass('live') });

    _.each(graph.getElements(), function(element) {
        // broadcast a new signal from every input in the graph
        (element instanceof joint.shapes.logic.Input) && broadcastSignal(element, signal);
    });

    return signal;
}

// Every logic gate needs to know how to handle a situation, when a signal comes to their ports.
joint.shapes.logic.Gate.prototype.onSignal = function(signal, handler) { handler.call(this, signal) }
// The repeater delays a signal handling by 400ms
joint.shapes.logic.Repeater.prototype.onSignal = function(signal, handler) { _.delay(handler, 400, signal) }
// Output element just marks itself as alive.
joint.shapes.logic.Output.prototype.onSignal = function(signal) { toggleLive(this, signal); }

graph.on('change:source change:target', function(model, end) {

    var e = 'target' in model.changed ? 'target' : 'source';

    if ((model.previous(e).id && !model.get(e).id) || (!model.previous(e).id && model.get(e).id)) {
        // if source/target has been connected to a port or disconnected from a port reinitialize signals
        current = initializeSignal();
    }
});

graph.on('change:signal', function(wire, signal) {

    toggleLive(wire, signal);

    var magnitude = Math.abs(signal);

    // if a new signal has been generated stop transmitting the old one
    if (magnitude !== current) return;

    var gate = graph.getCell(wire.get('target').id);

    if (gate) {

        gate.onSignal(signal, function() {

            // get an array of signals on all input ports
            var inputs = _.chain(graph.getConnectedLinks(gate, { inbound: true }))
                .groupBy(function(wire) { return wire.get('target').port })
                .map(function(wires) { return Math.max.apply(this, _.invoke(wires, 'get', 'signal')) > 0 })
                .value();

            // calculate the output signal
            var output = magnitude * (gate.operation.apply(gate, inputs) ? 1 : -1);
            
            broadcastSignal(gate, output);
        });
   }
});

// initialize signal and keep its value
var current = initializeSignal();




paper.on('cell:pointerdblclick', function (evt) {
    var cell = graph.getCell(evt.model.id);
//    console.log(cell.attributes.attrs.text.text);
    
    switch(cell.attributes.type) {
        case 'logic.Input':
            if(cell.attributes.attrs.text.text == 'input') {
                var name = window.prompt('Please name your input: ');
                cell.attr({
                    text: { 
                        text: name
                    }
                });
                makeInput();
            }
            var rotate = window.prompt('Would you like to rotate? Please enter enter the amount of rotation in degrees! Click Cancel to reset the rotation!');
            cell.rotate(parseInt(rotate));
            break;
        case 'logic.Output':
            var name = window.prompt('Please name your input: ');
            cell.attr({
                text: { 
                    text: name
                }
            });
            makeOutput();
            break;
        case 'logic.Or':
            var rotate = window.prompt('Would you like to rotate? Please enter enter the amount of rotation in degrees! Click Cancel to reset the rotation!');
            cell.rotate(parseInt(rotate));
            break;
        case 'logic.And':
            var rotate = window.prompt('Would you like to rotate? Please enter enter the amount of rotation in degrees! Click Cancel to reset the rotation!');
            cell.rotate(parseInt(rotate));
            break;
        case 'logic.Not':
            var rotate = window.prompt('Would you like to rotate? Please enter enter the amount of rotation in degrees! Click Cancel to reset the rotation!');
            cell.rotate(parseInt(rotate));
            break;
        case 'logic.Nand':
            var rotate = window.prompt('Would you like to rotate? Please enter enter the amount of rotation in degrees! Click Cancel to reset the rotation!');
            cell.rotate(parseInt(rotate));
            break;
        case 'logic.Nor':
            var rotate = window.prompt('Would you like to rotate? Please enter enter the amount of rotation in degrees! Click Cancel to reset the rotation!');
            cell.rotate(parseInt(rotate));
            break;
        case 'logic.Xor':
            var rotate = window.prompt('Would you like to rotate? Please enter enter the amount of rotation in degrees! Click Cancel to reset the rotation!');
            cell.rotate(parseInt(rotate));
            break;
        case 'logic.Xnor':
            var rotate = window.prompt('Would you like to rotate? Please enter enter the amount of rotation in degrees! Click Cancel to reset the rotation!');
            cell.rotate(parseInt(rotate));
            break;
    }
});




paper.on('cell:pointerup', function (evt) {
    console.log(evt);
    var cell = graph.getCell(evt.model.id);
    console.log(cell.attributes.type);
    switch(cell.attributes.type) {
        case 'logic.Or':
            makeOrGate();
            break;
        case 'logic.And':
            makeAndGate();
            break;
        case 'logic.Not':
            makeNotGate();
            break;
        case 'logic.Nand':
            makeNandGate();
            break;
        case 'logic.Nor':
            makeNorGate();
            break;
        case 'logic.Xor':
            makeXorGate();
            break;
        case 'logic.Xnor':
            makeXnorGate();
            break;
    }
});




function makeOrGate(){
    var temp = new joint.shapes.logic.Or({ position: { x: 15, y: 150 + addPosition }});
    graph.addCell(temp);
}




function makeAndGate(){
    var temp = new joint.shapes.logic.And({ position: { x: 15, y: 200 + addPosition }});
    graph.addCell(temp);
}




function makeNotGate(){
    var temp = new joint.shapes.logic.Not({ position: { x: 15, y: 250 + addPosition }});
    graph.addCell(temp);
}




function makeNandGate(){
    var temp = new joint.shapes.logic.Nand({ position: { x: 15, y: 300 + addPosition }});
    graph.addCell(temp);
}




function makeNorGate(){
    var temp = new joint.shapes.logic.Nor({ position: { x: 15, y: 350 + addPosition }});
    graph.addCell(temp);
}




function makeXorGate(){
    var temp = new joint.shapes.logic.Xor({ position: { x: 15, y: 400 + addPosition }});
    graph.addCell(temp);
}




function makeXnorGate(){
    var temp = new joint.shapes.logic.Xnor({ position: { x: 15, y: 450 + addPosition }});
    graph.addCell(temp);
}




function makeInput(){
    var temp = new joint.shapes.logic.Input({ position: { x: 10, y: 80 + addPosition }});
    
    console.log(temp);
    graph.addCell(temp);
}




function makeOutput(){
    var temp = new joint.shapes.logic.Output({ position: { x: 45, y: 120 + addPosition }});
    graph.addCell(temp);
}