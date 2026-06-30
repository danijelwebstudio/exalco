document.addEventListener("DOMContentLoaded", () => {
    const currentLang = document.documentElement.lang || 'sr'; 

    const params = new URLSearchParams(window.location.search);
    const series = params.get('series');
    const code = params.get('code');

    const container = document.getElementById('detail-container');
    const backLink = document.getElementById('back-link');

    let listPage = currentLang === 'sr' ? 'products-list-sr.html' : 'products-list.html';
    let mainPage = currentLang === 'sr' ? 'products-sr.html' : 'products.html';

    if(series) {
        backLink.href = `${listPage}?series=${series}`;
    } else {
        backLink.href = mainPage;
    }

    if (!series || !code) {
        container.innerHTML = "<h2>Greška / Error</h2>";
        return;
    }

    fetch(`../data/${series.toLowerCase()}.json`)
        .then(res => res.json())
        .then(data => {
            const product = data[code];

            if (!product) {
                container.innerHTML = currentLang === 'sr' ? "<h2>Proizvod nije pronađen.</h2>" : "<h2>Product not found.</h2>";
                return;
            }

            const pData = product[currentLang] || product.en;
            const details = pData.details || {};

            // --- SEO: DINAMIČKA PROMENA NASLOVA I META TAGOVA ---
            const pageTitle = `${pData.name} ${product.code} | Exalco Aluminijumski Sistemi`;
            document.title = pageTitle;

            let metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute("content", pData.description || `Tehničke specifikacije za ${pData.name} kod ${product.code}.`);
            }

            const updateMeta = (selector, attr, content) => {
                let tag = document.querySelector(selector);
                if (tag) tag.setAttribute(attr, content);
            };
            updateMeta('meta[property="og:title"]', "content", pageTitle);
            updateMeta('meta[property="og:image"]', "content", window.location.origin + "/" + product.image);
            updateMeta('meta[property="og:description"]', "content", pData.description || "");

            // Rečnik za labele
            const labels = {
                dim: currentLang === 'sr' ? "Dimenzije" : "Dimensions",
                brand: currentLang === 'sr' ? "Brend" : "Brand",
                mat: currentLang === 'sr' ? "Materijal" : "Material",
                type: currentLang === 'sr' ? "Tip" : "Type",
                weight: currentLang === 'sr' ? "Težina" : "Weight",
                info: currentLang === 'sr' ? "Tehničke Specifikacije" : "Technical Specifications"
            };

            const row = (k, v) => v && v !== "-" ? `<tr><td class="spec-key">${k}</td><td>${v}</td></tr>` : "";
            const seoAltDetail = `${pData.name} kod ${product.code} - tehnički nacrt i specifikacije`;

            // Kreiramo niz slika za šaltanje (Slider Logic)
            const imagesArray = [product.image];
            if (product.tech_image) {
                imagesArray.push(product.tech_image);
            }

            const html = `
            <div class="detail-left">
                <div class="main-image-container" style="position: relative; display: flex; align-items: center; justify-content: center;">
                    ${imagesArray.length > 1 ? `
                        <button id="prev-pic" style="position: absolute; left: 10px; background: rgba(0,64,133,0.7); color: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; transition: 0.3s;"><i class="fas fa-chevron-left"></i></button>
                    ` : ''}
                    
                    <img src="${product.image}" class="detail-img" id="main-product-img" alt="${seoAltDetail}" style="max-width: 100%; height: auto; transition: opacity 0.3s ease;">
                    
                    ${imagesArray.length > 1 ? `
                        <button id="next-pic" style="position: absolute; right: 10px; background: rgba(0,64,133,0.7); color: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; transition: 0.3s;"><i class="fas fa-chevron-right"></i></button>
                    ` : ''}
                </div>
                
                <div class="gallery-thumbs" style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                    <img src="${product.image}" alt="${pData.name}" class="thumb-item active-thumb" style="width:70px; height:70px; object-fit:contain; cursor:pointer; border:2px solid #004085; padding: 2px;" data-index="0">
                    ${product.tech_image ? `<img src="${product.tech_image}" alt="${pData.name} tech" class="thumb-item" style="width:70px; height:70px; object-fit:contain; cursor:pointer; border:1px solid #ddd; padding: 2px;" data-index="1">` : ''}
                </div>
            </div>

            <div class="detail-right">
                <h1 class="detail-title">${pData.name}</h1>
                <span class="detail-code">Kod: ${product.code}</span>
                <p class="detail-desc">${pData.description || ""}</p>
                
                <div class="section-header">${labels.info}</div>
                <table class="spec-table">
                    <tbody>
                        ${row(labels.dim, details.dimensions)}
                        ${row(labels.brand, details.brand || "Exalco")}
                        ${row(labels.mat, details.material || "Aluminium")}
                        ${row(labels.type, details.type)}
                        ${row(labels.weight, details.weight)}
                    </tbody>
                </table>
            </div>
            `;

            container.innerHTML = html;

            // --- LOGIKA ZA NATIVE SLIDER I THUMBNAILS ---
            if (imagesArray.length > 1) {
                let currentIndex = 0;
                const mainImg = document.getElementById('main-product-img');
                const thumbs = document.querySelectorAll('.thumb-item');
                const prevBtn = document.getElementById('prev-pic');
                const nextBtn = document.getElementById('next-pic');

                function updateGallery(index) {
                    currentIndex = index;
                    // Efekat blagog prelaza slike
                    mainImg.style.opacity = '0.3';
                    setTimeout(() => {
                        mainImg.src = imagesArray[currentIndex];
                        mainImg.style.opacity = '1';
                    }, 150);

                    // Ažuriranje aktivne sličice (okvira)
                    thumbs.forEach((thumb, i) => {
                        if (i === currentIndex) {
                            thumb.style.border = '2px solid #004085';
                        } else {
                            thumb.style.border = '1px solid #ddd';
                        }
                    });
                }

                // Klik na strelice
                prevBtn.addEventListener('click', () => {
                    let index = currentIndex === 0 ? imagesArray.length - 1 : currentIndex - 1;
                    updateGallery(index);
                });

                nextBtn.addEventListener('click', () => {
                    let index = currentIndex === imagesArray.length - 1 ? 0 : currentIndex + 1;
                    updateGallery(index);
                });

                // Klik na sličice (thumbnails)
                thumbs.forEach(thumb => {
                    thumb.addEventListener('click', (e) => {
                        const index = parseInt(e.target.getAttribute('data-index'));
                        updateGallery(index);
                    });
                });

                // Hover efekat za dugmiće
                [prevBtn, nextBtn].forEach(btn => {
                    btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(0,64,133,1)');
                    btn.addEventListener('mouseleave', () => btn.style.background = 'rgba(0,64,133,0.7)');
                });
            }

        })
        .catch(err => {
            console.error(err);
            container.innerHTML = "<h2>Error loading data.</h2>";
        });
});