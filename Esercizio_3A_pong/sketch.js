let posX;
let velX;

let posY, velY;

let ballColorIndex; // Indice per il colore dell'arcobaleno
let ballShape;      // Indice per la forma della pallina
let ballSize;       // Dimensione della pallina

// Colori dell'arcobaleno (RGB)
const rainbowColors = [
  [255, 0, 0],    // Rosso
  [255, 127, 0],  // Arancione
  [255, 255, 0],  // Giallo
  [0, 255, 0],    // Verde
  [0, 0, 255],    // Blu
  [75, 0, 130],   // Indaco
  [143, 0, 255]   // Viola
];

function setup() {
    // Crea un canvas che occupa l'intera larghezza e altezza della finestra
    createCanvas(windowWidth, windowHeight);

    posX = width / 2; // Inizia al centro del nuovo canvas
    velX = 8;

    posY = height / 2; // Inizia al centro del nuovo canvas
    velY = 7;

    background(0); // Sfondo nero

    // Inizializza colore, dimensione e forma casuali per la pallina
    setRandomBallProperties();
}

function draw() {
    background(0); // Ridisegna lo sfondo nero ad ogni frame

    // Aggiorna posizione
    posX = posX + velX;
    posY = posY + velY;

    // --- Gestione dei limiti dello sfondo per la pallina ---
    // Questi calcoli assicurano che la pallina non esca dai bordi,
    // tenendo conto della sua dimensione.
    if (posX + ballSize / 2 >= width) {
        velX = -velX;
        posX = width - ballSize / 2; // Riposiziona la pallina al bordo
        changeBallProperties();
    } else if (posX - ballSize / 2 <= 0) {
        velX = -velX;
        posX = ballSize / 2; // Riposiziona la pallina al bordo
        changeBallProperties();
    }

    if (posY + ballSize / 2 >= height) {
        velY = -velY;
        posY = height - ballSize / 2; // Riposiziona la pallina al bordo
        changeBallProperties();
    } else if (posY - ballSize / 2 <= 0) {
        velY = -velY;
        posY = ballSize / 2; // Riposiziona la pallina al bordo
        changeBallProperties();
    }
    // --- Fine gestione dei limiti ---

    noStroke();
    let currentColor = rainbowColors[ballColorIndex];
    fill(currentColor[0], currentColor[1], currentColor[2]);

    // Disegna la pallina con la forma e la dimensione casuale
    push(); // Salva lo stato attuale della trasformazione
    translate(posX, posY); // Sposta l'origine al centro della pallina

    switch (ballShape) {
        case 0: // Cerchio
            ellipse(0, 0, ballSize);
            break;
        case 1: // Quadrato
            rectMode(CENTER);
            rect(0, 0, ballSize, ballSize);
            break;
        case 2: // Triangolo
            let h = ballSize * sqrt(3) / 2; // Altezza del triangolo equilatero
            triangle(0, -h / 2, -ballSize / 2, h / 2, ballSize / 2, h / 2);
            break;
        case 3: // Stella (esempio semplice, potresti renderla più complessa)
            let radius1 = ballSize / 2;
            let radius2 = ballSize / 4;
            let npoints = 5; // Numero di punte
            let angle = TWO_PI / npoints;
            beginShape();
            for (let a = 0; a < TWO_PI; a += angle) {
                let sx = cos(a) * radius1;
                let sy = sin(a) * radius1;
                vertex(sx, sy);
                sx = cos(a + angle / 2) * radius2;
                sy = sin(a + angle / 2) * radius2;
                vertex(sx, sy);
            }
            endShape(CLOSE);
            break;
        case 4: // Esagono
            polygon(0, 0, ballSize / 2, 6);
            break;
        case 5: // Linee incrociate (forma astratta)
            stroke(currentColor[0], currentColor[1], currentColor[2]);
            strokeWeight(3);
            line(-ballSize / 2, -ballSize / 2, ballSize / 2, ballSize / 2);
            line(-ballSize / 2, ballSize / 2, ballSize / 2, -ballSize / 2);
            noStroke(); // Resetta lo stroke per le forme successive
            break;
        case 6: // Arco (forma astratta)
            noFill(); // Non riempire l'arco
            stroke(currentColor[0], currentColor[1], currentColor[2]);
            strokeWeight(ballSize / 10);
            arc(0, 0, ballSize, ballSize, PI, TWO_PI); // Un semicerchio
            noStroke();
            fill(currentColor[0], currentColor[1], currentColor[2]); // Riabilita il riempimento
            break;
    }
    pop(); // Ripristina lo stato precedente della trasformazione
}

// Funzione helper per disegnare un poligono regolare (usata per l'esagono)
function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}


// Inizializza le proprietà della pallina all'avvio
function setRandomBallProperties() {
    ballColorIndex = 0; // Inizia dal rosso
    ballShape = floor(random(7)); // 7 forme diverse (0-6)
    ballSize = random(30, 80); // Dimensione casuale
}

// Cambia le proprietà della pallina quando tocca i bordi
function changeBallProperties() {
    // Passa al colore successivo dell'arcobaleno
    ballColorIndex = (ballColorIndex + 1) % rainbowColors.length;

    // Cambia la forma in modo casuale
    let newShape = floor(random(7));
    // Assicurati che la nuova forma sia diversa dalla precedente per un cambio visibile
    while (newShape === ballShape) {
        newShape = floor(random(7));
    }
    ballShape = newShape;

    // Cambia la dimensione in modo casuale
    ballSize = random(30, 80);
}
