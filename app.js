/* =============================
   app.js — Orden de Sostenidos y Bemoles · Musicala
   ============================= */

// -------- Orden de accidentales --------
const ORDER_SHARPS = ["Fa♯","Do♯","Sol♯","Re♯","La♯","Mi♯","Si♯"]; // F C G D A E B
const ORDER_FLATS  = ["Si♭","Mi♭","La♭","Re♭","Sol♭","Do♭","Fa♭"];   // B E A D G C F

// -------- Listas de tónicas disponibles en UI --------
// (Solfeo; evitamos notaciones con dobles sostenidos/bemoles)
const MAJOR_KEYS = [
  // ♭
  "Do♭","Sol♭","Re♭","La♭","Mi♭","Si♭","Fa",
  // natural
  "Do",
  // ♯
  "Sol","Re","La","Mi","Si","Fa♯","Do♯"
];

const MINOR_KEYS = [
  // ♭
  "La♭","Mi♭","Si♭","Fa","Do","Sol","Re",
  // natural
  "La",
  // ♯
  "Mi","Si","Fa♯","Do♯","Sol♯","Re♯","La♯"
];

// -------- Mapas de armaduras separados por modo --------
// Mayor
const KEY_SIGNATURES_MAJOR = {
  "Do":  {type:"none",   n:0},
  "Sol": {type:"sharps", n:1},
  "Re":  {type:"sharps", n:2},
  "La":  {type:"sharps", n:3},
  "Mi":  {type:"sharps", n:4},
  "Si":  {type:"sharps", n:5},
  "Fa♯": {type:"sharps", n:6},
  "Do♯": {type:"sharps", n:7},

  "Fa":  {type:"flats",  n:1},
  "Si♭": {type:"flats",  n:2},
  "Mi♭": {type:"flats",  n:3},
  "La♭": {type:"flats",  n:4},
  "Re♭": {type:"flats",  n:5},
  "Sol♭":{type:"flats",  n:6},
  "Do♭": {type:"flats",  n:7}
};

// menor (relativas de las mayores anteriores)
const KEY_SIGNATURES_MINOR = {
  "La":  {type:"none",   n:0},  // relativa de Do M
  "Mi":  {type:"sharps", n:1},  // relativa de Sol M
  "Si":  {type:"sharps", n:2},
  "Fa♯": {type:"sharps", n:3},
  "Do♯": {type:"sharps", n:4},
  "Sol♯":{type:"sharps", n:5},
  "Re♯": {type:"sharps", n:6},
  "La♯": {type:"sharps", n:7},

  "Re":  {type:"flats",  n:1},  // relativa de Fa M
  "Sol": {type:"flats",  n:2},
  "Do":  {type:"flats",  n:3},
  "Fa":  {type:"flats",  n:4},
  "Si♭": {type:"flats",  n:5},
  "Mi♭": {type:"flats",  n:6},
  "La♭": {type:"flats",  n:7}
};

// -------- DOM --------
const modoSel   = document.getElementById("modo");
const tonicaSel = document.getElementById("tonica");
const claveSel  = document.getElementById("clave");
const labelT    = document.getElementById("label-tonalidad");
const detalleEl = document.getElementById("detalle");
const listaEl   = document.getElementById("lista");

// -------- Helpers --------
function fillKeys(){
  const list = (modoSel.value === "M") ? MAJOR_KEYS : MINOR_KEYS;
  tonicaSel.innerHTML = list.map(k => `<option value="${k}">${k}</option>`).join("");
  tonicaSel.value = (modoSel.value === "M") ? "Do" : "La"; // defaults clásicos
  refresh();
}

function getSignature(key, mode){
  const map = (mode === "M") ? KEY_SIGNATURES_MAJOR : KEY_SIGNATURES_MINOR;
  return map[key] || {type:"none", n:0};
}

function listAccidentals(type, n){
  if(n === 0) return [];
  const order = (type === "sharps") ? ORDER_SHARPS : ORDER_FLATS;
  return order.slice(0, n);
}

// -------- Render principal --------
function refresh(){
  const mode = modoSel.value;
  const key  = tonicaSel.value;
  const clef = claveSel.value;

  const sig  = getSignature(key, mode);

  // Label de tonalidad
  labelT.textContent = `${key} ${mode === "M" ? "Mayor" : "menor"}`;

  // Badges
  const badges = [];
  badges.push(
    `<span class="badge">${
      sig.type === "none" ? "sin armadura" : (sig.type === "sharps" ? "♯ sostenidos" : "♭ bemoles")
    }</span>`
  );
  badges.push(`<span class="badge">${sig.n} ${sig.n === 1 ? "signo" : "signos"}</span>`);
  detalleEl.innerHTML = badges.join("");

  // Lista textual
  const accList = listAccidentals(sig.type, sig.n);
  listaEl.textContent = accList.length ? accList.join(" · ") : "—";

  // SVG
  renderClefAndAcc(clef, sig.type, sig.n);
}

// -------- SVG: clave y armadura --------
function renderClefAndAcc(clef, type, n){
  const gClef  = document.getElementById("clef");
  const gAcc   = document.getElementById("acc");
  const legend = document.getElementById("legend");

  gClef.innerHTML = "";
  gAcc.innerHTML  = "";

  // Posiciones Y aproximadas para cada clave (coinciden con el orden de ORDER_SHARPS / ORDER_FLATS)
  const ySharps = {
    G:[82, 58, 88, 66, 96, 74, 52],  // Fa#, Do#, Sol#, Re#, La#, Mi#, Si#
    F:[66, 90, 60, 84, 54, 78, 102],
    C:[74, 50, 78, 56, 84, 62, 86]
  };
  const yFlats = {
    G:[70, 92, 62, 84, 56, 78, 100], // Sib, Mib, Lab, Reb, Solb, Dob, Fab
    F:[56, 78, 50, 72, 44, 66, 88],
    C:[64, 86, 56, 78, 50, 72, 94]
  };

  // Clave (glifo Unicode)
  const clefGlyph = (clef === "G") ? "𝄞" : (clef === "F" ? "𝄢" : "𝄡");
  const clefY     = (clef === "G") ? 88 : (clef === "F" ? 72 : 64);
  gClef.innerHTML = `<text x="28" y="${clefY}" font-size="96" fill="#2a3350">${clefGlyph}</text>`;

  // Accidentales
  let x = 100;
  const step = 20;
  const arrY = (type === "sharps") ? ySharps[clef] : yFlats[clef];

  for(let i = 0; i < n; i++){
    const y = (arrY && arrY[i] !== undefined) ? arrY[i] : 72;
    const glyph = (type === "sharps") ? "♯" : "♭";
    const color = (type === "sharps") ? "#0C41C4" : "#E02088";
    gAcc.insertAdjacentHTML(
      "beforeend",
      `<text x="${x}" y="${y}" font-size="36" font-weight="700" fill="${color}">${glyph}</text>`
    );
    x += step;
  }

  // Leyenda
  if(n === 0){
    legend.textContent = "Sin signos en la armadura";
  } else {
    const serie = (type === "sharps" ? ORDER_SHARPS : ORDER_FLATS).slice(0, n).join(" · ");
    legend.textContent = `Orden colocado: ${serie}`;
  }
}

// -------- Eventos / Init --------
modoSel.addEventListener("change", fillKeys);
tonicaSel.addEventListener("change", refresh);
claveSel.addEventListener("change", refresh);

// Boot
fillKeys();
