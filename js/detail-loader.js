document.addEventListener("DOMContentLoaded", () => {
    // 1. Čitamo URL (npr. ?series=w55&code=1010)
    const params = new URLSearchParams(window.location.search);
    const series = params.get('series');
    const code = params.get('code');

    const container = document.getElementById('detail-container');
    const backLink = document.getElementById('back-link');

    // Namesti dugme "Nazad" da vodi na tačnu seriju
    if(series) {
        backLink.href = `products-list-sr.html?series=${series}`;
    } else {
        backLink.href = "products-sr.html";
    }

    if (!series || !code) {
        container.innerHTML = "<h2>Greška: Nije izabran proizvod.</h2>";
        return;
    }

    // 2. Učitavamo JSON
    fetch(`../data/${series.toLowerCase()}.json`)
        .then(res => res.json())
        .then(data => {
            const product = data[code];

            if (!product) {
                container.innerHTML = "<h2>Proizvod nije pronađen.</h2>";
                return;
            }

            // Podaci (Srpski)
            const pData = product.sr || product.en;
            const name = pData.name;
            const desc = pData.description || "";
            const details = pData.details || {};

            // Slike (Glavna + Tehnička)
            const mainImg = product.image;
            const techImg = product.tech_image || ""; 
            
            // Generisanje HTML-a
            let detailsHtml = `
            <div class="detail-left">
                <div class="main-image-container">
                    <img id="main-display-img" src="${mainImg}" alt="${name}" class="detail-img">
                </div>
                <div class="gallery-thumbs">
                    <img src="${mainImg}" class="thumb-img active" onclick="changeImage(this.src, this)">
                    ${techImg ? `<img src="${techImg}" class="thumb-img" onclick="changeImage(this.src, this)">` : ''}
                </div>
            </div>

            <div class="detail-right">
                <h1 class="detail-title">${name}</h1>
                <span class="detail-code">Code: ${product.code}</span>
                <p>${desc}</p>

                <div class="section-header">Dodatne Informacije</div>
                
                <table class="spec-table">
                    <tbody>
                        ${createRow("Dimenzije", details.dimensions)}
                        ${createRow("Brend", details.brand || "Exalco")}
                        ${createRow("Materijal", details.material || "Aluminijum")}
                        ${createRow("Tip", details.type)}
                        ${createRow("Težina", details.weight ? details.weight + " kg/m" : "")}
                    </tbody>
                </table>
            </div>
            `;

            container.innerHTML = detailsHtml;
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = "<h2>Greška pri učitavanju podataka.</h2>";
        });
});

// Pomoćna funkcija za tabelu
function createRow(key, value) {
    if (!value || value === "-") return "";
    return `<tr><td class="spec-key">${key}</td><td>${value}</td></tr>`;
}

// Funkcija za menjanje slike (Glavna <-> Tehnička)
window.changeImage = function(src, thumb) {
    document.getElementById('main-display-img').src = src;
    document.querySelectorAll('.thumb-img').forEach(img => img.classList.remove('active'));
    thumb.classList.add('active');
}