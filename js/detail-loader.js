document.addEventListener("DOMContentLoaded", () => {
    const currentLang = document.documentElement.lang || 'sr'; 

    const params = new URLSearchParams(window.location.search);
    const series = params.get('series');
    const code = params.get('code');

    const container = document.getElementById('detail-container');
    const backLink = document.getElementById('back-link');

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

    fetch(`../data/${series.toLowerCase()}.json`)
        .then(res => res.json())
        .then(data => {
            const product = data[code];

            if (!product) {
                container.innerHTML = currentLang === 'sr' ? "<h2>Proizvod nije pronađen.</h2>" : "<h2>Product not found.</h2>";
                return;
            }

            const pData = product[currentLang] || product.en;
            const details = pData.details || {};
            
            const labels = {
                dim: currentLang === 'sr' ? "Dimenzije" : "Dimensions",
                brand: currentLang === 'sr' ? "Brend" : "Brand",
                mat: currentLang === 'sr' ? "Materijal" : "Material",
                type: currentLang === 'sr' ? "Tip" : "Type",
                weight: currentLang === 'sr' ? "Težina (kg/m)" : "Weight (kg/m)",
                info: currentLang === 'sr' ? "Tehničke Specifikacije" : "Technical Specifications",
                tech: currentLang === 'sr' ? "Tehnički Prikaz" : "Technical View"
            };

            const row = (k, v) => v && v !== "-" ? `<tr><td class="spec-key">${k}</td><td>${v}</td></tr>` : "";

            const html = `
            <div class="detail-left">
                <div class="main-image-container">
                    <img src="${product.image}" class="detail-img" id="main-product-img">
                </div>
                <div class="gallery-thumbs" style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                    <img src="${product.image}" style="width:70px; cursor:pointer; border:1px solid #ddd;" onclick="document.getElementById('main-product-img').src=this.src">
                    ${product.tech_image ? `<img src="${product.tech_image}" style="width:70px; cursor:pointer; border:1px solid #ddd;" onclick="document.getElementById('main-product-img').src=this.src">` : ''}
                </div>
            </div>

            <div class="detail-right">
                <h1 class="detail-title">${pData.name}</h1>
                <span class="detail-code">Kod: ${product.code}</span>
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

                ${product.tech_image ? `
                    <div class="section-header" style="margin-top:40px;">${labels.tech}</div>
                    <div class="tech-draw-container" style="background:#fff; padding:20px; border:1px solid #eee; border-radius:8px; text-align:center;">
                        <img src="${product.tech_image}" alt="Tech View" style="max-width:100%; height:auto;">
                    </div>
                ` : ''}
            </div>
            `;

            container.innerHTML = html;
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = "<h2>Error loading data.</h2>";
        });
});