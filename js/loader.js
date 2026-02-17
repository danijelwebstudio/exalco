document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const seriesParam = params.get('series'); 
    
    const grid = document.getElementById('product-grid');
    const title = document.getElementById('series-title');

    if (!seriesParam) {
        if(title) title.innerText = "Greška";
        return;
    }

    const fileName = seriesParam.toLowerCase(); 

    // --- REČNIK ZA PREVOD NASLOVA ---
    const seriesTranslations = {
        "automatic_door": "Automatska Vrata",
        "uchennel": "U-Channel Sistemi",
        "rollup": "Roletne i Brisoleji",
        "handrail": "Ograde i Rukohvati",
        "pipe_profiles": "Cijevni Profili",
        "gridesystem": "Mreže i Komarnici",
        "partition": "Pregradni Zidovi",
        "verandah": "Zimske Bašte",
        "facecap": "Fasade (Facecap)",
        "frameless": "Strukturalne Fasade",
        "rainforce": "Rainforce Sistemi",
        "hs96": "HS96 Podizno-Klizni",
        // Za ostale ostavi default (W55, EX55 itd.)
    };

    // Postavljanje naslova (Ako ima prevod koristi ga, ako ne, samo poveća slova)
    if(title) {
        title.innerText = seriesTranslations[fileName] || (seriesParam.toUpperCase() + " Serija");
    }

    // Učitavanje podataka
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

            Object.values(products).forEach(product => {
                // Forsiramo SRPSKI ("sr"), ako ga nema, tek onda "en"
                let pData = product.sr || product.en;
                
                // Ako u JSON-u pod "sr" piše engleski, ovde će izaći engleski.
                // Moraš prevesti tekst unutar JSON fajlova.
                
                let name = pData ? pData.name : "Proizvod";

                // Link ka detaljima
                let detailLink = `product-detail-sr.html?series=${fileName}&code=${product.code}`;

                htmlContent += `
                <div class="profile-card reveal">
                    <a href="${detailLink}" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; height:100%;">
                        <div class="card-img-wrapper">
                            <img src="${product.image}" alt="${name}" class="profile-img" loading="lazy" onerror="this.src='../assets/images/placeholder.png'">
                        </div>
                        <div class="card-info">
                            <span class="code-badge">${product.code}</span>
                            <h3 class="profile-name">${name}</h3>
                        </div>
                        <div class="read-more-btn">
                            Saznaj Više <i class="fas fa-arrow-right"></i>
                        </div>
                    </a>
                </div>
                `;
            });

            if(grid) grid.innerHTML = htmlContent;
        })
        .catch(error => {
            console.error(error);
            grid.innerHTML = `<div class='loading-msg'>Greška: Podaci za <b>${fileName}</b> nisu pronađeni.</div>`;
        });
});