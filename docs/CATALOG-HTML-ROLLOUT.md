# Početni HTML kataloga — priprema za Coolify

## Status

Objavljeno 23.10.2026. na exalcoaluminium.com, posle uspešne odvojene
Coolify probe i spajanja PR-a #2. Produkcioni commit je
49e49e9d65c527918fd8a792ac3c363c44b25d66. Coolify sada koristi Dockerfile
build, /Dockerfile.catalog, root / i port 80. Produkcioni DNS i domeni
nisu menjani. Prethodna uspešna verzija za povratak je 08ecfc1.

Pet javnih kataloških URL-ova, uključujući sva tri nova GSC canonical
primera, vraćaju HTTP 200 i početni HTML identičan lokalno testiranom.
Produkcija nema X-Robots-Tag: noindex; probni hostname ima noindex.
HTTP i www varijante, /index.html i /pages/ vraćaju 301. Nepostojeći
proizvod vraća 404. Produkciona galerija i sr/en/x-default canonical
oznake proverene su u pregledaču.

Traefik labele produkcione aplikacije sada se održavaju ručno da bi www
i HTTP preusmerenja bila trajna. Sačuvana je originalna konfiguracija.
Postojeće TLS rute, sertifikati, port i servisi su očuvani; promenjena je
trajnost www preusmerenja i dodat je zaseban exalco-permanent-https
middleware, bez izmene zajedničkog redirect-to-https middleware-a.
Pri budućoj promeni domena/porta treba uskladiti ove ručne labele; povratak
na auto-generated režim zahteva ponovnu proveru trajnosti preusmerenja.

## Šta se menja

Trenutno server daje isti HTML šablon za sve query URL-ove, a JavaScript
naknadno dodaje proizvod i canonical. Novi build pokreće postojeći katalog
loader pri izradi slike i generiše HTML za 1.332 proizvoda/jezika i 56
pregleda serija. Nginx bira tačan dokument prema putanji, series i code.
Redosled parametara i dodatni tracking parametri ne menjaju izabrani proizvod.

URL-ovi, sitemap, šifre, dimenzije, mase i veze sa nacrtima ostaju isti.
Postojeći JavaScript i dalje omogućava galeriju i promenu jezika. Build
koristi isti loader kao javni sajt, tako da nema drugog renderer-a sa
posebno prepisanim tehničkim vrednostima. Nepostojeći proizvodi dobijaju
HTTP 404 pre izvršavanja JavaScripta.

Server vraća 301 za www na glavni domen, /index.html na /, samo tačne
/pages i /pages/ putanje na srpski pregled proizvoda, i prazne katalog
šablone na odgovarajući pregled. Nema preusmeravanja /pages/*.
Direktorijumi ostaju bez listanja. Putanje generisanih HTML fajlova su
internal, pa ne stvaraju drugi javni katalog.

HTTPS preusmeravanje ostaje na Coolify proxyju: zahtev već prosleđen sa
HTTPS-a u HTTP kontejner ne sme da se preusmerava prema nginx $scheme,
jer bi to napravilo petlju. Na proxyju posebno proveriti da je redirect
sa HTTP na HTTPS trajan (301/308), uz očuvanje putanje i query parametara.

## Provere koje su prošle 23.10.2026.

- Čist npm ci sa zaključanim zavisnostima; Node 24.19.0, jsdom 30.1.1.
- Build svih 1.388 HTML dokumenata: jedan canonical, tri jezičke alternative,
  popunjen sadržaj i postojeće reference prikazanih kataloških slika.
- Stvarni nginx 1.28.3 lokalno: svih 1.388 javnih katalog URL-ova vraća
  tačan HTML već u HTTP odgovoru, bez izvršavanja JavaScripta.
- Promena redosleda parametara, tracking parametar, kod sa razmakom;
  šest nepostojećih/zabranjenih direktnih putanja; pet redirect slučajeva;
  početna stranica, JSON i MIME tipovi JS/CSS/SVG fajlova.
- Hidratacija tri generisane stranice: EX74/50030 EN, W60/1044 SR i
  W55/1039 EN. Canonical se ne duplira, a galerija i povratak na seriju rade.
- Postojeći DOM test: 1.332 proizvoda/jezika, 56 serija, sedam neuspešnih
  ili nevažećih slučajeva i navigacija galerije; četiri Python testa.

Docker slika je zatim stvarno izgrađena i pokrenuta u Coolify probnoj
aplikaciji, a nakon provere i u produkciji. Slika koristi zvanične Node i
nginx slike. Probni HTTP testovi obuhvatili su pet reprezentativnih
kataloških stranica, 301/404 odgovore i noindex, a pregled u HTTPS
pregledaču potvrdio je galeriju i tehnički crtež.

Lokalno ponavljanje:

```sh
npm ci
npm run build:catalog
npm run test:catalog
npm run test:prerender
python tests/test_http_catalog.py
python -m unittest discover -s tests -p test_catalog.py
```

Za poslednji HTTP test potreban je nginx u PATH-u ili EXALCO_NGINX_BIN.
Test pokreće sopstveni proces na slobodnom lokalnom portu; ne menja postojeći
nginx servis. Generisani build/ i node_modules/ ne ulaze u git.

## Uključivanje i povratak

1. Zabeležiti trenutni Static build metod, root, port, domene i proxy
   preusmerenja. Sačuvati postojeću Coolify konfiguraciju za povratak.
2. Probno izgraditi Dockerfile.catalog na izdvojenoj instanci bez javnog
   indeksiranja i bez menjanja produkcionog domena. Koristiti port 80.
3. Proveriti početni HTML za tri GSC primera, galeriju, jezike, sitemap,
   slike i očekivane 404/301. Pokrenuti nginx -t u izgrađenoj slici.
4. Tek nakon uspešne probe prebaciti produkciju na Dockerfile build,
   Dockerfile location /Dockerfile.catalog, root /, port 80; zadržati
   postojeće domene, TLS i odredišni server. Deploy mora izgraditi novu sliku.
5. Posle objave proveriti iste putanje uživo i Test live URL u GSC.
6. Ako proba ili produkciona provera ne uspe, vratiti prethodni Static
   metod/konfiguraciju i objaviti prethodni uspešan commit. Stari javni
   HTML/JS fajlovi nisu izmenjeni ovom granom i mogu ponovo da se posluže.

Ova promena ne popunjava 32 nedostajuće reference nacrta/fotografija.
Ne pretvara dostupnost Googlebotu u garanciju indeksiranja niti dokazuje
da će Google prihvatiti naš canonical za svaku sličnu stranicu.

Dokumentacija: https://coolify.io/docs/applications/builds/static
