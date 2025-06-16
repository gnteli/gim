let pioggiaAttiva = true;
let gocce = [];
let numeroGocce = 1000;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    for (let i = 0; i < numeroGocce; i++) {
        gocce[i] = creaNuovaGoccia();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    // Mappa la posizione Y del mouse (mouseY) su un valore di grigio da 0 (nero) a 255 (bianco)
    let coloreSfondo = map(mouseY, 0, height, 0, 255);
    background(coloreSfondo); // Applica il colore dello sfondo calcolato

    rotateX(-mouseY * 0.01);
    rotateY(-mouseX * 0.01);

    let dimensione = 1000;

    for (let i = 0; i < numeroGocce; i++) {
        if (pioggiaAttiva) {
            gocce[i].gy += gocce[i].velocita;
            if (gocce[i].gy > dimensione) {
                gocce[i] = creaNuovaGoccia();
            }
        }

        strokeWeight(gocce[i].peso);
        stroke(gocce[i].coloreBlu, gocce[i].opacita);
        line(gocce[i].gx, gocce[i].gy, gocce[i].gz, gocce[i].gx, gocce[i].gy + gocce[i].gl, gocce[i].gz);
    }
}

function keyPressed() {
    if (key === ' ') {
        pioggiaAttiva = !pioggiaAttiva;
    }
}

function creaNuovaGoccia() {
    let dimensione = 1000;
    let gl = random(10, 150);
    let gx = random(-dimensione, dimensione);
    let gy = random(-dimensione, 0);
    let gz = random(-dimensione, dimensione);
    let peso = random(1, 2);
    let opacita = random(100, 255);
    let coloreBlu = color(173, 216, 230);
    let velocita = random(5, 15);

    return { gx, gy, gz, gl, peso, opacita, coloreBlu, velocita };
}