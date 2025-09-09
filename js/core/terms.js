function renderTerms() {
  const container = document.querySelector("#tab-terms .terms-container");
  if (!container || !Array.isArray(termsData)) return;

  container.innerHTML = "";

  termsData.forEach(entry => {
    let imagesHtml = "";
    if (Array.isArray(entry.images)) {
      imagesHtml = entry.images.map(src =>
        `<img src="${src}" alt="${entry.title}" class="changelog-detail-img">`
      ).join("");
    } else if (entry.image) {
      imagesHtml = `<img src="${entry.image}" alt="${entry.title}" class="changelog-detail-img">`;
    }

    container.insertAdjacentHTML("beforeend", `
      <div class="changelog-info-card animated-card">
        <h2 class="changelog-title">${entry.title}</h2>
        <p class="changelog-date">Latest Update: ${entry.date}</p>
        <p class="changelog-content">${entry.content}</p>
        ${imagesHtml}
      </div>
    `);
  });
}
