// ==========================================
// LA TERRA È VIVA
// Mappa interattiva
// ==========================================

const map = L.map("map", {
    center: [20, 10],
    zoom: 2,
    minZoom: 2,
    maxZoom: 7,

    worldCopyJump: true,
    continuousWorld: true
});

// ==========================================
// MAPPE DI BASE
// ==========================================

// Carta normale
const mappaStradale = L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
    }
);

// Carta fisica / topografica
const mappaFisica = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
        attribution:
            'Map data &copy; OpenStreetMap contributors, SRTM | Map style &copy; OpenTopoMap',
        maxZoom: 17
    }
);

// All'avvio usiamo la carta normale
mappaStradale.addTo(map);

// ==========================================
// SELETTORE DELLA CARTA
// ==========================================

const baseMaps = {

    "🗺️ TETTONICA": mappaStradale,

    "🏔️ FISICA": mappaFisica

};

// ==========================================
// SELETTORE DELLA CARTA
// ==========================================

const layerControl = L.control.layers(
    baseMaps,
    null,
    {
        position: "topright",
        collapsed: false
    }
);

layerControl.addTo(map);

// ==========================================
// CAMBIO MODALITÀ DELLA MAPPA
// ==========================================

map.on("baselayerchange", function (event) {

    // 🗺️ TETTONICA

    if (event.name === "🗺️ TETTONICA") {

        // Mostra le placche
        platesGroup.addTo(map);

        // Mostra i confini
        boundariesGroup.addTo(map);

    }

    // 🏔️ FISICA

    else if (event.name === "🏔️ FISICA") {

        // Nasconde le placche
        map.removeLayer(platesGroup);

        // Nasconde i confini
        map.removeLayer(boundariesGroup);

    }
});

// ==========================================
// SUPERFICI DELLE PLACCHE TETTONICHE
// ==========================================

const platesURL =
    "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

const plateColors = {

    AF: "#f6bd60",
    AM: "#60f697ff",
    AN: "#90dbf4",
    AP: "#9f93ebff",
    AR: "#f8961e",
    AT: "#80973aff",
    AU: "#f28482",
    CA: "#f9c74f",
    CO: "#43aa8b",
    EU: "#c084fc",
    IN: "#ff8c42",
    NA: "#4cc9f0",
    ND: "#4cc9f0",
    NZ: "#579073ff",
    PA: "#e85d75",
    PS: "#bc6ff1",
    SA: "#72d572",
    SC: "#72d572",
    SO: "#e24543ff",
    SU: "#dbd775ff",
    YA: "#4730b7ff"
};

const plateDescriptions = {

    AF:
        "Comprende il continente africano e parte dei fondali oceanici circostanti. A est è interessata dal processo di rifting della Rift Valley, dove la litosfera si frattura e tende a separarsi, mentre nell'Atlantico si allontana dalle placche americane.",

    AM:
        "Si trova nell’Asia orientale e comprende parti della Cina nord-orientale e della Russia.",

    AN:
        "Comprende il continente antartico e i fondali oceanici circostanti. I suoi margini sono prevalentemente divergenti, dove la risalita del magma permette la formazione di nuova crosta oceanica.",

    AP:
        "L’Altiplano è un vasto altopiano situato tra Perù e Bolivia, nelle Ande centrali, e non una placca tettonica autonoma. La sua formazione è legata alla convergenza tra la placca di Nazca e quella Sudamericana.",

    AR:
        "Comprende la penisola Arabica e le aree circostanti. Si muove verso nord-est, entrando in collisione con la placca Eurasiatica e contribuendo alla formazione dei Monti Zagros.",

    AT:
        "Comprende gran parte della Turchia. Spinta dalla convergenza tra la placca Arabica e quella Eurasiatica, si sposta verso ovest lungo importanti faglie trascorrenti, come la faglia anatolica settentrionale, che provoca forti terremoti.",

    AU:
        "Comprende l'Australia e vaste aree oceaniche circostanti. Si muove verso nord-est e interagisce con la placca Pacifica, causando fenomeni di subduzione e attività sismica.",

    CA:
        "Comprende gran parte del fondale del Mar dei Caraibi. Interagisce con le placche Nordamericana, Sudamericana e Cocos, generando terremoti e attività vulcanica soprattutto nelle Antille.",

    CO:
        "Si trova nell'Oceano Pacifico, al largo dell'America Centrale. Sprofonda sotto le placche circostanti, provocando terremoti, vulcanismo e la formazione di fosse oceaniche.",

    EU:
        "Comprende gran parte dell'Europa e dell'Asia. A sud converge con le placche Africana e Indiana, provocando la formazione di catene montuose come le Alpi e l'Himalaya, oltre a frequenti terremoti.",

    IN:
        "Comprende il subcontinente indiano e parte dell'Oceano Indiano. La sua collisione con la placca Eurasiatica ha determinato la formazione dell'Himalaya e dell'altopiano del Tibet.",

    NA:
        "Comprende gran parte del Nord America, la Groenlandia e porzioni degli oceani circostanti. A ovest interagisce con la placca Pacifica, causando terremoti, mentre a est si allontana dalla placca Eurasiatica lungo la dorsale medio-atlantica.",

    ND:
        "È una porzione crostale situata soprattutto tra Colombia ed Ecuador, non una placca principale autonoma. La sua dinamica è influenzata dall’interazione tra le placche di Nazca, Sudamericana e Caraibica.",

    NZ:
        "È una placca oceanica situata al largo del Sud America. Sprofonda sotto la placca Sudamericana mediante subduzione, causando la formazione delle Ande, della fossa Perù-Cile e di numerosi terremoti.",

    PA:
        "È la placca più estesa della Terra ed è costituita prevalentemente da crosta oceanica. I suoi margini sono caratterizzati da subduzione e intensa attività sismica e vulcanica, soprattutto lungo la Cintura di fuoco del Pacifico.",

    PS:
        "È una placca prevalentemente oceanica situata nel Pacifico occidentale. I suoi margini convergenti favoriscono la subduzione, causando numerosi terremoti, vulcani e fosse oceaniche.",

    SA:
        "Comprende il Sud America e parte dell'Oceano Atlantico. A ovest la placca di Nazca sprofonda sotto di essa per subduzione, provocando la formazione delle Ande e frequenti terremoti ed eruzioni vulcaniche.",

    SC:
        "Si trova tra l'estremità meridionale del Sud America e l'Antartide. I suoi movimenti convergenti e trascorrenti contribuiscono alla formazione di strutture oceaniche e all'attività sismica regionale.",

    SO:
        "La placca Somala comprende la parte orientale dell’Africa e si sta separando dalla placca Nubiana attraverso il processo di rifting della Rift Valley. Questo movimento potrebbe portare alla formazione di un nuovo oceano.",

    SU: 
        "Si trova nel Sud-est asiatico e comprende la penisola indocinese e parte dell’Indonesia.",

    YA: 
        "Si trova nella Cina centro-meridionale ed è considerata un blocco tettonico continentale. Risente delle spinte generate dalla collisione tra la placca Indiana e quella Eurasiatica."
};

// ==========================================
// GRUPPO DI TUTTE LE PLACCHE
// ==========================================

const platesGroup = L.layerGroup();

// ==========================================
// FUNZIONE PER CREARE LE PLACCHE
// ==========================================

function creaPlacche(data, offset = 0) {
    const pane = map.createPane(
        `plates-pane-${offset}`
    );

    pane.style.zIndex = 300;

    const layer = L.geoJSON(data, {

        coordsToLatLng: function(coords) {

            return L.latLng(
                coords[1],
                coords[0] + offset
            );

        },

        style: function(feature) {

            const codice =
                feature.properties.Code;

            const colore =
                plateColors[codice] || "#777777";

            return {

                fillColor: colore,

                fillOpacity: 0.18,

                color: colore,

                weight: 1,

                opacity: 0.7,

                pane: `plates-pane-${offset}`

            };

        },

        onEachFeature: function(feature, layer) {

            const codice =
                feature.properties.Code;

            const nome =
                feature.properties.PlateName;

            const colore =
                plateColors[codice] || "#777777";

            const descrizione =
                plateDescriptions[codice] ||
                "Placca di dimensioni e importanza secondarie.";

            layer.on("mouseover", function() {

                this.setStyle({

                    fillColor: colore,

                    fillOpacity: 0.45,

                    color: "#ffffff",

                    weight: 2

                });

            });

            layer.on("mouseout", function() {

                this.setStyle({

                    fillColor: colore,

                    fillOpacity: 0.18,

                    color: colore,

                    weight: 1

                });

            });

            layer.bindPopup(`

                <div class="plate-popup">

                    <h3 style="color:${colore}">
                        ${nome}
                    </h3>

                    <p>
                        ${descrizione}
                    </p>

                    <span class="tag">
                        PLACCA TETTONICA · ${codice}
                    </span>

                </div>

            `);

        }

    });

    platesGroup.addLayer(layer);
}

// ==========================================
// CARICAMENTO DEI DATI
// ==========================================

fetch(platesURL)

    .then(response => response.json())

    .then(data => {

        // Terra centrale
        creaPlacche(data, 0);

        // Copia a sinistra
        creaPlacche(data, -360);

        // Copia a destra
        creaPlacche(data, 360);

        // Aggiunge tutte le placche alla mappa
        platesGroup.addTo(map);
    })

    .catch(error => {

        console.error(
            "Errore nel caricamento delle placche:",
            error
        );
    });

// ==========================================
// CONFINI DELLE PLACCHE TETTONICHE
// ==========================================

const plateBoundariesURL =
    "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

    // Gruppo di tutte le linee tettoniche
let boundariesGroup = L.layerGroup();

fetch(plateBoundariesURL)

    .then(response => response.json())

    .then(data => {

        boundariesGroup = L.geoJSON(data, {

            style: function (feature) {

    const tipo =
        (feature.properties.Type || "")
        .toLowerCase();

    // SUBDUZIONE

    if (tipo.includes("subduction")) {

        return {
            color: "#ff453a",
            weight: 3,
            opacity: 0.95
        };

    }

    // CONFINE GENERICO

    return {
        color: "#8e9aaf",
        weight: 1.5,
        opacity: 0.7
    };

},

            onEachFeature: function (feature, layer) {

                console.log(
                "TIPO CONFINE:",
                feature.properties.Type
                );

                const tipo = feature.properties.Type;

                const placcaA = feature.properties.PlateA || "?";
                const placcaB = feature.properties.PlateB || "?";

                let titolo;
                let descrizione;
                let colore;

                // SUBDUZIONE

                if (tipo === "subduction") {

                    titolo = "Zona di subduzione";

                    colore = "#ff453a";

                    descrizione = `
                        Una placca tettonica scivola
                        sotto un'altra e sprofonda nel mantello.
                        <br><br>
                        Queste zone sono associate a
                        <strong>terremoti profondi</strong>,
                        <strong>vulcani</strong> e, in alcuni casi,
                        <strong>tsunami</strong>.
                    `;

                }

                // ==========================================
                // CONFINE GENERICO
                // ==========================================

                else {

                    titolo = "Confine tra placche";

                    colore = "#4cc9f0";

                    descrizione = `
                        Questa linea rappresenta un confine
                        tra due placche della litosfera.
                        <br><br>
                        <strong>${placcaA}</strong>
                        ↔
                        <strong>${placcaB}</strong>
                    `;

                }


                // ==========================================
                // POPUP
                // ==========================================

                layer.bindPopup(`

                    <div class="plate-popup">

                        <h3 style="color:${colore}">
                            ${titolo}
                        </h3>

                        <p>
                            ${descrizione}
                        </p>

                        <span class="tag">
                            ${placcaA} — ${placcaB}
                        </span>

                    </div>

                `);


            // ==========================================
            // MOUSEOVER
            // ==========================================

            layer.on("mouseover", function () {

                    const tipoHover =
                        (feature.properties.Type || "")
                        .toLowerCase();


                    let nuovoColore;
                    let nuovoPeso;

                    if (tipoHover === "subduction") {

                        nuovoColore = "#ff6b5a";
                        nuovoPeso = 4;

                    } else {

                        nuovoColore = "#ffffff";
                        nuovoPeso = 2.5;

                    }

                    this.setStyle({

                        color: nuovoColore,

                        weight: nuovoPeso,

                        opacity: 1

                    });

                });


            // ==========================================
            // MOUSEOUT
            // ==========================================

                layer.on("mouseout", function () {

                const tipoOut =
                    (feature.properties.Type || "")
                    .toLowerCase();


                let colore;
                let peso;


                if (tipoOut.includes("subduction")) {

                    colore = "#ff453a";
                    peso = 3;

                }

                else if (
                    tipoOut.includes("ridge") ||
                    tipoOut.includes("divergent")
                ) {

                    colore = "#ff9f43";
                    peso = 2.5;

                }

                else if (
                    tipoOut.includes("transform") ||
                    tipoOut.includes("transforming")
                ) {

                    colore = "#4cc9f0";
                    peso = 2;

                }

                else {

                    colore = "#8e9aaf";
                    peso = 1.5;

                }

                this.setStyle({

                    color: colore,

                    weight: peso,

                    opacity: 0.75

                });

            });

            }

        });

    // Aggiunge le linee solo se siamo nella modalità TETTONICA
    if (map.hasLayer(mappaStradale)) {

    boundariesGroup.addTo(map);
}
    })
    .catch(error => {

        console.error(
            "Errore nel caricamento dei confini:",
            error
        );

    });

// ==========================================
// DATI DEI LUOGHI
// ==========================================

const luoghi = [

    // ==========================================
    // 🌋 VULCANOLOGIA
    // ==========================================

    {
        nome: "Etna",
        tipo: "vulcano",
        livello: "principale",
        lat: 37.751,
        lon: 14.993,
        posizione: "Sicilia, Italia",
        dati: [
            ["Tipo", "Stratovulcano"],
            ["Ultima eruzione", "Attività eruttiva frequente; verificare i dati aggiornati"],
            ["Eruzione famosa", "1669"]
        ],
        descrizione:
            "L'Etna è uno dei vulcani più attivi d'Europa e si trova sulla costa orientale della Sicilia.",
        importanza:
            "È fondamentale per lo studio del vulcanismo attivo, delle colate laviche e del rischio per le comunità circostanti."
    },
    {
        nome: "Vesuvio",
        tipo: "vulcano",
        livello: "principale",
        lat: 40.821,
        lon: 14.426,
        posizione: "Campania, Italia",
        dati: [
            ["Tipo", "Stratovulcano"],
            ["Ultima eruzione", "1944"],
            ["Eruzione famosa", "79 d.C."]
        ],
        descrizione:
            "Il Vesuvio è celebre per l'eruzione del 79 d.C., che seppellì Pompei ed Ercolano sotto depositi vulcanici.",
        importanza:
            "È uno dei vulcani più studiati al mondo per il rischio vulcanico in un'area densamente popolata."
    },
    {
        nome: "Kīlauea",
        tipo: "vulcano",
        livello: "principale",
        lat: 19.421,
        lon: -155.287,
        posizione: "Isola di Hawaiʻi, Stati Uniti",
        dati: [
            ["Tipo", "Vulcano a scudo"],
            ["Ultima eruzione", "Attività intermittente documentata dal 2024; verificare aggiornamenti"],
            ["Eruzione famosa", "1983-2018"]
        ],
        descrizione:
            "Il Kīlauea è un vulcano a scudo noto per le sue eruzioni effusive e le colate di lava basaltica.",
        importanza:
            "È un laboratorio naturale per comprendere la dinamica del magma, la formazione della lava e l'evoluzione dei vulcani a scudo."
    },
    {
        nome: "Monte Fuji",
        tipo: "vulcano",
        livello: "principale",
        lat: 35.361,
        lon: 138.727,
        posizione: "Honshū, Giappone",
        dati: [
            ["Tipo", "Stratovulcano"],
            ["Ultima eruzione", "1707-1708"],
            ["Eruzione famosa", "Eruzione Hōei del 1707"]
        ],
        descrizione:
            "Il Monte Fuji è un vulcano dalla caratteristica forma conica ed è una delle montagne più riconoscibili del Giappone.",
        importanza:
            "Ha un enorme valore culturale e paesaggistico ed è importante per lo studio del rischio vulcanico giapponese."
    },
    {
        nome: "Krakatau",
        tipo: "vulcano",
        livello: "principale",
        lat: -6.102,
        lon: 105.423,
        posizione: "Stretto della Sonda, Indonesia",
        dati: [
            ["Tipo", "Complesso vulcanico insulare"],
            ["Ultima eruzione", "Attività recente; verificare i rapporti aggiornati"],
            ["Eruzione famosa", "1883"]
        ],
        descrizione:
            "Krakatau è un complesso vulcanico situato tra Giava e Sumatra. La catastrofica eruzione del 1883 provocò esplosioni, tsunami e conseguenze climatiche globali.",
        importanza:
            "È un caso storico fondamentale per comprendere le grandi eruzioni esplosive e i tsunami di origine vulcanica."
    },

    // =========================
    // 15 VULCANI SECONDARI
    // =========================
    {
        nome: "Stromboli",
        tipo: "vulcano",
        livello: "secondario",
        lat: 38.789,
        lon: 15.213,
        posizione: "Isole Eolie, Sicilia, Italia",
        dati: [
            ["Tipo", "Stratovulcano"],
            ["Ultima eruzione", "Attività persistente; verificare i rapporti aggiornati"],
            ["Eruzione famosa", "Attività esplosiva documentata da secoli"]
        ],
        descrizione:
            "Stromboli è famoso per le esplosioni relativamente frequenti che lanciano materiale incandescente dal cratere.",
        importanza:
            "Ha dato il nome allo stile stromboliano, caratterizzato da esplosioni intermittenti."
    },
    {
        nome: "Monte Sant'Elena",
        tipo: "vulcano",
        livello: "secondario",
        lat: 46.200,
        lon: -122.188,
        posizione: "Washington, Stati Uniti",
        dati: [
            ["Tipo", "Stratovulcano"],
            ["Ultima eruzione", "2008, inizio di una fase di crescita del duomo"],
            ["Eruzione famosa", "1980"]
        ],
        descrizione:
            "Il Monte Sant'Elena è noto per la grande eruzione esplosiva del 18 maggio 1980, che modificò profondamente il paesaggio.",
        importanza:
            "È un importante caso di studio sugli effetti delle esplosioni vulcaniche, delle frane e delle correnti piroclastiche."
    },
    {
        nome: "Popocatépetl",
        tipo: "vulcano",
        livello: "secondario",
        lat: 19.023,
        lon: -98.622,
        posizione: "Messico centrale, Messico",
        dati: [
            ["Tipo", "Stratovulcano"],
            ["Ultima eruzione", "Attività recente e ricorrente"],
            ["Eruzione famosa", "Eruzioni esplosive del XX e XXI secolo"]
        ],
        descrizione:
            "Il Popocatépetl è un grande vulcano messicano situato in una regione con un'elevata densità di popolazione.",
        importanza:
            "È importante per il monitoraggio delle emissioni di cenere e per la gestione delle emergenze vulcaniche."
    },
    {
        nome: "Merapi",
        tipo: "vulcano",
        livello: "secondario",
        lat: -7.540,
        lon: 110.446,
        posizione: "Giava centrale, Indonesia",
        dati: [
            ["Tipo", "Stratovulcano"],
            ["Ultima eruzione", "Attività eruttiva persistente documentata negli ultimi anni"],
            ["Eruzione famosa", "2010"]
        ],
        descrizione:
            "Il Merapi è uno dei vulcani più attivi dell'Indonesia ed è noto per la crescita e il collasso dei duomi lavici.",
        importanza:
            "Le sue colate piroclastiche rappresentano un importante riferimento per lo studio dei rischi vulcanici."
    },
    {
        nome: "Mayon",
        tipo: "vulcano",
        livello: "secondario",
        lat: 13.257,
        lon: 123.685,
        posizione: "Albay, Filippine",
        dati: [
            ["Tipo", "Stratovulcano"],
            ["Ultima eruzione", "Attività eruttiva documentata nel 2026; verificare aggiornamenti"],
            ["Eruzione famosa", "1814"]
        ],
        descrizione:
            "Il Mayon è celebre per la sua forma conica quasi simmetrica e per le frequenti eruzioni esplosive ed effusive.",
        importanza:
            "È un riferimento per lo studio dei vulcani tropicali e dei rischi per le comunità ai piedi del cono."
    },
    {
        nome: "Pinatubo",
        tipo: "vulcano",
        livello: "secondario",
        lat: 15.142,
        lon: 120.350,
        posizione: "Isola di Luzon, Filippine",
        dati: [
            ["Tipo", "Stratovulcano"],
            ["Ultima eruzione", "1992, attività post-eruttiva"],
            ["Eruzione famosa", "1991"]
        ],
        descrizione:
            "Il Pinatubo divenne famoso nel 1991 per una grande eruzione esplosiva che generò una vasta caldera.",
        importanza:
            "L'eruzione del 1991 è essenziale per lo studio degli effetti degli aerosol vulcanici sul clima globale."
    },
    {
        nome: "Eyjafjallajökull",
        tipo: "vulcano",
        livello: "secondario",
        lat: 63.633,
        lon: -19.620,
        posizione: "Islanda meridionale, Islanda",
        dati: [
            ["Tipo", "Stratovulcano coperto da ghiacciaio"],
            ["Ultima eruzione", "2010"],
            ["Eruzione famosa", "2010"]
        ],
        descrizione:
            "L'eruzione del 2010 produsse una nube di cenere che provocò importanti interruzioni del traffico aereo europeo.",
        importanza:
            "È un esempio significativo delle interazioni tra magma, ghiaccio e atmosfera."
    },
    {
        nome: "Nyiragongo",
        tipo: "vulcano",
        livello: "secondario",
        lat: -1.520,
        lon: 29.250,
        posizione: "Virunga, Repubblica Democratica del Congo",
        dati: [
            ["Tipo", "Stratovulcano"],
            ["Ultima eruzione", "2021"],
            ["Eruzione famosa", "1977 e 2002"]
        ],
        descrizione:
            "Il Nyiragongo è noto per la sua lava basaltica molto fluida e per la presenza storica di un lago di lava nel cratere.",
        importanza:
            "Le sue colate possono avanzare rapidamente e rappresentano una seria minaccia per gli insediamenti vicini."
    },
    {
        nome: "Cotopaxi",
        tipo: "vulcano",
        livello: "secondario",
        lat: -0.680,
        lon: -78.437,
        posizione: "Ande, Ecuador",
        dati: [
            ["Tipo", "Stratovulcano"],
            ["Ultima eruzione", "Attività eruttiva recente; verificare i rapporti aggiornati"],
            ["Eruzione famosa", "1877"]
        ],
        descrizione:
            "Il Cotopaxi è un alto vulcano andino ricoperto da ghiacciai sulle parti sommitali.",
        importanza:
            "Il rischio di colate di fango vulcaniche, o lahar, è particolarmente rilevante per le valli circostanti."
    },
    {
        nome: "Villarrica",
        tipo: "vulcano",
        livello: "secondario",
        lat: -39.420,
        lon: -71.930,
        posizione: "Regione dell'Araucanía, Cile",
        dati: [
            ["Tipo", "Stratovulcano"],
            ["Ultima eruzione", "2025, attività documentata; verificare aggiornamenti"],
            ["Eruzione famosa", "1971"]
        ],
        descrizione:
            "Il Villarrica è uno dei vulcani più attivi del Cile e presenta un cratere sommitale con attività persistente in diversi periodi.",
        importanza:
            "È utile per studiare l'attività stromboliana, le fontane di lava e le interazioni tra eruzioni e ghiacciai."
    },
    {
        nome: "Sakurajima",
        tipo: "vulcano",
        livello: "secondario",
        lat: 31.580,
        lon: 130.657,
        posizione: "Prefettura di Kagoshima, Giappone",
        dati: [
            ["Tipo", "Stratovulcano"],
            ["Ultima eruzione", "Attività esplosiva ricorrente"],
            ["Eruzione famosa", "1914"]
        ],
        descrizione:
            "Sakurajima è un vulcano molto attivo vicino alla città di Kagoshima, noto per le frequenti emissioni di cenere.",
        importanza:
            "È un caso importante per lo studio della convivenza tra attività vulcanica e grandi aree urbane."
    },
    {
        nome: "Taal",
        tipo: "vulcano",
        livello: "secondario",
        lat: 14.002,
        lon: 120.993,
        posizione: "Isola di Luzon, Filippine",
        dati: [
            ["Tipo", "Complesso vulcanico con caldera"],
            ["Ultima eruzione", "Attività recente; verificare i rapporti aggiornati"],
            ["Eruzione famosa", "1911 e 2020"]
        ],
        descrizione:
            "Il Taal è un complesso vulcanico situato all'interno di un lago, caratterizzato da una storia di eruzioni esplosive.",
        importanza:
            "È importante per lo studio dei sistemi vulcanici lacustri e dei rischi associati a cenere, gas e fenomeni esplosivi."
    },
    {
        nome: "Fuego",
        tipo: "vulcano",
        livello: "secondario",
        lat: 14.473,
        lon: -90.880,
        posizione: "Guatemala meridionale, Guatemala",
        dati: [
            ["Tipo", "Stratovulcano"],
            ["Ultima eruzione", "Attività persistente documentata negli ultimi anni"],
            ["Eruzione famosa", "2018"]
        ],
        descrizione:
            "Fuego è un vulcano molto attivo dell'America centrale, caratterizzato da esplosioni frequenti e correnti piroclastiche.",
        importanza:
            "L'eruzione del 2018 ha evidenziato la pericolosità delle correnti piroclastiche per i villaggi circostanti."
    },
    {
        nome: "Sangay",
        tipo: "vulcano",
        livello: "secondario",
        lat: -2.005,
        lon: -78.341,
        posizione: "Ande orientali, Ecuador",
        dati: [
            ["Tipo", "Stratovulcano"],
            ["Ultima eruzione", "Attività eruttiva persistente documentata dal 2019"],
            ["Eruzione famosa", "Eruzioni esplosive del XX secolo"]
        ],
        descrizione:
            "Il Sangay è un vulcano remoto delle Ande e presenta frequenti emissioni di cenere e colate laviche.",
        importanza:
            "È importante per lo studio del vulcanismo persistente e della dispersione delle ceneri in aree andine."
    },
    {
        nome: "Piton de la Fournaise",
        tipo: "vulcano",
        livello: "secondario",
        lat: -21.244,
        lon: 55.708,
        posizione: "Isola della Riunione, oceano Indiano",
        dati: [
            ["Tipo", "Vulcano a scudo"],
            ["Ultima eruzione", "2026, secondo rapporti eruttivi; verificare aggiornamenti"],
            ["Eruzione famosa", "Eruzioni effusive ricorrenti"]
        ],
        descrizione:
            "Il Piton de la Fournaise è un vulcano a scudo noto per le frequenti eruzioni basaltiche e le colate laviche.",
        importanza:
            "È uno dei siti più studiati per comprendere le eruzioni effusive e l'evoluzione dei vulcani a scudo."
    },
    {
        nome: "Monte Erebus",
        tipo: "vulcano",
        livello: "secondario",
        lat: -77.530,
        lon: 167.170,
        posizione: "Isola di Ross, Antartide",
        dati: [
            ["Tipo", "Stratovulcano"],
            ["Ultima eruzione", "Attività persistente documentata in epoca moderna"],
            ["Eruzione famosa", "Attività con lago di lava osservata dal 1972"]
        ],
        descrizione:
            "Il Monte Erebus è uno dei vulcani attivi più meridionali della Terra e si trova in un ambiente antartico estremo.",
        importanza:
            "È un sito eccezionale per lo studio del magma, dei gas vulcanici e dei laghi di lava in condizioni polari."
    },


    // ==========================================
    // ⚡ TERREMOTI
    // ==========================================

    {
        nome: "Shaanxi 1556",
        tipo: "terremoto",
        livello: "principale",
        lat: 34.5,
        lon: 109.3,

        posizione: "Shaanxi, Cina",

        dati: [
            ["Data", "23 gennaio 1556"],
            ["Magnitudo", "Circa 8,0 (stima)"],
            ["Vittime", "Circa 830.000 (stima storica)"],
            ["Fenomeno", "Terremoto e frane"]
        ],

        descrizione:
            "Uno dei terremoti più mortali della storia, che devastò vaste aree della provincia cinese dello Shaanxi.",

        importanza:
            "È un caso emblematico della vulnerabilità degli insediamenti e delle abitazioni tradizionali agli effetti dei terremoti."
    },

    {
        nome: "Lisbona 1755",
        tipo: "terremoto",
        livello: "principale",
        lat: 36.97,
        lon: -10.0,

        posizione: "Oceano Atlantico, al largo del Portogallo",

        dati: [
            ["Data", "1 novembre 1755"],
            ["Magnitudo", "Circa 8,5–9,0 (stima)"],
            ["Vittime", "Decine di migliaia"],
            ["Fenomeno", "Terremoto + tsunami + incendi"]
        ],

        descrizione:
            "Un violentissimo terremoto colpì Lisbona, provocando crolli, incendi e uno tsunami che devastò la costa.",

        importanza:
            "Influenzò profondamente la filosofia, la scienza e la pianificazione urbana, contribuendo allo sviluppo di un approccio più scientifico allo studio dei terremoti."
    },

    {
        nome: "Calabria 1783",
        tipo: "terremoto",
        livello: "secondario",
        lat: 38.25,
        lon: 15.95,

        posizione: "Calabria meridionale, Italia",

        dati: [
            ["Data", "5 febbraio - marzo 1783"],
            ["Magnitudo", "Fino a circa 7,0 (stima)"],
            ["Vittime", "Circa 30.000-35.000"],
            ["Fenomeno", "Sequenza sismica e frane"]
        ],

        descrizione:
            "Una serie di forti terremoti distrusse numerosi centri abitati della Calabria meridionale e modificò profondamente il paesaggio.",

        importanza:
            "È uno dei più importanti eventi della storia sismica italiana per la distruzione provocata, le frane e gli studi sugli effetti dei terremoti sul territorio."
    },

    {
        nome: "Messina 1908",
        tipo: "terremoto",
        livello: "principale",
        lat: 38.15,
        lon: 15.68,

        posizione: "Stretto di Messina, Italia",

        dati: [
            ["Data", "28 dicembre 1908"],
            ["Magnitudo", "7,1 circa"],
            ["Vittime", "Circa 80.000-100.000"],
            ["Fenomeno", "Terremoto + maremoto"]
        ],

        descrizione:
            "Un violentissimo terremoto devastò Messina, Reggio Calabria e numerosi centri dello Stretto. Un maremoto aggravò la catastrofe.",

        importanza:
            "È uno dei disastri naturali più gravi della storia italiana e rappresenta un riferimento fondamentale per lo studio della vulnerabilità urbana e della gestione delle emergenze."
    },

    {
        nome: "Kantō 1923",
        tipo: "terremoto",
        livello: "secondario",
        lat: 35.4,
        lon: 139.1,

        posizione: "Regione del Kantō, Giappone",

        dati: [
            ["Data", "1 settembre 1923"],
            ["Magnitudo", "7,9"],
            ["Vittime", "Circa 105.000-143.000"],
            ["Fenomeno", "Terremoto + incendi + tsunami locale"]
        ],

        descrizione:
            "Il terremoto devastò Tokyo, Yokohama e altre città giapponesi. Gli incendi successivi causarono una parte considerevole delle vittime.",

        importanza:
            "Modificò la pianificazione urbana giapponese e contribuì allo sviluppo delle politiche di prevenzione e ricostruzione antisismica."
    },

    {
        nome: "Valdivia 1960",
        tipo: "terremoto",
        livello: "principale",
        lat: -38.14,
        lon: -73.41,

        posizione: "Cile meridionale",

        dati: [
            ["Data", "22 maggio 1960"],
            ["Magnitudo", "9,5"],
            ["Vittime", "Circa 1.655, secondo stime frequentemente citate"],
            ["Fenomeno", "Mega-terremoto + tsunami"]
        ],

        descrizione:
            "Il più potente terremoto registrato strumentalmente nella storia provocò enormi deformazioni del territorio e uno tsunami che attraversò l'Oceano Pacifico.",

        importanza:
            "È fondamentale per lo studio dei terremoti di subduzione, della tettonica delle placche e degli tsunami transoceanici."
    },

    {
        nome: "Alaska 1964",
        tipo: "terremoto",
        livello: "principale",
        lat: 61.02,
        lon: -147.65,

        posizione: "Alaska, Stati Uniti",

        dati: [
            ["Data", "27 marzo 1964"],
            ["Magnitudo", "9,2"],
            ["Vittime", "131"],
            ["Fenomeno", "Terremoto + tsunami + frane"]
        ],

        descrizione:
            "Un terremoto eccezionalmente potente colpì l'Alaska, causando tsunami, frane e importanti sollevamenti e abbassamenti del suolo.",

        importanza:
            "Fornì prove fondamentali per comprendere i processi di subduzione e il comportamento delle grandi faglie ai margini delle placche tettoniche."
    },

    {
        nome: "Tangshan 1976",
        tipo: "terremoto",
        livello: "secondario",
        lat: 39.63,
        lon: 118.18,

        posizione: "Tangshan, Cina",

        dati: [
            ["Data", "28 luglio 1976"],
            ["Magnitudo", "7,5-7,8 (a seconda della scala utilizzata)"],
            ["Vittime", "Circa 240.000 nel bilancio ufficiale storico più citato"],
            ["Fenomeno", "Terremoto distruttivo"]
        ],

        descrizione:
            "Una forte scossa colpì una città industriale densamente popolata, provocando crolli estesi e una catastrofe umanitaria.",

        importanza:
            "È uno dei principali casi di studio sulla distruzione sismica delle città e sull'importanza della resistenza degli edifici."
    },

    {
        nome: "Irpinia 1980",
        tipo: "terremoto",
        livello: "secondario",
        lat: 40.85,
        lon: 15.28,

        posizione: "Campania e Basilicata, Italia",

        dati: [
            ["Data", "23 novembre 1980"],
            ["Magnitudo", "6,9 circa"],
            ["Vittime", "Circa 2.900"],
            ["Fenomeno", "Terremoto e frane"]
        ],

        descrizione:
            "Una forte scossa colpì l'Appennino meridionale, distruggendo numerosi paesi e causando danni estesi in Campania e Basilicata.",

        importanza:
            "È un evento centrale nella storia della protezione civile italiana e mise in evidenza le carenze degli edifici e dell'organizzazione dei soccorsi."
    },

    {
        nome: "Sumatra 2004",
        tipo: "terremoto",
        livello: "principale",
        lat: 3.316,
        lon: 95.854,

        posizione: "Oceano Indiano, al largo di Sumatra",

        dati: [
            ["Data", "26 dicembre 2004"],
            ["Magnitudo", "9,1"],
            ["Vittime", "Oltre 220.000"],
            ["Fenomeno", "Terremoto + tsunami transoceanico"]
        ],

        descrizione:
            "Un gigantesco terremoto sottomarino generò uno tsunami che investì Indonesia, Sri Lanka, India, Thailandia e altri Paesi affacciati sull'Oceano Indiano.",

        importanza:
            "Portò alla creazione e al rafforzamento dei sistemi di allerta tsunami nell'Oceano Indiano e cambiò la cooperazione internazionale nella gestione dei disastri."
    },

    {
        nome: "Kashmir 2005",
        tipo: "terremoto",
        livello: "secondario",
        lat: 34.493,
        lon: 73.629,

        posizione: "Kashmir, Pakistan",

        dati: [
            ["Data", "8 ottobre 2005"],
            ["Magnitudo", "7,6"],
            ["Vittime", "Oltre 80.000"],
            ["Fenomeno", "Terremoto + frane"]
        ],

        descrizione:
            "Il terremoto colpì il Kashmir e le regioni circostanti, distruggendo abitazioni, scuole e infrastrutture in aree montuose.",

        importanza:
            "Dimostrò quanto siano vulnerabili gli edifici non antisismici e quanto le frane possano ostacolare i soccorsi nelle regioni montane."
    },

    {
        nome: "Haiti 2010",
        tipo: "terremoto",
        livello: "principale",
        lat: 18.457,
        lon: -72.533,

        posizione: "Vicino a Port-au-Prince, Haiti",

        dati: [
            ["Data", "12 gennaio 2010"],
            ["Magnitudo", "7,0"],
            ["Vittime", "Oltre 100.000; le stime variano molto"],
            ["Fenomeno", "Terremoto e crolli urbani"]
        ],

        descrizione:
            "Una forte scossa colpì l'area densamente popolata di Port-au-Prince, causando il crollo di abitazioni, ospedali ed edifici pubblici.",

        importanza:
            "È un esempio emblematico di come povertà, vulnerabilità edilizia e difficoltà logistiche possano amplificare gli effetti di un terremoto."
    },

    {
        nome: "Tōhoku 2011",
        tipo: "terremoto",
        livello: "principale",
        lat: 38.297,
        lon: 142.373,

        posizione: "Oceano Pacifico, al largo del Giappone nord-orientale",

        dati: [
            ["Data", "11 marzo 2011"],
            ["Magnitudo", "9,1"],
            ["Vittime", "Circa 20.000 tra morti e dispersi"],
            ["Fenomeno", "Terremoto + tsunami + incidente nucleare"]
        ],

        descrizione:
            "Un enorme terremoto avvenuto al largo del Giappone nord-orientale generò uno tsunami devastante che sommerse ampie aree costiere e provocò l'incidente nucleare di Fukushima.",

        importanza:
            "È un esempio fondamentale di terremoto associato alla subduzione e mostra il collegamento tra terremoti, tsunami e rischi tecnologici."
    },

    {
        nome: "Nepal 2015",
        tipo: "terremoto",
        livello: "secondario",
        lat: 28.147,
        lon: 84.708,

        posizione: "Nepal, area del Gorkha",

        dati: [
            ["Data", "25 aprile 2015"],
            ["Magnitudo", "7,8"],
            ["Vittime", "Circa 9.000"],
            ["Fenomeno", "Terremoto + frane + valanghe"]
        ],

        descrizione:
            "Una forte scossa colpì il Nepal, danneggiando Kathmandu e numerosi villaggi e provocando frane e valanghe nell'Himalaya.",

        importanza:
            "Evidenzia i rischi sismici nelle regioni montuose e la necessità di proteggere il patrimonio storico e le comunità isolate."
    },

    {
        nome: "Amatrice e Centro Italia 2016",
        tipo: "terremoto",
        livello: "secondario",
        lat: 42.627,
        lon: 13.292,

        posizione: "Appennino centrale, Italia",

        dati: [
            ["Data", "24 agosto 2016"],
            ["Magnitudo", "6,0"],
            ["Vittime", "299 nella scossa iniziale e nella catastrofe associata"],
            ["Fenomeno", "Sequenza sismica"]
        ],

        descrizione:
            "Una forte scossa devastò Amatrice, Accumoli e altri centri dell'Appennino centrale. Nei mesi successivi la sequenza proseguì con altri terremoti distruttivi.",

        importanza:
            "È un caso importante per lo studio delle sequenze sismiche appenniniche, della vulnerabilità dei borghi storici e della ricostruzione post-sisma."
    },

    {
        nome: "Turchia-Siria 2023",
        tipo: "terremoto",
        livello: "principale",
        lat: 37.174,
        lon: 37.032,

        posizione: "Turchia meridionale, vicino al confine siriano",

        dati: [
            ["Data", "6 febbraio 2023"],
            ["Magnitudo", "7,8 e 7,5"],
            ["Vittime", "Oltre 59.000 complessive in Turchia e Siria"],
            ["Fenomeno", "Doppio terremoto distruttivo"]
        ],

        descrizione:
            "Due grandi terremoti, avvenuti a poche ore di distanza, devastarono vaste aree della Turchia meridionale e della Siria settentrionale.",

        importanza:
            "Ha mostrato gli effetti di rotture sismiche estese, la vulnerabilità degli edifici e le difficoltà dei soccorsi in una catastrofe che interessa più Paesi."
    },

    // ==========================================
    // 🌍 TETTONICA DELLE REGIONI
    // ==========================================

    {
        nome: "Cintura di Fuoco del Pacifico",
        tipo: "regioneprincipale",
        livello: "principale",
        lat: 15.0,
        lon: 170.0,
        posizione: "Margini dell'Oceano Pacifico",
        dati: [
            ["Tipo", "Cintura tettonica circum-pacifica"],
            ["Fenomeni", "Terremoti, subduzione e vulcanismo"],
            ["Placche coinvolte", "Placca Pacifica e placche circostanti"]
        ],
        descrizione:
            "Una vasta fascia tettonica che circonda gran parte dell'Oceano Pacifico e comprende numerose zone di subduzione, faglie e archi vulcanici.",
        importanza:
            "È una delle principali concentrazioni mondiali di terremoti e vulcani."
    },
    {
        nome: "Cintura Sismica Alpino-Himalayana",
        tipo: "regioneprincipale",
        livello: "principale",
        lat: 32.0,
        lon: 55.0,
        posizione: "Dal Mediterraneo all'Asia meridionale",
        dati: [
            ["Tipo", "Fascia tettonica di collisione e compressione"],
            ["Fenomeni", "Terremoti e formazione di catene montuose"],
            ["Placche coinvolte", "Africana, Arabica, Indiana ed Eurasiatica"]
        ],
        descrizione:
            "Una vasta cintura tettonica che attraversa il Mediterraneo, il Medio Oriente e l'Himalaya.",
        importanza:
            "È una delle principali fasce sismiche del pianeta, dovuta alla convergenza tra placche tettoniche."
    },
    {
        nome: "Rift Valley dell'Africa Orientale",
        tipo: "regioneprincipale",
        livello: "principale",
        lat: 0.0,
        lon: 36.0,
        posizione: "Africa orientale",
        dati: [
            ["Tipo", "Rift continentale attivo"],
            ["Fenomeni", "Estensione crostale, terremoti e vulcanismo"],
            ["Placche coinvolte", "Africana, Somala e Arabica nel sistema regionale"]
        ],
        descrizione:
            "Una vasta zona in cui la crosta continentale si assottiglia e si frattura, accompagnata da attività sismica e magmatica.",
        importanza:
            "È fondamentale per comprendere le prime fasi della separazione di un continente."
    },
    {
        nome: "Cintura Vulcanica delle Ande",
        tipo: "regioneprincipale",
        livello: "principale",
        lat: -20.0,
        lon: -69.0,
        posizione: "Margine occidentale del Sud America",
        dati: [
            ["Tipo", "Margine convergente con subduzione"],
            ["Fenomeni", "Terremoti, vulcanismo e sollevamento montuoso"],
            ["Placche coinvolte", "Nazca e Sudamericana"]
        ],
        descrizione:
            "Regione tettonica lungo il margine occidentale del Sud America, dove la placca di Nazca sprofonda sotto quella Sudamericana.",
        importanza:
            "La convergenza genera grandi terremoti e alimenta numerosi sistemi vulcanici."
    },
    {
        nome: "Arco Vulcanico della Sonda",
        tipo: "regioneprincipale",
        livello: "principale",
        lat: -8.0,
        lon: 115.0,
        posizione: "Indonesia meridionale",
        dati: [
            ["Tipo", "Arco vulcanico di subduzione"],
            ["Fenomeni", "Terremoti, eruzioni esplosive e tsunami"],
            ["Placche coinvolte", "Indo-Australiana ed Eurasiatica"]
        ],
        descrizione:
            "Arco vulcanico che attraversa il margine meridionale dell'Indonesia, da Sumatra e Giava verso le isole orientali.",
        importanza:
            "È una regione di grande rilevanza per lo studio dei terremoti di subduzione, degli tsunami e del vulcanismo insulare."
    },
    {
        nome: "Dorsale Medio-Atlantica",
        tipo: "regioneprincipale",
        livello: "secondario",
        lat: 0.0,
        lon: -25.0,
        posizione: "Oceano Atlantico",
        dati: [
            ["Tipo", "Dorsale oceanica divergente"],
            ["Fenomeni", "Terremoti superficiali e vulcanismo basaltico"],
            ["Placche coinvolte", "Americana, Africana ed Eurasiatica, secondo il settore"]
        ],
        descrizione:
            "Una lunga catena montuosa sottomarina lungo la quale le placche si allontanano e si forma nuova crosta oceanica.",
        importanza:
            "È essenziale per comprendere l'espansione dei fondali oceanici."
    },
    {
        nome: "Zona di Subduzione della Cascadia",
        tipo: "regioneprincipale",
        livello: "secondario",
        lat: 45.0,
        lon: -125.0,
        posizione: "Costa nord-occidentale del Nord America",
        dati: [
            ["Tipo", "Zona di subduzione"],
            ["Fenomeni", "Grandi terremoti potenziali, tsunami e vulcanismo nell'entroterra"],
            ["Placche coinvolte", "Juan de Fuca e Nordamericana"]
        ],
        descrizione:
            "Zona di subduzione al largo delle coste della Columbia Britannica, di Washington e dell'Oregon.",
        importanza:
            "È monitorata per il rischio di grandi terremoti e tsunami sulla costa pacifica nordamericana."
    },
    {
        nome: "Sistema della Faglia di San Andreas",
        tipo: "regioneprincipale",
        livello: "secondario",
        lat: 36.5,
        lon: -120.5,
        posizione: "California, Stati Uniti",
        dati: [
            ["Tipo", "Sistema di faglie trascorrenti"],
            ["Fenomeni", "Terremoti da scorrimento orizzontale"],
            ["Placche coinvolte", "Pacifico e Nordamericana"]
        ],
        descrizione:
            "Sistema di faglie lungo cui le placche del Pacifico e del Nord America scorrono lateralmente.",
        importanza:
            "È uno dei sistemi di faglie più studiati per comprendere la deformazione crostale e il rischio sismico."
    },
    {
        nome: "Fossa delle Marianne e Arco delle Marianne",
        tipo: "regioneprincipale",
        livello: "secondario",
        lat: 15.0,
        lon: 147.0,
        posizione: "Oceano Pacifico occidentale",
        dati: [
            ["Tipo", "Zona di subduzione e arco insulare"],
            ["Fenomeni", "Terremoti profondi, fossa oceanica e vulcanismo"],
            ["Placche coinvolte", "Pacifico e placca del Mare delle Filippine"]
        ],
        descrizione:
            "Una regione che comprende una profonda fossa oceanica e un arco di isole vulcaniche associati alla subduzione.",
        importanza:
            "È importante per lo studio della subduzione e dei terremoti profondi."
    },
    {
        nome: "Fossa del Giappone e Arco Giapponese",
        tipo: "regioneprincipale",
        livello: "secondario",
        lat: 38.0,
        lon: 143.0,
        posizione: "Margine orientale del Giappone",
        dati: [
            ["Tipo", "Sistema di subduzione"],
            ["Fenomeni", "Terremoti, tsunami e vulcanismo"],
            ["Placche coinvolte", "Pacifico e altre placche regionali"]
        ],
        descrizione:
            "Regione caratterizzata dalla convergenza di più placche e dalla subduzione della litosfera oceanica.",
        importanza:
            "È una delle aree più monitorate al mondo per terremoti e tsunami."
    },
    {
        nome: "Arco Vulcanico dell'America Centrale",
        tipo: "regioneprincipale",
        livello: "secondario",
        lat: 13.0,
        lon: -88.0,
        posizione: "America Centrale",
        dati: [
            ["Tipo", "Arco vulcanico di subduzione"],
            ["Fenomeni", "Terremoti ed eruzioni esplosive"],
            ["Placche coinvolte", "Cocos e Caraibica"]
        ],
        descrizione:
            "Arco vulcanico lungo gran parte della costa pacifica dell'America Centrale, associato alla subduzione della placca di Cocos.",
        importanza:
            "È importante per lo studio dei vulcani esplosivi e dei rischi sismici."
    },
    {
        nome: "Fascia di Collisione Himalayana",
        tipo: "regioneprincipale",
        livello: "secondario",
        lat: 28.0,
        lon: 85.0,
        posizione: "Nepal, Bhutan, India settentrionale e Tibet",
        dati: [
            ["Tipo", "Zona di collisione continentale"],
            ["Fenomeni", "Grandi terremoti e sollevamento montuoso"],
            ["Placche coinvolte", "Indiana ed Eurasiatica"]
        ],
        descrizione:
            "Regione formata dalla collisione tra la placca indiana e quella eurasiatica, che continua a deformare e sollevare l'Himalaya.",
        importanza:
            "È una delle principali regioni al mondo per lo studio dei terremoti continentali."
    },
    {
        nome: "Sistema di Faglie dell'Anatolia",
        tipo: "regioneprincipale",
        livello: "secondario",
        lat: 39.0,
        lon: 35.0,
        posizione: "Turchia",
        dati: [
            ["Tipo", "Sistema di faglie trascorrenti"],
            ["Fenomeni", "Terremoti superficiali e spostamenti orizzontali"],
            ["Placche coinvolte", "Blocco anatolico, Eurasiatica e Arabica"]
        ],
        descrizione:
            "La Turchia è attraversata da importanti sistemi di faglie, tra cui quelle anatolica settentrionale e orientale.",
        importanza:
            "È cruciale per comprendere la tettonica del Mediterraneo orientale e il rischio sismico."
    },
    {
        nome: "Fascia Tettonica dello Zagros",
        tipo: "regioneprincipale",
        livello: "secondario",
        lat: 31.0,
        lon: 51.0,
        posizione: "Iran occidentale e Iraq orientale",
        dati: [
            ["Tipo", "Cintura di collisione e compressione"],
            ["Fenomeni", "Terremoti e deformazione della crosta"],
            ["Placche coinvolte", "Arabica ed Eurasiatica"]
        ],
        descrizione:
            "Catena montuosa formatasi durante la convergenza tra la placca arabica e quella eurasiatica.",
        importanza:
            "È importante per lo studio della collisione continentale e delle faglie compressive."
    },
    {
        nome: "Zona Tettonica della Nuova Zelanda",
        tipo: "regioneprincipale",
        livello: "secondario",
        lat: -41.0,
        lon: 174.0,
        posizione: "Nuova Zelanda",
        dati: [
            ["Tipo", "Margine complesso con faglie e subduzione"],
            ["Fenomeni", "Terremoti, vulcanismo e deformazione crostale"],
            ["Placche coinvolte", "Australiana e Pacifico"]
        ],
        descrizione:
            "La Nuova Zelanda si trova lungo un confine tettonico complesso, con subduzione e faglie trascorrenti.",
        importanza:
            "Permette di studiare diversi tipi di margini di placca in un'area geografica relativamente compatta."
    },
    {
        nome: "Rift del Lago Baikal",
        tipo: "regioneprincipale",
        livello: "secondario",
        lat: 53.5,
        lon: 108.0,
        posizione: "Siberia meridionale, Russia",
        dati: [
            ["Tipo", "Rift continentale"],
            ["Fenomeni", "Estensione crostale e terremoti"],
            ["Contesto tettonico", "Deformazione estensionale nell'Asia interna"]
        ],
        descrizione:
            "Una zona in cui la crosta continentale si estende e si frattura, formando bacini profondi.",
        importanza:
            "È un esempio importante di rift continentale lontano dai margini oceanici."
    },
    {
        nome: "Rift del Rio Grande",
        tipo: "regioneprincipale",
        livello: "secondario",
        lat: 35.0,
        lon: -106.0,
        posizione: "Stati Uniti sud-occidentali",
        dati: [
            ["Tipo", "Rift continentale"],
            ["Fenomeni", "Estensione crostale, faglie e terremoti"],
            ["Contesto tettonico", "Assottigliamento della crosta continentale"]
        ],
        descrizione:
            "Sistema di bacini e faglie estensionali che attraversa parte degli Stati Uniti sud-occidentali.",
        importanza:
            "È utile per comprendere l'estensione continentale e l'evoluzione delle strutture tettoniche interne."
    },
    {
        nome: "Rift del Mar Rosso e Golfo di Aden",
        tipo: "regioneprincipale",
        livello: "secondario",
        lat: 15.0,
        lon: 42.0,
        posizione: "Tra Africa nord-orientale e Penisola Arabica",
        dati: [
            ["Tipo", "Sistema di rift e margini divergenti"],
            ["Fenomeni", "Terremoti, vulcanismo e apertura oceanica"],
            ["Placche coinvolte", "Africana, Arabica e Somala"]
        ],
        descrizione:
            "Sistema tettonico nel quale Africa e Arabia si allontanano progressivamente.",
        importanza:
            "È una regione chiave per comprendere la transizione tra rift continentale e formazione di nuova crosta oceanica."
    },
    {
        nome: "Regione del Punto Caldo delle Hawaii",
        tipo: "regioneprincipale",
        livello: "secondario",
        lat: 19.6,
        lon: -155.5,
        posizione: "Arcipelago delle Hawaii, Oceano Pacifico",
        dati: [
            ["Tipo", "Hotspot intraplacca"],
            ["Fenomeni", "Vulcanismo basaltico e formazione di isole"],
            ["Meccanismo", "Movimento della placca pacifica sopra una sorgente di magma"]
        ],
        descrizione:
            "L'arcipelago hawaiano si è formato grazie all'attività di un punto caldo mentre la placca pacifica si spostava.",
        importanza:
            "È uno degli esempi più conosciuti di vulcanismo lontano dai confini tra placche tettoniche."
    },
    {
        nome: "Provincia Vulcanica dell'Islanda",
        tipo: "regioneprincipale",
        livello: "secondario",
        lat: 64.9,
        lon: -19.0,
        posizione: "Islanda, Atlantico settentrionale",
        dati: [
            ["Tipo", "Dorsale oceanica emersa e hotspot"],
            ["Fenomeni", "Terremoti, fratture, intrusioni magmatiche ed eruzioni"],
            ["Placche coinvolte", "Nordamericana ed Eurasiatica"]
        ],
        descrizione:
            "L'Islanda si trova sulla Dorsale Medio-Atlantica ed è caratterizzata da intensa attività magmatica.",
        importanza:
            "È un luogo eccezionale per osservare l'interazione tra divergenza delle placche, terremoti e vulcanismo."
    },
    {
        nome: "Fascia Sismica e Vulcanica delle Antille",
        tipo: "regioneprincipale",
        livello: "secondario",
        lat: 15.5,
        lon: -61.5,
        posizione: "Piccole Antille, Caraibi",
        dati: [
            ["Tipo", "Arco insulare di subduzione"],
            ["Fenomeni", "Terremoti, vulcanismo esplosivo e tsunami"],
            ["Placche coinvolte", "Caraibica e litosfera atlantica"]
        ],
        descrizione:
            "Le Piccole Antille formano un arco insulare associato alla subduzione della litosfera atlantica sotto la placca caraibica.",
        importanza:
            "È importante per lo studio del vulcanismo insulare e dei rischi sismici e tsunami nei Caraibi."
    }
];

// ==========================================
// CREAZIONE DEI MARKER SCIENTIFICI
// ==========================================

// ==========================================
// CREAZIONE DEI MARKER SCIENTIFICI
// ==========================================

// Gruppi che raccolgono i diversi tipi di luogo

const markerGroups = {

    principali: L.layerGroup(),

    vulcano: L.layerGroup(),

    terremoto: L.layerGroup(),

    regioneprincipale: L.layerGroup()

};

// ==========================================
// PANNELLO INFORMATIVO
// ==========================================

const infoPanel =
    document.getElementById("info-panel");

const infoContent =
    document.getElementById("info-content");

const closePanel =
    document.getElementById("close-panel");

closePanel.addEventListener(
    "click",
    function () {

        infoPanel.classList.remove("open");

    }
);

// ==========================================
// CREAZIONE DEI MARKER
// ==========================================

luoghi.forEach(luogo => {

    let classe;
    let simbolo;

    // ==========================================
    // VULCANO
    // ==========================================

    if (luogo.tipo === "vulcano") {

        classe = "volcano-marker";

        simbolo = "🌋";
    }

    // ==========================================
    // TERREMOTO
    // ==========================================

    if (luogo.tipo === "terremoto") {

        classe = "earthquake-marker";

        simbolo = "⚡";
    }

    // ==========================================
    // TETTONICA
    // ==========================================

    if (luogo.tipo === "regioneprincipale") {

        classe = "tectonic-marker";

        simbolo = "◈";
    }

    // ==========================================
    // ICONA
    // ==========================================

    const icon = L.divIcon({

        className: "",

        html: `
            <div class="science-marker ${classe}">
                ${simbolo}
            </div>
        `,

        iconSize: [34, 34],

        iconAnchor: [17, 17],

        popupAnchor: [0, -20]
    });

    // ==========================================
    // MARKER
    // ==========================================

    const marker = L.marker(

        [luogo.lat, luogo.lon],

        {
            icon: icon,

            zIndexOffset: 1000
        }
    );

// ==========================================
// GRUPPO COMPLETO
// ==========================================

if (luogo.tipo === "vulcano") {

    markerGroups.vulcano
        .addLayer(marker);

}

else if (luogo.tipo === "terremoto") {

    markerGroups.terremoto
        .addLayer(marker);

}

else if (luogo.tipo === "regioneprincipale") {

    markerGroups.regioneprincipale
        .addLayer(marker);

}

// ==========================================
// GRUPPO PRINCIPALI
// ==========================================

if (luogo.livello !== "secondario") {

    markerGroups.principali
        .addLayer(marker);
}

    // ==========================================
    // APERTURA DEL PANNELLO
    // ==========================================

    marker.on("click", function () {

        infoContent.innerHTML = `

            <div class="info-type">
                ${luogo.tipo.toUpperCase()}
            </div>

            <h1 class="info-title">
                ${simbolo} ${luogo.nome}
            </h1>

            <div class="info-location">
                ${luogo.posizione}
            </div>

            <p class="info-description">
                ${luogo.descrizione}
            </p>

            <div class="info-data">

                ${luogo.dati.map(dato => `

                    <div class="info-data-row">

                        <span class="info-data-label">
                            ${dato[0]}
                        </span>

                        <span class="info-data-value">
                            ${dato[1]}
                        </span>

                    </div>

                `).join("")}

            </div>

            <div class="info-importance">

                <div class="info-importance-title">
                    PERCHÉ È IMPORTANTE
                </div>

                <p>
                    ${luogo.importanza}
                </p>

            </div>

        `;

        infoPanel.classList.add("open");

    });
});

// ==========================================
// MOSTRA SOLO I LUOGHI PRINCIPALI ALL'AVVIO
// ==========================================

markerGroups.principali.addTo(map);

// ==========================================
// LEGENDA INTERATTIVA
// ==========================================

const legend = L.control({
    position: "bottomright"
});

legend.onAdd = function () {

    const div = L.DomUtil.create(
        "div",
        "map-legend"
    );

    div.innerHTML = `

        <div class="legend-title">
            TETTONICA
        </div>

        <div class="legend-item">
            <span class="legend-color plate"></span>
            Placche tettoniche
        </div>

        <div class="legend-item">
            <span class="legend-color subduction"></span>
            Subduzione
        </div>

        <div class="legend-item">
            <span class="legend-color boundary"></span>
            Confine di placca
        </div>

        <div class="legend-item">
            <span class="legend-symbol volcano">▲</span>
            Vulcano
        </div>

        <div class="legend-item">
            <span class="legend-symbol earthquake">●</span>
            Terremoto
        </div>

    `;

    return div;
};

legend.addTo(map);

// ==========================================
// FILTRO DELLA MAPPA
// ==========================================

const filtro = L.control({
    position: "topright"
});

filtro.onAdd = function () {

    const div = L.DomUtil.create(
        "div",
        "map-filters"
    );

    div.innerHTML = `

        <button data-filter="all">
            TUTTO
        </button>

        <button data-filter="vulcano">
            🌋 VULCANI
        </button>

        <button data-filter="terremoto">
            ⚡ TERREMOTI
        </button>

        <button data-filter="regioneprincipale">
            ◈ TETTONICA
        </button>

    `;

    L.DomEvent.disableClickPropagation(div);

    return div;
};

filtro.addTo(map);

// ==========================================
// FUNZIONE FILTRO
// ==========================================

document
    .querySelectorAll(".map-filters button")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const categoria =
                    this.dataset.filter;

                // Nasconde tutti i gruppi

                Object.values(markerGroups)
                    .forEach(group => {

                        map.removeLayer(group);

                    });

                // ==========================================
                // TUTTO
                // ==========================================

                if (categoria === "all") {

                    markerGroups.principali
                        .addTo(map);

                }

                // ==========================================
                // VULCANI
                // ==========================================

                else if (categoria === "vulcano") {

                    markerGroups.vulcano
                        .addTo(map);

                }

                // ==========================================
                // TERREMOTI
                // ==========================================

                else if (categoria === "terremoto") {

                    markerGroups.terremoto
                        .addTo(map);

                }

                // ==========================================
                // TETTONICA
                // ==========================================

                else if (categoria === "regioneprincipale") {

                    markerGroups.regioneprincipale
                        .addTo(map);

                }

                // ==========================================
                // PULSANTE ATTIVO
                // ==========================================

                document
                    .querySelectorAll(
                        ".map-filters button"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });

                this.classList.add("active");

            }
        );
    });

// ==========================================
// PULSANTE SCHERMO INTERO
// ==========================================

const fullscreenControl = L.control({
    position: "topleft"
});

fullscreenControl.onAdd = function () {

    const div = L.DomUtil.create(
        "div",
        "fullscreen-control"
    );

    div.innerHTML = `
        <button
            id="fullscreen-button"
            title="Schermo intero">
            ⛶
        </button>
    `;

    L.DomEvent.disableClickPropagation(div);

    return div;
};

fullscreenControl.addTo(map);

// ==========================================
// FUNZIONE SCHERMO INTERO
// ==========================================

document
    .getElementById("fullscreen-button")
    .addEventListener("click", function () {

        const mapElement =
            document.getElementById("map");

        if (!document.fullscreenElement) {

            mapElement.requestFullscreen();

        } else {

            document.exitFullscreen();
        }
    });
    document.addEventListener(
    "fullscreenchange",
    function () {

        setTimeout(function () {

            map.invalidateSize();

        }, 100);
    }
);