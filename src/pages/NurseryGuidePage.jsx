import { useState, useRef, useEffect } from 'react';
import { Globe, BookOpen, Sparkles, FolderLock, Leaf } from 'lucide-react';
import './NurseryGuidePage.css';

const HINDI_STATES = [
  'Bihar',
  'Delhi',
  'Uttar Pradesh',
  'Madhya Pradesh',
  'Rajasthan',
  'Haryana',
  'Himachal Pradesh',
  'Chhattisgarh',
  'Jharkhand',
  'Uttarakhand'
];

const TABS = [
  { id: 'nursery', label: 'Nursery Plants', icon: BookOpen, active: true },
  { id: 'orchards', label: 'Orchards & Fruits', icon: Leaf, active: false, desc: 'Dosage recommendations, soil preparation guide, and organic feeding cycles for Mango, Pomegranate, Citrus, and Banana crops.' },
  { id: 'plantations', label: 'Tea & Coffee Plantations', icon: Leaf, active: false, desc: 'Specialized application guidelines for high-altitude plantation estates, soil conditioning, and organic yield optimization.' },
  { id: 'field', label: 'Field & Vegetable Crops', icon: Leaf, active: false, desc: 'High-volume application charts for Sugarcane, Cotton, Paddy, and commercial vegetable cultivation.' }
];

const translations = {
  hi: {
    heroEyebrow: "नर्सरी केयर गाइड",
    heroTitle: "नर्सरी पौधों के लिए एफओएम उपयोग गाइड",
    heroDesc: "किण्वित जैविक खाद (FOM) — आपकी नर्सरी के पौधों के स्वस्थ और समान विकास के लिए सही मात्रा, चरण-दर-चरण उपयोग विधि, और समस्या निवारण।",
    sec1Title: "त्वरित खुराक तालिका",
    thAge: "पौधे की आयु",
    thSize: "कंटेनर / पॉलीबैग का आकार",
    thQty: "FOM मात्रा (प्रति पौधा)",
    thEq: "मुट्ठी / चम्मच का अनुमान",
    thFreq: "खुराक की आवृत्ति",
    row1Age: "1–3 महीने<br><span style='font-weight:400;color:var(--ink-soft);font-size:11px;'>अंकुर / छोटे पौधे</span>",
    row1Size: "4–6 इंच बैग / गमला",
    row1Qty: "15–25 ग्राम",
    row1Eq: "1 छोटी मुट्ठी (1–2 बड़े चम्मच)",
    row1Freq: "हर 30–45 दिन में",
    row2Age: "4–6 महीने<br><span style='font-weight:400;color:var(--ink-soft);font-size:11px;'>सक्रिय विकास अवधि</span>",
    row2Size: "6–8 इंच बैग / गमला",
    row2Qty: "30–50 ग्राम",
    row2Eq: "1 से 2 सामान्य मुट्ठी",
    row2Freq: "हर 30–45 दिन में",
    row3Age: "7–12 महीने<br><span style='font-weight:400;color:var(--ink-soft);font-size:11px;'>अर्ध-परिपक्व पौधे</span>",
    row3Size: "8–12+ इंच बैग / गमला",
    row3Qty: "60–100 ग्राम",
    row3Eq: "2 से 3 बड़ी मुट्ठी",
    row3Freq: "हर 45–60 दिन में",
    noteBox: "<b>महत्वपूर्ण नोट:</b> सक्रिय विकास के मौसम (मानसून और गर्मी) के दौरान इस नियमित खुराक चक्र को बनाए रखें। कड़ाके की ठंड के दौरान या जब पौधे सुप्त अवस्था में प्रवेश करते हैं, तो आवृत्ति को 60 दिन में एक बार कर दें।",
    sec2Title: "थोक मात्रा की गणना <span style='font-size:13px;color:var(--ink-soft);font-weight:400;'>(1 लाख / 100,000 पौधों के लिए)</span>",
    bulkLabel1: "केवल छोटे पौधों के लिए (1–3 महीने)",
    bulkAmount1: "1.5 – 2.5 मीट्रिक टन",
    bulkBags1: "50 किलोग्राम की 30 से 50 वाणिज्यिक बोरियाँ",
    bulkLabel2: "केवल मध्यम पौधों के लिए (4–6 महीने)",
    bulkAmount2: "3.0 – 5.0 मीट्रिक टन",
    bulkBags2: "50 किलोग्राम की 60 से 100 वाणिज्यिक बोरियाँ",
    bulkLabel3: "केवल अर्ध-परिपक्व पौधों के लिए (7–12 महीने)",
    bulkAmount3: "6.0 – 10.0 मीट्रिक टन",
    bulkBags3: "50 किलोग्राम की 120 से 200 वाणिज्यिक बोरियाँ",
    bulkLabel4: "मानक मिश्रित नर्सरी स्टॉक (औसत मिश्रण)",
    bulkAmount4: "4.0 – 5.0 मीट्रिक टन",
    bulkBags4: "50 किलोग्राम की 80 से 100 वाणिज्यिक बोरियाँ",
    sec3Title: "चरण-दर-चरण उपयोग विधि",
    sec3Intro: "अधिकतम पोषक तत्व अवशोषण और मुफ़्त जड़ क्षति सुनिश्चित करने के लिए, नर्सरी श्रमिकों को प्रत्येक पॉलीबैग या गमले के लिए इन चार चरणों का कड़ाई से पालन करना चाहिए:",
    step1Title: "ऊपरी मिट्टी को ढीला करें (तैयारी)",
    step1Desc: "एक छोटे निराई कांटे या ट्रॉवेल का उपयोग करके पॉलीबैग के किनारे की ऊपरी 1 इंच मिट्टी को धीरे से खुरचें और ढीला करें। मुख्य सफेद पोषक जड़ों को काटने या तनाव देने से बचने के लिए केंद्र के पास गहरा न खोदें।",
    step2Title: "\"बाहरी रिंग\" नियम (उपयोग)",
    step2Desc: "कंटेनर की बाहरी सीमा पर ही मापी गई मुट्ठी भर FOM छिड़कें।",
    step2Crit: "महत्वपूर्ण: खाद और तने के बीच अनिवार्य 1-इंच का अंतर रखें",
    step3Title: "मिश्रण और कवर (संरक्षण)",
    step3Desc: "ढीली की गई ऊपरी मिट्टी की परत में डाले गए FOM को हल्के से मिलाएं। यदि उपलब्ध हो, तो लाभकारी रोगाणुओं को सीधे, तेज धूप से बचाने के लिए उस पर सूखी मिट्टी या कोको-पीट की एक बहुत पतली परत फैलाएं।",
    step4Title: "तत्काल पानी देना (सक्रियण)",
    step4Desc: "खाद डालने के तुरंत बाद पौधे में धीरे से पानी डालें। नमी FOM के भीतर माइक्रोबियल जीवन को सक्रिय करती है और पोषक तत्वों को जड़ों में घोलकर नीचे बहने देती है।",
    figCap: "नियંત્રण समूह (स्वस्थ) बनाम उपचार समूह (खाद जलन)। खाद और तने के बीच 1-इंच का अंतर सुनिश्चित करें।",
    sec4Title: "समस्या निवारण के लिए नैदानिक गाइड",
    trouble1Title: "A. बिना सड़ी हुई खाद से जड़ सड़ना (Root Rot)",
    trouble1SymLabel: "लक्षण",
    trouble1SymVal: "पत्तियों का मुरझाना, तनों का गिरना, कमजोर क्षतिग्रस्त जड़ें (जड़ सड़न)।",
    trouble1CauseLabel: "मूल कारण",
    trouble1CauseVal: "सीधे जड़ क्षेत्र पर ताजा या बिना पकी हुई खाद लगाना।",
    trouble1SolLabel: "समाधान",
    trouble1SolVal: "हमेशा FOM को मिट्टी के साथ मिलाएं और अंतर रखें। पूरी तरह से पकी हुई FOM का उपयोग करें।",
    trouble2Title: "B. नाइट्रोजन की कमी का निदान",
    trouble2SymLabel: "लक्षण",
    trouble2SymVal: "पुरानी पत्तियों से शुरू होने वाला एकसमान पीलापन (क्लोरोसिस), फीका पड़ा हुआ रूप, धीमी वृद्धि, पतले कमजोर तने।",
    trouble2CauseLabel: "मूल कारण",
    trouble2CauseVal: "मिट्टी के मिश्रण में अपर्याप्त नाइट्रोजन।",
    trouble2SolLabel: "समाधान",
    trouble2SolVal: "खुराक गाइड के अनुसार FOM लगाएं। मिट्टी के साथ अच्छी तरह मिलाएं।",
    trouble3Title: "C. तना सड़न / डैम्पिंग ऑफ",
    trouble3SymLabel: "लक्षण",
    trouble3SymVal: "मिट्टी की रेखा पर काला पड़ना, तने के आधार पर संरचनात्मक क्षय, पौधे का गिरना।",
    trouble3CauseLabel: "मूल कारण",
    trouble3CauseVal: "गीली खाद सीधे मुख्य तने के सामने जमा हो गई।",
    trouble3SolLabel: "समाधान",
    trouble3SolVal: "खाद और तने के बीच अनिवार्य 1-इंच का अंतर रखें। तने पर गीलापन न रहने दें।"
  },
  gu: {
    heroEyebrow: "નર્સરી કેર ગાઇડ",
    heroTitle: "નર્સરી છોડ માટે એફઓએમ એપ્લિકેશન ગાઇડ",
    heroDesc: "આથોવાળું ઓર્ગેનિક ખાતર (FOM) — તમારા નર્સરી છોડના તંદુરસ્ત અને સમાન વિકાસ માટે યોગ્ય માત્રા, પગલું-દર-પગલું ઉપયોગ કરવાની પદ્ધતિ અને મુશ્કેલીનિવારણ.",
    sec1Title: "ઝડપી ડોઝ ચાર્ટ",
    thAge: "છોડની ઉંમર",
    thSize: "કન્ટેનર / પોલીબેગ સાઈઝ",
    thQty: "FOM જથ્થો (છોડ દીઠ)",
    thEq: "મુઠ્ઠી / ચમચી અંદાજ",
    thFreq: "ખાતર આપવાની આવર્તન",
    row1Age: "1-3 મહિના<br><span style='font-weight:400;color:var(--ink-soft);font-size:11px;'>રોપાઓ / નાના છોડ</span>",
    row1Size: "4–6 ઇંચ બેગ / કુંડો",
    row1Qty: "15–25 ગ્રામ",
    row1Eq: "1 નાની મુઠ્ઠી (1–2 ચમચી)",
    row1Freq: "દર 30-45 દિવસે",
    row2Age: "4-6 મહિના<br><span style='font-weight:400;color:var(--ink-soft);font-size:11px;'>સક્રિય વિકાસ સમયગાળો</span>",
    row2Size: "6–8 ઇંચ બેગ / કુંડો",
    row2Qty: "30–50 ગ્રામ",
    row2Eq: "1 થી 2 સામાન્ય મુઠ્ઠી",
    row2Freq: "દર 30-45 દિવસે",
    row3Age: "7-12 મહિના<br><span style='font-weight:400;color:var(--ink-soft);font-size:11px;'>અર્ધ-પરિપક્વ છોડ</span>",
    row3Size: "8–12+ ઇંચ બેગ / કુંડો",
    row3Qty: "60–100 ગ્રામ",
    row3Eq: "2 થી 3 મોટી મુઠ્ઠી",
    row3Freq: "દર 45-60 દિવસે",
    noteBox: "<b>મહત્વપૂર્ણ નોંધ:</b> સક્રિય વિકાસની ઋતુઓ (ચોમાસુ અને ઉનાળો) દરમિયાન આ નિયમિત ખોરાક ચક્ર જાળવો. શિયાળા દરમિયાન અથવા જ્યારે છોડ સુષુપ્ત અવસ્થામાં પ્રવેશે ત્યારે આવર્તન ઘટાડીને 60 દિવસે એકવાર કરો.",
    sec2Title: "જથ્થાબંધ ગણતરીઓ <span style='font-size:13px;color:var(--ink-soft);font-weight:400;'>(1 લાખ / 100,000 છોડ માટે)</span>",
    bulkLabel1: "માત્ર નાના છોડ માટે (1–3 મહિના)",
    bulkAmount1: "1.5 – 2.5 મેટ્રિક ટન",
    bulkBags1: "50 કિલોની 30 થી 50 વ્યવસાયિક ગુણીઓ",
    bulkLabel2: "માત્ર મધ્યમ છોડ માટે (4–6 મહિના)",
    bulkAmount2: "3.0 – 5.0 મેટ્રિક ટન",
    bulkBags2: "50 કિલોની 60 થી 100 વ્યવસાયિક ગુણીઓ",
    bulkLabel3: "માત્ર અર્ધ-પરિપક્વ છોડ માટે (7–12 મહિના)",
    bulkAmount3: "6.0 – 10.0 મેટ્રિક ટન",
    bulkBags3: "50 કિલોની 120 થી 200 વ્યવસાયિક ગુણીઓ",
    bulkLabel4: "માનક મિશ્ર નર્સરી સ્ટોક (સરેરાશ મિશ્રણ)",
    bulkAmount4: "4.0 – 5.0 મેટ્રિક ટન",
    bulkBags4: "50 કિલોની 80 થી 100 વ્યવસાયિક ગુણીઓ",
    sec3Title: "પગલું-દર-પગલું ઉપયોગ કરવાની પદ્ધતિ",
    sec3Intro: "મહત્તમ પોષક તત્વોનું શોષણ અને મૂળને કોઈ નુકસાન ન થાય તે સુધીની ખાતરી કરવા માટે, નર્સરી કામદારોએ દરેક પોલીબેગ અથવા કુંડા માટે આ ચાર પગલાંનું સખતપણે પાલન કરવું આવશ્યક છે:",
    step1Title: "ઉપરની માટી ઢીલી કરો (તૈયારી)",
    step1Desc: "નાના નીંદણ ખોદવાના સાધન અથવા ત્રિકમ વડે પોલીબેગની ધાર પાસેની ઉપરની 1 ઇંચ માટીને હળવા હાથે ઢીલી કરો. મુખ્ય સફેદ મૂળિયા કાપવાનું ટાળવા માટે કેન્દ્રની નજીક ઊંડે સુધી ન ખોદશો.",
    step2Title: "\"આઉટર રીંગ\" નિયમ (ઉપયોગ)",
    step2Desc: "કુંડાની બહારની સરહદ પર જ માપેલી મુઠ્ઠીભર FOM છાંટો.",
    step2Crit: "મહત્વપૂર્ણ: ખાતર અને છોડના થડ વચ્ચે ફરજિયાત 1-ઇંચનું અંતર રાખો",
    step3Title: "મિશ્રણ અને કવર (રક્ષણ)",
    step3Desc: "ઢીલી કરેલી ઉપરની માટીના સ્તરમાં આપેલા FOM ખાતરને હળવાશથી મિક્સ કરો. જો ઉપલબ્ધ હોય, તો તેના પર સૂકી માતી અથવા કોકો-પીટનો પાતળો થર નાખો, જેથી કડક તાપથી રક્ષણ થાય.",
    step4Title: "તાત્કાલિક પાણી આપવું (સક્રિયકરણ)",
    step4Desc: "ખાતર આપ્યા પછી તરત જ છોડને હળવેથી પાણી આપો. ભેજથી ખાતરમાં રહેલા જીવાણુઓ સક્રિય થાય છે અને પોષક તત્વો પાણીમાં ઓગળીને નીચે મૂળ સુધી પહોંચે છે.",
    figCap: "નિયંત્રણ જૂથ (તંદુરસ્ત) વિરુદ્ધ સારવાર જૂથ (ખાતર બર્ન). ખાતર અને થડ વચ્ચે 1-ઇંચનું અંતર સુનિશ્ચિત કરો.",
    sec4Title: "મુશ્કેલીનિવારણ માટે માર્ગદર્શિકા",
    trouble1Title: "A. વણ-કોહવાયેલા ખાતરથી મૂળ સડવા (Root Rot)",
    trouble1SymLabel: "Laxano",
    trouble1SymVal: "પાંદડા કરમાઈ જવા, થડ નમી જવું, નબળા અને સડેલા મૂળ (મૂળ સડવા).",
    trouble1CauseLabel: "મૂળ કારણ",
    trouble1CauseVal: "મૂળના વિસ્તાર પર સીધું જ કાચું ખાતર નાખવું.",
    trouble1SolLabel: "ઉકેલ",
    trouble1SolVal: "હમેશા FOM ને માટી સાથે મિક્સ કરો અને અંતર રાખો. સંપૂર્ણ કોહવાયેલું (Cured) FOM જ વાપરો.",
    trouble2Title: "B. નાઇટ્રોજનની ઉણપનું નિદાન",
    trouble2SymLabel: "Laxano",
    trouble2SymVal: "જૂના પાંદડાઓથી શરૂ થતી પીળાશ (ક્લોરોસિસ), ફિક્કો દેખાવ, ધીમો વિકાસ, પાતળા અને નબળા થડ.",
    trouble2CauseLabel: "મૂળ કારણ",
    trouble2CauseVal: "જમીનમાં નાઇટ્રોજનનું અપૂરતું પ્રમાણ.",
    trouble2SolLabel: "ઉકેલ",
    trouble2SolVal: "ડોઝ ગાઇડ મુજબ FOM ખાતર આપો. માટી સાથે સારી રીતે મિક્સ કરો.",
    trouble3Title: "C. થડ સડવું / ડેમ્પિંગ ઓફ",
    trouble3SymLabel: "Laxano",
    trouble3SymVal: "માટીની સપાટી પર ખોડ કાળું પડવું, થડ નબળું પડવું, છોડ નમી જવો.",
    trouble3CauseLabel: "મૂળ કારણ",
    trouble3CauseVal: "ભીનું ખાતર સીધું જ છોડના થડને અડીને રાખવું.",
    trouble3SolLabel: "ઉકેલ",
    trouble3SolVal: "ખાતર અને થડ વચ્ચે ફરજિયાત 1-ઇંચનું અંતર રાખો. કુંડામાં પાણી ભરાઈ રહેવા ન દો."
  },
  ta: {
    heroEyebrow: "நாற்றுப்பண்ணை பராமரிப்பு வழிகாட்டி",
    heroTitle: "நாற்றுப்பண்ணை தாவரங்களுக்கான FOMப்பயன்பாட்டு வழிகாட்டி",
    heroDesc: "நொதித்த கரிம உரம் (FOM) — நாற்றுப்பண்ணை தாவரங்களின் ஆரோக்கியமான மற்றும் சீரான வளர்ச்சிக்கு சரியான அளவு, படி-படி-படியான பயன்பாட்டு முறை மற்றும் சரிசெய்தல் வழிகாட்டி.",
    sec1Title: "விரைவான அளவு அட்டவணை",
    thAge: "தாவர வயது",
    thSize: "தொட்டி / பாலிபேக் அளவு",
    thQty: "FOM அளவு (ஒரு தாவரத்திற்கு)",
    thEq: "கைப்பிடி / ஸ்பூன் அளவு",
    thFreq: "உரம் போடும் அதிர்வெண்",
    row1Age: "1-3 மாதங்கள்<br><span style='font-weight:400;color:var(--ink-soft);font-size:11px;'>நாற்றுகள் / இளம் தாவரங்கள்</span>",
    row1Size: "4–6 இன்ச் பை / தொட்டி",
    row1Qty: "15–25 கிராம்",
    row1Eq: "1 சிறிய கைப்பிடி (1-2 தேக்கரண்டி)",
    row1Freq: "ஒவ்வொரு 30-45 நாட்களுக்கு ஒருமுறை",
    row2Age: "4-6 மாதங்கள்<br><span style='font-weight:400;color:var(--ink-soft);font-size:11px;'>வளரும் பருவம்</span>",
    row2Size: "6–8 இன்ச் பை / தொட்டி",
    row2Qty: "30–50 கிராம்",
    row2Eq: "1 முதல் 2 வழக்கமான கைப்பிடிகள்",
    row2Freq: "ஒவ்வொரு 30-45 நாட்களுக்கு ஒருமுறை",
    row3Age: "7-12 மாதங்கள்<br><span style='font-weight:400;color:var(--ink-soft);font-size:11px;'>நடுத்தர தாவரங்கள்</span>",
    row3Size: "8–12+ இன்ச் பை / தொட்டி",
    row3Qty: "60–100 கிராம்",
    row3Eq: "2 முதல் 3 பெரிய கைப்பிடிகள்",
    row3Freq: "ஒவ்வொரு 45-60 நாட்களுக்கு ஒருமுறை",
    noteBox: "<b>முக்கிய குறிப்பு:</b> மழை மற்றும் கோடை காலங்களில் இந்த வழக்கமான உரம் போடும் சுழற்சியைப் பராமரிக்கவும். குளிர்காலங்களில் அல்லது தாவரங்கள் செயலற்ற நிலையில் இருக்கும்போது 60 நாட்களுக்கு ஒருமுறை என உரத்தின் அளவைக் குறைக்கவும்.",
    sec2Title: "மொத்த அளவு கணக்கீடு <span style='font-size:13px;color:var(--ink-soft);font-weight:400;'>(1 லட்சம் / 100,000 தாவரங்களுக்கு)</span>",
    bulkLabel1: "இளம் நாற்றுகளுக்கு மட்டும் (1-3 மாதங்கள்)",
    bulkAmount1: "1.5 – 2.5 மெட்ரிக் டன்",
    bulkBags1: "தலா 50 கிலோ எடை கொண்ட 30 முதல் 50 வணிகப் பைகள்",
    bulkLabel2: "நடுத்தர நாற்றுகளுக்கு மட்டும் (4-6 மாதங்கள்)",
    bulkAmount2: "3.0 – 5.0 மெட்ரிக் டன்",
    bulkBags2: "தலா 50 கிலோ எடை கொண்ட 60 முதல் 100 வணிகப் பைகள்",
    bulkLabel3: "முதிர்ந்த நாற்றுகளுக்கு மட்டும் (7-12 மாதங்கள்)",
    bulkAmount3: "6.0 – 10.0 மெட்ரிக் டன்",
    bulkBags3: "தலா 50 கிலோ எடை கொண்ட 120 முதல் 200 வணிகப் பைகள்",
    bulkLabel4: "சராசரி கலப்பு நாற்றுகள் (வழக்கமான கலவை)",
    bulkAmount4: "4.0 – 5.0 மெட்ரிக் டன்",
    bulkBags4: "தலா 50 கிலோ எடை கொண்ட 80 முதல் 100 வணிகப் பைகள்",
    sec3Title: "படி-படி-படியான பயன்பாட்டு முறை",
    sec3Intro: "அதிகபட்ச ஊட்டச்சத்து உறிஞ்சுதல் மற்றும் வேர் சேதம் இல்லாமல் இருப்பதை உறுதி செய்ய, நாற்றுப்பண்ணை பணியாளர்கள் ஒவ்வொரு பாலிபேக் அல்லது தொட்டிக்கும் இந்த நான்கு படிகளை கண்டிப்பாக பின்பற்ற வேண்டும்:",
    step1Title: "மேல் மண்ணைத் தளர்த்தவும் (தயாரிப்பு)",
    step1Desc: "தொட்டியின் விளிம்பில் உள்ள மேல் 1 இன்ச் மண்ணை ஒரு சிறிய கருவியால் மெதுவாக தளர்த்தவும். முக்கிய வெள்ளை வேர்களை வெட்டுவதைத் தவிர்க்க மையத்திற்கு அருகில் ஆழமாக தோண்ட வேண்டாம்.",
    step2Title: "\"வெளிப்புற வளையம்\" விதி (பயன்பாடு)",
    step2Desc: "தொட்டியின் வெளிப்புற எல்லையில் மட்டுமே அளவிடப்பட்ட கைப்பிடி FOM உரத்தைத் தூவவும்.",
    step2Crit: "முக்கியமானது: உரம் மற்றும் தாவரத்தின் தண்டுக்கு இடையே கண்டிப்பாக 1 இன்ச் இடைவெளி இருக்க வேண்டும்",
    step3Title: "கலந்து மூடுதல் (பாதுகாப்பு)",
    step3Desc: "தளர்த்தப்பட்ட மேல் மண்ணில் போட்ட FOM உரத்தை மெதுவாக கலக்கவும். முடிந்தால், அதன் மேல் உலர்ந்த மண் அல்லது தேங்காய் நார் கழிவுகளை ஒரு மெல்லிய அடுக்காகப் பரப்பி, நேரடி வெயிலில் இருந்து நுண்ணுயிரிகளைப் பாதுகாக்கவும்.",
    step4Title: "உடனடியாக தண்ணீர் பாய்ச்சுதல் (செயல்படுத்துதல்)",
    step4Desc: "உரம் போட்டவுடன் உடனடியாக தாவரத்திற்கு மெதுவாக தண்ணீர் ஊற்றவும். ஈரப்பதம் உரத்திலுள்ள நுண்ணுயிரிகளைச் செயல்படுத்துகிறது மற்றும் ஊட்டச்சத்துக்கள் நீரில் கரைந்து வேர்களைச் சென்றடைய உதவுகிறது.",
    figCap: "கட்டுப்பாட்டு குழு (ஆரோக்கியமானது) எதிராக சிகிச்சை குழு (உரம் எரிதல்). உரம் மற்றும் தண்டுக்கு இடையே 1 இன்ச் இடைவெளி இருப்பதை உறுதி செய்யவும்.",
    sec4Title: "பிரச்சனைகளை சரிசெய்வதற்கான வழிகாட்டி",
    trouble1Title: "A. பதப்படுத்தப்படாத உரத்தால் வேர் அழுகல் (Root Rot)",
    trouble1SymLabel: "அறிகுறிகள்",
    trouble1SymVal: "இலைகள் வாடுதல், தண்டு சரிதல், பலவீனமான மற்றும் அழுகிய வேர்கள் (வேர் அழுகல்).",
    trouble1CauseLabel: "மூல காரணம்",
    trouble1CauseVal: "நேரடியாக வேர் பகுதியில் புதிய அல்லது பதப்படுத்தப்படாத உரத்தை இடுதல்.",
    trouble1SolLabel: "தீர்வு",
    trouble1SolVal: "எப்போதும் FOM உரத்தை மண்ணுடன் கலந்து இடைவெளி விட்டு இடவும். முழுமையாக பதப்படுத்தப்பட்ட FOM ஐப் பயன்படுத்தவும்.",
    trouble2Title: "B. நைட்ரஜன் குறைபாடு கண்டறிதல்",
    trouble2SymLabel: "அறிகுறிகள்",
    trouble2SymVal: "பழைய இலைகளிலிருந்து தொடங்கும் சீரான மஞ்சள் நிறம் (குளோரோசிஸ்), வெளிர் தோற்றம், மெதுவான வளர்ச்சி, மெல்லிய மற்றும் பலவீனமான தண்டுகள்.",
    trouble2CauseLabel: "மூல காரணம்",
    trouble2CauseVal: "மண் கலவையில் போதிய நைட்ரஜன் இல்லாதது.",
    trouble2SolLabel: "தீர்வு",
    trouble2SolVal: "வழிகாட்டியின்படி FOM உரத்தை இடவும். மண்ணுடன் நன்றாகக் கலக்கவும்.",
    trouble3Title: "C. தண்டு அழுகல் / நாற்றழுகல் நோய்",
    trouble3SymLabel: "அறிகுறிகள்",
    trouble3SymVal: "மண் மட்டத்தில் தண்டு கருமையாக மாறுதல், தண்டு பலவீனமடைதல், தாவரம் சரிந்து விழுதல்.",
    trouble3CauseLabel: "மூல காரணம்",
    trouble3CauseVal: "ஈரமான உரத்தை நேரடியாக தாவரத்தின் முக்கிய தண்டுக்கு அருகில் குவித்தல்.",
    trouble3SolLabel: "தீர்வு",
    trouble3SolVal: "உரம் மற்றும் தண்டுக்கு இடையே கண்டிப்பாக 1 இன்ச் இடைவெளி இருக்க வேண்டும். தொட்டியில் தண்ணீர் தேங்கவிடாதீர்கள்."
  }
};

function generateLangForDoc(doc, lang) {
  const enNode = doc.querySelector('[data-lang="en"]');
  if (!enNode) return;
  const clone = enNode.cloneNode(true);
  clone.setAttribute('data-lang', lang);
  clone.classList.remove('active');

  const dict = translations[lang];
  if (!dict) return;

  // Hero
  clone.querySelector('.hero .eyebrow').innerHTML = dict.heroEyebrow;
  clone.querySelector('.hero h1').innerHTML = dict.heroTitle;
  clone.querySelector('.hero p').innerHTML = dict.heroDesc;

  // Sections titles
  const secTitles = clone.querySelectorAll('.section-title h2');
  if (secTitles.length >= 4) {
    secTitles[0].innerHTML = dict.sec1Title;
    secTitles[1].innerHTML = dict.sec2Title;
    secTitles[2].innerHTML = dict.sec3Title;
    secTitles[3].innerHTML = dict.sec4Title;
  }

  // Table header
  const ths = clone.querySelectorAll('table.dose thead th');
  if (ths.length >= 5) {
    ths[0].innerHTML = dict.thAge;
    ths[1].innerHTML = dict.thSize;
    ths[2].innerHTML = dict.thQty;
    ths[3].innerHTML = dict.thEq;
    ths[4].innerHTML = dict.thFreq;
  }

  // Table rows
  const trs = clone.querySelectorAll('table.dose tbody tr');
  if (trs.length >= 3) {
    // Row 1
    trs[0].querySelector('.age').innerHTML = dict.row1Age;
    trs[0].cells[1].innerHTML = dict.row1Size;
    trs[0].cells[2].innerHTML = dict.row1Qty;
    trs[0].cells[3].innerHTML = dict.row1Eq;
    trs[0].cells[4].innerHTML = dict.row1Freq;
    // Row 2
    trs[1].querySelector('.age').innerHTML = dict.row2Age;
    trs[1].cells[1].innerHTML = dict.row2Size;
    trs[1].cells[2].innerHTML = dict.row2Qty;
    trs[1].cells[3].innerHTML = dict.row2Eq;
    trs[1].cells[4].innerHTML = dict.row2Freq;
    // Row 3
    trs[2].querySelector('.age').innerHTML = dict.row3Age;
    trs[2].cells[1].innerHTML = dict.row3Size;
    trs[2].cells[2].innerHTML = dict.row3Qty;
    trs[2].cells[3].innerHTML = dict.row3Eq;
    trs[2].cells[4].innerHTML = dict.row3Freq;
  }

  // Note
  clone.querySelector('.note-box').innerHTML = dict.noteBox;

  // Bulk calculation cards
  const bulkCards = clone.querySelectorAll('.bulk-card');
  if (bulkCards.length >= 4) {
    bulkCards[0].querySelector('.label').innerHTML = dict.bulkLabel1;
    bulkCards[0].querySelector('.amount').innerHTML = dict.bulkAmount1;
    bulkCards[0].querySelector('.bags').innerHTML = dict.bulkBags1;

    bulkCards[1].querySelector('.label').innerHTML = dict.bulkLabel2;
    bulkCards[1].querySelector('.amount').innerHTML = dict.bulkAmount2;
    bulkCards[1].querySelector('.bags').innerHTML = dict.bulkBags2;

    bulkCards[2].querySelector('.label').innerHTML = dict.bulkLabel3;
    bulkCards[2].querySelector('.amount').innerHTML = dict.bulkAmount3;
    bulkCards[2].querySelector('.bags').innerHTML = dict.bulkBags3;

    bulkCards[3].querySelector('.label').innerHTML = dict.bulkLabel4;
    bulkCards[3].querySelector('.amount').innerHTML = dict.bulkAmount4;
    bulkCards[3].querySelector('.bags').innerHTML = dict.bulkBags4;
  }

  // Step-by-step intro
  const stepIntro = clone.querySelector('.section:nth-of-type(3) > p');
  if (stepIntro) stepIntro.innerHTML = dict.sec3Intro;

  // Step items
  const steps = clone.querySelectorAll('.step-item');
  if (steps.length >= 4) {
    steps[0].querySelector('h4').innerHTML = dict.step1Title;
    steps[0].querySelector('p').innerHTML = dict.step1Desc;

    steps[1].querySelector('h4').innerHTML = dict.step2Title;
    steps[1].querySelector('p').innerHTML = dict.step2Desc;
    steps[1].querySelector('.crit').innerHTML = dict.step2Crit;

    steps[2].querySelector('h4').innerHTML = dict.step3Title;
    steps[2].querySelector('p').innerHTML = dict.step3Desc;

    steps[3].querySelector('h4').innerHTML = dict.step4Title;
    steps[3].querySelector('p').innerHTML = dict.step4Desc;
  }

  // Fig caption
  const figCap = clone.querySelector('.figure .cap');
  if (figCap) figCap.innerHTML = dict.figCap;

  // Troubleshooting cards
  const troubles = clone.querySelectorAll('.trouble-card');
  if (troubles.length >= 3) {
    // Card 1
    troubles[0].querySelector('.trouble-head h3').innerHTML = dict.trouble1Title;
    const tRows1 = troubles[0].querySelectorAll('.tb-row');
    if (tRows1.length >= 3) {
      tRows1[0].querySelector('.k').innerHTML = dict.trouble1SymLabel;
      tRows1[0].querySelector('.v').innerHTML = dict.trouble1SymVal;
      tRows1[1].querySelector('.k').innerHTML = dict.trouble1CauseLabel;
      tRows1[1].querySelector('.v').innerHTML = dict.trouble1CauseVal;
      tRows1[2].querySelector('.k').innerHTML = dict.trouble1SolLabel;
      tRows1[2].querySelector('.v').innerHTML = dict.trouble1SolVal;
    }

    // Card 2
    troubles[1].querySelector('.trouble-head h3').innerHTML = dict.trouble2Title;
    const tRows2 = troubles[1].querySelectorAll('.tb-row');
    if (tRows2.length >= 3) {
      tRows2[0].querySelector('.k').innerHTML = dict.trouble1SymLabel;
      tRows2[0].querySelector('.v').innerHTML = dict.trouble2SymVal;
      tRows2[1].querySelector('.k').innerHTML = dict.trouble1CauseLabel;
      tRows2[1].querySelector('.v').innerHTML = dict.trouble2CauseVal;
      tRows2[2].querySelector('.k').innerHTML = dict.trouble1SolLabel;
      tRows2[2].querySelector('.v').innerHTML = dict.trouble2SolVal;
    }

    // Card 3
    troubles[2].querySelector('.trouble-head h3').innerHTML = dict.trouble3Title;
    const tRows3 = troubles[2].querySelectorAll('.tb-row');
    if (tRows3.length >= 3) {
      tRows3[0].querySelector('.k').innerHTML = dict.trouble1SymLabel;
      tRows3[0].querySelector('.v').innerHTML = dict.trouble3SymVal;
      tRows3[1].querySelector('.k').innerHTML = dict.trouble1CauseLabel;
      tRows3[1].querySelector('.v').innerHTML = dict.trouble3CauseVal;
      tRows3[2].querySelector('.k').innerHTML = dict.trouble1SolLabel;
      tRows3[2].querySelector('.v').innerHTML = dict.trouble3SolVal;
    }
  }

  doc.querySelector('.wrap').appendChild(clone);
}

export default function NurseryGuidePage() {
  const [activeTab, setActiveTab] = useState('nursery');
  const [selectedLang, setSelectedLang] = useState(() => {
    return localStorage.getItem('nursery_lang_picked') || 'en';
  });
  const [showHindiPrompt, setShowHindiPrompt] = useState(false);
  const [manualHtml, setManualHtml] = useState('');

  // 1. Fetch manual HTML natively on mount
  useEffect(() => {
    fetch('/nursery-guide.html')
      .then((res) => res.text())
      .then((htmlText) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Dynamically translate and inject the other languages inside the DOM tree
        generateLangForDoc(doc, 'hi');
        generateLangForDoc(doc, 'gu');
        generateLangForDoc(doc, 'ta');

        // Clean static header and footer inside manual content
        const staticHeader = doc.querySelector('.header');
        if (staticHeader) staticHeader.remove();
        const staticFooter = doc.querySelector('.footer');
        if (staticFooter) staticFooter.remove();

        // Extract wrap element content
        const wrapNode = doc.querySelector('.wrap');
        if (wrapNode) {
          setManualHtml(wrapNode.innerHTML);
        }
      })
      .catch((err) => {
        console.error('Failed to load manual HTML natively:', err);
      });
  }, []);

  // 2. Control language blocks class toggle
  useEffect(() => {
    const els = document.querySelectorAll('.nursery-guide-native-content [data-lang]');
    els.forEach((el) => {
      if (el.getAttribute('data-lang') === selectedLang) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }, [selectedLang, manualHtml]);

  // 3. Geolocation region checks
  useEffect(() => {
    const hasPicked = localStorage.getItem('nursery_lang_picked');
    const hasDismissed = localStorage.getItem('nursery_hindi_dismissed');

    // Run lookup if user hasn't explicitly locked a language, OR if they are currently on English and have never dismissed the Hindi suggestion
    if (!hasPicked || (hasPicked === 'en' && !hasDismissed)) {
      fetch('https://ipapi.co/json/')
        .then((res) => res.json())
        .then((data) => {
          const region = data.region;
          if (!region) return;

          // Auto-redirect rules
          if (region === 'Maharashtra' && hasPicked !== 'en') {
            setSelectedLang('mr');
            localStorage.setItem('nursery_lang_picked', 'mr');
          } else if (region === 'Tamil Nadu' && hasPicked !== 'en') {
            setSelectedLang('ta');
            localStorage.setItem('nursery_lang_picked', 'ta');
          } else if (region === 'Gujarat' && hasPicked !== 'en') {
            setSelectedLang('gu');
            localStorage.setItem('nursery_lang_picked', 'gu');
          } else if (HINDI_STATES.includes(region) && !hasDismissed) {
            // Suggest Hindi non-blocking pop-up
            setShowHindiPrompt(true);
          }
        })
        .catch((err) => {
          console.warn('IP location detection failed:', err);
        });
    }
  }, [activeTab]);

  const handleLangChange = (e) => {
    const lang = e.target.value;
    setSelectedLang(lang);
    localStorage.setItem('nursery_lang_picked', lang);
    setShowHindiPrompt(false);
  };

  const switchToHindi = () => {
    setSelectedLang('hi');
    localStorage.setItem('nursery_lang_picked', 'hi');
    setShowHindiPrompt(false);
  };

  const dismissPrompt = () => {
    localStorage.setItem('nursery_hindi_dismissed', 'true');
    setShowHindiPrompt(false);
  };

  return (
    <main className="nursery-guide-page">
      {/* Help Center Header/Banner */}
      <section className="nursery-guide-banner">
        <div className="container nursery-guide-banner__inner">
          <div className="nursery-guide-banner__text">
            <div className="nursery-guide-banner__tag">
              <BookOpen size={14} className="icon-pulse" />
              <span>BioLink Help Desk</span>
            </div>
            <h1 className="nursery-guide-banner__title">Application Manuals</h1>
            <p className="nursery-guide-banner__desc">
              Access official guidelines, dosage charts, and soil management manuals tailored to your agricultural crop category.
            </p>
          </div>
          {activeTab === 'nursery' && (
            <div className="nursery-guide-banner__control">
              <label htmlFor="react-lang-select" className="lang-label">
                <Globe size={16} />
                <span>Choose Manual Language:</span>
              </label>
              <div className="lang-select-wrapper">
                <select
                  id="react-lang-select"
                  value={selectedLang}
                  onChange={handleLangChange}
                  className="lang-select-dropdown"
                >
                  <option value="en">English</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tabs Selector Section */}
      <section className="help-tabs-section">
        <div className="container">
          <div className="help-tabs-list">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`help-tab-btn ${activeTab === tab.id ? 'help-tab-btn--active' : ''}`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="nursery-guide-frame-sec">
        <div className="container">
          {activeTab === 'nursery' ? (
            <>
              {showHindiPrompt && (
                <div className="hindi-prompt-banner">
                  <div className="hindi-prompt-banner__content">
                    <Sparkles size={18} className="hindi-prompt-banner__icon" />
                    <p className="hindi-prompt-banner__text">
                      Read this manual in Hindi? / क्या आप इस मार्गदर्शिका को हिंदी में पढ़ना चाहते हैं?
                    </p>
                  </div>
                  <div className="hindi-prompt-banner__actions">
                    <button className="btn btn-primary btn-sm" onClick={switchToHindi}>
                      Switch to हिन्दी
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={dismissPrompt}>
                      Keep English
                    </button>
                  </div>
                </div>
              )}

              {manualHtml ? (
                <div
                  className="nursery-guide-native-content"
                  dangerouslySetInnerHTML={{ __html: manualHtml }}
                />
              ) : (
                <div className="manual-loading-spinner" style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
                  <Sparkles size={32} className="icon-pulse" style={{ marginBottom: '1rem' }} />
                  <p>Loading application manual content...</p>
                </div>
              )}
            </>
          ) : (
            <div className="locked-manual-placeholder">
              <FolderLock size={48} className="locked-icon" />
              <h3>Agronomy Guide Coming Soon</h3>
              <p>
                {TABS.find((t) => t.id === activeTab)?.desc}
              </p>
              <div className="locked-status-badge">
                <Sparkles size={14} />
                <span>Undergoing Agronomic Certification</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
