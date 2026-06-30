document.addEventListener("DOMContentLoaded", () => {
    // 1. Proveri koji je jezik stranice
    const currentLang = document.documentElement.lang || 'sr'; 

    const params = new URLSearchParams(window.location.search);
    const seriesParam = params.get('series'); 
    
    const grid = document.getElementById('product-grid');
    const title = document.getElementById('series-title');

    // Ako nema serije u URL-u
    if (!seriesParam) {
        if(title) title.innerText = currentLang === 'sr' ? "Izaberite seriju" : "Select a Series";
        return;
    }

    const fileName = seriesParam.toLowerCase(); 

    // --- REČNIK LEPIH NAZIVA (OVO JE ONO ŠTO SI TRAŽIO) ---
    const seriesNames = {
        // --- OKRETNI ---
        "ex55": { sr: "EX55 Serija", en: "EX55 Series" },
        "ex64": { sr: "EX64 Serija", en: "EX64 Series" },
        "ex74": { sr: "EX74 Serija", en: "EX74 Series" },
        "w55": { sr: "W55 Serija", en: "W55 Series" },
        "w60": { sr: "W60 Serija", en: "W60 Series" },
        "w69": { sr: "W69 Serija", en: "W69 Series" },
        "th60": { sr: "TH60 Serija", en: "TH60 Series" },
        "e55": { sr: "E55 Serija", en: "E55 Series" },
        "59series": { sr: "Serija 59", en: "59 Series" },
        "47series": { sr: "Serija 47", en: "47 Series" },
        "lightaldox": { sr: "Light Aldox", en: "Light Aldox" },
        "heavyaldox": { sr: "Heavy Aldox", en: "Heavy Aldox" },

        // --- KLIZNI ---
        "hs96": { sr: "HS96 Podizno-Klizni", en: "HS96 Lift & Slide" },
        "ths77": { sr: "THS 77 Podizno-Klizni", en: "THS 77 Lift & Slide" },
        "60sliding": { sr: "Serija 60 Klizni", en: "60 Sliding Series" },
        "newsliding": { sr: "Serija Novi Klizni", en: "New Sliding Series" },
        "sliding92": { sr: "Serija 92 Klizni", en: "92 Sliding Series" },

        // --- FASADE ---
        "facecap": { sr: "Standardna Fasada (Facecap)", en: "Standard Curtain Wall(Facecap)" },
        "frameless": { sr: "Strukturalna Fasada (Bez rama)", en: "Structural Curtain Wall(Frameless)" },
        "uchennel": { sr: "U-Profili", en: "U-Channel" },
        "rainforce": { sr: "Rainforce Sistemi", en: "Rainforce Systems" },

        // --- OSTALO ---
        "verandah": { sr: "Zimske Bašte", en: "Winter Gardens(Verandah)" },
        "rollup": { sr: "Roletne i Brisoleji", en: "Rolling Shutters" },
        "gridesystem": { sr: "Mreže i Komarnici", en: "Insect Screens" },
        "partition": { sr: "Pregradni Zidovi", en: "Partition Systems" },
        "handrail": { sr: "Ograde i Rukohvati", en: "Handrails" },
        "automatic_door": { sr: "Automatska Vrata", en: "Automatic Doors" },
        "pipe_profiles": { sr: "Cijevni Profili", en: "Pipe Profiles" }
    };

    // Postavljanje lepog naslova
    if(title) {
        if (seriesNames[fileName]) {
            // Ako imamo lep naziv u rečniku, koristi njega
            title.innerText = seriesNames[fileName][currentLang];
        } else {
            // Ako nemamo (za svaki slučaj), napiši samo kod velikim slovima
            title.innerText = seriesParam.toUpperCase();
        }
    }

    // Učitavanje JSON podataka
    fetch(`../data/${fileName}.json`)
        .then(response => {
            if (!response.ok) throw new Error("Fajl nije pronađen");
            return response.json();
        })
        .then(products => {
            let htmlContent = "";

            if (Object.keys(products).length === 0) {
                grid.innerHTML = currentLang === 'sr' ? "<div class='loading-msg'>Nema proizvoda.</div>" : "<div class='loading-msg'>No products found.</div>";
                return;
            }

            Object.values(products).forEach(product => {
                // ... unutar Object.values(products).forEach(product =>) ...

// ... unutar Object.values(products).forEach(product =>) ...
let pData = product[currentLang] || product.en;
let name = pData ? pData.name : "Product";
let btnText = currentLang === 'sr' ? "Saznaj Više" : "Read More";

// SEO Alt Atribut šablon koji je tražen
const listAlt = `${name} kod ${product.code} - aluminijumski profil`;

let detailPage = (currentLang === 'en') ? 'product-detail.html' : 'product-detail-sr.html';
let detailLink = `${detailPage}?series=${fileName}&code=${product.code}`;

htmlContent += `
<div class="profile-card reveal">
    <a href="${detailLink}" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; height:100%;">
        <div class="card-img-wrapper">
            <img src="${product.image}" alt="${listAlt}" class="profile-img" loading="lazy" onerror="this.src='../assets/images/placeholder.png'">
        </div>
        <div class="card-info">
            <span class="code-badge">${product.code}</span>
            <h3 class="profile-name">${name}</h3>
        </div>
        <div class="read-more-btn">
            ${btnText} <i class="fas fa-arrow-right" style="margin-left:5px;"></i>
        </div>
    </a>
</div>
`;
            });

            if(grid) grid.innerHTML = htmlContent;
        })
        .catch(error => {
            console.error(error);
            let errMsg = currentLang === 'sr' ? "Greška pri učitavanju ili nema proizvoda." : "Error loading data.";
            grid.innerHTML = `<div class='loading-msg'>${errMsg}</div>`;
        });
});