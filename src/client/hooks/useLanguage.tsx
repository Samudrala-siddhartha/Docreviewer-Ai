import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type Language = 'en' | 'hi' | 'te';

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    te: string;
  };
}

export const languagesList: { code: Language; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
];

// Comprehensive Master Dictionary covering every section of DocSure AI
export const dictionary: Translations = {
  // Brand & Header
  'app_title': {
    en: 'DocSure AI',
    hi: 'डॉक्श्योर एआई',
    te: 'డాక్‌ష్యూర్ ఏఐ'
  },
  'app_subtitle': {
    en: 'Advanced Identity Document Screening & Border Intelligence System',
    hi: 'उन्नत पहचान दस्तावेज़ स्क्रीनिंग और सीमा खुफिया प्रणाली',
    te: 'అధునాతన గుర్తింపు పత్రం స్క్రీనింగ్ & సరిహద్దు ఇంటెలిజెన్స్ సిస్టమ్'
  },
  'zero_retention': {
    en: 'Zero-Retention Ephemeral Storage',
    hi: 'शून्य-अवधारण अल्पकालिक संग्रहण',
    te: 'జీరో-రిటెన్షన్ సురక్షిత నిల్వ'
  },
  'zero_retention_desc': {
    en: 'Zero-retention memory purge boundary active (15m TTL buffer). No raw biometrics stored.',
    hi: 'शून्य-अवधारण मेमोरी पर्ज सीमा सक्रिय (15 मिनट टीटीएल बफ़र)। कोई कच्चा बायोमेट्रिक्स संग्रहीत नहीं।',
    te: 'జీరో-రిటెన్షన్ మెమరీ పర్జ్ బౌండరీ యాక్టివ్ (15 నిమిషాల టిటిఎల్ బఫర్). ఎలాంటి బయోమెట్రిక్స్ నిల్వ చేయబడవు.'
  },
  'ephemeral_ram': {
    en: 'Ephemeral RAM Sandbox',
    hi: 'अल्पकालिक रैम सैंडबॉक्स',
    te: 'ఎఫెమరల్ రామ్ శాండ్‌బాక్స్'
  },
  'active_status': {
    en: 'ACTIVE',
    hi: 'सक्रिय',
    te: 'యాక్టివ్'
  },
  'sih_persona': {
    en: 'SIH Evaluation Persona',
    hi: 'एसआईएच मूल्यांकन भूमिका',
    te: 'ఎస్ఐహెచ్ మూల్యాంకన పాత్ర'
  },
  'role_user': {
    en: 'User',
    hi: 'उपयोगकर्ता',
    te: 'వినియోగదారు'
  },
  'role_reviewer': {
    en: 'Reviewer',
    hi: 'समीक्षक',
    te: 'సమీక్షకుడు'
  },
  'role_admin': {
    en: 'Admin',
    hi: 'व्यवस्थापक',
    te: 'నిర్వాహకుడు'
  },
  'sign_in': {
    en: 'Sign In',
    hi: 'साइन इन करें',
    te: 'సైన్ ఇన్'
  },
  'sign_out': {
    en: 'Sign Out',
    hi: 'साइन आउट',
    te: 'సైన్ అవుట్'
  },
  'profile_settings': {
    en: 'Profile & Security Settings',
    hi: 'प्रोफ़ाइल और सुरक्षा सेटिंग्स',
    te: 'ప్రొఫైల్ & భద్రతా సెట్టింగ్‌లు'
  },
  'install_app': {
    en: 'Install App',
    hi: 'ऐप इंस्टॉल करें',
    te: 'యాప్ ఇన్‌స్టాల్'
  },

  // Navigation Items
  'nav_home': {
    en: 'Executive Dashboard',
    hi: 'कार्यकारी डैशबोर्ड',
    te: 'ఎగ్జిక్యూటివ్ డాష్‌బోర్డ్'
  },
  'nav_home_desc': {
    en: 'System health, real-time metrics & risk distribution',
    hi: 'सिस्टम स्वास्थ्य, रीयल-टाइम मेट्रिक्स और जोखिम वितरण',
    te: 'సిస్టమ్ ఆరోగ్యం, రియల్-టైమ్ మెట్రిక్స్ & రిస్క్ పంపిణీ'
  },
  'nav_scan': {
    en: 'Screen Document',
    hi: 'दस्तावेज़ स्क्रीनिंग',
    te: 'పత్రాన్ని స్క్రీన్ చేయండి'
  },
  'nav_scan_desc': {
    en: '7-phase multi-spectral forensic verification pipeline',
    hi: '7-चरणीय बहु-स्पेक्ट्रल फोरेंसिक सत्यापन पाइपलाइन',
    te: '7-దశల మల్టీ-స్పెక్ట్రల్ ఫోరెన్సిక్ ధృవీకరణ పైప్‌లైన్'
  },
  'nav_history': {
    en: 'Scan Archives',
    hi: 'स्कैन अभिलेखागार',
    te: 'స్కాన్ ఆర్కైవ్స్'
  },
  'nav_history_desc': {
    en: 'Chronological audit records & verified metadata',
    hi: 'कालानुक्रमिक ऑडिट रिकॉर्ड और सत्यापित मेटाडेटा',
    te: 'కాలక్రమ ఆడిట్ రికార్డులు & ధృవీకరించబడిన మెటాడేటా'
  },
  'nav_reports': {
    en: 'Forensic Reports Dossier',
    hi: 'फोरेंसिक रिपोर्ट डोजियर',
    te: 'ఫోరెన్సిక్ నివేదికల డోసియర్'
  },
  'nav_reports_desc': {
    en: 'Downloadable PDF audit dossiers & legal disclaimers',
    hi: 'डाउनलोड करने योग्य पीडीएफ ऑडिट डोजियर और कानूनी अस्वीकरण',
    te: 'డౌన్‌లోడ్ చేసుకోదగిన పిడిఎఫ్ ఆడిట్ డోసియర్‌లు & చట్టపరమైన నిరాకరణలు'
  },
  'nav_evidence': {
    en: 'Evidence Heatmap Viewer',
    hi: 'साक्ष्य हीटमैप दर्शक',
    te: 'సాక్ష్యాల హీట్‌మ్యాప్ వ్యూయర్'
  },
  'nav_evidence_desc': {
    en: 'Multi-spectral ELA overlays & bounding markers',
    hi: 'मल्टी-स्पेक्ट्रल ईएलए ओवरले और बाउंडिंग मार्कर',
    te: 'మల్టీ-స్పెక్ట్రల్ ఈఎల్ఏ ఓవర్‌లేలు & బౌండింగ్ గుర్తులు'
  },
  'nav_digilocker': {
    en: 'DigiLocker Sandbox',
    hi: 'डिजीलॉकर सैंडबॉक्स',
    te: 'డిజిలాకర్ శాండ్‌బాక్స్'
  },
  'nav_digilocker_desc': {
    en: 'Government repository credential ingestion demo',
    hi: 'सरकारी रिपॉजिटरी क्रेडेंशियल अंतर्ग्रहण डेमो',
    te: 'ప్రభుత్వ రిపోజిటరీ క్రెడెన్షియల్ సేకరణ డెమో'
  },
  'nav_reviewer': {
    en: 'Reviewer Case Desk',
    hi: 'समीक्षक केस डेस्क',
    te: 'రివ్యూయర్ కేస్ డెస్క్'
  },
  'nav_reviewer_desc': {
    en: 'Dual-custody adjudications for high-risk flags',
    hi: 'उच्च जोखिम वाले झंडों के लिए दोहरी-हिरासत अधिनिर्णय',
    te: 'అధిక-ప్రమాద హెచ్చరికల కోసం డ్యూయల్ కస్టడీ తీర్పులు'
  },
  'nav_admin': {
    en: 'Admin Governance & Audit',
    hi: 'व्यवस्थापक शासन और ऑडिट',
    te: 'అడ్మిన్ పాలన & ఆడిట్'
  },
  'nav_admin_desc': {
    en: 'Dual-custody approval, compliance logs & settings',
    hi: 'दोहरी-हिरासत अनुमोदन, अनुपालन लॉग और सेटिंग्स',
    te: 'డ్యూయల్ కస్టడీ ఆమోదం, సమ్మతి లాగ్‌లు & సెట్టింగ్‌లు'
  },
  'nav_tickets': {
    en: 'Citizen Dispute Tickets',
    hi: 'नागरिक विवाद टिकट',
    te: 'పౌర వివాదాల టిక్కెట్లు'
  },
  'nav_tickets_desc': {
    en: 'Fair-hearing appeals desk for contested decisions',
    hi: 'विवादित निर्णयों के लिए निष्पक्ष सुनवाई अपील डेस्क',
    te: 'వివాదాస్పద నిర్ణయాల కోసం న్యాయమైన అప్పీల్ డెస్క్'
  },
  'nav_profile': {
    en: 'Security & Privacy Desk',
    hi: 'सुरक्षा और गोपनीयता डेस्क',
    te: 'భద్రత & గోప్యత డెస్క్'
  },
  'nav_profile_desc': {
    en: 'Zero-retention ephemeral controls & MFA tokens',
    hi: 'शून्य-अवधारण अल्पकालिक नियंत्रण और एमएफए टोकन',
    te: 'జీరో-రిటెన్షన్ ఎఫెమరల్ కంట్రోల్స్ & MFA టోకెన్లు'
  },

  // Navigation Categories
  'cat_core': {
    en: 'Forensic Operations',
    hi: 'फोरेंसिक संचालन',
    te: 'ఫోరెన్సిక్ కార్యకలాపాలు'
  },
  'cat_governance': {
    en: 'Adjudication & Governance',
    hi: 'अधिनिर्णय और शासन',
    te: 'తీర్పు & పాలన'
  },
  'cat_system': {
    en: 'Citizen Desk & Security',
    hi: 'नागरिक डेस्क और सुरक्षा',
    te: 'పౌర డెస్క్ & భద్రత'
  },
  'menu_search_placeholder': {
    en: 'Search tools, modules, desk...',
    hi: 'उपकरण, मॉड्यूल, डेस्क खोजें...',
    te: 'టూల్స్, మాడ్యూల్స్, డెస్క్ శోధించండి...'
  },
  'screen_now_cta': {
    en: 'Screen Document Now',
    hi: 'अब दस्तावेज़ स्क्रीन करें',
    te: 'ఇప్పుడే పత్రాన్ని స్క్రీన్ చేయండి'
  },

  // Risk Levels & Badges
  'LOW_RISK': {
    en: 'LOW RISK',
    hi: 'कम जोखिम',
    te: 'తక్కువ ప్రమాదం'
  },
  'MEDIUM_RISK': {
    en: 'MEDIUM RISK',
    hi: 'मध्यम जोखिम',
    te: 'మధ్యస్థ ప్రమాదం'
  },
  'HIGH_RISK': {
    en: 'HIGH RISK',
    hi: 'उच्च जोखिम',
    te: 'అధిక ప్రమాదం'
  },
  'INCONCLUSIVE': {
    en: 'INCONCLUSIVE',
    hi: 'अनिर्णायक',
    te: 'అసంపూర్ణం'
  },
  'status_genuine': {
    en: 'GENUINE',
    hi: 'असली (प्रमाणित)',
    te: 'నిజమైనది (ధృవీకరించబడింది)'
  },
  'status_invalid': {
    en: 'INVALID',
    hi: 'अमान्य (नकली/अस्वीकृत)',
    te: 'చెల్లదు (నకిలీ/తిరస్కరించబడింది)'
  },
  'status_genuine_badge': {
    en: 'GENUINE • VERIFIED',
    hi: 'असली • सत्यापित',
    te: 'నిజమైనది • ధృవీకరించబడింది'
  },
  'status_invalid_badge': {
    en: 'INVALID • DISQUALIFIED',
    hi: 'अमान्य • अयोग्य',
    te: 'చెల్లదు • అనర్హత'
  },
  'status_authentic': {
    en: 'ORIGINAL DOCUMENT CONFIRMED',
    hi: 'मूल दस्तावेज़ की पुष्टि हुई',
    te: 'అసలు పత్రం నిర్ధారించబడింది'
  },
  'status_rejected': {
    en: 'NOT AN ORIGINAL DOCUMENT — DISQUALIFIED',
    hi: 'मूल दस्तावेज़ नहीं — अयोग्य',
    te: 'అసలు పత్రం కాదు — అనర్హత'
  },
  'status_tampered': {
    en: 'TAMPERED / COUNTERFEIT DOCUMENT FLAGGED',
    hi: 'छेड़छाड़ / नकली दस्तावेज़ चिह्नित',
    te: 'టాంపర్ చేయబడిన / నకిలీ పత్రం గుర్తించబడింది'
  },

  // Dashboard Page Elements
  'welcome': {
    en: 'Welcome',
    hi: 'स्वागत है',
    te: 'స్వాగతం'
  },
  'forensic_active': {
    en: 'Forensics Engine Active',
    hi: 'फोरेंसिक इंजन सक्रिय',
    te: 'ఫోరెన్సిక్ ఇంజిన్ యాక్టివ్'
  },
  '7_phase_pipeline': {
    en: '7-Phase Multi-Signal Pipeline',
    hi: '7-चरणीय बहु-संकेत पाइपलाइन',
    te: '7-దశల మల్టీ-సిగ్నల్ పైప్‌లైన్'
  },
  'hero_headline': {
    en: 'Screen a Document with Verified Forensic Confidence',
    hi: 'सत्यापित फोरेंसिक विश्वास के साथ दस्तावेज़ की जांच करें',
    te: 'ధృవీకరించబడిన ఫోరెన్సిక్ విశ్వసనీయతతో పత్రాన్ని స్క్రీన్ చేయండి'
  },
  'hero_subtext': {
    en: 'Upload an Indian ID, passport, or certificate to analyze optical typography, detect localized editing artifacts with Error Level Analysis, and cross-validate QR cryptographic digests.',
    hi: 'ऑप्टिकल टाइपोग्राफी का विश्लेषण करने, एरर लेवल एनालिसिस के साथ संपादन कलाकृतियों का पता लगाने और क्यूआर क्रिप्टोग्राफिक डाइजेस्ट को सत्यापित करने के लिए एक भारतीय आईडी, पासपोर्ट या प्रमाण पत्र अपलोड करें।',
    te: 'ఆప్టికల్ టైపోగ్రఫీని విశ్లేషించడానికి, ఎర్రర్ లెవల్ అనాలిసిస్ ద్వారా టాంపరింగ్‌ను గుర్తించడానికి మరియు QR క్రిప్టోగ్రాఫిక్ సమాచారాన్ని ధృవీకరించడానికి భారతీయ ఐడి, పాస్‌పోర్ట్ లేదా సర్టిఫికేట్‌ను అప్‌లోడ్ చేయండి.'
  },
  'start_screening': {
    en: 'Start New Screening',
    hi: 'नई स्क्रीनिंग शुरू करें',
    te: 'కొత్త స్క్రీనింగ్ ప్రారంభించండి'
  },
  'dash_stat_success': {
    en: 'Verification Success Rate',
    hi: 'सत्यापन सफलता दर',
    te: 'ధృవీకరణ విజయం రేటు'
  },
  'dash_stat_latency': {
    en: 'Pipeline Inference Latency',
    hi: 'पाइपलाइन अनुमान विलंबता',
    te: 'పైప్‌లైన్ ఇన్ఫరెన్స్ లేటెన్సీ'
  },
  'dash_stat_purge': {
    en: 'Ephemeral Buffer TTL',
    hi: 'अल्पकालिक बफ़र टीटीएल',
    te: 'ఎఫెమరల్ బఫర్ టిటిఎల్'
  },
  'dash_stat_standards': {
    en: 'National Standards Aligned',
    hi: 'राष्ट्रीय मानकों के अनुरूप',
    te: 'జాతీయ ప్రమాణాలకు అనుగుణంగా'
  },
  'high_fidelity': {
    en: 'High Fidelity Confidence',
    hi: 'उच्च निष्ठा विश्वास',
    te: 'అధిక విశ్వసనీయత'
  },
  'recent_verifications': {
    en: 'Recent Document Screenings',
    hi: 'हाल के दस्तावेज़ स्क्रीनिंग',
    te: 'ఇటీవలి పత్ర స్క్రీనింగ్‌లు'
  },
  'recent_verifications_sub': {
    en: 'Empirical risk indicators from latest runs',
    hi: 'नवीनतम रनों से अनुभवजन्य जोखिम संकेतक',
    te: 'తాజా రన్‌ల నుండి రిస్క్ సూచికలు'
  },
  'view_all_history': {
    en: 'View All',
    hi: 'सभी देखें',
    te: 'అన్నీ చూడండి'
  },
  'forensic_markers': {
    en: 'forensic marker(s)',
    hi: 'फोरेंसिक मार्कर',
    te: 'ఫోరెన్సిక్ గుర్తులు'
  },
  'view_heatmap': {
    en: 'View Evidence Heatmap',
    hi: 'साक्ष्य हीटमैप देखें',
    te: 'సాక్ష్యాల హీట్‌మ్యాప్ చూడండి'
  },
  'evidence_btn': {
    en: 'Evidence',
    hi: 'साक्ष्य',
    te: 'సాక్ష్యం'
  },
  'statutory_transparency': {
    en: 'Statutory Transparency',
    hi: 'वैधानिक पारदर्शिता',
    te: 'చట్టపరమైన పారదర్శకత'
  },
  'statutory_disclaimer': {
    en: 'AI screening scores are risk signals, not definitive proof of authenticity or identity ownership.',
    hi: 'एआई स्क्रीनिंग स्कोर जोखिम संकेत हैं, प्रामाणिकता या पहचान स्वामित्व का निश्चित प्रमाण नहीं।',
    te: 'AI స్క్రీనింగ్ స్కోర్‌లు రిస్క్ సంకేతాలు మాత్రమే, ప్రామాణికత లేదా గుర్తింపు యాజమాన్యానికి ఖచ్చితమైన రుజువు కాదు.'
  },
  'security_posture': {
    en: 'Security Posture',
    hi: 'सुरक्षा स्थिति',
    te: 'భద్రతా స్థితి'
  },
  'operator_auth_defense': {
    en: 'Operator authentication & privacy defense',
    hi: 'ऑपरेटर प्रमाणीकरण और गोपनीयता सुरक्षा',
    te: 'ఆపరేటర్ ప్రమాణీకరణ & గోప్యతా రక్షణ'
  },
  'account_protected': {
    en: 'Account Protected',
    hi: 'खाता सुरक्षित',
    te: 'ఖాతా రక్షించబడింది'
  },
  'mfa_enabled_desc': {
    en: 'Multi-factor authentication enabled with encrypted session tokens.',
    hi: 'एन्क्रिप्टेड सत्र टोकन के साथ बहु-कारक प्रमाणीकरण सक्षम।',
    te: 'ఎన్‌క్రిప్టెడ్ సెషన్ టోకెన్‌లతో బహుళ-కారకాల ప్రమాణీకరణ ప్రారంభించబడింది.'
  },
  'ephemeral_purge_desc': {
    en: 'All submitted image buffers are stored in ephemeral memory and auto-purged within 15 minutes.',
    hi: 'सभी सबमिट किए गए इमेज बफ़र्स अल्पकालिक मेमोरी में संग्रहीत होते हैं और 15 मिनट के भीतर स्वतः साफ़ हो जाते हैं।',
    te: 'సమర్పించిన అన్ని ఇమేజ్ బఫర్‌లు తాత్కాలిక మెమరీలో నిల్వ చేయబడతాయి మరియు 15 నిమిషాల్లో తొలగించబడతాయి.'
  },
  '2fa_status': {
    en: '2FA Verification Status',
    hi: '2FA सत्यापन स्थिति',
    te: '2FA ధృవీకరణ స్థితి'
  },
  'active_sessions': {
    en: 'Active Sessions',
    hi: 'सक्रिय सत्र',
    te: 'సక్రియ సెషన్‌లు'
  },
  'sessions': {
    en: 'session(s)',
    hi: 'सत्र',
    te: 'సెషన్(లు)'
  },
  'session_sec': {
    en: 'Session Security',
    hi: 'सत्र सुरक्षा',
    te: 'సెషన్ భద్రత'
  },
  'manage_security': {
    en: 'Manage Security & Retention',
    hi: 'सुरक्षा और अवधारण प्रबंधित करें',
    te: 'భద్రత & నిల్వను నిర్వహించండి'
  },
  'no_scans_found': {
    en: 'No recent scans found. Start a new screening to see evidence outputs.',
    hi: 'कोई हालिया स्कैन नहीं मिला। साक्ष्य आउटपुट देखने के लिए एक नई स्क्रीनिंग शुरू करें।',
    te: 'ఇటీవలి స్కాన్‌లు ఏవీ కనుగొనబడలేదు. సాక్ష్యాలను చూడటానికి కొత్త స్క్రీనింగ్‌ను ప్రారంభించండి.'
  },

  // Document Types
  'AUTO_DETECT': {
    en: 'Auto-Detect Sovereign ID',
    hi: 'स्वतः पहचान संप्रभु आईडी',
    te: 'సార్వభౌమ ఐడిని స్వయంచాలకంగా గుర్తించండి'
  },
  'AADHAAR': {
    en: 'Aadhaar Card (UIDAI)',
    hi: 'आधार कार्ड (यूआईडीएआई)',
    te: 'ఆధార్ కార్డు (UIDAI)'
  },
  'PAN': {
    en: 'PAN Card (Income Tax Dept)',
    hi: 'पैन कार्ड (आयकर विभाग)',
    te: 'పాన్ కార్డు (ఆదాయపు పన్ను శాఖ)'
  },
  'PASSPORT': {
    en: 'Indian Passport (MEA / ICAO 9303)',
    hi: 'भारतीय पासपोर्ट (विदेश मंत्रालय / आईसीएओ 9303)',
    te: 'భారతీయ పాస్‌పోర్ట్ (MEA / ICAO 9303)'
  },
  'GLOBAL_GOVT_ID': {
    en: 'Global REAL ID / Gov ID',
    hi: 'ग्लोबल रियल आईडी / सरकारी आईडी',
    te: 'గ్లోబల్ రియల్ ఐడి / ప్రభుత్వ ఐడి'
  },
  'VOTER_ID': {
    en: 'Voter ID Card (ECI)',
    hi: 'मतदाता पहचान पत्र (ईसीआई)',
    te: 'ఓటరు ఐడి కార్డు (ECI)'
  },
  'DRIVING_LICENSE': {
    en: 'Driving Licence (MoRTH)',
    hi: 'ड्राइविंग लाइसेंस (सड़क परिवहन मंत्रालय)',
    te: 'డ్రైవింగ్ లైసెన్స్ (MoRTH)'
  },

  // Common UI words
  'menu': {
    en: 'Menu',
    hi: 'मेनू',
    te: 'మెనూ'
  },
  'loading': {
    en: 'Loading...',
    hi: 'लोड हो रहा है...',
    te: 'లోడ్ అవుతోంది...'
  },
  'filter': {
    en: 'Filter',
    hi: 'फ़िल्टर',
    te: 'ఫిల్టర్'
  },
  'search': {
    en: 'Search',
    hi: 'खोजें',
    te: 'శోధించండి'
  },
  'back': {
    en: 'Back',
    hi: 'वापस',
    te: 'వెనుకకు'
  },
  'details': {
    en: 'Details',
    hi: 'विवरण',
    te: 'వివరాలు'
  },
  'status': {
    en: 'Status',
    hi: 'स्थिति',
    te: 'స్థితి'
  },
  'date': {
    en: 'Date',
    hi: 'तारीख',
    te: 'తేదీ'
  },
  'confidence': {
    en: 'Confidence',
    hi: 'विश्वास स्तर',
    te: 'విశ్వసనీయత'
  },
  'language_label': {
    en: 'Language',
    hi: 'भाषा',
    te: 'భాష'
  }
};

// Common direct phrases map for automatic translation of English texts
export const phraseMap: Record<string, { hi: string; te: string }> = {
  'DocSure AI': { hi: 'डॉक्श्योर एआई', te: 'డాక్‌ష్యూర్ ఏఐ' },
  'Executive Dashboard': { hi: 'कार्यकारी डैशबोर्ड', te: 'ఎగ్జిక్యూటివ్ డాష్‌బోర్డ్' },
  'Screen Document': { hi: 'दस्तावेज़ स्क्रीनिंग', te: 'పత్రాన్ని స్క్రీన్ చేయండి' },
  'Scan Archives': { hi: 'स्कैन अभिलेखागार', te: 'స్కాన్ ఆర్కైవ్స్' },
  'Forensic Reports Dossier': { hi: 'फोरेंसिक रिपोर्ट डोजियर', te: 'ఫోరెన్సిక్ నివేదికల డోసియర్' },
  'Evidence Heatmap Viewer': { hi: 'साक्ष्य हीटमैप दर्शक', te: 'సాక్ష్యాల హీట్‌మ్యాప్ వ్యూయర్' },
  'DigiLocker Sandbox': { hi: 'डिजीलॉकर सैंडबॉक्स', te: 'డిజిలాకర్ శాండ్‌బాక్స్' },
  'Reviewer Case Desk': { hi: 'समीक्षक केस डेस्क', te: 'రివ్యూయర్ కేస్ డెస్క్' },
  'Admin Governance & Audit': { hi: 'व्यवस्थापक शासन और ऑडिट', te: 'అడ్మిన్ పాలన & ఆడిట్' },
  'Citizen Dispute Tickets': { hi: 'नागरिक विवाद टिकट', te: 'పౌర వివాదాల టిక్కెట్లు' },
  'Security & Privacy Desk': { hi: 'सुरक्षा और गोपनीयता डेस्क', te: 'భద్రత & గోప్యత డెస్క్' },
  'Profile & Security Settings': { hi: 'प्रोफ़ाइल और सुरक्षा सेटिंग्स', te: 'ప్రొఫైల్ & భద్రతా సెట్టింగ్‌లు' },
  'Zero-Retention Ephemeral Storage': { hi: 'शून्य-अवधारण अल्पकालिक संग्रहण', te: 'జీరో-రిటెన్షన్ సురక్షిత నిల్వ' },
  'Zero Raw Document Retention': { hi: 'शून्य कच्चा दस्तावेज़ अवधारण', te: 'జీరో ముడి పత్రాల నిల్వ' },
  'Zero Raw Retention': { hi: 'शून्य कच्चा अवधारण', te: 'జీరో రా రిటెన్షన్' },
  'Ephemeral RAM Sandbox': { hi: 'अल्पकालिक रैम सैंडबॉक्स', te: 'ఎఫెమరల్ రామ్ శాండ్‌బాక్స్' },
  'SIH Evaluation Role': { hi: 'एसआईएच मूल्यांकन भूमिका', te: 'ఎస్ఐహెచ్ మూల్యాంకన పాత్ర' },
  'SIH Persona:': { hi: 'एसआईएच भूमिका:', te: 'ఎస్ఐహెచ్ పాత్ర:' },
  'Screen Document Now': { hi: 'अब दस्तावेज़ स्क्रीन करें', te: 'ఇప్పుడే పత్రాన్ని స్క్రీన్ చేయండి' },
  'Sign In': { hi: 'साइन इन करें', te: 'సైన్ ఇన్' },
  'Sign Out': { hi: 'साइन आउट', te: 'సైన్ అవుట్' },
  'Install App': { hi: 'ऐप इंस्टॉल करें', te: 'యాప్ ఇన్‌స్టాల్' },
  'Dashboard': { hi: 'डैशबोर्ड', te: 'డాష్‌బోర్డ్' },
  'Screen': { hi: 'स्क्रीन', te: 'స్క్రీన్' },
  'Reports': { hi: 'रिपोर्ट', te: 'నివేదికలు' },
  'Profile': { hi: 'प्रोफ़ाइल', te: 'ప్రొఫైల్' },
  'Menu': { hi: 'मेनू', te: 'మెనూ' },
  '3-Lines': { hi: 'मेनू', te: 'మెనూ' },
  'Welcome': { hi: 'स्वागत है', te: 'స్వాగతం' },
  'Active': { hi: 'सक्रिय', te: 'యాక్టివ్' },
  'ACTIVE': { hi: 'सक्रिय', te: 'యాక్టివ్' },
  'Forensics Engine Active': { hi: 'फोरेंसिक इंजन सक्रिय', te: 'ఫోరెన్సిక్ ఇంజిన్ యాక్టివ్' },
  'Start New Screening': { hi: 'नई स्क्रीनिंग शुरू करें', te: 'కొత్త స్క్రీనింగ్ ప్రారంభించండి' },
  'Audit Reports Dossier': { hi: 'ऑडिट रिपोर्ट डोजियर', te: 'ఆడిట్ నివేదికల డోసియర్' },
  'Audit Reports': { hi: 'ऑडिट रिपोर्ट', te: 'ఆడిట్ నివేదికలు' },
  'Evidence': { hi: 'साक्ष्य', te: 'సాక్ష్యం' },
  'View All': { hi: 'सभी देखें', te: 'అన్నీ చూడండి' },
  'Recent Document Screenings': { hi: 'हाल के दस्तावेज़ स्क्रीनिंग', te: 'ఇటీవలి పత్ర స్క్రీనింగ్‌లు' },
  'Empirical risk indicators from latest runs': { hi: 'नवीनतम रनों से अनुभवजन्य जोखिम संकेतक', te: 'తాజా రన్‌ల నుండి రిస్క్ సూచికలు' },
  'Verification Integrity': { hi: 'सत्यापन अखंडता', te: 'ధృవీకరణ సమగ్రత' },
  'Verification Success Rate': { hi: 'सत्यापन सफलता दर', te: 'ధృవీకరణ విజయం రేటు' },
  'High Fidelity Confidence': { hi: 'उच्च निष्ठा विश्वास', te: 'అధిక విశ్వసనీయత' },
  'Pipeline Latency': { hi: 'पाइपलाइन विलंबता', te: 'పైప్‌లైన్ లేటెన్సీ' },
  'Pipeline Inference Latency': { hi: 'पाइपलाइन अनुमान विलंबता', te: 'పైప్‌లైన్ ఇన్ఫరెన్స్ లేటెన్సీ' },
  '7 Parallelized Micro-Phases': { hi: '7 समानांतर सूक्ष्म चरण', te: '7 సమాంతర మైక్రో-దశలు' },
  'Active Memory TTL': { hi: 'सक्रिय मेमोरी टीटीएल', te: 'యాక్టివ్ మెమరీ టిటిఎల్' },
  'Ephemeral Buffer TTL': { hi: 'अल्पकालिक बफ़र टीटीएल', te: 'ఎఫెమరల్ బఫర్ టిటిఎల్' },
  'Zero-Retention RAM Isolation': { hi: 'शून्य-अवधारण रैम अलगाव', te: 'జీరో-రిటెన్షన్ ర్యామ్ ఐసోలేషన్' },
  'Supported Standards': { hi: 'समर्थित मानक', te: 'మద్దతు ఉన్న ప్రమాణాలు' },
  'National Standards Aligned': { hi: 'राष्ट्रीय मानकों के अनुरूप', te: 'జాతీయ ప్రమాణాలకు అనుగుణంగా' },
  'Aadhaar, PAN, Passport': { hi: 'आधार, पैन, पासपोर्ट', te: 'ఆధార్, పాన్, పాస్‌పోర్ట్' },
  'Camera capture & multi-spectral test': { hi: 'कैमरा कैप्चर और मल्टी-स्पेक्ट्रल परीक्षण', te: 'కెమెరా క్యాప్చర్ & మల్టీ-స్పెక్ట్రల్ పరీక్ష' },
  'Downloadable PDF & JSON dossiers': { hi: 'डाउनलोड करने योग्य पीडीएफ और जेएसओएन डोजियर', te: 'డౌన్‌లోడ్ చేసుకోదగిన పిడిఎఫ్ & జేసన్ డోసియర్‌లు' },
  'Spatial bounding & tamper heatmaps': { hi: 'स्थानिक बाउंडिंग और छेड़छाड़ हीटमैप', te: 'స్పేషియల్ బౌండింగ్ & టాంపర్ హీట్‌మ్యాప్‌లు' },
  'Audit past screening logs': { hi: 'अतीत के स्क्रीनिंग लॉग का ऑडिट करें', te: 'గత స్క్రీనింగ్ లాగ్‌లను ఆడిట్ చేయండి' },
  'Scan Archive': { hi: 'स्कैन पुरालेख', te: 'స్కాన్ ఆర్కైవ్' },
  'Evidence Viewer': { hi: 'साक्ष्य दर्शक', te: 'సాక్ష్యాల వ్యూయర్' },
  'Statutory Transparency:': { hi: 'वैधानिक पारदर्शिता:', te: 'చట్టపరమైన పారదర్శకత:' },
  'Statutory Transparency': { hi: 'वैधानिक पारदर्शिता', te: 'చట్టపరమైన పారదర్శకత' },
  'Security Posture': { hi: 'सुरक्षा स्थिति', te: 'భద్రతా స్థితి' },
  'Operator authentication & privacy defense': { hi: 'ऑपरेटर प्रमाणीकरण और गोपनीयता सुरक्षा', te: 'ఆపరేటర్ ప్రమాణీకరణ & గోప్యతా రక్షణ' },
  'Account Protected': { hi: 'खाता सुरक्षित', te: 'ఖాతా రక్షించబడింది' },
  'Multi-factor authentication enabled with encrypted session tokens.': { hi: 'एन्क्रिप्टेड सत्र टोकन के साथ बहु-कारक प्रमाणीकरण सक्षम।', te: 'ఎన్‌క్రిప్టెడ్ సెషన్ టోకెన్‌లతో బహుళ-కారకాల ప్రమాణీకరణ ప్రారంభించబడింది.' },
  'All submitted image buffers are stored in ephemeral memory and auto-purged within 15 minutes.': { hi: 'सभी सबमिट किए गए इमेज बफ़र्स अल्पकालिक मेमोरी में संग्रहीत होते हैं और 15 मिनट के भीतर स्वतः साफ़ हो जाते हैं।', te: 'సమర్పించిన అన్ని ఇమేజ్ బఫర్‌లు తాత్కాలిక మెమరీలో నిల్వ చేయబడతాయి మరియు 15 నిమిషాల్లో తొలగించబడతాయి.' },
  '2FA Verification Status:': { hi: '2FA सत्यापन स्थिति:', te: '2FA ధృవీకరణ స్థితి:' },
  '2FA Verification Status': { hi: '2FA सत्यापन स्थिति', te: '2FA ధృవీకరణ స్థితి' },
  'Active Sessions:': { hi: 'सक्रिय सत्र:', te: 'సక్రియ సెషన్‌లు:' },
  'Active Sessions': { hi: 'सक्रिय सत्र', te: 'సక్రియ సెషన్‌లు' },
  'Session Security:': { hi: 'सत्र सुरक्षा:', te: 'సెషన్ భద్రత:' },
  'Session Security': { hi: 'सत्र सुरक्षा', te: 'సెషన్ భద్రత' },
  'Manage Security & Retention': { hi: 'सुरक्षा और अवधारण प्रबंधित करें', te: 'భద్రత & నిల్వను నిర్వహించండి' },

  // Border scenarios & scanner tabs
  'Border Checkpoint Forensic Demonstration Suite': { hi: 'सीमा चौकी फोरेंसिक प्रदर्शन सूट', te: 'సరిహద్దు చెక్‌పాయింట్ ఫోరెన్సిక్ డెమో సూట్' },
  '1-Click automated test scenarios for the 8 core border checkpoint challenges': { hi: '8 मुख्य सीमा चौकी चुनौतियों के लिए 1-क्लिक स्वचालित परीक्षण परिदृश्य', te: '8 ప్రధాన సరిహద్దు సవాళ్ల కోసం 1-క్లిక్ ఆటోమేటెడ్ టెస్ట్ దృశ్యాలు' },
  '8 CHALLENGES BENCHMARK': { hi: '8 चुनौतियां बेंचमार्क', te: '8 సవాళ్ల బెంచ్‌మార్క్' },
  'Select Document Category': { hi: 'दस्तावेज़ श्रेणी चुनें', te: 'పత్ర వర్గాన్ని ఎంచుకోండి' },
  'Choose Ingestion Channel': { hi: 'अंतर्ग्रहण चैनल चुनें', te: 'సేకరణ ఛానెల్‌ను ఎంచుకోండి' },
  'Calibrated Specimens': { hi: 'कैलिब्रेटेड नमूने', te: 'కాలిబ్రేటెడ్ నమూనాలు' },
  'Live Camera': { hi: 'लाइव कैमरा', te: 'లైవ్ కెమెరా' },
  'File Upload': { hi: 'फ़ाइल अपलोड', te: 'ఫైల్ అప్‌లోడ్' },
  'DigiLocker Demo': { hi: 'डिजीलॉकर डेमो', te: 'డిజిలాకర్ డెమో' },
  'Pre-Calibrated Test Conditions for Forensic & Rejection Evaluation': { hi: 'फोरेंसिक और अस्वीकृति मूल्यांकन के लिए पूर्व-कैलिब्रेटेड परीक्षण स्थितियां', te: 'ఫోరెన్సిక్ & తిరస్కరణ మూల్యాంకనం కోసం కాలిబ్రేటెడ్ పరిస్థితులు' },
  'Autonomous Continuous Pipeline': { hi: 'स्वायत्त निरंतर पाइपलाइन', te: 'స్వయంప్రతిపత్తి నిరంతర పైప్‌లైన్' },
  'Interactive Step-by-Step Inspector': { hi: 'इंटरैक्टिव चरण-दर-चरण निरीक्षक', te: 'దశలవారీ ఇంటరాక్టివ్ ఇన్‌స్పెక్టర్' },
  'RECOMMENDED': { hi: 'अनुशंसित', te: 'సిఫార్సు చేయబడింది' },
  'JUDGES / AUDITORS': { hi: 'न्यायाधीश / लेखा परीक्षक', te: 'న్యాయమూర్తులు / ఆడిటర్లు' },
  'Snap Document Frame': { hi: 'दस्तावेज़ फ्रेम कैप्चर करें', te: 'పత్రం ఫోటో తీయండి' },
  'Retake Photo': { hi: 'दोबारा फोटो लें', te: 'మళ్లీ ఫోటో తీయండి' },
  'Analyze This Capture': { hi: 'इस कैप्चर का विश्लेषण करें', te: 'ఈ ఫోటోను విశ్లేషించండి' },
  'Document Snapshot Ready': { hi: 'दस्तावेज़ स्नैपशॉट तैयार है', te: 'పత్రం స్నాప్‌షాట్ సిద్ధంగా ఉంది' },
  'Drag and drop document image or PDF': { hi: 'दस्तावेज़ छवि या पीडीएफ खींचें और छोड़ें', te: 'పత్రం చిత్రం లేదా పిడిఎఫ్‌ను ఇక్కడ డ్రాగ్ చేయండి' },
  'Choose Document Files': { hi: 'दस्तावेज़ फ़ाइलें चुनें', te: 'పత్రం ఫైళ్లను ఎంచుకోండి' },
  'Security Protocol:': { hi: 'सुरक्षा प्रोटोकॉल:', te: 'భద్రతా ప్రోటోకాల్:' },
  'Document processed strictly in ephemeral RAM buffer.': { hi: 'दस्तावेज़ को केवल अल्पकालिक रैम बफ़र में संसाधित किया जाता है।', te: 'పత్రం పూర్తిగా తాత్కాలిక ర్యామ్ బఫర్‌లో మాత్రమే ప్రాసెస్ చేయబడుతుంది.' },
  'Start 7-Phase Screening': { hi: '7-चरणीय स्क्रीनिंग शुरू करें', te: '7-దశల స్క్రీనింగ్‌ను ప్రారంభించండి' },
  'Execute 7-Phase Verification': { hi: '7-चरणीय सत्यापन निष्पादित करें', te: '7-దశల ధృవీకరణను ప్రారంభించండి' },

  // Border Challenges
  '1. Authentic Passport': { hi: '1. प्रामाणिक पासपोर्ट', te: '1. ప్రామాణికమైన పాస్‌పోర్ట్' },
  '2. Altered Photograph': { hi: '2. बदली गई तस्वीर', te: '2. మార్చబడిన ఫోటో' },
  '3. Modified Date of Birth': { hi: '3. संशोधित जन्म तिथि', te: '3. మార్చబడిన పుట్టిన తేదీ' },
  '4. Tampered Visa Stamp': { hi: '4. छेड़छाड़ किया गया वीज़ा स्टैम्प', te: '4. టాంపర్ చేయబడిన వీసా స్టాంప్' },
  '5. Identity Impersonation': { hi: '5. पहचान प्रतिरूपण', te: '5. గుర్తింపు మోసం' },
  '6. Expired / Blacklisted': { hi: '6. समाप्त / काली सूची में', te: '6. గడువు ముగిసింది / బ్లాక్‌లిస్ట్' },
  '7. Fraudulent Aadhaar': { hi: '7. कपटपूर्ण आधार', te: '7. నకిలీ ఆధార్' },
  '8. Commercial Card': { hi: '8. व्यावसायिक कार्ड', te: '8. వాణిజ్య కార్డు' },
  'Aadhaar: Verified Clean': { hi: 'आधार: सत्यापित स्वच्छ', te: 'ఆధార్: ధృవీకరించబడింది' },
  'US REAL ID / International': { hi: 'यूएस रियल आईडी / अंतर्राष्ट्रीय', te: 'US రియల్ ఐడి / అంతర్జాతీయ' },
  'Credit / Commercial Card': { hi: 'क्रेडिट / वाणिज्यिक कार्ड', te: 'క్రెడిట్ / వాణిజ్య కార్డు' },

  // Badges
  'LOW RISK': { hi: 'कम जोखिम', te: 'తక్కువ ప్రమాదం' },
  'MEDIUM RISK': { hi: 'मध्यम जोखिम', te: 'మధ్యస్థ ప్రమాదం' },
  'HIGH RISK': { hi: 'उच्च जोखिम', te: 'అధిక ప్రమాదం' },
  'INCONCLUSIVE': { hi: 'अनिर्णायक', te: 'అసంపూర్ణం' },
  'PASS': { hi: 'उत्तीर्ण (पास)', te: 'పాస్' },
  'TAMPER': { hi: 'छेड़छाड़', te: 'టాంపర్' },
  'KERNING': { hi: 'टाइपोग्राफी त्रुटि', te: 'టైపోగ్రఫీ లోపం' },
  'FORGERY': { hi: 'जालसाजी', te: 'ఫోర్జరీ' },
  'BIOMETRIC': { hi: 'बायोमेट्रिक बेमेल', te: 'బయోమెట్రిక్ అసమానత' },
  'REJECT': { hi: 'अस्वीकृत', te: 'తిరస్కరించబడింది' },
  'SLTD HIT': { hi: 'इंटरपोल चेतावनी', te: 'ఇంటర్‌పోల్ అలర్ట్' },
  'COLLISION': { hi: 'पहचान टकराव', te: 'గుర్తింపు ఢీకొనడం' },
  'GENUINE': { hi: 'असली', te: 'నిజమైనది' },
  'INVALID': { hi: 'अमान्य', te: 'చెల్లదు' },

  // Report and Audit
  'Print Audit Dossier': { hi: 'ऑडिट डोजियर प्रिंट करें', te: 'ఆడిట్ డోసియర్‌ను ముద్రించండి' },
  'Download Audit Dossier (PDF)': { hi: 'ऑडिट डोजियर डाउनलोड करें (पीडीएफ)', te: 'ఆడిట్ డోసియర్‌ను డౌన్‌లోడ్ చేయండి (PDF)' },
  'Download Audit Dossier': { hi: 'ऑडिट डोजियर डाउनलोड करें', te: 'ఆడిట్ డోసియర్‌ను డౌన్‌లోడ్ చేయండి' },
  'Export JSON': { hi: 'जेएसओएन निर्यात करें', te: 'JSON ఎగుమతి చేయండి' },
  'Examine Evidence': { hi: 'साक्ष्य की जांच करें', te: 'సాక్ష్యాలను పరిశీలించండి' },
  'Viewing Dossier:': { hi: 'डोजियर देखा जा रहा है:', te: 'డోసియర్ చూస్తున్నారు:' },
  'No Audit Reports Available': { hi: 'कोई ऑडिट रिपोर्ट उपलब्ध नहीं है', te: 'ఆడిట్ నివేదికలు ఏవీ అందుబాటులో లేవు' },
  'Execute a document screening first to compile a verifiable forensic report.': { hi: 'सत्यापनीय फोरेंसिक रिपोर्ट संकलित करने के लिए पहले एक दस्तावेज़ स्क्रीनिंग निष्पादित करें।', te: 'ధృవీకరించదగిన నివేదికను రూపొందించడానికి ముందుగా పత్ర స్క్రీనింగ్‌ను అమలు చేయండి.' },

  // Pipelines
  'Phase 1: File Ingestion & Hygiene Pre-Flight': { hi: 'चरण 1: फ़ाइल अंतर्ग्रहण और स्वच्छता पूर्व-उड़ान', te: 'దశ 1: ఫైల్ సేకరణ & పరిశుభ్రత తనిఖీ' },
  'Phase 2: Optical Quality & Degradation Assessment': { hi: 'चरण 2: ऑप्टिकल गुणवत्ता और गिरावट मूल्यांकन', te: 'దశ 2: ఆప్టికల్ నాణ్యత & క్షీణత అంచనా' },
  'Phase 3: Geometry & Template Classification': { hi: 'चरण 3: ज्यामिति और टेम्प्लेट वर्गीकरण', te: 'దశ 3: జ్యామితి & టెంప్లేట్ వర్గీకరణ' },
  'Phase 4: Layout-Aware OCR & Demographic Extraction': { hi: 'चरण 4: लेआउट-जागरूक ओसीआर और जनसांख्यिकीय निष्कर्षण', te: 'దశ 4: లేఅవుట్-అవేర్ OCR & సమాచార సేకరణ' },
  'Phase 5: Multi-Spectral Visual Forensics & ELA': { hi: 'चरण 5: बहु-स्पेक्ट्रल दृश्य फोरेंसिक और ईएलए', te: 'దశ 5: మల్టీ-స్పెక్ట్రల్ విజువల్ ఫోరెన్సిక్స్ & ELA' },
  'Phase 6: Cryptographic & Demographics Cross-Validation': { hi: 'चरण 6: क्रिप्टोग्राफ़िक और जनसांख्यिकी क्रॉस-सत्यापन', te: 'దశ 6: క్రిప్టోగ్రాఫిక్ & వివరాల క్రాస్-ధృవీకరణ' },
  'Phase 7: Deterministic Risk Fusion & Decision Adjudication': { hi: 'चरण 7: नियतात्मक जोखिम संलयन और निर्णय अधिनिर्णय', te: 'దశ 7: రిస్క్ ఫ్యూజన్ & తుది నిర్ణయం' },

  // Languages
  'English': { hi: 'अंग्रेज़ी (English)', te: 'ఇంగ్లీష్ (English)' },
  'Hindi': { hi: 'हिंदी', te: 'హిందీ' },
  'Telugu': { hi: 'तेलुगु', te: 'తెలుగు' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (keyOrText: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (keyOrText: string, fallback?: string) => fallback || keyOrText,
});

const originalTextsMap = new WeakMap<Node, string>();

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved preference from localStorage or default to 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('docsure_language');
      if (saved === 'hi' || saved === 'te' || saved === 'en') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('docsure_language', lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  }, []);

  // Update HTML lang attribute on mount/change
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Pure translation lookup function
  const t = useCallback((keyOrText: string, fallback?: string): string => {
    if (!keyOrText) return fallback || '';

    // Check key in dictionary
    if (dictionary[keyOrText]) {
      const entry = dictionary[keyOrText];
      if (entry[language]) return entry[language];
    }

    // If language is English, return the English text if found, or keyOrText
    if (language === 'en') {
      return fallback || keyOrText;
    }

    // Check exact phrase map
    if (phraseMap[keyOrText]) {
      const trans = phraseMap[keyOrText][language];
      if (trans) return trans;
    }

    // Check trimmed phrase map
    const trimmed = keyOrText.trim();
    if (phraseMap[trimmed]) {
      const trans = phraseMap[trimmed][language];
      if (trans) return trans;
    }

    // Check if key exists inside dictionary values
    for (const key of Object.keys(dictionary)) {
      if (dictionary[key].en.toLowerCase() === trimmed.toLowerCase()) {
        return dictionary[key][language] || fallback || keyOrText;
      }
    }

    return fallback || keyOrText;
  }, [language]);

  // Comprehensive DOM Translation Engine:
  // When language switches to Hindi or Telugu, translates matching text nodes in the DOM.
  // When switching back to English, faithfully restores the original text.
  useEffect(() => {
    const rootEl = document.getElementById('root');
    if (!rootEl) return;

    const translateNode = (node: Node) => {
      // Only process non-empty text nodes
      if (node.nodeType === Node.TEXT_NODE) {
        const currentText = node.textContent || '';
        const trimmed = currentText.trim();
        if (!trimmed || trimmed.length < 2) return;

        // Remember original text on first encounter
        if (!originalTextsMap.has(node)) {
          originalTextsMap.set(node, currentText);
        }

        const original = originalTextsMap.get(node) || currentText;
        const origTrimmed = original.trim();

        if (language === 'en') {
          // Restore original English text
          if (node.textContent !== original) {
            node.textContent = original;
          }
          return;
        }

        // Look for exact match or phrase match
        let replacement: string | null = null;

        // 1. Direct match
        if (phraseMap[origTrimmed]) {
          replacement = phraseMap[origTrimmed][language];
        } else {
          // 2. Trailing punctuation check (e.g., "Welcome, " or "Status:" or "Session Security:")
          const punctMatch = origTrimmed.match(/^(.+?)([:.,!?-]+)$/);
          if (punctMatch) {
            const baseText = punctMatch[1].trim();
            const trailingPunct = punctMatch[2];
            if (phraseMap[baseText]) {
              replacement = phraseMap[baseText][language] + trailingPunct;
            } else {
              for (const key of Object.keys(dictionary)) {
                if (dictionary[key].en.toLowerCase() === baseText.toLowerCase()) {
                  replacement = dictionary[key][language] + trailingPunct;
                  break;
                }
              }
            }
          }
        }

        // 3. Dictionary value lookup
        if (!replacement) {
          for (const key of Object.keys(dictionary)) {
            if (dictionary[key].en.toLowerCase() === origTrimmed.toLowerCase()) {
              replacement = dictionary[key][language];
              break;
            }
          }
        }

        // 4. Case-insensitive phrase map
        if (!replacement) {
          const lower = origTrimmed.toLowerCase();
          for (const phrase of Object.keys(phraseMap)) {
            if (phrase.toLowerCase() === lower) {
              replacement = phraseMap[phrase][language];
              break;
            }
          }
        }

        if (replacement) {
          // Preserve leading and trailing whitespaces
          const leadingWs = original.match(/^\s*/)?.[0] || '';
          const trailingWs = original.match(/\s*$/)?.[0] || '';
          node.textContent = leadingWs + replacement + trailingWs;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip script, style, textarea, input tags
        const el = node as HTMLElement;
        const tagName = el.tagName.toLowerCase();
        if (tagName === 'script' || tagName === 'style' || tagName === 'input' || tagName === 'textarea' || tagName === 'pre' || tagName === 'code') {
          return;
        }
        for (let i = 0; i < node.childNodes.length; i++) {
          translateNode(node.childNodes[i]);
        }
      }
    };

    // Run translation pass across entire root tree
    translateNode(rootEl);

    // Set up MutationObserver to translate newly mounted or updated nodes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((addedNode) => translateNode(addedNode));
        } else if (mutation.type === 'characterData') {
          const target = mutation.target;
          if (!originalTextsMap.has(target)) {
            originalTextsMap.set(target, target.textContent || '');
          }
        }
      });
    });

    observer.observe(rootEl, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
