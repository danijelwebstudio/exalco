document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. REPLAYABLE ANIMACIJE (NON-STOP)
    // ==========================================
    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element je u ekranu -> Pokreni animaciju
                entry.target.classList.add('active');
            } else {
                // Element je izašao iz ekrana -> Resetuj animaciju
                entry.target.classList.remove('active');
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, { threshold: 0.1 });
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    revealElements.forEach(el => revealObserver.observe(el));


    // ==========================================
    // 2. HAMBURGER MENU (MOBILNI)
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // ==========================================
    // 3. DROPDOWN MENI (MOBILNI KLIK - FIX)
    // ==========================================
    const dropdownLinks = document.querySelectorAll('.dropdown > a');
    
    dropdownLinks.forEach(link => {
        // Uklanjamo stare event listenere kloniranjem (trik)
        // Ovo osigurava da nema duplih klikova
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        newLink.addEventListener('click', (e) => {
            // Logika samo za mobilne ekrane
            if (window.innerWidth <= 992) {
                // Ako link ima podmeni (dropdown)
                const parent = newLink.parentElement;
                if (parent.classList.contains('dropdown')) {
                    e.preventDefault(); // Ne idi na link, nego otvori meni
                    
                    // Zatvori sve ostale otvorene menije
                    document.querySelectorAll('.dropdown').forEach(item => {
                        if (item !== parent) item.classList.remove('active');
                    });
                    
                    // Otvori/Zatvori onaj na koji smo kliknuli
                    parent.classList.toggle('active');
                }
            }
        });
    });

    // ==========================================
    // 4. HERO SLIDER
    // ==========================================
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 5000;
        let slideTimer;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            if (index >= slides.length) currentSlide = 0;
            else if (index < 0) currentSlide = slides.length - 1;
            else currentSlide = index;
            slides[currentSlide].classList.add('active');
        }
        function nextSlide() { showSlide(currentSlide + 1); }
        function prevSlide() { showSlide(currentSlide - 1); }

        if(nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
        if(prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

        function startTimer() { slideTimer = setInterval(nextSlide, slideInterval); }
        function resetTimer() { clearInterval(slideTimer); startTimer(); }
        startTimer();
    }

    // ==========================================
    // 5. SEARCH LOGIKA (POPRAVLJENO ZATVARANJE)
    // ==========================================
    const searchBtns = document.querySelectorAll('.header-search i, .search-btn i');
    
    // Provera da li overlay već postoji da ga ne pravimo duplo
    if (searchBtns.length > 0 && !document.querySelector('.search-overlay')) {
        
        // Kreiraj Overlay
        const searchOverlay = document.createElement('div');
        searchOverlay.classList.add('search-overlay');
        searchOverlay.innerHTML = `
            <div class="search-box">
                <span class="close-search">&times;</span>
                <input type="text" id="searchInput" placeholder="Pretraži sajt...">
                <div class="search-results" id="searchResults"></div>
            </div>`;
        document.body.appendChild(searchOverlay);

        const closeSearch = searchOverlay.querySelector('.close-search');
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');

        // Otvaranje
        searchBtns.forEach(btn => {
            btn.addEventListener('click', (e) => { 
                e.preventDefault(); 
                searchOverlay.classList.add('open'); 
                setTimeout(() => searchInput.focus(), 100); // Fokusiraj unos
            });
        });

        // Funkcija za zatvaranje
        function closeSearchFunc() { 
            searchOverlay.classList.remove('open'); // Skloni klasu
            
            // Sačekaj da se završi animacija (0.3s) pa obriši tekst
            setTimeout(() => {
                searchInput.value = ''; 
                searchResults.innerHTML = ''; 
                searchResults.classList.remove('active'); 
            }, 300);
        }

        // Klik na X
        closeSearch.addEventListener('click', closeSearchFunc);

        // Klik na prazno (van box-a) takođe zatvara
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                closeSearchFunc();
            }
        });
        
        // Logika kucanja (Search)
        const siteContent = [
            { title: "Home (Početna)", url: "index.html", keywords: "home pocetna exalco kosar" },
            { title: "O Nama", url: "pages/about-us-sr.html", keywords: "o nama about us fabrika" },
            { title: "Poruka Direktora", url: "pages/ceo-message-sr.html", keywords: "ceo direktor poruka" },
            { title: "Proizvodi", url: "index.html", keywords: "proizvodi products vrata prozori" },
            { title: "Galerija", url: "pages/gallery-sr.html", keywords: "galerija gallery slike" },
            { title: "Kontakt", url: "pages/contact-sr.html", keywords: "kontakt contact telefon" }
        ];

        searchInput.addEventListener('keyup', (e) => {
            const query = e.target.value.toLowerCase().trim();
            searchResults.innerHTML = ''; 
            
            if (query.length > 1) {
                const isPagesFolder = window.location.pathname.includes('/pages/');
                
                const filteredData = siteContent.filter(item => 
                    item.title.toLowerCase().includes(query) || 
                    item.keywords.toLowerCase().includes(query)
                );

                if (filteredData.length > 0) {
                    searchResults.classList.add('active');
                    filteredData.forEach(item => {
                        const resultItem = document.createElement('a');
                        
                        // Fix putanja
                        let finalUrl = item.url;
                        if (isPagesFolder) {
                            if (item.url.startsWith('index.html')) finalUrl = '../' + item.url;
                            else if (item.url.startsWith('pages/')) finalUrl = item.url.replace('pages/', '');
                        } else {
                            if (!item.url.startsWith('index.html') && !item.url.startsWith('pages/')) finalUrl = 'pages/' + item.url;
                        }

                        resultItem.href = finalUrl;
                        resultItem.classList.add('search-item');
                        resultItem.innerHTML = `<h4>${item.title}</h4>`;
                        resultItem.addEventListener('click', closeSearchFunc);
                        searchResults.appendChild(resultItem);
                    });
                } else {
                    searchResults.classList.add('active');
                    searchResults.innerHTML = '<div class="search-item" style="cursor:default;">Nema rezultata</div>';
                }
            } else {
                searchResults.classList.remove('active');
            }
        });
    }

    // ==========================================
    // 6. AUTOMATSKI AKTIVNI LINKOVI (Ovo rešava problem boja)
    // ==========================================
    const currentUrl = window.location.href;
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        // 1. Resetuj sve (skini active klasu sa svih linkova)
        link.classList.remove('active');

        const href = link.getAttribute('href');
        
        // Preskoči prazne linkove
        if (!href || href === '#') return;

        // Izvuci samo ime fajla (npr. 'contact-sr.html')
        // Ovo radi i za '../pages/contact-sr.html' i za 'contact-sr.html'
        const cleanLink = href.split('/').pop(); 

        // Ako trenutni URL sadrži ime ovog linka
        if (cleanLink.length > 1 && currentUrl.includes(cleanLink)) {
            
            // Dodaj active na sam link
            link.classList.add('active');

            // Ako je link unutar Dropdown-a (npr. O Nama), oboji i glavno dugme (Kompanija)
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                const parentLink = parentDropdown.querySelector('a'); 
                if(parentLink) parentLink.classList.add('active');
            }
        }
    });

});