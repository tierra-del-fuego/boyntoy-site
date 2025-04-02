const sheetID = "122nNrYsH7mPXPci6Ks8Ree-Cg5hOsdHttOsebX5gm3A";
const sheetRange = "Sheet1";
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetRange}`;
let currentPage = 1;
let allProducts = [];
let filteredProducts = [];
let itemsPerPage = 8;
let currentGallery = [];
let currentImageIndex = 0;
let fuse;

function renderProducts(products) {
  const screenWidth = window.innerWidth;
  let columns = 6;

  if (screenWidth <= 500) columns = 1;
  else if (screenWidth <= 768) columns = 2;
  else if (screenWidth <= 992) columns = 3;
  else if (screenWidth <= 1280) columns = 4;
  else if (screenWidth <= 1600) columns = 5;

  const rows = 2;
  itemsPerPage = columns * rows;

  const start = (currentPage - 1) * itemsPerPage;
  const visible = products.slice(start, start + itemsPerPage);

  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  visible.forEach(product => grid.appendChild(product.card));

  grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

  renderPagination(products.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";
  const prev = document.createElement("button");
  prev.textContent = "←";
  prev.onclick = () => { if (currentPage > 1) { currentPage--; renderProducts(filteredProducts); }};
  pagination.appendChild(prev);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => { currentPage = i; renderProducts(filteredProducts); };
    pagination.appendChild(btn);
  }
  const next = document.createElement("button");
  next.textContent = "→";
  next.onclick = () => { if (currentPage < totalPages) { currentPage++; renderProducts(filteredProducts); }};
  pagination.appendChild(next);
}

fetch(url)
  .then(res => res.text())
  .then(text => JSON.parse(text.substr(47).slice(0, -2)))
  .then(json => {
    const data = json.table.rows;
    allProducts = data.map(row => {
      const cells = row.c.map(c => c ? c.v : "");
      const name = cells[0] || "";
      const brand = cells[1] || "";
      const price = cells[2] || "";
      const ebay = cells[3] || "";
      const images = cells.slice(4, 14);
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div style="position: relative;">
          <img src="${images[0]}" alt="${name}">
          <div class="hover-overlay">Click to view gallery</div>
        </div>
        <h3>${name}</h3>
        <p><strong>Brand:</strong> ${brand}</p>
        <p><strong>Price:</strong> $${price}</p>
        <a href="${ebay}" class="ebay-link" target="_blank">Buy on eBay</a>
      `;
      card.onclick = () => openModal(name, brand, price, ebay, images);
      return { card, name, brand };
    });
    fuse = new Fuse(allProducts, {
      keys: ['name', 'brand'],
      threshold: 0.4
    });
    filteredProducts = allProducts;
    renderProducts(filteredProducts);
  });

const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", function() {
    const term = this.value.trim();
    if (term === "") {
      filteredProducts = allProducts;
    } else {
      const result = fuse.search(term);
      filteredProducts = result.map(r => r.item);
    }
    currentPage = 1;
    renderProducts(filteredProducts);
  });
}

function openModal(name, brand, price, ebay, images) {
  document.getElementById("modalTitle").textContent = name;
  document.getElementById("modalBrand").textContent = brand;
  document.getElementById("modalPrice").textContent = price;
  document.getElementById("modalEbay").href = ebay;
  const gallery = document.getElementById("modalGallery");
  gallery.innerHTML = "";
  currentGallery = images.filter(Boolean);
  currentGallery.forEach((img, i) => {
    const el = document.createElement("img");
    el.src = img;
    el.onclick = () => openLightbox(i);
    gallery.appendChild(el);
  });
  const blurTarget = document.querySelector(".product-gallery");
  if (blurTarget) {
    blurTarget.classList.add("blurred");
  }
  document.getElementById("productModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("productModal").style.display = "none";
  const blurTarget = document.querySelector(".product-gallery");
  if (blurTarget) {
    blurTarget.classList.remove("blurred");
  }
}

function openLightbox(index) {
  currentImageIndex = index;
  document.getElementById("lightboxImg").src = currentGallery[index];
  document.getElementById("lightbox").style.display = "flex";
}

function prevImage(e) {
  e.stopPropagation();
  if (currentImageIndex > 0) {
    currentImageIndex--;
    document.getElementById("lightboxImg").src = currentGallery[currentImageIndex];
  }
}

function nextImage(e) {
  e.stopPropagation();
  if (currentImageIndex < currentGallery.length - 1) {
    currentImageIndex++;
    document.getElementById("lightboxImg").src = currentGallery[currentImageIndex];
  }
}

document.getElementById("lightbox").addEventListener("click", () => {
  document.getElementById("lightbox").style.display = "none";
});

// ✅ Tek resize handler — stretch problemi çözülür
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (filteredProducts.length > 0) {
      renderProducts(filteredProducts);
    }
  }, 200);
});