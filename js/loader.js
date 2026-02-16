document.addEventListener("DOMContentLoaded", () => {
    // 1. Čitamo parametar iz URL-a (npr. ?series=w55)
    const params = new URLSearchParams(window.location.search);
    const seriesParam = params.get('series'); 
    
    // Provera jezika (traži <html lang="sr">)
    const currentLang = document.documentElement.lang || 'sr'; 

    const grid = document.getElementById('product-grid');
    const title = document.getElementById('series-title');

    // Ako nema parametra, prijavi grešku
    if (!seriesParam) {
        if(title) title.innerText = "Greška";
        if(grid) grid.innerHTML = "<div class='loading-msg' style='color:red;'>Nije izabrana serija. Vratite se nazad.</div>";
        return;
    }

    // Ime fajla mora biti malim slovima (w55, hs96, rollup...)
    const fileName = seriesParam.toLowerCase(); 
    
    // Postavi naslov stranice
    if(title) title.innerText = seriesParam.toUpperCase() + (currentLang === 'sr' ? " Serija" : " Series");

    // 2. Tražimo JSON fajl na serveru (GitHub-u)
    // Putanja: idemo iz 'pages' foldera nazad (..), pa u 'data', pa ime fajla
    const filePath = `../data/${fileName}.json`;

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Fajl ${fileName}.json nije pronađen.`);
            }
            return response.json();
        })
        .then(products => {
            let htmlContent = "";

            // Provera da li je fajl prazan
            if (Object.keys(products).length === 0) {
                grid.innerHTML = "<div class='loading-msg'>Nema proizvoda u ovoj seriji (podaci se unose).</div>";
                return;
            }

            // 3. Prolazimo kroz svaki proizvod i pravimo HTML
            Object.values(products).forEach(product => {
                // Uzimamo podatke za odgovarajući jezik
                let productData;
                if (currentLang === 'en') {
                    productData = product.en || product.sr; 
                } else {
                    productData = product.sr || product.en;
                }

                const name = productData ? productData.name : "Nepoznat naziv";
                const desc = productData ? productData.description : "";
                
                // Detalji (dimenzije itd)
                let detailsHtml = "";
                if(productData && productData.details && productData.details.dimensions !== "-") {
                    detailsHtml = `<p style="font-size:12px; color:#555; margin-top:5px;">Dimenzije: <b>${productData.details.dimensions}</b></p>`;
                }

                htmlContent += `
                <div class="profile-card reveal">
                    <div class="card-img-wrapper">
                        <img src="${product.image}" alt="${name}" class="profile-img" loading="lazy" onerror="this.src='../assets/images/placeholder.png'">
                    </div>
                    <div class="card-info">
                        <span class="code-badge">${product.code}</span>
                        <h3 class="profile-name">${name}</h3>
                        <p class="prod-desc">${desc}</p>
                        ${detailsHtml}
                    </div>
                </div>
                `;
            });

            // Ubacujemo sve u grid
            if(grid) grid.innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Greška:', error);
            if(grid) grid.innerHTML = `
                <div class="loading-msg" style="color: red; border: 1px solid red; padding: 20px; border-radius: 8px; background: #fff5f5;">
                    <h3>Greška pri učitavanju</h3>
                    <p>Sistem nije mogao da pronađe fajl: <b>data/${fileName}.json</b></p>
                    <p>Ovo se često dešava ako testirate direktno na računaru bez servera.</p>
                    <p><b>Kada dignete na GitHub, ovo će raditi.</b></p>
                </div>
            `;
        });
});