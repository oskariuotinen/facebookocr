/*
 * Pelin sisältö. Teemat ja taso noudattavat perusopetuksen
 * opetussuunnitelman perusteiden A1-englannin painotuksia:
 *  taso 1 = 1.–2. lk (suullinen, leikinomainen, lähiympäristö)
 *  taso 2 = 3.–4. lk (luku- ja kirjoitustaito mukaan, arjen tilanteet)
 *  taso 3 = 5.–6. lk (lauseet, aika, vapaa-aika, tavoite A1.3)
 *
 * Sana: { en, fi, pic }  pic = emoji, swatch = värinäyte, txt = iso teksti
 */
window.GAME_DATA = (function () {
  function w(en, fi, pic) { return { en: en, fi: fi, pic: pic }; }
  function c(en, fi, swatch) { return { en: en, fi: fi, swatch: swatch }; }
  function t(en, fi, txt) { return { en: en, fi: fi, txt: txt }; }

  var themes = [
    {
      id: "colours", name: "Värit", icon: "🎨", level: 1,
      words: [
        c("red", "punainen", "#e53935"), c("blue", "sininen", "#1e88e5"),
        c("green", "vihreä", "#43a047"), c("yellow", "keltainen", "#fdd835"),
        c("orange", "oranssi", "#fb8c00"), c("purple", "violetti", "#8e24aa"),
        c("pink", "vaaleanpunainen", "#f48fb1"), c("brown", "ruskea", "#795548"),
        c("black", "musta", "#212121"), c("white", "valkoinen", "#ffffff"),
        c("grey", "harmaa", "#9e9e9e")
      ]
    },
    {
      id: "numbers", name: "Numerot 1–10", icon: "🔢", level: 1,
      words: [
        t("one", "yksi", "1"), t("two", "kaksi", "2"), t("three", "kolme", "3"),
        t("four", "neljä", "4"), t("five", "viisi", "5"), t("six", "kuusi", "6"),
        t("seven", "seitsemän", "7"), t("eight", "kahdeksan", "8"),
        t("nine", "yhdeksän", "9"), t("ten", "kymmenen", "10")
      ]
    },
    {
      id: "animals", name: "Eläimet", icon: "🐾", level: 1,
      words: [
        w("cat", "kissa", "🐱"), w("dog", "koira", "🐶"), w("horse", "hevonen", "🐴"),
        w("cow", "lehmä", "🐮"), w("pig", "possu", "🐷"), w("bird", "lintu", "🐦"),
        w("fish", "kala", "🐟"), w("mouse", "hiiri", "🐭"), w("rabbit", "kani", "🐰"),
        w("bear", "karhu", "🐻"), w("elephant", "norsu", "🐘"), w("monkey", "apina", "🐵"),
        w("sheep", "lammas", "🐑"), w("duck", "ankka", "🦆"), w("frog", "sammakko", "🐸"),
        w("lion", "leijona", "🦁")
      ]
    },
    {
      id: "family", name: "Perhe", icon: "👪", level: 1,
      words: [
        w("mother", "äiti", "👩"), w("father", "isä", "👨"), w("sister", "sisko", "👧"),
        w("brother", "veli", "👦"), w("baby", "vauva", "👶"),
        w("grandmother", "isoäiti", "👵"), w("grandfather", "isoisä", "👴"),
        w("family", "perhe", "👪"), w("friend", "ystävä", "🧑‍🤝‍🧑")
      ]
    },
    {
      id: "feelings", name: "Tunteet", icon: "😊", level: 1,
      words: [
        w("happy", "iloinen", "😀"), w("sad", "surullinen", "😢"), w("angry", "vihainen", "😠"),
        w("tired", "väsynyt", "😴"), w("scared", "peloissaan", "😨"),
        w("surprised", "yllättynyt", "😲"), w("sick", "sairas", "🤒"), w("hot", "kuuma", "🥵"),
        w("cold", "kylmä", "🥶")
      ]
    },
    {
      id: "food", name: "Ruoka", icon: "🍎", level: 1,
      words: [
        w("apple", "omena", "🍎"), w("banana", "banaani", "🍌"), w("bread", "leipä", "🍞"),
        w("milk", "maito", "🥛"), w("cheese", "juusto", "🧀"), w("egg", "kananmuna", "🥚"),
        w("ice cream", "jäätelö", "🍦"), w("pizza", "pizza", "🍕"), w("carrot", "porkkana", "🥕"),
        w("strawberry", "mansikka", "🍓"), w("cake", "kakku", "🍰"), w("potato", "peruna", "🥔"),
        w("water", "vesi", "💧"), w("juice", "mehu", "🧃")
      ]
    },
    {
      id: "body", name: "Keho", icon: "🖐️", level: 1,
      words: [
        w("eye", "silmä", "👁️"), w("ear", "korva", "👂"), w("nose", "nenä", "👃"),
        w("mouth", "suu", "👄"), w("hand", "käsi", "✋"), w("foot", "jalkaterä", "🦶"),
        w("leg", "jalka", "🦵"), w("arm", "käsivarsi", "💪"), w("tooth", "hammas", "🦷")
      ]
    },
    {
      id: "numbers2", name: "Numerot 11–20", icon: "🔟", level: 2,
      words: [
        t("eleven", "yksitoista", "11"), t("twelve", "kaksitoista", "12"),
        t("thirteen", "kolmetoista", "13"), t("fourteen", "neljätoista", "14"),
        t("fifteen", "viisitoista", "15"), t("sixteen", "kuusitoista", "16"),
        t("seventeen", "seitsemäntoista", "17"), t("eighteen", "kahdeksantoista", "18"),
        t("nineteen", "yhdeksäntoista", "19"), t("twenty", "kaksikymmentä", "20")
      ]
    },
    {
      id: "clothes", name: "Vaatteet", icon: "👕", level: 2,
      words: [
        w("T-shirt", "T-paita", "👕"), w("trousers", "housut", "👖"), w("dress", "mekko", "👗"),
        w("shoes", "kengät", "👟"), w("cap", "lippis", "🧢"), w("socks", "sukat", "🧦"),
        w("coat", "takki", "🧥"), w("scarf", "huivi", "🧣"), w("gloves", "hanskat", "🧤"),
        w("boots", "saappaat", "👢")
      ]
    },
    {
      id: "school", name: "Koulu", icon: "🏫", level: 2,
      words: [
        w("book", "kirja", "📖"), w("pencil", "lyijykynä", "✏️"), w("pen", "kynä", "🖊️"),
        w("bag", "reppu", "🎒"), w("teacher", "opettaja", "🧑‍🏫"), w("school", "koulu", "🏫"),
        w("scissors", "sakset", "✂️"), w("ruler", "viivain", "📏"),
        w("computer", "tietokone", "💻"), w("chair", "tuoli", "🪑"), w("clock", "kello", "🕒")
      ]
    },
    {
      id: "weather", name: "Sää", icon: "🌦️", level: 2,
      words: [
        w("sunny", "aurinkoinen", "☀️"), w("rainy", "sateinen", "🌧️"),
        w("snowy", "luminen", "❄️"), w("cloudy", "pilvinen", "☁️"),
        w("windy", "tuulinen", "💨"), w("stormy", "myrskyinen", "⛈️"),
        w("rainbow", "sateenkaari", "🌈"), w("snowman", "lumiukko", "⛄")
      ]
    },
    {
      id: "hobbies", name: "Vapaa-aika", icon: "⚽", level: 2,
      words: [
        w("football", "jalkapallo", "⚽"), w("swimming", "uiminen", "🏊"),
        w("skiing", "hiihtäminen", "⛷️"), w("skating", "luistelu", "⛸️"),
        w("reading", "lukeminen", "📚"), w("dancing", "tanssiminen", "💃"),
        w("drawing", "piirtäminen", "🎨"), w("singing", "laulaminen", "🎤"),
        w("gaming", "pelaaminen", "🎮"), w("cycling", "pyöräily", "🚴")
      ]
    },
    {
      id: "home", name: "Koti", icon: "🏠", level: 2,
      words: [
        w("house", "talo", "🏠"), w("bed", "sänky", "🛏️"), w("door", "ovi", "🚪"),
        w("window", "ikkuna", "🪟"), w("sofa", "sohva", "🛋️"), w("bath", "kylpyamme", "🛁"),
        w("TV", "televisio", "📺"), w("key", "avain", "🔑"), w("lamp", "lamppu", "💡")
      ]
    },
    {
      id: "days", name: "Viikonpäivät", icon: "📅", level: 3,
      words: [
        t("Monday", "maanantai"), t("Tuesday", "tiistai"), t("Wednesday", "keskiviikko"),
        t("Thursday", "torstai"), t("Friday", "perjantai"), t("Saturday", "lauantai"),
        t("Sunday", "sunnuntai")
      ]
    },
    {
      id: "months", name: "Kuukaudet", icon: "🗓️", level: 3,
      words: [
        t("January", "tammikuu"), t("February", "helmikuu"), t("March", "maaliskuu"),
        t("April", "huhtikuu"), t("May", "toukokuu"), t("June", "kesäkuu"),
        t("July", "heinäkuu"), t("August", "elokuu"), t("September", "syyskuu"),
        t("October", "lokakuu"), t("November", "marraskuu"), t("December", "joulukuu")
      ]
    },
    {
      id: "town", name: "Kaupunki", icon: "🏙️", level: 3,
      words: [
        w("shop", "kauppa", "🏪"), w("hospital", "sairaala", "🏥"), w("park", "puisto", "🏞️"),
        w("station", "asema", "🚉"), w("café", "kahvila", "☕"), w("library", "kirjasto", "🏛️"),
        w("bus", "bussi", "🚌"), w("car", "auto", "🚗"), w("train", "juna", "🚆"),
        w("bike", "polkupyörä", "🚲")
      ]
    }
  ];

  // Lauseet: suomenkielinen merkitys -> englanninkielinen lause.
  var sentences = [
    { level: 2, fi: "Minä pidän omenoista.", en: "I like apples." },
    { level: 2, fi: "Tämä on minun kissani.", en: "This is my cat." },
    { level: 2, fi: "Minulla on koira.", en: "I have a dog." },
    { level: 2, fi: "Se on punainen.", en: "It is red." },
    { level: 2, fi: "Minun nimeni on Aino.", en: "My name is Aino." },
    { level: 2, fi: "Olen yhdeksänvuotias.", en: "I am nine." },
    { level: 2, fi: "Tänään on aurinkoista.", en: "It is sunny today." },
    { level: 2, fi: "Olen iloinen.", en: "I am happy." },
    { level: 2, fi: "Minulla on sininen reppu.", en: "I have a blue bag." },
    { level: 2, fi: "Hän on minun siskoni.", en: "She is my sister." },
    { level: 3, fi: "Osaan uida todella hyvin.", en: "I can swim very well." },
    { level: 3, fi: "Hänellä on kaksi veljeä.", en: "She has got two brothers." },
    { level: 3, fi: "Pelaamme jalkapalloa lauantaina.", en: "We play football on Saturday." },
    { level: 3, fi: "Lempivärini on sininen.", en: "My favourite colour is blue." },
    { level: 3, fi: "Pidätkö pizzasta?", en: "Do you like pizza?" },
    { level: 3, fi: "Tänään on kylmää ja lumista.", en: "It is cold and snowy today." },
    { level: 3, fi: "Hän ei pidä maidosta.", en: "He doesn't like milk." },
    { level: 3, fi: "Kissa on pöydän alla.", en: "The cat is under the table." },
    { level: 3, fi: "Menen kouluun bussilla.", en: "I go to school by bus." },
    { level: 3, fi: "Paljonko kello on?", en: "What time is it?" },
    { level: 3, fi: "Syntymäpäiväni on toukokuussa.", en: "My birthday is in May." },
    { level: 3, fi: "Missä kirjasto on?", en: "Where is the library?" }
  ];

  // Keskustelut: hahmo sanoo jotain, oppilas valitsee sopivan vastauksen.
  var dialogues = [
    { level: 1, who: "🧒", say: "Hello!", ok: "Hi!", bad: ["Thank you.", "Yes, I can."] },
    { level: 1, who: "👩‍🏫", say: "What's your name?", ok: "My name is Leo.", bad: ["I'm fine.", "It's blue."] },
    { level: 1, who: "👧", say: "How are you?", ok: "I'm fine, thank you.", bad: ["I'm Leo.", "Goodbye!"] },
    { level: 1, who: "👦", say: "Thank you!", ok: "You're welcome.", bad: ["Hello!", "I'm seven."] },
    { level: 1, who: "👵", say: "Goodbye!", ok: "Bye! See you!", bad: ["Good morning!", "Yes, please."] },
    { level: 1, who: "👨", say: "Good morning!", ok: "Good morning!", bad: ["Good night!", "No, thanks."] },
    { level: 1, who: "🧒", say: "How old are you?", ok: "I'm seven.", bad: ["I'm fine.", "It's a cat."] },
    { level: 1, who: "👧", say: "What colour is it? 🔴", ok: "It's red.", bad: ["It's a dog.", "It's ten."] },
    { level: 2, who: "👦", say: "Do you like ice cream?", ok: "Yes, I do.", bad: ["Yes, I am.", "It's Monday."] },
    { level: 2, who: "👩", say: "Can you swim?", ok: "Yes, I can.", bad: ["Yes, I do.", "I'm nine."] },
    { level: 2, who: "🧒", say: "Have you got a pet?", ok: "Yes, I've got a cat.", bad: ["Yes, I can.", "It's sunny."] },
    { level: 2, who: "👨‍🍳", say: "Would you like some juice?", ok: "Yes, please.", bad: ["You're welcome.", "I'm from Finland."] },
    { level: 2, who: "👧", say: "Where do you live?", ok: "I live in Finland.", bad: ["I like pizza.", "At seven."] },
    { level: 2, who: "👦", say: "Sorry!", ok: "That's OK.", bad: ["Me too!", "Good morning!"] },
    { level: 2, who: "👩‍🏫", say: "What's the weather like?", ok: "It's rainy.", bad: ["It's a book.", "I'm happy, thanks."] },
    { level: 3, who: "🧑", say: "What do you do in your free time?", ok: "I play football and read.", bad: ["I'm eleven.", "It's on Friday."] },
    { level: 3, who: "👩‍💼", say: "Excuse me, where is the station?", ok: "It's next to the park.", bad: ["It's half past two.", "Yes, I have."] },
    { level: 3, who: "👧", say: "When is your birthday?", ok: "It's in May.", bad: ["It's in Helsinki.", "I'm twelve."] },
    { level: 3, who: "👦", say: "What time is it?", ok: "It's three o'clock.", bad: ["It's Tuesday.", "It's cold."] },
    { level: 3, who: "🧑‍🏫", say: "What's your favourite subject?", ok: "My favourite subject is art.", bad: ["My favourite food is pizza.", "I go by bus."] },
    { level: 3, who: "👨", say: "How do you get to school?", ok: "I walk.", bad: ["At eight o'clock.", "I like school."] },
    { level: 3, who: "👩", say: "Shall we go to the park?", ok: "Good idea! Let's go.", bad: ["No, I'm not.", "It's my bag."] }
  ];

  // Kielitietoisuus ja kulttuurinen moninaisuus: lyhyitä faktoja tulosruutuun.
  var facts = [
    "Englantia puhutaan äidinkielenä esimerkiksi Britanniassa, Irlannissa, Yhdysvalloissa, Kanadassa, Australiassa ja Uudessa-Seelannissa.",
    "Monet suomen sanat ovat tulleet englannista, esimerkiksi pizza, banaani ja T-paita.",
    "Britanniassa sanotaan 'colour' ja Yhdysvalloissa 'color'. Molemmat ovat oikein!",
    "Englannissa viikonpäivät ja kuukaudet kirjoitetaan isolla: Monday, May.",
    "Englannissa 'I' eli 'minä' kirjoitetaan aina isolla kirjaimella.",
    "Intiassa ja Nigeriassa englanti on yksi virallisista kielistä.",
    "Englannissa sanan voi lausua eri tavalla kuin se kirjoitetaan. Kuuntele tarkasti!",
    "Kun et tiedä sanaa, voit kysyä: 'What is ... in English?'"
  ];

  return { themes: themes, sentences: sentences, dialogues: dialogues, facts: facts };
})();
