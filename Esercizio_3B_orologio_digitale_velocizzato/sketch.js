let coloriTransizione;
let coloreNotte;

let stelle = [];
let maxStelle = 100;
let stelleVisibili = 0;
let ultimoMinuto = -1;
let stelleBrillanti = [];

let pollini = [];
let maxPollini = 100;
let ultimoSecondoSimulato = -1;

let orarioSimulato = 0; // Inizio simulazione a mezzanotte

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  colorMode(RGB);

  coloriTransizione = [
    color(39, 18, 104),
    color(124, 20, 142),
    color(209, 24, 134),
    color(226, 140, 14),
    color(39, 170, 225)
  ];

  coloreNotte = color(15, 20, 40);

  for (let i = 0; i < maxStelle; i++) {
    stelle.push({
      x: random(width),
      y: random(height * 0.5),
      size: random(1, 3),
      alpha: random(150, 230)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // 🔁 Avanza l'orario simulato (es. 0.05 = 20x più veloce)
  orarioSimulato += 0.05;
  if (orarioSimulato >= 24) orarioSimulato = 0;

  let h = floor(orarioSimulato);
  let m = floor((orarioSimulato - h) * 60);
  let s = floor(((orarioSimulato - h) * 60 - m) * 60);
  let orarioReale = h + m / 60 + s / 3600;
  let oraStr = nf(h, 2) + ":" + nf(m, 2) + ":" + nf(s, 2);

  // 🟦 Sfondo dinamico
  let sfondo;
  if (orarioReale >= 4 && orarioReale < 7) {
    sfondo = transizioneConNotte(map(orarioReale, 4, 7, 0, 1), true);
  } else if (orarioReale >= 7 && orarioReale < 18) {
    sfondo = coloriTransizione[coloriTransizione.length - 1];
  } else if (orarioReale >= 18 && orarioReale < 21) {
    sfondo = transizioneConNotte(map(orarioReale, 18, 21, 0, 1), false);
  } else {
    sfondo = coloreNotte;
  }

  background(sfondo);

  let secondiTotali = floor(orarioReale * 3600);
  let secondiSimulati = secondiTotali % 60;

  // ✨ Stelle notturne
  if (orarioReale >= 21 || orarioReale < 4) {
    if (stelleVisibili < maxStelle) stelleVisibili++;

    // Ogni nuovo minuto: nuove stelle brillanti
    if (m !== ultimoMinuto) {
      ultimoMinuto = m;
      stelleBrillanti = [];
      for (let i = 0; i < 5; i++) {
        let index = floor(random(stelleVisibili));
        stelleBrillanti.push({ index: index, timer: 60 });
      }
    }

    noStroke();
    for (let i = 0; i < stelleVisibili; i++) {
      let alpha = stelle[i].alpha;
      for (let b of stelleBrillanti) {
        if (b.index === i) alpha = lerp(alpha, 255, 0.6);
      }
      fill(255, alpha);
      ellipse(stelle[i].x, stelle[i].y, stelle[i].size);
    }

    stelleBrillanti = stelleBrillanti.filter(b => --b.timer > 0);
    pollini = [];

  } else if (orarioReale >= 7 && orarioReale < 18) {
    // ☀️ Pollini diurni (simulati ogni frame)
    if (secondiSimulati !== ultimoSecondoSimulato && pollini.length < maxPollini) {
      pollini.push({
        x: random(width),
        y: random(height * 0.5, height * 0.9),
        size: random(1, 3),
        alpha: 0,
        lifetime: 300
      });
      ultimoSecondoSimulato = secondiSimulati;
    }

    noStroke();
    for (let p of pollini) {
      p.y -= 0.3 + noise(p.x, frameCount * 0.01) * 0.3;
      p.alpha = min(p.alpha + 5, 200);
      fill(255, p.alpha);
      ellipse(p.x, p.y, p.size);
      p.lifetime--;
    }

    pollini = pollini.filter(p => p.lifetime > 0);
    stelleVisibili = 0;
    stelleBrillanti = [];
    ultimoMinuto = -1;

  } else {
    // Alba/tramonto → nessun elemento extra
    stelleVisibili = 0;
    stelleBrillanti = [];
    pollini = [];
    ultimoMinuto = -1;
    ultimoSecondoSimulato = -1;
  }

  // 🌞🌙 Orbita sole/luna
  let raggioX = width * 0.45;
  let raggioY = height * 0.6;
  let centerX = width / 2;
  let centerY = height * 0.85;

  let angolo;
  let isSole = false;
  let isLuna = false;

  if (orarioReale >= 5 && orarioReale <= 19) {
    angolo = lerp(PI, 0, map(orarioReale, 5, 19, 0, 1));
    isSole = true;
  } else {
    let progressLuna = orarioReale > 19
      ? map(orarioReale, 19, 24, 0, 0.5)
      : map(orarioReale, 0, 5, 0.5, 1);
    angolo = lerp(PI, 0, progressLuna);
    isLuna = true;
  }

  let corpoX = centerX + cos(angolo) * raggioX;
  let corpoY = centerY - sin(angolo) * raggioY;

  noStroke();
  if (isSole) {
    fill(255, 204, 0);
    ellipse(corpoX, corpoY, 100);
  } else if (isLuna) {
    fill(230, 230, 255);
    ellipse(corpoX, corpoY, 80);
  }

  // Collina
  fill(34, 139, 34);
  noStroke();
  let hillHeight = height * 0.5;
  ellipse(width / 2, height + hillHeight / 2.5, width * 1.5, hillHeight * 2);

  // Orologio
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(80);
  text(oraStr, width / 2, height - hillHeight * 0.3);

  // Cornice
  stroke(0);
  strokeWeight(20);
  noFill();
  rect(0, 0, width, height);
}

function transizioneConNotte(t, versoGiorno) {
  let colori = versoGiorno
    ? [coloreNotte, ...coloriTransizione]
    : [...coloriTransizione.slice().reverse(), coloreNotte];

  let step = 1 / (colori.length - 1);
  let index = floor(t / step);
  let tInter = (t - index * step) / step;

  if (index >= colori.length - 1) return colori[colori.length - 1];
  return lerpColor(colori[index], colori[index + 1], tInter);
}
