document.addEventListener("DOMContentLoaded", () => {
    const currentLang = (document.documentElement.lang || 'sr').toLowerCase().startsWith('en') ? 'en' : 'sr';

    const params = new URLSearchParams(window.location.search);

    const series = params.get('series');
    const code = params.get('code');

    const container =
        document.getElementById('detail-container');

    const backLink =
        document.getElementById('back-link');

    // =====================================================
    // PROMJENA JEZIKA - ZADRŽAVA ISTI PROIZVOD
    // =====================================================
    const srLangLink = document.querySelector(
        '.lang-search a[href^="product-detail-sr.html"]'
    );

    const enLangLink = document.querySelector(
        '.lang-search a[href^="product-detail.html"]'
    );

    if (series && code) {
        const query =
            `?series=${encodeURIComponent(series)}&code=${encodeURIComponent(code)}`;

        if (srLangLink) {
            srLangLink.href =
                `product-detail-sr.html${query}`;
        }

        if (enLangLink) {
            enLangLink.href =
                `product-detail.html${query}`;
        }
    }

    // =====================================================
    // BACK LINK
    // =====================================================
    const listPage =
        currentLang === 'sr'
            ? 'products-list-sr.html'
            : 'products-list.html';

    const mainPage =
        currentLang === 'sr'
            ? 'products-sr.html'
            : 'products.html';

    if (backLink) {
        if (series) {
            backLink.href =
                `${listPage}?series=${encodeURIComponent(series)}`;
        } else {
            backLink.href = mainPage;
        }
    }

    // =====================================================
    // PROVJERA PARAMETARA
    // =====================================================
    if (!series || !code) {
        if (container) {
            container.innerHTML =
                currentLang === 'sr'
                    ? "<h2>Proizvod nije pronađen.</h2>"
                    : "<h2>Product not found.</h2>";
        }

        return;
    }

    // =====================================================
    // UČITAVANJE PROIZVODA
    // =====================================================
    fetch(`../data/${series.toLowerCase()}.json`)

        .then(response => {
            if (!response.ok) {
                throw new Error("JSON file not found");
            }

            return response.json();
        })

        .then(data => {
            const product = data[code];

            if (!product) {
                if (container) {
                    container.innerHTML =
                        currentLang === 'sr'
                            ? "<h2>Proizvod nije pronađen.</h2>"
                            : "<h2>Product not found.</h2>";
                }

                return;
            }

            const displayCode = code;

            const pData =
                product[currentLang] ||
                product.en ||
                product.sr ||
                {};

            const productName =
                pData.name ||
                displayCode ||
                (currentLang === 'sr' ? 'Proizvod' : 'Product');

            const details =
                pData.details || {};

            // =====================================================
            // SEO
            // =====================================================
            const pageTitle =
                currentLang === 'sr'
                    ? `${productName} ${displayCode} | EXALCO Aluminijumski Sistemi`
                    : `${productName} ${displayCode} | EXALCO Aluminium Systems`;

            document.title = pageTitle;

            const metaDesc =
                document.querySelector(
                    'meta[name="description"]'
                );

            if (metaDesc) {
                const fallbackDescription =
                    currentLang === 'sr'
                        ? `Tehničke specifikacije za ${productName}, kod ${displayCode}.`
                        : `Technical specifications for ${productName}, code ${displayCode}.`;

                metaDesc.setAttribute(
                    "content",
                    pData.description || fallbackDescription
                );
            }

            const updateMeta = (
                selector,
                attr,
                content
            ) => {
                const tag =
                    document.querySelector(selector);

                if (tag) {
                    tag.setAttribute(attr, content);
                }
            };

            // Pravilan apsolutni URL slike
            const absoluteImageUrl =
                new URL(
                    product.image,
                    window.location.href
                ).href;

            updateMeta(
                'meta[property="og:title"]',
                "content",
                pageTitle
            );

            updateMeta(
                'meta[property="og:image"]',
                "content",
                absoluteImageUrl
            );

            updateMeta(
                'meta[property="og:description"]',
                "content",
                pData.description || ""
            );

            updateMeta(
                'meta[name="twitter:title"]',
                "content",
                pageTitle
            );

            updateMeta(
                'meta[name="twitter:description"]',
                "content",
                pData.description || ""
            );

            // =====================================================
            // PREVOD LABELA
            // =====================================================
            const labels = {
                dim:
                    currentLang === 'sr'
                        ? "Dimenzije"
                        : "Dimensions",

                brand:
                    currentLang === 'sr'
                        ? "Brend"
                        : "Brand",

                mat:
                    currentLang === 'sr'
                        ? "Materijal"
                        : "Material",

                type:
                    currentLang === 'sr'
                        ? "Tip"
                        : "Type",

                weight:
                    currentLang === 'sr'
                        ? "Težina"
                        : "Weight",

                info:
                    currentLang === 'sr'
                        ? "Tehničke Specifikacije"
                        : "Technical Specifications",

                code:
                    currentLang === 'sr'
                        ? "Kod"
                        : "Code"
            };

            const row = (key, value) => {
                if (!value || value === "-") {
                    return "";
                }

                return `
                    <tr>
                        <td class="spec-key">
                            ${key}
                        </td>

                        <td>
                            ${value}
                        </td>
                    </tr>
                `;
            };

            const seoAltDetail =
                currentLang === 'sr'
                    ? `${productName} kod ${displayCode} - tehnički nacrt i specifikacije`
                    : `${productName} code ${displayCode} - technical drawing and specifications`;

            // =====================================================
            // SLIKE
            // =====================================================
            const imagesArray = [
                product.image
            ];

            if (product.tech_image) {
                imagesArray.push(
                    product.tech_image
                );
            }

            // =====================================================
            // HTML PROIZVODA
            // =====================================================
            const html = `
                <div class="detail-left">

                    <div
                        class="main-image-container"
                        style="
                            position:relative;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                        "
                    >

                        ${
                            imagesArray.length > 1
                                ? `
                                    <button
                                        id="prev-pic"
                                        style="
                                            position:absolute;
                                            left:10px;
                                            background:rgba(0,64,133,0.7);
                                            color:white;
                                            border:none;
                                            width:35px;
                                            height:35px;
                                            border-radius:50%;
                                            cursor:pointer;
                                            display:flex;
                                            align-items:center;
                                            justify-content:center;
                                            z-index:10;
                                            transition:0.3s;
                                        "
                                    >
                                        <i class="fas fa-chevron-left"></i>
                                    </button>
                                `
                                : ''
                        }

                        <img
                            src="${product.image}"
                            class="detail-img"
                            id="main-product-img"
                            alt="${seoAltDetail}"
                            style="
                                max-width:100%;
                                height:auto;
                                transition:opacity 0.3s ease;
                            "
                        >

                        ${
                            imagesArray.length > 1
                                ? `
                                    <button
                                        id="next-pic"
                                        style="
                                            position:absolute;
                                            right:10px;
                                            background:rgba(0,64,133,0.7);
                                            color:white;
                                            border:none;
                                            width:35px;
                                            height:35px;
                                            border-radius:50%;
                                            cursor:pointer;
                                            display:flex;
                                            align-items:center;
                                            justify-content:center;
                                            z-index:10;
                                            transition:0.3s;
                                        "
                                    >
                                        <i class="fas fa-chevron-right"></i>
                                    </button>
                                `
                                : ''
                        }

                    </div>

                    <div
                        class="gallery-thumbs"
                        style="
                            margin-top:20px;
                            display:flex;
                            gap:10px;
                            justify-content:center;
                        "
                    >

                        <img
                            src="${product.image}"
                            alt="${productName}"
                            class="thumb-item active-thumb"
                            style="
                                width:70px;
                                height:70px;
                                object-fit:contain;
                                cursor:pointer;
                                border:2px solid #004085;
                                padding:2px;
                            "
                            data-index="0"
                        >

                        ${
                            product.tech_image
                                ? `
                                    <img
                                        src="${product.tech_image}"
                                        alt="${currentLang === 'sr' ? `${productName} tehnički crtež` : `${productName} technical drawing`}"
                                        class="thumb-item"
                                        style="
                                            width:70px;
                                            height:70px;
                                            object-fit:contain;
                                            cursor:pointer;
                                            border:1px solid #ddd;
                                            padding:2px;
                                        "
                                        data-index="1"
                                    >
                                `
                                : ''
                        }

                    </div>

                </div>

                <div class="detail-right">

                    <h1 class="detail-title">
                        ${productName}
                    </h1>

                    <span class="detail-code">
                        ${labels.code}: ${displayCode}
                    </span>

                    <p class="detail-desc">
                        ${pData.description || ""}
                    </p>

                    <div class="section-header">
                        ${labels.info}
                    </div>

                    <table class="spec-table">

                        <tbody>

                            ${row(
                                labels.dim,
                                details.dimensions
                            )}

                            ${row(
                                labels.brand,
                                details.brand || "EXALCO"
                            )}

                            ${row(
                                labels.mat,
                                details.material || (currentLang === 'sr' ? "Aluminijum" : "Aluminium")
                            )}

                            ${row(
                                labels.type,
                                details.type
                            )}

                            ${row(
                                labels.weight,
                                details.weight
                            )}

                        </tbody>

                    </table>

                </div>
            `;

            if (container) {
                container.innerHTML = html;
            }

            // =====================================================
            // SLIDER I THUMBNAILS
            // =====================================================
            if (imagesArray.length > 1) {
                let currentIndex = 0;

                const mainImg =
                    document.getElementById(
                        'main-product-img'
                    );

                const thumbs =
                    document.querySelectorAll(
                        '.thumb-item'
                    );

                const prevBtn =
                    document.getElementById(
                        'prev-pic'
                    );

                const nextBtn =
                    document.getElementById(
                        'next-pic'
                    );

                function updateGallery(index) {
                    currentIndex = index;

                    mainImg.style.opacity = '0.3';

                    setTimeout(() => {
                        mainImg.src =
                            imagesArray[currentIndex];

                        mainImg.style.opacity = '1';
                    }, 150);

                    thumbs.forEach(
                        (thumb, i) => {
                            if (i === currentIndex) {
                                thumb.style.border =
                                    '2px solid #004085';
                            } else {
                                thumb.style.border =
                                    '1px solid #ddd';
                            }
                        }
                    );
                }

                // PRETHODNA SLIKA
                prevBtn.addEventListener(
                    'click',
                    () => {
                        const index =
                            currentIndex === 0
                                ? imagesArray.length - 1
                                : currentIndex - 1;

                        updateGallery(index);
                    }
                );

                // SLJEDEĆA SLIKA
                nextBtn.addEventListener(
                    'click',
                    () => {
                        const index =
                            currentIndex ===
                            imagesArray.length - 1
                                ? 0
                                : currentIndex + 1;

                        updateGallery(index);
                    }
                );

                // KLIK NA THUMBNAIL
                thumbs.forEach(thumb => {
                    thumb.addEventListener(
                        'click',
                        event => {
                            const index =
                                parseInt(
                                    event.currentTarget.getAttribute(
                                        'data-index'
                                    ),
                                    10
                                );

                            updateGallery(index);
                        }
                    );
                });

                // HOVER DUGMIĆA
                [prevBtn, nextBtn].forEach(btn => {
                    btn.addEventListener(
                        'mouseenter',
                        () => {
                            btn.style.background =
                                'rgba(0,64,133,1)';
                        }
                    );

                    btn.addEventListener(
                        'mouseleave',
                        () => {
                            btn.style.background =
                                'rgba(0,64,133,0.7)';
                        }
                    );
                });
            }
        })

        .catch(error => {
            console.error(error);

            if (container) {
                container.innerHTML =
                    currentLang === 'sr'
                        ? "<h2>Greška pri učitavanju proizvoda.</h2>"
                        : "<h2>Error loading product.</h2>";
            }
        });
});