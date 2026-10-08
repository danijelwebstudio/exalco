document.addEventListener("DOMContentLoaded", () => {
    // Provjera jezika stranice
    const currentLang = (document.documentElement.lang || 'sr').toLowerCase().startsWith('en') ? 'en' : 'sr';

    const params = new URLSearchParams(window.location.search);
    const seriesParam = params.get('series');

    const grid = document.getElementById('product-grid');
    const title = document.getElementById('series-title');

    const intro = document.getElementById('series-intro');
    const BASE_URL = 'https://exalcoaluminium.com';

    // =====================================================
    // SEO HELPERS
    // =====================================================
    function setMetaName(name, content) {
        let tag = document.head.querySelector(`meta[name="${name}"]`);

        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('name', name);
            document.head.appendChild(tag);
        }

        tag.setAttribute('content', content);
    }

    function setMetaProperty(property, content) {
        let tag = document.head.querySelector(`meta[property="${property}"]`);

        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('property', property);
            document.head.appendChild(tag);
        }

        tag.setAttribute('content', content);
    }

    function setHeadLink(rel, href, hreflang = null) {
        let selector = `link[rel="${rel}"]`;

        if (hreflang) {
            selector += `[hreflang="${hreflang}"]`;
        } else if (rel === 'canonical') {
            selector += ':not([hreflang])';
        }

        let link = document.head.querySelector(selector);

        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', rel);

            if (hreflang) {
                link.setAttribute('hreflang', hreflang);
            }

            document.head.appendChild(link);
        }

        link.setAttribute('href', href);
    }

    function setFallbackSeo() {
        const isSr = currentLang === 'sr';

        document.title = isSr
            ? 'Aluminijumski sistemi i profili | EXALCO'
            : 'Aluminium Systems & Profiles | EXALCO';

        const description = isSr
            ? 'Pregledajte EXALCO aluminijumske sisteme i dostupne serije profila.'
            : 'Browse EXALCO aluminium systems and available profile series.';

        setMetaName('description', description);
        setMetaName('robots', 'noindex, follow');

        const canonicalUrl = isSr
            ? `${BASE_URL}/pages/products-sr.html`
            : `${BASE_URL}/pages/products.html`;

        setHeadLink('canonical', canonicalUrl);

        setMetaProperty('og:title', document.title);
        setMetaProperty('og:description', description);
        setMetaProperty('og:type', 'website');
        setMetaProperty('og:url', canonicalUrl);

        setMetaName('twitter:card', 'summary');
        setMetaName('twitter:title', document.title);
        setMetaName('twitter:description', description);

        if (intro) {
            intro.textContent = isSr
                ? 'Izaberite sistem ili seriju da biste pregledali dostupne profile.'
                : 'Choose a system or series to browse the available profiles.';
        }
    }


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

        setFallbackSeo();
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
    // DINAMIČKI SEO ZA SVAKU SERIJU
    // =====================================================
    const seriesGroups = {
        hinged: [
            'ex55', 'ex64', 'ex74', 'w55', 'w60', 'w69',
            'th60', 'e55', '59series', '47series',
            'lightaldox', 'heavyaldox'
        ],
        sliding: [
            'hs96', 'ths77', '60sliding', 'newsliding', 'sliding92'
        ],
        facade: [
            'facecap', 'frameless', 'uchennel', 'rainforce'
        ],
        other: [
            'verandah', 'rollup', 'gridesystem', 'partition',
            'handrail', 'automatic_door', 'pipe_profiles'
        ]
    };

    function getSeriesGroup(seriesId) {
        return Object.keys(seriesGroups).find(group =>
            seriesGroups[group].includes(seriesId)
        ) || 'other';
    }

    function applySeriesSeo(seriesId, names) {
        if (!names) {
            setFallbackSeo();
            return;
        }

        const displayName =
            names[currentLang] ||
            names.en ||
            names.sr ||
            seriesId.toUpperCase();

        const isSr = currentLang === 'sr';
        const group = getSeriesGroup(seriesId);

        const titleText = isSr
            ? `${displayName} | Aluminijumski profili | EXALCO`
            : `${displayName} | Aluminium Profiles | EXALCO`;

        let description;

        if (isSr) {
            if (group === 'hinged') {
                description = `Pregledajte ${displayName} u ponudi EXALCO: dostupne aluminijumske profile za okretne sisteme, šifre proizvoda, dimenzije, tehničke crteže i specifikacije.`;
            } else if (group === 'sliding') {
                description = `Pregledajte ${displayName} u ponudi EXALCO: dostupne aluminijumske profile za klizne sisteme, šifre proizvoda, dimenzije, tehničke crteže i specifikacije.`;
            } else if (group === 'facade') {
                description = `Pregledajte ${displayName} u ponudi EXALCO: dostupne aluminijumske profile za fasadne sisteme, šifre proizvoda, dimenzije, tehničke crteže i specifikacije.`;
            } else {
                description = `Pregledajte ${displayName} u ponudi EXALCO: dostupne profile, šifre proizvoda, dimenzije, tehničke crteže i specifikacije.`;
            }
        } else {
            if (group === 'hinged') {
                description = `Explore ${displayName} from EXALCO: available aluminium profiles for hinged systems, product codes, dimensions, technical drawings and specifications.`;
            } else if (group === 'sliding') {
                description = `Explore ${displayName} from EXALCO: available aluminium profiles for sliding systems, product codes, dimensions, technical drawings and specifications.`;
            } else if (group === 'facade') {
                description = `Explore ${displayName} from EXALCO: available aluminium profiles for curtain wall systems, product codes, dimensions, technical drawings and specifications.`;
            } else {
                description = `Explore ${displayName} from EXALCO: available profiles, product codes, dimensions, technical drawings and specifications.`;
            }
        }

        const srUrl =
            `${BASE_URL}/pages/products-list-sr.html?series=${encodeURIComponent(seriesId)}`;

        const enUrl =
            `${BASE_URL}/pages/products-list.html?series=${encodeURIComponent(seriesId)}`;

        const canonicalUrl = isSr ? srUrl : enUrl;

        document.title = titleText;

        setMetaName('description', description);
        setMetaName('robots', 'index, follow');

        setHeadLink('canonical', canonicalUrl);
        setHeadLink('alternate', srUrl, 'sr');
        setHeadLink('alternate', enUrl, 'en');
        setHeadLink('alternate', enUrl, 'x-default');

        setMetaProperty('og:title', titleText);
        setMetaProperty('og:description', description);
        setMetaProperty('og:type', 'website');
        setMetaProperty('og:url', canonicalUrl);

        setMetaName('twitter:card', 'summary');
        setMetaName('twitter:title', titleText);
        setMetaName('twitter:description', description);

        if (intro) {
            intro.textContent = isSr
                ? `Pregledajte dostupne profile za ${displayName}. Otvorite proizvod za šifru, dimenzije, tehnički crtež i dostupne specifikacije.`
                : `Browse the available profiles for ${displayName}. Open a product to view its code, dimensions, technical drawing and available specifications.`;
        }
    }

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

    applySeriesSeo(fileName, seriesNames[fileName]);

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