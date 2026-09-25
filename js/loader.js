document.addEventListener("DOMContentLoaded", () => {
    // Provjera jezika stranice
    const currentLang = (document.documentElement.lang || 'sr').toLowerCase().startsWith('en') ? 'en' : 'sr';

    const params = new URLSearchParams(window.location.search);
    const seriesParam = params.get('series');

    const grid = document.getElementById('product-grid');
    const title = document.getElementById('series-title');

    // =====================================================
    // PROMJENA JEZIKA - ZADRŽAVA ISTU SERIJU
    // =====================================================
    const srLangLink = document.querySelector(
        '.lang-search a[href^="products-list-sr.html"]'
    );

    const enLangLink = document.querySelector(
        '.lang-search a[href^="products-list.html"]'
    );

    if (seriesParam) {
        const encodedSeries = encodeURIComponent(seriesParam);

        if (srLangLink) {
            srLangLink.href = `products-list-sr.html?series=${encodedSeries}`;
        }

        if (enLangLink) {
            enLangLink.href = `products-list.html?series=${encodedSeries}`;
        }
    }

    // Ako nema serije u URL-u
    if (!seriesParam) {
        if (title) {
            title.innerText =
                currentLang === 'sr'
                    ? "Izaberite seriju"
                    : "Select a Series";
        }

        return;
    }

    const fileName = seriesParam.toLowerCase();

    // =====================================================
    // NAZIVI SERIJA
    // =====================================================
    const seriesNames = {
        // OKRETNI
        "ex55": {
            sr: "EX55 Serija",
            en: "EX55 Series"
        },

        "ex64": {
            sr: "EX64 Serija",
            en: "EX64 Series"
        },

        "ex74": {
            sr: "EX74 Serija",
            en: "EX74 Series"
        },

        "w55": {
            sr: "W55 Serija",
            en: "W55 Series"
        },

        "w60": {
            sr: "W60 Serija",
            en: "W60 Series"
        },

        "w69": {
            sr: "W69 Serija",
            en: "W69 Series"
        },

        "th60": {
            sr: "TH60 Serija",
            en: "TH60 Series"
        },

        "e55": {
            sr: "E55 Serija",
            en: "E55 Series"
        },

        "59series": {
            sr: "Serija 59",
            en: "59 Series"
        },

        "47series": {
            sr: "Serija 47",
            en: "47 Series"
        },

        "lightaldox": {
            sr: "Light Aldox",
            en: "Light Aldox"
        },

        "heavyaldox": {
            sr: "Heavy Aldox",
            en: "Heavy Aldox"
        },

        // KLIZNI
        "hs96": {
            sr: "HS96 Podizno-Klizni",
            en: "HS96 Lift & Slide"
        },

        "ths77": {
            sr: "THS 77 Podizno-Klizni",
            en: "THS 77 Lift & Slide"
        },

        "60sliding": {
            sr: "Serija 60 Klizni",
            en: "60 Sliding Series"
        },

        "newsliding": {
            sr: "Serija Novi Klizni",
            en: "New Sliding Series"
        },

        "sliding92": {
            sr: "Serija 92 Klizni",
            en: "92 Sliding Series"
        },

        // FASADE
        "facecap": {
            sr: "Standardna Fasada (Facecap)",
            en: "Standard Curtain Wall (Facecap)"
        },

        "frameless": {
            sr: "Strukturalna Fasada (Bez rama)",
            en: "Structural Curtain Wall (Frameless)"
        },

        "uchennel": {
            sr: "U-Profili",
            en: "U-Channel"
        },

        "rainforce": {
            sr: "Rainforce Sistemi",
            en: "Rainforce Systems"
        },

        // OSTALO
        "verandah": {
            sr: "Zimske Bašte",
            en: "Winter Gardens (Verandah)"
        },

        "rollup": {
            sr: "Roletne i Brisoleji",
            en: "Rolling Shutters"
        },

        "gridesystem": {
            sr: "Mreže i Komarnici",
            en: "Insect Screens"
        },

        "partition": {
            sr: "Pregradni Zidovi",
            en: "Partition Systems"
        },

        "handrail": {
            sr: "Ograde i Rukohvati",
            en: "Handrails"
        },

        "automatic_door": {
            sr: "Automatska Vrata",
            en: "Automatic Doors"
        },

        "pipe_profiles": {
            sr: "Cijevni Profili",
            en: "Pipe Profiles"
        }
    };

    // =====================================================
    // NASLOV SERIJE
    // =====================================================
    if (title) {
        if (seriesNames[fileName]) {
            title.innerText =
                seriesNames[fileName][currentLang] ||
                seriesNames[fileName].en;
        } else {
            title.innerText = seriesParam.toUpperCase();
        }
    }

    // =====================================================
    // UČITAVANJE JSON PODATAKA
    // =====================================================
    fetch(`../data/${fileName}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Fajl nije pronađen");
            }

            return response.json();
        })

        .then(products => {
            let htmlContent = "";

            if (Object.keys(products).length === 0) {
                if (grid) {
                    grid.innerHTML =
                        currentLang === 'sr'
                            ? "<div class='loading-msg'>Nema proizvoda.</div>"
                            : "<div class='loading-msg'>No products found.</div>";
                }

                return;
            }

            Object.entries(products).forEach(([productKey, product]) => {
                const pData =
                    product[currentLang] ||
                    product.en ||
                    product.sr ||
                    {};

                const displayCode = productKey;

                const name =
                    pData.name ||
                    displayCode ||
                    (currentLang === 'sr' ? "Proizvod" : "Product");

                const btnText =
                    currentLang === 'sr'
                        ? "Saznaj Više"
                        : "Read More";

                // SEO ALT
                const listAlt =
                    currentLang === 'sr'
                        ? `${name} kod ${displayCode} - aluminijumski profil`
                        : `${name} code ${displayCode} - aluminium profile`;

                // Odabir odgovarajuće detail stranice
                const detailPage =
                    currentLang === 'en'
                        ? 'product-detail.html'
                        : 'product-detail-sr.html';

                // Šaljemo i SERIJU i KOD
                const detailLink =
                    `${detailPage}?series=${encodeURIComponent(fileName)}&code=${encodeURIComponent(displayCode)}`;

                htmlContent += `
                    <div class="profile-card reveal">

                        <a
                            href="${detailLink}"
                            style="
                                text-decoration:none;
                                color:inherit;
                                display:flex;
                                flex-direction:column;
                                height:100%;
                            "
                        >

                            <div class="card-img-wrapper">
                                <img
                                    src="${product.image}"
                                    alt="${listAlt}"
                                    class="profile-img"
                                    loading="lazy"
                                    onerror="this.src='../assets/images/placeholder.png'"
                                >
                            </div>

                            <div class="card-info">
                                <span class="code-badge">
                                    ${displayCode}
                                </span>

                                <h3 class="profile-name">
                                    ${name}
                                </h3>
                            </div>

                            <div class="read-more-btn">
                                ${btnText}
                                <i
                                    class="fas fa-arrow-right"
                                    style="margin-left:5px;"
                                ></i>
                            </div>

                        </a>

                    </div>
                `;
            });

            if (grid) {
                grid.innerHTML = htmlContent;
            }
        })

        .catch(error => {
            console.error(error);

            const errMsg =
                currentLang === 'sr'
                    ? "Greška pri učitavanju ili nema proizvoda."
                    : "Error loading data.";

            if (grid) {
                grid.innerHTML =
                    `<div class='loading-msg'>${errMsg}</div>`;
            }
        });
});