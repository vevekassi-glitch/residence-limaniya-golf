import type { CatalogItem, PayMethod } from "./types";

const IMG = {
  hero: "https://image.qwenlm.ai/generated-images/80a4317d-1c57-48e8-84db-5d8a4f5ef5ba/_result.png",
  lobby: "https://image.qwenlm.ai/generated-images/8f2875da-35e3-4c4c-aedd-dfd5da575791/_result.png",
  chambre: "https://image.qwenlm.ai/generated-images/671e1fc6-8f39-47bb-8db1-8419c682d2e1/_result.png",
  deluxe: "https://image.qwenlm.ai/generated-images/3d61fdc3-0d83-4616-9e26-cb772df9496f/_result.png",
  suite: "https://image.qwenlm.ai/generated-images/a230da84-8cfb-4cdf-933d-2b1d2fbe2be5/_result.png",
  penthouse: "https://image.qwenlm.ai/generated-images/c9f50abf-89d7-445b-9128-b7fd13d261e4/_result.png",
  conference: "https://image.qwenlm.ai/generated-images/994533fd-d442-49b7-8c10-c18972f65f5b/_result.png",
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
      "Tête de lit capitonnée vert profond, lin lavé, lumière du matin filtrée par les voilages. La chambre qui fait oublier qu'on est en voyage d'affaires.",
    price: 45000,
    unit: "nuit",
    capacity: 2,
    size: 24,
    beds: "Lit queen 160",
    features: ["Douche pluie", "Fibre 1 Gb/s", "Climatisation silencieuse", "Coffre-fort"],
    img: IMG.chambre,
    stock: 14,
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
    id: "st-azalai",
    kind: "room",
    name: "Suite Azalaï",
    tagline: "Le salon en plus, la ville en moins",
    description:
      "Un salon courbe pour recevoir, une pièce sculptée rapportée du Nord, et la chambre en retrait derrière une claustra de bois. Quarante-huit mètres carrés de silence.",
    price: 95000,
    unit: "nuit",
    capacity: 3,
    size: 48,
    beds: "King + canapé-lit",
    features: ["Salon privé", "Baignoire îlot", "Dressing", "Accès spa inclus"],
    img: IMG.suite,
    stock: 8,
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
      "Gradins en pente douce, acoustique traitée, régie intégrée. Pensé pour les plénières, les lancements et les conventions qui doivent impressionner.",
    price: 350000,
    unit: "jour",
    capacity: 220,
    size: 260,
    configs: [
      { label: "Théâtre", value: 220 },
      { label: "Classe", value: 120 },
      { label: "Banquet", value: 160 },
    ],
    features: ["Vidéoprojecteur 12 000 lm", "Régie son & lumière", "Traduction simultanée (4 cabines)", "Foyer café attenant"],
    img: IMG.conference,
    stock: 1,
    badge: "Jusqu'à 220 pers.",
  },
  {
    id: "ex-verger",
    kind: "hall",
    name: "Salon Exécutif Le Verger",
    tagline: "Séminaires de direction",
    description:
      "Bois acoustique, lumière naturelle maîtrisée et pauses servies sous la véranda. Le format juste pour deux jours de comité de direction.",
    price: 150000,
    unit: "jour",
    capacity: 60,
    size: 95,
    configs: [
      { label: "Théâtre", value: 60 },
      { label: "Classe", value: 36 },
      { label: "U", value: 28 },
    ],
    features: ["Écran 98\"", "Visioconférence native", "Véranda pauses", "Paperboard & fournitures"],
    img: IMG.conference,
    stock: 1,
  },
  {
    id: "co-conseil",
    kind: "hall",
    name: "Salle Conseil",
    tagline: "Douze chaises, zéro bruit",
    description:
      "Table monoxyle, fauteuils de cuir vert, insonorisation totale. La pièce où se signent les accords — et où l'on ne doit surtout pas être dérangé.",
    price: 90000,
    unit: "jour",
    capacity: 18,
    size: 45,
    configs: [
      { label: "Conseil", value: 18 },
      { label: "U", value: 14 },
    ],
    features: ["Écran 75\" tactile", "Visio 4K", "Service confidentiel", "Café en continu"],
    img: IMG.conference,
    stock: 1,
  },
];

export const ROOMS = CATALOG.filter((i) => i.kind === "room");
export const HALLS = CATALOG.filter((i) => i.kind === "hall");

export const AMENITIES = [
  { icon: "pool", label: "Piscine & solarium" },
  { icon: "resto", label: "Restaurant Le Fromager" },
  { icon: "spa", label: "Spa & hammam" },
  { icon: "shuttle", label: "Navette aéroport FHB" },
  { icon: "wifi", label: "Fibre 1 Gb/s partout" },
  { icon: "car", label: "Parking privé gardé" },
  { icon: "gym", label: "Salle de sport 24/7" },
  { icon: "bell", label: "Conciergerie 24/7" },
  { icon: "desk", label: "Lounge coworking" },
  { icon: "leaf", label: "Jardin d'un hectare" },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Trois jours de séminaire au Phare, soixante collaborateurs, zéro couac technique. La régie est digne d'une salle de spectacle.",
    author: "Awa N'Diaye",
    role: "DRH, groupe bancaire — Dakar",
    rot: -3,
  },
  {
    quote:
      "J'ai payé ma Suite Azalaï en Wave depuis le taxi. Deux minutes plus tard, le reçu était dans ma boîte mail. C'est l'hôtellerie de 2026.",
    author: "Jean-Marc Kouassi",
    role: "Consultant — Abidjan",
    rot: 2,
  },
  {
    quote:
      "Le penthouse au crépuscule, la lagune en contrebas. On m'avait dit « vous verrez, Abidjan s'allume ». On ne m'avait rien exagéré.",
    author: "Fatou Traoré",
    role: "Directrice artistique — Bamako",
    rot: -1.5,
  },
  {
    quote:
      "Salle Conseil insonorisée, café en continu, facture conforme au devis. Nous y tenons tous nos comités depuis deux ans.",
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
    a: "Check-in à partir de 14 h, check-out avant 12 h. Un départ tardif jusqu'à 18 h est offert selon disponibilité aux membres du programme Azalaï Cercle. La conciergerie, elle, ne dort jamais : arrivée à 3 h du matin, quelqu'un vous attend.",
  },
  {
    q: "Peut-on organiser un séminaire résidentiel complet ?",
    a: "C'est notre spécialité : salle plénière le matin, déjeuner au Fromager, ateliers en Salon Exécutif l'après-midi et chambres bloquées à tarif négocié. Un coordinateur dédié vous suit du devis à la facture unique, TVA et taxe de séjour comprises.",
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
  { value: 3, suffix: "", label: "Salles modulables" },
  { value: 220, suffix: "", label: "Places en plénière" },
  { value: 96, suffix: "%", label: "Clients qui reviennent" },
];
