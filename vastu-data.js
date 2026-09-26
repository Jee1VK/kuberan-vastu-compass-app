/**
 * KUBERAN VASTU COMPASS APP - Vedic Vastu Shastra Core Data Engine
 * References: Vishwakarma Prakash, Manasara, Mayamatam, Samarangana Sutradhara, Brihat Samhita
 * Languages: English, Hindi (हिंदी), Kannada (ಕನ್ನಡ), Tamil (தமிழ்), Telugu (తెలుగు) with Sanskrit Transliteration
 */

const VASTU_DATA = {
  // Supported Languages
  LANGUAGES: [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' }
  ],

  // Pancha Bhoota (The 5 Primordial Elements)
  ELEMENTS: {
    water: {
      id: 'water',
      sanskrit: 'Jala (जल)',
      color: '#00b4d8',
      bgLight: 'rgba(0, 180, 216, 0.18)',
      names: {
        en: 'Water Element',
        hi: 'जल तत्व',
        kn: 'ಜಲ ತತ್ವ',
        ta: 'நீர் தத்துவம்',
        te: 'జల తత్త్వం'
      }
    },
    air: {
      id: 'air',
      sanskrit: 'Vāyu (वायु)',
      color: '#10b981',
      bgLight: 'rgba(16, 185, 129, 0.18)',
      names: {
        en: 'Air / Wood Element',
        hi: 'वायु तत्व',
        kn: 'ವಾಯು ತತ್ವ',
        ta: 'காற்று தத்துவம்',
        te: 'వాయు తత్త్వం'
      }
    },
    fire: {
      id: 'fire',
      sanskrit: 'Agni (अग्नि)',
      color: '#ef4444',
      bgLight: 'rgba(239, 68, 68, 0.18)',
      names: {
        en: 'Fire Element',
        hi: 'अग्नि तत्व',
        kn: 'ಅಗ್ನಿ ತತ್ವ',
        ta: 'நெருப்பு தத்துவம்',
        te: 'అగ్ని తత్త్వం'
      }
    },
    earth: {
      id: 'earth',
      sanskrit: 'Pṛthvī (पृथ्वी)',
      color: '#eab308',
      bgLight: 'rgba(234, 179, 8, 0.18)',
      names: {
        en: 'Earth Element',
        hi: 'पृथ्वी तत्व',
        kn: 'ಪೃಥ್ವಿ ತತ್ವ',
        ta: 'நிலம் தத்துவம்',
        te: 'పృథ్వి తత్త్వం'
      }
    },
    space: {
      id: 'space',
      sanskrit: 'Ākāśa (आकाश)',
      color: '#94a3b8',
      bgLight: 'rgba(148, 163, 184, 0.18)',
      names: {
        en: 'Space / Metal Element',
        hi: 'आकाश तत्व',
        kn: 'ಆಕಾಶ ತತ್ವ',
        ta: 'ஆகாயம் தத்துவம்',
        te: 'ఆకాశ తత్త్వం'
      }
    }
  },

  // 8 Major Vastu Zones (Ashta Dikpala System - 45° sectors)
  ZONES_8: [
    {
      id: 'N',
      code: 'N',
      startDeg: 337.5,
      endDeg: 22.5,
      centerDeg: 0,
      sanskrit: 'Uttara (उत्तर)',
      deity: 'Kubera (कुबेर)',
      element: 'water',
      auspiciousness: 'high',
      names: {
        en: 'North',
        hi: 'उत्तर',
        kn: 'ಉತ್ತರ',
        ta: 'வடக்கு',
        te: 'ఉత్తరం'
      },
      deityNames: {
        en: 'Lord Kubera (God of Wealth)',
        hi: 'कुबेर देव (धन एवं समृद्धि)',
        kn: 'ಕುಬೇರ ದೇವರು (ಐಶ್ವರ್ಯಾಧಿಪತಿ)',
        ta: 'குபேரன் (செல்வத்தின் அதிபதி)',
        te: 'కుబేరుడు (ధనాధిపతి)'
      },
      recommendedRooms: ['safe', 'living', 'study', 'underground_water', 'entrance'],
      prohibitedRooms: ['toilet', 'kitchen', 'heavy_storage', 'overhead_tank'],
      summary: {
        en: 'Gateway of Wealth, career growth, and continuous financial inflow.',
        hi: 'धन, कुबेर कृपा, करियर उन्नति और वित्तीय समृद्धि का शुभ क्षेत्र।',
        kn: 'ಸಂಪತ್ತು, ಕುಬೇರ ಕೃಪೆ, ಉದ್ಯೋಗ ಪ್ರಗತಿ ಹಾಗೂ ಆರ್ಥಿಕ ಸಮೃದ್ಧಿಯ ತಾಣ.',
        ta: 'செல்வம், தொழில் முன்னேற்றம் மற்றும் நிலையான பணவரவிற்கான மங்களகரமான பகுதி.',
        te: 'సంపద, కుబేర అనుగ్రహం, ఉద్యోగ ప్రగతి మరియు నిరంతర ధనాగమనానికి శుభ స్థానం.'
      },
      tips: {
        en: 'Keep this zone open, light, and spotless. Ideal for treasuries, financial records, and mirrors.',
        hi: 'इस क्षेत्र को खुला, हल्का और स्वच्छ रखें। तिजोरी और दर्पण के लिए सर्वोत्तम स्थान।',
        kn: 'ಈ ದಿಕ್ಕನ್ನು ಮುಕ್ತವಾಗಿ, ಹಗುರವಾಗಿ ಮತ್ತು ಸ್ವಚ್ಛವಾಗಿಡಿ. ನಗದು ಪೆಟ್ಟಿಗೆಗೆ ಅತ್ಯುತ್ತಮ.',
        ta: 'இப்பகுதியை திறந்தவெளியாகவும், லேசாகவும், தூய்மையாகவும் வைக்கவும். பணப்பெட்டிக்கு உகந்தது.',
        te: 'ఈ ప్రాంతాన్ని తెరిచి, తేలికగా మరియు పరిశుభ్రంగా ఉంచండి. లాకర్లకు అత్యంత అనుకూలం.'
      }
    },
    {
      id: 'NE',
      code: 'NE',
      startDeg: 22.5,
      endDeg: 67.5,
      centerDeg: 45,
      sanskrit: 'Īśānya (ईशान्य)',
      deity: 'Īśāna / Śiva (ईशान / शिव)',
      element: 'water',
      auspiciousness: 'supreme',
      names: {
        en: 'North-East',
        hi: 'ईशान्य',
        kn: 'ಈಶಾನ್ಯ',
        ta: 'வடகிழக்கு (ஈசான்யம்)',
        te: 'ఈశాన్యం'
      },
      deityNames: {
        en: 'Lord Shiva / Ishana (Supreme Cosmic Consciousness)',
        hi: 'भगवान शिव / ईशान (परम आत्मिक ऊर्जा)',
        kn: 'ಪರಮೇಶ್ವರ / ಈಶಾನ (ಪರಮ ಆಧ್ಯಾತ್ಮಿಕ ಶಕ್ತಿ)',
        ta: 'சிவபெருமான் / ஈசானன் (தெய்வீக ஆற்றல்)',
        te: 'పరమశివుడు / ఈశానుడు (పరమ ఆధ్యాత్మిక శక్తి)'
      },
      recommendedRooms: ['mandir', 'meditation', 'entrance', 'underground_water', 'open_space'],
      prohibitedRooms: ['toilet', 'kitchen', 'master_bed', 'staircase', 'septic_tank'],
      summary: {
        en: 'Most sacred zone. Bestows mental peace, spiritual enlightenment, and good health.',
        hi: 'परम पावन देव स्थान। मानसिक शांति, आध्यात्मिक प्रकाश और उत्तम स्वास्थ्य का केंद्र।',
        kn: 'ಅತ್ಯಂತ ಪವಿತ್ರ ದೇವಸ್ಥಾನ. ಮನಶ್ಶಾಂತಿ, ಆಧ್ಯಾತ್ಮಿಕ ಜ್ಞಾನ ಮತ್ತು ಆರೋಗ್ಯ ನೀಡುವ ನೆಲೆ.',
        ta: 'அதி புனிதம் வாய்ந்த இடம். மன அமைதி, ஆன்மீக ஞானம் மற்றும் நல்வாழ்வு தரும் மையம்.',
        te: 'అత్యంత పవిత్రమైన దైవిక స్థానం. మానసిక ప్రశాంతత, ఆధ్యాత్మికత, సకల శుభాలు చేకూరును.'
      },
      tips: {
        en: 'Strictly avoid toilets, kitchens, or heavy clutter here. Ideal for Mandir, meditation, and pure water.',
        hi: 'यहाँ शौचालय, रसोई या भारी सामान बिल्कुल न रखें। पूजा घर और ध्यान के लिए परम शुभ।',
        kn: 'ಇಲ್ಲಿ ಶೌಚಾಲಯ, ಅಡುಗೆ ಮನೆ ಅಥವಾ ಭಾರವಾದ ವಸ್ತುಗಳನ್ನು ಇಡಬೇಡಿ. ಪೂಜಾ ಕೋಣೆಗೆ ಅತ್ಯಂತ ಸೂಕ್ತ.',
        ta: 'இங்கு கழிப்பறை, சமையலறை அல்லது அதிக பாரமான பொருட்களை கண்டிப்பாக தவிர்க்கவும். பூஜை அறைக்கு முதன்மையானது.',
        te: 'ఇక్కడ మరుగుదొడ్లు, వంటగది లేదా బరువైన వస్తువులు అస్సలు ఉంచవద్దు. పూజగదికి పరమ పవిత్రం.'
      }
    },
    {
      id: 'E',
      code: 'E',
      startDeg: 67.5,
      endDeg: 112.5,
      centerDeg: 90,
      sanskrit: 'Pūrva (पूर्व)',
      deity: 'Indra & Sūrya (इन्द्र एवं सूर्य)',
      element: 'air',
      auspiciousness: 'high',
      names: {
        en: 'East',
        hi: 'पूर्व',
        kn: 'ಪೂರ್ವ',
        ta: 'கிழக்கு',
        te: 'తూర్పు'
      },
      deityNames: {
        en: 'Lord Indra & Sun God (Power, Life Energy & Social Connections)',
        hi: 'इन्द्र देव एवं सूर्य नारायण (तेज, जीवन ऊर्जा एवं सामाजिक प्रतिष्ठा)',
        kn: 'ಇಂದ್ರ ದೇವರು ಹಾಗೂ ಸೂರ್ಯ ನಾರಾಯಣ (ತೇಜಸ್ಸು, ಕೀರ್ತಿ ಹಾಗೂ ಸಾಮಾಜಿಕ ಗೌರವ)',
        ta: 'இந்திரன் மற்றும் சூரிய பகவான் (ஆற்றல், சமூக கௌரவம் மற்றும் புகழ்)',
        te: 'ఇంద్రుడు మరియు సూర్య భగవానుడు (తేజస్సు, కీర్తి, సామాజిక గౌరవం)'
      },
      recommendedRooms: ['entrance', 'living', 'study', 'balcony', 'mandir'],
      prohibitedRooms: ['toilet', 'master_bed', 'overhead_tank', 'heavy_storage'],
      summary: {
        en: 'Source of vitality, intellect, social prestige, and auspicious morning solar energy.',
        hi: 'प्राण ऊर्जा, बुद्धि, सामाजिक सम्मान और प्रातःकालीन सूर्य किरणों का द्वार।',
        kn: 'ಪ್ರಾಣಶಕ್ತಿ, ಬುದ್ಧಿಮತ್ತೆ, ಸಮಾಜದಲ್ಲಿ ಗೌರವ ಹಾಗೂ ಮುಂಜಾನೆಯ ಪವಿತ್ರ ಸೂರ್ಯಕಿರಣಗಳ ತಾಣ.',
        ta: 'உயிர் சக்தி, புத்தி கூர்மை, சமூக அந்தஸ்து மற்றும் மங்களகரமான காலை சூரிய ஒளிக்கான வழி.',
        te: 'జీవశక్తి, జ్ఞానం, సమాజంలో పేరుప్రతిష్టలు మరియు ఉదయపు సూర్యకాంతి ప్రవేశించే దిశ.'
      },
      tips: {
        en: 'Have wide doors, large windows, and open balconies here to receive beneficial morning sunlight.',
        hi: 'यहाँ बड़े दरवाजे, खिड़कियाँ व बालकनी रखें ताकि प्रातःकाल की सकारात्मक धूप घर में आए।',
        kn: 'ಮುಂಜಾನೆಯ ಸಕಾರಾತ್ಮಕ ಸೂರ್ಯಕಿರಣಗಳು ಮನೆಯೊಳಗೆ ಬರಲು ಇಲ್ಲಿ ಕಿಟಕಿ, ಬಾಗಿಲುಗಳನ್ನು ಮುಕ್ತವಾಗಿಡಿ.',
        ta: 'காலை சூரியனின் நேர்மறை கதிர்களைப் பெற இங்கு அகலமான வாசல்கள் மற்றும் ஜன்னல்களை அமைக்கவும்.',
        te: 'ఉదయపు సానుకూల సూర్యకిరణాలు ఇంట్లోకి ప్రసరించడానికి ఇక్కడ పెద్ద కిటికీలు, ద్వారాలు ఏర్పాటు చేయండి.'
      }
    },
    {
      id: 'SE',
      code: 'SE',
      startDeg: 112.5,
      endDeg: 157.5,
      centerDeg: 135,
      sanskrit: 'Āgneya (आग्नेय)',
      deity: 'Agni Deva (अग्नि देव)',
      element: 'fire',
      auspiciousness: 'high',
      names: {
        en: 'South-East',
        hi: 'आग्नेय',
        kn: 'ಆಗ್ನೇಯ',
        ta: 'தென்கிழக்கு (ஆக்னேயம்)',
        te: 'ఆగ్నేయం'
      },
      deityNames: {
        en: 'Agni Deva (God of Sacred Fire, Vitality & Digestion)',
        hi: 'अग्नि देव (ऊर्जा, पाचन एवं उत्साह)',
        kn: 'ಅಗ್ನಿ ದೇವರು (ಶಕ್ತಿ, ಜೀರ್ಣಕ್ರಿಯೆ ಹಾಗೂ ಉತ್ಸಾಹ)',
        ta: 'அக்னி பகவான் (ஆற்றல், செரிமானம் மற்றும் ஊக்கம்)',
        te: 'అగ్ని దేవుడు (శక్తి, జీర్ణక్రియ మరియు ఉత్సాహం)'
      },
      recommendedRooms: ['kitchen', 'electrical_meter', 'inverter', 'boiler', 'generator'],
      prohibitedRooms: ['underground_water', 'mandir', 'master_bed', 'toilet', 'septic_tank'],
      summary: {
        en: 'Vedic Fire sanctuary. Controls metabolic energy, health of women, and liquidity of funds.',
        hi: 'अग्नि का पावन कोण। महिलाओं का स्वास्थ्य, धन का प्रवाह और शक्ति संतुलन यहीं से संचालित होता है।',
        kn: 'ಅಗ್ನಿ ದೇವತೆಯ ತಾಣ. ಮನೆಯ ಮಹಿಳೆಯರ ಆರೋಗ್ಯ, ನಗದು ಹಣದ ಹರಿವು ಮತ್ತು ಚೈತನ್ಯದ ಕೇಂದ್ರ.',
        ta: 'புனித அக்னி மூலை. பெண்களின் நலம், பணப்புழக்கம் மற்றும் உற்சாகத்திற்கு முக்கிய இடம்.',
        te: 'పవిత్ర అగ్ని స్థానం. స్త్రీల ఆరోగ్యం, నగదు ప్రవాహం మరియు ఉత్సాహాన్ని నియంత్రించే మూల.'
      },
      tips: {
        en: 'Ideal location for the kitchen stove (cook facing East). Never place water storage or Mandir here.',
        hi: 'रसोई (गैस चूल्हा) के लिए सर्वोत्तम दिशा (पूर्व मुखी खाना बनाएं)। यहाँ जल स्रोत या मंदिर न बनाएं।',
        kn: 'ಅಡುಗೆ ಮನೆಗೆ ಅತ್ಯಂತ ಸೂಕ್ತ ಸ್ಥಳ (ಪೂರ್ವಕ್ಕೆ ಮುಖ ಮಾಡಿ ಅಡುಗೆ ಮಾಡಿ). ಇಲ್ಲಿ ನೀರಿನ ತೊಟ್ಟಿ ಬೇಡ.',
        ta: 'சமையலறைக்கு மிகச்சிறந்த இடம் (கிழக்கு நோக்கி சமைக்கவும்). இங்கு தண்ணீர் தொட்டி அமைக்க வேண்டாம்.',
        te: 'వంటగదికి పరమ అనుకూలమైన స్థానం (తూర్పు ముఖంగా వంట చేయాలి). ఇక్కడ నీటి ట్యాంక్ పెట్టవద్దు.'
      }
    },
    {
      id: 'S',
      code: 'S',
      startDeg: 157.5,
      endDeg: 202.5,
      centerDeg: 180,
      sanskrit: 'Dakṣiṇa (दक्षिण)',
      deity: 'Yama Dharmaraja (यम धर्मराज)',
      element: 'earth',
      auspiciousness: 'medium',
      names: {
        en: 'South',
        hi: 'दक्षिण',
        kn: 'ದಕ್ಷಿಣ',
        ta: 'தெற்கு',
        te: 'దక్షిణం'
      },
      deityNames: {
        en: 'Lord Yama (God of Justice, Dharma & Rest)',
        hi: 'यम धर्मराज (न्याय, धर्म एवं विश्राम)',
        kn: 'ಯಮ ಧರ್ಮರಾಜ (ನ್ಯಾಯ, ಶಿಸ್ತು ಹಾಗೂ ವಿಶ್ರಾಂತಿ)',
        ta: 'எமதர்மன் (நீதி, ஒழுக்கம் மற்றும் அமைதி)',
        te: 'యమ ధర్మరాజు (న్యాయం, ధర్మం మరియు విశ్రాంతి)'
      },
      recommendedRooms: ['bedroom', 'staircase', 'heavy_storage', 'overhead_tank'],
      prohibitedRooms: ['underground_water', 'mandir', 'main_entrance', 'kitchen'],
      summary: {
        en: 'Governs rest, disciplined focus, legal security, fame, and deep rejuvenating sleep.',
        hi: 'विश्राम, यश, अनुशासन और गहरी शांतिदायक निद्रा का कारक क्षेत्र।',
        kn: 'ವಿಶ್ರಾಂತಿ, ಕೀರ್ತಿ, ಶಿಸ್ತು ಮತ್ತು ಗಾಢ ನಿದ್ರೆಯನ್ನು ನೀಡುವ ದಿಕ್ಕು.',
        ta: 'ஓய்வு, புகழ், ஒழுக்கம் மற்றும் ஆழ்ந்த உறக்கத்தை வழங்கும் பகுதி.',
        te: 'విశ్రాంతి, కీర్తి, క్రమశిక్షణ మరియు ప్రశాంతమైన నిద్రను అందించే స్థానం.'
      },
      tips: {
        en: 'Keep this side heavy and elevated. Sleep with your head pointing toward South for deep restorative rest.',
        hi: 'इस दिशा को भारी व ऊँचा रखें। गहरी एवं स्वास्थ्यवर्धक नींद के लिए दक्षिण में सिर रखकर सोएं।',
        kn: 'ಈ ದಿಕ್ಕನ್ನು ಎತ್ತರವಾಗಿ ಮತ್ತು ಭಾರವಾಗಿಡಿ. ಉತ್ತಮ ಆರೋಗ್ಯಕ್ಕೆ ದಕ್ಷಿಣಕ್ಕೆ ತಲೆಯಿಟ್ಟು ಮಲಗಿ.',
        ta: 'இப்பகுதியை கனமாகவும் உயரமாகவும் வைக்கவும். ஆழ்ந்த உறக்கத்திற்கு தெற்கில் தலைவைத்து படுக்கவும்.',
        te: 'ఈ భాగాన్ని ఎత్తుగా, బరువుగా ఉంచండి. సంపూర్ణ ఆరోగ్యానికి దక్షిణం వైపు తలపెట్టి పడుకోవాలి.'
      }
    },
    {
      id: 'SW',
      code: 'SW',
      startDeg: 202.5,
      endDeg: 247.5,
      centerDeg: 225,
      sanskrit: 'Nairṛtya (नैऋत्य)',
      deity: 'Nirṛti (निर्ऋति - Stability & Strength)',
      element: 'earth',
      auspiciousness: 'high',
      names: {
        en: 'South-West',
        hi: 'नैऋत्य',
        kn: 'ನೈಋತ್ಯ',
        ta: 'தென்மேற்கு (நைருதி)',
        te: 'నైరుతి'
      },
      deityNames: {
        en: 'Nirriti / Prithvi (Earth Element, Root Anchor & Family Head)',
        hi: 'निर्ऋति / पृथ्वी (स्थिरता, शक्ति एवं गृहस्वामी का संबल)',
        kn: 'ನಿರ್ಋತಿ / ಪೃಥ್ವಿ (ಸ್ಥಿರತೆ, ಬಲ ಹಾಗೂ ಯಜಮಾನರ ಆಧಾರ)',
        ta: 'நைருதி / பூமி (நிலைத்தன்மை, வலிமை மற்றும் குடும்பத் தலைவரின் பலம்)',
        te: 'నిరృతి / పృథ్వి (స్థిరత్వం, బలం మరియు యజమాని ఆధిక్యత)'
      },
      recommendedRooms: ['master_bed', 'heavy_storage', 'overhead_tank', 'safe'],
      prohibitedRooms: ['underground_water', 'toilet', 'mandir', 'kitchen', 'entrance', 'septic_tank'],
      summary: {
        en: 'Zone of Grounding, leadership, family stability, and long-term wealth preservation.',
        hi: 'स्थिरता, नेतृत्व, पारिवारिक एकता और संचित धन की रक्षा का मुख्य आधार।',
        kn: 'ಸ್ಥಿರತೆ, ನಾಯಕತ್ವ, ಕುಟುಂಬ ಬಾಂಧವ್ಯ ಮತ್ತು ಸಂಪತ್ತಿನ ರಕ್ಷಣೆಯ ಭದ್ರ ನೆಲೆ.',
        ta: 'நிலைத்தன்மை, தலைமைத்துவம், குடும்ப ஒற்றுமை மற்றும் செல்வப் பாதுகாப்பின் தளம்.',
        te: 'స్థిరత్వం, నాయకత్వం, కుటుంబ ఐక్యత మరియు ధన రక్షణకు మూలాధారం.'
      },
      tips: {
        en: 'Master bedroom of the family head must be here. Make walls thickest and highest; keep windows small.',
        hi: 'गृहस्वामी का मुख्य शयनकक्ष यहीं होना चाहिए। इस कोने को सबसे भारी, ऊँचा और बंद रखें।',
        kn: 'ಮನೆಯ ಯಜಮಾನರ ಮುಖ್ಯ ಮಲಗುವ ಕೋಣೆಗೆ ಅತ್ಯುತ್ತಮ. ಈ ದಿಕ್ಕನ್ನು ಗರಿಷ್ಠ ಎತ್ತರ ಹಾಗೂ ಭಾರವಾಗಿಡಿ.',
        ta: 'குடும்பத் தலைவரின் முதன்மை படுக்கையறை இங்கு அமைவது சிறப்பு. இந்த மூலை அதிக கனமாக இருக்க வேண்டும்.',
        te: 'ఇంటి పెద్ద లేదా యజమాని ప్రధాన పడకగది ఇక్కడే ఉండాలి. ఈ మూల అత్యంత బరువుగా, ఎత్తుగా ఉండాలి.'
      }
    },
    {
      id: 'W',
      code: 'W',
      startDeg: 247.5,
      endDeg: 292.5,
      centerDeg: 270,
      sanskrit: 'Paścima (पश्चिम)',
      deity: 'Lord Varuṇa (वरुण देव)',
      element: 'space',
      auspiciousness: 'medium',
      names: {
        en: 'West',
        hi: 'पश्चिम',
        kn: 'ಪಶ್ಚಿಮ',
        ta: 'மேற்கு',
        te: 'పడమర'
      },
      deityNames: {
        en: 'Lord Varuna (God of Rain, Cosmic Waters & Profits)',
        hi: 'वरुण देव (जल नियामक, लाभ एवं कर्मफल दाता)',
        kn: 'ವರುಣ ದೇವರು (ಮಳೆಯ ಅಧಿಪತಿ, ಲಾಭ ಹಾಗೂ ಪ್ರತಿಫಲ)',
        ta: 'வருண பகவான் (மழை, வியாபார லாபம் மற்றும் நற்பலன்)',
        te: 'వరుణ దేవుడు (వర్షం, వ్యాపార లాభాలు, సత్ఫలితాలు)'
      },
      recommendedRooms: ['dining', 'children_bed', 'study', 'overhead_tank', 'toilet'],
      prohibitedRooms: ['underground_water', 'mandir', 'kitchen', 'septic_tank'],
      summary: {
        en: 'Zone of Gains, commercial prosperity, career results, and academic achievements.',
        hi: 'लाभ, व्यापारिक सफलता, कर्मफल और बच्चों की एकाग्रता का दिशा क्षेत्र।',
        kn: 'ಲಾಭ, ವ್ಯಾಪಾರ ಯಶಸ್ಸು, ಶ್ರಮದ ಫಲ ಮತ್ತು ಮಕ್ಕಳ ವಿದ್ಯಾಭ್ಯಾಸದ ಉತ್ತಮ ದಿಕ್ಕು.',
        ta: 'லாபம், தொழில் வெற்றி, உழைப்பின் பலன் மற்றும் கல்வியில் தேர்ச்சி தரும் பகுதி.',
        te: 'వ్యాపార లాభాలు, సత్ఫలితాలు, శ్రమకు తగిన ప్రతిఫలం మరియు విద్యా ప్రగతికి అనుకూలం.'
      },
      tips: {
        en: 'Ideal for dining rooms, study desks, and children’s bedrooms. Overhead water tanks sit best here or in SW.',
        hi: 'भोजन कक्ष, अध्ययन कक्ष और बच्चों के कमरे के लिए उत्तम। छत की पानी टंकी के लिए भी शुभ।',
        kn: 'ಊಟದ ಕೋಣೆ, ಅಧ್ಯಯನ ಹಾಗೂ ಮಕ್ಕಳ ಕೋಣೆಗೆ ಸೂಕ್ತ. ಮೇಲ್ಛಾವಣಿಯ ನೀರಿನ ತೊಟ್ಟಿಗೂ ಪ್ರಶಸ್ತ.',
        ta: 'சாப்பாட்டு அறை, படிக்கும் அறை மற்றும் மேல்நிலை தண்ணீர் தொட்டிக்கு மிகவும் ஏற்றது.',
        te: 'భోజనశాల, చదువుకునే గది మరియు పైకప్పు నీటి ట్యాంక్ కోసం చాలా అనుకూలం.'
      }
    },
    {
      id: 'NW',
      code: 'NW',
      startDeg: 292.5,
      endDeg: 337.5,
      centerDeg: 315,
      sanskrit: 'Vāyavya (वायव्य)',
      deity: 'Lord Vāyu (वायु देव)',
      element: 'air',
      auspiciousness: 'medium',
      names: {
        en: 'North-West',
        hi: 'वायव्य',
        kn: 'ವಾಯುವ್ಯ',
        ta: 'வடமேற்கு (வாயுவ்யம்)',
        te: 'వాయువ్యం'
      },
      deityNames: {
        en: 'Lord Vayu (Wind God - Motion, Support & Social Network)',
        hi: 'वायु देव (गतिशीलता, सहायक शक्ति एवं सामाजिक संपर्क)',
        kn: 'ವಾಯು ದೇವರು (ಚಲನಶೀಲತೆ, ಆಪ್ತ ಸಹಾಯ ಹಾಗೂ ಸಾಮಾಜಿಕ ಸಂಬಂಧ)',
        ta: 'வாயு பகவான் (இயக்கம், உதவி மற்றும் சுமுகமான உறவுகள்)',
        te: 'వాయు దేవుడు (చలనశీలత, ఆపద్బాంధవుల మద్దతు, సామాజిక అనుబంధం)'
      },
      recommendedRooms: ['guest_bed', 'toilet', 'garage', 'finished_goods', 'grains_storage'],
      prohibitedRooms: ['master_bed', 'mandir', 'safe', 'underground_water'],
      summary: {
        en: 'Zone of Movement, helpful associates, commercial sales, and guest hospitality.',
        hi: 'गतिशीलता, सहयोगियों की सहायता, तैयार माल की बिक्री और अतिथि सत्कार का क्षेत्र।',
        kn: 'ಚಲನೆ, ಅತಿಥಿ ಸತ್ಕಾರ, ಸ್ನೇಹಿತರ ನೆರವು ಹಾಗೂ ಮಾರಾಟ ಸರಕುಗಳ ಶೇಖರಣೆಯ ದಿಕ್ಕು.',
        ta: 'இயக்கம், விருந்தோம்பல், நண்பர்களின் உதவி மற்றும் விற்பனை பொருட்கள் வைக்கும் இடம்.',
        te: 'చలనశీలత, అతిథి మర్యాదలు, వ్యాపార సరుకుల అమ్మకాలు మరియు స్నేహితుల సహకారం.'
      },
      tips: {
        en: 'Best for guest rooms, toilets, and dispatched goods for fast commercial turnover. Avoid family head’s bedroom.',
        hi: 'अतिथि कक्ष, शौचालय और तैयार माल रखने के लिए उत्तम। यहाँ गृहस्वामी का कमरा न बनाएं।',
        kn: 'ಅತಿಥಿ ಕೋಣೆ, ಶೌಚಾಲಯ ಮತ್ತು ಸರಕುಗಳ ತ್ವರಿತ ಮಾರಾಟಕ್ಕೆ ಸೂಕ್ತ. ಯಜಮಾನರ ಕೋಣೆ ಬೇಡ.',
        ta: 'விருந்தினர் அறை, கழிப்பறை மற்றும் விரைவு விற்பனைப் பொருட்களுக்கு மிகவும் ஏற்றது.',
        te: 'అతిథి గది, మరుగుదొడ్డి మరియు త్వరిత అమ్మకాల సరుకులకు అనువైనది. యజమాని పడకగది ఉండకూడదు.'
      }
    }
  ],

  // 16 MahaVastu Zones (22.5° sectors)
  ZONES_16: [
    { id: 'N', label: 'North', sanskrit: 'Uttara', startDeg: 348.75, endDeg: 11.25, centerDeg: 0, element: 'water', attribute: 'Wealth & Opportunities', attributeHi: 'धन एवं नए अवसर', attributeKn: 'ಸಂಪತ್ತು & ಹೊಸ ಅವಕಾಶ', attributeTa: 'செல்வம் & புதிய வாய்ப்புகள்', attributeTe: 'సంపద & నూతన అవకాశాలు' },
    { id: 'NNE', label: 'North-North-East', sanskrit: 'Uttara-Īśānya', startDeg: 11.25, endDeg: 33.75, centerDeg: 22.5, element: 'water', attribute: 'Health & Healing', attributeHi: 'स्वास्थ्य एवं आरोग्य', attributeKn: 'ಆರೋಗ್ಯ & ಚೇತರಿಕೆ', attributeTa: 'ஆரோக்கியம் & நலம்', attributeTe: 'ఆరోగ్యం & స్వస్థత' },
    { id: 'NE', label: 'North-East', sanskrit: 'Īśānya', startDeg: 33.75, endDeg: 56.25, centerDeg: 45, element: 'water', attribute: 'Clarity of Mind & Wisdom', attributeHi: 'मानसिक स्पष्टता एवं ज्ञान', attributeKn: 'ಜ್ಞಾನ & ಮಾನಸಿಕ ಸ್ಪಷ್ಟತೆ', attributeTa: 'மனத்தெளிவு & ஞானம்', attributeTe: 'మానసిక స్పష్టత & జ్ఞానం' },
    { id: 'ENE', label: 'East-North-East', sanskrit: 'Pūrva-Īśānya', startDeg: 56.25, endDeg: 78.75, centerDeg: 67.5, element: 'air', attribute: 'Joy & Rejuvenation', attributeHi: 'प्रसन्नता एवं मनोरंजन', attributeKn: 'ಉಲ್ಲಾಸ & ಸಂತೋಷ', attributeTa: 'மகிழ்ச்சி & புத்துணர்ச்சி', attributeTe: 'ఉల్లాసం & ఆనందం' },
    { id: 'E', label: 'East', sanskrit: 'Pūrva', startDeg: 78.75, endDeg: 101.25, centerDeg: 90, element: 'air', attribute: 'Social Connectivity & Fame', attributeHi: 'सामाजिक संपर्क एवं प्रभाव', attributeKn: 'ಸಾಮಾಜಿಕ ಸಂಪರ್ಕ & ಪ್ರಭಾವ', attributeTa: 'சமூக தொடர்பு & புகழ்', attributeTe: 'సామాజిక సంబంధాలు & కీర్తి' },
    { id: 'ESE', label: 'East-South-East', sanskrit: 'Pūrva-Āgneya', startDeg: 101.25, endDeg: 123.75, centerDeg: 112.5, element: 'air', attribute: 'Churning & Analysis', attributeHi: 'मंथन एवं विश्लेषण', attributeKn: 'ಆಲೋಚನೆ & ವಿಶ್ಲೇಷಣೆ', attributeTa: 'சிந்தனை & பகுப்பாய்வு', attributeTe: 'ఆలోచన & విశ్లేషణ' },
    { id: 'SE', label: 'South-East', sanskrit: 'Āgneya', startDeg: 123.75, endDeg: 146.25, centerDeg: 135, element: 'fire', attribute: 'Cash Flow & Fire Energy', attributeHi: 'धन प्रवाह एवं अग्नि ऊर्जा', attributeKn: 'ನಗದು ಹರಿವು & ಅಗ್ನಿ ಶಕ್ತಿ', attributeTa: 'பணப்புழக்கம் & அக்னி சக்தி', attributeTe: 'నగదు ప్రవాహం & అగ్ని శక్తి' },
    { id: 'SSE', label: 'South-South-East', sanskrit: 'Dakṣiṇa-Āgneya', startDeg: 146.25, endDeg: 168.75, centerDeg: 157.5, element: 'fire', attribute: 'Confidence & Vital Power', attributeHi: 'आत्मविश्वास एवं शारीरिक बल', attributeKn: 'ಆತ್ಮವಿಶ್ವಾಸ & ದೈಹಿಕ ಬಲ', attributeTa: 'நம்பிக்கை & உடல் பலம்', attributeTe: 'ఆత్మవిశ్వాసం & శారీరక బలం' },
    { id: 'S', label: 'South', sanskrit: 'Dakṣiṇa', startDeg: 168.75, endDeg: 191.25, centerDeg: 180, element: 'fire', attribute: 'Fame, Name & Relaxation', attributeHi: 'ख्याति, यश एवं विश्राम', attributeKn: 'ಕೀರ್ತಿ, ಯಶಸ್ಸು & ವಿಶ್ರಾಂತಿ', attributeTa: 'புகழ் & அமைதியான ஓய்வு', attributeTe: 'కీర్తి, విశ్రాంతి & గౌరవం' },
    { id: 'SSW', label: 'South-South-West', sanskrit: 'Dakṣiṇa-Nairṛtya', startDeg: 191.25, endDeg: 213.75, centerDeg: 202.5, element: 'earth', attribute: 'Disposal & Detoxification', attributeHi: 'विसर्जन एवं व्यर्थ मुक्ति', attributeKn: 'ತ್ಯಾಜ್ಯ ವಿಸರ್ಜನೆ', attributeTa: 'கழிவு நீக்கம்', attributeTe: 'వ్యర్థాల విసర్జన' },
    { id: 'SW', label: 'South-West', sanskrit: 'Nairṛtya', startDeg: 213.75, endDeg: 236.25, centerDeg: 225, element: 'earth', attribute: 'Relationships & Skills', attributeHi: 'संबंध एवं कार्य कुशलता', attributeKn: 'ಸಂಬಂಧಗಳು & ನೈಪುಣ್ಯತೆ', attributeTa: 'உறவுகள் & திறமை', attributeTe: 'అనుబంధాలు & నైపుణ్యాలు' },
    { id: 'WSW', label: 'West-South-West', sanskrit: 'Paścima-Nairṛtya', startDeg: 236.25, endDeg: 258.75, centerDeg: 247.5, element: 'space', attribute: 'Education & Savings', attributeHi: 'विद्या एवं संचित बचत', attributeKn: 'ವಿದ್ಯಾಭ್ಯಾಸ & ಉಳಿತಾಯ', attributeTa: 'கல்வி & சேமிப்பு', attributeTe: 'విద్య & పొదుపు' },
    { id: 'W', label: 'West', sanskrit: 'Paścima', startDeg: 258.75, endDeg: 281.25, centerDeg: 270, element: 'space', attribute: 'Gains & Commercial Profits', attributeHi: 'प्राप्ति एवं व्यापारिक लाभ', attributeKn: 'ಲಾಭ & ವ್ಯಾಪಾರ ಯಶಸ್ಸು', attributeTa: 'லாபம் & வியாபார மேன்மை', attributeTe: 'లాభాలు & వ్యాపార విజయం' },
    { id: 'WNW', label: 'West-North-West', sanskrit: 'Paścima-Vāyavya', startDeg: 281.25, endDeg: 303.75, centerDeg: 292.5, element: 'space', attribute: 'Release of Grief & Depression', attributeHi: 'अवसाद एवं तनाव मुक्ति', attributeKn: 'ಒತ್ತಡ ನಿವಾರಣೆ', attributeTa: 'மன அழுத்தம் நீங்குதல்', attributeTe: 'ఒత్తిడి నివారణ' },
    { id: 'NW', label: 'North-West', sanskrit: 'Vāyavya', startDeg: 303.75, endDeg: 326.25, centerDeg: 315, element: 'air', attribute: 'Support & Banking Assistance', attributeHi: 'सहयोग एवं बैंकिंग सहायता', attributeKn: 'ಬೆಂಬಲ & ಬ್ಯಾಂಕಿಂಗ್ ನೆರವು', attributeTa: 'உதவி & வங்கி ஆதரவு', attributeTe: 'మద్దతు & బ్యాంకింగ్ సహాయం' },
    { id: 'NNW', label: 'North-North-West', sanskrit: 'Uttara-Vāyavya', startDeg: 326.25, endDeg: 348.75, centerDeg: 337.5, element: 'water', attribute: 'Attraction & Charm', attributeHi: 'आकर्षण एवं मधुर संबंध', attributeKn: 'ಆಕರ್ಷಣೆ & ನಲ್ಲಡಿಕೆ', attributeTa: 'ஈர்ப்பு & நல்லுறவு', attributeTe: 'ఆకర్షణ & సత్సంబంధాలు' }
  ],

  // 32 Pada Devata Chakra (Entrances / Doors according to Vishwakarma Prakash)
  // 11.25° each, starting from NE clockwise
  PADAS_32: [
// East Wall (E1 to E8)
    { id: 'E1', pada: 'E1', devata: 'Śikhī (शिखी)', startDeg: 45, endDeg: 56.25, grade: 'C', effectEn: 'Fire accident risk, eye problems', effectHi: 'अग्नि भय एवं नेत्र विकार', effectKn: 'ಅಗ್ನಿ ಅಪಾಯ ಹಾಗೂ ದೃಷ್ಟಿ ದೋಷ', effectTa: 'தீ விபத்து ஆபத்து, கண் கோளாறு', effectTe: 'అగ్ని ప్రమాద భయం, కంటి సమస్యలు' },
    { id: 'E2', pada: 'E2', devata: 'Parjanya (पर्जन्य)', startDeg: 56.25, endDeg: 67.5, grade: 'B', effectEn: 'Heavy expenses, female discord', effectHi: 'अत्यधिक व्यय एवं पारिवारिक कलह', effectKn: 'ಹೆಚ್ಚು ಖರ್ಚು ಹಾಗೂ ಭಿನ್ನಾಭಿಪ್ರಾಯ', effectTa: 'அதிக செலவு, குடும்ப மனஸ்தாபம்', effectTe: 'అధిక ఖర్చులు, కుటుంబ కలహాలు' },
    { id: 'E3', pada: 'E3', devata: 'Jayanta (जयन्त)', startDeg: 67.5, endDeg: 78.75, grade: 'A', effectEn: 'Tremendous wealth, victory, great success', effectHi: 'प्रचुर धन लाभ, विजय एवं सफलता', effectKn: 'ಅಪಾರ ಧನಲಾಭ, ವಿಜಯ ಮತ್ತು ಸಮೃದ್ಧಿ', effectTa: 'அளப்பரிய செல்வம், வெற்றி மற்றும் மேன்மை', effectTe: 'అపార ధనలాభం, విజయం, మహా భాగ్యం' },
    { id: 'E4', pada: 'E4', devata: 'Indra (इन्द्र)', startDeg: 78.75, endDeg: 90, grade: 'A', effectEn: 'Royal favor, government support, prosperity', effectHi: 'राजकृपा, सरकारी लाभ एवं मान-प्रतिष्ठा', effectKn: 'ರಾಜಾಶ್ರಯ, ಸರ್ಕಾರಿ ಗೌರವ ಹಾಗೂ ಐಶ್ವರ್ಯ', effectTa: 'அரச ஆதரவு, அரசு சலுகைகள், பெருஞ்செல்வம்', effectTe: 'ప్రభుత్వ సహకారం, కీర్తి ప్రతిష్టలు, ఐశ్వర్యం' },
    { id: 'E5', pada: 'E5', devata: 'Sūrya (सूर्य)', startDeg: 90, endDeg: 101.25, grade: 'B', effectEn: 'Short temper, loss of trustworthiness', effectHi: 'क्रोध में वृद्धि एवं अविश्वास', effectKn: 'ಮುಂಗೋಪ ಹಾಗೂ ಅಪನಂಬಿಕೆ', effectTa: 'முன்கோபம், நம்பிக்கையின்மை', effectTe: 'కోపం పెరుగుట, నమ్మకం తగ్గుట' },
    { id: 'E6', pada: 'E6', devata: 'Satya (सत्य)', startDeg: 101.25, endDeg: 112.5, grade: 'B', effectEn: 'Breach of trust, litigation troubles', effectHi: 'वाचा भंग एवं कानूनी विवाद', effectKn: 'ವಿಶ್ವಾಸದ್ರೋಹ ಹಾಗೂ ವ್ಯಾಜ್ಯಗಳು', effectTa: 'நம்பிக்கை துரோகம், வழக்குகள்', effectTe: 'నమ్మకద్రోహం, న్యాయపరమైన చిక్కులు' },
    { id: 'E7', pada: 'E7', devata: 'Bhṛśa (भृश)', startDeg: 112.5, endDeg: 123.75, grade: 'C', effectEn: 'Extreme anger, loss of peace', effectHi: 'तीव्र क्रोध एवं अशांति', effectKn: 'ಅತಿಯಾದ ಸಿಟ್ಟು ಹಾಗೂ ಅಶಾಂತಿ', effectTa: 'அதிக கோபம், மன அமைதியின்மை', effectTe: 'తీవ్ర కోపం, మనశ్శాంతి లోపించుట' },
    { id: 'E8', pada: 'E8', devata: 'Ākāśa (आकाश)', startDeg: 123.75, endDeg: 135, grade: 'C', effectEn: 'Theft risk, financial volatility', effectHi: 'चोरी का भय एवं धन हानि', effectKn: 'ಕಳ್ಳತನದ ಭಯ ಹಾಗೂ ಧನನಷ್ಟ', effectTa: 'திருட்டு பயம், நிதி இழப்பு', effectTe: 'దొంగతనాల భయం, ఆర్థిక నష్టం' },

    // South Wall (S1 to S8)
    { id: 'S1', pada: 'S1', devata: 'Anila / Agni (अनिल)', startDeg: 135, endDeg: 146.25, grade: 'C', effectEn: 'Harm to children, high utility bills', effectHi: 'संतान को कष्ट एवं अत्यधिक खर्च', effectKn: 'ಸಂತಾನಕ್ಕೆ ತೊಂದರೆ ಹಾಗೂ ಖರ್ಚು', effectTa: 'பிள்ளைகளுக்கு பாதிப்பு, விரயம்', effectTe: 'సంతానానికి కష్టం, అధిక ఖర్చులు' },
    { id: 'S2', pada: 'S2', devata: 'Pūṣā (पूषा)', startDeg: 146.25, endDeg: 157.5, grade: 'B', effectEn: 'Service orientation, servitude, bondage', effectHi: 'पराधीनता एवं दासता की स्थिति', effectKn: 'ಪರಾವಲಂಬನೆ ಹಾಗೂ ದಾಸ್ಯ ಮನೋಭಾವ', effectTa: 'அடிமைத்தனம், பிறரை சார்ந்திருத்தல்', effectTe: 'పరాధీనత, ఇతరులపై ఆధారపడుట' },
    { id: 'S3', pada: 'S3', devata: 'Vitatha (वितथ)', startDeg: 157.5, endDeg: 168.75, grade: 'A', effectEn: 'High prosperity, abundance, commercial victory', effectHi: 'उत्तम समृद्धि, प्रचुर धन एवं ऐश्वर्य', effectKn: 'ಉತ್ತಮ ಸಮೃದ್ಧಿ, ಅಪಾರ ಸಂಪತ್ತು', effectTa: 'மிகுந்த செழிப்பு, வணிக வெற்றி, பண வரவு', effectTe: 'మంచి సమృద్ధి, అపార సంపద, వ్యాపార లాభం' },
    { id: 'S4', pada: 'S4', devata: 'Gṛhakṣata (गृहक्षत)', startDeg: 168.75, endDeg: 180, grade: 'A', effectEn: 'Good fortune, male progeny, prestige', effectHi: 'सौभाग्य, वंश वृद्धि एवं मान-सम्मान', effectKn: 'ಸೌಭಾಗ್ಯ, ವಂಶೋದ್ಧಾರ ಹಾಗೂ ಕೀರ್ತಿ', effectTa: 'பேரின்பம், நற்பெயர் மற்றும் குடும்ப மேன்மை', effectTe: 'సౌభాగ్యం, వంశాభివృద్ధి, పేరుప్రతిష్టలు' },
    { id: 'S5', pada: 'S5', devata: 'Yama (यम)', startDeg: 180, endDeg: 191.25, grade: 'C', effectEn: 'Debts, health breakdown, continuous fear', effectHi: 'ऋण भार, व्याधि एवं भय', effectKn: 'ಸಾಲದ ಬಾಧೆ ಹಾಗೂ ಅನಾರೋಗ್ಯ', effectTa: 'கடன் சுமை, நோய் மற்றும் பயம்', effectTe: 'అప్పుల బాధ, అనారోగ్యం, భయం' },
    { id: 'S6', pada: 'S6', devata: 'Gandharva (गन्धर्व)', startDeg: 191.25, endDeg: 202.5, grade: 'C', effectEn: 'Aimless wanderings, poverty, humiliation', effectHi: 'अपयश, निर्धनता एवं भटकाव', effectKn: 'ಅಪಕೀರ್ತಿ, ಬಡತನ ಮತ್ತು ಅಲೆದಾಟ', effectTa: 'பொருளாதார இழப்பு, அவமானம்', effectTe: 'అపకీర్తి, పేదరికం, నిష్ప్రయోజన ప్రయాణాలు' },
    { id: 'S7', pada: 'S7', devata: 'Bhṛṅgarāja (भृङ्गराज)', startDeg: 202.5, endDeg: 213.75, grade: 'C', effectEn: 'Loss of energy, decline of wealth', effectHi: 'ऊर्जा ह्रास एवं धन का अपव्यय', effectKn: 'ಶಕ್ತಿ ಕುಂದುವುದು ಹಾಗೂ ಆರ್ಥಿಕ ನಷ್ಟ', effectTa: 'ஆற்றல் இழப்பு, வீண் செலவு', effectTe: 'శక్తి క్షీణించుట, ఆర్థిక నష్టాలు' },
    { id: 'S8', pada: 'S8', devata: 'Mṛga (मृग)', startDeg: 213.75, endDeg: 225, grade: 'C', effectEn: 'Isolation, sorrow, weakened stability', effectHi: 'एकाकीपन, संताप एवं असुरक्षा', effectKn: 'ಒಂಟಿತನ, ದುಃಖ ಹಾಗೂ ಅಸ್ಥಿರತೆ', effectTa: 'தனிமை, மனக்கவலை, நிலையற்ற தன்மை', effectTe: 'ఒంటరితనం, మానసిక వేదన, అస్థిరత' },

    // West Wall (W1 to W8)
    { id: 'W1', pada: 'W1', devata: 'Pitra (पितृ)', startDeg: 225, endDeg: 236.25, grade: 'C', effectEn: 'Generational struggles, family rifts', effectHi: 'पितृ दोष, पारिवारिक मतभेद एवं अशांति', effectKn: 'ಕುಟುಂಬದಲ್ಲಿ ಭಿನ್ನತೆ ಹಾಗೂ ಅಶಾಂತಿ', effectTa: 'வம்சாவளி சிக்கல்கள், குடும்ப பூசல்', effectTe: 'కుటుంబంలో మనస్పర్థలు, అశాంతి' },
    { id: 'W2', pada: 'W2', devata: 'Dauvārika (दौवारिक)', startDeg: 236.25, endDeg: 247.5, grade: 'B', effectEn: 'Instability in career, insecurity', effectHi: 'आजीविका में अस्थिरता एवं असुरक्षा', effectKn: 'ಉದ್ಯೋಗದಲ್ಲಿ ಅಸ್ಥಿರತೆ', effectTa: 'தொழிலில் நிலையற்ற தன்மை', effectTe: 'ఉద్యోగంలో అస్థిరత, అభద్రత' },
    { id: 'W3', pada: 'W3', devata: 'Sugrīva (सुग्रीव)', startDeg: 247.5, endDeg: 258.75, grade: 'A', effectEn: 'Immense wealth, business expansion, fame', effectHi: 'अथाह धन संपदा, व्यापार वृद्धि एवं यश', effectKn: 'ಅಪಾರ ಧನ ಸಂಪತ್ತು, ವ್ಯಾಪಾರ ವೃದ್ಧಿ', effectTa: 'பெரும் செல்வம், வணிக விரிவாக்கம், புகழ்', effectTe: 'అపార ధన సంపద, వ్యాపార విస్తరణ' },
    { id: 'W4', pada: 'W4', devata: 'Puṣpadanta (पुष्पदन्त)', startDeg: 258.75, endDeg: 270, grade: 'A', effectEn: 'Intellectual brilliance, prosperity, contentment', effectHi: 'बुद्धि कौशल, अखंड सौभाग्य एवं आनंद', effectKn: 'ಬುದ್ಧಿವಂತಿಕೆ, ಅಖಂಡ ಸೌಭಾಗ್ಯ ಮತ್ತು ಆನಂದ', effectTa: 'அறிவுக்கூர்மை, மகிழ்ச்சி, தொடர் வெற்றி', effectTe: 'మేధోశక్తి, అఖండ సౌభాగ్యం, ఆనందం' },
    { id: 'W5', pada: 'W5', devata: 'Varuṇa (वरुण)', startDeg: 270, endDeg: 281.25, grade: 'B', effectEn: 'High ambitions, fluctuating fortunes', effectHi: 'अत्यधिक महत्वाकांक्षा एवं उतार-चढ़ाव', effectKn: 'ಅತಿಯಾದ ಮಹತ್ವಾಕಾಂಕ್ಷೆ, ಏಳುಬೀಳು', effectTa: 'அதிக ஆசை, ஏற்ற இறக்கங்கள்', effectTe: 'అధిక ఆశలు, హెచ్చుతగ్గులు' },
    { id: 'W6', pada: 'W6', devata: 'Asura (असुर)', startDeg: 281.25, endDeg: 292.5, grade: 'C', effectEn: 'Depression, exhaustion, heavy loans', effectHi: 'मानसिक तनाव, अवसाद एवं ऋण', effectKn: 'ಮಾನಸಿಕ ಒತ್ತಡ, ಸಾಲ ಹಾಗೂ ಆಯಾಸ', effectTa: 'மன அழுத்தம், சோர்வு, கடன் சுமை', effectTe: 'మానసిక ఒత్తిడి, నిరాశ, అప్పులు' },
    { id: 'W7', pada: 'W7', devata: 'Śoṣa (शोष)', startDeg: 292.5, endDeg: 303.75, grade: 'C', effectEn: 'Addiction, drying of cash reserves', effectHi: 'व्यसन, धन का क्षय एवं निराशा', effectKn: 'ದುಶ್ಚಟಗಳು, ಸಂಪತ್ತಿನ ಕ್ಷೀಣತೆ', effectTa: 'கெட்ட பழக்கங்கள், பணம் கரைதல்', effectTe: 'చెడు వ్యసనాలు, ధన నష్టం' },
    { id: 'W8', pada: 'W8', devata: 'Pāpayakṣmā (पापयक्ष्मा)', startDeg: 303.75, endDeg: 315, grade: 'C', effectEn: 'Continuous illness, obstacles in undertakings', effectHi: 'निरंतर रोग एवं कार्यों में बाधाएं', effectKn: 'ನಿರಂತರ ಕಾಯಿಲೆ ಹಾಗೂ ಕಾರ್ಯಗಳಲ್ಲಿ ಅಡೆತಡೆ', effectTa: 'தொடர் வியாதிகள், காரியத் தடைகள்', effectTe: 'నిరంతర రోగాలు, పనులలో ఆటంకాలు' },

    // North Wall (N1 to N8)
    { id: 'N1', pada: 'N1', devata: 'Roga (रोग)', startDeg: 315, endDeg: 326.25, grade: 'C', effectEn: 'Chronic diseases, legal entanglements', effectHi: 'दीर्घकालिक व्याधि एवं कानूनी उलझनें', effectKn: 'ದೀರ್ಘಕಾಲದ ಅನಾರೋಗ್ಯ ಮತ್ತು ವ್ಯಾಜ್ಯ', effectTa: 'நீண்டகால நோய்கள், சட்ட சிக்கல்கள்', effectTe: 'దీర్ఘకాలిక వ్యాధులు, కోర్టు చిక్కులు' },
    { id: 'N2', pada: 'N2', devata: 'Nāga (नाग)', startDeg: 326.25, endDeg: 337.5, grade: 'C', effectEn: 'Jealousy from relatives, secret enemies', effectHi: 'ईर्ष्या, गुप्त शत्रु एवं विश्वासघात', effectKn: 'ಅಸೂಯೆ, ಗುಪ್ತ ಶತ್ರುಗಳು ಹಾಗೂ ಮೋಸ', effectTa: 'பொறாமை, மறைமுக எதிரிகள், ஏமாற்றம்', effectTe: 'అసూయ, రహస్య శత్రువులు, మోసం' },
    { id: 'N3', pada: 'N3', devata: 'Mukhya (मुख्य)', startDeg: 337.5, endDeg: 348.75, grade: 'A', effectEn: 'Treasury abundance, mental peace, divine bliss', effectHi: 'खजाने में वृद्धि, अपार धन एवं शांति', effectKn: 'ಖಜಾನೆ ವೃದ್ಧಿ, ಅಪಾರ ಸಂಪತ್ತು ಮತ್ತು ಶಾಂತಿ', effectTa: 'கஜானா பெருகுதல், அளவற்ற செல்வம், அமைதி', effectTe: 'ఖజానా సమృద్ధి, అపార ధనం, మనశ్శాంతి' },
    { id: 'N4', pada: 'N4', devata: 'Bhallāṭa (भल्लाट)', startDeg: 348.75, endDeg: 360, grade: 'A', effectEn: 'Great inheritance, wealth multiplication, fame', effectHi: 'पैतृक संपत्ति, धन वृद्धि एवं वैभव', effectKn: 'ಪಿತ್ರಾರ್ಜಿತ ಆಸ್ತಿ, ಐಶ್ವರ್ಯ ಮತ್ತು ಕೀರ್ತಿ', effectTa: 'பரம்பரை சொத்து, பெரும் தனலாபம், புகழ்', effectTe: 'వంశపారంపర్య ఆస్తి, సిరిసంపదలు, కీర్తి' },
    { id: 'N5', pada: 'N5', devata: 'Soma / Kubera (सोम)', startDeg: 0, endDeg: 11.25, grade: 'A', effectEn: 'Grace of Lord Kubera, spiritual and material elevation', effectHi: 'कुबेर कृपा, धार्मिक एवं भौतिक उन्नति', effectKn: 'ಕುಬೇರಾನುಗ್ರಹ, ಆಧ್ಯಾತ್ಮಿಕ ಹಾಗೂ ಲೌಕಿಕ ಉನ್ನತಿ', effectTa: 'குபேர அருள், ஆன்மீக மற்றும் உலகியல் உயர்வு', effectTe: 'కుబేర కటాక్షం, ఆధ్యాత్మిక మరియు లౌకిక ఉన్నతి' },
    { id: 'N6', pada: 'N6', devata: 'Bhujaṅga (भुजङ्ग)', startDeg: 11.25, endDeg: 22.5, grade: 'B', effectEn: 'Misunderstanding with children, mood swings', effectHi: 'संतान से मतभेद एवं चंचलता', effectKn: 'ಮಕ್ಕಳೊಂದಿಗೆ ಭಿನ್ನಾಭಿಪ್ರಾಯ', effectTa: 'பிள்ளைகளுடன் மனஸ்தாபம்', effectTe: 'పిల్లలతో అభిప్రాయ భేదాలు' },
    { id: 'N7', pada: 'N7', devata: 'Aditi (अदिति)', startDeg: 22.5, endDeg: 33.75, grade: 'B', effectEn: 'Restlessness, over-expenditure by women', effectHi: 'मानसिक बेचैनी एवं अत्यधिक खर्च', effectKn: 'ಮಾನಸಿಕ ಚಡಪಡಿಕೆ ಹಾಗೂ ಅಧಿಕ ವೆಚ್ಚ', effectTa: 'மன அமைதியின்மை, வீண் செலவு', effectTe: 'మానసిక ఆందోళన, అధిక ఖర్చులు' },
    { id: 'N8', pada: 'N8', devata: 'Diti (दिति)', startDeg: 33.75, endDeg: 45, grade: 'B', effectEn: 'Lack of vision, narrow thinking', effectHi: 'दृष्टिकोण में संकीर्णता एवं असंतोष', effectKn: 'ಸಂಕುಚಿತ ಮನೋಭಾವ ಹಾಗೂ ಅಸಂತೃಪ್ತಿ', effectTa: 'குறுகிய பார்வை, மனநிறைவின்மை', effectTe: 'సంకుచిత ఆలోచన, అసంతృప్తి' }
  ],

  // Common Rooms Directory for Room-to-Direction Finder
  ROOMS: [
    {
      id: 'mandir',
      icon: '🪔',
      names: { en: 'Puja Room / Mandir', hi: 'पूजा घर / मंदिर', kn: 'ಪೂಜಾ ಕೋಣೆ / ಮಂದಿರ', ta: 'பூஜை அறை / ஆலயம்', te: 'పూజ గది / మందిరం' },
      idealZones: ['NE', 'E', 'N'],
      avoidZones: ['S', 'SW', 'SE'],
      remedyEn: 'North-East (Ishanya) is the supreme location. Keep idols facing East or West.',
      remedyHi: 'ईशान्य (उत्तर-पूर्व) सर्वोत्तम है। मूर्तियों का मुख पूर्व या पश्चिम दिशा में रखें।',
      remedyKn: 'ಈಶಾನ್ಯವು ಅತ್ಯಂತ ಪವಿತ್ರ. ದೇವರ ಮೂರ್ತಿಗಳು ಪೂರ್ವ ಅಥವಾ ಪಶ್ಚಿಮಕ್ಕೆ ಮುಖ ಮಾಡಿರಲಿ.',
      remedyTa: 'வடகிழக்கு (ஈசான்யம்) மிகச் சிறந்த இடம். சுவாமி படங்கள் கிழக்கு அல்லது மேற்கு நோக்கி இருக்க வேண்டும்.',
      remedyTe: 'ఈశాన్యం అత్యంత పవిత్రమైన స్థానం. విగ్రహాల ముఖం తూర్పు లేదా పడమర వైపు ఉండాలి.'
    },
    {
      id: 'kitchen',
      icon: '🍳',
      names: { en: 'Kitchen (Cooking Stove)', hi: 'रसोई घर (गैस चूल्हा)', kn: 'ಅಡುಗೆ ಮನೆ (ಒಲೆ)', ta: 'சமையலறை (அடுப்பு)', te: 'వంటగది (పొయ్యి)' },
      idealZones: ['SE', 'NW'],
      avoidZones: ['NE', 'SW', 'N'],
      remedyEn: 'South-East (Agneya) is ideal. Stand facing East while cooking.',
      remedyHi: 'आग्नेय (दक्षिण-पूर्व) सर्वोत्तम है। खाना बनाते समय मुख पूर्व दिशा में होना चाहिए।',
      remedyKn: 'ಆಗ್ನೇಯವು ಅತ್ಯುತ್ತಮ. ಅಡುಗೆ ಮಾಡುವಾಗ ಮುಖವು ಪೂರ್ವ ದಿಕ್ಕಿಗೆ ಇರಬೇಕು.',
      remedyTa: 'தென்கிழக்கு (ஆக்னேயம்) மிகச் சிறந்தது. சமைக்கும் போது கிழக்கு நோக்கி நிற்க வேண்டும்.',
      remedyTe: 'ఆగ్నేయం అత్యుత్తమం. వంట చేసేటప్పుడు ముఖం తూర్పు వైపు ఉండాలి.'
    },
    {
      id: 'master_bed',
      icon: '🛏️',
      names: { en: 'Master Bedroom', hi: 'मुख्य शयनकक्ष', kn: 'ಯಜಮಾನರ ಮಲಗುವ ಕೋಣೆ', ta: 'முதன்மை படுக்கையறை', te: 'ప్రధాన పడకగది' },
      idealZones: ['SW', 'S', 'W'],
      avoidZones: ['NE', 'SE', 'NW'],
      remedyEn: 'South-West (Nairutya) anchors the head of the house. Sleep with head pointing South.',
      remedyHi: 'गृहस्वामी के लिए नैऋत्य (दक्षिण-पश्चिम) सर्वोत्तम है। दक्षिण में सिर रखकर सोएं।',
      remedyKn: 'ಮನೆಯ ಯಜಮಾನರಿಗೆ ನೈಋತ್ಯವು ಅತ್ಯುತ್ತಮ. ದಕ್ಷಿಣಕ್ಕೆ ತಲೆಯಿಟ್ಟು ಮಲಗಿ.',
      remedyTa: 'குடும்பத் தலைவருக்கு தென்மேற்கு (நைருதி) சிறந்தது. தெற்கில் தலைவைத்து படுக்கவும்.',
      remedyTe: 'ఇంటి పెద్దకు నైరుతి అత్యంత అనుకూలం. దక్షిణం వైపు తలపెట్టి పడుకోవాలి.'
    },
    {
      id: 'safe',
      icon: '💰',
      names: { en: 'Cash Locker / Wealth Safe', hi: 'तिजोरी / धन स्थान', kn: 'ತಿಜೋರಿ / ನಗದು ಪೆಟ್ಟಿಗೆ', ta: 'பணப்பெட்டி / லாக்கர்', te: 'ధన స్థానం / లాకర్' },
      idealZones: ['SW', 'N'],
      avoidZones: ['SE', 'S'],
            remedyEn: 'South-West is the primary location (Earth element = stability). Place against South or West wall, door opening North towards Lord Kubera. North wall is also acceptable.',
      remedyHi: 'तिजोरी को नैऋत्य (दक्षिण-पश्चिम) में रखें, जिसका द्वार उत्तर (कुबेर दिशा) में खुले। उत्तर दीवार भी स्वीकार्य है।',
      remedyKn: 'ತಿಜೋರಿಯನ್ನು ನೈಋತ್ಯದಲ್ಲಿಡಿ (ಪೃಥ್ವಿ ತತ್ವ = ಸ್ಥಿರತೆ), ಅದರ ಬಾಗಿಲು ಉತ್ತರಕ್ಕೆ (ಕುಬೇರ ದಿಕ್ಕು) ತೆರೆಯಲಿ. ಉತ್ತರ ಗೋಡೆಯೂ ಸ್ವೀಕಾರಾರ್ಹ.',
      remedyTa: 'பணப்பெட்டியை தென்மேற்கில் (நிலம் தத்துவம் = நிலைத்தன்மை) வைத்து அதன் கதவு வடக்கு (குபேர திசை) நோக்கி திறக்க வேண்டும். வடக்கு சுவரும் ஏற்புடையது.',
      remedyTe: 'లాకర్‌ను నైరుతిలో (పృథ్వి తత్త్వం = స్థిరత్వం) ఉంచి, తలుపు ఉత్తరం (కుబేర దిశ) వైపు తెరుచుకునేలా చేయాలి. ఉత్తరం గోడ కూడా అనుకూలం.'
    },
    {
      id: 'living',
      icon: '🛋️',
      names: { en: 'Living Room / Hall', hi: 'बैठक कक्ष / हॉल', kn: 'ಕೂರುವ ಕೋಣೆ / ಹಾಲ್', ta: 'வரவேற்பறை / ஹால்', te: 'హాల్ / అతిథి గది' },
      idealZones: ['E', 'N', 'NE', 'NW'],
      avoidZones: ['SW', 'S'],
      remedyEn: 'North, East, or North-East promote welcoming social harmony and positive energy.',
      remedyHi: 'उत्तर, पूर्व या ईशान्य में हॉल होने से पारिवारिक सौहार्द एवं सकारात्मक ऊर्जा बढ़ती है।',
      remedyKn: 'ಉತ್ತರ, ಪೂರ್ವ ಅಥವಾ ಈಶಾನ್ಯದಲ್ಲಿ ಹಾಲ್ ಇದ್ದರೆ ಕುಟುಂಬದಲ್ಲಿ ಸೌಹಾರ್ದತೆ ಹೆಚ್ಚುತ್ತದೆ.',
      remedyTa: 'வடக்கு, கிழக்கு அல்லது வடகிழக்கில் வரவேற்பறை அமைவது குடும்ப ஒற்றுமையை பெருக்கும்.',
      remedyTe: 'ఉత్తరం, తూర్పు లేదా ఈశాన్యంలో హాల్ ఉండటం వల్ల కుటుంబంలో సామరస్యం పెరుగుతుంది.'
    },
    {
      id: 'study',
      icon: '📚',
      names: { en: 'Study Room / Work Desk', hi: 'अध्ययन कक्ष / कार्य मेज', kn: 'ಓದುವ ಕೋಣೆ / ಕಾರ್ಯಸ್ಥಳ', ta: 'படிக்கும் அறை / மேசை', te: 'చదువుకునే గది / పని బల్ల' },
      idealZones: ['NE', 'E', 'W', 'N'],
      avoidZones: ['SE', 'SW'],
      remedyEn: 'Sit facing East or North for peak mental focus, retention, and wisdom.',
      remedyHi: 'एकाग्रता एवं विद्या लाभ के लिए पूर्व या उत्तर की ओर मुख करके अध्ययन करें।',
      remedyKn: 'ಏಕಾಗ್ರತೆ ಮತ್ತು ಜ್ಞಾನ ವೃದ್ಧಿಗೆ ಪೂರ್ವ ಅಥವಾ ಉತ್ತರಕ್ಕೆ ಮುಖ ಮಾಡಿ ಓದಿ.',
      remedyTa: 'கவனக்குவிப்பு மற்றும் கல்வி மேன்மைக்கு கிழக்கு அல்லது வடக்கு நோக்கி அமர்ந்து படிக்கவும்.',
      remedyTe: 'ఏకాగ్రత మరియు విద్యా ప్రగతికి తూర్పు లేదా ఉత్తరం ముఖంగా కూర్చుని చదవాలి.'
    },
    {
      id: 'dining',
      icon: '🍽️',
      names: { en: 'Dining Room', hi: 'भोजन कक्ष', kn: 'ಊಟದ ಕೋಣೆ', ta: 'சாப்பாட்டு அறை', te: 'భోజనశాల' },
      idealZones: ['W', 'E', 'N'],
      avoidZones: ['SW', 'S'],
      remedyEn: 'West or East dining room ensures good nourishment and pleasant family bonding.',
      remedyHi: 'पश्चिम या पूर्व में भोजन कक्ष होने से पाचन उत्तम रहता है और परिवार में स्नेह बढ़ता है।',
      remedyKn: 'ಪಶ್ಚಿಮ ಅಥವಾ ಪೂರ್ವದಲ್ಲಿ ಊಟದ ಕೋಣೆ ಇರುವುದು ಆರೋಗ್ಯ ಮತ್ತು ಪ್ರೀತಿಗೆ ಒಳ್ಳೆಯದು.',
      remedyTa: 'மேற்கு அல்லது கிழக்கில் சாப்பாட்டு அறை அமைவது நல்ல ஆரோக்கியம் மற்றும் அன்பை வளர்க்கும்.',
      remedyTe: 'పడమర లేదా తూర్పున భోజనశాల ఉండటం మంచి ఆరోగ్యం మరియు కుటుంబ అనురాగానికి తోడ్పడుతుంది.'
    },
    {
      id: 'toilet',
      icon: '🚿',
      names: { en: 'Toilet / Bathroom', hi: 'शौचालय / स्नानगृह', kn: 'ಶೌಚಾಲಯ / ಸ್ನಾನಗೃಹ', ta: 'கழிப்பறை / குளியலறை', te: 'మరుగుదొడ్డి / స్నానాల గది' },
      idealZones: ['NW', 'W'],
      avoidZones: ['NE', 'E', 'SE', 'SW', 'N'],
      remedyEn: 'West or North-West are safe disposal zones. Never locate in North-East or South-West.',
      remedyHi: 'पश्चिम या वायव्य (उत्तर-पश्चिम) सर्वोत्तम है। ईशान्य या नैऋत्य में कभी न बनाएं।',
      remedyKn: 'ಪಶ್ಚಿಮ ಅಥವಾ ವಾಯುವ್ಯವು ಸೂಕ್ತ. ಈಶಾನ್ಯ ಅಥವಾ ನೈಋತ್ಯದಲ್ಲಿ ಖಂಡಿತ ಇರಬಾರದು.',
      remedyTa: 'மேற்கு அல்லது வடமேற்கு மிகவும் பாதுகாப்பானது. வடகிழக்கு அல்லது தென்மேற்கில் கண்டிப்பாக கூடாது.',
      remedyTe: 'పడమర లేదా వాయువ్యం అనుకూలం. ఈశాన్యం లేదా నైరుతిలో ఎట్టిపరిస్థితుల్లో ఉండరాదు.'
    },
    {
      id: 'underground_water',
      icon: '💧',
      names: { en: 'Underground Water Tank / Borewell', hi: 'भूमिगत जल टंकी / बोरवेल', kn: 'ನೆಲದಡಿ ನೀರಿನ ತೊಟ್ಟಿ / ಬೋರ್‌ವೆಲ್', ta: 'கீழ்நிலை நீர் தொட்டி / ஆழ்துளை கிணறு', te: 'భూగర్భ నీటి తొట్టి / బోరుబావి' },
      idealZones: ['NE', 'N', 'E'],
      avoidZones: ['SE', 'S', 'SW', 'NW'],
      remedyEn: 'Sacred water element sits perfectly in North-East. Never dig water pits in South-West or South-East.',
      remedyHi: 'ईशान्य या उत्तर में जल स्रोत परम शुभ है। दक्षिण-पश्चिम या दक्षिण-पूर्व में कभी न बनाएं।',
      remedyKn: 'ಈಶಾನ್ಯ ಅಥವಾ ಉತ್ತರದಲ್ಲಿ ಜಲಮೂಲ ಅತ್ಯಂತ ಶುಭ. ನೈಋತ್ಯ ಅಥವಾ ಆಗ್ನೇಯದಲ್ಲಿ ಬೇಡ.',
      remedyTa: 'வடகிழக்கு அல்லது வடக்கில் கீழ்நிலை நீர் தொட்டி அமைவது மிகச் சிறப்பு. தென்மேற்கில் கூடாது.',
      remedyTe: 'ఈశాన్యం లేదా ఉత్తరంలో భూగర్భ జలవనరులు పరమ పవిత్రం. నైరుతిలో ఎప్పుడూ తవ్వకూడదు.'
    },
    {
      id: 'overhead_tank',
      icon: '🏢',
      names: { en: 'Overhead Water Tank (Rooftop)', hi: 'छत की पानी टंकी', kn: 'ಮೇಲ್ಛಾವಣಿ ನೀರಿನ ತೊಟ್ಟಿ', ta: 'மேல்நிலை நீர் தொட்டி', te: 'పైకప్పు నీటి ట్యాంక్' },
      idealZones: ['SW', 'W', 'S'],
      avoidZones: ['NE', 'E', 'SE', 'N'],
      remedyEn: 'Rooftop tank is heavy earth weight. Best in South-West or West. Never place in North-East.',
      remedyHi: 'छत की टंकी भारी वजन है। यह पश्चिम या नैऋत्य में ही होनी चाहिए। ईशान्य में बिल्कुल न रखें।',
      remedyKn: 'ಮೇಲ್ಛಾವಣಿ ತೊಟ್ಟಿ ತೂಕವಿರುವುದರಿಂದ ನೈಋತ್ಯ ಅಥವಾ ಪಶ್ಚಿಮದಲ್ಲಿರಲಿ. ಈಶಾನ್ಯದಲ್ಲಿ ಬೇಡ.',
      remedyTa: 'மேல்நிலை தொட்டி அதிக எடையானது. இது தென்மேற்கு அல்லது மேற்கில் அமைய வேண்டும். வடகிழக்கில் கூடாது.',
      remedyTe: 'పైకప్పు ట్యాంక్ బరువైనది కాబట్టి నైరుతి లేదా పడమరలో ఉండాలి. ఈశాన్యంలో అస్సలు పెట్టకూడదు.'
    },
    {
      id: 'staircase',
      icon: '🪜',
      names: { en: 'Staircase', hi: 'सीढ़ियाँ', kn: 'ಮೆಟ್ಟಿಲುಗಳು', ta: 'படிக்கட்டுகள்', te: 'మెట్లు' },
      idealZones: ['S', 'SW', 'W'],
      avoidZones: ['NE', 'N', 'E'],
      remedyEn: 'Stairs add structural weight; construct in South or West. Ascend from East to West or North to South.',
      remedyHi: 'सीढ़ियाँ दक्षिण या पश्चिम में बनाएं। चढ़ते समय मुख दक्षिण या पश्चिम की ओर होना चाहिए।',
      remedyKn: 'ಮೆಟ್ಟಿಲುಗಳನ್ನು ದಕ್ಷಿಣ ಅಥವಾ ಪಶ್ಚಿಮದಲ್ಲಿ ನಿರ್ಮಿಸಿ. ಏರುವಾಗ ಪ್ರದಕ್ಷಿಣಾಕಾರವಾಗಿರಲಿ.',
      remedyTa: 'படிக்கட்டுகளை தெற்கு அல்லது மேற்கில் அமைக்கவும். ஏறும் போது வலஞ்சுழியாக ஏற வேண்டும்.',
      remedyTe: 'మెట్లను దక్షిణం లేదా పడమరలో నిర్మించాలి. ఎక్కేటప్పుడు ప్రదక్షిణ దిశలో ఉండాలి.'
    }
  ],


  // Commercial & Retail Vastu Rules (Structured JSON Schema)
  COMMERCIAL_ZONES: {
  "N": {
    "zone_name": "Uttara",
    "element": "Water",
    "deity": "Kubera / Mercury",
    "commercial_suitability": [
      "Main Entrance",
      "Customer Service Desk",
      "Cash Safe Opening"
    ],
    "avoid": [
      "Heavy Storage",
      "Toilets",
      "Trash / Dustbins"
    ],
    "business_impact": {
      "en": "Attracts financial growth, client opportunities, and liquidity.",
      "hi": "वित्तीय प्रगति, नए व्यावसायिक अवसर और नकदी प्रवाह को आकर्षित करता है।",
      "kn": "ಹಣಕಾಸಿನ ಬೆಳವಣಿಗೆ, ಗ್ರಾಹಕರ ಅವಕಾಶಗಳು ಮತ್ತು ನಗದು ಹರಿವನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.",
      "ta": "நிதி வளர்ச்சி, வாடிக்கையாளர் வாய்ப்புகள் மற்றும் பணப்புழக்கத்தை ஈர்க்கிறது.",
      "te": "ఆర్థిక వృద్ధి, కొత్త అవకాశాలు మరియు నిరంతర నగదు ప్రవాహాన్ని పెంచుతుంది."
    },
    "retail_tips": {
      "apparel_silk_sarees": {
        "en": "Ideal for main boutique entrance and customer reception. Keep glass doors sparkling clean.",
        "hi": "बुटीक के मुख्य द्वार एवं स्वागत कक्ष के लिए उत्तम। कांच के दरवाजों को सदैव स्वच्छ रखें।",
        "kn": "ಬುಟೀಕ್ ಪ್ರವೇಶದ್ವಾರ ಮತ್ತು ಸ್ವಾಗತ ಕೌಂಟರ್‌ಗೆ ಅತ್ಯುತ್ತಮ. ಗಾಜಿನ ಬಾಗಿಲುಗಳನ್ನು ಸ್ವಚ್ಛವಾಗಿಡಿ.",
        "ta": "பொட்டிக் நுழைவாயில் மற்றும் வரவேற்பறைக்கு உகந்தது. கண்ணாடி கதவுகளை தூய்மையாக வைக்கவும்.",
        "te": "బోటిక్ ప్రవేశద్వారం మరియు స్వాగత కౌంటర్‌కు అనుకూలం. గాజు తలుపులను శుభ్రంగా ఉంచాలి."
      },
      "jewelry_luxury": {
        "en": "Prime location for luxury consultation counters and high-value customer lounge.",
        "hi": "बहुमूल्य परामर्श काउंटर एवं वीआईपी ग्राहक लाउंज के लिए सर्वोत्तम।",
        "kn": "ಐಷಾರಾಮಿ ಸಮಾಲೋಚನಾ ಕೌಂಟರ್ ಮತ್ತು ಗಣ್ಯ ಗ್ರಾಹಕರ ಕೋಣೆಗೆ ಪ್ರಶಸ್ತ ಸ್ಥಳ.",
        "ta": "உயர்மதிப்பு ஆலோசனை கவுண்டர் மற்றும் விஐபி லவுஞ்சிற்கு மிகச் சிறந்தது.",
        "te": "విలువైన సంప్రదింపుల కౌంటర్ మరియు విఐపి కస్టమర్ లాంజ్ కోసం అనువైనది."
      },
      "general_commercial": {
        "en": "Main reception, sales inquiries, and client engagement desks perform best here.",
        "hi": "मुख्य स्वागत कक्ष, बिक्री पूछताछ एवं ग्राहक परामर्श केंद्र के लिए आदर्श।",
        "kn": "ಮುಖ್ಯ ಸ್ವಾಗತ ಕೊಠಡಿ ಮತ್ತು ಮಾರಾಟ ವಿಚಾರಣಾ ಕೌಂಟರ್‌ಗೆ ಸೂಕ್ತ ಸ್ಥಳ.",
        "ta": "முக்கிய வரவேற்பறை மற்றும் வாடிக்கையாளர் தொடர்பு மையத்திற்கு ஏற்றது.",
        "te": "ప్రధాన రిసెప్షన్ మరియు విక్రయాల విచారణల విభాగానికి అనుకూలం."
      }
    }
  },
  "NE": {
    "zone_name": "Ishanya",
    "element": "Water / Ether",
    "deity": "Lord Shiva",
    "commercial_suitability": [
      "Mandir / Temple",
      "Flagship Showcase",
      "Reception Sanctum"
    ],
    "avoid": [
      "Cash Safe",
      "Heavy Reserve Stock",
      "Toilets",
      "Kitchen / Pantry"
    ],
    "business_impact": {
      "en": "Brings supreme mental clarity, brand goodwill, and customer trust.",
      "hi": "मानसिक स्पष्टता, ब्रांड की प्रतिष्ठा और अटूट ग्राहक विश्वास लाता है।",
      "kn": "ಮಾನಸಿಕ ಸ್ಪಷ್ಟತೆ, ಬ್ರ್ಯಾಂಡ್ ಗೌರವ ಮತ್ತು ಗ್ರಾಹಕರ ನಂಬಿಕೆಯನ್ನು ತರುತ್ತದೆ.",
      "ta": "தெளிவான சிந்தனை, பிராண்ட் நற்பெயர் மற்றும் வாடிக்கையாளர் நம்பிக்கையைத் தரும்.",
      "te": "మానసిక ప్రశాంతత, బ్రాండ్ ప్రతిష్ట మరియు వినియోగదారుల విశ్వాసాన్ని పెంచుతుంది."
    },
    "retail_tips": {
      "apparel_silk_sarees": {
        "en": "Display exclusive bridal Kanchipuram silks or auspicious temple sarees here. Keep free of heavy boxes.",
        "hi": "यहाँ विशेष विवाह कांचीपुरम रेशम या मांगलिक साड़ियाँ प्रदर्शित करें। भारी बक्सों से मुक्त रखें।",
        "kn": "ಇಲ್ಲಿ ವಿಶೇಷ ಮದುವೆ ಕಾಂಚೀಪುರಂ ರೇಷ್ಮೆ ಸೀರೆಗಳನ್ನು ಪ್ರದರ್ಶಿಸಿ. ಭಾರವಾದ ವಸ್ತುಗಳನ್ನು ಇಡಬೇಡಿ.",
        "ta": "இங்கு விசேஷ முகூர்த்த பட்டுப் புடவைகளை காட்சிப்படுத்தவும். கனமான பெட்டிகளை வைக்காதீர்கள்.",
        "te": "ఇక్కడ ప్రత్యేక పెళ్లి పట్టుచీరలను ప్రదర్శించండి. బరువైన బాక్సులను ఉంచవద్దు."
      },
      "jewelry_luxury": {
        "en": "Showcase pristine diamond Solitaires and sacred gold deities here under pure white/warm light.",
        "hi": "यहाँ हीरे और शुद्ध स्वर्ण आभूषणों को पवित्र प्रकाश में प्रदर्शित करें।",
        "kn": "ಇಲ್ಲಿ ವಜ್ರ ಮತ್ತು ಪವಿತ್ರ ಚಿನ್ನದ ಆಭರಣಗಳನ್ನು ಶುದ್ಧ ಬೆಳಕಿನಲ್ಲಿ ಪ್ರದರ್ಶಿಸಿ.",
        "ta": "இங்கு வைரம் மற்றும் மங்களகரமான தங்க நகைகளை ஒளிவட்டத்தில் காட்சிப்படுத்தவும்.",
        "te": "ఇక్కడ వజ్రాలు మరియు పవిత్రమైన బంగారు ఆభరణాలను ప్రదర్శించండి."
      },
      "general_commercial": {
        "en": "Sanctum for prayer, company vision statements, and serene executive discussion.",
        "hi": "प्रार्थना स्थल, कंपनी के ध्येय वाक्य एवं शांतिपूर्ण विचार-विमर्श हेतु आदर्श।",
        "kn": "ಪೂಜಾ ಸ್ಥಳ, ಸಂಸ್ಥೆಯ ಧ್ಯೇಯ ವಾಕ್ಯ ಮತ್ತು ಸಮಾಲೋಚನೆಗೆ ಪ್ರಶಸ್ತ.",
        "ta": "பூஜை அறை மற்றும் நிறுவனத்தின் உயரிய திட்டங்களை தீட்டும் அமைதியான இடம்.",
        "te": "పూజా స్థలం మరియు ఉన్నత స్థాయి సమావేశాలకు అనువైన ప్రశాంత ప్రదేశం."
      }
    }
  },
  "E": {
    "zone_name": "Purva",
    "element": "Air / Sun",
    "deity": "Indra / Sun",
    "commercial_suitability": [
      "Main Storefront Entrance",
      "New Arrivals Display",
      "PR & Marketing Desk"
    ],
    "avoid": [
      "Heavy Waste Storage",
      "Blocked Windows"
    ],
    "business_impact": {
      "en": "Drives high customer footfall, brand prestige, and public visibility.",
      "hi": "ग्राहकों का आवागमन, ब्रांड की प्रतिष्ठा और सार्वजनिक पहचान बढ़ाता है।",
      "kn": "ಗ್ರಾಹಕರ ಒಳಹರಿವು, ಬ್ರ್ಯಾಂಡ್ ಜನಪ್ರಿಯತೆ ಮತ್ತು ಗೌರವವನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.",
      "ta": "வாடிக்கையாளர் வருகை, பிராண்ட் புகழ் மற்றும் வெளிப்படையான வளர்ச்சியைத் தூண்டும்.",
      "te": "గ్రాహకుల రాకపోకలు, బ్రాండ్ గుర్తింపు మరియు వ్యాపార కీర్తిని పెంచుతుంది."
    },
    "retail_tips": {
      "apparel_silk_sarees": {
        "en": "Position brightly illuminated window mannequins displaying seasonal silk sarees facing East.",
        "hi": "पूर्व की ओर मुख करके मौसमी रेशमी साड़ियों के साथ प्रकाशित मैनेक्विन रखें।",
        "kn": "ಪೂರ್ವಕ್ಕೆ ಮುಖಮಾಡಿ ಹೊಸ ವಿನ್ಯಾಸದ ರೇಷ್ಮೆ ಸೀರೆಗಳ ಆಕರ್ಷಕ ಗೊಂಬೆಗಳನ್ನು (ಮ್ಯಾನೆಕ್ವಿನ್) ಪ್ರದರ್ಶಿಸಿ.",
        "ta": "கிழக்கு நோக்கி நவீன பட்டுப் புடவைகளை அணிந்த பொம்மைகளை (மானெக்வின்) அலங்கரிக்கவும்.",
        "te": "తూర్పు ముఖంగా సరికొత్త డిజైన్ల పట్టుచీరల డిస్ప్లేలను అమర్చండి."
      },
      "jewelry_luxury": {
        "en": "Display daily-wear gold, lightweight jewelry, and trending collections.",
        "hi": "दैनिक उपयोग के हल्के सोने के आभूषण एवं नवीनतम संग्रह यहाँ रखें।",
        "kn": "ದೈನಂದಿನ ಬಳಕೆಯ ಹಗುರವಾದ ಚಿನ್ನದ ಆಭರಣಗಳು ಮತ್ತು ಹೊಸ ಸಂಗ್ರಹಗಳನ್ನು ಪ್ರದರ್ಶಿಸಿ.",
        "ta": "தினசரி அணியும் மெல்லிய தங்க நகைகள் மற்றும் புதிய கலெக்ஷன்களை காட்சிப்படுத்தவும்.",
        "te": "తేలికపాటి బంగారు నగలు మరియు సరికొత్త కలెక్షన్లను ఇక్కడ ఉంచండి."
      },
      "general_commercial": {
        "en": "Sales representative desks and brand promotion materials belong on this axis.",
        "hi": "बिक्री प्रतिनिधियों की मेज एवं ब्रांड प्रचार सामग्री के लिए उपयुक्त।",
        "kn": "ಮಾರಾಟ ಪ್ರತಿನಿಧಿಗಳ ಆಸನ ಮತ್ತು ಪ್ರಚಾರ ಸಾಮಗ್ರಿಗಳಿಗೆ ಸೂಕ್ತ ಸ್ಥಳ.",
        "ta": "விற்பனை பிரதிநிதிகள் மற்றும் விளம்பரப் பிரிவுக்கு ஏற்ற இடம்.",
        "te": "సేల్స్ డెస్క్ మరియు ప్రచార సామగ్రి కోసం సరైన స్థానం."
      }
    }
  },
  "SE": {
    "zone_name": "Agneya",
    "element": "Fire",
    "deity": "Agni",
    "commercial_suitability": [
      "Main Electrical Panel / DB Box",
      "UPS / Inverter",
      "Pantry / Coffee Station",
      "POS Terminal"
    ],
    "avoid": [
      "Drinking Water Dispensers",
      "Underground Water Sumps",
      "Owner Seating"
    ],
    "business_impact": {
      "en": "Drives rapid billing velocity, cashflow turnover, and operational energy.",
      "hi": "त्वरित बिलिंग, नकदी प्रवाह में तेजी और ऊर्जावान संचालन को बढ़ावा देता है।",
      "kn": "ತ್ವರಿತ ಬಿಲ್ಲಿಂಗ್, ನಗದು ಚಲಾವಣೆ ಮತ್ತು ಚುರುಕಾದ ಕಾರ್ಯಾಚರಣೆಯನ್ನು ನೀಡುತ್ತದೆ.",
      "ta": "வேகமான பில்லிங், பணப்புழக்க சுழற்சி மற்றும் சுறுசுறுப்பான வியாபாரத்தை உருவாக்கும்.",
      "te": "వేగవంతమైన బిల్లింగ్, నిరంతర నగదు లావాదేవీలు మరియు చురుకైన పనితీరును అందిస్తుంది."
    },
    "retail_tips": {
      "apparel_silk_sarees": {
        "en": "Place the POS computer billing station here (cashier facing North or East). House steam iron stations here.",
        "hi": "पीओएस बिलिंग काउंटर यहाँ रखें (मुख उत्तर या पूर्व में)। स्टीम इस्त्री यहाँ स्थापित करें।",
        "kn": "ಪಿಒಎಸ್ ಬಿಲ್ಲಿಂಗ್ ಕೌಂಟರ್ ಅನ್ನು ಇಲ್ಲಿಡಿ (ಮುಖ ಉತ್ತರ ಅಥವಾ ಪೂರ್ವಕ್ಕೆ). ಸ್ಟೀಮ್ ಇಸ್ತ್ರಿ ಇಲ್ಲಿರಲಿ.",
        "ta": "பிஓஎஸ் பில்லிங் கவுண்ட்டரை இங்கு அமைக்கவும் (வடக்கு/கிழக்கு நோக்கி). ஸ்டீம் அயர்ன் இங்கு வைக்கலாம்.",
        "te": "పిఒఎస్ బిల్లింగ్ కౌంటర్‌ను ఇక్కడ ఉంచండి (ఉత్తరం లేదా తూర్పు ముఖంగా). స్టీమ్ ఐరన్ ఇక్కడ ఉంచవచ్చు."
      },
      "jewelry_luxury": {
        "en": "Install billing computers, CCTV surveillance servers, and testing equipment in this zone.",
        "hi": "बिलिंग कंप्यूटर, सीसीटीवी सर्वर और परीक्षण उपकरण इसी क्षेत्र में स्थापित करें।",
        "kn": "ಬಿಲ್ಲಿಂಗ್ ಕಂಪ್ಯೂಟರ್, ಸಿಸಿಟಿವಿ ಸರ್ವರ್ ಮತ್ತು ಪರೀಕ್ಷಾ ಸಾಧನಗಳನ್ನು ಈ ವಲಯದಲ್ಲಿ ಅಳವಡಿಸಿ.",
        "ta": "பில்லிங் கம்ப்யூட்டர், சிசிடிவி சர்வர்கள் மற்றும் ஆய்வு கருவிகளை இங்கு நிறுவவும்.",
        "te": "బిల్లింగ్ కంప్యూటర్లు, సిసిటివి సర్వర్లు మరియు టెస్టింగ్ పరికరాలను ఇక్కడ ఏర్పాటు చేయండి."
      },
      "general_commercial": {
        "en": "Primary server rack, main circuit breakers, and staff tea station belong here.",
        "hi": "मुख्य सर्वर रैक, विद्युत स्विचबोर्ड एवं चाय-कॉफी स्टेशन यहाँ बनाएं।",
        "kn": "ಮುಖ್ಯ ಸರ್ವರ್, ವಿದ್ಯುತ್ ಪ್ಯಾನೆಲ್ ಮತ್ತು ಸಿಬ್ಬಂದಿ ಟೀ ಸ್ಟೇಷನ್ ಇಲ್ಲೇ ಇರಬೇಕು.",
        "ta": "சர்வர் அறை, மெயின் ஸ்விட்ச் போர்டு மற்றும் தேனீர் நிலையம் இங்கு அமைய வேண்டும்.",
        "te": "ప్రధాన సర్వర్ రాక్, విద్యుత్ డిబి బాక్స్ మరియు టీ/కాఫీ స్టేషన్ ఇక్కడే ఉండాలి."
      }
    }
  },
  "S": {
    "zone_name": "Dakshina",
    "element": "Earth / Fire",
    "deity": "Yama",
    "commercial_suitability": [
      "Back-Office Workstations",
      "Heavy Display Racks",
      "Senior Manager Cabins"
    ],
    "avoid": [
      "Customer Main Entrance",
      "Water Borings"
    ],
    "business_impact": {
      "en": "Anchors business longevity, institutional reputation, and operational stability.",
      "hi": "व्यापार की दीर्घायु, प्रतिष्ठा और संगठनात्मक स्थिरता को सुदृढ़ करता है।",
      "kn": "ವ್ಯವಹಾರದ ದೀರ್ಘಾಯುಷ್ಯ, ಘನತೆ ಮತ್ತು ಕಾರ್ಯಾಚರಣೆಯ ಸ್ಥಿರತೆಯನ್ನು ಬಲಪಡಿಸುತ್ತದೆ.",
      "ta": "வணிகத்தின் நீண்ட ஆயுள், நற்பெயர் மற்றும் நிறுவன நிலைத்தன்மையை உறுதி செய்யும்.",
      "te": "వ్యాపార దీర్ఘకాలిక మనుగడ, మార్కెట్ కీర్తి మరియు స్థిరత్వాన్ని కాపాడుతుంది."
    },
    "retail_tips": {
      "apparel_silk_sarees": {
        "en": "Erect heavy solid wood shelving for premium folded silks along the South wall.",
        "hi": "दक्षिण की दीवार पर भारी लकड़ी की अलमारियों में तह की हुई रेशमी साड़ियाँ रखें।",
        "kn": "ದಕ್ಷಿಣದ ಗೋಡೆಯಲ್ಲಿ ಮರದ ಕಪಾಟುಗಳನ್ನು ನಿರ್ಮಿಸಿ ಮಡಚಿದ ರೇಷ್ಮೆ ಸೀರೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ.",
        "ta": "தெற்கு சுவரில் கனமான மர அலமாரிகளில் மடிக்கப்பட்ட பட்டுப் புடவைகளை அடுக்கவும்.",
        "te": "దక్షిణం గోడ వెంబడి బరువైన చెక్క అరలలో మడతపెట్టిన పట్టుచీరలను భద్రపరచండి."
      },
      "jewelry_luxury": {
        "en": "Store heavy security safes and reinforced storage vaults backing the South wall.",
        "hi": "दक्षिण दीवार के सहारे भारी तिजोरियां एवं मजबूत लॉकर स्थापित करें।",
        "kn": "ದಕ್ಷಿಣದ ಗೋಡೆಯ ಆಧಾರದೊಂದಿಗೆ ಭದ್ರತಾ ತಿಜೋರಿಗಳನ್ನು ಇರಿಸಿ.",
        "ta": "தெற்கு சுவரை ஒட்டி கனமான பாதுகாப்பு பெட்டகங்களை அமைக்கவும்.",
        "te": "దక్షిణం గోడ ఆనుకుని భారీ సేఫ్‌లు మరియు లాకర్లను ఏర్పాటు చేయండి."
      },
      "general_commercial": {
        "en": "Place senior accounts and administrative team desks facing North or East.",
        "hi": "वरिष्ठ लेखा एवं प्रशासनिक टीम की मेज उत्तर या पूर्व की ओर मुख करके रखें।",
        "kn": "ಹಿರಿಯ ಲೆಕ್ಕಪರಿಶೋಧಕರು ಮತ್ತು ಆಡಳಿತ ಸಿಬ್ಬಂದಿ ಆಸನಗಳನ್ನು ಇಲ್ಲಿರಿಸಿ.",
        "ta": "மூத்த கணக்காளர்கள் மற்றும் நிர்வாகப் பிரிவு மேசைகளை இங்கு அமைக்கவும்.",
        "te": "సీనియర్ అకౌంట్స్ మరియు అడ్మినిస్ట్రేషన్ డెస్క్‌లను ఇక్కడ ఉంచండి."
      }
    }
  },
  "SW": {
    "zone_name": "Nairutya",
    "element": "Earth",
    "deity": "Nirrti",
    "commercial_suitability": [
      "Owner / MD Seating Desk",
      "Main Cash Safe Box",
      "Heavy Bulk Reserve Stock"
    ],
    "avoid": [
      "Customer Main Entrance",
      "Water Fountains",
      "Restrooms / Toilets"
    ],
    "business_impact": {
      "en": "Commands ultimate authority, wealth accumulation, leadership control, and financial retention.",
      "hi": "परम अधिकार, धन संचय, नेतृत्व नियंत्रण एवं वित्तीय स्थिरता प्रदान करता है।",
      "kn": "ಪೂರ್ಣ ಅಧಿಕಾರ, ಸಂಪತ್ತು ಶೇಖರಣೆ, ನಾಯಕತ್ವದ ನಿಯಂತ್ರಣ ಮತ್ತು ಆರ್ಥಿಕ ಸ್ಥಿರತೆಯನ್ನು ನೀಡುತ್ತದೆ.",
      "ta": "முழு ஆளுமை, செல்வச் சேமிப்பு, தலைமை கட்டுப்பாடு மற்றும் நிதி பாதுகாப்பை வழங்கும்.",
      "te": "సంపూర్ణ అధికారం, సంపద నిల్వ, నాయకత్వ నియంత్రణ మరియు ఆర్థిక స్థిరత్వాన్ని ఇస్తుంది."
    },
    "retail_tips": {
      "apparel_silk_sarees": {
        "en": "Owner/MD desk must be here, sitting facing North or East with solid wall behind. Cash safe placed here opening North.",
        "hi": "मालिक की मेज यहाँ हो (मुख उत्तर या पूर्व)। पीछे ठोस दीवार हो। तिजोरी यहीं रखें जिसका मुख उत्तर में खुले।",
        "kn": "ಮಾಲೀಕರ ಆಸನ ಇಲ್ಲೇ ಇರಬೇಕು (ಮುಖ ಉತ್ತರ ಅಥವಾ ಪೂರ್ವಕ್ಕೆ). ಹಿಂಭಾಗದಲ್ಲಿ ಭದ್ರವಾದ ಗೋಡೆ ಇರಲಿ. ತಿಜೋರಿ ಬಾಗಿಲು ಉತ್ತರಕ್ಕೆ ತೆರೆಯಲಿ.",
        "ta": "உரிமையாளர் மேசை இங்கு அமைய வேண்டும் (வடக்கு/கிழக்கு நோக்கி). பின்னால் திடமான சுவர் இருக்க வேண்டும். பணப்பெட்டி வடக்கு நோக்கி திறக்க வேண்டும்.",
        "te": "యజమాని డెస్క్ ఇక్కడే ఉండాలి (ఉత్తరం లేదా తూర్పు ముఖంగా). వెనుక గట్టి గోడ ఉండాలి. లాకర్ ఉత్తరం వైపు తెరుచుకోవాలి."
      },
      "jewelry_luxury": {
        "en": "Master vault and owner cabin anchored here. Supreme security and zero financial leakage.",
        "hi": "मुख्य वॉल्ट और मालिक का कक्ष यहीं हो। सर्वोच्च सुरक्षा एवं वित्तीय सुदृढ़ता।",
        "kn": "ಮುಖ್ಯ ವಾಲ್ಟ್ ಮತ್ತು ಮಾಲೀಕರ ಕೊಠಡಿಯನ್ನು ಇಲ್ಲಿ ಸ್ಥಾಪಿಸಿ. ಗರಿಷ್ಠ ಭದ್ರತೆ ದೊರೆಯುತ್ತದೆ.",
        "ta": "முக்கிய பெட்டகம் மற்றும் உரிமையாளர் அறை இங்கு அமைய வேண்டும். உச்சக்கட்ட பாதுகாப்பு.",
        "te": "ప్రధాన వాల్ట్ మరియు యజమాని క్యాబిన్ ఇక్కడే ఉండాలి. గరిష్ట భద్రత లభిస్తుంది."
      },
      "general_commercial": {
        "en": "MD / CEO executive cabin. Place heaviest office furniture, safe, and critical company archives here.",
        "hi": "प्रबंध निदेशक / सीईओ का केबिन। सबसे भारी फर्नीचर, तिजोरी एवं महत्वपूर्ण दस्तावेज यहाँ रखें।",
        "kn": "ವ್ಯವಸ್ಥಾಪಕ ನಿರ್ದೇಶಕರ (MD/CEO) ಕೊಠಡಿ. ಅತ್ಯಂತ ಭಾರವಾದ ಪೀಠೋಪಕರಣಗಳು ಮತ್ತು ದಾಖಲೆಗಳು ಇಲ್ಲಿರಲಿ.",
        "ta": "நிர்வாக இயக்குனர் அறை. கனமான மரச்சாமான்கள், லாக்கர் மற்றும் முக்கிய ஆவணங்களை இங்கு வைக்கவும்.",
        "te": "మేనేజింగ్ డైరెక్టర్ క్యాబిన్. అత్యంత బరువైన ఫర్నిచర్, సేఫ్ మరియు కీలక పత్రాలు ఇక్కడే ఉండాలి."
      }
    }
  },
  "W": {
    "zone_name": "Paschima",
    "element": "Space / Air",
    "deity": "Varuna",
    "commercial_suitability": [
      "Sales Counter & Demonstration",
      "Trial Rooms",
      "Merchandise Display Cabinets"
    ],
    "avoid": [
      "Mandir / Prayer Altar",
      "Light Balconies"
    ],
    "business_impact": {
      "en": "Secures high profit margins, consistent revenue monetization, and closure of deals.",
      "hi": "उच्च लाभ मार्जिन, निरंतर राजस्व प्राप्ति और सौदों को सफलतापूर्वक पूरा करता है।",
      "kn": "ಉತ್ತಮ ಲಾಭ, ನಿರಂತರ ಆದಾಯ ಮತ್ತು ವ್ಯಾಪಾರ ವಹಿವಾಟುಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸುತ್ತದೆ.",
      "ta": "அதிக லாப வரம்பு, தொடர் வருமானம் மற்றும் வெற்றிகரமான விற்பனையை உறுதி செய்யும்.",
      "te": "అధిక లాభాలు, స్థిరమైన ఆదాయం మరియు వ్యాపార ఒప్పందాల విజయవంతమైన ముగింపును ఇస్తుంది."
    },
    "retail_tips": {
      "apparel_silk_sarees": {
        "en": "Ideal for saree drapery display counters and consultation tables where customers inspect silk weaves.",
        "hi": "साड़ियों के प्रदर्शन काउंटर और परामर्श मेजों के लिए आदर्श जहाँ ग्राहक साड़ियाँ देखते हैं।",
        "kn": "ಗ್ರಾಹಕರು ರೇಷ್ಮೆ ಸೀರೆಗಳನ್ನು ವೀಕ್ಷಿಸುವ ಮತ್ತು ಆಯ್ಕೆ ಮಾಡುವ ಪ್ರದರ್ಶನ ಕೌಂಟರ್‌ಗಳಿಗೆ ಅತ್ಯುತ್ತಮ.",
        "ta": "வாடிக்கையாளர்கள் பட்டுப் புடவைகளை விரித்துப் பார்த்து தேர்ந்தெடுக்கும் மேசைகளுக்கு ஏற்றது.",
        "te": "కస్టమర్లు పట్టుచీరలను చూసి ఎంపిక చేసుకునే ప్రదర్శన కౌంటర్లకు ఇది ఉత్తమం."
      },
      "jewelry_luxury": {
        "en": "Sales presentation desks and diamond viewing tables with customer seating facing East.",
        "hi": "बिक्री प्रस्तुति मेज एवं हीरा निरीक्षण काउंटर जहाँ ग्राहक का मुख पूर्व में हो।",
        "kn": "ಮಾರಾಟ ಪ್ರಸ್ತುತಿ ಮೇಜುಗಳು ಮತ್ತು ಗ್ರಾಹಕರು ಪೂರ್ವಕ್ಕೆ ಮುಖಮಾಡಿ ಕುಳಿತುಕೊಳ್ಳುವ ಕೌಂಟರ್‌ಗಳು.",
        "ta": "விற்பனை மேசைகள் மற்றும் வாடிக்கையாளர்கள் கிழக்கு நோக்கி அமர்ந்து நகைகளை பார்க்கும் இடம்.",
        "te": "విక్రయాల ప్రదర్శన బల్లలు మరియు కస్టమర్లు తూర్పు ముఖంగా కూర్చునే కౌంటర్లు."
      },
      "general_commercial": {
        "en": "Core sales division, conference rooms, and customer closing meeting rooms.",
        "hi": "बिक्री विभाग, सम्मेलन कक्ष और ग्राहक सौदे बंद करने वाले मीटिंग रूम।",
        "kn": "ಮಾರಾಟ ವಿಭಾಗ, ಸಭಾಂಗಣ ಮತ್ತು ವ್ಯಾಪಾರ ಒಪ್ಪಂದಗಳ ಕೊಠಡಿ.",
        "ta": "விற்பனை பிரிவு, மாநாட்டு கூடம் மற்றும் வர்த்தக பேச்சுவார்த்தை அறை.",
        "te": "సేల్స్ విభాగం, సమావేశ మందిరం మరియు డీల్ ముగింపు గదులు."
      }
    }
  },
  "NW": {
    "zone_name": "Vayavya",
    "element": "Air",
    "deity": "Vayu",
    "commercial_suitability": [
      "Fast-Moving Stock Racks",
      "Trial / Changing Rooms",
      "Packing & Dispatch Bay"
    ],
    "avoid": [
      "Cash Safe / Locker",
      "Permanent Heavy Reserve Stock",
      "Owner Cabin"
    ],
    "business_impact": {
      "en": "Accelerates stock rotation, prevents inventory dead-stock, and speeds up product dispatch.",
      "hi": "माल के तेजी से बिकने को गति देता है, पुराने स्टॉक को जमा नहीं होने देता और प्रेषण तेज करता है।",
      "kn": "ದಾಸ್ತಾನು ತ್ವರಿತವಾಗಿ ಮಾರಾಟವಾಗುವಂತೆ ಮಾಡುತ್ತದೆ ಮತ್ತು ಸರಕುಗಳನ್ನು ಸುಲಭವಾಗಿ ಸಾಗಿಸಲು ಸಹಕಾರಿ.",
      "ta": "பொருட்கள் விரைவாக விற்றுத் தீர வழிவகுக்கும், தேக்க நிலையைத் தடுக்கும் மற்றும் பார்சல் அனுப்ப உதவும்.",
      "te": "సరుకు వేగంగా అమ్ముడయ్యేలా చేస్తుంది, నిల్వ పేరుకుపోకుండా నివారిస్తుంది మరియు ప్యాకింగ్‌కు అనుకూలం."
    },
    "retail_tips": {
      "apparel_silk_sarees": {
        "en": "Place fast-moving trend sarees, festive collections, and customer trial rooms here. Stock moves swiftly!",
        "hi": "तेजी से बिकने वाली साड़ियाँ, त्यौहारी संग्रह और ट्रायल रूम यहाँ रखें। माल तुरंत बिकेगा!",
        "kn": "ವೇಗವಾಗಿ ಮಾರಾಟವಾಗುವ ಟ್ರೆಂಡಿ ಸೀರೆಗಳು, ಹಬ್ಬದ ಸಂಗ್ರಹ ಮತ್ತು ಟ್ರಯಲ್ ರೂಮ್ ಇಲ್ಲೇ ಇರಲಿ. ವ್ಯಾಪಾರ ಚುರುಕಾಗುತ್ತದೆ!",
        "ta": "விரைவாக விற்பனையாகும் ட்ரெண்டிங் புடவைகள், பண்டிகை கால ஆடைகள் மற்றும் டிரையல் ரூம் இங்கு அமையட்டும்.",
        "te": "వేగంగా అమ్ముడయ్యే చీరలు, పండుగ కలెక్షన్లు మరియు ట్రయల్ రూమ్‌లను ఇక్కడే ఉంచండి."
      },
      "jewelry_luxury": {
        "en": "Package dispatch counter, online courier order processing, and finished goods shipping.",
        "hi": "पार्सल प्रेषण काउंटर, ऑनलाइन ऑर्डर पैकेजिंग और तैयार माल की डिलीवरी व्यवस्था।",
        "kn": "ಪಾರ್ಸಲ್ ವಿತರಣಾ ಕೌಂಟರ್, ಆನ್‌ಲೈನ್ ಆರ್ಡರ್ ಪ್ಯಾಕಿಂಗ್ ಮತ್ತು ಸಾಗಣೆ ವಿಭಾಗ.",
        "ta": "பார்சல் அனுப்பும் கவுண்டர், ஆன்லைன் ஆர்டர் பேக்கிங் மற்றும் டெலிவரி பிரிவு.",
        "te": "పార్శిల్ డిస్పాచ్ కౌంటర్, ఆన్‌లైన్ ఆర్డర్ల ప్యాకింగ్ మరియు డెలివరీ విభాగం."
      },
      "general_commercial": {
        "en": "Logistics, delivery staging, customer trial suites, and rotating finished goods inventory.",
        "hi": "लॉजिस्टिक्स, डिलीवरी केंद्र, ग्राहक परीक्षण कक्ष और गतिशील इन्वेंट्री।",
        "kn": "ಲಾಜಿಸ್ಟಿಕ್ಸ್, ಡೆಲಿವರಿ ವಿಭಾಗ, ಗ್ರಾಹಕರ ಪರೀಕ್ಷಾ ಕೊಠಡಿ ಮತ್ತು ಚಲನಶೀಲ ದಾಸ್ತಾನು.",
        "ta": "சரக்கு போக்குவரத்து, டெலிவரி பிரிவு மற்றும் தொடர்ந்து சுழலும் இருப்புப் பகுதி.",
        "te": "లాజిస్టిక్స్, డెలివరీ విభాగం మరియు రొటేటింగ్ ఇన్వెంటరీ."
      }
    }
  }
},

  // Retail & Business Vastu Profiles
  RETAIL_PROFILES: [
  {
    "profile_id": "apparel_silk_sarees",
    "name": {
      "en": "Apparel, Silk Sarees & Boutiques",
      "hi": "परिधान, रेशमी साड़ियाँ एवं बुटीक",
      "kn": "ವಸ್ತ್ರ, ರೇಷ್ಮೆ ಸೀರೆಗಳು ಮತ್ತು ಅಂಗಡಿಗಳು",
      "ta": "ஆடைகள், பட்டுப் புடவைகள் & பொட்டிக்குகள்",
      "te": "వస్త్రాలు, పట్టుచీరలు & బోటిక్‌లు"
    },
    "icon": "👗",
    "primary_element": "Fire & Venus (Aesthetics, Luster & Luxury)",
    "favored_entrance": [
      "NE",
      "E",
      "SE"
    ],
    "keyZones": [
      "SE",
      "E",
      "NE",
      "SW",
      "NW"
    ],
    "focus_zones": {
      "entrance": "East / Northeast for visual appeal and customer influx",
      "cash_register": "Southwest zone, safe opening North",
      "display_shelves": "West, Northwest, or South walls",
      "fitting_rooms": "Northwest or West",
      "zari_silk_display": "North-East or East for premium luster and prestige"
    },
    "tips": {
      "en": "Emphasize South-East (Venus / Aesthetics) and North-East (Purity / Luster). Keep silks displayed on West or South racks facing East or North.",
      "hi": "दक्षिण-पूर्व (शुक्र/सौंदर्य) और उत्तर-पूर्व (शुद्धता) को प्राथमिकता दें। रेशमी साड़ियों को पश्चिम या दक्षिण रैक में पूर्व या उत्तर की ओर प्रदर्शित करें।",
      "kn": "ಆಗ್ನೇಯ (ಶುಕ್ರ/ಸೌಂದರ್ಯ) ಮತ್ತು ಈಶಾನ್ಯಕ್ಕೆ ಆದ್ಯತೆ ನೀಡಿ. ರೇಷ್ಮೆ ಸೀರೆಗಳನ್ನು ಪಶ್ಚಿಮ ಅಥವಾ ದಕ್ಷಿಣದ ಕಪಾಟಿನಲ್ಲಿ ಪೂರ್ವ ಅಥವಾ ಉತ್ತರಕ್ಕೆ ಮುಖಮಾಡಿ ಪ್ರದರ್ಶಿಸಿ.",
      "ta": "தென்கிழக்கு (அழகு/சுக்கிரன்) மற்றும் வடகிழக்கிற்கு முக்கியத்துவம் கொடுங்கள். பட்டுப் புடவைகளை மேற்கு/தெற்கு சுவரில் கிழக்கு/வடக்கு நோக்கி காட்சிப்படுத்துங்கள்.",
      "te": "ఆగ్నేయం (శుక్రుడు/సౌందర్యం) మరియు ఈశాన్యానికి ప్రాధాన్యత ఇవ్వండి. పట్టుచీరలను పడమర లేదా దక్షిణం రాక్స్‌లో తూర్పు/ఉత్తరం ముఖంగా ప్రదర్శించండి."
    }
  },
  {
    "profile_id": "jewelry_luxury",
    "name": {
      "en": "Jewelry & High-Value Retail",
      "hi": "आभूषण एवं बहुमूल्य खुदरा",
      "kn": "ಆಭರಣಗಳು ಮತ್ತು ಬೆಲೆಬಾಳುವ ವ್ಯಾಪಾರ",
      "ta": "நகைகள் & உயர் மதிப்பு சில்லறை",
      "te": "ఆభరణాలు & విలువైన వస్తువుల రిటైల్"
    },
    "icon": "💎",
    "primary_element": "Earth & Water (Stability & Wealth Accumulation)",
    "favored_entrance": [
      "N",
      "NE"
    ],
    "keyZones": [
      "N",
      "NE",
      "SW"
    ],
    "focus_zones": {
      "entrance": "North (Kubera Zone) or Northeast",
      "vault_cash": "Southwest corner, opening facing North",
      "premium_display": "Northeast or East",
      "security_counter": "Southeast or Northwest"
    },
    "tips": {
      "en": "Anchor high-value vaults in South-West opening North. Position diamond/gold display counters in North or North-East.",
      "hi": "मुख्य तिजोरी दक्षिण-पश्चिम में रखें जिसका द्वार उत्तर में खुले। हीरे व सोने के डिस्प्ले काउंटर उत्तर या उत्तर-पूर्व में रखें।",
      "kn": "ಬೆಲೆಬಾಳುವ ವಾಲ್ಟ್ ನೈಋತ್ಯದಲ್ಲಿರಲಿ (ಉತ್ತರಕ್ಕೆ ತೆರೆಯಲಿ). ವಜ್ರ ಮತ್ತು ಚಿನ್ನದ ಕೌಂಟರ್‌ಗಳನ್ನು ಉತ್ತರ ಅಥವಾ ಈಶಾನ್ಯದಲ್ಲಿರಿಸಿ.",
      "ta": "முக்கிய நகைப் பெட்டகத்தை தென்மேற்கில் வைத்து வடக்கு நோக்கி திறக்கவும். வைரம்/தங்க கவுண்ட்டரை வடக்கு அல்லது வடகிழக்கில் வைக்கவும்.",
      "te": "భారీ వాల్ట్‌ను నైరుతిలో ఉంచి తలుపు ఉత్తరం వైపు తెరుచుకునేలా చేయండి. బంగారం, వజ్రాల కౌంటర్లను ఉత్తరం లేదా ఈశాన్యంలో ఉంచండి."
    }
  },
  {
    "profile_id": "general_commercial",
    "name": {
      "en": "General Commercial Office & Stores",
      "hi": "सामान्य वाणिज्यिक कार्यालय एवं प्रतिष्ठान",
      "kn": "ಸಾಮಾನ್ಯ ವಾಣಿಜ್ಯ ಕಚೇರಿ ಮತ್ತು ಮಳಿಗೆಗಳು",
      "ta": "பொது வணிக அலுவலகம் & கடைகள்",
      "te": "సాధారణ వాణిజ్య కార్యాలయం & దుకాణాలు"
    },
    "icon": "🏬",
    "primary_element": "Balanced 5 Elements (Harmony & Scale)",
    "favored_entrance": [
      "N",
      "NE",
      "E"
    ],
    "keyZones": [
      "SW",
      "SE",
      "NW",
      "N"
    ],
    "focus_zones": {
      "owner_desk": "Southwest facing North/East",
      "fast_moving_stock": "Northwest",
      "heavy_inventory": "Southwest / South",
      "electrical_db": "Southeast"
    },
    "tips": {
      "en": "Ensure Owner/MD sits in South-West facing North or East. Place fast turnover inventory in North-West and servers in South-East.",
      "hi": "मालिक दक्षिण-पश्चिम में बैठकर उत्तर या पूर्व की ओर मुख करें। त्वरित बिक्री माल उत्तर-पश्चिम में और सर्वर दक्षिण-पूर्व में रखें।",
      "kn": "ಮಾಲೀಕರು ನೈಋತ್ಯದಲ್ಲಿ ಕುಳಿತು ಉತ್ತರ ಅಥವಾ ಪೂರ್ವಕ್ಕೆ ಮುಖ ಮಾಡಲಿ. ಚಲನಶೀಲ ಸರಕುಗಳು ವಾಯುವ್ಯದಲ್ಲಿ ಮತ್ತು ಸರ್ವರ್ ಆಗ್ನೇಯದಲ್ಲಿರಲಿ.",
      "ta": "உரிமையாளர் தென்மேற்கில் வடக்கு அல்லது கிழக்கு நோக்கி அமரட்டும். சுழலும் பொருட்கள் வடமேற்கிலும் சர்வர்கள் தென்கிழக்கிலும் இருக்கட்டும்.",
      "te": "యజమాని నైరుతిలో ఉత్తరం లేదా తూర్పు ముఖంగా కూర్చోవాలి. వేగంగా అమ్ముడయ్యే స్టాక్ వాయువ్యంలో, సర్వర్లు ఆగ్నేయంలో ఉండాలి."
    }
  }
],

  // Specialized Commercial Presets for Room & Zone Finder
  COMMERCIAL_ROOMS: [
  {
    "id": "owner_desk",
    "icon": "👑",
    "names": {
      "en": "Owner / MD Seating & Desk",
      "hi": "मालिक / प्रबंध निदेशक का आसन व मेज",
      "kn": "ಮಾಲೀಕರು / ವ್ಯವಸ್ಥಾಪಕ ನಿರ್ದೇಶಕರ ಆಸನ",
      "ta": "உரிமையாளர் / மேலாண்மை இயக்குனர் இருக்கை",
      "te": "యజమాని / మేనేజింగ్ డైరెక్టర్ కూర్చునే స్థానం"
    },
    "idealZones": [
      "SW"
    ],
    "avoidZones": [
      "NE",
      "SE",
      "NW"
    ],
    "remedyEn": "Target Zone: SW (Nairutya). Owner must sit facing North or East for supreme authority, firm leadership, and financial retention.",
    "remedyHi": "नैऋत्य (दक्षिण-पश्चिम) में बैठें और मुख उत्तर या पूर्व की ओर रखें। इससे नेतृत्व सुदृढ़ रहता है और व्यवसाय बढ़ता है।",
    "remedyKn": "ನೈಋತ್ಯವು (ದಕ್ಷಿಣ-ಪಶ್ಚಿಮ) ಶ್ರೇಷ್ಠ. ಮುಖವು ಉತ್ತರ ಅಥವಾ ಪೂರ್ವಕ್ಕೆ ಇರಲಿ. ಇದು ಸಂಸ್ಥೆಯ ಮೇಲೆ ಸಂಪೂರ್ಣ ನಿಯಂತ್ರಣ ನೀಡುತ್ತದೆ.",
    "remedyTa": "தென்மேற்கு (நைருதி) மிகச் சிறந்த இடம். வடக்கு அல்லது கிழக்கு நோக்கி அமர வேண்டும். தலைமைப் பண்பும் நிதிப் பாதுகாப்பும் கூடும்.",
    "remedyTe": "నైరుతి అత్యంత అనుకూలం. కూర్చునేటప్పుడు ముఖం ఉత్తరం లేదా తూర్పు వైపు ఉండాలి. ఇది సంస్థపై పూర్తి పట్టును ఇస్తుంది."
  },
  {
    "id": "cash_safe",
    "icon": "💰",
    "names": {
      "en": "Cash Locker & Safe Placement",
      "hi": "रोकड़ तिजोरी एवं सुरक्षित स्थान",
      "kn": "ನಗದು ತಿಜೋರಿ ಮತ್ತು ಸುರಕ್ಷಿತ ಪೆಟ್ಟಿಗೆ",
      "ta": "பணப்பெட்டி & லாக்கர் அமைவிடம்",
      "te": "నగదు లాకర్ & సేఫ్ స్థానం"
    },
    "idealZones": [
      "SW",
      "N"
    ],
    "avoidZones": [
      "SE",
      "S",
      "NE"
    ],
    "remedyEn": "Target Zone: SW or North. Place heavy locker in SW opening North towards Lord Kubera. Never place in South-East or North-East.",
    "remedyHi": "तिजोरी नैऋत्य में रखें जिसका द्वार उत्तर (कुबेर दिशा) में खुले। आग्नेय या ईशान्य में कभी न रखें।",
    "remedyKn": "ತಿಜೋರಿಯನ್ನು ನೈಋತ್ಯದಲ್ಲಿಟ್ಟು ಅದರ ಬಾಗಿಲು ಉತ್ತರಕ್ಕೆ (ಕುಬೇರ ದಿಕ್ಕು) ತೆರೆಯುವಂತಿರಲಿ. ಆಗ್ನೇಯ ಅಥವಾ ಈಶಾನ್ಯದಲ್ಲಿ ಬೇಡ.",
    "remedyTa": "பணப்பெட்டியை தென்மேற்கில் வைத்து அதன் கதவு வடக்கு நோக்கி திறக்க வேண்டும். தென்கிழக்கு அல்லது வடகிழக்கில் வைக்கக் கூடாது.",
    "remedyTe": "లాకర్‌ను నైరుతిలో ఉంచి తలుపు ఉత్తరం (కుబేర దిశ) వైపు తెరిచేలా చేయాలి. ఆగ్నేయం లేదా ఈశాన్యంలో అస్సలు పెట్టకూడదు."
  },
  {
    "id": "fast_stock",
    "icon": "⚡",
    "names": {
      "en": "Fast-Moving Stock & Sales Display",
      "hi": "शीघ्र बिकने वाला माल एवं प्रदर्शन",
      "kn": "ವೇಗವಾಗಿ ಮಾರಾಟವಾಗುವ ದಾಸ್ತಾನು",
      "ta": "வேகமாக விற்பனையாகும் பொருட்கள்",
      "te": "వేగంగా అమ్ముడయ్యే స్టాక్"
    },
    "idealZones": [
      "NW"
    ],
    "avoidZones": [
      "SW",
      "NE"
    ],
    "remedyEn": "Target Zone: NW (Vayavya - Air). Air element accelerates movement and sales turnover, preventing goods stagnation.",
    "remedyHi": "वायव्य (उत्तर-पश्चिम) में रखने से माल जल्दी बिकता है और व्यापार में निरंतर गति बनी रहती है।",
    "remedyKn": "ವಾಯುವ್ಯದಲ್ಲಿ ಇರಿಸಿದರೆ ದಾಸ್ತಾನು ಶೀಘ್ರವಾಗಿ ಮಾರಾಟವಾಗಿ ನಗದು ಚಲಾವಣೆ ಹೆಚ್ಚುತ್ತದೆ.",
    "remedyTa": "வடமேற்கு (வாயு) பகுதியில் வைத்தால் பொருட்கள் தேக்கமின்றி விரைவாக விற்பனையாகும்.",
    "remedyTe": "వాయువ్యంలో ఉంచడం వల్ల సరుకు త్వరగా అమ్ముడై నిరంతర నగదు ప్రవాహం ఉంటుంది."
  },
  {
    "id": "heavy_stock",
    "icon": "📦",
    "names": {
      "en": "Heavy Reserve Stock & Warehouse",
      "hi": "भारी गोदाम एवं आरक्षित माल",
      "kn": "ಭಾರವಾದ ದಾಸ್ತಾನು ಮತ್ತು ಗೋದಾಮು",
      "ta": "கனரக இருப்பு & கிடங்கு",
      "te": "భారీ సరుకు నిల్వ & గోదాము"
    },
    "idealZones": [
      "SW",
      "S",
      "W"
    ],
    "avoidZones": [
      "NE",
      "N",
      "E"
    ],
    "remedyEn": "Target Zone: SW (Earth), South, or West. Heavy earth weight anchors stability. Never overload North or North-East.",
    "remedyHi": "भारी माल नैऋत्य, दक्षिण या पश्चिम में रखें। उत्तर या ईशान्य को सदैव हल्का और खुला रखें।",
    "remedyKn": "ಭಾರವಾದ ದಾಸ್ತಾನನ್ನು ನೈಋತ್ಯ, ದಕ್ಷಿಣ ಅಥವಾ ಪಶ್ಚಿಮದಲ್ಲಿಡಿ. ಉತ್ತರ ಮತ್ತು ಈಶಾನ್ಯವನ್ನು ಹಗುರವಾಗಿಡಿ.",
    "remedyTa": "கனரக பொருட்களை தென்மேற்கு, தெற்கு அல்லது மேற்கில் அடுக்கவும். வடகிழக்கை எப்போதும் பாரமின்றி வைக்கவும்.",
    "remedyTe": "భారీ సరుకును నైరుతి, దక్షిణం లేదా పడమరలో నిల్వ చేయాలి. ఉత్తరం మరియు ఈశాన్యం ఖాళీగా ఉండాలి."
  },
  {
    "id": "electrical_db",
    "icon": "⚡",
    "names": {
      "en": "Electrical DB, UPS, Server & Generator",
      "hi": "विद्युत पैनल, यूपीएस, सर्वर एवं जनरेटर",
      "kn": "ವಿದ್ಯುತ್ ಪ್ಯಾನೆಲ್, ಯುಪಿಎಸ್, ಸರ್ವರ್",
      "ta": "மின்சார வாரிய பெட்டி, யுபிஎஸ் & சர்வர்",
      "te": "విద్యుత్ ప్యానెల్, యుపిఎస్ & సర్వర్"
    },
    "idealZones": [
      "SE"
    ],
    "avoidZones": [
      "NE",
      "N",
      "SW"
    ],
    "remedyEn": "Target Zone: SE (Agneya - Fire Element). Prevents short-circuits, electrical failures, and equipment hazards.",
    "remedyHi": "आग्नेय (दक्षिण-पूर्व) में सभी विद्युत उपकरण स्थापित करें। इससे दुर्घटनाएं और खराबी टलती है।",
    "remedyKn": "ಆಗ್ನೇಯದಲ್ಲಿ (ಅಗ್ನಿ ತತ್ವ) ವಿದ್ಯುತ್ ಉಪಕರಣಗಳನ್ನು ಅಳವಡಿಸಿ. ವಿದ್ಯುತ್ ಅವಘಡಗಳು ಮತ್ತು ತೊಂದರೆಗಳು ನಿವಾರಣೆಯಾಗುತ್ತವೆ.",
    "remedyTa": "தென்கிழக்கு (அக்னி) பகுதியில் மின் உபகரணங்களை நிறுவவும். மின் விபத்துக்கள் தவிர்க்கப்படும்.",
    "remedyTe": "ఆగ్నేయంలో (అగ్ని తత్త్వం) విద్యుత్ పరికరాలను అమర్చాలి. షార్ట్ సర్క్యూట్లు మరియు ప్రమాదాలు జరగవు."
  },
  {
    "id": "trial_rooms",
    "icon": "🚪",
    "names": {
      "en": "Trial & Changing Rooms",
      "hi": "ट्रायल एवं वस्त्र परिवर्तन कक्ष",
      "kn": "ಟ್ರಯಲ್ ಮತ್ತು ಉಡುಪು ಬದಲಾಯಿಸುವ ಕೋಣೆ",
      "ta": "ஆடை மாற்றும் அறை (டிரையல் ரூம்)",
      "te": "ట్రయల్ & దుస్తులు మార్చుకునే గది"
    },
    "idealZones": [
      "NW",
      "W"
    ],
    "avoidZones": [
      "NE",
      "SW"
    ],
    "remedyEn": "Target Zone: NW or West. Position interior full-length mirrors on North or East walls for flattering reflection.",
    "remedyHi": "वायव्य या पश्चिम में बनाएं। कमरे के भीतर दर्पण सदैव उत्तर या पूर्व की दीवार पर लगाएं।",
    "remedyKn": "ವಾಯುವ್ಯ ಅಥವಾ ಪಶ್ಚಿಮದಲ್ಲಿ ನಿರ್ಮಿಸಿ. ಕೋಣೆಯೊಳಗಿನ ಕನ್ನಡಿಗಳನ್ನು ಉತ್ತರ ಅಥವಾ ಪೂರ್ವ ಗೋಡೆಗೆ ಅಳವಡಿಸಿ.",
    "remedyTa": "வடமேற்கு அல்லது மேற்கில் அமைக்கவும். அறையின் உள்ளே கண்ணாடியை வடக்கு அல்லது கிழக்கு சுவரில் பொருத்தவும்.",
    "remedyTe": "వాయువ్యం లేదా పడమరలో నిర్మించండి. గది లోపల అద్దాలను ఉత్తరం లేదా తూర్పు గోడపై అమర్చండి."
  },
  {
    "id": "pos_billing",
    "icon": "💳",
    "names": {
      "en": "POS Billing Counter & Cash Desk",
      "hi": "बिलिंग काउंटर एवं बिक्री रोकड़",
      "kn": "ಬಿಲ್ಲಿಂಗ್ ಕೌಂಟರ್ ಮತ್ತು ನಗದು ಕೌಂಟರ್",
      "ta": "பில்லிங் கவுண்டர் & ரொக்க மேசை",
      "te": "బిల్లింగ్ కౌంటర్ & నగదు విభాగం"
    },
    "idealZones": [
      "SE",
      "N",
      "E"
    ],
    "avoidZones": [
      "SW",
      "NE"
    ],
    "remedyEn": "Target Zone: SE (Fire speed) or North/East. Cashier should face North or East while billing.",
    "remedyHi": "आग्नेय, उत्तर या पूर्व में रखें। बिल बनाते समय कैशियर का मुख उत्तर या पूर्व दिशा में होना चाहिए।",
    "remedyKn": "ಆಗ್ನೇಯ, ಉತ್ತರ ಅಥವಾ ಪೂರ್ವದಲ್ಲಿಡಿ. ಬಿಲ್ ಮಾಡುವಾಗ ಕ್ಯಾಷಿಯರ್ ಮುಖವು ಉತ್ತರ ಅಥವಾ ಪೂರ್ವಕ್ಕೆ ಇರಲಿ.",
    "remedyTa": "தென்கிழக்கு, வடக்கு அல்லது கிழக்கில் அமைக்கவும். பில் போடும் போது காசாளர் வடக்கு அல்லது கிழக்கு நோக்கி இருக்க வேண்டும்.",
    "remedyTe": "ఆగ్నేయం, ఉత్తరం లేదా తూర్పులో ఉంచండి. బిల్లింగ్ చేసేటప్పుడు క్యాషియర్ ముఖం ఉత్తరం లేదా తూర్పు వైపు ఉండాలి."
  },
  {
    "id": "luxury_display",
    "icon": "✨",
    "names": {
      "en": "Luxury Showcase & Flagship Display",
      "hi": "उत्कृष्ट रेशम एवं आभूषण शोकेस",
      "kn": "ಐಷಾರಾಮಿ ರೇಷ್ಮೆ ಮತ್ತು ಆಭರಣ ಪ್ರದರ್ಶನ",
      "ta": "ஆடம்பர பட்டு & நகை காட்சி பெட்டகம்",
      "te": "విలువైన పట్టు & ఆభరణాల ప్రదర్శన"
    },
    "idealZones": [
      "NE",
      "E",
      "N"
    ],
    "avoidZones": [
      "SW",
      "S"
    ],
    "remedyEn": "Target Zone: NE, East, or North. Sacred illumination brings out the richest luster of silk sarees and fine gems.",
    "remedyHi": "ईशान्य, पूर्व या उत्तर में रखें। उत्तम प्रकाश व्यवस्था रेशमी साड़ियों और रत्नों की चमक बढ़ाती है।",
    "remedyKn": "ಈಶಾನ್ಯ, ಪೂರ್ವ ಅಥವಾ ಉತ್ತರದಲ್ಲಿ ಪ್ರದರ್ಶಿಸಿ. ಪ್ರಕಾಶಮಾನ ಬೆಳಕು ರೇಷ್ಮೆ ಸೀರೆಗಳ ಸೌಂದರ್ಯವನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.",
    "remedyTa": "வடகிழக்கு, கிழக்கு அல்லது வடக்கில் காட்சிப்படுத்தவும். சீரான வெளிச்சம் பட்டுப் புடவைகளின் அழகை மிளிரச் செய்யும்.",
    "remedyTe": "ఈశాన్యం, తూర్పు లేదా ఉత్తరంలో ప్రదర్శించండి. దివ్యమైన వెలుగు పట్టుచీరల శోభను రెట్టింపు చేస్తుంది."
  },
  {
    "id": "pantry",
    "icon": "☕",
    "names": {
      "en": "Staff Pantry & Water Station",
      "hi": "कर्मचारी रसोई एवं पेय जल",
      "kn": "ಸಿಬ್ಬಂದಿ ಉಪಹಾರ ಮತ್ತು ಕುಡಿಯುವ ನೀರು",
      "ta": "பணியாளர் சிற்றுண்டி & குடிநீர்",
      "te": "సిబ్బంది పాంట్రీ & తాగునీరు"
    },
    "idealZones": [
      "SE",
      "NW"
    ],
    "avoidZones": [
      "SW",
      "NE"
    ],
    "remedyEn": "Target Zone: SE (Fire) for cooking/heating; NW for general pantry. Water dispenser in North or NE.",
    "remedyHi": "चाय-कॉफी मशीन आग्नेय में रखें। पीने के पानी का डिस्पेंसर उत्तर या ईशान्य में रखें।",
    "remedyKn": "ಕಾಫಿ-ಟೀ ಮಷಿನ್ ಆಗ್ನೇಯದಲ್ಲಿರಲಿ. ಕುಡಿಯುವ ನೀರಿನ ಫಿಲ್ಟರ್ ಉತ್ತರ ಅಥವಾ ಈಶಾನ್ಯದಲ್ಲಿರಲಿ.",
    "remedyTa": "தேனீர்/காபி அடுப்பு தென்கிழக்கில் அமையட்டும். குடிநீர் கேன் வடக்கு அல்லது வடகிழக்கில் இருக்க வேண்டும்.",
    "remedyTe": "టీ/కాఫీ మెషిన్ ఆగ్నేయంలో ఉండాలి. తాగునీటి డిస్పెన్సర్ ఉత్తరం లేదా ఈశాన్యంలో అమర్చాలి."
  }
],

  // Commercial Plot Geometry Classifications
  PLOT_SHAPES: {
  "Shermukhi": {
    "id": "Shermukhi",
    "name": "Shermukhi (Lion-Faced)",
    "subtitle": "Wide Front, Narrow Back",
    "names": {
      "en": "Shermukhi (Lion-Faced: Wide Front)",
      "hi": "शेरमुखी (आगे से चौड़ा, पीछे से संकरा)",
      "kn": "ಶೇರ್ಮುಖಿ (ಮುಂದೆ ಅಗಲ, ಹಿಂದೆ ಕಿರಿದು)",
      "ta": "சிங்க முகம் (முன்புறம் அகலம், பின்புறம் குறுகியது)",
      "te": "సింహముఖి (ముందు వెడల్పు, వెనుక ఇరుకు)"
    },
    "commercialEffect": "Highly recommended for commercial retail stores, showrooms & boutiques. Maximizes street frontage, visual exposure, and customer footfall.",
    "residentialEffect": "Not recommended for residential dwelling.",
    "badgeClass": "aligned",
    "statusLabel": "🌟 IDEAL FOR RETAIL & SHOWROOMS"
  },
  "Gaumukhi": {
    "id": "Gaumukhi",
    "name": "Gaumukhi (Cow-Faced)",
    "subtitle": "Narrow Front, Wide Back",
    "names": {
      "en": "Gaumukhi (Cow-Faced: Narrow Front)",
      "hi": "गोमुखी (आगे से संकरा, पीछे से चौड़ा)",
      "kn": "ಗೋಮುಖಿ (ಮುಂದೆ ಕಿರಿದು, ಹಿಂದೆ ಅಗಲ)",
      "ta": "பசு முகம் (முன்புறம் குறுகியது, பின்புறம் அகலம்)",
      "te": "గోముఖి (ముందు ఇరుకు, వెనుక వెడల్పు)"
    },
    "commercialEffect": "Caution for retail storefronts due to restricted street frontage. Remedy: Install expansive full-glass facade and bright grand illumination at entrance.",
    "residentialEffect": "Most auspicious and peaceful for family living.",
    "badgeClass": "tilted",
    "statusLabel": "⚠️ CAUTION FOR RETAIL (Requires Facade Remedy)"
  },
  "Square_Rectangular": {
    "id": "Square_Rectangular",
    "name": "Square / Rectangular",
    "subtitle": "90° Cardinal Symmetry",
    "names": {
      "en": "Square & Rectangular (Symmetrical)",
      "hi": "वर्गाकार एवं आयताकार (सम-भुज)",
      "kn": "ಚೌಕಾಕಾರ ಮತ್ತು ಆಯತಾಕಾರ (ಸಮ ಬಾಹು)",
      "ta": "சதுரம் மற்றும் செவ்வகம் (சம கோணம்)",
      "te": "చతురస్రాకార మరియు దీర్ఘచతురస్రాకార"
    },
    "commercialEffect": "Universally auspicious balance. Ratio should not exceed 1:2 for sustained wealth and organizational stability.",
    "residentialEffect": "Highly balanced and universally auspicious.",
    "badgeClass": "aligned",
    "statusLabel": "✅ UNIVERSALLY BALANCED"
  }
},

  // UI Strings Dictionary for All 5 Languages
  UI: {
    en: {
      propertyResidential: "Residential Vastu",
      propertyCommercial: "Commercial & Retail Vastu",
      businessCategory: "Business Category",
      commercialSuitability: "Commercial Suitability",
      businessImpact: "Business Impact",
      retailProfileApparel: "Apparel, Silk Sarees & Boutiques",
      retailProfileJewelry: "Jewelry & High-Value Retail",
      retailProfileGeneral: "General Office & Stores",
      plotShapeTitle: "Commercial Plot Geometry",
      shermukhi: "Shermukhi (Lion Face)",
      gaumukhi: "Gaumukhi (Cow Face)",
      commercialChecklist: "Commercial Compliance Audit",
      ownerDeskCheck: "Owner/MD Seating (SW facing N/E)",
      cashSafeCheck: "Cash Safe (SW opening North)",
      inventoryCheck: "Fast Stock Turnover (NW Zone)",
      fireElectricalCheck: "Fire & Electrical Safety (SE Zone)",
      appName: 'KUBERAN Vastu Compass',
      brandSubtitle: 'TRUE NORTH • VASTU SHASTRA EDITION',
      simpleMode: 'Simple Compass',
      vastuMode: 'Vastu Compass',
      zones8: '8 Zones',
      zones16: '16 Zones',
      zones32: '32 Padas',
      themeElemental: 'Elemental',
      themeChakra: 'Chakra',
      themeGold: 'Royal Gold',
      toolsRoomFinder: 'Room Finder',
      toolsPlotTilt: 'Plot Tilt',
      toolsCamera: 'Camera AR',
      toolsAudit: 'Audit Export',
      zoneInspector: 'Vastu Zone Inspector',
      element: 'Element',
      deity: 'Ruling Deity',
      favorableRooms: 'Favorable Placements',
      avoidPlacements: 'Strictly Avoid',
      entranceGradeA: '🌟 Highly Auspicious Entrance',
      entranceGradeB: '⚠️ Neutral / Mixed Results',
      entranceGradeC: '❌ Inauspicious / Remedial Action Needed',
      degreeLabel: 'HEADING',
      trueNorth: 'TRUE NORTH',
      magNorth: 'MAGNETIC NORTH',
      pitch: 'PITCH',
      roll: 'ROLL',
      targetBearing: 'Target Bearing',
      lockBearing: 'Lock Bearing',
      copyReport: 'Copy Vastu Report',
      shareReport: 'Share Report',
      cameraNotice: 'Camera AR overlay active. Rotate device to inspect walls and rooms.',
      vidishaAligned: 'SAMA-SUTRA (Aligned Plot)',
      vidishaTilted: 'VIDISHA (Tilted Plot)',
      plotTiltHelp: 'Align your phone flush against the front wall or plot boundary.',
      switchLang: 'Language',
      installApp: 'Install App',
      close: 'Close',
      calibrate: 'Calibrate',
      calibrationTitle: 'Compass Calibration',
      calibrationSub: 'Hardware Magnetometer & Alignment',
      sensorStatusLabel: 'SENSOR STATUS:',
      calibrationConfidence: 'CALIBRATION CONFIDENCE:',
      manualOffsetLabel: 'MANUAL OFFSET:',
      fig8Title: 'Wave Phone in Figure-8 Motion',
      fig8Desc: 'Gently wave your phone in a figure-8 pattern in the air 3 to 4 times to reset the internal magnetometer and clear local magnetic bias.',
      manualOffsetTitle: 'Manual Calibration Offset',
      calHint: 'Compensate for magnetic phone cases or fine-tune against an external reference needle.',
      zeroToNorthBtn: 'Set Current Heading as True Reference',
      resetOffset: 'Reset (0°)'
    },
    hi: {
      propertyResidential: "आवासीय वास्तु",
      propertyCommercial: "व्यावसायिक एवं खुदरा वास्तु",
      businessCategory: "व्यापार श्रेणी",
      commercialSuitability: "व्यावसायिक उपयुक्तता",
      businessImpact: "व्यापारिक प्रभाव",
      retailProfileApparel: "परिधान, रेशमी साड़ियाँ एवं बुटीक",
      retailProfileJewelry: "आभूषण एवं उच्च मूल्य खुदरा",
      retailProfileGeneral: "सामान्य कार्यालय एवं प्रतिष्ठान",
      plotShapeTitle: "व्यावसायिक भूखंड ज्यामिति",
      shermukhi: "शेरमुखी (सिंह मुखी भूखंड)",
      gaumukhi: "गोमुखी (गौ मुखी भूखंड)",
      commercialChecklist: "व्यावसायिक वास्तु अनुपालन सूची",
      ownerDeskCheck: "मालिक आसन (नैऋत्य में उत्तर/पूर्व मुख)",
      cashSafeCheck: "रोकड़ तिजोरी (नैऋत्य में उत्तर मुखी)",
      inventoryCheck: "शीघ्रगामी माल संचलन (वायव्य क्षेत्र)",
      fireElectricalCheck: "अग्नि एवं विद्युत सुरक्षा (आग्नेय क्षेत्र)",
      appName: 'कुबेरन वास्तु कंपास',
      brandSubtitle: 'सत्य उत्तर • वैदिक वास्तु शास्त्र संस्करण',
      simpleMode: 'साधारण कंपास',
      vastuMode: 'वास्तु कंपास',
      zones8: '8 दिशाएं',
      zones16: '16 महावास्तु',
      zones32: '32 पद द्वार',
      themeElemental: 'तत्व रंग',
      themeChakra: 'चक्र शैली',
      themeGold: 'स्वर्ण राजसी',
      toolsRoomFinder: 'कक्ष खोजक',
      toolsPlotTilt: 'भूखंड कोण (विदिशा)',
      toolsCamera: 'कैमरा एआर',
      toolsAudit: 'वास्तु रिपोर्ट',
      zoneInspector: 'वास्तु दिशा निरीक्षक',
      element: 'पंचतत्व',
      deity: 'दिक्पाल / देवता',
      favorableRooms: 'शुभ निर्माण',
      avoidPlacements: 'वर्जित निर्माण',
      entranceGradeA: '🌟 परम शुभ मुख्य द्वार',
      entranceGradeB: '⚠️ मध्यम / मिश्रित फल',
      entranceGradeC: '❌ दोषपूर्ण / वास्तु उपाय आवश्यक',
      degreeLabel: 'दिशा कोण',
      trueNorth: 'सत्य उत्तर (True North)',
      magNorth: 'चुंबकीय उत्तर (Magnetic)',
      pitch: 'पिच (झुकाव)',
      roll: 'रोल (समतलता)',
      targetBearing: 'लक्ष्य दिशा',
      lockBearing: 'दिशा लॉक करें',
      copyReport: 'रिपोर्ट कॉपी करें',
      shareReport: 'रिपोर्ट साझा करें',
      cameraNotice: 'कैमरा एआर सक्रिय। कमरे और दीवारों का निरीक्षण करने हेतु फोन घुमाएं।',
      vidishaAligned: 'सम-सूत्र (पूर्ण संरेखित भूखंड)',
      vidishaTilted: 'विदिशा (झुका हुआ भूखंड)',
      plotTiltHelp: 'अपने फोन को मुख्य दीवार या भूखंड की सीमा के समानांतर रखें।',
      switchLang: 'भाषा',
      installApp: 'ऐप इंस्टॉल करें',
      close: 'बंद करें',
      calibrate: 'कैलिब्रेट करें',
      calibrationTitle: 'कंपास कैलिब्रेशन',
      calibrationSub: 'हार्डवेयर मैग्नेटोमीटर एवं संरेखण',
      sensorStatusLabel: 'सेंसर स्थिति:',
      calibrationConfidence: 'सटीकता विश्वास:',
      manualOffsetLabel: 'मैन्युअल ऑफ़सेट:',
      fig8Title: 'फोन को 8 के आकार में घुमाएं',
      fig8Desc: 'आंतरिक मैग्नेटोमीटर को रीसेट करने और चुंबकीय प्रभाव दूर करने के लिए फोन को हवा में 3-4 बार 8 के आकार में धीरे-धीरे घुमाएं।',
      manualOffsetTitle: 'मैन्युअल कैलिब्रेशन ऑफ़सेट',
      calHint: 'चुंबकीय फोन कवर या बाहरी संदर्भ सुई के अनुसार सटीक समायोजन करें।',
      zeroToNorthBtn: 'वर्तमान दिशा को संदर्भ मान निर्धारित करें',
      resetOffset: 'रीसेट (0°)'
    },
    kn: {
      propertyResidential: "ವಸತಿ ವಾಸ್ತು",
      propertyCommercial: "ವಾಣಿಜ್ಯ ಮತ್ತು ಚಿಲ್ಲರೆ ವಾಸ್ತು",
      businessCategory: "ವ್ಯವಹಾರ ಪ್ರಕಾರ",
      commercialSuitability: "ವಾಣಿಜ್ಯ ಸೂಕ್ತತೆ",
      businessImpact: "ವ್ಯವಹಾರ ಪ್ರಭಾವ",
      retailProfileApparel: "ವಸ್ತ್ರಗಳು, ರೇಷ್ಮೆ ಸೀರೆಗಳು ಮತ್ತು ಬುಟೀಕ್",
      retailProfileJewelry: "ಆಭರಣಗಳು ಮತ್ತು ಬೆಲೆಬಾಳುವ ವ್ಯಾಪಾರ",
      retailProfileGeneral: "ಸಾಮಾನ್ಯ ಕಚೇರಿಗಳು ಮತ್ತು ಮಳಿಗೆಗಳು",
      plotShapeTitle: "ವಾಣಿಜ್ಯ ನಿವೇಶನ ಆಕಾರ",
      shermukhi: "ಶೇರ್ಮುಖಿ (ಸಿಂಹ ಮುಖ)",
      gaumukhi: "ಗೋಮುಖಿ (ಗೋ ಮುಖ)",
      commercialChecklist: "ವಾಣಿಜ್ಯ ವಾಸ್ತು ಅನುಸರಣೆ ಪರಿಶೀಲನಾಪಟ್ಟಿ",
      ownerDeskCheck: "ಮಾಲೀಕರ ಆಸನ (ನೈಋತ್ಯದಲ್ಲಿ ಉತ್ತರ/ಪೂರ್ವ ಮುಖ)",
      cashSafeCheck: "ನಗದು ತಿಜೋರಿ (ನೈಋತ್ಯದಲ್ಲಿ ಉತ್ತರಕ್ಕೆ ತೆರೆಯುವುದು)",
      inventoryCheck: "ವೇಗದ ಸರಕು ಚಲನೆ (ವಾಯುವ್ಯ ವಲಯ)",
      fireElectricalCheck: "ವಿದ್ಯುತ್ ಮತ್ತು ಅಗ್ನಿ ಸುರಕ್ಷತೆ (ಆಗ್ನೇಯ ವಲಯ)",
      appName: 'ಕುಬೇರನ್ ವಾಸ್ತು ದಿಕ್ಸೂಚಿ',
      brandSubtitle: 'ನಿಜವಾದ ಉತ್ತರ • ವೈದಿಕ ವಾಸ್ತು ಶಾಸ್ತ್ರ ಆವೃತ್ತಿ',
      simpleMode: 'ಸರಳ ದಿಕ್ಸೂಚಿ',
      vastuMode: 'ವಾಸ್ತು ದಿಕ್ಸೂಚಿ',
      zones8: '8 ದಿಕ್ಕುಗಳು',
      zones16: '16 ಮಹಾವಾಸ್ತು',
      zones32: '32 ಪದ ದ್ವಾರಗಳು',
      themeElemental: 'ಪಂಚಭೂತ',
      themeChakra: 'ಚಕ್ರ ಶೈಲಿ',
      themeGold: 'ರಾಜ ವೈಭವ ಗೋಲ್ಡ್',
      toolsRoomFinder: 'ಕೋಣೆ ಮಾರ್ಗದರ್ಶಿ',
      toolsPlotTilt: 'ನಿವೇಶನ ಕೋನ (ವಿದಿಶಾ)',
      toolsCamera: 'ಕ್ಯಾಮೆರಾ ಎಆರ್',
      toolsAudit: 'ವಾಸ್ತು ವರದಿ',
      zoneInspector: 'ವಾಸ್ತು ದಿಕ್ಕು ಪರೀಕ್ಷಕ',
      element: 'ಪಂಚಭೂತ ತತ್ವ',
      deity: 'ಅಧಿಪತಿ ದೇವರು',
      favorableRooms: 'ಅತ್ಯಂತ ಶುಭ ಸ್ಥಳಗಳು',
      avoidPlacements: 'ವರ್ಜ್ಯ ಸ್ಥಳಗಳು',
      entranceGradeA: '🌟 ಅತ್ಯಂತ ಶುಭ ಪ್ರವೇಶದ್ವಾರ',
      entranceGradeB: '⚠️ ಸಾಮಾನ್ಯ ಫಲಿತಾಂಶ',
      entranceGradeC: '❌ ದೋಷಪೂರಿತ / ಪರಿಹಾರ ಅಗತ್ಯ',
      degreeLabel: 'ಕೋನ',
      trueNorth: 'ನಿಜವಾದ ಉತ್ತರ (True North)',
      magNorth: 'ಕಾಂತೀಯ ಉತ್ತರ (Magnetic)',
      pitch: 'ಪಿಚ್',
      roll: 'ರೋಲ್',
      targetBearing: 'ಗುರಿ ದಿಕ್ಕು',
      lockBearing: 'ದಿಕ್ಕು ಲಾಕ್ ಮಾಡಿ',
      copyReport: 'ವರದಿ ಪ್ರತಿಮಾಡಿ',
      shareReport: 'ವರದಿ ಹಂಚಿಕೊಳ್ಳಿ',
      cameraNotice: 'ಕ್ಯಾಮೆರಾ ಎಆರ್ ಸಕ್ರಿಯವಾಗಿದೆ. ಕೊಠಡಿ ಪರೀಕ್ಷಿಸಲು ಮೊಬೈಲ್ ತಿರುಗಿಸಿ.',
      vidishaAligned: 'ಸಮ-ಸೂತ್ರ (ನೇರ ನಿವೇಶನ)',
      vidishaTilted: 'ವಿದಿಶಾ (ಓರೆಯಾದ ನಿವೇಶನ)',
      plotTiltHelp: 'ಫೋನನ್ನು ಮುಂಭಾಗದ ಗೋಡೆ ಅಥವಾ ನಿವೇಶನದ ರೇಖೆಗೆ ಸಮಾನಾಂತರವಾಗಿ ಇಡಿ.',
      switchLang: 'ಭಾಷೆ',
      installApp: 'ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ',
      close: 'ಮುಚ್ಚಿ',
      calibrate: 'ಕ್ಯಾಲಿಬ್ರೇಟ್',
      calibrationTitle: 'ದಿಕ್ಸೂಚಿ ಕ್ಯಾಲಿಬ್ರೇಶನ್',
      calibrationSub: 'ಹಾರ್ಡ್‌ವೇರ್ ಮ್ಯಾಗ್ನೆಟೋಮೀಟರ್ ಮತ್ತು ಜೋಡಣೆ',
      sensorStatusLabel: 'ಸೆನ್ಸರ್ ಸ್ಥಿತಿ:',
      calibrationConfidence: 'ನಿಖರತೆಯ ವಿಶ್ವಾಸ:',
      manualOffsetLabel: 'ಮ್ಯಾನುಯಲ್ ಆಫ್‌ಸೆಟ್:',
      fig8Title: 'ಫೋನ್ ಅನ್ನು 8 ಆಕಾರದಲ್ಲಿ ತಿರುಗಿಸಿ',
      fig8Desc: 'ಆಂತರಿಕ ಮ್ಯಾಗ್ನೆಟೋಮೀಟರ್ ಮರುಹೊಂದಿಸಲು ಮತ್ತು ಕಾಂತೀಯ ಅಡಚಣೆ ನಿವಾರಿಸಲು ಫೋನ್ ಅನ್ನು ಗಾಳಿಯಲ್ಲಿ 3-4 ಬಾರಿ 8 ರ ಆಕಾರದಲ್ಲಿ ನಿಧಾನವಾಗಿ ತಿರುಗಿಸಿ.',
      manualOffsetTitle: 'ಮ್ಯಾನುಯಲ್ ಕ್ಯಾಲಿಬ್ರೇಶನ್ ಆಫ್‌ಸೆಟ್',
      calHint: 'ಕಾಂತೀಯ ಮೊಬೈಲ್ ಕವರ್‌ಗಳ ಪ್ರಭಾವ ಸರಿಹೊಂದಿಸಲು ಅಥವಾ ಬಾಹ್ಯ ಸೂಜಿಯೊಂದಿಗೆ ಹೊಂದಾಣಿಕೆ ಮಾಡಲು ಬಳಸಿ.',
      zeroToNorthBtn: 'ಪ್ರಸ್ತುತ ದಿಕ್ಕನ್ನು ಮುಖ್ಯ ಉಲ್ಲೇಖವಾಗಿ ನಿಗದಿಪಡಿಸಿ',
      resetOffset: 'ಮರುಹೊಂದಿಸಿ (0°)'
    },
    ta: {
      propertyResidential: "குடியிருப்பு வாஸ்து",
      propertyCommercial: "வணிக & சில்லறை வாஸ்து",
      businessCategory: "வணிகப் பிரிவு",
      commercialSuitability: "வணிகப் பொருத்தம்",
      businessImpact: "வணிக வளர்ச்சி பலன்",
      retailProfileApparel: "ஆடைகள், பட்டுப் புடவைகள் & பொட்டிக்குகள்",
      retailProfileJewelry: "நகைகள் & உயர்மதிப்பு சில்லறை விற்பனை",
      retailProfileGeneral: "பொது அலுவலகங்கள் & கடைகள்",
      plotShapeTitle: "வணிக மனையின் வடிவியல்",
      shermukhi: "சிங்க முகம் (முன்புறம் அகலம்)",
      gaumukhi: "பசு முகம் (முன்புறம் குறுகியது)",
      commercialChecklist: "வணிக வாஸ்து தணிக்கை பட்டியல்",
      ownerDeskCheck: "உரிமையாளர் அமர்வு (தென்மேற்கில் வடக்கு/கிழக்கு நோக்கி)",
      cashSafeCheck: "பணப்பெட்டி (தென்மேற்கில் வடக்கு நோக்கி திறத்தல்)",
      inventoryCheck: "சுழலும் சரக்கு விற்பனை (வடமேற்கு பகுதி)",
      fireElectricalCheck: "மின்சாரம் மற்றும் தீ பாதுகாப்பு (தென்கிழக்கு பகுதி)",
      appName: 'குபேரன் வாஸ்து திசைகாட்டி',
      brandSubtitle: 'உண்மை வடக்கு • வேத வாஸ்து சாஸ்திர பதிப்பு',
      simpleMode: 'எளிய திசைகாட்டி',
      vastuMode: 'வாஸ்து திசைகாட்டி',
      zones8: '8 திசைகள்',
      zones16: '16 மஹாவாஸ்து',
      zones32: '32 பாத வாசல்கள்',
      themeElemental: 'பூத நிறங்கள்',
      themeChakra: 'சக்கர வடிவம்',
      themeGold: 'ராஜ தங்க வடிவம்',
      toolsRoomFinder: 'அறை வழிகாட்டி',
      toolsPlotTilt: 'மனை கோணம் (விதிஷா)',
      toolsCamera: 'கேமரா ஏஆர்',
      toolsAudit: 'வாஸ்து அறிக்கை',
      zoneInspector: 'வாஸ்து திசை ஆய்வாளர்',
      element: 'பஞ்சபூதம்',
      deity: 'அதிபதி தெய்வம்',
      favorableRooms: 'மிகச் சிறந்த அமைப்புகள்',
      avoidPlacements: 'தவிர்க்க வேண்டியவை',
      entranceGradeA: '🌟 மிக மங்களகரமான தலைவாசல்',
      entranceGradeB: '⚠️ கலவையான பலன்',
      entranceGradeC: '❌ தோஷம் / வாஸ்து பரிகாரம் தேவை',
      degreeLabel: 'கோணம்',
      trueNorth: 'உண்மை வடக்கு (True North)',
      magNorth: 'காந்த வடக்கு (Magnetic)',
      pitch: 'முன்-பின் சாய்வு',
      roll: 'இட-வல சமநிலை',
      targetBearing: 'இலக்கு திசை',
      lockBearing: 'திசையை பூட்டு',
      copyReport: 'அறிக்கையை நகலெடு',
      shareReport: 'பகிர்',
      cameraNotice: 'கேமரா ஏஆர் இயங்குகிறது. அறைகளை ஆய்வு செய்ய போனை சுழற்றவும்.',
      vidishaAligned: 'சம-சூத்ரா (நேரான மனை)',
      vidishaTilted: 'விதிஷா (கோணலான மனை)',
      plotTiltHelp: 'உங்கள் போனை முன் சுவர் அல்லது மனை எல்லையில் நேராக வைக்கவும்.',
      switchLang: 'மொழி',
      installApp: 'செயலியை நிறுவுங்கள்',
      close: 'மூடு',
      calibrate: 'அளவீடு (Calibrate)',
      calibrationTitle: 'திசைகாட்டி அளவீடு',
      calibrationSub: 'மேக்னடோமீட்டர் சென்சார் & துல்லிய சீரமைப்பு',
      sensorStatusLabel: 'சென்சார் நிலை:',
      calibrationConfidence: 'துல்லிய நம்பிக்கை:',
      manualOffsetLabel: 'கைமுறை ஆஃப்செட்:',
      fig8Title: 'போனை 8 வடிவில் சுழற்றவும்',
      fig8Desc: 'உட்புற மேக்னடோமீட்டரை மீட்டமைக்கவும் காந்தக் குறுக்கீட்டை நீக்கவும் போனை காற்றில் 3-4 முறை எட்டு (8) வடிவில் மெதுவாக அசைக்கவும்.',
      manualOffsetTitle: 'கைமுறை அளவீட்டு ஆஃப்செட்',
      calHint: 'காந்த மொபைல் கவர்களால் ஏற்படும் பிழையை சரிசெய்ய அல்லது துல்லியமாக சீரமைக்க உதவும்.',
      zeroToNorthBtn: 'தற்போதைய திசையை மூலக் குறியீடாக அமை',
      resetOffset: 'மீட்டமை (0°)'
    },
    te: {
      propertyResidential: "నివాస వాస్తు",
      propertyCommercial: "వాణిజ్య & రిటైల్ వాస్తు",
      businessCategory: "వ్యాపార విభాగం",
      commercialSuitability: "వాణిజ్య అనుకూలత",
      businessImpact: "వ్యాపార వృద్ధి ఫలితాలు",
      retailProfileApparel: "వస్త్రాలు, పట్టుచీరలు & బోటిక్‌లు",
      retailProfileJewelry: "ఆభరణాలు & విలువైన వస్తువుల వ్యాపారం",
      retailProfileGeneral: "సాధారణ వాణిజ్య కార్యాలయాలు & దుకాణాలు",
      plotShapeTitle: "వాణిజ్య స్థలాల ఆకారం",
      shermukhi: "సింహముఖి (ముందు వెడల్పు)",
      gaumukhi: "గోముఖి (ముందు ఇరుకు)",
      commercialChecklist: "వాణిజ్య వాస్తు పరిశీలన జాబితా",
      ownerDeskCheck: "యజమాని ఆసనం (నైరుతిలో ఉత్తరం/తూర్పు ముఖంగా)",
      cashSafeCheck: "ధన లాకర్ (నైరుతిలో ఉత్తరం వైపు తెరుచుకునేలా)",
      inventoryCheck: "సరుకుల వేగవంతమైన రవాణా (వాయువ్య విభాగం)",
      fireElectricalCheck: "విద్యుత్ & అగ్ని భద్రత (ఆగ్నేయ విభాగం)",
      appName: 'కుబేరన్ వాస్తు దిక్సూచి',
      brandSubtitle: 'నిజమైన ఉత్తరం • వేద వాస్తు శాస్త్ర ఎడిషన్',
      simpleMode: 'సాధారణ దిక్సూచి',
      vastuMode: 'వాస్తు దిక్సూచి',
      zones8: '8 దిక్కులు',
      zones16: '16 మహావాస్తు',
      zones32: '32 పద ద్వారాలు',
      themeElemental: 'పంచభూతాలు',
      themeChakra: 'చక్ర శైలి',
      themeGold: 'రాజసం గోల్డ్',
      toolsRoomFinder: 'గదుల మార్గదర్శి',
      toolsPlotTilt: 'ప్లాట్ కోణం (విదిశ)',
      toolsCamera: 'కెమెరా ఏఆర్',
      toolsAudit: 'వాస్తు నివేదిక',
      zoneInspector: 'వాస్తు దిశా పరిశీలన',
      element: 'పంచభూత తత్త్వం',
      deity: 'పాలక దైవం',
      favorableRooms: 'అనుకూల స్థానాలు',
      avoidPlacements: 'వర్జ్య స్థానాలు',
      entranceGradeA: '🌟 అత్యంత శుభప్రదమైన సింహద్వారం',
      entranceGradeB: '⚠️ మధ్యస్థ / మిశ్రమ ఫలితం',
      entranceGradeC: '❌ దోషం / వాస్తు నివారణ అవసరం',
      degreeLabel: 'కోణం',
      trueNorth: 'నిజమైన ఉత్తరం (True North)',
      magNorth: 'అయస్కాంత ఉత్తరం (Magnetic)',
      pitch: 'పిచ్',
      roll: 'రోల్',
      targetBearing: 'లక్ష్య దిశ',
      lockBearing: 'దిశను లాక్ చేయండి',
      copyReport: 'నివేదిక కాపీ చేయండి',
      shareReport: 'షేర్ చేయండి',
      cameraNotice: 'కెమెరా ఏఆర్ ఆన్‌లో ఉంది. గదులను పరీక్షించడానికి ఫోన్ తిప్పండి.',
      vidishaAligned: 'సమ-సూత్ర (సరిసమాన ప్లాట్)',
      vidishaTilted: 'విదిశ (వాలుగా ఉన్న ప్లాట్)',
      plotTiltHelp: 'ఫోన్‌ను గోడ లేదా ప్లాట్ సరిహద్దుకు సమాంతరంగా ఉంచండి.',
      switchLang: 'భాష',
      installApp: 'యాప్ ఇన్‌స్టాల్ చేసుకోండి',
      close: 'మూసివేయి',
      calibrate: 'క్యాలిబ్రేట్',
      calibrationTitle: 'దిక్సూచి క్యాలిబ్రేషన్',
      calibrationSub: 'హార్డ్‌వేర్ మాగ్నెటోమీటర్ & సమలేఖనం',
      sensorStatusLabel: 'సెన్సార్ స్థితి:',
      calibrationConfidence: 'ఖచ్చితత్వ విశ్వాసం:',
      manualOffsetLabel: 'మాన్యువల్ ఆఫ్‌సెట్:',
      fig8Title: 'ఫోన్‌ను 8 ఆకారంలో తిప్పండి',
      fig8Desc: 'అంతర్గత మాగ్నెటోమీటర్‌ను రీసెట్ చేయడానికి మరియు అయస్కాంత అంతరాయాన్ని తొలగించడానికి ఫోన్‌ను గాలిలో 3-4 సార్లు 8 ఆకారంలో నెమ్మదిగా తిప్పండి.',
      manualOffsetTitle: 'మాన్యువల్ క్యాలిబ్రేషన్ ఆఫ్‌సెట్',
      calHint: 'అయస్కాంత మొబైల్ కవర్ల ప్రభావాన్ని సరిచేయడానికి లేదా బాహ్య సూచికతో సమలేఖనం చేయడానికి ఉపయోగించండి.',
      zeroToNorthBtn: 'ప్రస్తుత దిశను ప్రామాణికంగా సెట్ చేయండి',
      resetOffset: 'రీసెట్ (0°)'
    }
  }
};

// Export for ES modules and window globals
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VASTU_DATA;
}
