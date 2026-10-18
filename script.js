
/* ---------- Data ---------- */
const CATEGORIES = [
  { id: "all", name: "All", icon: "🛍️" },
  { id: "mobiles", name: "Mobiles", icon: "📱" },
  { id: "electronics", name: "Electronics", icon: "🎧" },
  { id: "fashion", name: "Fashion", icon: "👕" },
  { id: "home", name: "Home", icon: "🛋️" },
  { id: "appliances", name: "Appliances", icon: "📺" },
  { id: "toys", name: "Toys", icon: "🧸" },
];
 
const PRODUCTS = [
  { id: 1, name: "Nova X5 5G (Midnight Blue, 128 GB)", cat: "mobiles", price: 15999, mrp: 19999, rating: 4.4, reviews: 12840, icon: "📱", color: "#dbe8ff" },
  { id: 2, name: "Pulse Pro 5G (Graphite, 256 GB)", cat: "mobiles", price: 27499, mrp: 32999, rating: 4.5, reviews: 8421, icon: "📱", color: "#e4e4ee" },
  { id: 3, name: "BassBoom Wireless Earbuds with 40h Playback", cat: "electronics", price: 1299, mrp: 3999, rating: 4.1, reviews: 55210, icon: "🎧", color: "#ffe9e0" },
  { id: 4, name: "SmartFit Watch 1.8\" AMOLED Display", cat: "electronics", price: 2499, mrp: 6999, rating: 4.2, reviews: 20310, icon: "⌚", color: "#e6f7e9" },
  { id: 5, name: "ZipBook 14 Laptop (8 GB RAM, 512 GB SSD)", cat: "electronics", price: 38990, mrp: 52990, rating: 4.3, reviews: 6120, icon: "💻", color: "#e8eefc" },
  { id: 6, name: "Men's Cotton Slim Fit Casual Shirt", cat: "fashion", price: 499, mrp: 1599, rating: 4.0, reviews: 31870, icon: "👔", color: "#fff1cc" },
  { id: 7, name: "Women's Printed Anarkali Kurta", cat: "fashion", price: 649, mrp: 1999, rating: 4.2, reviews: 18900, icon: "👗", color: "#fde3f1" },
  { id: 8, name: "Runner Flex Sports Shoes for Men", cat: "fashion", price: 899, mrp: 2499, rating: 4.1, reviews: 44002, icon: "👟", color: "#e3f2fd" },
  { id: 9, name: "Ergo Comfort 3-Seater Fabric Sofa", cat: "home", price: 14999, mrp: 29999, rating: 4.0, reviews: 2210, icon: "🛋️", color: "#f3e5d8" },
  { id: 10, name: "Bamboo Study Table with Storage Shelf", cat: "home", price: 3299, mrp: 6499, rating: 4.3, reviews: 3912, icon: "🪑", color: "#e8f5e0" },
  { id: 11, name: "Vision 43\" Full HD Smart LED TV", cat: "appliances", price: 21999, mrp: 36999, rating: 4.3, reviews: 28640, icon: "📺", color: "#e0e7f5" },
  { id: 12, name: "CoolMax 1.5 Ton 3 Star Inverter Split AC", cat: "appliances", price: 34990, mrp: 52000, rating: 4.4, reviews: 9755, icon: "❄️", color: "#dff3fb" },
  { id: 13, name: "FrostPro 260 L Double Door Refrigerator", cat: "appliances", price: 24490, mrp: 31990, rating: 4.2, reviews: 7340, icon: "🧊", color: "#e8f0f2" },
  { id: 14, name: "Build-It 500 Pcs Creative Blocks Set", cat: "toys", price: 549, mrp: 1299, rating: 4.4, reviews: 14320, icon: "🧱", color: "#ffe3e3" },
  { id: 15, name: "Remote Control Stunt Car, Rechargeable", cat: "toys", price: 799, mrp: 1999, rating: 3.9, reviews: 9870, icon: "🚗", color: "#fff0d6" },
  { id: 16, name: "Plush Teddy Bear 3 Feet, Soft & Cuddly", cat: "toys", price: 429, mrp: 999, rating: 4.3, reviews: 22100, icon: "🧸", color: "#f5e6da" },
];
 
const BANNERS = [
  { title: "Big Billion Sale", text: "Up to 80% off on top brands", icon: "🛒", bg: "linear-gradient(120deg,#2874f0,#5b9bff)" },
  { title: "Mobile Mania", text: "Latest 5G phones from ₹15,999", icon: "📱", bg: "linear-gradient(120deg,#7b2ff7,#b47cff)" },
  { title: "Fashion Fest", text: "Min 50% off on clothing & shoes", icon: "👗", bg: "linear-gradient(120deg,#e91e63,#ff7a9c)" },
  { title: "Home Makeover", text: "Furniture & appliances, easy EMI", icon: "🛋️", bg: "linear-gradient(120deg,#00897b,#4db6ac)" },
];
 
/* ---------- State ---------- */
const state = {
  category: "all",
  query: "",
  sort: "rel",
  cart: loadCart(),
  slide: 0,
};
 
function loadCart() {
  try { return JSON.parse(localStorage.getItem("flipmart-cart")) || []; }
  catch { return []; }
}
function saveCart() {
  try { localStorage.setItem("flipmart-cart", JSON.stringify(state.cart)); } catch {}
}
 
/* ---------- Helpers ---------- */
const $ = (id) => document.getElementById(id);
const rupees = (n) => "₹" + n.toLocaleString("en-IN");
const discount = (p) => Math.round(((p.mrp - p.price) / p.mrp) * 100);
 
let toastTimer;
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2000);
}
 
/* ---------- Categories ---------- */
function renderCategories() {
  $("cats").innerHTML = CATEGORIES.map((c) =>
    `<button class="cat ${c.id === state.category ? "active" : ""}" data-cat="${c.id}">
       <span class="ic">${c.icon}</span>${c.name}
     </button>`).join("");
}
$("cats").addEventListener("click", (e) => {
  const btn = e.target.closest(".cat");
  if (!btn) return;
  state.category = btn.dataset.cat;
  renderCategories();
  renderProducts();
});
 
/* ---------- Products ---------- */
function visibleProducts() {
  let list = PRODUCTS.filter((p) =>
    (state.category === "all" || p.cat === state.category) &&
    p.name.toLowerCase().includes(state.query));
  if (state.sort === "low") list.sort((a, b) => a.price - b.price);
  if (state.sort === "high") list.sort((a, b) => b.price - a.price);
  if (state.sort === "rating") list.sort((a, b) => b.rating - a.rating);
  return list;
}
 
function renderProducts() {
  const list = visibleProducts();
  const cat = CATEGORIES.find((c) => c.id === state.category);
  $("listTitle").textContent = state.query
    ? `Results for "${state.query}"`
    : state.category === "all" ? "Best of Electronics & More" : `Best of ${cat.name}`;
  $("empty").hidden = list.length > 0;
  $("grid").innerHTML = list.map((p) => `
    <article class="card">
      <div class="thumb" style="background:${p.color}" aria-hidden="true">${p.icon}</div>
      <h3 title="${p.name}">${p.name}</h3>
      <div class="rating"><span class="stars">${p.rating} ★</span>(${p.reviews.toLocaleString("en-IN")})</div>
      <div class="price"><strong>${rupees(p.price)}</strong><s>${rupees(p.mrp)}</s><span>${discount(p)}% off</span></div>
      <button class="add" data-add="${p.id}">Add to Cart</button>
    </article>`).join("");
}
 
$("grid").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (btn) addToCart(Number(btn.dataset.add));
});
 
/* ---------- Search & sort ---------- */
$("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  state.query = $("searchInput").value.trim().toLowerCase();
  state.category = "all";
  renderCategories();
  renderProducts();
});
$("searchInput").addEventListener("input", (e) => {
  if (!e.target.value) { state.query = ""; renderProducts(); }
});
$("sortSelect").addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderProducts();
});
 
/* ---------- Cart ---------- */
function addToCart(id) {
  const line = state.cart.find((i) => i.id === id);
  if (line) line.qty++; else state.cart.push({ id, qty: 1 });
  saveCart();
  renderCart();
  toast("Added to cart");
}
function changeQty(id, delta) {
  const line = state.cart.find((i) => i.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) state.cart = state.cart.filter((i) => i.id !== id);
  saveCart();
  renderCart();
}
function removeItem(id) {
  state.cart = state.cart.filter((i) => i.id !== id);
  saveCart();
  renderCart();
}
 
function renderCart() {
  const count = state.cart.reduce((s, i) => s + i.qty, 0);
  const total = state.cart.reduce((s, i) => s + i.qty * PRODUCTS.find((p) => p.id === i.id).price, 0);
  $("cartCount").textContent = count;
  $("cartTotal").textContent = rupees(total);
  $("checkoutBtn").disabled = count === 0;
  $("cartItems").innerHTML = count === 0
    ? `<p class="cart-empty">Your cart is empty.<br>Add items to get started.</p>`
    : state.cart.map((i) => {
        const p = PRODUCTS.find((x) => x.id === i.id);
        return `<div class="item">
          <div class="thumb" style="background:${p.color}">${p.icon}</div>
          <div class="info">
            <div>${p.name}</div>
            <strong>${rupees(p.price * i.qty)}</strong>
            <div class="qty">
              <button data-dec="${p.id}" aria-label="Decrease quantity">−</button>
              <span>${i.qty}</span>
              <button data-inc="${p.id}" aria-label="Increase quantity">+</button>
              <button class="remove" data-rem="${p.id}">Remove</button>
            </div>
          </div>
        </div>`;
      }).join("");
}
 
$("cartItems").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.inc) changeQty(Number(b.dataset.inc), 1);
  if (b.dataset.dec) changeQty(Number(b.dataset.dec), -1);
  if (b.dataset.rem) removeItem(Number(b.dataset.rem));
});
 
function toggleCart(open) {
  $("drawer").classList.toggle("open", open);
  $("drawer").setAttribute("aria-hidden", String(!open));
  $("overlay").hidden = !open;
}
$("cartBtn").addEventListener("click", () => toggleCart(true));
$("closeCart").addEventListener("click", () => toggleCart(false));
$("overlay").addEventListener("click", () => toggleCart(false));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggleCart(false); });
 
$("checkoutBtn").addEventListener("click", () => {
  state.cart = [];
  saveCart();
  renderCart();
  toggleCart(false);
  toast("Order placed successfully! (demo)");
});
$("loginBtn").addEventListener("click", () => toast("Login is not part of this demo"));
 
/* ---------- Hero carousel ---------- */
function renderSlides() {
  $("slides").innerHTML = BANNERS.map((b) => `
    <div class="slide" style="background:${b.bg}">
      <div><h2>${b.title}</h2><p>${b.text}</p></div>
      <div class="big" aria-hidden="true">${b.icon}</div>
    </div>`).join("");
  $("dots").innerHTML = BANNERS.map((_, i) => `<button data-dot="${i}" aria-label="Go to slide ${i + 1}"></button>`).join("");
  goTo(0);
}
function goTo(n) {
  state.slide = (n + BANNERS.length) % BANNERS.length;
  $("slides").style.transform = `translateX(-${state.slide * 100}%)`;
  [...$("dots").children].forEach((d, i) => d.classList.toggle("on", i === state.slide));
}
$("prev").addEventListener("click", () => { goTo(state.slide - 1); restartAuto(); });
$("next").addEventListener("click", () => { goTo(state.slide + 1); restartAuto(); });
$("dots").addEventListener("click", (e) => {
  const d = e.target.closest("[data-dot]");
  if (d) { goTo(Number(d.dataset.dot)); restartAuto(); }
});
let auto;
function restartAuto() {
  clearInterval(auto);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    auto = setInterval(() => goTo(state.slide + 1), 4000);
  }
}
 
/* ---------- Init ---------- */
renderCategories();
renderSlides();
renderProducts();
renderCart();
restartAuto();
 