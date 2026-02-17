document.addEventListener("DOMContentLoaded", () => {
    // 1. Proveri jezik (sr ili en)
    const currentLang = document.documentElement.lang || 'sr'; 

    const params = new URLSearchParams(window.location.search);
    const series = params.get('series');
    const code = params.get('code');

    const container = document.getElementById('detail-container');
    const backLink = document.getElementById('back-link');

    // Namesti dugme "Nazad" (na odgovarajuću listu)
    let listPage = currentLang === 'sr' ? 'products-list-sr.html' : 'products-list.html';
    let mainPage = currentLang === 'sr' ? 'products-sr.html' : 'products.html';

    if(series) {
        backLink.href = `${listPage}?series=${series}`;
    } else {
        backLink.href = mainPage;
    }

    if (!series || !code) {
        container.innerHTML = "<h2>Greška / Error</h2>";
        return;
    }

    // Učitaj JSON
    fetch(`../data/${series.toLowerCase()}.json`)
        .then(res => res.json())
        .then(data => {
            const product = data[code];

            if (!product) {
                container.innerHTML = currentLang === 'sr' ? "<h2>Proizvod nije pronađen.</h2>" : "<h2>Product not found.</h2>";
                return;
            }

            // --- PAMETAN ODABIR JEZIKA ---
            const pData = product[currentLang] || product.en;
            const details = pData.details || {};
            
            // Prevodi labela za tabelu
            const labels = {
                dim: currentLang === 'sr' ? "Dimenzije" : "Dimensions",
                brand: currentLang === 'sr' ? "Brend" : "Brand",
                mat: currentLang === 'sr' ? "Materijal" : "Material",
                type: currentLang === 'sr' ? "Tip" : "Type",
                weight: currentLang === 'sr' ? "Težina" : "Weight",
                info: currentLang === 'sr' ? "Dodatne Informacije" : "Additional Information"
            };

            const row = (k, v) => v && v !== "-" ? `<tr><td class="spec-key">${k}</td><td>${v}</td></tr>` : "";

            const html = `
            <div class="detail-left">
                <div class="main-image-container">
                    <img src="${product.image}" class="detail-img">
                </div>
            </div>

            <div class="detail-right">
                <h1 class="detail-title">${pData.name}</h1>
                <span class="detail-code">Code: ${product.code}</span>
                <p class="detail-desc">${pData.description || ""}</p>

                <div class="section-header">${labels.info}</div>
                <table class="spec-table">
                    <tbody>
                        ${row(labels.dim, details.dimensions)}
                        ${row(labels.brand, details.brand || "Exalco")}
                        ${row(labels.mat, details.material || "Aluminium")}
                        ${row(labels.type, details.type)}
                        ${row(labels.weight, details.weight)}
                    </tbody>
                </table>
            </div>
            `;

            container.innerHTML = html;
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = "<h2>Error loading data.</h2>";
        });
});