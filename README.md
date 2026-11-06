# Let's play English! – englannin oppimispeli alakouluun

Selaimessa toimiva harjoituspeli A1-englantiin vuosiluokille 1–6. Sisältö ja eteneminen on rakennettu perusopetuksen opetussuunnitelman perusteiden (A1-englanti) tavoitealueiden mukaan.

## Käyttö

Avaa `index.html` selaimessa. Asennusta, palvelinta tai internetyhteyttä ei tarvita. Peli toimii myös tabletilla ja puhelimella, ja sen voi julkaista esimerkiksi GitHub Pagesissa sellaisenaan.

## Tasot

| Taso | Luokat | Painotus | Aiheet |
|---|---|---|---|
| 🌱 1 | 1.–2. | Suullinen, kuvat ja kuuntelu | Värit, numerot 1–10, eläimet, perhe, tunteet, ruoka, keho |
| 🌿 2 | 3.–4. | Kirjoittaminen alkaa, yksinkertaiset lauseet | + numerot 11–20, vaatteet, koulu, sää, vapaa-aika, koti |
| 🌳 3 | 5.–6. | Lauseet ja keskustelut, tavoitteena A1.3 | + viikonpäivät, kuukaudet, kaupunki |

Ylemmällä tasolla ovat mukana myös alempien tasojen aiheet.

## Pelimuodot ja yhteys opetussuunnitelmaan

| Pelimuoto | Tasot | Tavoitealue |
|---|---|---|
| 👂 Kuuntele ja valitse | 1–3 | Taito tulkita tekstejä (kuullun ymmärtäminen) |
| 👀 Katso ja valitse | 1–3 | Taito tulkita tekstejä (luetun ymmärtäminen) |
| 🃏 Muistipeli | 1–3 | Sanaston oppiminen, kuva–sana–ääni-yhteys |
| 💬 Keskustelu | 1–3 | Taito toimia vuorovaikutuksessa |
| 🔤 Tavaa sana | 2–3 | Taito tuottaa tekstejä |
| 🧩 Rakenna lause | 2–3 | Taito tuottaa tekstejä, rakenteet |

Lisäksi:

- **Kielenopiskelutaidot:** itsearviointi jokaisen pelin lopussa, väärin menneiden kertauslista ja väärin menneet kysymykset uudelleen kierroksen lopussa
- **Kulttuurinen moninaisuus ja kielitietoisuus:** "Tiesitkö?"-faktat sekä brittiläinen ja amerikkalainen ääntämys
- **Kannustava palaute:** pelin läpäisystä saa aina vähintään yhden tähden, ja virhe näyttää aina oikean vastauksen

## Tekninen rakenne

- `index.html` – sivu
- `css/style.css` – ulkoasu (kosketusnäyttöystävällinen, saavutettava, vähennetty liike huomioitu)
- `js/data.js` – kaikki sanasto, lauseet, keskustelut ja faktat. Sisältöä voi muokata ilman ohjelmointia.
- `js/app.js` – pelilogiikka

Ääntäminen käyttää selaimen puhesynteesiä (Web Speech API). Äänen laatu riippuu laitteesta.

## Tietosuoja

Peli ei kerää eikä lähetä tietoja. Tähdet ja itsearvioinnit tallentuvat vain laitteen selaimeen (`localStorage`).

## Sisällön lisääminen

Lisää uusi aihe `js/data.js`-tiedoston `themes`-listaan:

```js
{ id: "fruit", name: "Hedelmät", icon: "🍇", level: 1,
  words: [ w("grapes", "viinirypäleet", "🍇"), ... ] }
```

`level` kertoo, miltä tasolta alkaen aihe näkyy. Aiheessa kannattaa olla vähintään 6 sanaa, jotta väärille vaihtoehdoille riittää sanoja.
