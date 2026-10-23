# Search Console posle produkcione objave

Prvobitno proverena produkciona verzija: commit 08ecfc1, objavljen kroz
Coolify. Nakon toga PR #2 je objavljen kao commit 49e49e9 sa početnim HTML
katalogom i trajnim preusmerenjima; pogledati CATALOG-HTML-ROLLOUT.md.

- EX55/PC-205 SR: Test live URL je 23.10.2026. pokazao "URL is available
  to Google" i "Page can be indexed". Zahtev za indeksiranje je prihvaćen
  uz poruku "Indexing requested".
- Za "Duplicate without user-selected canonical" (17 pogođenih URL-ova)
  pokrenuta je validacija; GSC prikazuje "Validation Started",
  "Started: 23/10/2026". To nije završen rezultat validacije.
- Ponovo poslat https://exalcoaluminium.com/sitemap.xml. GSC prikazuje
  Success, datum slanja i čitanja 23.10.2026. i 1.402 otkrivena URL-a
  umesto prethodnih 70. Otkriven URL nije isto što i indeksiran URL.
- W60/1039 EN: live test pokazuje dostupnost i dozvoljeno indeksiranje;
  zahtev za indeksiranje je prihvaćen. Stari indeksni zapis i dalje
  prikazuje W69/1039 kao Google-selected canonical iz crawla 17.10.2026.
- W60/1044 SR: live test takođe pokazuje dostupnost i dozvoljeno
  indeksiranje; potvrđena je poruka "Indexing requested".
- EX74/50030 EN: inspekcija je započeta, ali live test i zahtev za
  indeksiranje nisu završeni pre odjave Google sesije. Potrebna je nova
  prijava za nastavak. Ne označavati ovaj URL kao završen.
- Novi razlog "Google chose different canonical than user" nije označen
  kao rešen samo na osnovu uspešnog live testa.
- Za /pages/ je server popravka objavljena i proverena: sada vraća 301 na
  /pages/products-sr.html. Nije otvoreno listanje direktorijuma. GSC
  validacija ovog 403 razloga još nije potvrđena kao pokrenuta.

Coolify prijava je završena i server promene su objavljene. Ponovna Google
prijava je zaustavljena na zahtevu za lozinku; bezbedni zahtev je istekao
bez potvrđenog ishoda prijave. Nije potvrđen novi live test nakon PR-a #2
niti završetak EX74/50030 zahteva. Preostali korak je ponovna prijava u
Search Console, live test i pokretanje 403 validacije. Lozinke se ne šalju
kroz chat.
