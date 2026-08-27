/**
 * Zentrale Lerninhalte.
 * Jeder wichtige Text existiert in zwei Versionen:
 *  - normal: Standardtext
 *  - easy:   Leichte Sprache
 * Neue Inhalte können hier ergänzt werden, ohne Komponenten zu ändern.
 */

export type BiText = { normal: string; easy: string };

export const intro: { title: string; text: BiText } = {
  title: "Was ist Axtwerfen?",
  text: {
    normal:
      "Axtwerfen ist ein Präzisionssport – ähnlich wie Dart, nur mit einer Wurfaxt. Du wirfst eine kleine Axt aus wenigen Metern Entfernung auf eine Holz-Zielscheibe. Ziel ist es, dass die Schneide im Holz stecken bleibt – am besten in der Mitte. Axtwerfen trainiert Konzentration, Körpergefühl und einen ruhigen Bewegungsablauf. In vielen Städten gibt es Hallen, in denen du es sicher ausprobieren kannst.",
    easy:
      "Axtwerfen ist ein Sport. Er ist ähnlich wie Dart. Du wirfst eine kleine Axt auf eine Scheibe aus Holz. Die Axt soll im Holz stecken bleiben. Am besten in der Mitte. Es gibt Hallen dafür. Dort ist es sicher.",
  },
};

export const safetyRules: { icon: string; title: string; text: BiText }[] = [
  {
    icon: "📏",
    title: "Sicherheitsabstand",
    text: {
      normal:
        "Halte immer mindestens 2 Meter Abstand zu anderen Personen. Es wirft immer nur eine Person pro Bahn.",
      easy: "Halte Abstand zu anderen. Mindestens 2 Meter. Nur eine Person wirft.",
    },
  },
  {
    icon: "🚷",
    title: "Freie Wurfbahn",
    text: {
      normal:
        "Wirf nur, wenn der Bereich zwischen dir und der Zielscheibe komplett frei ist. Niemand darf die Bahn betreten, solange geworfen wird.",
      easy: "Wirf nur, wenn niemand vor dir steht. Der Weg zur Scheibe muss frei sein.",
    },
  },
  {
    icon: "👟",
    title: "Geschlossene Schuhe",
    text: {
      normal:
        "Trage feste, geschlossene Schuhe. Keine Sandalen oder Flip-Flops – eine abprallende Axt kann auf den Boden fallen.",
      easy: "Trage feste Schuhe. Keine Sandalen. Die Axt kann auf den Boden fallen.",
    },
  },
  {
    icon: "👕",
    title: "Richtige Kleidung",
    text: {
      normal:
        "Trage bequeme Kleidung ohne lose, weite Ärmel oder herabhängende Schnüre, die beim Wurf stören könnten.",
      easy: "Trage bequeme Kleidung. Nichts darf lose herunterhängen.",
    },
  },
  {
    icon: "🔍",
    title: "Axt prüfen",
    text: {
      normal:
        "Prüfe die Axt vor jedem Wurf: Sitzt der Kopf fest? Ist der Griff ohne Risse? Beschädigte Äxte niemals werfen – gib sie dem Personal.",
      easy: "Schau dir die Axt vorher an. Ist sie kaputt? Dann nicht werfen. Sag dem Personal Bescheid.",
    },
  },
  {
    icon: "✋",
    title: "Axt erst holen, wenn alle fertig sind",
    text: {
      normal:
        "Hole deine Axt erst aus der Scheibe, wenn alle auf deiner und der Nachbarbahn fertig geworfen haben. Trage sie mit der Schneide nach unten.",
      easy: "Warte, bis alle fertig geworfen haben. Dann hole die Axt. Trage sie mit der Klinge nach unten.",
    },
  },
];

/** Interaktive Sicherheitsprüfung: "Was ist hier falsch?" */
export const safetyHazards: { id: string; label: string; explanation: BiText }[] = [
  {
    id: "person-in-lane",
    label: "Person in der Wurfbahn",
    explanation: {
      normal: "Eine Person steht in der Wurfbahn – es darf niemals geworfen werden, solange jemand vor der Wurflinie ist.",
      easy: "Da steht eine Person im Weg. Das ist gefährlich. Erst werfen, wenn der Weg frei ist.",
    },
  },
  {
    id: "open-shoes",
    label: "Offene Schuhe",
    explanation: {
      normal: "Die werfende Person trägt Flip-Flops. Beim Axtwerfen sind feste, geschlossene Schuhe Pflicht.",
      easy: "Die Person trägt Flip-Flops. Das ist falsch. Du brauchst feste Schuhe.",
    },
  },
  {
    id: "damaged-axe",
    label: "Beschädigte Axt",
    explanation: {
      normal: "Am Boden liegt eine Axt mit gerissenem Griff. Beschädigte Äxte dürfen nicht geworfen werden.",
      easy: "Die Axt am Boden ist kaputt. Kaputte Äxte darf man nicht werfen.",
    },
  },
  {
    id: "drink",
    label: "Getränk an der Wurflinie",
    explanation: {
      normal: "Ein Glas steht direkt an der Wurflinie. Getränke gehören in den Aufenthaltsbereich – und Alkohol und Axtwerfen passen nicht zusammen.",
      easy: "Da steht ein Getränk im Wurfbereich. Getränke gehören woanders hin.",
    },
  },
];

export const axeParts: {
  id: string;
  name: string;
  x: number;
  y: number;
  text: BiText;
}[] = [
  {
    id: "kopf",
    name: "Kopf",
    x: 150,
    y: 78,
    text: {
      normal:
        "Der Axtkopf ist das Gewicht der Axt, meist aus Stahl. Bei Wurfäxten wiegt er etwa 400 bis 600 Gramm.",
      easy: "Der Kopf ist das schwere Teil. Er ist aus Metall.",
    },
  },
  {
    id: "schneide",
    name: "Schneide",
    x: 205,
    y: 95,
    text: {
      normal:
        "Die Schneide ist die scharfe Kante. Nur sie bleibt im Holz stecken. Sie muss scharf, aber nicht rasiermesserscharf sein.",
      easy: "Die Schneide ist die scharfe Kante. Sie bleibt im Holz stecken.",
    },
  },
  {
    id: "griff",
    name: "Griff",
    x: 118,
    y: 250,
    text: {
      normal:
        "Der Griff (Stiel) ist meist aus Holz. Du hältst ihn am unteren Ende – nicht in der Mitte. So bekommt die Axt eine gleichmäßige Drehung.",
      easy: "Am Griff hältst du die Axt fest. Halte sie ganz unten am Griff.",
    },
  },
  {
    id: "schwerpunkt",
    name: "Schwerpunkt",
    x: 138,
    y: 130,
    text: {
      normal:
        "Der Schwerpunkt liegt knapp unter dem Kopf. Um ihn dreht sich die Axt im Flug. Deshalb fliegt eine Axt anders als ein Ball.",
      easy: "Hier ist die Axt im Gleichgewicht. Um diesen Punkt dreht sie sich im Flug.",
    },
  },
];

export const gripData: {
  id: "one-hand" | "two-hand";
  name: string;
  intro: BiText;
  points: { title: string; text: BiText }[];
}[] = [
  {
    id: "two-hand",
    name: "Zweihandwurf",
    intro: {
      normal:
        "Der Zweihandwurf ist die beste Technik für Anfänger. Beide Hände halten die Axt – wie bei einem Fußball-Einwurf über den Kopf.",
      easy: "Für Anfänger: Nimm beide Hände. Wie beim Einwurf beim Fußball.",
    },
    points: [
      {
        title: "Beide Hände am Griffende",
        text: {
          normal: "Lege beide Hände übereinander an das untere Griffende, wie bei einem Baseballschläger.",
          easy: "Beide Hände unten an den Griff. Übereinander.",
        },
      },
      {
        title: "Locker halten",
        text: {
          normal: "Halte fest genug, dass die Axt nicht rutscht – aber locker genug, dass sie beim Loslassen sauber abrollt. Kein Krampf!",
          easy: "Halte die Axt fest. Aber nicht verkrampft.",
        },
      },
      {
        title: "Schneide zeigt zur Zielscheibe",
        text: {
          normal: "Die Schneide zeigt gerade nach vorne zur Zielscheibe. Nicht verkanten – sonst fliegt die Axt schief.",
          easy: "Die scharfe Seite zeigt zur Scheibe. Halte die Axt gerade.",
        },
      },
    ],
  },
  {
    id: "one-hand",
    name: "Einhandwurf",
    intro: {
      normal:
        "Beim Einhandwurf hältst du die Axt wie einen Hammer. Er braucht mehr Übung, ist aber präziser – ideal als zweiter Schritt.",
      easy: "Eine Hand hält die Axt. Wie einen Hammer. Das ist schwerer. Übe erst mit zwei Händen.",
    },
    points: [
      {
        title: "Griff wie beim Hammer",
        text: {
          normal: "Umfasse das Griffende mit einer Hand, der Daumen liegt seitlich oder auf dem Griffrücken.",
          easy: "Halte den Griff wie einen Hammer. Ganz unten.",
        },
      },
      {
        title: "Handgelenk fest",
        text: {
          normal: "Das Handgelenk bleibt beim ganzen Wurf gerade und fest. Ein abknickendes Handgelenk erzeugt zu viel Drehung.",
          easy: "Dein Handgelenk bleibt gerade. Nicht abknicken.",
        },
      },
      {
        title: "Schulter zeigt zum Ziel",
        text: {
          normal: "Stelle dich leicht seitlich, die Wurfschulter zeigt Richtung Zielscheibe – wie beim Dartwurf.",
          easy: "Stell dich etwas seitlich hin. Deine Wurfschulter zeigt zur Scheibe.",
        },
      },
    ],
  },
];

export const stancePoints: { id: string; title: string; text: BiText }[] = [
  {
    id: "feet",
    title: "Fußstellung",
    text: {
      normal:
        "Beim Zweihandwurf: Füße schulterbreit, beide Fußspitzen zeigen zur Scheibe. Ein kleiner Ausfallschritt beim Wurf gibt Schwung.",
      easy: "Stelle die Füße schulterbreit hin. Die Füße zeigen zur Scheibe.",
    },
  },
  {
    id: "shoulders",
    title: "Schultern",
    text: {
      normal: "Die Schultern bleiben locker und zeigen parallel zur Zielscheibe. Nicht verdrehen.",
      easy: "Die Schultern bleiben locker. Sie zeigen gerade zur Scheibe.",
    },
  },
  {
    id: "gaze",
    title: "Blick",
    text: {
      normal: "Fixiere mit den Augen den Punkt, den du treffen willst – nicht die Axt. Dein Körper folgt dem Blick.",
      easy: "Schau genau auf den Punkt in der Mitte. Nicht auf die Axt.",
    },
  },
  {
    id: "distance",
    title: "Abstand",
    text: {
      normal:
        "Standard sind etwa 3,5 bis 4 Meter bis zur Scheibe (ca. 4–5 große Schritte). Von dort dreht sich die Axt genau einmal.",
      easy: "Stehe ungefähr 4 große Schritte von der Scheibe weg.",
    },
  },
];

/** Schritte der scrollgesteuerten Wurfanimation. */
export const throwSteps: { title: string; text: BiText }[] = [
  {
    title: "Ausgangsposition",
    text: {
      normal: "Stell dich gerade hin. Beide Hände halten die Axt vor dem Körper. Augen auf das Ziel.",
      easy: "Stell dich gerade hin. Halte die Axt vor dem Körper. Schau auf das Ziel.",
    },
  },
  {
    title: "Ausholen",
    text: {
      normal: "Führe die Axt kontrolliert über den Kopf nach hinten. Die Arme bleiben gestreckt, das Handgelenk gerade.",
      easy: "Hebe die Axt über den Kopf. Langsam und ruhig.",
    },
  },
  {
    title: "Vorwärtsbewegung",
    text: {
      normal: "Bring die Axt in einer flüssigen Bewegung nach vorne. Die Kraft kommt nicht nur aus den Armen – der ganze Körper wirft mit.",
      easy: "Bewege die Axt nach vorne. Dein ganzer Körper hilft mit.",
    },
  },
  {
    title: "Loslassen",
    text: {
      normal: "Lass die Axt ungefähr auf Augenhöhe los – dann, wenn der Griff zur Scheibe zeigt. Nicht nachdrücken, nicht mit dem Handgelenk drehen.",
      easy: "Lass die Axt auf Augenhöhe los. Einfach loslassen. Nicht drehen.",
    },
  },
  {
    title: "Flug & Rotation",
    text: {
      normal: "Die Axt dreht sich im Flug von selbst – ungefähr eine ganze Umdrehung auf 4 Meter. Du musst die Drehung nicht erzwingen.",
      easy: "Die Axt dreht sich in der Luft. Das passiert von allein.",
    },
  },
  {
    title: "Treffer!",
    text: {
      normal: "Die Schneide trifft zuerst und bleibt im Holz stecken. Bleib stehen und beobachte den Wurf bis zum Schluss.",
      easy: "Die Klinge bleibt im Holz stecken. Geschafft!",
    },
  },
];

export const mistakes: {
  icon: string;
  problem: string;
  cause: BiText;
  solution: BiText;
}[] = [
  {
    icon: "📐",
    problem: "Die Axt trifft mit dem Griff zuerst",
    cause: {
      normal: "Du stehst zu nah – die Axt hat noch nicht genug gedreht.",
      easy: "Du stehst zu nah an der Scheibe.",
    },
    solution: {
      normal: "Geh einen halben Schritt zurück und wirf mit gleicher Bewegung erneut.",
      easy: "Geh einen kleinen Schritt zurück.",
    },
  },
  {
    icon: "🔨",
    problem: "Die Axt trifft mit dem Kopf oben zuerst",
    cause: {
      normal: "Du stehst zu weit weg – die Axt dreht sich über den idealen Punkt hinaus.",
      easy: "Du stehst zu weit weg.",
    },
    solution: {
      normal: "Geh einen halben Schritt nach vorne. Kleine Schritte, dann testen.",
      easy: "Geh einen kleinen Schritt nach vorne.",
    },
  },
  {
    icon: "💪",
    problem: "Die Axt prallt hart ab",
    cause: {
      normal: "Zu viel Kraft. Ein harter Wurf verändert die Rotation und die Axt schlägt flach auf.",
      easy: "Du wirfst zu fest.",
    },
    solution: {
      normal: "Wirf entspannter – Präzision schlägt Kraft. Die Axt braucht nur einen lockeren Schwung.",
      easy: "Wirf lockerer. Du brauchst nicht viel Kraft.",
    },
  },
  {
    icon: "🌀",
    problem: "Die Axt flattert oder dreht zu schnell",
    cause: {
      normal: "Du drehst das Handgelenk beim Loslassen aktiv mit. Das gibt der Axt zusätzlichen, unkontrollierten Spin.",
      easy: "Du drehst deine Hand beim Werfen. Das macht die Axt schnell.",
    },
    solution: {
      normal: "Handgelenk fest und gerade lassen. Die Drehung entsteht von selbst.",
      easy: "Halte das Handgelenk gerade. Die Axt dreht sich von allein.",
    },
  },
  {
    icon: "↗️",
    problem: "Die Axt fliegt schräg zur Seite",
    cause: {
      normal: "Die Axt war beim Abwurf verkantet oder ein Arm zieht stärker als der andere.",
      easy: "Die Axt war beim Werfen schief.",
    },
    solution: {
      normal: "Achte darauf, dass die Schneide beim Abwurf exakt zur Scheibe zeigt. Beide Arme gleichmäßig.",
      easy: "Halte die Axt gerade. Beide Arme machen das Gleiche.",
    },
  },
  {
    icon: "⏱️",
    problem: "Die Axt fliegt zu hoch oder zu tief",
    cause: {
      normal: "Falscher Release-Zeitpunkt: zu früh losgelassen → zu hoch, zu spät → in den Boden.",
      easy: "Du lässt zu früh oder zu spät los.",
    },
    solution: {
      normal: "Lass ungefähr auf Augenhöhe los. Stell dir vor, du gibst der Scheibe die Axt.",
      easy: "Lass die Axt auf Augenhöhe los.",
    },
  },
];

export const faq: { q: string; a: BiText }[] = [
  {
    q: "Ist Axtwerfen gefährlich?",
    a: {
      normal:
        "In einer professionellen Halle mit Trainer und klaren Regeln ist Axtwerfen sehr sicher. Wichtig: Regeln respektieren, nüchtern bleiben, feste Schuhe.",
      easy: "In einer Halle mit Trainer ist es sicher. Halte dich an die Regeln.",
    },
  },
  {
    q: "Ab welchem Alter darf man Axtwerfen?",
    a: {
      normal:
        "Das regelt jede Halle selbst. Häufig ab 12–14 Jahren in Begleitung eines Erwachsenen, alleine meist ab 18. Frag vorher bei der Halle nach.",
      easy: "Das ist in jeder Halle anders. Oft ab 12 Jahren mit Eltern. Frag vorher nach.",
    },
  },
  {
    q: "Brauche ich eine eigene Axt?",
    a: {
      normal: "Nein. Hallen stellen geprüfte Wurfäxte. Eine eigene Axt lohnt sich erst, wenn du regelmäßig trainierst.",
      easy: "Nein. Die Halle hat Äxte für dich.",
    },
  },
  {
    q: "Wie schnell lerne ich, dass die Axt stecken bleibt?",
    a: {
      normal:
        "Die meisten Anfänger schaffen die ersten steckenden Würfe innerhalb der ersten halben Stunde – mit der richtigen Technik und dem richtigen Abstand.",
      easy: "Das geht schnell. Oft klappt es schon nach 30 Minuten.",
    },
  },
  {
    q: "Darf ich im Garten Axtwerfen üben?",
    a: {
      normal:
        "Nur mit viel Vorsicht: eigenes Grundstück, stabile eigene Zielwand, großer Sicherheitsbereich, niemand in der Nähe. Sicherer und besser: erst in einer Halle unter Anleitung lernen. Beachte lokale Regeln.",
      easy: "Lieber nicht. Lerne zuerst in einer Halle. Dort zeigt dir jemand alles.",
    },
  },
];

/**
 * Demo-Standorte für den Karten-Fallback ohne Google-Maps-API-Key.
 * TODO: Bei vorhandenem API-Key werden echte Ergebnisse der Places API angezeigt.
 * Diese Einträge sind Beispiel-Daten und keine echten Anbieter.
 */
export const demoLocations: {
  name: string;
  address: string;
  city: string;
  km: number;
  x: number;
  y: number;
}[] = [
  { name: "Axtwerk Halle (Demo)", address: "Industriestraße 12", city: "Köln", km: 2.4, x: 42, y: 38 },
  { name: "Timber Arena (Demo)", address: "Hafenweg 3", city: "Köln", km: 4.1, x: 58, y: 52 },
  { name: "Wurfhalle West (Demo)", address: "Am Gleisdreieck 7", city: "Frechen", km: 8.7, x: 25, y: 60 },
  { name: "Axe & Friends (Demo)", address: "Marktplatz 21", city: "Leverkusen", km: 12.3, x: 70, y: 22 },
  { name: "Blackforest Throwing (Demo)", address: "Waldstraße 9", city: "Bergisch Gladbach", km: 14.9, x: 82, y: 45 },
];
