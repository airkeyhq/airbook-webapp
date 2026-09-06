import { Language } from '@/lib/i18n/translations';

export interface BlogAuthor {
  name: string;
  role: Record<Language, string>;
  avatar: string;
}

export interface BlogCallout {
  type: 'tip' | 'warning' | 'stat' | 'playbook';
  title: Record<Language, string>;
  text: Record<Language, string>;
}

export interface BlogTable {
  headers: Record<Language, string[]>;
  rows: Record<Language, string[][]>;
}

export interface BlogSection {
  id: string;
  heading: Record<Language, string>;
  content: Record<Language, string>;
  callout?: BlogCallout;
  table?: BlogTable;
}

export interface BlogPost {
  slug: string;
  title: Record<Language, string>;
  excerpt: Record<Language, string>;
  category: 'operations' | 'security' | 'finance' | 'retention';
  categoryLabel: Record<Language, string>;
  readTime: Record<Language, string>;
  date: string;
  isoDate: string;
  author: BlogAuthor;
  featured?: boolean;
  keyTakeaways: Record<Language, string[]>;
  sections: BlogSection[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'eliminating-salon-no-shows-deposits',
    category: 'operations',
    categoryLabel: {
      en: 'Operations & Revenue',
      es: 'Operaciones e Ingresos',
      de: 'Betrieb & Umsatz',
      fr: 'Opérations & Revenus',
    },
    title: {
      en: 'The Zero No-Show Playbook: How Card Pre-Authorizations & Deposits Protect Salon Revenue',
      es: 'El Manual Cero Ausencias: Cómo las Preautorizaciones de Tarjeta y Depósitos Protegen los Ingresos del Salón',
      de: 'Das Null-Ausfall-Playbook: Wie Karten-Vorautorisierungen und Anzahlungen Saloneinnahmen schützen',
      fr: 'Le Guide Zéro Absence: Comment les Pré-Autorisations de Carte et Dépôts Protègent les Revenus du Salon',
    },
    excerpt: {
      en: 'Every empty chair costs an average of $85 per hour. Learn how top salons and independent specialists eliminate last-minute cancellations using automated card deposits and instant Stripe Connect payouts.',
      es: 'Cada silla vacía cuesta un promedio de $85 por hora. Descubre cómo los mejores salones y especialistas independientes eliminan cancelaciones de última hora con depósitos automáticos y pagos instantáneos con Stripe Connect.',
      de: 'Jeder leere Stuhl kostet durchschnittlich 85 $ pro Stunde. Erfahren Sie, wie führende Salons und Stylisten kurzfristige Ausfälle mit automatischen Anzahlungen und sofortigen Stripe Connect Auszahlungen eliminieren.',
      fr: 'Chaque fauteuil vide coûte en moyenne 85 $ par heure. Découvrez comment les meilleurs salons éliminent les annulations de dernière minute grâce aux acomptes automatiques et aux virements instantanés Stripe Connect.',
    },
    readTime: {
      en: '6 min read',
      es: '6 min de lectura',
      de: '6 Min. Lesezeit',
      fr: '6 min de lecture',
    },
    date: 'September 2026',
    isoDate: '2026-09-01T08:00:00Z',
    author: {
      name: 'Sofia Chen',
      role: {
        en: 'Head of Operator Success at AirBook',
        es: 'Directora de Éxito del Operador en AirBook',
        de: 'Leiterin für Betreibererfolg bei AirBook',
        fr: 'Responsable du Succès Opérateur chez AirBook',
      },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    featured: true,
    keyTakeaways: {
      en: [
        'Unsecured appointments suffer a 14% to 22% no-show rate across beauty and wellness studios.',
        'A modest 20% to 50% deposit collected at booking drops cancellations to less than 1.8%.',
        'Stripe Connect Express ensures deposits are directly credited to your business account with zero intermediary holding.',
        'AirBook applies automated 24-hour SMS reminder prompts that allow clients to reschedule without forfeit if done in advance.',
      ],
      es: [
        'Las citas sin depósito sufren una tasa de inasistencia del 14% al 22% en estudios de belleza y bienestar.',
        'Un depósito moderado del 20% al 50% reduce las cancelaciones a menos del 1.8%.',
        'Stripe Connect Express garantiza que los depósitos se acrediten directamente en tu cuenta bancaria sin retenciones intermedias.',
        'AirBook aplica recordatorios automáticos por SMS 24 horas antes para reprogramar con anticipación.',
      ],
      de: [
        'Unbesicherte Termine weisen in Beauty- und Wellness-Studios eine Ausfallquote von 14 % bis 22 % auf.',
        'Eine Anzahlung von 20 % bis 50 % bei der Buchung senkt Stornierungen auf unter 1,8 %.',
        'Stripe Connect Express stellt sicher, dass Anzahlungen direkt auf Ihrem Bankkonto gutgeschrieben werden.',
        'AirBook sendet 24 Stunden vorher automatisierte SMS-Erinnerungen für rechtzeitige Umbuchungen.',
      ],
      fr: [
        'Les rendez-vous non garantis subissent un taux de non-présentation de 14 % à 22 % dans les studios de beauté.',
        'Un acompte modéré de 20 % à 50 % lors de la réservation réduit les annulations à moins de 1,8 %.',
        'Stripe Connect Express garantit que les acomptes sont versés directement sur votre compte bancaire sans rétention.',
        'AirBook applique des rappels SMS automatiques 24h à l’avance permettant de reprogrammer facilement.',
      ],
    },
    sections: [
      {
        id: 'the-true-cost-of-empty-chairs',
        heading: {
          en: '1. The Mathematics of Empty Salon Chairs',
          es: '1. La Matemática de las Sillas de Salón Vacías',
          de: '1. Die Mathematik leerer Salonstühle',
          fr: '1. La Mathématique des Fauteuils de Salon Vides',
        },
        content: {
          en: 'For independent stylists, barbers, and medspas, time is perishable inventory. When a client books a 90-minute balayage or aesthetic session and fails to arrive, the operator loses not just the service fee, but also the opportunity cost of turned-away clients and overhead spent on prep work and salon stations.',
          es: 'Para estilistas independientes, barberos y centros de estética, el tiempo es un inventario perecedero. Cuando un cliente reserva una sesión de 90 minutos y no asiste, el operador pierde no solo la tarifa del servicio, sino también el costo de oportunidad de clientes rechazados y los costos de preparación del espacio.',
          de: 'Für Stylisten, Barbiere und Wellness-Profis ist Zeit verderbliches Inventar. Wenn ein Kunde einen 90-minütigen Termin bucht und nicht erscheint, verliert der Salon sowohl das Honorar als auch den Umsatz abgewiesener Kunden und Vorbereitungsaufwand.',
          fr: 'Pour les stylistes indépendants, barbiers et spas, le temps est un inventaire périssable. Lorsqu’un client réserve une séance de 90 minutes et ne se présente pas, l’opérateur perd le tarif du service ainsi que les clients potentiels refusés.',
        },
        table: {
          headers: {
            en: ['Booking Policy', 'Average No-Show Rate', 'Annual Revenue Lost (Solo Operator)'],
            es: ['Política de Reserva', 'Tasa Promedio de Ausencias', 'Pérdida Anual Estimada (Operador Solo)'],
            de: ['Buchungsrichtlinie', 'Durchschnittliche Ausfallquote', 'Jährlicher Umsatzverlust (Einzelbetreiber)'],
            fr: ['Politique de Réservation', 'Taux Moyen de Non-Présentation', 'Perte Annuelle Estimée (Opérateur Solo)'],
          },
          rows: {
            en: [
              ['Zero Card Hold (Honour System)', '18.4%', '$14,200 / year'],
              ['Card On File (Late Fee Clause)', '7.2%', '$5,500 / year'],
              ['Stripe Deposit Protection (25-50%)', '1.4%', '$1,080 / year'],
            ],
            es: [
              ['Sin Tarjeta (Sistema de Honor)', '18.4%', '$14,200 / año'],
              ['Tarjeta en Archivo (Cargo Tardío)', '7.2%', '$5,500 / año'],
              ['Depósito Protegido con Stripe (25-50%)', '1.4%', '$1,080 / año'],
            ],
            de: [
              ['Ohne Kartenbindung (Freie Buchung)', '18,4 %', '14.200 $ / Jahr'],
              ['Hinterlegte Karte (Stornogebühr)', '7,2 %', '5.500 $ / Jahr'],
              ['Stripe Anzahlungsschutz (25-50 %)', '1,4 %', '1.080 $ / Jahr'],
            ],
            fr: [
              ['Sans Empreinte Bancaire (Libre)', '18,4 %', '14 200 $ / an'],
              ['Carte Enregistrée (Frais de Retard)', '7,2 %', '5 500 $ / an'],
              ['Acompte Sécurisé Stripe (25-50 %)', '1,4 %', '1 080 $ / an'],
            ],
          },
        },
      },
      {
        id: 'psychology-of-commitment',
        heading: {
          en: '2. The Psychology of Client Commitment',
          es: '2. La Psicología del Compromiso del Cliente',
          de: '2. Die Psychologie der Kundenverbindlichkeit',
          fr: '2. La Psychologie de l’Engagement Client',
        },
        content: {
          en: 'Studies in behavioral economics show that micro-investments drastically increase attendance. When a client puts down a $25 deposit toward a $100 service, their perception shifts from a loose intention to a confirmed calendar commitment. High-end clients actually prefer deposits because it guarantees their reserved specialist will not be double-booked.',
          es: 'Estudios de economía conductual demuestran que las microinversiones aumentan drásticamente la asistencia. Cuando un cliente abona un depósito de $25 para un servicio de $100, su percepción cambia de una intención vaga a un compromiso confirmado en su agenda. Los clientes valoran positivamente los depósitos porque aseguran que su especialista no tendrá sobreventas.',
          de: 'Verhaltensökonomische Studien zeigen, dass geringe Vorabinvestitionen die Verlässlichkeit massiv steigern. Bei einer Anzahlung von 25 $ für eine 100 $-Dienstleistung verwandelt sich eine unverbindliche Absicht in einen festen Kalendereintrag.',
          fr: 'Des études d’économie comportementale montrent que les micro-engagements augmentent considérablement le taux de présence. Lorsqu’un client verse un acompte de 25 $ sur une prestation de 100 $, son intention devient un rendez-vous ferme.',
        },
        callout: {
          type: 'tip',
          title: {
            en: 'Recommended Policy Setting in AirBook',
            es: 'Configuración Recomendada en AirBook',
            de: 'Empfohlene Richtlinien-Einstellung in AirBook',
            fr: 'Paramétrage Recommandé dans AirBook',
          },
          text: {
            en: 'Set a 30% deposit for services over $60 and a 24-hour cancellation window. This provides flexibility for emergencies while protecting your prime afternoon slots.',
            es: 'Establece un depósito del 30% para servicios superiores a $60 y una ventana de cancelación de 24 horas. Esto brinda flexibilidad para emergencias mientras protege tus horarios estelares.',
            de: 'Aktivieren Sie eine 30 % Anzahlung für Behandlungen über 60 $ und eine 24-Stunden-Stornofrist für maximale Planungssicherheit.',
            fr: 'Définissez un acompte de 30 % pour les services supérieurs à 60 $ avec une fenêtre d’annulation de 24 heures pour protéger vos créneaux clés.',
          },
        },
      },
      {
        id: 'frictionless-checkout-stripe',
        heading: {
          en: '3. Direct Merchant Payouts via Stripe Connect',
          es: '3. Pagos Directos al Comercio con Stripe Connect',
          de: '3. Direkte Händlerauszahlungen über Stripe Connect',
          fr: '3. Virements Commerçants Directs via Stripe Connect',
        },
        content: {
          en: 'Unlike legacy booking systems that pool client funds and issue payouts weeks later, AirBook connects directly to your Stripe account. Deposits and Tap-to-Pay card swipes flow straight to your bank via standard daily rolling transfers with complete transparent fee tracking.',
          es: 'A diferencia de los sistemas de reserva tradicionales que retienen los fondos de los clientes durante semanas, AirBook se conecta directamente a tu cuenta de Stripe. Los depósitos y cobros con Tap-to-Pay van directamente a tu banco mediante transferencias diarias.',
          de: 'Im Gegensatz zu älteren Buchungssystemen, die Gelder wochenlang einbehalten, verbindet sich AirBook direkt mit Ihrem Stripe-Konto. Anzahlungen und Tap-to-Pay-Umsätze fließen direkt auf Ihr Bankkonto mit täglichen Überweisungen.',
          fr: 'Contrairement aux anciens systèmes de réservation qui retiennent vos fonds pendant des semaines, AirBook se connecte directement à votre compte Stripe. Les acomptes et encaissements Tap-to-Pay sont versés quotidiennement sur votre compte bancaire.',
        },
      },
    ],
  },
  {
    slug: 'why-airbook-is-100-percent-passwordless',
    category: 'security',
    categoryLabel: {
      en: 'Security & Privacy',
      es: 'Seguridad y Privacidad',
      de: 'Sicherheit & Datenschutz',
      fr: 'Sécurité & Confidentialité',
    },
    title: {
      en: 'Why AirBook is 100% Passwordless: Passkeys, WebAuthn & Modern Studio Security',
      es: 'Por qué AirBook es 100% Sin Contraseñas: Passkeys, WebAuthn y Seguridad Moderna',
      de: 'Warum AirBook 100 % passwortlos ist: Passkeys, WebAuthn & moderne Studiosicherheit',
      fr: 'Pourquoi AirBook est 100 % Sans Mot de Passe: Passkeys, WebAuthn & Sécurité Moderne',
    },
    excerpt: {
      en: '81% of data breaches stem from stolen or weak passwords. Here is why AirBook stores zero passwords in its database and relies exclusively on biometric passkeys, Touch ID, and cryptographic magic links.',
      es: 'El 81% de las brechas de seguridad se originan en contraseñas débiles o robadas. Descubre por qué AirBook almacena cero contraseñas en su base de datos y utiliza passkeys biométricos y enlaces mágicos criptográficos.',
      de: '81 % aller Sicherheitsverletzungen entstehen durch gestohlene oder schwache Passwörter. Erfahren Sie, warum AirBook keine Passwörter speichert und ausschließlich auf biometrische Passkeys und Magic Links setzt.',
      fr: '81 % des failles de sécurité proviennent de mots de passe volés ou faibles. Découvrez pourquoi AirBook ne stocke aucun mot de passe et s’appuie exclusivement sur les passkeys biométriques et les liens magiques.',
    },
    readTime: {
      en: '5 min read',
      es: '5 min de lectura',
      de: '5 Min. Lesezeit',
      fr: '5 min de lecture',
    },
    date: 'August 2026',
    isoDate: '2026-08-20T08:00:00Z',
    author: {
      name: 'Dr. Marcus Vance',
      role: {
        en: 'Principal Security Architect',
        es: 'Arquitecto Principal de Seguridad',
        de: 'Leitender Sicherheitsarchitekt',
        fr: 'Architecte Principal de Sécurité',
      },
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    featured: false,
    keyTakeaways: {
      en: [
        'Passwords are inherently vulnerable to phishing, credential stuffing, and employee password re-use.',
        'FIDO2 / WebAuthn asymmetric cryptography ensures private keys never leave the operator device (iPad, iPhone, Mac, Windows Hello).',
        'Staff can log in with a 1-second Face ID or Touch ID scan on shared salon front-desk iPads without exposing master credentials.',
        'Zero passwords in our database means zero credential database leak risks for your salon or clients.',
      ],
      es: [
        'Las contraseñas son vulnerables al phishing, relleno de credenciales y reutilización en múltiples sitios.',
        'La criptografía asimétrica FIDO2 / WebAuthn garantiza que las claves privadas nunca salgan del dispositivo del operador.',
        'El personal puede iniciar sesión con Face ID o Touch ID en 1 segundo en iPads compartidos sin revelar contraseñas maestras.',
        'Cero contraseñas en nuestra base de datos significa cero riesgos de filtración de credenciales para tu negocio.',
      ],
      de: [
        'Passwörter sind anfällig für Phishing, Credential Stuffing und Mehrfachverwendung durch Mitarbeiter.',
        'FIDO2 / WebAuthn stellt sicher, dass private Schlüssel das Endgerät (iPad, Mac, Windows Hello) niemals verlassen.',
        'Teammitglieder melden sich in 1 Sekunde per Face ID oder Touch ID an gemeinsamen Rezeptions-Tablets an.',
        'Keine Passwörter in unserer Datenbank bedeutet null Risiko von Passwort-Datenlecks für Ihren Salon.',
      ],
      fr: [
        'Les mots de passe sont vulnérables au hameçonnage et à la réutilisation de mots de passe par les employés.',
        'La cryptographie asymétrique FIDO2 / WebAuthn garantit que les clés privées ne quittent jamais l’appareil de l’opérateur.',
        'Le personnel se connecte en 1 seconde par Face ID ou Touch ID sur les tablettes d’accueil partagées.',
        'Zéro mot de passe dans notre base de données signifie zéro risque de fuite d’identifiants pour votre salon.',
      ],
    },
    sections: [
      {
        id: 'the-password-paradox',
        heading: {
          en: '1. The Salon Front-Desk Password Paradox',
          es: '1. La Paradoja de Contraseñas en Recepción de Salones',
          de: '1. Das Passwort-Paradoxon an der Salonrezeption',
          fr: '1. Le Paradoxe des Mots de Passe à la Réception du Salon',
        },
        content: {
          en: 'In busy beauty studios, staff members frequently log into shared iPads, front-desk terminals, and personal phones. In traditional software, operators write passwords on sticky notes or share master logins, leading to account hijacking, accidental data overrides, and zero audit accountability.',
          es: 'En salones concurridos, los empleados inician sesión frecuentemente en iPads compartidos y terminales de recepción. En el software tradicional, los propietarios anotan contraseñas en notas adhesivas o comparten cuentas maestras, lo que genera riesgos de acceso no autorizado y falta de control.',
          de: 'In lebhaften Studios melden sich Mitarbeiter häufig an gemeinsamen iPads und Kassenterminals an. In traditioneller Software werden Passwörter oft auf Notizzetteln notiert oder geteilt, was zu Sicherheitslücken führt.',
          fr: 'Dans les studios fréquentés, le personnel se connecte souvent sur des iPad partagés et des terminaux d’accueil. Dans les logiciels traditionnels, les mots de passe sont partagés, ce qui crée des failles de sécurité.',
        },
      },
      {
        id: 'how-passkeys-work',
        heading: {
          en: '2. How WebAuthn & Hardware Enclaves Protect Your Business',
          es: '2. Cómo WebAuthn y los Enclaves Seguros Protegen tu Negocio',
          de: '2. Wie WebAuthn und Hardware Enclaves Ihr Unternehmen schützen',
          fr: '2. Comment WebAuthn et les Enclaves Matérielles Protègent Votre Entreprise',
        },
        content: {
          en: 'AirBook uses the modern WebAuthn standard supported by Apple, Google, and Microsoft. When registering a passkey, the device generates a cryptographic keypair inside its tamper-proof Secure Enclave. The public key is stored on our server, while the private key never leaves your biometric sensor.',
          es: 'AirBook utiliza el estándar moderno WebAuthn respaldado por Apple, Google y Microsoft. Al registrar un passkey, el dispositivo genera un par de claves criptográficas dentro de su Secure Enclave. La clave pública se guarda en el servidor y la clave privada nunca sale de tu sensor biométrico.',
          de: 'AirBook verwendet den modernen WebAuthn-Standard von Apple, Google und Microsoft. Bei der Passkey-Registrierung erstellt das Gerät ein kryptografisches Schlüsselpaar im Secure Enclave.',
          fr: 'AirBook utilise le standard WebAuthn pris en charge par Apple, Google et Microsoft. L’appareil génère une paire de clés cryptographiques dans son Secure Enclave matériel.',
        },
        callout: {
          type: 'stat',
          title: {
            en: '100% Phishing Immune',
            es: '100% Inmune al Phishing',
            de: '100 % Phishing-sicher',
            fr: '100 % Immunisé Contre le Hameçonnage',
          },
          text: {
            en: 'Passkeys are domain-bound to getairbook.com. Even if an attacker creates a fake login website, the browser will refuse to supply your authentication token.',
            es: 'Los passkeys están vinculados estrictamente al dominio getairbook.com. Aunque un atacante cree una página falsa, el navegador no enviará tu credencial de autenticación.',
            de: 'Passkeys sind kryptografisch an die Domain getairbook.com gebunden. Ein Klon-Websitedieb kann keine Anmeldeinformationen abfangen.',
            fr: 'Les passkeys sont liés au domaine getairbook.com. Même si un pirate crée une fausse page, le navigateur refusera de fournir le jeton.',
          },
        },
      },
    ],
  },
  {
    slug: 'booth-rental-vs-commission-split-guide',
    category: 'finance',
    categoryLabel: {
      en: 'Finance & Growth',
      es: 'Finanzas y Crecimiento',
      de: 'Finanzen & Wachstum',
      fr: 'Finance & Croissance',
    },
    title: {
      en: 'Booth Rental vs. Commission Splits: The 2026 Salon & Barber Financial Model Guide',
      es: 'Alquiler de Silla vs. División de Comisiones: Guía Financiera 2026 para Salones y Barberías',
      de: 'Stuhlmiete vs. Provisionsmodell: Der Finanzleitfaden 2026 für Salons und Barbershops',
      fr: 'Location de Fauteuil vs. Commission: Le Guide Financier 2026 pour Salons et Barbiers',
    },
    excerpt: {
      en: 'Comparing flat weekly chair rent ($250-$500/wk) versus percentage commission splits (50/50 to 70/30). Calculate the exact threshold where your studio profits most and retain top specialist talent.',
      es: 'Comparativa entre renta semanal fija de silla ($250-$500/sem) frente a comisiones escalonadas (50/50 a 70/30). Calcula el punto exacto de rentabilidad para tu estudio y retén al mejor talento.',
      de: 'Vergleich zwischen fester Stuhlmiete (250–500 $/Woche) und prozentualen Provisionsmodellen. Berechnen Sie die Rentabilitätsschwelle für Ihren Salon und halten Sie Top-Talente.',
      fr: 'Comparaison entre location fixe de fauteuil (250–500 $/sem) et commissions échelonnées. Calculez le seuil exact de rentabilité pour votre studio et fidélisez vos talents.',
    },
    readTime: {
      en: '7 min read',
      es: '7 min de lectura',
      de: '7 Min. Lesezeit',
      fr: '7 min de lecture',
    },
    date: 'July 2026',
    isoDate: '2026-07-15T08:00:00Z',
    author: {
      name: 'Eduardo Martinez',
      role: {
        en: 'Product Architect & Founder',
        es: 'Arquitecto de Producto y Fundador',
        de: 'Produktarchitekt & Gründer',
        fr: 'Architecte Produit & Fondateur',
      },
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    featured: false,
    keyTakeaways: {
      en: [
        'Booth rental guarantees fixed revenue with zero payroll overhead, ideal for established salons in prime metropolitan locations.',
        'Tiered commission models (e.g. 50% base up to $4k, 60% up to $8k, 70% above) incentivize aggressive stylist rebooking and retail upsells.',
        'Hybrid models with product fee deductions protect salon profit margins on expensive chemical formulas and backbar treatments.',
        'AirBook automatically calculates individual specialist payouts, tip allocations, and retail commissions in real time.',
      ],
      es: [
        'El alquiler de silla garantiza ingresos fijos sin carga de nómina, ideal para salones establecidos en zonas céntricas.',
        'Los modelos de comisión escalonada (ej. 50% base hasta $4k, 60% hasta $8k, 70% superior) incentivan la reventa y el rebooking.',
        'Los modelos híbridos con deducción de costos de producto protegen los márgenes de tratamientos químicos costosos.',
        'AirBook calcula automáticamente las liquidaciones de cada especialista, propinas y comisiones de productos en tiempo real.',
      ],
      de: [
        'Stuhlmiete garantiert feste Einnahmen ohne Lohnaufwand, ideal für etablierte Salons in Innenstadtlagen.',
        'Staffelprovisionsmodelle belohnen engagierte Stylisten bei Terminbuchung und Produktverkauf.',
        'Hybridmodelle mit Materialkostenabzug sichern Salonmargen bei teuren Farbbehandlungen ab.',
        'AirBook berechnet Mitarbeitervergütungen, Trinkgelder und Produktprovisionen automatisch in Echtzeit.',
      ],
      fr: [
        'La location de fauteuil garantit des revenus fixes sans charges salariales, idéale pour les salons bien établis.',
        'Les modèles de commission échelonnée motivent les spécialistes sur la fidélisation et la revente.',
        'Les modèles hybrides avec déduction des coûts de produits protègent les marges sur les soins techniques.',
        'AirBook calcule automatiquement les répartitions des spécialistes, pourboires et ventes en temps réel.',
      ],
    },
    sections: [
      {
        id: 'comparing-revenue-models',
        heading: {
          en: '1. Financial Comparison: Fixed Rent vs Commission',
          es: '1. Comparativa Financiera: Alquiler Fijo vs Comisión',
          de: '1. Finanzvergleich: Feste Miete vs. Provision',
          fr: '1. Comparatif Financier: Loyer Fixe vs Commission',
        },
        content: {
          en: 'Selecting the right compensation structure dictates whether your business attracts ambitious master stylists or entry-level apprentices. Let us examine the monthly numbers across a 5-chair salon operating at 75% capacity.',
          es: 'Seleccionar la estructura de compensación adecuada determina si tu negocio atrae a maestros estilistas con clientela propia o aprendices. Analicemos las cifras mensuales de un salón de 5 sillas al 75% de ocupación.',
          de: 'Die Wahl des Vergütungsmodells entscheidet darüber, ob Sie erfahrene Meisterstylisten oder Einsteiger anziehen. Wir analysieren ein 5-Plätze-Studio bei 75 % Auslastung.',
          fr: 'Choisir la bonne structure de rémunération détermine si vous attirez des stylistes confirmés ou des débutants. Analysons un studio de 5 fauteuils à 75 % d’occupation.',
        },
        table: {
          headers: {
            en: ['Model', 'Salon Risk', 'Stylist Upside', 'Monthly Salon Net (5 Chairs)'],
            es: ['Modelo', 'Riesgo del Salón', 'Beneficio del Estilista', 'Neto Mensual del Salón (5 Sillas)'],
            de: ['Modell', 'Salonrisiko', 'Vorteil Stylist', 'Monatlicher Salon-Nettogewinn (5 Plätze)'],
            fr: ['Modèle', 'Risque Salon', 'Avantage Spécialiste', 'Net Mensuel du Salon (5 Fauteuils)'],
          },
          rows: {
            en: [
              ['Flat Booth Rent ($350/wk)', 'Very Low (Guaranteed Income)', 'Maximum (Keeps 100% of revenue)', '$7,000 / month'],
              ['Standard Commission (50/50)', 'Moderate (Tied to chair volume)', 'Moderate (Shared risk)', '$12,500 / month'],
              ['Performance Tiered (55-70%)', 'Low-Moderate (High motivator)', 'High (Higher volume = higher %)', '$14,200 / month'],
            ],
            es: [
              ['Alquiler Fijo ($350/sem)', 'Muy Bajo (Ingreso Garantizado)', 'Máximo (Conserva el 100% de servicios)', '$7,000 / mes'],
              ['Comisión Estándar (50/50)', 'Moderado (Vinculado al volumen)', 'Moderado (Riesgo compartido)', '$12,500 / mes'],
              ['Escalonado por Metas (55-70%)', 'Bajo-Moderado (Alta motivación)', 'Alto (Mayor volumen = mayor %)', '$14,200 / mes'],
            ],
            de: [
              ['Feste Stuhlmiete (350 $/Woche)', 'Sehr gering (Garantierte Miete)', 'Maximal (100 % Umsatz bleibt beim Stylist)', '7.000 $ / Monat'],
              ['Standardprovision (50/50)', 'Moderat (Umsatzabhängig)', 'Moderat (Geteiltes Risiko)', '12.500 $ / Monat'],
              ['Leistungsstaffel (55–70 %)', 'Gering-Moderat (Hoher Anreiz)', 'Hoch (Mehr Umsatz = höhere Marge)', '14.200 $ / Monat'],
            ],
            fr: [
              ['Loyer Fixe (350 $/sem)', 'Très faible (Revenu garanti)', 'Maximal (Garde 100 % de ses prestations)', '7 000 $ / mois'],
              ['Commission Standard (50/50)', 'Modéré (Lié au volume)', 'Modéré (Risque partagé)', '12 500 $ / mois'],
              ['Échelonnée aux Objectifs (55-70 %)', 'Faible-Modéré (Très motivant)', 'Élevé (Plus de volume = meilleur %)', '14 200 $ / mois'],
            ],
          },
        },
      },
    ],
  },
  {
    slug: 'client-retention-sms-automation-playbook',
    category: 'retention',
    categoryLabel: {
      en: 'Client Retention & AI',
      es: 'Retención de Clientes e IA',
      de: 'Kundenbindung & KI',
      fr: 'Fidélisation Client & IA',
    },
    title: {
      en: 'The 3-Week Rebooking Blueprint: Gentle SMS Automation That Keeps Schedules Full',
      es: 'El Plan de Re-reserva a 3 Semanas: Automatización SMS que Mantiene tu Agenda Llena',
      de: 'Der 3-Wochen-Rebooking-Plan: Sanfte SMS-Automatisierung für volle Terminkalender',
      fr: 'Le Plan de Re-Réservation à 3 Semaines: L’Automatisation SMS qui Remplit Votre Agenda',
    },
    excerpt: {
      en: 'How automated, personalized Apple Messages and SMS prompts sent at exactly 21 days post-service generate a 34% higher repeat booking rate without feeling like spam.',
      es: 'Cómo los mensajes de texto personalizados enviados exactamente a los 21 días post-servicio generan un 34% más de citas recurrentes de forma natural y elegante.',
      de: 'Wie automatisierte, personalisierte SMS-Nachrichten genau 21 Tage nach dem Termin eine um 34 % höhere Wiederbuchungsrate erzielen, ohne aufdringlich zu wirken.',
      fr: 'Comment des SMS personnalisés envoyés exactement 21 jours après la prestation génèrent 34 % de réservations récurrentes en plus de façon élégante.',
    },
    readTime: {
      en: '5 min read',
      es: '5 min de lectura',
      de: '5 Min. Lesezeit',
      fr: '5 min de lecture',
    },
    date: 'June 2026',
    isoDate: '2026-06-10T08:00:00Z',
    author: {
      name: 'Camille Dubois',
      role: {
        en: 'Salon Operations Strategist',
        es: 'Estratega de Operaciones de Salón',
        de: 'Salon-Betriebsstrategin',
        fr: 'Stratège des Opérations de Salon',
      },
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    featured: false,
    keyTakeaways: {
      en: [
        'The optimal rebooking reminder window is between 18 and 24 days for hair/barber services and 28 days for medspas.',
        'SMS open rates exceed 98%, compared to only 19% for traditional email newsletters.',
        'Include a direct 1-tap booking URL pre-populated with the client’s preferred specialist and previous service.',
        'Automated Google review requests sent 60 minutes after checkout yield a 4.2x review conversion lift.',
      ],
      es: [
        'La ventana óptima de recordatorio de re-reserva es entre 18 y 24 días para cabello y barbería, y 28 días para estética.',
        'Las tasas de apertura de SMS superan el 98%, en comparación con solo el 19% de los boletines por correo electrónico.',
        'Incluye un enlace directo de 1 toque preconfigurado con el especialista y servicio habitual del cliente.',
        'Las solicitudes de reseña de Google enviadas 60 minutos después del cobro multiplican por 4.2 las valoraciones positivas.',
      ],
      de: [
        'Das optimale Erinnerungsfenster liegt zwischen 18 und 24 Tagen bei Friseuren/Barbershops und 28 Tagen bei Spas.',
        'SMS-Öffnungsraten übertreffen 98 %, verglichen mit nur 19 % bei herkömmlichen E-Mail-Newslettern.',
        'Fügen Sie einen 1-Klick-Buchungslink mit dem bevorzugten Spezialisten und der letzten Leistung ein.',
        'Google-Bewertungsanfragen 60 Minuten nach dem Kassieren steigern Bewertungen um das 4,2-fache.',
      ],
      fr: [
        'La fenêtre idéale de rappel se situe entre 18 et 24 jours pour la coiffure/barbier et 28 jours pour les soins spa.',
        'Les taux d’ouverture des SMS dépassent 98 %, contre seulement 19 % pour les e-mails traditionnels.',
        'Intégrez un lien de réservation directe en 1 clic pré-rempli avec le spécialiste habituel.',
        'Les demandes d’avis Google envoyées 60 minutes après le passage en caisse multiplient les avis par 4,2.',
      ],
    },
    sections: [
      {
        id: 'timing-the-rebooking-cadence',
        heading: {
          en: '1. The Science of the 21-Day Trigger Cadence',
          es: '1. La Ciencia de la Cadencia de Activación a 21 Días',
          de: '1. Die Wissenschaft des 21-Tage-Erinnerungszyklus',
          fr: '1. La Science de la Relance à 21 Jours',
        },
        content: {
          en: 'Clients often postpone scheduling their next appointment until their calendar is already congested. By dispatching a warm, context-aware prompt at the 3-week mark, you remove the friction of scheduling and prevent clients from slipping into the lapsed 60+ day inactive zone.',
          es: 'Los clientes suelen postergar su próxima cita hasta que su propia agenda está saturada. Al enviar un recordatorio cálido y contextual a las 3 semanas, eliminas la fricción y evitas que el cliente pase a la zona inactiva de más de 60 días.',
          de: 'Kunden schieben die nächste Terminbuchung oft auf, bis ihr eigener Kalender voll ist. Eine freundliche, kontextbezogene SMS nach 3 Wochen eliminiert Buchungshürden und verhindert das Abwandern von Stammkunden.',
          fr: 'Les clients reportent souvent leur prochain rendez-vous. En envoyant un message chaleureux et contextuel à 3 semaines, vous éliminez les frictions et préservez la récurrence.',
        },
        callout: {
          type: 'playbook',
          title: {
            en: 'High-Converting SMS Template',
            es: 'Plantilla SMS de Alta Conversión',
            de: 'Erfolgreiche SMS-Vorlage',
            fr: 'Modèle SMS à Forte Conversion',
          },
          text: {
            en: '“Hi Sarah, it has been 3 weeks since your gloss & trim with Elena at Lumière Salon. Ready to refresh your look for next weekend? Tap to reserve your favorite slot: getairbook.com/book/lumiere?ref=elena”',
            es: '“Hola Sarah, han pasado 3 semanas desde tu brillo y corte con Elena en Lumière Salon. ¿Lista para renovar tu estilo el próximo fin de semana? Toca aquí para elegir tu horario: getairbook.com/book/lumiere?ref=elena”',
            de: '„Hallo Sarah, vor 3 Wochen warst du bei Elena im Salon Lumière. Möchtest du deinen Schnitt für nächstes Wochenende auffrischen? Hier deinen Termin sichern: getairbook.com/book/lumiere?ref=elena“',
            fr: '« Bonjour Sarah, cela fait 3 semaines depuis votre soin avec Elena chez Lumière Salon. Prête à rafraîchir votre coupe pour le week-end prochain ? Réservez ici : getairbook.com/book/lumiere?ref=elena »',
          },
        },
      },
    ],
  },
];
