let fiocchi;
let neveFermata = []; // Array per memorizzare i fiocchi fermi

// Definiamo le altezze delle 4 linee dal basso verso l'alto
const LINE_HEIGHT_OFFSET = 30; // Distanza tra una linea e l'altra
let lineYPositions = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  calcolaPosizioniLinee(); // Calcola le posizioni delle linee in base all'altezza della finestra
  inizializzaFiocchi();
}

function inizializzaFiocchi() {
  fiocchi = [];
  neveFermata = []; // Resetta anche la neve ferma quando si riparte da zero

  const fioccoSingolo = "❅";

  for (let i = 0; i < 400; i++) {
    fiocchi[i] = {
      px: random(0, width),
      py: random(-100, 0),
      vel: random(0.5, 2),
      chr: fioccoSingolo,
      colore: color(255, 255, 255, 200),
      targetLine: -1 // -1 significa che non è ancora su una linea
    };
  }
}

// Funzione per calcolare le posizioni Y delle 4 linee
function calcolaPosizioniLinee() {
  lineYPositions = [];
  for (let i = 0; i < 4; i++) {
    // Partiamo dal fondo (height) e saliamo sottraendo un offset per ogni linea
    lineYPositions.push(height - (i * LINE_HEIGHT_OFFSET) - (LINE_HEIGHT_OFFSET / 2));
  }
}

function draw() {
  background(0);
  textAlign(CENTER, CENTER);
  textSize(20);

  // Disegna i fiocchi che cadono
  for (let i = 0; i < fiocchi.length; i++) {
    fiocchi[i].px = fiocchi[i].px + random(-0.8, 0.8); // Piccolissimo movimento orizzontale mentre cadono
    fiocchi[i].py = fiocchi[i].py + fiocchi[i].vel;

    if (fiocchi[i].py > height) {
      // Quando un fiocco arriva in fondo, lo aggiungiamo a neveFermata
      neveFermata.push({
        px: fiocchi[i].px,
        py: fiocchi[i].py, // Posizione temporanea prima di essere assegnato a una linea
        chr: fiocchi[i].chr,
        colore: fiocchi[i].colore
      });
      // Resetta il fiocco per farlo ricadere dall'alto
      fiocchi[i].py = random(-100, 0);
      fiocchi[i].px = random(0, width);
    }

    fill(fiocchi[i].colore);
    text(fiocchi[i].chr, fiocchi[i].px, fiocchi[i].py);
  }

  // Disegna i fiocchi fermi e li posiziona sulle linee
  for (let i = 0; i < neveFermata.length; i++) {
    let fioccoFermo = neveFermata[i];

    // Assegna il fiocco a una delle 4 linee se non è già stato fatto
    if (fioccoFermo.targetLine === -1) {
      let assignedLine = 0; // Assegna sempre alla linea più in basso
      
      if (assignedLine !== -1) {
        fioccoFermo.targetLine = assignedLine;
        // Posiziona il fiocco sulla linea, con un offset verticale per lo spessore
        fioccoFermo.py = lineYPositions[assignedLine] + random(-5, 5) - (neveFermata.filter(f => f.targetLine === assignedLine).length % (LINE_HEIGHT_OFFSET / 2)); 
        fioccoFermo.px = fioccoFermo.px + random(-10, 10); 
      }
    }

    fill(fioccoFermo.colore);
    text(fioccoFermo.chr, fioccoFermo.px, fioccoFermo.py);
  }

  // Interazione con il mouse per "disegnare" la neve in modo libero
  if (mouseIsPressed) {
    for (let i = 0; i < 3; i++) {
      neveFermata.push({
        px: mouseX + random(-5, 5),
        py: mouseY + random(-5, 5),
        chr: "❅",
        colore: color(255, 255, 255, 200),
        targetLine: -2
      });
    }
  }

  // Limita il numero di fiocchi fermi per evitare rallentamenti eccessivi
  if (neveFermata.length > 15000) {
    neveFermata.splice(0, neveFermata.length - 15000);
  }

  fill(173, 255, 47); // Colore giallo/verde lime (RGB)
  textSize(48); // Dimensione del testo per la titolazione
  text("DRAW YOUR SNOWMAN", width / 2, 50); // Posizione centrale in alto
  // --- Fine Titolazione ---

  // --- Istruzioni per il salvataggio ---
  fill(173, 255, 47); 
  textSize(16); // Dimensione più piccola per le istruzioni
  text("Press 'Ctrl + S' to save your drawing", width / 2, height - 20); // In basso al centro
  // --- Fine Istruzioni ---
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calcolaPosizioniLinee(); // Ricalcola le posizioni delle linee
  inizializzaFiocchi();
}

// Funzione per riavviare il gioco alla pressione della barra spaziatrice
function keyPressed() {
  if (key === ' ') { // Controlla se il tasto premuto è la barra spaziatrice
    inizializzaFiocchi(); // Richiama la funzione di inizializzazione
  }
  
  // Funzionalità per salvare l'immagine con Ctrl + S
  if (keyCode === 83 && (keyIsDown(CONTROL) || keyIsDown(COMMAND))) { // 83 è il codice per 'S'
    saveCanvas('mySnowmanDrawing', 'png'); // Salva il canvas come file PNG
    return false; // Previene il comportamento predefinito del browser (es. salvare la pagina)
  }
}