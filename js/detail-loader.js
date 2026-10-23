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
            const product = Object.prototype.hasOwnProperty.call(data, code) ? data[code] : null;

            if (!product) {
                const metaRobots = document.head.querySelector('meta[name="robots"]') || document.createElement('meta');
                metaRobots.name = 'robots';
                metaRobots.content = 'noindex, follow';
                if (!metaRobots.parentNode) document.head.appendChild(metaRobots);
                document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]').forEach(link => link.remove());
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
            const dimension = details.dimensions && details.dimensions !== '-' ? String(details.dimensions) : '';
            const weight = details.weight && details.weight !== '-' ? String(details.weight) : '';
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
            const drawingContext = isSr
                ? `Prikaz u katalogu serije ${seriesLabel}. Tehnički crtež, kada je dostupan, odnosi se na ovaj kataloški zapis; ista šifra u drugoj seriji nije potvrda zamjenjivosti.`
                : `Listed in the ${seriesLabel} series catalog. The technical drawing, when available, belongs to this catalog entry; the same code in another series does not establish interchangeability.`;
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
                            ${esc(value)}
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
            const assetPolicy = window.EXALCO_ASSETS;
            const available = path => assetPolicy ? assetPolicy.available(path) : Boolean(path);
            const gallery = [];
            const addImage = (src, kind) => {
                if (available(src) && !gallery.some(image => image.src === src)) {
                    gallery.push({ src, kind });
                }
            };
            addImage(product.image, 'profile');
            addImage(product.tech_image, 'drawing');
            (product.extra_images || []).forEach(src => addImage(src, 'profile'));
            const hasDrawing = gallery.some(image => image.kind === 'drawing');
            if (!gallery.length) gallery.push({
                src: '../assets/images/product-unavailable.svg', kind: 'unavailable'
            });
            const imageAlt = image => image.kind === 'drawing'
                ? (isSr ? `${productName} ${displayCode}, serija ${seriesLabel} — tehnički crtež`
                        : `${productName} ${displayCode}, ${seriesLabel} series — technical drawing`)
                : image.kind === 'unavailable'
                    ? (isSr ? 'Slika nije dostupna' : 'Image unavailable')
                    : `${productName} ${displayCode} | ${seriesLabel}`;

            // =====================================================
            // HTML PROIZVODA
            // =====================================================
            const html = `
                <div class="detail-left">
                    <div class="main-image-container" style="position:relative;display:flex;align-items:center;justify-content:center;gap:10px;">
                        <button id="prev-pic" type="button" aria-label="${isSr ? 'Prethodna slika' : 'Previous image'}" ${gallery.length < 2 ? 'hidden' : ''}>❮</button>
                        <img src="${esc(gallery[0].src)}" class="detail-img" id="main-product-img"
                             alt="${esc(imageAlt(gallery[0]))}" style="max-width:100%;height:auto;">
                        <button id="next-pic" type="button" aria-label="${isSr ? 'Sljedeća slika' : 'Next image'}" ${gallery.length < 2 ? 'hidden' : ''}>❯</button>
                    </div>
                    <div class="gallery-thumbs" style="margin-top:20px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
                        ${gallery.map((image, index) => `<button type="button" class="thumb-item" data-index="${index}"
                            aria-label="${esc(imageAlt(image))}" aria-pressed="${index === 0}"
                            style="width:76px;height:76px;padding:2px;cursor:pointer;border:${index === 0 ? '2px solid #004085' : '1px solid #ddd'};background:white;">
                            <img src="${esc(image.src)}" alt="${esc(imageAlt(image))}" style="width:100%;height:100%;object-fit:contain;">
                        </button>`).join('')}
                    </div>
                    ${hasDrawing ? '' : `<p class="drawing-unavailable">${isSr
                        ? 'Tehnički crtež za ovaj kataloški zapis trenutno nije dostupan. Zatražite dokumentaciju od EXALCO tima.'
                        : 'The technical drawing for this catalog entry is currently unavailable. Contact the EXALCO team for documentation.'}</p>`}
                </div>

                <div class="detail-right">

                    <h1 class="detail-title">
                        ${esc(productName)}
                    </h1>

                    <span class="detail-code">
                        ${labels.code}: ${esc(displayCode)}
                    </span>

                    <p class="detail-desc">
                        ${esc(visibleDescription)}</p><p class="detail-context">${esc(drawingContext)}
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
            // Keep image, technical-drawing label and selected thumbnail in sync.
            const mainImg = document.getElementById('main-product-img');
            const thumbs = Array.from(document.querySelectorAll('.thumb-item'));
            const prevBtn = document.getElementById('prev-pic');
            const nextBtn = document.getElementById('next-pic');
            let currentIndex = 0;
            const failed = new Set();
            function updateGallery(index) {
                currentIndex = index;
                mainImg.src = gallery[index].src;
                mainImg.alt = imageAlt(gallery[index]);
                thumbs.forEach((thumb, i) => {
                    thumb.setAttribute('aria-pressed', String(i === index));
                    thumb.style.border = i === index ? '2px solid #004085' : '1px solid #ddd';
                });
            }
            function move(step) {
                for (let n = 1; n <= gallery.length; n++) {
                    const index = (currentIndex + step * n + gallery.length * n) % gallery.length;
                    if (!failed.has(index)) { updateGallery(index); return; }
                }
            }
            prevBtn.addEventListener('click', () => move(-1));
            nextBtn.addEventListener('click', () => move(1));
            thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => {
                if (!failed.has(index)) updateGallery(index);
            }));
            mainImg.addEventListener('error', () => {
                failed.add(currentIndex);
                if (thumbs[currentIndex]) thumbs[currentIndex].hidden = true;
                // Do not replace a failed drawing with another product's image or label.
                if (failed.size < gallery.length) move(1);
                else if (!mainImg.src.endsWith('/product-unavailable.svg')) {
                    mainImg.src = '../assets/images/product-unavailable.svg';
                    mainImg.alt = isSr ? 'Slika nije dostupna' : 'Image unavailable';
                }
            });
        })

        .catch(error => {
            console.error(error);
            const robots = document.head.querySelector('meta[name="robots"]') || document.createElement('meta');
            robots.name = 'robots';
            robots.content = 'noindex, follow';
            if (!robots.parentNode) document.head.appendChild(robots);
            document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]').forEach(link => link.remove());

            if (container) {
                container.innerHTML =
                    currentLang === 'sr'
                        ? "<h2>Greška pri učitavanju proizvoda.</h2>"
                        : "<h2>Error loading product.</h2>";
            }
        });
});