import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';
import AITestPage from './components/AITestPage';
import EmotionalLanding from './components/EmotionalLanding';
import UserForm from './components/setup/UserForm';
import CountrySelect from './components/setup/CountrySelect';
import LanguageSelect from './components/setup/LanguageSelect';
import VeoStudio from './components/studio/VeoStudio';

// --- Data Constants (Lifted up if needed, or kept in components) ---
// LOCATIONS, COUNTRIES, LANGUAGES are now inside their respective components 
// or could be in a shared constant file. 
// For now, since they are used in App.jsx for logic (e.g. locationName lookup), 
// we might need them or we can pass the whole object.
// Let's see: UserForm passes { ...formData, photo }, App needs to find locationName.
// CountrySelect passes country object. LanguageSelect passes language object.
// So App.jsx doesn't strictly need the arrays if the components pass full objects or IDs.

// However, UserForm only passes locationId. App needs to lookup locationName.
// I will keep LOCATIONS here for lookup, or better, move logic to UserForm to pass locationName?
// The original UserForm passed locationId, and App looked it up.
// The NEW UserForm I wrote passes locationId too?
// Let's check UserForm code I wrote.
// "const locName = LOCATIONS.find..." is in App.jsx originally.
// I should duplicate LOCATIONS here or export it. 
// For safety/speed, I'll keep LOCATIONS array here for the lookup logic, 
// even if it matches the one in UserForm. Ideally shared.

const LOCATIONS = [
  { id: 'home', name: '아늑한 집' },
  { id: 'beach', name: '햇살 가득 해변' },
  { id: 'club', name: '화려한 클럽' },
  { id: 'restaurant', name: '고급 레스토랑' },
  { id: 'rooftop', name: '도심 옥상 파티' },
  { id: 'camping', name: '숲속 캠핑장' },
  { id: 'amusement', name: '놀이공원' },
  { id: 'space', name: '우주 정거장' },
  { id: 'underwater', name: '수중 호텔' },
  { id: 'school', name: '학교 교실' },
];

export default function App() {
  const [step, setStep] = useState('landing');
  const [userData, setUserData] = useState({ name: '', age: '', photo: null });
  const [partyOptions, setPartyOptions] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleStart = () => setStep('input');
  const handleTest = () => setStep('test');

  const handleUserSubmit = (formData) => {
    const { name, age, photo, ...options } = formData;
    setUserData({ name, age, photo });
    const locName = LOCATIONS.find(l => l.id === options.locationId)?.name || options.locationId;
    setPartyOptions({ ...options, locationName: locName });
    setStep('country');
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setStep('language');
  };

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setStep('studio');
  };

  const handleReset = () => {
    if (window.confirm("처음으로 돌아가시겠습니까? 모든 설정이 초기화됩니다.")) {
      setStep('landing');
      setUserData({ name: '', age: '', photo: null });
      setPartyOptions({});
      setSelectedCountry(null);
      setSelectedLanguage(null);
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="w-full h-screen bg-cream font-sans overflow-hidden text-gray-900">

      {/* Background Ambience (Optional for sub-pages since they have their own bg-cream, but keeping it subtle is nice) */}
      {/* We can remove the dark global background now since we want warm beige. */}

      <div className="relative z-10 w-full h-full overflow-auto">

        {step !== 'landing' && step !== 'test' && (
          <div className="fixed top-4 right-4 z-50">
            <button onClick={handleReset} className="bg-white hover:bg-red-50 text-gray-600 hover:text-red-500 p-3 rounded-full transition-colors border border-stone-200 shadow-lg">
              <RotateCw size={20} />
            </button>
          </div>
        )}

        {step === 'landing' && <EmotionalLanding onStart={handleStart} onTest={handleTest} />}
        {step === 'input' && <UserForm onSubmit={handleUserSubmit} />}
        {step === 'country' && <CountrySelect onSelect={handleCountrySelect} />}
        {step === 'language' && <LanguageSelect onSelect={handleLanguageSelect} />}
        {step === 'studio' && (
          <VeoStudio
            userData={userData}
            countryData={selectedCountry}
            languageData={selectedLanguage}
            partyOptions={partyOptions}
          />
        )}
        {step === 'test' && <AITestPage onBack={() => setStep('landing')} />}
      </div>
    </div>
  );
}
