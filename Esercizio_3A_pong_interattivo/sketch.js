let ballPosX, ballPosY; // Posizione della pallina
let ballVelX, ballVelY; // Velocità della pallina
let ballSize;           // Dimensione della pallina

let paddleLeftY, paddleRightY; // Posizione Y delle stanghette
const PADDLE_WIDTH = 10;       // Larghezza fissa delle stanghette
const PADDLE_HEIGHT = 80;      // Altezza fissa delle stanghette

let scorePlayer;   
let scoreComputer; // Punteggio del computer (sinistra)

let bgColor; // Colore dello sfondo (0 = nero, 255 = bianco)
let fgColor; // Colore degli elementi in primo piano (stanghette e testo)

// Colori dell'arcobaleno per la pallina
const rainbowColors = [
  [255, 0, 0],    // Rosso
  [255, 127, 0],  // Arancione
  [255, 255, 0],  // Giallo
  [0, 255, 0],    // Verde
  [0, 0, 255],    // Blu
  [75, 0, 130],   // Indaco
  [143, 0, 255]   // Viola
];
let ballColorIndex; // Indice del colore attuale della pallina

let ballShape; // Forma attuale della pallina

/**
 * Funzione di setup di p5.js.
 * Viene eseguita una sola volta all'avvio del programma.
 */
function setup() {
    // Crea un canvas di 960x540 pixel
    createCanvas(960, 540);
    resetGame(); // Inizializza tutte le variabili di gioco
}

/**
 * Funzione draw di p5.js.
 * Viene eseguita ripetutamente a ogni frame.
 */
function draw() {
    background(bgColor); // Disegna lo sfondo con il colore corrente

    updateBall(); // Aggiorna la posizione e gestisce i rimbalzi della pallina
    drawBall();   // Disegna la pallina

    drawPaddles();    // Disegna le stanghette
    moveRightPaddle(); // Muove la stanghetta del giocatore
    moveLeftPaddleAI(); // Muove la stanghetta del computer

    displayScore(); // Mostra i punteggi
}

/**
 * Resetta lo stato completo del gioco.
 * Chiamato all'inizio e quando si preme la barra spaziatrice.
 */
function resetGame() {
    // Posiziona pallina al centro e imposta velocità iniziale casuale
    ballPosX = width / 2;
    ballPosY = height / 2;
    ballVelX = (random() > 0.5 ? 1 : -1) * random(5, 8); // Velocità orizzontale
    ballVelY = (random() > 0.5 ? 1 : -1) * random(4, 7); // Velocità verticale

    ballSize = random(30, 80); // Dimensione casuale per la pallina
    setRandomBallProperties(); // Imposta colore e forma iniziale della pallina

    scorePlayer = 0;   // Resetta punteggio giocatore
    scoreComputer = 0; // Resetta punteggio computer

    bgColor = 0;   // Sfondo nero all'inizio
    fgColor = 255; // Elementi in primo piano bianchi all'inizio
    
    // Posiziona le stanghette al centro
    paddleLeftY = height / 2 - PADDLE_HEIGHT / 2;
    paddleRightY = height / 2 - PADDLE_HEIGHT / 2;
}

/**
 * Aggiorna la posizione della pallina e gestisce le collisioni.
 */
function updateBall() {
    ballPosX += ballVelX;
    ballPosY += ballVelY;

    // Rimbalzo sui bordi superiori e inferiori
    if (ballPosY - ballSize / 2 <= 0 || ballPosY + ballSize / 2 >= height) {
        ballVelY *= -1; // Inverte direzione verticale
        // Riposiziona la pallina per non farla uscire dallo schermo
        ballPosY = constrain(ballPosY, ballSize / 2, height - ballSize / 2);
    }

    // Collisione con la stanghetta destra (giocatore)
    if (ballPosX + ballSize / 2 >= width - PADDLE_WIDTH &&
        ballPosY + ballSize / 2 >= paddleRightY &&
        ballPosY - ballSize / 2 <= paddleRightY + PADDLE_HEIGHT) {
        ballVelX *= -1; // Inverte direzione orizzontale
        ballPosX = width - PADDLE_WIDTH - ballSize / 2; // Riposiziona
        changeBallProperties(); // Cambia colore e forma della pallina
    }

    // Collisione con la stanghetta sinistra (computer)
    if (ballPosX - ballSize / 2 <= PADDLE_WIDTH &&
        ballPosY + ballSize / 2 >= paddleLeftY &&
        ballPosY - ballSize / 2 <= paddleLeftY + PADDLE_HEIGHT) {
        ballVelX *= -1; // Inverte direzione orizzontale
        ballPosX = PADDLE_WIDTH + ballSize / 2; // Riposiziona
        changeBallProperties(); // Cambia colore e forma della pallina
    }

    // Punto del giocatore (la pallina esce a sinistra)
    if (ballPosX - ballSize / 2 < 0) {
        scorePlayer++;
        bgColor = 255; // Sfondo bianco
        fgColor = 0;   // Elementi in primo piano neri
        resetBall(); // Resetta la pallina per il prossimo punto
    }

    // Punto del computer (la pallina esce a destra)
    if (ballPosX + ballSize / 2 > width) {
        scoreComputer++;
        bgColor = 0;   // Sfondo nero
        fgColor = 255; // Elementi in primo piano bianchi
        resetBall(); // Resetta la pallina per il prossimo punto
    }
}

/**
 * Disegna la pallina con il suo colore e forma attuali.
 */
function drawBall() {
    noStroke(); // Nessun bordo per la pallina
    let currentColor = rainbowColors[ballColorIndex];
    fill(currentColor[0], currentColor[1], currentColor[2]); // Colore della pallina

    push(); // Salva lo stato di trasformazione attuale
    translate(ballPosX, ballPosY); // Sposta l'origine al centro della pallina

    // Disegna la forma della pallina in base a 'ballShape'
    switch (ballShape) {
        case 0: // Cerchio
            ellipse(0, 0, ballSize);
            break;
        case 1: // Quadrato
            rectMode(CENTER);
            rect(0, 0, ballSize, ballSize);
            break;
        case 2: // Triangolo equilatero
            let h = ballSize * sqrt(3) / 2;
            triangle(0, -h / 2, -ballSize / 2, h / 2, ballSize / 2, h / 2);
            break;
        case 3: // Stella
            drawStar(0, 0, ballSize / 4, ballSize / 2, 5);
            break;
        case 4: // Esagono
            polygon(0, 0, ballSize / 2, 6);
            break;
        case 5: // Linee incrociate (forma astratta)
            stroke(currentColor[0], currentColor[1], currentColor[2]);
            strokeWeight(3);
            line(-ballSize / 2, -ballSize / 2, ballSize / 2, ballSize / 2);
            line(-ballSize / 2, ballSize / 2, ballSize / 2, -ballSize / 2);
            noStroke(); // Disabilita il bordo dopo aver disegnato le linee
            break;
        case 6: // Arco (forma astratta)
            noFill(); // Non riempire l'arco
            stroke(currentColor[0], currentColor[1], currentColor[2]);
            strokeWeight(ballSize / 10);
            arc(0, 0, ballSize, ballSize, PI, TWO_PI);
            noStroke(); // Disabilita il bordo
            fill(currentColor[0], currentColor[1], currentColor[2]); // Riabilita il riempimento per future forme
            break;
    }
    pop(); // Ripristina lo stato di trasformazione precedente
}

/**
 * Disegna le due stanghette (paddle).
 */
function drawPaddles() {
    fill(fgColor); // Colore delle stanghette (bianco o nero a seconda dello sfondo)
    noStroke();    // Nessun bordo per le stanghette
    rect(0, paddleLeftY, PADDLE_WIDTH, PADDLE_HEIGHT); // Stanghetta sinistra
    rect(width - PADDLE_WIDTH, paddleRightY, PADDLE_WIDTH, PADDLE_HEIGHT); // Stanghetta destra
}

/**
 * Muove la stanghetta di destra (del giocatore) seguendo il mouse.
 */
function moveRightPaddle() {
    paddleRightY = mouseY - PADDLE_HEIGHT / 2; // Centra la stanghetta sul cursore Y
    // Limita il movimento della stanghetta all'interno dello schermo
    paddleRightY = constrain(paddleRightY, 0, height - PADDLE_HEIGHT);
}

/**
 * Implementa una semplice IA per muovere la stanghetta sinistra (computer).
 */
function moveLeftPaddleAI() {
    // L'IA cerca di posizionare il centro della sua stanghetta all'altezza della pallina
    let targetY = ballPosY - PADDLE_HEIGHT / 2;
    // Si muove gradualmente verso il target (0.1 è la velocità di reazione)
    paddleLeftY += (targetY - paddleLeftY) * 0.1;

    // Limita il movimento della stanghetta all'interno dello schermo
    paddleLeftY = constrain(paddleLeftY, 0, height - PADDLE_HEIGHT);
}

/**
 * Mostra i punteggi dei giocatori.
 */
function displayScore() {
    fill(fgColor); // Colore del testo (bianco o nero a seconda dello sfondo)
    textSize(80); // Dimensione del testo grande
    textAlign(CENTER, TOP); // Allinea il testo al centro orizzontalmente e in alto verticalmente
    text(scoreComputer, width / 4, 20); // Punteggio computer (sinistra)
    text(scorePlayer, width * 3 / 4, 20); // Punteggio giocatore (destra)
}

// --- Funzioni Ausiliarie per la Pallina ---

/**
 * Resetta la posizione e le proprietà della pallina dopo un punto.
 */
function resetBall() {
    ballPosX = width / 2;
    ballPosY = height / 2;
    // Nuova direzione e velocità casuale dopo un punto
    ballVelX = (random() > 0.5 ? 1 : -1) * random(5, 8);
    ballVelY = (random() > 0.5 ? 1 : -1) * random(4, 7);
    ballSize = random(30, 80); // Nuova dimensione casuale
    setRandomBallProperties(); // Nuova forma casuale
}

/**
 * Imposta le proprietà iniziali (colore e forma) della pallina.
 */
function setRandomBallProperties() {
    ballColorIndex = 0; // Inizia sempre dal rosso
    ballShape = floor(random(7)); // Sceglie una delle 7 forme disponibili
}

/**
 * Cambia le proprietà della pallina (colore e forma) quando tocca stanghette o bordi.
 */
function changeBallProperties() {
    // Passa al colore successivo dell'arcobaleno
    ballColorIndex = (ballColorIndex + 1) % rainbowColors.length;

    // Cambia la forma in modo casuale, assicurandosi che sia diversa dalla precedente
    let newShape = floor(random(7));
    while (newShape === ballShape) {
        newShape = floor(random(7));
    }
    ballShape = newShape;
}

// --- Funzioni per Disegnare Forme Complesse ---

/**
 * Disegna un poligono regolare.
 * @param {number} x Coordinata X del centro.
 * @param {number} y Coordinata Y del centro.
 * @param {number} radius Raggio del poligono.
 * @param {number} npoints Numero di lati/vertici.
 */
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

/**
 * Disegna una stella.
 * @param {number} x Coordinata X del centro.
 * @param {number} y Coordinata Y del centro.
 * @param {number} radius1 Raggio interno della stella.
 * @param {number} radius2 Raggio esterno della stella.
 * @param {number} npoints Numero di punte.
 */
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function keyPressed() {
  if (key === ' ' || keyCode === 32) { 
    resetGame(); 
     bgColor = (bgColor === 0) ? 255 : 0; 
    fgColor = (fgColor === 0) ? 255 : 0; 
  }
}