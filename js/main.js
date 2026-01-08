document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MOBILE NAVIGATION
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Zatvori meni kad se klikne na link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ==========================================
    // 2. HEADER SCROLL EFFECT
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
    // 3. STATS COUNTER ANIMATION (POPRAVLJENO)
    // ==========================================
    const statsSection = document.querySelector('.stats-banner');
    const stats = document.querySelectorAll('.stat-item h3');
    let started = false;

    function startCount(el) {
        const goalText = el.innerText;
        // Izvuci samo brojeve (npr. iz "16,000" pravi 16000)
        const goalNum = parseInt(goalText.replace(/,/g, '').replace(/[^0-9]/g, '')) || 0;
        
        if(goalNum === 0) return;

        let count = 0;
        const duration = 2000; // Animacija traje 2 sekunde za SVE brojeve
        const intervalTime = 20; // Osvežava se svakih 20ms
        
        // Izračunaj koliko treba da skoči u svakom koraku da bi stigao na vreme
        // npr. za 16000 skace po 160, a za 100 skace po 1
        const step = Math.ceil(goalNum / (duration / intervalTime));

        const counter = setInterval(() => {
            count += step;
            
            if (count >= goalNum) {
                count = goalNum; // Da ne prebaci broj
                clearInterval(counter);
            }
            
            // Vrati format (dodaj + ako je bio tu)
            el.innerText = count.toLocaleString() + (goalText.includes('+') ? '+' : ''); 
            
        }, intervalTime);
    }

    window.addEventListener('scroll', () => {
        if (!statsSection) return;
        const sectionPos = statsSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.3;

        if (sectionPos < screenPos && !started) {
            stats.forEach(stat => startCount(stat));
            started = true;
        }
    });

    // ==========================================
    // 4. HERO SLIDER LOGIC
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

        if(nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetTimer();
            });
        }

        if(prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetTimer();
            });
        }

        function startTimer() {
            slideTimer = setInterval(nextSlide, slideInterval);
        }

        function resetTimer() {
            clearInterval(slideTimer);
            startTimer();
        }

        startTimer();
    }
});