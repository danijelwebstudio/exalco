# Provera originalnog proizvođača — 23.10.2026.

Izvor koji je vlasnik sajta potvrdio: https://exalaluminium.com/en/
Ovo je ciljana provera deset originalnih stranica za šifre 50030, 1039 i
1044, osnovnih podataka proizvođača i relevantnih stranica PDF kataloga.
Nije potvrda tehničke tačnosti svih 666 lokalnih kataloških zapisa.

## Ponavljanje šifara i canonical

Original ima zasebne stranice za 50030 u EX55, EX64 i EX74, kao i još jednu
stranicu sa istom šifrom. Za 1039 i 1044 postoje zasebne stranice za W55,
W60 i W69. Svih deset pregledanih originalnih stranica ima canonical na
sopstveni URL. Ista šifra ne dokazuje da lokalne stranice treba spojiti.
Ni zaseban originalni URL ne dokazuje fizičku različitost ili međusobnu
zamenljivost delova: bitni su sistem, sklop i tehnički crtež.

| Šifra | Lokalni sistemi | Vrednosti prikazane na originalnim stranicama |
| --- | --- | --- |
| 50030 | EX55, EX64, EX74 | dimensions 30; weight 0.367 |
| 1039 | W55, W60, W69 | dimensions 24.9*24; weight 0.34 |
| 1044 | W55, W60, W69 | dimensions 7.2*24; weight 0.25 |

Provereni primeri originalnih stranica:

- https://exalaluminium.com/en/product/rickety-single-sheet-50030/
- https://exalaluminium.com/en/product/rickety-single-sheet-50030-2/
- https://exalaluminium.com/en/product/rickety-single-sheet-50030-3/
- https://exalaluminium.com/en/product/rickety-profil-code-50030-15/
- https://exalaluminium.com/en/product/rickety-sheet-profil-code-1039/
- https://exalaluminium.com/en/product/rickety-sheet-profil-code-1039-2/
- https://exalaluminium.com/en/product/rickety-sheet-profil-code-1039-3/
- https://exalaluminium.com/en/product/rickety-sheet-profil-code-1044/
- https://exalaluminium.com/en/product/rickety-sheet-profil-code-1044-2/
- https://exalaluminium.com/en/product/rickety-sheet-profil-code-1044-3/

Zadržati canonical na odgovarajućem lokalnom URL-u ako želimo lokalnu
stranicu u indeksu. Ne usmeravati canonical na proizvođača samo zato što
od njega potiču nacrti. Ne menjati šifre i dimenzije radi SEO razlikovanja.
Umesto generičkog opisa dodati provereni kontekst serije i lokalne usluge,
bez izmišljanja dostupnosti, rokova, sertifikata ili kompatibilnosti.

## Nacrti i već pripremljene korekcije

Originalni PDF: https://exalaluminium.com/wp-content/uploads/2022/04/EX-74.pdf

- PDF strana 19, štampana oznaka 152: EX 50030-15, mera komponente 30,
  masa 0.367 kg/m i crtež sklopa EX74. Mera sklopa 74 nije širina lajsne.
- PDF strana 22, štampana oznaka 155: PC-278, mera 27.8, masa 4.162 kg/m;
  PC-284, mera 28.4, masa 4.202 kg/m. Proveriti i kolonu Used Profiles
  pri svakoj proceni kompatibilnosti. Ovi redovi podržavaju već pripremljene
  ispravke putanja u EX74; ne menjaju tehničke vrednosti.
- Originalne galerije razlikuju prikaz profila i crtež sklopa. Ekstenzija
  GIF/JPG sama po sebi ne govori koji fajl je tehnički crtež.
- Vizuelno poređenje originalnih crteža sa lokalnim tech_image fajlovima
  za EX74/50030, W60/1039 i W60/1044 potvrđuje iste prikazane sklopove,
  šifre i vidljive kote. Originalni crteži za W60/1039 i W60/1044 već
  prikazuju oba sklopa, 60 i 69; to nije dokaz greške u lokalnom fajlu.
- Poređenje prosečne razlike piksela nije korišćeno za izbor ili zamenu
  nacrta: krop, raspored i bela pozadina daju nepouzdane rezultate.

## Podaci koje ne treba slepo prepisati

Originalne stranice za 1039 i 1044 imaju type "Thermal break", dok lokalni
JSON ima "Standard". Stranice za 50030 imaju operation "Thermal Window"
i type "Normall". Oznaka sistema sa termo-prekidom ne mora značiti da sama
lajsna ima termo-prekid. Potrebna je potvrda proizvođača o značenju polja;
ovim pregledom nije izvršena masovna promena tih tehničkih oznaka.

Početna stranica proizvođača navodi 2010, a About strana 2001 kao početak
rada i 2008 za ekstruziju. Ne prepisivati neproverenu godinu u lokalnu
istoriju. Površine 16.000/6.000 m² i presa 1.800 t odnose se na iranskog
proizvođača u Zanjanu, ne na lokalno predstavništvo u BiH:
https://exalaluminium.com/en/about-us/

Original nudi i katalog Series 75:
https://exalaluminium.com/en/hinge-catalogs/
To nije dovoljan razlog da se aktivira prazan lokalni series75.json.

## Zaključak i granice

Ova provera podržava očuvanje identiteta serija i tehničkih nacrta u PR-u.
Ne uklanja preostale 32 nedostajuće reference niti garantuje Googleov izbor
canonical URL-a. Zahtevi 403 na lokalnom sajtu moraju se proveravati na
lokalnom hostingu; ponašanje proizvođačevog domena ih ne objašnjava.
PR ostaje draft, bez spajanja ili produkcione objave.
