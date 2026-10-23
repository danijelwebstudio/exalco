# Search Console posle produkcione objave

Proverena produkciona verzija: commit 08ecfc1, objavljen kroz Coolify.

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
- Za /pages/ nije pokrenuta validacija 403: server preusmerenje još nije
  primenjeno. Ne otvarati listanje direktorijuma kao SEO popravku.

Coolify pristup je zaustavljen na standardnoj prijavi. Za server promene
potrebna je prijavljena Coolify sesija; lozinke se ne šalju kroz chat.
