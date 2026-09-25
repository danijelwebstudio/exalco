document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. REPLAYABLE ANIMACIJE
    // =========================================================
    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    };

    const revealObserver = new IntersectionObserver(
        revealCallback,
        { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right'
    );

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });


    // =========================================================
    // 2. HAMBURGER MENU
    // =========================================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }


    // =========================================================
    // 3. DROPDOWN MENI NA MOBILNOM
    // =========================================================
    const dropdownLinks = document.querySelectorAll('.dropdown > a');

    dropdownLinks.forEach(link => {
        const newLink = link.cloneNode(true);

        link.parentNode.replaceChild(newLink, link);

        newLink.addEventListener('click', (e) => {

            if (window.innerWidth <= 992) {

                const parent = newLink.parentElement;

                if (parent.classList.contains('dropdown')) {

                    e.preventDefault();

                    document.querySelectorAll('.dropdown')
                        .forEach(item => {
                            if (item !== parent) {
                                item.classList.remove('active');
                            }
                        });

                    parent.classList.toggle('active');
                }
            }
        });
    });


    // =========================================================
    // 4. HERO SLIDER
    // =========================================================
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (slides.length > 0) {

        let currentSlide = 0;
        const slideInterval = 5000;
        let slideTimer;

        function showSlide(index) {

            slides.forEach(slide => {
                slide.classList.remove('active');
            });

            if (index >= slides.length) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = index;
            }

            slides[currentSlide].classList.add('active');
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        function startTimer() {
            slideTimer = setInterval(
                nextSlide,
                slideInterval
            );
        }

        function resetTimer() {
            clearInterval(slideTimer);
            startTimer();
        }

        if (nextBtn) {
            nextBtn.addEventListener(
                'click',
                () => {
                    nextSlide();
                    resetTimer();
                }
            );
        }

        if (prevBtn) {
            prevBtn.addEventListener(
                'click',
                () => {
                    prevSlide();
                    resetTimer();
                }
            );
        }

        startTimer();
    }


    // =========================================================
    // 5. NOVA GLOBALNA PRETRAGA
    // =========================================================

    const searchBtns = document.querySelectorAll(
        '.header-search i, .search-btn i'
    );

    if (
        searchBtns.length > 0 &&
        !document.querySelector('.search-overlay')
    ) {

        // -----------------------------------------------------
        // JEZIK
        // -----------------------------------------------------
        const currentLang =
            (document.documentElement.lang || 'sr')
                .toLowerCase()
                .startsWith('en')
                ? 'en'
                : 'sr';

        const isEnglish = currentLang === 'en';


        // -----------------------------------------------------
        // PUTANJE
        // -----------------------------------------------------
        const isPagesFolder =
            window.location.pathname.includes('/pages/');

        function sitePath(path) {
            return isPagesFolder
                ? `../${path}`
                : path;
        }


        // -----------------------------------------------------
        // NORMALIZACIJA PRETRAGE
        //
        // Omogućava:
        // mreže -> mreze
        // č -> c
        // š -> s
        // ž -> z
        // đ -> dj
        // -----------------------------------------------------
        function normalizeText(value = '') {

            return String(value)
                .toLowerCase()
                .replace(/đ/g, 'dj')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, ' ')
                .trim();
        }


        // =====================================================
        // KATEGORIJE - OVO IMA NAJVEĆI PRIORITET
        // =====================================================
        const categories = [

            {
                id: 'hinged',
                sr: 'Okretni Sistemi',
                en: 'Hinged Systems',
                keywords: `
                    okretni sistemi
                    okretni sistem
                    vrata
                    prozori
                    prozor
                    vrata prozori
                    hinge
                    hinged
                    hinged systems
                    thermal break
                    cold profile
                    termicki prekid
                    hladni profil
                `,
                url: null,
                catalogOnly: true
            },

            {
                id: 'sliding',
                sr: 'Klizni Sistemi',
                en: 'Sliding Systems',
                keywords: `
                    klizni sistemi
                    klizni sistem
                    klizna vrata
                    klizni prozori
                    sliding
                    sliding systems
                    lift slide
                    podizno klizni
                `,
                url: null,
                catalogOnly: true
            },

            {
                id: 'facade',
                sr: 'Fasadni Sistemi',
                en: 'Curtain Wall Systems',
                keywords: `
                    fasadni sistemi
                    fasada
                    fasade
                    fasadni
                    curtain wall
                    curtain wall systems
                    staklena fasada
                    staklene fasade
                    facecap
                    frameless
                    u channel
                    rainforce
                `,
                url: null,
                catalogOnly: true
            },

            {
                id: 'verandah',
                sr: 'Zimske Bašte',
                en: 'Winter Gardens',
                keywords: `
                    zimske baste
                    zimska basta
                    zimski vrt
                    zimski vrtovi
                    verandah
                    veranda
                    winter garden
                    winter gardens
                `,
                series: 'verandah'
            },

            {
                id: 'rollup',
                sr: 'Roletne i Brisoleji',
                en: 'Rolling Shutters',
                keywords: `
                    roletne
                    roletna
                    brisoleji
                    brisolej
                    roletne i brisoleji
                    rolling shutters
                    shutter
                    shutters
                    roll up
                    rollup
                `,
                series: 'rollup'
            },

            {
                id: 'gridesystem',
                sr: 'Mreže i Komarnici',
                en: 'Insect Screens',
                keywords: `
                    mreze
                    mreza
                    komarnici
                    komarnik
                    mreze i komarnici
                    insect screen
                    insect screens
                    mosquito
                    mosquito screen
                    gride
                    gridesystem
                `,
                series: 'gridesystem'
            },

            {
                id: 'partition',
                sr: 'Pregradni Zidovi',
                en: 'Partition Systems',
                keywords: `
                    pregradni zidovi
                    pregradni zid
                    pregrade
                    pregradni sistemi
                    partition
                    partition systems
                    office partition
                    kancelarija
                `,
                series: 'partition'
            },

            {
                id: 'handrail',
                sr: 'Ograde i Rukohvati',
                en: 'Railings & Handrails',
                keywords: `
                    ograde
                    ograda
                    rukohvati
                    rukohvat
                    ograde i rukohvati
                    railing
                    railings
                    handrail
                    handrails
                    balkon
                    balkonska ograda
                `,
                series: 'handrail'
            },

            {
                id: 'automatic_door',
                sr: 'Automatska Vrata',
                en: 'Automatic Doors',
                keywords: `
                    automatska vrata
                    automatsko otvaranje
                    automatic door
                    automatic doors
                    automatic
                    vrata
                `,
                series: 'automatic_door'
            },

            {
                id: 'pipe_profiles',
                sr: 'Cijevni Profili',
                en: 'Pipe Profiles',
                keywords: `
                    cijevni profili
                    cijev
                    cijevi
                    cevni profili
                    cev
                    cevi
                    cjevni profili
                    tube
                    tubes
                    pipe
                    pipes
                    pipe profiles
                `,
                series: 'pipe_profiles'
            },

            {
                id: 'ceramic',
                sr: 'Profili za Keramiku',
                en: 'Ceramics Profiles',
                keywords: `
                    keramika
                    keramicki
                    keramički
                    keramicki profili
                    profili za keramiku
                    ceramic
                    ceramics
                    ceramic profiles
                `,
                comingSoon: true
            }
        ];


        // =====================================================
        // SVE SERIJE
        // =====================================================
        const seriesCatalog = [

            // OKRETNI SISTEMI
            {
                id: 'ex55',
                sr: 'EX55 Serija',
                en: 'EX55 Series',
                categorySr: 'Okretni Sistemi',
                categoryEn: 'Hinged Systems'
            },

            {
                id: 'ex64',
                sr: 'EX64 Serija',
                en: 'EX64 Series',
                categorySr: 'Okretni Sistemi',
                categoryEn: 'Hinged Systems'
            },

            {
                id: 'ex74',
                sr: 'EX74 Serija',
                en: 'EX74 Series',
                categorySr: 'Okretni Sistemi',
                categoryEn: 'Hinged Systems'
            },

            {
                id: 'w55',
                sr: 'W55 Serija',
                en: 'W55 Series',
                categorySr: 'Okretni Sistemi',
                categoryEn: 'Hinged Systems'
            },

            {
                id: 'w60',
                sr: 'W60 Serija',
                en: 'W60 Series',
                categorySr: 'Okretni Sistemi',
                categoryEn: 'Hinged Systems'
            },

            {
                id: 'w69',
                sr: 'W69 Serija',
                en: 'W69 Series',
                categorySr: 'Okretni Sistemi',
                categoryEn: 'Hinged Systems'
            },

            {
                id: 'th60',
                sr: 'TH60 Serija',
                en: 'TH60 Series',
                categorySr: 'Okretni Sistemi',
                categoryEn: 'Hinged Systems'
            },

            {
                id: 'e55',
                sr: 'E55 Serija',
                en: 'E55 Series',
                categorySr: 'Okretni Sistemi',
                categoryEn: 'Hinged Systems'
            },

            {
                id: '59series',
                sr: 'Serija 59',
                en: '59 Series',
                categorySr: 'Okretni Sistemi',
                categoryEn: 'Hinged Systems'
            },

            {
                id: '47series',
                sr: 'Serija 47',
                en: '47 Series',
                categorySr: 'Okretni Sistemi',
                categoryEn: 'Hinged Systems'
            },

            {
                id: 'lightaldox',
                sr: 'Light Aldox',
                en: 'Light Aldox',
                categorySr: 'Okretni Sistemi',
                categoryEn: 'Hinged Systems'
            },

            {
                id: 'heavyaldox',
                sr: 'Heavy Aldox',
                en: 'Heavy Aldox',
                categorySr: 'Okretni Sistemi',
                categoryEn: 'Hinged Systems'
            },


            // KLIZNI SISTEMI
            {
                id: 'hs96',
                sr: 'HS96 Podizno-Klizni',
                en: 'HS96 Lift & Slide',
                categorySr: 'Klizni Sistemi',
                categoryEn: 'Sliding Systems'
            },

            {
                id: 'ths77',
                sr: 'THS 77 Podizno-Klizni',
                en: 'THS 77 Lift & Slide',
                categorySr: 'Klizni Sistemi',
                categoryEn: 'Sliding Systems'
            },

            {
                id: '60sliding',
                sr: 'Serija 60 Klizni',
                en: '60 Sliding Series',
                categorySr: 'Klizni Sistemi',
                categoryEn: 'Sliding Systems'
            },

            {
                id: 'newsliding',
                sr: 'Serija Novi Klizni',
                en: 'New Sliding Series',
                categorySr: 'Klizni Sistemi',
                categoryEn: 'Sliding Systems'
            },

            {
                id: 'sliding92',
                sr: 'Serija 92 Klizni',
                en: '92 Sliding Series',
                categorySr: 'Klizni Sistemi',
                categoryEn: 'Sliding Systems'
            },


            // FASADE
            {
                id: 'facecap',
                sr: 'Standardna Fasada (Facecap)',
                en: 'Standard Curtain Wall (Facecap)',
                categorySr: 'Fasadni Sistemi',
                categoryEn: 'Curtain Wall Systems'
            },

            {
                id: 'frameless',
                sr: 'Strukturalna Fasada (Bez rama)',
                en: 'Structural Curtain Wall (Frameless)',
                categorySr: 'Fasadni Sistemi',
                categoryEn: 'Curtain Wall Systems'
            },

            {
                id: 'uchennel',
                sr: 'U-Profili',
                en: 'U-Channel',
                categorySr: 'Fasadni Sistemi',
                categoryEn: 'Curtain Wall Systems'
            },

            {
                id: 'rainforce',
                sr: 'Rainforce Sistemi',
                en: 'Rainforce Systems',
                categorySr: 'Fasadni Sistemi',
                categoryEn: 'Curtain Wall Systems'
            },


            // OSTALI SISTEMI
            {
                id: 'verandah',
                sr: 'Zimske Bašte',
                en: 'Winter Gardens',
                categorySr: 'Ostali Sistemi',
                categoryEn: 'Other Systems'
            },

            {
                id: 'rollup',
                sr: 'Roletne i Brisoleji',
                en: 'Rolling Shutters',
                categorySr: 'Ostali Sistemi',
                categoryEn: 'Other Systems'
            },

            {
                id: 'gridesystem',
                sr: 'Mreže i Komarnici',
                en: 'Insect Screens',
                categorySr: 'Ostali Sistemi',
                categoryEn: 'Other Systems'
            },

            {
                id: 'partition',
                sr: 'Pregradni Zidovi',
                en: 'Partition Systems',
                categorySr: 'Ostali Sistemi',
                categoryEn: 'Other Systems'
            },

            {
                id: 'handrail',
                sr: 'Ograde i Rukohvati',
                en: 'Railings & Handrails',
                categorySr: 'Ostali Sistemi',
                categoryEn: 'Other Systems'
            },

            {
                id: 'automatic_door',
                sr: 'Automatska Vrata',
                en: 'Automatic Doors',
                categorySr: 'Ostali Sistemi',
                categoryEn: 'Other Systems'
            },

            {
                id: 'pipe_profiles',
                sr: 'Cijevni Profili',
                en: 'Pipe Profiles',
                categorySr: 'Ostali Sistemi',
                categoryEn: 'Other Systems'
            }
        ];


        // =====================================================
        // OSTALE STRANICE SAJTA
        // =====================================================
        const sitePages = [

            {
                sr: 'Početna',
                en: 'Home',
                srUrl: 'index.html',
                enUrl: 'index-en.html',
                keywords: 'pocetna home exalco'
            },

            {
                sr: 'Proizvodi',
                en: 'Products',
                srUrl: 'pages/products-sr.html',
                enUrl: 'pages/products.html',
                keywords: `
                    proizvodi
                    products
                    katalog
                    catalog
                    aluminijumski profili
                    aluminum profiles
                `
            },

            {
                sr: 'O Nama',
                en: 'About Us',
                srUrl: 'pages/about-us-sr.html',
                enUrl: 'pages/about-us.html',
                keywords: `
                    o nama
                    about us
                    kompanija
                    company
                    fabrika
                    factory
                    exalco
                `
            },

            {
                sr: 'Poruka Direktora',
                en: 'CEO Message',
                srUrl: 'pages/ceo-message-sr.html',
                enUrl: 'pages/ceo-message.html',
                keywords: `
                    direktor
                    poruka direktora
                    ceo
                    ceo message
                    uprava
                    management
                `
            },

            {
                sr: 'Galerija',
                en: 'Gallery',
                srUrl: 'pages/gallery-sr.html',
                enUrl: 'pages/gallery.html',
                keywords: `
                    galerija
                    gallery
                    fotografije
                    slike
                    photos
                    images
                    fabrika
                `
            },

            {
                sr: 'Kontakt',
                en: 'Contact',
                srUrl: 'pages/contact-sr.html',
                enUrl: 'pages/contact.html',
                keywords: `
                    kontakt
                    contact
                    telefon
                    phone
                    email
                    adresa
                    address
                    lokacija
                    location
                `
            },

            {
                sr: 'Privatnost i kolačići',
                en: 'Privacy & Cookies',
                srUrl: 'pages/privacy-sr.html',
                enUrl: 'pages/privacy.html',
                keywords: `
                    privatnost
                    privacy
                    kolacici
                    cookies
                    cookie
                    google analytics
                    analitika
                `
            }
        ];


        // =====================================================
        // SEARCH OVERLAY
        // =====================================================
        const searchOverlay =
            document.createElement('div');

        searchOverlay.classList.add(
            'search-overlay'
        );

        searchOverlay.innerHTML = `
            <div class="search-box">

                <span
                    class="close-search"
                    aria-label="${
                        isEnglish
                            ? 'Close search'
                            : 'Zatvori pretragu'
                    }"
                >
                    &times;
                </span>

                <input
                    type="text"
                    id="searchInput"
                    autocomplete="off"
                    placeholder="${
                        isEnglish
                            ? 'Search systems, series, products or codes...'
                            : 'Pretraži sisteme, serije, proizvode ili šifre...'
                    }"
                >

                <div
                    class="search-results"
                    id="searchResults"
                ></div>

            </div>
        `;

        document.body.appendChild(
            searchOverlay
        );


        const closeSearch =
            searchOverlay.querySelector(
                '.close-search'
            );

        const searchInput =
            searchOverlay.querySelector(
                '#searchInput'
            );

        const searchResults =
            searchOverlay.querySelector(
                '#searchResults'
            );


        // =====================================================
        // INDEKS SVIH PROIZVODA
        // =====================================================
        let productSearchIndex = [];

        let catalogLoaded = false;
        let catalogLoading = false;


        async function loadProductCatalog() {

            if (
                catalogLoaded ||
                catalogLoading
            ) {
                return;
            }

            catalogLoading = true;

            const requests =
                seriesCatalog.map(
                    async seriesInfo => {

                        try {

                            const response =
                                await fetch(
                                    sitePath(
                                        `data/${seriesInfo.id}.json`
                                    )
                                );

                            if (!response.ok) {
                                return [];
                            }

                            const data =
                                await response.json();


                            return Object.entries(data)
                                .map(
                                    (
                                        [productKey, product]
                                    ) => {

                                        const srData =
                                            product.sr || {};

                                        const enData =
                                            product.en || {};

                                        return {
                                            type: 'product',

                                            series:
                                                seriesInfo.id,

                                            seriesSr:
                                                seriesInfo.sr,

                                            seriesEn:
                                                seriesInfo.en,

                                            key:
                                                productKey,

                                            code:
                                                productKey,

                                            srName:
                                                srData.name || '',

                                            enName:
                                                enData.name || '',

                                            srDescription:
                                                srData.description || '',

                                            enDescription:
                                                enData.description || ''
                                        };
                                    }
                                );

                        } catch (error) {

                            console.warn(
                                `Search: nije moguće učitati ${seriesInfo.id}.json`,
                                error
                            );

                            return [];
                        }
                    }
                );


            const results =
                await Promise.all(requests);


            productSearchIndex =
                results.flat();


            catalogLoaded = true;
            catalogLoading = false;


            // Ako je korisnik već nešto ukucao
            // ponovo prikaži rezultate kada se katalog učita.
            if (
                normalizeText(
                    searchInput.value
                ).length >= 2
            ) {
                renderSearchResults();
            }
        }


        // =====================================================
        // SCORING / PRIORITET
        // =====================================================
        function calculateScore(
            query,
            title,
            keywords = '',
            exactCode = ''
        ) {

            const normalizedTitle =
                normalizeText(title);

            const normalizedKeywords =
                normalizeText(keywords);

            const normalizedCode =
                normalizeText(exactCode);


            let score = 0;


            // Kod proizvoda
            if (
                normalizedCode &&
                normalizedCode === query
            ) {
                score += 1500;
            }

            if (
                normalizedCode &&
                normalizedCode.startsWith(query)
            ) {
                score += 900;
            }


            // Naziv
            if (normalizedTitle === query) {
                score += 1200;
            }

            if (
                normalizedTitle.startsWith(query)
            ) {
                score += 800;
            }

            if (
                normalizedTitle.includes(query)
            ) {
                score += 600;
            }


            // Keywordi
            if (
                normalizedKeywords.includes(query)
            ) {
                score += 300;
            }


            // Svaka riječ iz upita
            const queryWords =
                query
                    .split(' ')
                    .filter(Boolean);

            queryWords.forEach(word => {

                if (
                    normalizedTitle.includes(word)
                ) {
                    score += 80;
                }

                if (
                    normalizedKeywords.includes(word)
                ) {
                    score += 30;
                }
            });


            return score;
        }


        // =====================================================
        // KREIRANJE REZULTATA
        // =====================================================
        function buildSearchResults(query) {

            const results = [];


            // -------------------------------------------------
            // 1. KATEGORIJE
            // NAJVEĆI PRIORITET
            // -------------------------------------------------
            categories.forEach(category => {

                const title =
                    isEnglish
                        ? category.en
                        : category.sr;

                const searchable = `
                    ${category.sr}
                    ${category.en}
                    ${category.keywords || ''}
                    ${category.id}
                `;

                let score =
                    calculateScore(
                        query,
                        title,
                        searchable
                    );


                if (score > 0) {

                    // Kategorije imaju veliki bonus
                    score += 500;


                    let url = null;

                    if (
                        category.series
                    ) {

                        const listPage =
                            isEnglish
                                ? 'pages/products-list.html'
                                : 'pages/products-list-sr.html';

                        url =
                            sitePath(
                                `${listPage}?series=${encodeURIComponent(category.series)}`
                            );

                    } else if (
                        category.catalogOnly
                    ) {

                        url =
                            sitePath(
                                isEnglish
                                    ? 'pages/products.html'
                                    : 'pages/products-sr.html'
                            );
                    }


                    results.push({
                        type: 'category',

                        title,

                        subtitle:
                            isEnglish
                                ? 'Product system'
                                : 'Sistem proizvoda',

                        url,

                        comingSoon:
                            !!category.comingSoon,

                        score
                    });
                }
            });


            // -------------------------------------------------
            // 2. SERIJE
            // -------------------------------------------------
            seriesCatalog.forEach(series => {

                const title =
                    isEnglish
                        ? series.en
                        : series.sr;

                const category =
                    isEnglish
                        ? series.categoryEn
                        : series.categorySr;

                const searchable = `
                    ${series.id}
                    ${series.sr}
                    ${series.en}
                    ${series.categorySr}
                    ${series.categoryEn}
                    serija
                    series
                `;

                let score =
                    calculateScore(
                        query,
                        title,
                        searchable,
                        series.id
                    );


                if (score > 0) {

                    score += 300;

                    const listPage =
                        isEnglish
                            ? 'pages/products-list.html'
                            : 'pages/products-list-sr.html';


                    results.push({

                        type: 'series',

                        title,

                        subtitle: category,

                        url:
                            sitePath(
                                `${listPage}?series=${encodeURIComponent(series.id)}`
                            ),

                        score
                    });
                }
            });


            // -------------------------------------------------
            // 3. PROIZVODI
            // -------------------------------------------------
            productSearchIndex.forEach(product => {

                const title =
                    isEnglish
                        ? (
                            product.enName ||
                            product.srName
                        )
                        : (
                            product.srName ||
                            product.enName
                        );


                const seriesTitle =
                    isEnglish
                        ? product.seriesEn
                        : product.seriesSr;


                const searchable = `
                    ${product.code}
                    ${product.key}
                    ${product.srName}
                    ${product.enName}
                    ${product.srDescription}
                    ${product.enDescription}
                    ${product.series}
                    ${product.seriesSr}
                    ${product.seriesEn}
                `;


                let score =
                    calculateScore(
                        query,
                        title,
                        searchable,
                        product.code
                    );


                if (score > 0) {

                    score += 100;


                    const detailPage =
                        isEnglish
                            ? 'pages/product-detail.html'
                            : 'pages/product-detail-sr.html';


                    results.push({

                        type: 'product',

                        title,

                        subtitle:
                            `${product.code} · ${seriesTitle}`,

                        url:
                            sitePath(
                                `${detailPage}?series=${encodeURIComponent(product.series)}&code=${encodeURIComponent(product.key)}`
                            ),

                        score
                    });
                }
            });


            // -------------------------------------------------
            // 4. OSTALE STRANICE
            // -------------------------------------------------
            sitePages.forEach(page => {

                const title =
                    isEnglish
                        ? page.en
                        : page.sr;


                const searchable = `
                    ${page.sr}
                    ${page.en}
                    ${page.keywords}
                `;


                let score =
                    calculateScore(
                        query,
                        title,
                        searchable
                    );


                if (score > 0) {

                    const url =
                        sitePath(
                            isEnglish
                                ? page.enUrl
                                : page.srUrl
                        );


                    results.push({

                        type: 'page',

                        title,

                        subtitle:
                            isEnglish
                                ? 'Website page'
                                : 'Stranica sajta',

                        url,

                        score
                    });
                }
            });


            // -------------------------------------------------
            // SORTIRANJE
            // -------------------------------------------------
            results.sort(
                (a, b) =>
                    b.score - a.score
            );


            // Uklanjamo duplikate (npr. ista stavka kao SISTEM i SERIJA)
            const seenResults = new Set();

            const uniqueResults = results.filter(result => {
                const uniqueKey =
                    `${result.url || 'no-url'}|${normalizeText(result.title)}|${result.comingSoon ? 'coming-soon' : ''}`;

                if (seenResults.has(uniqueKey)) {
                    return false;
                }

                seenResults.add(uniqueKey);
                return true;
            });

            // Maksimalno 18 rezultata
            return uniqueResults.slice(0, 18);
        }


        // =====================================================
        // TIP REZULTATA
        // =====================================================
        function resultTypeLabel(type) {

            if (isEnglish) {

                switch (type) {

                    case 'category':
                        return 'SYSTEM';

                    case 'series':
                        return 'SERIES';

                    case 'product':
                        return 'PRODUCT';

                    case 'page':
                        return 'PAGE';

                    default:
                        return '';
                }

            } else {

                switch (type) {

                    case 'category':
                        return 'SISTEM';

                    case 'series':
                        return 'SERIJA';

                    case 'product':
                        return 'PROIZVOD';

                    case 'page':
                        return 'STRANICA';

                    default:
                        return '';
                }
            }
        }


        // =====================================================
        // RENDER PRETRAGE
        // =====================================================
        function renderSearchResults() {

            const query =
                normalizeText(
                    searchInput.value
                );


            searchResults.innerHTML = '';


            if (query.length < 2) {

                searchResults.classList.remove(
                    'active'
                );

                return;
            }


            const results =
                buildSearchResults(query);


            searchResults.classList.add(
                'active'
            );


            if (results.length === 0) {

                if (
                    !catalogLoaded &&
                    catalogLoading
                ) {

                    searchResults.innerHTML = `
                        <div
                            class="search-item"
                            style="
                                cursor:default;
                                opacity:0.75;
                            "
                        >
                            ${
                                isEnglish
                                    ? 'Loading product catalog...'
                                    : 'Učitavam katalog proizvoda...'
                            }
                        </div>
                    `;

                } else {

                    searchResults.innerHTML = `
                        <div
                            class="search-item"
                            style="
                                cursor:default;
                            "
                        >
                            ${
                                isEnglish
                                    ? 'No results found.'
                                    : 'Nema rezultata.'
                            }
                        </div>
                    `;
                }

                return;
            }


            results.forEach(result => {

                let resultItem;


                // Coming Soon nema link
                if (
                    result.comingSoon
                ) {

                    resultItem =
                        document.createElement(
                            'div'
                        );

                    resultItem.style.cursor =
                        'default';

                    resultItem.style.opacity =
                        '0.75';

                } else {

                    resultItem =
                        document.createElement(
                            'a'
                        );

                    resultItem.href =
                        result.url;

                    resultItem.addEventListener(
                        'click',
                        closeSearchFunc
                    );
                }


                resultItem.classList.add(
                    'search-item'
                );


                resultItem.innerHTML = `
                    <div
                        style="
                            display:flex;
                            align-items:center;
                            justify-content:space-between;
                            gap:15px;
                            width:100%;
                        "
                    >

                        <div
                            style="
                                min-width:0;
                                flex:1;
                            "
                        >

                            <span
                                style="
                                    display:block;
                                    font-size:10px;
                                    line-height:1.2;
                                    letter-spacing:1.2px;
                                    font-weight:700;
                                    color:#777;
                                    margin-bottom:4px;
                                "
                            >
                                ${resultTypeLabel(result.type)}
                            </span>

                            <h4
                                style="
                                    margin:0;
                                    line-height:1.3;
                                "
                            >
                                ${result.title}
                            </h4>

                            ${
                                result.subtitle
                                    ? `
                                        <span
                                            style="
                                                display:block;
                                                margin-top:3px;
                                                font-size:12px;
                                                color:#777;
                                            "
                                        >
                                            ${result.subtitle}
                                        </span>
                                    `
                                    : ''
                            }

                        </div>


                        ${
                            result.comingSoon
                                ? `
                                    <span
                                        style="
                                            font-size:11px;
                                            color:#999;
                                            white-space:nowrap;
                                        "
                                    >
                                        ${
                                            isEnglish
                                                ? 'Coming Soon'
                                                : 'Uskoro'
                                        }
                                    </span>
                                `
                                : `
                                    <i
                                        class="fas fa-arrow-right"
                                        style="
                                            font-size:12px;
                                            flex-shrink:0;
                                        "
                                    ></i>
                                `
                        }

                    </div>
                `;


                searchResults.appendChild(
                    resultItem
                );
            });
        }


        // =====================================================
        // OTVARANJE SEARCHA
        // =====================================================
        searchBtns.forEach(btn => {

            btn.addEventListener(
                'click',
                (e) => {

                    e.preventDefault();

                    searchOverlay.classList.add(
                        'open'
                    );

                    // Katalog učitavamo tek kada
                    // korisnik prvi put otvori search.
                    loadProductCatalog();


                    setTimeout(
                        () => {
                            searchInput.focus();
                        },
                        100
                    );
                }
            );
        });


        // =====================================================
        // ZATVARANJE
        // =====================================================
        function closeSearchFunc() {

            searchOverlay.classList.remove(
                'open'
            );


            setTimeout(
                () => {

                    searchInput.value = '';

                    searchResults.innerHTML = '';

                    searchResults.classList.remove(
                        'active'
                    );

                },
                300
            );
        }


        closeSearch.addEventListener(
            'click',
            closeSearchFunc
        );


        // Klik van search boxa
        searchOverlay.addEventListener(
            'click',
            (e) => {

                if (
                    e.target === searchOverlay
                ) {
                    closeSearchFunc();
                }
            }
        );


        // ESC zatvara search
        document.addEventListener(
            'keydown',
            (e) => {

                if (
                    e.key === 'Escape' &&
                    searchOverlay.classList.contains(
                        'open'
                    )
                ) {
                    closeSearchFunc();
                }
            }
        );


        // =====================================================
        // KUCANJE
        // =====================================================
        searchInput.addEventListener(
            'input',
            () => {

                // Ako nekako još nije učitan katalog,
                // pokreni ga.
                loadProductCatalog();

                renderSearchResults();
            }
        );


        // =====================================================
        // ENTER OTVARA PRVI REZULTAT
        // =====================================================
        searchInput.addEventListener(
            'keydown',
            (e) => {

                if (e.key !== 'Enter') {
                    return;
                }

                const firstResult =
                    searchResults.querySelector(
                        'a.search-item'
                    );

                if (firstResult) {
                    window.location.href =
                        firstResult.href;
                }
            }
        );
    }


    // =========================================================
    // 6. AUTOMATSKI AKTIVNI LINKOVI
    // =========================================================
    const currentUrl =
        window.location.href;

    const navLinks =
        document.querySelectorAll(
            '.nav-menu a'
        );


    navLinks.forEach(link => {

        link.classList.remove(
            'active'
        );


        const href =
            link.getAttribute(
                'href'
            );


        if (
            !href ||
            href === '#'
        ) {
            return;
        }


        const cleanLink =
            href
                .split('?')[0]
                .split('/')
                .pop();


        if (
            cleanLink.length > 1 &&
            currentUrl.includes(cleanLink)
        ) {

            link.classList.add(
                'active'
            );


            const parentDropdown =
                link.closest(
                    '.dropdown'
                );


            if (parentDropdown) {

                const parentLink =
                    parentDropdown.querySelector(
                        'a'
                    );

                if (parentLink) {
                    parentLink.classList.add(
                        'active'
                    );
                }
            }
        }
    });

});