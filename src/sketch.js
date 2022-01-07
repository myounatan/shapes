// seed
Math.seedrandom('0x4932d8g9e646f68AC8c248420045cb7b5e342342342378654');


// variables
let noise_context, image_clone;

let layer_context;

var canvas_w = 768;
var canvas_h = 768;

var middle_x = canvas_w / 2;
var middle_y = canvas_h / 2;

var master_rotation = 0;
var master_layer_offset = random_range(-3, 3);

var mouse_move = 0;

// monochromatic, random, bw
var color_style = [['mono', 10], ['random', 5], ['bw', 1]]

var circle_equal = Math.random() < 0.333333;
var circle_w = random_range(250, 450);
var circle_h = circle_equal ? circle_w : random_range(250, 450);
var circle_rotation = /*circle_equal ? 0 : */random_range(0, 360);

var background_shape_rotation = random_range(0, 360);

var mini_rotation = random_range(1, 2) % 2 == 0 ? random_range(-120, -60) : random_range(60, 120)

var inner_circle_stroke_weights = [['5', 1000], ['10', 500], ['15', 100], ['30', 10], ['60', 1]];
var inner_circle_stroked = Math.random() < 0.5 ? true : false;
var inner_circle_stroke;
var inner_circle_sizes = [['15', 1000], ['20', 500], ['25', 100], ['30', 10], ['60', 1]];
var inner_circle_size;

var traingle_equal = Math.random() < 0.5;
var triangle_size = random_range(100, 150);
var triangle_rotation = random_range(0, 360)
var traingle_scale = random_range(-10, 10)

var modify_x = Math.random() < 0.5;

var triangle_points = [0, -2, -2, 2, 2, 2];
for (var i = 0; i < 6; i++) {
    triangle_points[i] = triangle_points[i] + (traingle_equal ? 0 : random_range(-1, 1) / 2);
}



const noise_data = Uint32Array.from({ length: (canvas_w*2) * (canvas_h*2) }, () => Math.random() > 0.5 ? 0xFF000000 : 0);


var mini_circle_color;
var mini_circle_rows = random_range(1, 6);
var mini_circle_cols = random_range(1, 8);
var mini_circle_padding_x = random_range(9, 9) * 5;
var mini_circle_layers = 10;
var mini_circle_speed = 1
var mini_circle_offset_rotation = degrees_to_radians(random_range(1, 360));
var mini_circle_stroke_chance = random_range(0, 10) / 10
var mini_circle_stroke_chances = [];
for (var row = 0; row < mini_circle_rows; row++) {
    mini_circle_stroke_chances[row] = [];
    for (var col = 0; col < mini_circle_cols; col++) {
        mini_circle_stroke_chances[row][col] = Math.random() < mini_circle_stroke_chance;
    }
}

var mini_line_count = random_range(1, 4)
var mini_line_lengths = [];
var mini_line_speeds = [];
for (var i = 0; i < mini_line_count; i++) {
    mini_line_speeds[i] = 1 + (random_range(-5, 10) / 10)
    mini_line_lengths[i] = random_range(10, 60)
}

var big_line_count = random_range(1, 3)
var big_line_lengths = [];
var big_line_speeds = [];
var big_line_size_weights = [['20', 1000], ['40', 100], ['60', 10]];
var big_line_sizes = [];
for (var i = 0; i < big_line_count; i++) {
    big_line_speeds[i] = 1 + (random_range(-5, 10) / 10)
    big_line_lengths[i] = random_range(60, 120)
    big_line_sizes[i] = parseInt(pick_weighted_random(big_line_size_weights));
}

var capturer;

// function helpers
function pick_weighted_random(data) {
    let total = 0;
    for (let i = 0; i < data.length; ++i) {
        total += data[i][1];
    }

    const threshold = Math.random() * total;

    total = 0;
    for (let i = 0; i < data.length - 1; ++i) {
        // Add the weight to our running total.
        total += data[i][1];

        // If this value falls within the threshold, we're done!
        if (total >= threshold) {
            return data[i][0];
        }
    }

    return data[data.length - 1][0];
}

function random_hex() {
    return Math.floor(Math.random() * 16777215);
}

function random_range(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

function triangle_area(x1, y1, x2, y2, x3, y3) {
    var l1 = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2),
        l2 = Math.sqrt((x2 - x3) ** 2 + (y2 - y3) ** 2),
        l3 = Math.sqrt((x3 - x1) ** 2 + (y3 - y1) ** 2);

    var p = (l1 + l2 + l3) / 2;
    var area = Math.sqrt(p * (p - l1) * (p - l2) * (p - l3));

    return area
}

function random_color() {
    return [random_range(0, 255), random_range(0, 255), random_range(0, 255)];
}
function random_bw() {
    var chosen_color = random_range(0, 255);
    return [chosen_color, chosen_color, chosen_color];
}

function mult_color(r, g, b, m) {
    var mc = a => Math.ceil(((r / 255) * m) * 255)

    return mc(r), mc(g), mc(b)
}

function rgba_string(r, g, b, a = 0) {
    return "rgba(" + r.toString() + "," + g.toString() + "," + b.toString() + "," + a.toString + ")";
}

function random_rgba() {
    return rgba_string(random_range(0, 255), random_range(0, 255), random_range(0, 255), 0)
}

function distance(v1, v2) {
    var i,
        d = 0;

    for (i = 0; i < v1.length; i++) {
        d += (v1[i] - v2[i]) * (v1[i] - v2[i]);
    }
    return Math.sqrt(d);
};

function color_noise(a_color) {
    var ctx = noise_context.drawingContext

    ctx.globalCompositeOperation = "hard-light";
    ctx.fillStyle = a_color;
    ctx.fillRect(0, 0, canvas_w, canvas_h);
}


var layers = [];
function add_layer(x, y) {
    var layer = createGraphics(x, y);

    layers[layers.length] = layer

    return layer;
}

var color_functions = [];
color_functions['mono'] = function () {
    var chosen_color = random_color().map(color => Math.min(Math.max(color, 10), 225));

    circle_color = color(chosen_color[0] * 1.1, chosen_color[1] * 1.1, chosen_color[2] * 1.1);
    triangle_color = color(chosen_color[0] * 1, chosen_color[1] * 1, chosen_color[2] * 1);
    background_color = color(chosen_color[0] * 0.7, chosen_color[1] * 0.7, chosen_color[2] * 0.7);
}
color_functions['random'] = function () {
    var og_circle_color = random_color();
    circle_color = color(...og_circle_color);

    var og_triangle_color = random_color();
    triangle_color = color(...og_triangle_color);

    while (distance(og_circle_color, og_triangle_color) < 20) {
        var og_circle_color = random_color();
        circle_color = color(...og_circle_color);

        var og_triangle_color = random_color();
        triangle_color = color(...og_triangle_color);
    }

    background_color = color(...random_color());
}
color_functions['bw'] = function () {
    var og_circle_color = random_bw().map(color => Math.min(Math.max(color, 10), 225))
    circle_color = color(...og_circle_color);

    var og_triangle_color = random_bw().map(color => Math.min(Math.max(color, 10), 225))
    triangle_color = color(...og_triangle_color);

    console.log(distance(og_circle_color, og_triangle_color))

    while (distance(og_circle_color, og_triangle_color) < 20) {
        var og_circle_color = random_bw().map(color => Math.min(Math.max(color, 10), 225))
        circle_color = color(...og_circle_color);

        var og_triangle_color = random_bw().map(color => Math.min(Math.max(color, 10), 225))
        triangle_color = color(...og_triangle_color);
    }

    background_color = color(...random_bw());
}

var background_shape;
var background_shapes = [['triangle', 100], ['square', 100], ['circle', 100]];
var background_shape_functions = []
background_shape_functions['triangle'] = function () {
    layer_context.triangle(
        triangle_points[0],
        triangle_points[1],
        triangle_points[2],
        triangle_points[3],
        triangle_points[4],
        triangle_points[5]
    );
}
background_shape_functions['square'] = function () {

    layer_context.rectMode(CENTER);

    layer_context.rect(0, 0, 3, 3)
}
background_shape_functions['circle'] = function () {
    layer_context.ellipse(0, 0, 3, 3);
}

function calc_ellipse(s, cx, cy, rx, ry, th) {
    rx /= 2;
    ry /= 2;

    var x, y;

    var x = (rx * Math.cos(s) * Math.cos(th)) - (ry * Math.sin(s) * Math.sin(th)) + cx
    var y = (rx * Math.cos(s) * Math.sin(th)) - (ry * Math.sin(s) * Math.cos(th)) + cy

    return [x, y];
}

// classes
class MiniCircle {
    constructor(w, h, rotation_offset = 0, layer = 0, speed = 1) {
        this.w = w;
        this.h = h;

        this.rotation_offset = rotation_offset;
        this.layer = layer;

        this.speed = speed
    }

    render = function (ctx, total_layers) {
        var layer = this.layer + master_layer_offset;

        var frame_coord = calc_ellipse(
            (mini_circle_offset_rotation + degrees_to_radians((master_rotation + this.rotation_offset)) * this.speed),
            0,
            0,
            circle_w * (1 - (layer / total_layers)),
            circle_h * (1 - (layer / total_layers)),
            degrees_to_radians(mini_rotation)
        )

        ellipse(frame_coord[0], frame_coord[1], this.w, this.h)
    }
}

class Line {
    constructor(length, size, rotation_offset = 0, layer = 0, speed = 1) {
        this.length = length;
        this.size = size;

        this.rotation_offset = rotation_offset;
        this.layer = layer;

        this.speed = speed
    }

    render = function (ctx, total_layers) {
        var layer = this.layer + master_layer_offset;

        var start_rad = (mini_circle_offset_rotation + degrees_to_radians((master_rotation + this.rotation_offset)) * this.speed);

        var frame_coord = calc_ellipse(
            start_rad,
            0,
            0,
            circle_w * (1 - (layer / total_layers)),
            circle_h * (1 - (layer / total_layers)),
            degrees_to_radians(mini_rotation)
        )
        var last_coord = frame_coord

        noFill();
        stroke(mini_circle_color);
        strokeWeight(this.size);

        for (var i = 0; i < this.length; i++) {
            frame_coord = calc_ellipse(
                start_rad + (degrees_to_radians(i) * this.speed),
                0,
                0,
                circle_w * (1 - (layer / total_layers)),
                circle_h * (1 - (layer / total_layers)),
                degrees_to_radians(mini_rotation)
            )


            //ellipse(frame_coord[0], frame_coord[1], this.size, this.size)
            line(last_coord[0], last_coord[1], frame_coord[0], frame_coord[1])
            last_coord = frame_coord
        }

    }
}


// p5.js
function setup() {
    createCanvas(canvas_w, canvas_h)

    noise_context = add_layer(canvas_w, canvas_h);

    layer_context = add_layer(canvas_w, canvas_h);

    // init color

    var chosen_color_style = pick_weighted_random(color_style);

    color_functions[chosen_color_style]();

    // init inner circle
    inner_circle_size = pick_weighted_random(inner_circle_sizes);

    if (inner_circle_stroked)
        inner_circle_stroke = pick_weighted_random(inner_circle_stroke_weights);

    // mini circle color
    var avg_color = circle_color._array[0] + circle_color._array[1] + circle_color._array[2];
    avg_color /= 3;
    avg_color *= 255;
    console.log(circle_color._array[0] * 255, circle_color._array[1] * 255, circle_color._array[2] * 255);
    console.log(avg_color);

    if (avg_color > 190) {
        mini_circle_color = 'black';
    } else if (avg_color > 100 & Math.random() < 0.5) {
        mini_circle_color = 'black';
    } else {
        mini_circle_color = 'white';
    }

    background_shape = pick_weighted_random(background_shapes);
}

var once = 0;
function draw() {
    clear()
    noStroke();

    var ctx = noise_context.drawingContext

    const img = new ImageData(new Uint8ClampedArray(noise_data.buffer), canvas_w * 2, canvas_h * 2);

    ctx.putImageData(img, 0, 0);

    // first pass to convert our noise to black and transparent
    ctx.globalCompositeOperation = "color";
    ctx.fillRect(0, 0, canvas_w, canvas_h);

    ctx.globalCompositeOperation = "hard-light";
    ctx.fillStyle = ctx.createLinearGradient(0, 0, 0, canvas_h);
    ctx.fillStyle.addColorStop(0.01, 'black');
    ctx.fillStyle.addColorStop(0.99, 'white');
    ctx.fillRect(0, 0, canvas_w, canvas_h);

    //noise_context.drawingContext.rotate(Math.PI)
    color_noise(background_color);
    image(noise_context.get(), 0, 0)
    //noise_context.drawingContext.rotate(Math.PI)

    ctx.fillStyle = ctx.createLinearGradient(0, 0, 0, canvas_h);
    ctx.fillStyle.addColorStop(0.01, 'white');
    ctx.fillStyle.addColorStop(0.99, 'black');
    ctx.fillRect(0, 0, canvas_w, canvas_h);

    // generate triangle
    color_noise(triangle_color);

    layer_context.push();
    layer_context.translate(middle_x, middle_y);
    var scale = triangle_size + (Math.sin(mouse_move * 0.1) * traingle_scale);
    layer_context.scale(scale);
    //layer_context.rotate(degrees_to_radians(triangle_rotation--));
    layer_context.rotate(degrees_to_radians(background_shape_rotation))

    // pick shape for background
    background_shape_functions[background_shape]();

    layer_context.pop();

    (image_clone = noise_context.get()).mask(layer_context.get());
    image(image_clone, 0, 0)
    layer_context.clear()

    // generate big circle
    color_noise(circle_color);

    layer_context.push();
    layer_context.translate(middle_x, middle_y);
    layer_context.rotate(degrees_to_radians(circle_rotation));
    layer_context.ellipse(0, 0, circle_w, circle_h);
    layer_context.fill('rgba(0, 0, 0, 1)');
    layer_context.pop();

    // mask noise with big circle
    (image_clone = noise_context.get()).mask(layer_context.get());
    image(image_clone, 0, 0)
    layer_context.clear()

    // generate small circle
    if (inner_circle_stroked) {
        noFill();
        stroke(mini_circle_color);
        strokeWeight(inner_circle_stroke);
    }
    else {
        fill(mini_circle_color);
    }
    ellipse(middle_x, middle_y, inner_circle_size, inner_circle_size)

    // mini circles
    var mini_circles = [];
    translate(
        middle_x,
        middle_y)

    for (var row = 0; row < mini_circle_rows; row++) {
        mini_circles[row] = [];

        for (var col = 0; col < mini_circle_cols; col++) {

            mini_circles[row][col] =
                new MiniCircle(
                    10,
                    10,
                    col * mini_circle_padding_x,
                    row,
                    mini_circle_speed
                );
        }
    }

    for (var row = 0; row < mini_circle_rows; row++) {
        for (var col = 0; col < mini_circle_cols; col++) {
            var shape = mini_circles[row][col];

            if (mini_circle_stroke_chances[row][col]) {
                noFill();
                stroke(mini_circle_color);
                strokeWeight(3);
            } else {
                noStroke();
                fill(mini_circle_color);
            }
            shape.render(drawingContext, mini_circle_layers);
        }
    }

    var lines = [];

    // mini lines
    for (var i = 0; i < mini_line_count; i++) {
        lines.push(new Line(mini_line_lengths[i], 4, 0, 1 + (i * 2), mini_line_speeds[i]));
    }

    // big lines
    var layer = -3
    var last_size = 0;
    for (var i = 0; i < big_line_count; i++) {

        lines.push(new Line(big_line_lengths[i], big_line_sizes[i], 0, layer, big_line_speeds[i]));


        layer = -6 - (i * (big_line_sizes[i] > 20 ? (big_line_sizes[i] > 50 ? 5 : 3) : 3))
    }

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        line.render(drawingContext, mini_circle_layers);
    }

    master_rotation = master_rotation + 1;
    //master_layer_offset = Math.sin(mouse_move * 0.1) * 1.5;

    if (capturer) capturer.capture(renderer.domElement);


    // capture once
    /*if (once == 0) {
        once++;

        capturer = new CCapture({
            format: "git",
            verbose: true,
            framerate: 60,
            //motionBlurFrames: 16,
            //quality: 90,
            //workersPath: '/',
            onProgress: function (p) { progress.style.width = (p * 100) + '%' }
        });
    
        capturer.start();
    } else {
        return
    }*/
}

function mouseMoved() {
    //mouse_move++;
}