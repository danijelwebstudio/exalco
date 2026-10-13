document.addEventListener("DOMContentLoaded", () => {
    const currentLang = (document.documentElement.lang || 'sr').toLowerCase().startsWith('en') ? 'en' : 'sr';

    const params = new URLSearchParams(window.location.search);

    const rawSeries = params.get('series');
    const series = rawSeries ? rawSeries.toLowerCase() : null;
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
    if (!series || !code || !/^[a-z0-9_-]+$/i.test(series)) {
        // Bare template URLs are not product pages; send visitors to the catalog.
        window.location.replace(mainPage);
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
                const metaRobots = document.head.querySelector('meta[name="robots"]') || document.createElement('meta');
                metaRobots.name = 'robots';
                metaRobots.content = 'noindex, follow';
                if (!metaRobots.parentNode) document.head.appendChild(metaRobots);
                document.head.querySelector('link[rel="canonical"]')?.remove();
                if (container) {
                    container.innerHTML = currentLang === 'sr'
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
            // SEO ZA KONKRETAN PROIZVOD (bez izmišljanja specifikacija)
            // =====================================================
            const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
            }[ch]));
            const isSr = currentLang === 'sr';
            const seriesLabel = series.toUpperCase();
            const dimension = details.dimensions ? String(details.dimensions) : '';
            const weight = details.weight ? String(details.weight) : '';
            const originalDescription = String(pData.description || '').trim();
            const isGenericDescription = /^(high-quality aluminium profile|visokokvalitetni aluminijumski profil)\.?$/i
                .test(originalDescription);

            // Unique, verifiable information from each product's own JSON record.
            const identityLine = isSr
                ? `${productName} (${displayCode}), serija ${seriesLabel}, EXALCO aluminijumski profil.`
                : `${productName} (${displayCode}), ${seriesLabel} series, EXALCO aluminium profile.`;
            const facts = [
                dimension ? (isSr ? `Dimenzije: ${dimension}.` : `Dimensions: ${dimension}.`) : '',
                weight ? (isSr ? `Težina: ${weight}.` : `Weight: ${weight}.`) : ''
            ].filter(Boolean).join(' ');
            const uniqueDescription = `${identityLine} ${facts}`.trim();
            const visibleDescription = originalDescription && !isGenericDescription
                ? `${originalDescription} ${identityLine} ${facts}`.trim()
                : uniqueDescription;
            const seoDescription = visibleDescription.length > 210
                ? uniqueDescription
                : visibleDescription;

            const pageTitle = isSr
                ? `${productName} ${displayCode} | ${seriesLabel} | EXALCO`
                : `${productName} ${displayCode} | ${seriesLabel} | EXALCO`;
            document.title = pageTitle;

            const setMeta = (selector, field, value, attrs) => {
                let tag = document.head.querySelector(selector);
                if (!tag) {
                    tag = document.createElement('meta');
                    Object.entries(attrs).forEach(([k, v]) => tag.setAttribute(k, v));
                    document.head.appendChild(tag);
                }
                tag.setAttribute(field, value);
            };

            const base = 'https://exalcoaluminium.com/pages/';
            const query = `?series=${encodeURIComponent(series)}&code=${encodeURIComponent(code)}`;
            const srUrl = `${base}product-detail-sr.html${query}`;
            const enUrl = `${base}product-detail.html${query}`;
            const canonicalUrl = isSr ? srUrl : enUrl;
            const setLink = (rel, href, lang) => {
                const selector = lang
                    ? `link[rel="${rel}"][hreflang="${lang}"]`
                    : `link[rel="${rel}"]`;
                let link = document.head.querySelector(selector);
                if (!link) {
                    link = document.createElement('link');
                    link.rel = rel;
                    if (lang) link.hreflang = lang;
                    document.head.appendChild(link);
                }
                link.href = href;
            };
            setLink('canonical', canonicalUrl);
            setLink('alternate', srUrl, 'sr');
            setLink('alternate', enUrl, 'en');
            setLink('alternate', enUrl, 'x-default');

            setMeta('meta[name="description"]', 'content', seoDescription,
                { name: 'description' });
            setMeta('meta[property="og:title"]', 'content', pageTitle,
                { property: 'og:title' });
            setMeta('meta[property="og:description"]', 'content', seoDescription,
                { property: 'og:description' });
            setMeta('meta[property="og:url"]', 'content', canonicalUrl,
                { property: 'og:url' });
            setMeta('meta[property="og:type"]', 'content', 'product',
                { property: 'og:type' });
            setMeta('meta[name="twitter:title"]', 'content', pageTitle,
                { name: 'twitter:title' });
            setMeta('meta[name="twitter:description"]', 'content', seoDescription,
                { name: 'twitter:description' });

            // Correct public image URL, resolving relative to the product page.
            const absoluteImageUrl = product.image
                ? new URL(product.image, window.location.href).href
                : '';
            if (absoluteImageUrl) {
                setMeta('meta[property="og:image"]', 'content', absoluteImageUrl,
                    { property: 'og:image' });
            }

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
                        ${esc(visibleDescription)}
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