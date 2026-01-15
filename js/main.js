document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MOBILE NAVIGATION (HAMBURGER)
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Zatvori meni kad se klikne na obican link (koji nije dropdown)
    document.querySelectorAll('.nav-menu a:not(.dropdown > a)').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ==========================================
    // 2. DROPDOWN MENI ZA MOBILNE (KLIK LOGIKA)
    // ==========================================
    const dropdownLinks = document.querySelectorAll('.dropdown > a');

    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Proveravamo da li je ekran mobilni/tablet (ispod 992px)
            if (window.innerWidth <= 992) {
                e.preventDefault(); // Sprečava odlazak na drugu stranu
                
                // Nađi roditelja (li.dropdown)
                const parent = link.parentElement;
                
                // Zatvori sve ostale otvorene menije da ne bude guzva
                document.querySelectorAll('.dropdown').forEach(item => {
                    if (item !== parent) {
                        item.classList.remove('active');
                    }
                });

                // Otvori ili zatvori trenutni meni
                parent.classList.toggle('active');
            }
        });
    });

    // ==========================================
    // 3. HEADER SCROLL EFFECT
    // ==========================================
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 2px 20px rgba(0,0,0,0.15)";
        } else {
            header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
        }
    });

    // ==========================================
    // 4. STATS COUNTER ANIMATION
    // ==========================================
    const statsSection = document.querySelector('.stats-banner');
    const stats = document.querySelectorAll('.stat-item h3');
    let started = false;

    function startCount(el) {
        const goalText = el.innerText;
        const goalNum = parseInt(goalText.replace(/,/g, '').replace(/[^0-9]/g, '')) || 0;
        
        if(goalNum === 0) return;

        let count = 0;
        const duration = 2000;
        const intervalTime = 20;
        const step = Math.ceil(goalNum / (duration / intervalTime));

        const counter = setInterval(() => {
            count += step;
            if (count >= goalNum) {
                count = goalNum;
                clearInterval(counter);
            }
            el.innerText = count.toLocaleString() + (goalText.includes('+') ? '+' : ''); 
        }, intervalTime);
    }

    if(statsSection) {
        window.addEventListener('scroll', () => {
            const sectionPos = statsSection.getBoundingClientRect().top;
            const screenPos = window.innerHeight / 1.3;
            if (sectionPos < screenPos && !started) {
                stats.forEach(stat => startCount(stat));
                started = true;
            }
        });
    }

    // ==========================================
    // 5. HERO SLIDER LOGIC
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

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        if(nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
        if(prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

        function startTimer() { slideTimer = setInterval(nextSlide, slideInterval); }
        function resetTimer() { clearInterval(slideTimer); startTimer(); }

        startTimer();
    }
});