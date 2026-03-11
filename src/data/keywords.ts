import type { PolicyDimension } from "@/src/types/mp";

interface DimensionKeywords {
  right: string[];
  left: string[];
  neutral: string[];
}

export const ISSUE_KEYWORDS: Record<PolicyDimension, DimensionKeywords> = {
  hindu_nationalism: {
    right: [
      "ram mandir", "hindutva", "cow protection", "love jihad", "ghar wapsi",
      "cultural nationalism", "uniform civil code", "ucc", "hindu rashtra",
      "cow slaughter ban", "temple restoration", "hindu heritage",
      "deradicalisation", "anti-conversion", "population control",
    ],
    left: [
      "secularism", "composite culture", "sarva dharma", "pluralism",
      "minority protection", "interfaith", "secular state", "gandhian",
      "communal harmony", "syncretic", "inclusive",
    ],
    neutral: [
      "religion", "temple", "mosque", "church", "faith", "worship",
      "religious", "spiritual", "dharma",
    ],
  },

  economic_liberalization: {
    right: [
      "privatisation", "privatization", "fdi", "ease of business",
      "deregulation", "disinvestment", "free market", "startup",
      "make in india", "ppp", "public private partnership", "corporatisation",
      "liberalise", "liberalize", "free trade zone", "sez",
    ],
    left: [
      "nationalisation", "nationalization", "public sector", "psu",
      "welfare state", "state ownership", "price control", "subsidy",
      "government enterprise", "mixed economy", "planned economy",
      "wealth redistribution", "windfall tax",
    ],
    neutral: [
      "economy", "gdp", "growth", "industry", "market", "business",
      "trade", "investment", "manufacturing", "commerce",
    ],
  },

  federalism: {
    right: [
      "one nation one", "central authority", "national standard",
      "uniform law", "all india service", "national integration",
      "concurrent list", "hindi imposition", "central legislation",
    ],
    left: [
      "state autonomy", "regional rights", "state list",
      "cooperative federalism", "state consent", "decentralisation",
      "decentralization", "local governance", "panchayati raj",
      "state sovereignty", "linguistic rights", "mother tongue",
    ],
    neutral: [
      "federal", "centre", "state", "union", "territory",
      "governor", "chief minister", "interstate", "zonal council",
    ],
  },

  social_welfare: {
    right: [
      "targeted subsidy", "self-reliance", "direct benefit transfer",
      "dbt", "jan dhan", "aatmanirbhar", "skill development",
    ],
    left: [
      "mgnrega", "food security", "right to food", "pension",
      "unemployment allowance", "public distribution", "pds",
      "universal basic income", "ubi", "free ration", "midday meal",
      "housing for all", "pm awas", "welfare expansion",
    ],
    neutral: [
      "welfare", "poverty", "below poverty line", "bpl",
      "social security", "rural development", "livelihood",
    ],
  },

  defense_security: {
    right: [
      "surgical strike", "national security", "afspa", "strong military",
      "defense modernisation", "border security", "nrc", "caa",
      "anti-terror", "uapa", "nia", "strategic autonomy", "nuclear deterrent",
    ],
    left: [
      "peace talks", "demilitarisation", "ceasefire",
      "reduce military spending", "diplomatic solution", "non-violence",
      "human rights", "kashmir dialogue", "repeal afspa", "repeal uapa",
    ],
    neutral: [
      "defense", "defence", "military", "army", "navy", "air force",
      "border", "security", "strategic", "intelligence",
    ],
  },

  agricultural_policy: {
    right: [
      "contract farming", "apmc reform", "fdi in agriculture",
      "agribusiness", "farm corporatisation", "e-nam", "agri-tech",
      "cold chain", "farm to fork",
    ],
    left: [
      "msp guarantee", "farmer protest", "mandi system", "land ceiling",
      "farm loan waiver", "kisan", "crop insurance", "seed sovereignty",
      "organic farming", "protect small farmers", "farmer rights",
      "anti-corporate farming",
    ],
    neutral: [
      "agriculture", "farm", "farmer", "crop", "harvest", "irrigation",
      "fertiliser", "fertilizer", "rural", "agrarian",
    ],
  },

  caste_reservation: {
    right: [
      "merit-based", "creamy layer", "reduce reservation",
      "equal opportunity", "economic reservation", "ews quota",
      "anti-quota", "end reservation",
    ],
    left: [
      "expand reservation", "obc quota", "caste census",
      "social justice", "dalit rights", "mandal", "sc st reservation",
      "horizontal reservation", "sub-categorisation", "representation",
      "annihilation of caste", "anti-discrimination",
    ],
    neutral: [
      "reservation", "quota", "caste", "scheduled caste", "scheduled tribe",
      "obc", "backward class", "affirmative action",
    ],
  },

  environmental_regulation: {
    right: [
      "ease clearance", "fast track approval", "industrial corridor",
      "development first", "mining expansion", "coal production",
      "infrastructure development", "dam construction",
    ],
    left: [
      "climate action", "paris agreement", "renewable energy",
      "solar", "wind energy", "green tribunal", "forest protection",
      "wildlife protection", "adivasi land rights", "carbon tax",
      "net zero", "clean energy transition", "ev",
    ],
    neutral: [
      "environment", "pollution", "air quality", "water", "forest",
      "climate", "ecology", "biodiversity", "carbon",
    ],
  },

  digital_tech_policy: {
    right: [
      "digital india", "startup ecosystem", "tech innovation",
      "light touch regulation", "fintech", "digital payment",
      "it industry", "data localisation", "tech sovereignty",
    ],
    left: [
      "data protection", "privacy", "regulate big tech",
      "platform accountability", "algorithmic transparency",
      "digital rights", "net neutrality", "right to internet",
      "surveillance reform", "content moderation",
    ],
    neutral: [
      "technology", "digital", "internet", "cyber", "ai",
      "artificial intelligence", "blockchain", "data",
    ],
  },

  foreign_policy: {
    right: [
      "quad", "indo-pacific", "us alliance", "western alignment",
      "china containment", "israel ties", "defence partnership",
      "strategic partnership",
    ],
    left: [
      "non-aligned", "nam", "south-south cooperation",
      "brics", "sco", "russia ties", "strategic autonomy",
      "multi-polar world", "global south",
    ],
    neutral: [
      "foreign", "diplomat", "international", "bilateral",
      "multilateral", "un", "united nations", "embassy", "treaty",
    ],
  },

  labor_reform: {
    right: [
      "hire and fire", "labour code", "flexible labour",
      "ease of doing business", "contract labour", "gig economy",
      "industrial relations code", "reduce inspector raj",
    ],
    left: [
      "workers rights", "minimum wage", "trade union",
      "collective bargaining", "informal workers", "social security",
      "esi", "epf", "labour welfare", "gig worker protection",
      "equal pay", "occupational safety",
    ],
    neutral: [
      "labour", "labor", "employment", "worker", "job",
      "industry", "workplace", "wage", "salary",
    ],
  },

  education_policy: {
    right: [
      "nep", "national education policy", "three language formula",
      "private university", "school choice", "boarding school",
      "vedic education", "sanskrit", "iit", "iim expansion",
    ],
    left: [
      "public education", "right to education", "rte",
      "government school", "free education", "mid day meal",
      "mother tongue instruction", "state board",
      "education for all", "teacher recruitment",
    ],
    neutral: [
      "education", "school", "university", "college", "student",
      "teacher", "curriculum", "exam", "board",
    ],
  },

  healthcare_policy: {
    right: [
      "medical tourism", "private hospital", "health insurance",
      "ayushman bharat", "pmjay", "aiims expansion", "telemedicine",
    ],
    left: [
      "universal healthcare", "public health", "government hospital",
      "free treatment", "generic medicine", "jan aushadhi",
      "nationalise healthcare", "health as right",
      "rural health mission", "asha worker",
    ],
    neutral: [
      "healthcare", "health", "hospital", "medical", "doctor",
      "patient", "disease", "medicine", "treatment",
    ],
  },

  minority_rights: {
    right: [
      "uniform civil code", "ucc", "one law for all",
      "abolish personal law", "common civil code",
      "end appeasement", "equal treatment",
    ],
    left: [
      "minority rights", "personal law", "waqf",
      "madrasa", "minority institution", "article 30",
      "protect minority", "religious freedom",
      "minority scholarship", "haj subsidy",
    ],
    neutral: [
      "minority", "muslim", "christian", "sikh", "jain",
      "buddhist", "parsi", "tribal", "community",
    ],
  },

  anti_corruption: {
    right: [
      "lokpal", "whistleblower protection", "transparency",
      "rti", "electoral reform", "one nation one election",
      "digital governance", "e-governance",
    ],
    left: [
      "electoral bonds ban", "political funding reform",
      "rti expansion", "jan lokpal", "asset declaration",
      "anti-defection reform", "campaign finance",
      "judicial accountability", "police reform",
    ],
    neutral: [
      "corruption", "bribery", "transparency", "accountability",
      "governance", "reform", "audit", "investigation",
    ],
  },
};

/** Keywords that signal a Money Bill */
export const MONEY_BILL_KEYWORDS = [
  "tax", "revenue", "consolidated fund", "appropriation",
  "fiscal", "customs duty", "excise", "gst", "cess",
  "budget", "finance bill", "money bill", "fiscal deficit",
];

/** Keywords that signal a Constitutional Amendment */
export const AMENDMENT_KEYWORDS = [
  "constitutional amendment", "article 368", "amend the constitution",
  "fundamental right", "amend article", "constitutional reform",
  "basic structure", "special majority",
];

/** Keywords that trigger absurdity detection */
export const ABSURD_PATTERNS = [
  /\b(kill|murder|assassinat|genocide|ethnic.?cleans)/i,
  /\b(nuclear.?weapon|bioweapon|chemical.?weapon)/i,
  /\b(enslave|trafficking|child.?exploit)/i,
  /\b(hate.?crime.?legal|racial.?superior|caste.?extermination)/i,
  /\b(ban.?all.?religion|mandatory.?conversion)/i,
  /\b(destroy.?parliament|abolish.?democracy|dictatorship)/i,
];
