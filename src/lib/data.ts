import type { CatalogItem, PayMethod } from "./types";

const IMG = {
  hero: "https://image.qwenlm.ai/generated-images/80a4317d-1c57-48e8-84db-5d8a4f5ef5ba/_result.png",
  lobby: "https://image.qwenlm.ai/generated-images/8f2875da-35e3-4c4c-aedd-dfd5da575791/_result.png",
  chambre: "/chambre-1.jpg",
  deluxe: "https://image.qwenlm.ai/generated-images/3d61fdc3-0d83-4616-9e26-cb772df9496f/_result.png",
  suite: "/suite-main.jpg",
  suiteGallery: ["/suite-main.jpg", "/suite-2.jpg", "/suite-3.jpg", "/suite-4.jpg", "/suite-5.jpg"],
  penthouse: "https://image.qwenlm.ai/generated-images/c9f50abf-89d7-445b-9128-b7fd13d261e4/_result.png",
  amphitheatre: "/salle-amphitheatre.jpg",
  executif: "/salle-executif.jpg",
  conseil: "/salle-conseil.jpg",
  restaurant: "https://image.qwenlm.ai/generated-images/09e57d04-6fbd-4542-8a4c-5a08c7c50923/_result.png",
};

export const IMAGES = IMG;

export const CATALOG: CatalogItem[] = [
  {
    id: "ch-verte",
    kind: "room",
    name: "Chambre Verte",
    tagline: "L'essentiel, avec manière",
    description:
      "Neuf chambres aux palettes uniques — du vert profond au bleu roi, du rose framboise au blanc nacré. Chaque pièce est un univers, avec le même confort : lit double, Smart TV, Wi-Fi haut débit et tout le nécessaire pour un séjour sans souci.",
    price: 45000,
    unit: "nuit",
    capacity: 2,
    size: 21,
    beds: "Lit double",
    features: [
      "Lit double",
      "Air conditionné",
      "Espace bureau",
      "Écran LCD mural amovible",
      "Smart TV OLED / QLED",
      "Chaînes câblées",
      "Mini-bar",
      "Bouilloire",
      "Plateau de courtoisie",
      "Produits de toilette",
      "Lampes de chevet",
      "WC suspendu",
      "Wi-Fi haut débit",
      "Room service 24h/24",
      "Eau minérale en chambre",
    ],
    img: IMG.chambre,
    stock: 9,
    gallery: ["/chambre-1.jpg", "/chambre-2.jpg", "/chambre-3.jpg", "/chambre-4.jpg", "/chambre-5.jpg", "/chambre-6.jpg", "/chambre-7.jpg", "/chambre-8.jpg"],
  },
  {
    id: "dl-lagune",
    kind: "room",
    name: "Deluxe Lagune",
    tagline: "Un bureau, une vue, le calme",
    description:
      "Pensée pour ceux qui travaillent loin de chez eux : vrai bureau de noyer, lampe de lecture laiton et la lagune Ébrié qui s'allume au crépuscule.",
    price: 68000,
    unit: "nuit",
    capacity: 2,
    size: 32,
    beds: "Lit king 180",
    features: ["Vue lagune", "Bureau ergonomique", "Machine espresso", "Peignoirs en nid d'abeille"],
    img: IMG.deluxe,
    stock: 12,
  },
  {
    id: "st-limaniya",
    kind: "room",
    name: "Suite Limaniya Golf",
    tagline: "Le salon en plus, la ville en moins",
    description:
      "100 m² de raffinement absolu : salon privé, cuisine équipée, terrasse aménagée et tout le confort d'un appartement de prestige. Boiserie de luxe, Smart TV, espace bureau — pour ceux qui vivent ici comme chez eux.",
    price: 180000,
    unit: "nuit",
    capacity: 3,
    size: 100,
    beds: "Lit king size",
    features: [
      "Lit king size — 3 personnes",
      "Vidéophone",
      "Salon privé",
      "Coiffeuse",
      "Smart TV",
      "Boiserie de luxe",
      "Terrasse aménagée",
      "Bar",
      "Cuisine équipée",
      "Machine à café",
      "Micro-ondes",
      "Réfrigérateur",
      "Espace bureau",
      "Chaînes câblées",
      "Plateau de courtoisie",
      "Wi-Fi haut débit",
      "Room service 24h/24",
      "Pèse-personne",
      "Fer à repasser",
      "Coffre-fort",
    ],
    img: IMG.suite,
    stock: 4,
    badge: "Premium",
    gallery: ["/suite-main.jpg", "/suite-2.jpg", "/suite-3.jpg", "/suite-4.jpg", "/suite-5.jpg"],
  },
  {
    id: "ph-etoile",
    kind: "room",
    name: "Penthouse L'Étoile",
    tagline: "Au-dessus de tout, pour quelques nuits",
    description:
      "Dernier étage, terrasse plein ciel sur Abidjan, lit à baldaquin et dîner privatif sur demande. La résidence entière en dessous de vous.",
    price: 180000,
    unit: "nuit",
    capacity: 4,
    size: 92,
    beds: "Baldaquin king + twin",
    features: ["Terrasse 30 m²", "Majordome dédié", "Bain extérieur", "Transferts offerts"],
    img: IMG.penthouse,
    stock: 2,
    badge: "Signature",
  },
  {
    id: "am-phare",
    kind: "hall",
    name: "Amphithéâtre Le Phare",
    tagline: "Les grandes assemblées",
    description:
      "Grande salle modulable avec éclairage LED, climatisation et régie intégrée. Parfaite pour les plénières, les mariages, les galas et les conventions jusqu'à 220 personnes.",
    price: 350000,
    unit: "jour",
    capacity: 220,
    size: 260,
    configs: [
      { label: "Théâtre", value: 220 },
      { label: "Classe", value: 120 },
      { label: "Banquet", value: 160 },
    ],
    features: ["Éclairage LED sur mesure", "Climatisation réversible", "Régie son & lumière", "Écran de projection", "Foyer café attenant", "Accès PMR"],
    img: IMG.amphitheatre,
    stock: 1,
    badge: "Jusqu'à 220 pers.",
  },
  {
    id: "ex-verger",
    kind: "hall",
    name: "Salon Exécutif Le Verger",
    tagline: "Séminaires de direction",
    description:
      "Espace élégant avec escalier intérieur, écran TV et climatisation. Idéal pour les comités de direction, les ateliers et les séminaires intimes jusqu'à 60 personnes.",
    price: 150000,
    unit: "jour",
    capacity: 60,
    size: 95,
    configs: [
      { label: "Théâtre", value: 60 },
      { label: "Classe", value: 36 },
      { label: "U", value: 28 },
    ],
    features: ["Écran TV HD", "Visioconférence", "Climatisation", "Escalier intérieur", "Paperboard & fournitures", "Pauses sur place"],
    img: IMG.executif,
    stock: 1,
  },
  {
    id: "co-conseil",
    kind: "hall",
    name: "Salle Conseil",
    tagline: "Douze chaises, zéro bruit",
    description:
      "Salle de réunion intime avec table en U, écran TV, rideaux occultants et climatisation. Parfaite pour les conseils d'administration, les entretiens et les petits comités.",
    price: 90000,
    unit: "jour",
    capacity: 18,
    size: 45,
    configs: [
      { label: "Conseil", value: 18 },
      { label: "U", value: 14 },
    ],
    features: ["Écran TV", "Table en U", "Climatisation", "Rideaux occultants", "Service confidentiel", "Café en continu"],
    img: IMG.conseil,
    stock: 1,
  },
];

export const ROOMS = CATALOG.filter((i) => i.kind === "room");
export const HALLS = CATALOG.filter((i) => i.kind === "hall");

export const AMENITIES = [
  { icon: "pool", label: "Piscine & solarium" },
  { icon: "resto", label: "Restaurant Le Fromager" },
  { icon: "spa", label: "Spa & hammam" },
  { icon: "golf", label: "Golf du Houphouët-Boigny" },
  { icon: "shuttle", label: "Navette aéroport FHB" },
  { icon: "wifi", label: "Fibre 1 Gb/s partout" },
  { icon: "car", label: "Parking privé gardé" },
  { icon: "gym", label: "Salle de sport 24/7" },
  { icon: "resto", label: "Traiteur événementiel" },
  { icon: "bell", label: "Conciergerie 24/7" },
  { icon: "desk", label: "Lounge coworking" },
  { icon: "leaf", label: "Jardin d'un hectare" },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Trois jours de séminaire au Phare, soixante collaborateurs, zéro couac technique. Le matin en plénière, l'après-midi au golf. La régie est digne d'une salle de spectacle.",
    author: "Awa N'Diaye",
    role: "DRH, groupe bancaire — Dakar",
    rot: -3,
  },
  {
    quote:
      "J'ai payé ma Suite Limaniya Golf en Wave depuis le taxi. Deux minutes plus tard, le reçu était dans ma boîte mail. Et le lendemain, un birdie au 7e trou. L'hôtellerie de 2026.",
    author: "Jean-Marc Kouassi",
    role: "Consultant — Abidjan",
    rot: 2,
  },
  {
    quote:
      "Le penthouse au crépuscule, la lagune en contrebas, le parcours vu du balcon. On m'avait dit « vous verrez, Abidjan s'allume ». On ne m'avait rien exagéré.",
    author: "Fatou Traoré",
    role: "Directrice artistique — Bamako",
    rot: -1.5,
  },
  {
    quote:
      "Salle Conseil insonorisée, café en continu, facture conforme au devis. Le soir, 9 trous au coucher du soleil. Nous y tenons tous nos comités depuis deux ans.",
    author: "Dr Elias Mensah",
    role: "Administrateur — Accra",
    rot: 2.5,
  },
];

export const FAQS = [
  {
    q: "Le paiement mobile money est-il vraiment sécurisé ?",
    a: "Oui. La transaction est traitée par CinetPay, agréé BCEAO : vous validez vous-même la demande par code secret sur votre téléphone (Wave, Orange Money, MTN MoMo ou Moov Money). La résidence ne voit jamais votre solde ni votre code, et chaque paiement déclenche un reçu horodaté par e-mail et SMS.",
  },
  {
    q: "Que se passe-t-il si je paie par carte bancaire ?",
    a: "La saisie s'effectue dans un formulaire Stripe certifié PCI-DSS avec 3-D Secure. Les numéros de carte ne transitent ni ne sont stockés par nos serveurs : nous ne recevons qu'un jeton de paiement. Visa, Mastercard et Amex sont acceptées.",
  },
  {
    q: "Quelle est la politique d'annulation ?",
    a: "Annulation gratuite jusqu'à 48 h avant l'arrivée pour les chambres, 7 jours pour les salles de conférence. Le remboursement est recrédité sur le moyen de paiement d'origine sous 5 jours ouvrés. Passé ce délai, la première nuit (ou journée de salle) reste due.",
  },
  {
    q: "Quels sont les horaires d'arrivée et de départ ?",
    a: "Check-in à partir de 14 h, check-out avant 12 h. Un départ tardif jusqu'à 18 h est offert selon disponibilité aux membres du programme Limaniya Golf Cercle. La conciergerie, elle, ne dort jamais : arrivée à 3 h du matin, quelqu'un vous attend.",
  },
  {
    q: "Peut-on organiser un séminaire résidentiel complet ?",
    a: "C'est notre spécialité : salle plénière le matin, déjeuner au Fromager, ateliers en Salon Exécutif l'après-midi et chambres bloquées à tarif négocié. Un coordinateur dédié vous suit du devis à la facture unique, TVA et taxe de séjour comprises.",
  },
  {
    q: "Comment accéder au golf depuis la résidence ?",
    a: "Le Golf du Houphouët-Boigny est à 2 minutes à pied. Notre conciergerie réserve vos tee-times, prépare vos cartes et vous transfère si vous préférez. Le driving range est ouvert de 6h à 20h, 365 jours par an. Les sacs de clubs sont entreposés en toute sécurité à la réception.",
  },
];

export interface MethodInfo {
  id: PayMethod;
  name: string;
  family: "Mobile Money" | "Carte bancaire";
  region: string;
  speed: string;
  note: string;
}

export const METHODS: MethodInfo[] = [
  { id: "wave", name: "Wave", family: "Mobile Money", region: "Sénégal · Côte d'Ivoire", speed: "Instantané", note: "Validez la notification sur votre téléphone" },
  { id: "orange", name: "Orange Money", family: "Mobile Money", region: "UEMOA · 17 pays", speed: "Instantané", note: "Validez avec votre code secret #144#" },
  { id: "mtn", name: "MTN MoMo", family: "Mobile Money", region: "Côte d'Ivoire · Ghana", speed: "~ 30 secondes", note: "Validez la demande push MoMo" },
  { id: "moov", name: "Moov Money", family: "Mobile Money", region: "Côte d'Ivoire · Togo · Bénin", speed: "~ 30 secondes", note: "Validez avec votre code Moov" },
  { id: "visa", name: "Visa / Mastercard", family: "Carte bancaire", region: "International", speed: "3-D Secure", note: "Saisie chiffrée, zéro stockage carte" },
  { id: "stripe", name: "Stripe", family: "Carte bancaire", region: "International", speed: "3-D Secure", note: "Apple Pay & Google Pay disponibles" },
];

export const STATS = [
  { value: 48, suffix: "", label: "Chambres & suites" },
  { value: 6, suffix: "", label: "Espaces & services" },
  { value: 3, suffix: "", label: "Salles modulables" },
  { value: 96, suffix: "%", label: "Clients qui reviennent" },
];
