document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const brandList = document.getElementById("brandList");
  const alphabetLinks = document.querySelectorAll(".alphabet-filter a");
  let allBrands = {};

  // JSON verisini yükle
  fetch("brands.json")
    .then((response) => {
      if (!response.ok) throw new Error("Veri yüklenemedi");
      return response.json();
    })
    .then((data) => {
      allBrands = data;
      displayBrands("A"); // Sayfa açıldığında A harfiyle başlasın
    })
    .catch((error) => {
      console.error("JSON okuma hatası:", error);
      brandList.innerHTML = "<p style='color:red'>Brand verileri yüklenemedi.</p>";
    });

  // Harfe tıklanınca filtreleme
  alphabetLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const letter = this.textContent;
      searchInput.value = ""; // Arama kutusunu sıfırla
      displayBrands(letter);
    });
  });

  // Arama çubuğu ile filtreleme
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    brandList.innerHTML = ""; // Listeyi temizle

    for (let letter in allBrands) {
      const matched = allBrands[letter].filter((brand) =>
        brand.toLowerCase().includes(searchTerm)
      );

      if (matched.length > 0) {
        const section = document.createElement("div");
        section.innerHTML = `<h2>${letter}</h2><ul>${matched
          .map((b) => `<li>${b}</li>`)
          .join("")}</ul>`;
        brandList.appendChild(section);
      }
    }
  });

  // Listeyi ekrana yaz
  function displayBrands(letter) {
    brandList.innerHTML = ""; // Temizle
    const brands = allBrands[letter];
    if (!brands || brands.length === 0) {
      brandList.innerHTML = "<p>Hiç marka bulunamadı.</p>";
      return;
    }

    const section = document.createElement("div");
    section.innerHTML = `<h2>${letter}</h2><ul>${brands
      .map((b) => `<li>${b}</li>`)
      .join("")}</ul>`;
    brandList.appendChild(section);
  }
});
