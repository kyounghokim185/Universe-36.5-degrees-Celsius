import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';
import AITestPage from './components/AITestPage';
import EmotionalLanding from './components/EmotionalLanding';
import VeoStudio from './components/studio/VeoStudio';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [step, setStep] = useState('landing');
  const [lang, setLang] = useState('ko'); // 'ko' or 'en'
  const [userData, setUserData] = useState({ name: '', age: '', photo: null });
  const [partyOptions, setPartyOptions] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // Handle data from Beta Form directly
  const handleBetaSubmit = (formData) => {
    // Map Beta Form data to VeoStudio requirements
    const { name, contact, target, message, photo } = formData;

    setUserData({
      name: name || 'User',
      age: 25, // Default or inferred
      photo: photo || null
    });

    // Default Party Options based on Beta Form context
    const defaultLocationId = 'home';
    const locName = lang === 'ko' ? '아늑한 집' : 'Cozy Home';

    setPartyOptions({
      locationId: defaultLocationId,
      locationName: locName,
      occupation: target || 'friend',
      food: 'Party Food',
      vibe: 'Happy',
      customMessage: message // Pass the message for the prompt
    });

    // Set Country/Language based on current settings
    setSelectedCountry(lang === 'ko' ? { id: 'kr', name: '대한민국', flag: '🇰🇷' } : { id: 'us', name: 'USA', flag: '🇺🇸' });
    setSelectedLanguage(lang === 'ko' ? { id: 'ko', name: '한국어', hello: '안녕' } : { id: 'en', name: 'English', hello: 'Hello' });

    setStep('studio');
  };

  const handleTest = () => setStep('test');

  const handleReset = () => {
    if (window.confirm(lang === 'ko' ? "처음으로 돌아가시겠습니까?" : "Reset to start?")) {
      setStep('landing');
      setUserData({ name: '', age: '', photo: null });
      setPartyOptions({});
      window.speechSynthesis.cancel();
    }
  };

  const str = {
    ko: { toggle: 'English' },
    en: { toggle: '한국어' }
  };

  // Safe defaults for context if needed
  const safeLang = str[lang] ? lang : 'ko';

  return (
    <div className="w-full h-screen bg-cream font-sans overflow-hidden text-gray-900 relative">

      {/* Language Toggle & Reset */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
          className="bg-white/80 backdrop-blur text-gray-800 px-4 py-2 rounded-full font-bold text-xs border border-stone-200 shadow-md hover:bg-stone-50 transition-colors"
        >
          {str[safeLang].toggle}
        </button>

        {step !== 'landing' && step !== 'test' && (
          <button onClick={handleReset} className="bg-white hover:bg-red-50 text-gray-600 hover:text-red-500 p-2 rounded-full transition-colors border border-stone-200 shadow-md">
            <RotateCw size={20} />
          </button>
        )}
      </div>

      <div className="relative z-10 w-full h-full overflow-auto">
        {step === 'landing' && (
          <EmotionalLanding
            onStart={() => {
              // Scroll to beta form
              const betaSection = document.getElementById('beta-form');
              if (betaSection) betaSection.scrollIntoView({ behavior: 'smooth' });
            }}
            onTest={handleTest}
            onBetaSubmit={handleBetaSubmit}
            onAdmin={() => setStep('admin')}
            lang={lang}
          />
        )}

        {step === 'studio' && (
          <VeoStudio
            userData={userData}
            countryData={selectedCountry}
            languageData={selectedLanguage}
            partyOptions={partyOptions}
            lang={lang}
          />
        )}
        {step === 'test' && <AITestPage onBack={() => setStep('landing')} />}
        {step === 'admin' && <AdminDashboard onBack={() => setStep('landing')} />}
      </div>
    </div>
  );
}
