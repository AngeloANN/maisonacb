// ===== Maison ACB — Collection page =====

// ---- 1. The clothes in the Tops wardrobe ----
// slug = the product page; img = transparent PNG with the hook cut at the top.
// Add a line per piece. They're placed 2 per rail, in this order.
const TOPS = [
  { name: "Pull gris", slug: "pull-gris", img: "collection/pull-gris.png" },
  { name: "Pull gris", slug: "pull-gris", img: "collection/pull-gris.png" },
  { name: "Pull rouge", slug: "pull-gris", img: "collection/pull-rouge.png" },
  { name: "Pull rouge", slug: "pull-gris", img: "collection/pull-rouge.png" },
  { name: "Pull gris", slug: "pull-gris", img: "collection/pull-gris.png" },
  { name: "Pull rouge", slug: "pull-gris", img: "collection/pull-rouge.png" },
];

// ---- 2. Settings ----
const COPIES = 8;                               // how many door pairs roll past (more = faster start)
const productUrl = (slug) => `product.html?item=${slug}`;   // where a click on a piece leads

// ---- 3. Grab the elements ----
const tops   = document.getElementById("tops");
const strip  = document.getElementById("topsStrip");
const inside = document.getElementById("topsInside");
const win    = tops.querySelector(".window");

// ---- 4. Build the strip: COPIES pairs of doors stacked vertically ----
const pair = `
  <div class="pair">
    <img class="door left"  src="collection/porte-gauche.png" alt="">
    <img class="door right" src="collection/porte-droite.png" alt="">
  </div>`;
strip.innerHTML = Array(COPIES).fill(pair).join("");

// ---- 5. Build the clothes: rows of 2, each row hangs on a rail ----
const rows = [];
for (let i = 0; i < TOPS.length; i += 2) rows.push(TOPS.slice(i, i + 2));
inside.innerHTML = rows.map(row => `
  <div class="row">
    <div class="rail"></div>
    ${row.map(p => `
      <a class="item" href="${productUrl(p.slug)}">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <span>${p.name}</span>
      </a>`).join("")}
  </div>`).join("");

// ---- 6. Sizes: each pair is exactly as tall as the window, so the last one lands perfectly ----
function measure() {
  const h = win.clientHeight;
  const gap = parseFloat(getComputedStyle(strip).gap) || 0;
  strip.style.setProperty("--pair-h", `${h}px`);
  // total distance = all the pairs except the last one (+ their gaps)
  strip.style.setProperty("--end", `-${(h + gap) * (COPIES - 1)}px`);
}

// ---- 7. Roll, stop, show the label ----
function start() {
  measure();
  strip.classList.add("rolling");
  strip.addEventListener("animationend", () => tops.classList.add("stopped"), { once: true });
}
window.addEventListener("load", start);
window.addEventListener("resize", measure);   // keeps the stop point right if the window changes size

// ---- 8. Click the wardrobe → the visible doors slide open ----
tops.addEventListener("click", () => {
  if (!tops.classList.contains("stopped") || tops.classList.contains("opened")) return;
  strip.lastElementChild.classList.add("open");   // the pair you can see is the last one
  tops.classList.add("opened");                   // lets you click/scroll the clothes
  // once the doors are out of the way, let clicks go through the strip to the clothes
  setTimeout(() => { strip.style.pointerEvents = "none"; }, 1200);
});
