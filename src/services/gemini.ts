const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-1.5-flash';

const LANG_NAMES: Record<string, string> = {
  en: 'English', kn: 'Kannada', hi: 'Hindi', ta: 'Tamil',
};

function sysPrompt(lang: string) {
  return `You are an expert Smart Agriculture AI assistant for Indian farmers. Respond ONLY in ${LANG_NAMES[lang] ?? 'English'}. Keep answers practical, concise (3-5 sentences), specific to Indian farming. Topics: crop diseases, soil, irrigation, fertilizers, pesticides, weather-based advice, market trends. Suggest organic alternatives where possible.`;
}

export async function callGemini(userPrompt: string, language: string): Promise<string> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return mockAdvisory(userPrompt, language);
  }
  try {
    const res = await fetch(`${BASE}/${MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: sysPrompt(language) }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
      }),
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response.';
  } catch {
    return mockAdvisory(userPrompt, language);
  }
}

export interface LeafDiagnosis {
  disease: string;
  confidence: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'None';
  description: string;
  steps: string[];
}

export async function callGeminiVision(base64: string, mime: string, language: string): Promise<LeafDiagnosis> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return mockLeaf();
  }
  const prompt = `Analyze this leaf image for plant diseases. Respond in ${LANG_NAMES[language] ?? 'English'}. Return ONLY valid JSON with fields: disease, confidence (e.g. "94.2%"), severity (Mild|Moderate|Severe|None), description, steps (array of 4 strings). No markdown.`;
  try {
    const res = await fetch(`${BASE}/${MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mime, data: base64 } }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 600 },
      }),
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return JSON.parse(raw.replace(/```json|```/g, '').trim()) as LeafDiagnosis;
  } catch {
    return mockLeaf();
  }
}

export async function callGeminiCrops(ph: number, n: number, p: number, k: number, language: string): Promise<string> {
  return callGemini(`Soil: pH=${ph}, N=${n}mg/kg, P=${p}mg/kg, K=${k}mg/kg. List 3-4 best crops with brief planting tips each for Indian farming.`, language);
}

function mockAdvisory(prompt: string, lang: string): string {
  const p = prompt.toLowerCase();
  const r: Record<string, string[]> = {
    en: [
      'Water your crops early morning (6–8 AM) to reduce evaporation. Skip watering if rain is expected. Use drip irrigation for best efficiency.',
      'Apply neem oil (5ml/L) as a safe organic pesticide. For severe infestations use Chlorpyrifos 20EC at recommended dosage. Always spray in the evening.',
      'Add organic compost 2–3 tonnes/acre before sowing. Maintain pH 6.0–7.0 for optimal nutrient uptake. Test soil every season.',
      'Yellowing leaves often indicate nitrogen deficiency. Apply urea at 50 kg/acre or organic compost rich in nitrogen.',
      'Monitor weather forecasts daily. Apply mulching to retain moisture during dry spells. Watch for fungal diseases when humidity exceeds 75%.',
      'I can advise on crop diseases, soil health, irrigation, pesticides, and market prices. Please describe your specific farming challenge.',
    ],
    kn: ['ನಿಮ್ಮ ಬೆಳೆಗಳಿಗೆ ಬೆಳಿಗ್ಗೆ 6-8 ಗಂಟೆಯ ನಡುವೆ ನೀರು ಹಾಕಿ. ಮಳೆ ನಿರೀಕ್ಷಿಸಲ್ಪಟ್ಟರೆ ನೀರಾವರಿ ಬಿಡಿ.', 'ನೀಮ್ ಎಣ್ಣೆ 5ml/L ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ. ಸಂಜೆ ಹೊತ್ತು ಸಿಂಪಡಿಸಿ.', 'ಮಣ್ಣಿಗೆ ಸಾವಯವ ಗೊಬ್ಬರ 2-3 ಟನ್/ಎಕರೆ ಹಾಕಿ. pH 6.0-7.0 ನಿರ್ವಹಿಸಿ.', 'ಹಳದಿ ಎಲೆಗಳು ಸಾರಜನಕ ಕೊರತೆ ಸೂಚಿಸುತ್ತವೆ. ಯೂರಿಯಾ 50 ಕಿಗ್ರಾ/ಎಕರೆ ಹಾಕಿ.', 'ದೈನಂದಿನ ಹವಾಮಾನ ಮಾಹಿತಿ ಗಮನಿಸಿ. ತೇವಾಂಶ 75% ಮೀರಿದರೆ ಶಿಲೀಂಧ್ರ ರೋಗ ಎಚ್ಚರಿಕೆ.', 'ನಾನು ಬೆಳೆ ರೋಗ, ಮಣ್ಣು, ನೀರಾವರಿ ಸಲಹೆ ನೀಡಬಲ್ಲೆ.'],
    hi: ['फसलों को सुबह 6-8 बजे पानी दें। बारिश की उम्मीद हो तो सिंचाई छोड़ें।', 'नीम का तेल 5ml/L में मिलाकर छिड़कें। शाम को छिड़काव करें।', 'बुवाई से पहले 2-3 टन/एकड़ जैविक खाद डालें। pH 6.0-7.0 बनाए रखें।', 'पीले पत्ते नाइट्रोजन की कमी दर्शाते हैं। 50 किग्रा/एकड़ यूरिया डालें।', 'दैनिक मौसम पूर्वानुमान देखें। नमी 75% से अधिक होने पर फंगल रोग की निगरानी करें।', 'मैं फसल रोग, मिट्टी, सिंचाई और बाजार भाव पर सलाह दे सकता हूं।'],
    ta: ['பயிர்களுக்கு காலை 6-8 மணிக்கு நீர் பாய்ச்சுங்கள். மழை எதிர்பார்க்கப்பட்டால் நீர்ப்பாசனம் தவிர்க்கவும்.', 'வேப்பெண்ணெய் 5ml/L கலந்து தெளிக்கவும். மாலையில் தெளிக்கவும்.', 'விதைப்பதற்கு முன் 2-3 டன்/ஏக்கர் கரிம உரம் இடுங்கள். pH 6.0-7.0 பராமரிக்கவும்.', 'மஞ்சள் இலைகள் நைட்ரஜன் குறைபாட்டை காட்டுகின்றன. 50 கி.கி./ஏக்கர் யூரியா இடுங்கள்.', 'தினசரி வானிலை முன்னறிவிப்பு கண்காணிக்கவும். ஈரப்பதம் 75% தாண்டினால் பூஞ்சாண் நோய் கவனிக்கவும்.', 'பயிர் நோய், மண், நீர்ப்பாசனம் குறித்து ஆலோசனை வழங்க முடியும்.'],
  };
  const msgs = r[lang] ?? r.en;
  if (p.includes('water') || p.includes('irrigat') || p.includes('நீர்') || p.includes('नीर') || p.includes('ನೀರು')) return msgs[0];
  if (p.includes('pest') || p.includes('insect') || p.includes('bug') || p.includes('கீட') || p.includes('कीट') || p.includes('ಕೀಟ')) return msgs[1];
  if (p.includes('soil') || p.includes('ph') || p.includes('மண்') || p.includes('मिट्टी') || p.includes('ಮಣ್ಣು')) return msgs[2];
  if (p.includes('yellow') || p.includes('nutrient') || p.includes('nitrogen') || p.includes('ஊட்ட') || p.includes('पोषण')) return msgs[3];
  if (p.includes('weather') || p.includes('rain') || p.includes('வான') || p.includes('मौसम') || p.includes('ಹವಾ')) return msgs[4];
  return msgs[5];
}

function mockLeaf(): LeafDiagnosis {
  const cases: LeafDiagnosis[] = [
    { disease: 'Tomato Early Blight (Alternaria solani)', confidence: '94.8%', severity: 'Moderate', description: 'Fungal disease causing dark spots with concentric rings. Spreads in warm, humid conditions.', steps: ['Remove infected leaves immediately.', 'Apply copper fungicide every 7–10 days.', 'Use drip irrigation to keep foliage dry.', 'Rotate crops for 2–3 seasons.'] },
    { disease: 'Rice Blast (Magnaporthe oryzae)', confidence: '91.2%', severity: 'Severe', description: 'Devastating fungal disease causing spindle-shaped lesions on leaves. Can cause 70–80% yield loss.', steps: ['Apply Tricyclazole 75WP at 0.6g/L immediately.', 'Drain standing water for 3–5 days.', 'Avoid excess nitrogen fertilizer.', 'Plant blast-resistant varieties next season.'] },
    { disease: 'Healthy Leaf ✓', confidence: '98.5%', severity: 'None', description: 'The leaf appears healthy with no signs of disease or pest damage.', steps: ['Continue current schedule.', 'Monitor weekly for pests.', 'Maintain balanced NPK fertilization.', 'Apply preventive neem oil monthly.'] },
  ];
  return cases[Math.floor(Math.random() * cases.length)];
}
