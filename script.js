// ===== Data =====
const categories = [
  ["🥦", "Grocery"], ["💻", "Tech"], ["💄", "Beauty"], ["🏠", "Home"], ["🧸", "Toys"],
  ["👕", "Fashion"], ["🎃", "Halloween"], ["💊", "Pharmacy"], ["🐶", "Pets"],
  ["🚗", "Auto"], ["🏕️", "Outdoors"], ["🎮", "Gaming"], ["👶", "Baby"],
];

const deals = [
  { e: "📺", name: "onn. 55\" Class 4K UHD LED Roku Smart TV", now: 228, was: 298, rating: 4.4, reviews: 18233, badge: "rollback" },
  { e: "🎧", name: "Wireless Noise-Cancelling Over-Ear Headphones, Black", now: 79, was: 149, rating: 4.6, reviews: 5321, badge: "rollback" },
  { e: "🍳", name: "10-Piece Nonstick Aluminum Cookware Set, Sage", now: 49.97, was: 89, rating: 4.5, reviews: 2210, badge: "rollback" },
  { e: "🧹", name: "Cordless Stick Vacuum with HEPA Filter", now: 98, was: 199, rating: 4.3, reviews: 3412, badge: "rollback" },
  { e: "⌚", name: "Fitness Smartwatch with Heart Rate Monitor, 1.8\" Display", now: 34.99, was: 69.99, rating: 4.2, reviews: 9876, badge: "rollback" },
  { e: "🛏️", name: "Memory Foam Pillow 2-Pack, Queen", now: 24.88, was: 39.88, rating: 4.7, reviews: 14562, badge: "best" },
  { e: "☕", name: "Single-Serve Coffee Maker, 40 oz Reservoir", now: 59, was: 99, rating: 4.4, reviews: 7311, badge: "rollback" },
  { e: "🎮", name: "Wireless Game Controller, Midnight Blue", now: 44, was: 69, rating: 4.8, reviews: 25110, badge: "best" },
  { e: "🧺", name: "Collapsible Laundry Hamper, 2-Pack", now: 12.97, was: 19.97, rating: 4.5, reviews: 1820, badge: "rollback" },
];

const picks = [
  { e: "🥑", name: "Fresh Hass Avocados, Each", now: 0.58, rating: 4.2, reviews: 3204, badge: "best" },
  { e: "🍌", name: "Fresh Banana, Each", now: 0.27, rating: 4.4, reviews: 12001 },
  { e: "🥛", name: "Whole Vitamin D Milk, Gallon, 128 fl oz", now: 3.42, rating: 4.6, reviews: 8811, badge: "best" },
  { e: "🧻", name: "Paper Towels, 6 Double Rolls", now: 11.97, rating: 4.7, reviews: 23560 },
  { e: "🧴", name: "Daily Moisturizing Body Lotion, 18 fl oz", now: 7.98, rating: 4.8, reviews: 6703 },
  { e: "🥚", name: "Large White Eggs, 12 Count", now: 3.14, rating: 4.3, reviews: 5402 },
  { e: "🍞", name: "Classic White Sandwich Bread, 20 oz Loaf", now: 1.42, rating: 4.5, reviews: 4120 },
  { e: "🐾", name: "Dry Dog Food, Chicken & Rice, 30 lb Bag", now: 32.98, rating: 4.7, reviews: 11930, badge: "best" },
  { e: "🧼", name: "Liquid Laundry Detergent, 92 Loads", now: 13.47, rating: 4.8, reviews: 9440 },
];

const shops = [
  ["🎃", "Halloween"], ["🍎", "Fresh food"], ["🏷️", "Rollbacks"], ["🍂", "Fall decor"],
  ["🎒", "School"], ["🔥", "Heaters"], ["🧴", "Personal care"], ["🎁", "Gift ideas"],
];

// ===== Helpers =====
const $ = (s, r = document) => r.querySelector(s);
const money = (n) => `$${n.toFixed(2)}`;
const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

function productCard(p) {
  const el = document.createElement("article");
  el.className = "product";
  const badge = p.badge === "rollback" ? `<span class="badge rollback">Rollback</span>`
    : p.badge === "best" ? `<span class="badge best">Best seller</span>` : "";
  const [dollars, cents] = p.now.toFixed(2).split(".");
  el.innerHTML = `
    <div class="product-img">${badge}<button class="fav" aria-label="Add to favorites">♡</button>${p.e}</div>
    <button class="add-btn">+ Add</button>
    <div class="price">
      <span class="price-now ${p.was ? "deal" : ""}">${p.was ? "Now " : ""}$${dollars}<sup style="font-size:.6em">${cents}</sup></span>
      ${p.was ? `<span class="price-was">${money(p.was)}</span>` : ""}
    </div>
    <p class="product-name">${p.name}</p>
    <div class="rating"><span class="stars">${stars(p.rating)}</span> ${p.reviews.toLocaleString()}</div>
    <div class="ship"><b>Free shipping</b>, arrives in 2 days</div>`;
  el.querySelector(".add-btn").addEventListener("click", (e) => addToCart(p, e.currentTarget));
  el.querySelector(".fav").addEventListener("click", (e) => {
    const b = e.currentTarget;
    b.classList.toggle("on");
    b.textContent = b.classList.contains("on") ? "♥" : "♡";
  });
  return el;
}

// ===== Render =====
$("#pills").append(...categories.map(([e, n]) => {
  const a = document.createElement("a");
  a.href = "#"; a.className = "pill";
  a.innerHTML = `<span class="pill-emoji">${e}</span>${n}`;
  return a;
}));
$("#deals-track").append(...deals.map(productCard));
$("#picks-track").append(...picks.map(productCard));
$("#circles").append(...shops.map(([e, n]) => {
  const a = document.createElement("a");
  a.href = "#"; a.className = "circle";
  a.innerHTML = `<span>${e}</span>${n}`;
  return a;
}));

// ===== Cart =====
const cart = { count: 0, total: 0 };
let toastTimer;
function addToCart(p, btn) {
  cart.count += 1;
  cart.total += p.now;
  const countEl = $("#cart-count");
  countEl.textContent = cart.count;
  $("#cart-total").textContent = money(cart.total);
  countEl.classList.remove("bump"); void countEl.offsetWidth; countEl.classList.add("bump");
  btn.classList.add("added");
  btn.textContent = "✓ Added";
  setTimeout(() => { btn.classList.remove("added"); btn.textContent = "+ Add"; }, 1400);
  const toast = $("#toast");
  toast.textContent = `Added to cart: ${p.name}`;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ===== Hero carousel =====
(function heroCarousel() {
  const root = $("#hero-carousel");
  const slides = [...root.querySelectorAll(".slide")];
  const dotsEl = $("#hero-dots");
  let i = 0, timer;
  const dots = slides.map((_, k) => {
    const d = document.createElement("button");
    d.className = "dot"; d.setAttribute("aria-label", `Go to slide ${k + 1}`);
    d.addEventListener("click", () => go(k, true));
    dotsEl.append(d);
    return d;
  });
  function go(n, user) {
    slides[i].classList.remove("active"); dots[i].classList.remove("active");
    i = (n + slides.length) % slides.length;
    slides[i].classList.add("active"); dots[i].classList.add("active");
    if (user) restart();
  }
  function restart() { clearInterval(timer); timer = setInterval(() => go(i + 1), 6000); }
  root.querySelector(".prev").addEventListener("click", () => go(i - 1, true));
  root.querySelector(".next").addEventListener("click", () => go(i + 1, true));
  go(0); restart();
})();

// ===== Shelf scroll buttons =====
document.querySelectorAll(".shelf-btn").forEach((b) => {
  b.addEventListener("click", () => {
    const track = document.getElementById(b.dataset.target);
    const dir = b.classList.contains("next") ? 1 : -1;
    track.scrollBy({ left: dir * track.clientWidth * 0.8 });
  });
});

// ===== Flash deal countdown (to midnight) =====
(function countdown() {
  const el = $("#countdown");
  const tick = () => {
    const now = new Date();
    const end = new Date(now); end.setHours(24, 0, 0, 0);
    const s = Math.max(0, Math.floor((end - now) / 1000));
    const pad = (n) => String(n).padStart(2, "0");
    el.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
  };
  tick(); setInterval(tick, 1000);
})();

// ===== Search (demo) =====
$(".search").addEventListener("submit", () => {
  const q = $("#search-input").value.trim();
  if (!q) return;
  const toast = $("#toast");
  toast.textContent = `Searching for "${q}"… (demo only)`;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
});
