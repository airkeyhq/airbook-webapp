export interface SpecPresetItem {
  id: string;
  labelKey: string;
  placeholderKey: string;
  suggestedValues: string[];
}

export interface IndustrySpecCategory {
  id: 'hair' | 'barber' | 'spa' | 'nails' | 'medspa' | 'custom';
  nameKey: string;
  presets: SpecPresetItem[];
}

export const INDUSTRY_SPEC_CATEGORIES: IndustrySpecCategory[] = [
  {
    id: 'hair',
    nameKey: 'specCatHair',
    presets: [
      {
        id: 'hair-formula',
        labelKey: 'specHairFormula',
        placeholderKey: 'specHairFormulaPlaceholder',
        suggestedValues: [
          'Redken Shades EQ 09P + 09V (1:1)',
          'Wella Koleston 7/1 + 20vol (1:1.5)',
          'Schwarzkopf Igora Royal 6-12 + 6%',
          'Olaplex Step 1 (3.75ml) + Lightener',
          'Gloss: 010N + 010GI Clear Dilution',
        ],
      },
      {
        id: 'hair-base-level',
        labelKey: 'specHairBaseLevel',
        placeholderKey: 'specHairBaseLevelPlaceholder',
        suggestedValues: [
          'Level 5 Natural Light Brown (Warm Undertone)',
          'Level 6 Dark Blonde (Neutral)',
          'Level 7 Medium Blonde (Cool Ash)',
          'Level 3 Dark Brown (Heavy Red Undertone)',
          'Level 9 Very Light Blonde (Pre-lightened)',
        ],
      },
      {
        id: 'hair-scalp',
        labelKey: 'specHairScalp',
        placeholderKey: 'specHairScalpPlaceholder',
        suggestedValues: [
          'Low / Normal Tolerance',
          'Medium (Apply Scalp Barrier Oil)',
          'High Sensitivity (Zero Ammonia / Hypoallergenic)',
          'Dry / Flaky Scalp (Prep with soothing serum)',
        ],
      },
      {
        id: 'hair-developer',
        labelKey: 'specHairDeveloper',
        placeholderKey: 'specHairDeveloperPlaceholder',
        suggestedValues: [
          '10 Vol (3%) · Deposit Only / Tone',
          '20 Vol (6%) · Standard 1-2 Level Lift',
          '30 Vol (9%) · 2-3 Level Lift / Balayage',
          '40 Vol (12%) · High Lift Series Only',
        ],
      },
      {
        id: 'hair-processing',
        labelKey: 'specHairProcessing',
        placeholderKey: 'specHairProcessingPlaceholder',
        suggestedValues: [
          '20 min · Ambient Room Temp',
          '35 min · Foil Wrap with Gentle Heat',
          '45 min · Open Air Balayage Dry',
          '10 min · Rapid Toner at Shampoo Bowl',
        ],
      },
    ],
  },
  {
    id: 'barber',
    nameKey: 'specCatBarber',
    presets: [
      {
        id: 'barber-fade',
        labelKey: 'specBarberFade',
        placeholderKey: 'specBarberFadePlaceholder',
        suggestedValues: [
          'Skin Fade #0.5 to #2 Guard Transition',
          'Low Drop Fade #0 to #1.5 Guard',
          'Mid Taper Fade #1 to #3 Guard',
          'Scissor Over Comb Natural Taper',
          'Burst Fade #0 to #2 around ears',
        ],
      },
      {
        id: 'barber-blade',
        labelKey: 'specBarberBlade',
        placeholderKey: 'specBarberBladePlaceholder',
        suggestedValues: [
          'Zero-gap Trimmer + Hypoallergenic Foil Finish',
          'Straight Razor with Warm Lather & Hot Towel',
          'Ceramic Clipper #1.5 Open Guard',
          'Texture Shears + Feather Razor Crown',
        ],
      },
      {
        id: 'barber-beard',
        labelKey: 'specBarberBeard',
        placeholderKey: 'specBarberBeardPlaceholder',
        suggestedValues: [
          'Sharp Cheek Contour + Matte Styling Balm',
          'Natural Graduated Taper + Sandalwood Oil',
          'Clean Shaven with Cooling Tea Tree Finish',
          'Stubble #1 Guard Uniform Trim',
        ],
      },
      {
        id: 'barber-hairline',
        labelKey: 'specBarberHairline',
        placeholderKey: 'specBarberHairlinePlaceholder',
        suggestedValues: [
          'Crisp Razor Box-Up Hairline',
          'Natural Rounded Neckline with Soft Taper',
          'Square Blocked Neckline',
          'C-Cup & Temple Sharp Alignment',
        ],
      },
    ],
  },
  {
    id: 'spa',
    nameKey: 'specCatSpa',
    presets: [
      {
        id: 'spa-skin-type',
        labelKey: 'specSpaSkinType',
        placeholderKey: 'specSpaSkinTypePlaceholder',
        suggestedValues: [
          'Fitzpatrick Type I-II · Sensitive / Rosacea Prone',
          'Fitzpatrick Type III-IV · Combination / Normal',
          'Fitzpatrick Type V-VI · Hyperpigmentation Prone',
          'Oily / Congested T-Zone · Barrier Impaired',
          'Mature / Dehydrated · Fine Lines Focus',
        ],
      },
      {
        id: 'spa-treatment',
        labelKey: 'specSpaTreatment',
        placeholderKey: 'specSpaTreatmentPlaceholder',
        suggestedValues: [
          'HydraFacial Deluxe + Red LED Light Therapy',
          'Deep Tissue Body Therapy + Hot Stone Alignment',
          'Gentle Enzyme Peel + Hyaluronic Booster Infusion',
          'Lymphatic Drainage Massage + Gua Sha Sculpt',
        ],
      },
      {
        id: 'spa-pressure',
        labelKey: 'specSpaPressure',
        placeholderKey: 'specSpaPressurePlaceholder',
        suggestedValues: [
          'Light / Gentle Relaxation Pressure',
          'Medium / Balanced Swedish Touch',
          'Firm / Deep Tissue Upper Trapezius Focus',
          'Custom Pressure (Upper Back Firm, Legs Light)',
        ],
      },
      {
        id: 'spa-aroma',
        labelKey: 'specSpaAroma',
        placeholderKey: 'specSpaAromaPlaceholder',
        suggestedValues: [
          'French Lavender & Roman Chamomile',
          'Eucalyptus, Peppermint & Tea Tree',
          'Sweet Orange, Bergamot & Neroli',
          '100% Fragrance-Free / Pure Jojoba Carrier',
        ],
      },
    ],
  },
  {
    id: 'nails',
    nameKey: 'specCatNails',
    presets: [
      {
        id: 'nails-lash-map',
        labelKey: 'specNailsLashMap',
        placeholderKey: 'specNailsLashMapPlaceholder',
        suggestedValues: [
          'Cat Eye · C-Curl · 9mm-13mm · 0.07 Diameter',
          'Doll Eye · D-Curl · 10mm-14mm · 0.05 Volume',
          'Hybrid Natural · CC-Curl · 8mm-12mm',
          'Wispy Kim K Style · D-Curl Spikes + C-Curl Base',
        ],
      },
      {
        id: 'nails-shape',
        labelKey: 'specNailsShape',
        placeholderKey: 'specNailsShapePlaceholder',
        suggestedValues: [
          'Almond Medium · Builder Gel in a Bottle (BIAB)',
          'Square Short · Structured Gel Manicure',
          'Coffin Long · Acrylic Overlay with Ombré',
          'Oval Natural · Hard Gel Strengthening Layer',
        ],
      },
      {
        id: 'nails-finish',
        labelKey: 'specNailsFinish',
        placeholderKey: 'specNailsFinishPlaceholder',
        suggestedValues: [
          'High Gloss Mirror Glaze Top Coat',
          'Velvet Soft-Touch Matte Finish',
          'Chrome Pearl Glaze Effect',
          'Micro French White Tip · Clean Smile Line',
        ],
      },
    ],
  },
  {
    id: 'medspa',
    nameKey: 'specCatMedspa',
    presets: [
      {
        id: 'medspa-area',
        labelKey: 'specMedspaArea',
        placeholderKey: 'specMedspaAreaPlaceholder',
        suggestedValues: [
          'Forehead Lines & Glabellar Complex (Frown Lines)',
          'Crow’s Feet (Lateral Canthal Lines)',
          'Nasolabial Folds & Marionette Contouring',
          'Full Face Collagen Induction Microneedling (1.5mm)',
          'Lip Border Definition & Volume Augmentation',
        ],
      },
      {
        id: 'medspa-dosage',
        labelKey: 'specMedspaDosage',
        placeholderKey: 'specMedspaDosagePlaceholder',
        suggestedValues: [
          '20 Units Botox Cosmetic (4 Units per injection point)',
          '30 Units Dysport (Reconstituted with 2.5ml bacteriostatic saline)',
          '1.0 mL Juvederm Ultra Plus XC (27G needle)',
          '0.5 mL Restylane Kysse with Micro-Cannula',
        ],
      },
      {
        id: 'medspa-numbing',
        labelKey: 'specMedspaNumbing',
        placeholderKey: 'specMedspaNumbingPlaceholder',
        suggestedValues: [
          'Lidocaine 5% Topical Cream · 20 min Occlusion',
          'BLT Compound Cream (Benzocaine 20%/Lidocaine 6%/Tetracaine 4%) · 30 min',
          'Ice Roller + Vibration Anesthesia Device',
          'None / Direct Injection',
        ],
      },
    ],
  },
  {
    id: 'custom',
    nameKey: 'specCatCustom',
    presets: [],
  },
];
