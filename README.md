# Super Clipboard — strona produktu

Polski landing page bezpłatnego menedżera schowka dla Windows 11.

- Strona: https://apkmasondev.github.io/clipboard-website/
- Aplikacja: https://github.com/apkmasondev/clipboard
- Repozytorium strony: https://github.com/apkmasondev/clipboard-website

## Uruchomienie

Potrzebny jest Node.js 22 lub nowszy. Projekt nie ma zależności npm i nie wymaga `npm install`.

```sh
npm run dev
```

Otwórz http://127.0.0.1:4173. Podgląd nasłuchuje wyłącznie lokalnie. Po zmianie plików odśwież stronę. Port można zmienić zmienną `PORT`.

```sh
npm test
npm run build
npm run preview
```

Build zapisuje wyłącznie publiczne pliki w `dist/`. Katalog jest odtwarzany przy każdym buildzie. Podgląd produkcyjny korzysta z tego samego portu co developerski; zatrzymaj poprzedni proces przed uruchomieniem drugiego.

## Architektura i wygląd

- `index.html` — semantyczna treść, SEO, opis funkcji i wymagania instalacji.
- `styles.css` — wspólny system wizualny: papierowe tło, grafit, mięta, typografia Manrope i Georgia, reguły responsywności i ograniczonego ruchu.
- `app.js` — progresywne rozszerzenia: menu mobilne, galeria, powiększanie obrazów w natywnym dialogu. Bez dostępu do sieci, storage ani schowka odwiedzającego.
- `assets/` — lokalny font z licencją, ikona oraz trzy zrzuty aktualnego interfejsu aplikacji z przykładowymi danymi. Screeny wykonano z renderowanego kodu aplikacji 1.1.0 przy użyciu syntetycznej warstwy danych; nie zawierają historii użytkownika.
- `scripts/` — budowanie z jawnej listy plików oraz ograniczony lokalny serwer podglądu.
- `tests/` — spójność odnośników i zasobów, metadane, zgodność wersji wydania oraz budżet zasobów.

Strona działa bez frameworka i backendu. Główna treść, pobieranie, FAQ i odnośniki do screenów pozostają dostępne bez JavaScript. Nie ma analityki, reklam, formularzy, cookies ani zewnętrznych fontów. GitHub Pages może przetwarzać techniczne dane połączenia na zasadach GitHuba.

## Publikacja

W repozytorium GitHub ustaw **Settings → Pages → Source: GitHub Actions**. Workflow `.github/workflows/pages.yml` sprawdza i buduje projekt po zmianach; dopiero udany build gałęzi `main` jest publikowany. Pull requesty uruchamiają wyłącznie testy i build. Nie są potrzebne ręczne sekrety ani zewnętrzne usługi. Akcje przypięto do konkretnych commitów.

Witryna jest skonfigurowana dla podkatalogu `/clipboard-website/`. Przy zmianie repozytorium lub domeny zaktualizuj canonical, Open Graph, `robots.txt`, `sitemap.xml` i absolutne ścieżki w `404.html`.

## Aktualizacja wydania aplikacji

1. Zweryfikuj nowe publiczne wydanie, nazwę instalatora, architekturę, rozmiar i status podpisu.
2. Zaktualizuj linki i oznaczenia wersji w `index.html` oraz oczekiwaną wersję w testach.
3. Uaktualnij screeny, jeśli interfejs się zmienił. Używaj wyłącznie fikcyjnych, przejrzanych danych.
4. Uruchom testy i build, sprawdź stronę przy szerokości 320, 390, 768 i 1280 px oraz klawiaturą. Sprawdź galerię, dialog, Escape, menu, FAQ i pobieranie.

Link do pobierania jest przypięty do zweryfikowanej wersji zamiast dynamicznego pobierania metadanych z API w przeglądarce.

## Licencja i zasoby

Oryginalny kod strony jest objęty **Super Clipboard Free Use License 1.0**: bezpłatne używanie, również zawodowe, z zakazem sprzedaży programu i modyfikacji. Jest to licencja source-available, nie licencja open source zatwierdzona przez OSI. Zobacz `LICENSE`.

Manrope: Mikhail Sharanda, Mirko Velimirovic i współtwórcy; SIL Open Font License 1.1, pełny tekst w `assets/OFL-Manrope.txt`. Font pochodzi z [oficjalnego repozytorium Google Fonts](https://github.com/google/fonts/tree/main/ofl/manrope). Pozostałe grafiki to ikona Super Clipboard, zrzuty jego interfejsu i proste elementy SVG/CSS strony.

Nie dodawaj do repozytorium baz schowka, kopii `.scbackup`, plików `.env`, tokenów, certyfikatów, prywatnych screenów ani konfiguracji konta. `.gitignore` ogranicza przypadkowe dodanie typowych plików prywatnych; przed publikacją nadal przejrzyj diff i listę plików.
