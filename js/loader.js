document.addEventListener("DOMContentLoaded", () => {
    // 1. Čitamo koja je serija izabrana (npr. W55)
    const params = new URLSearchParams(window.location.search);
    const seriesParam = params.get('series'); 
    
    const grid = document.getElementById('product-grid');
    const title = document.getElementById('series-title');

    // Ako nema serije u linku
    if (!seriesParam) {
        if(title) title.innerText = "Greška";
        if(grid) grid.innerHTML = "<div class='loading-msg' style='color:red'>Greška: Nije izabrana serija.</div>";
        return;
    }

    const fileName = seriesParam.toLowerCase(); 
    
    // Postavi naslov (npr. W55 SERIJA)
    if(title) title.innerText = seriesParam.toUpperCase() + " Serija";

    // 2. Učitavamo podatke iz JSON fajla
    fetch(`../data/${fileName}.json`)
        .then(response => {
            if (!response.ok) throw new Error("Fajl nije pronađen");
            return response.json();
        })
        .then(products => {
            let htmlContent = "";

            if (Object.keys(products).length === 0) {
                grid.innerHTML = "<div class='loading-msg'>Nema proizvoda u ovoj seriji.</div>";
                return;
            }

            // 3. Pravimo kartice
            Object.values(products).forEach(product => {
                // Uzimamo srpski naziv (ili engleski ako nema)
                let pData = product.sr || product.en;
                let name = pData ? pData.name : "Proizvod";
                
                // --- KLJUČNI DEO: PRAVIMO LINK ---
                // Ovo vodi na novu stranicu i prenosi podatke (serija i kod)
                let link = `product-detail-sr.html?series=${fileName}&code=${product.code}`;

                htmlContent += `
                <div class="profile-card reveal">
                    <a href="${link}" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; height:100%;">
                        
                        <div class="card-img-wrapper">
                            <img src="${product.image}" alt="${name}" class="profile-img" loading="lazy" onerror="this.src='../assets/images/placeholder.png'">
                        </div>
                        
                        <div class="card-info">
                            <span class="code-badge">${product.code}</span>
                            <h3 class="profile-name">${name}</h3>
                        </div>

                        <div class="read-more-btn" style="margin-top:auto; padding:15px; text-align:center; background:#f8f9fa; border-top:1px solid #eee; font-weight:bold; font-size:12px; text-transform:uppercase; color:#0056b3;">
                            Saznaj Više <i class="fas fa-arrow-right" style="margin-left:5px;"></i>
                        </div>

                    </a>
                </div>
                `;
            });

            if(grid) grid.innerHTML = htmlContent;
        })
        .catch(error => {
            console.error(error);
            grid.innerHTML = `<div class='loading-msg'>Greška: Nismo našli podatke za <b>${fileName}</b>. Proveri da li fajl postoji u folderu data.</div>`;
        });
});