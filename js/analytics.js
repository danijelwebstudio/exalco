const GA_ID = 'G-ECBGL1PT4N';
const CONSENT_KEY = 'analyticsConsent';


// =====================================================
// SIGURAN LOCAL STORAGE
// =====================================================
function getConsent() {
    try {
        return localStorage.getItem(CONSENT_KEY);
    } catch (error) {
        return null;
    }
}

function saveConsent(value) {
    try {
        localStorage.setItem(CONSENT_KEY, value);
    } catch (error) {
        console.warn('Consent preference could not be saved.');
    }
}


// =====================================================
// JEZIK
// =====================================================
function isEnglishPage() {
    const lang = document.documentElement.lang || 'sr';
    return lang.toLowerCase().startsWith('en');
}


// =====================================================
// PRIVACY POLICY LINK
// =====================================================
function getPrivacyUrl() {

    const isEnglish = isEnglishPage();

    const isInsidePages =
        window.location.pathname.includes('/pages/');

    if (isInsidePages) {
        return isEnglish
            ? 'privacy.html'
            : 'privacy-sr.html';
    }

    return isEnglish
        ? 'pages/privacy.html'
        : 'pages/privacy-sr.html';
}


// =====================================================
// UČITAVANJE GOOGLE ANALYTICS
//
// Google se NE učitava prije pristanka.
// =====================================================
function loadAnalytics() {

    if (window.__exalcoAnalyticsLoaded) {
        return;
    }

    if (getConsent() !== 'granted') {
        return;
    }

    window.__exalcoAnalyticsLoaded = true;

    // Ako je ranije Analytics bio isključen
    window[`ga-disable-${GA_ID}`] = false;

    window.dataLayer = window.dataLayer || [];

    window.gtag = function () {
        window.dataLayer.push(arguments);
    };


    // Google Consent Mode
    // Prvo postavljamo podrazumijevano stanje.
    window.gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
    });


    // Korisnik je već dao pristanak samo za Analytics.
    window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
    });


    // Tek sada učitavamo Google skriptu.
    const script = document.createElement('script');

    script.async = true;

    script.src =
        `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;

    document.head.appendChild(script);


    window.gtag('js', new Date());

    window.gtag('config', GA_ID, {
        anonymize_ip: true
    });
}


// =====================================================
// BRISANJE GOOGLE ANALYTICS KOLAČIĆA
// =====================================================
function deleteAnalyticsCookies() {

    const cookieNames =
        document.cookie
            .split(';')
            .map(cookie => cookie.split('=')[0].trim())
            .filter(name =>
                name === '_ga' ||
                name === '_gid' ||
                name.startsWith('_ga_')
            );


    const hostname =
        window.location.hostname.replace(/^www\./, '');


    cookieNames.forEach(name => {

        // Trenutni domen
        document.cookie =
            `${name}=; Max-Age=0; path=/; SameSite=Lax`;

        // Root domen
        document.cookie =
            `${name}=; Max-Age=0; path=/; domain=.${hostname}; SameSite=Lax`;
    });
}


// =====================================================
// ODBIJANJE / POVLAČENJE PRISTANKA
// =====================================================
function disableAnalytics() {

    saveConsent('denied');

    window[`ga-disable-${GA_ID}`] = true;


    if (typeof window.gtag === 'function') {

        window.gtag('consent', 'update', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
        });
    }


    deleteAnalyticsCookies();
}


// =====================================================
// PRIHVATANJE
// =====================================================
function enableAnalytics() {

    saveConsent('granted');

    window[`ga-disable-${GA_ID}`] = false;

    loadAnalytics();
}


// =====================================================
// COOKIE BANNER
// =====================================================
function showConsentBanner(force = false) {

    const existingBanner =
        document.getElementById(
            'analytics-consent-banner'
        );


    if (existingBanner) {
        existingBanner.remove();
    }


    const currentConsent =
        getConsent();


    // Ako korisnik već ima izbor,
    // banner se ne prikazuje osim ako ga ručno otvori.
    if (
        !force &&
        (
            currentConsent === 'granted' ||
            currentConsent === 'denied'
        )
    ) {
        return;
    }


    const isEnglish =
        isEnglishPage();


    const banner =
        document.createElement('div');


    banner.id =
        'analytics-consent-banner';


    banner.innerHTML = `
        <div
            style="
                max-width:1200px;
                margin:0 auto;
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:20px;
                flex-wrap:wrap;
            "
        >

            <div
                style="
                    flex:1;
                    min-width:250px;
                "
            >

                <p
                    style="
                        margin:0;
                        font-size:14px;
                        line-height:1.6;
                    "
                >
                    ${
                        isEnglish
                            ? `
                                We use Google Analytics cookies to understand
                                how visitors use our website. Analytics is
                                activated only after you give your consent.
                            `
                            : `
                                Koristimo Google Analytics kolačiće kako bismo
                                razumjeli kako posjetioci koriste naš sajt.
                                Analitika se uključuje tek nakon vašeg pristanka.
                            `
                    }

                    <a
                        href="${getPrivacyUrl()}"
                        style="
                            color:#fff;
                            text-decoration:underline;
                            margin-left:4px;
                        "
                    >
                        ${
                            isEnglish
                                ? 'Privacy & Cookies'
                                : 'Privatnost i kolačići'
                        }
                    </a>
                </p>

            </div>


            <div
                style="
                    display:flex;
                    gap:10px;
                    flex-wrap:wrap;
                "
            >

                <button
                    type="button"
                    id="analytics-reject"
                    style="
                        padding:10px 18px;
                        border:1px solid rgba(255,255,255,.45);
                        background:transparent;
                        color:#fff;
                        border-radius:6px;
                        cursor:pointer;
                        font-weight:600;
                    "
                >
                    ${
                        isEnglish
                            ? 'Decline'
                            : 'Odbij'
                    }
                </button>


                <button
                    type="button"
                    id="analytics-accept"
                    style="
                        padding:10px 18px;
                        border:1px solid #fff;
                        background:#fff;
                        color:#111;
                        border-radius:6px;
                        cursor:pointer;
                        font-weight:700;
                    "
                >
                    ${
                        isEnglish
                            ? 'Accept'
                            : 'Prihvati'
                    }
                </button>

            </div>

        </div>
    `;


    Object.assign(
        banner.style,
        {
            position: 'fixed',
            left: '20px',
            right: '20px',
            bottom: '20px',
            zIndex: '99999',
            background: '#111',
            color: '#fff',
            padding: '18px 20px',
            borderRadius: '10px',
            boxShadow:
                '0 8px 30px rgba(0,0,0,.25)',
            fontFamily:
                'Arial, sans-serif'
        }
    );


    document.body.appendChild(
        banner
    );


    const acceptButton =
        banner.querySelector(
            '#analytics-accept'
        );


    const rejectButton =
        banner.querySelector(
            '#analytics-reject'
        );


    acceptButton.addEventListener(
        'click',
        () => {

            enableAnalytics();

            banner.remove();
        }
    );


    rejectButton.addEventListener(
        'click',
        () => {

            disableAnalytics();

            banner.remove();
        }
    );
}


// =====================================================
// RUČNO OTVARANJE COOKIE POSTAVKI
//
// Footer link će koristiti:
// data-cookie-settings
// =====================================================
window.openCookieSettings = function () {
    showConsentBanner(true);
};


// =====================================================
// START
// =====================================================
document.addEventListener(
    'DOMContentLoaded',
    () => {

        const consent =
            getConsent();


        // Ranije prihvaćeno
        if (consent === 'granted') {
            loadAnalytics();
        }


        // Nema izbora
        if (
            consent !== 'granted' &&
            consent !== 'denied'
        ) {
            showConsentBanner();
        }


        // Klik na footer:
        // "Promijeni postavke kolačića"
        document.addEventListener(
            'click',
            event => {

                const trigger =
                    event.target.closest(
                        '[data-cookie-settings]'
                    );


                if (!trigger) {
                    return;
                }


                event.preventDefault();

                showConsentBanner(true);
            }
        );


        // Omogućava i:
        // privacy-sr.html#cookie-settings
        if (
            window.location.hash ===
            '#cookie-settings'
        ) {
            showConsentBanner(true);
        }
    }
);