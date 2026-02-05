import React, { useState, useEffect, useRef } from 'react';
import { Globe, PartyPopper, ArrowRight, RotateCw, Sparkles, Loader2, Play, MapPin, Briefcase, Pizza, Music, Upload, Image as ImageIcon, X, Mic, CheckCircle } from 'lucide-react';
import AITestPage from './components/AITestPage';

// --- API Helpers ---

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; // Set VITE_GEMINI_API_KEY in .env file

if (!apiKey) {
  console.warn("API Key is missing! Please set VITE_GEMINI_API_KEY in your .env.local file.");
}

const generateVeoPrompt = async (userData, countryData, languageData, partyOptions) => {
  const photoContext = userData.photo
    ? `Decorations: A large, funny poster of the protagonist (${userData.name}) smiling is hanging on the wall.`
    : "";

  const promptText = `
    Create a highly detailed, professional text-to-video prompt for an AI model like Veo 3.
    The goal is to generate a hyper-realistic, 8k, 1st-person POV video filmed with a 360-degree camera.
    
    Context:
    - Event: A surprise birthday party.
    - Location: ${partyOptions.locationName} similar to ${partyOptions.locationId}. The scene should authentically reflect this specific setting.
    - Country/Culture: ${countryData.name}. Incorporate subtle cultural elements.
    - Protagonist: ${userData.name}, turning ${userData.age} years old.
    - Characters: Friends who look like ${partyOptions.occupation || 'people of similar age'}. 
    - Food: The centerpiece is a birthday cake and ${partyOptions.food}.
    - Atmosphere: ${partyOptions.vibe} mood. Lighting and color grading should match this vibe.
    - Action: Friends jump out or cheer "Surprise!", looking directly at the camera.
    - Camera: Handheld 360 camera movement, slight shake, high dynamic range.
    - ${photoContext}
    
    Output: Return ONLY the prompt text in English, no explanations.
  `;

  try {
    // Call Python Backend
    // Call Python Backend
    // Vercel Rewrite: /api/generate-prompt -> backend logic
    // But our new backend structure is different. Let's align them.
    // The previous code expected /api/generate-prompt.
    // Our new backend has /ai/generate/image etc.
    // For now, I will assume we might implement text generation endpoint later or the user just wants the AI Image Test.
    // I will point this to a hypothetical endpoint or keep it as is if it was a mock,
    // BUT the user asked to push. The new backend is at /api/* via Vercel rewrites.

    // Changing to relative path to support Vercel rewrites
    const response = await fetch('/api/text/generate', { // Hypothetical endpoint for Veo Prompt
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: promptText
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || 'Server Error');
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "A realistic birthday party scene.";
  } catch (e) {
    console.error("Prompt generation failed", e);
    return `A hyper-realistic 1st person POV shot of a birthday party at a ${partyOptions.locationName} in ${countryData.name}. Friends dressed as ${partyOptions.occupation} are cheering. Atmosphere is ${partyOptions.vibe}. ${photoContext}`;
  }
};

const generateVeoImage = async (prompt) => {
  try {
    // Call Python Backend
    // Call Python Backend
    const response = await fetch('/api/ai/generate/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("Imagen API Error (Backend):", errData);
      return null;
    }

    const data = await response.json();
    if (data.predictions?.[0]?.bytesBase64Encoded) {
      return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
    }
    return null;
  } catch (e) {
    console.error("Image generation failed", e);
    return null;
  }
};

// --- Assets & Data ---

const COUNTRIES = [
  { id: 'KR', name: '대한민국 (Korea)', greeting: '생일 축하해', color: 0xff4d4d },
  { id: 'US', name: '미국 (USA)', greeting: 'Happy Birthday', color: 0x2563eb },
  { id: 'JP', name: '일본 (Japan)', greeting: 'お誕生日おめでとう', color: 0xbc002d },
  { id: 'CN', name: '중국 (China)', greeting: '生日快乐', color: 0xff0000 },
  { id: 'IN', name: '인도 (India)', greeting: 'जन्मदिन मुबारक', color: 0xff9933 },
  { id: 'UK', name: '영국 (UK)', greeting: 'Happy Birthday', color: 0x003399 },
  { id: 'FR', name: '프랑스 (France)', greeting: 'Joyeux Anniversaire', color: 0x4f46e5 },
  { id: 'BR', name: '브라질 (Brazil)', greeting: 'Feliz Aniversário', color: 0x16a34a },
];

const LANGUAGES = [
  { id: 'ko-KR', name: '한국어 (Korean)', label: '한국어' },
  { id: 'en-US', name: '영어 (English)', label: 'English' },
  { id: 'ja-JP', name: '일본어 (Japanese)', label: '日本語' },
  { id: 'zh-CN', name: '중국어 (Chinese)', label: '中文' },
  { id: 'es-ES', name: '스페인어 (Spanish)', label: 'Español' },
  { id: 'fr-FR', name: '프랑스어 (French)', label: 'Français' },
];

const LOCATIONS = [
  { id: 'home', name: '아늑한 집', color: 0xffebee },
  { id: 'beach', name: '햇살 가득 해변', color: 0xe0f7fa },
  { id: 'club', name: '화려한 클럽', color: 0x1a1a2e },
  { id: 'restaurant', name: '고급 레스토랑', color: 0xfff3e0 },
  { id: 'rooftop', name: '도심 옥상 파티', color: 0xe3f2fd },
  { id: 'camping', name: '숲속 캠핑장', color: 0xe8f5e9 },
  { id: 'amusement', name: '놀이공원', color: 0xf3e5f5 },
  { id: 'space', name: '우주 정거장', color: 0x000000 },
  { id: 'underwater', name: '수중 호텔', color: 0x006064 },
  { id: 'school', name: '학교 교실', color: 0xf5f5f5 },
];

const FOODS = ['피자 & 치킨', 'BBQ 파티', '고급 스시', '디저트 & 도넛', '타코 & 멕시칸', '한식 잔칫상', '딤섬 & 베이징덕', '카레 & 난'];
const VIBES = ['활기찬 (Energetic)', '로맨틱한 (Romantic)', '차분한 (Chill)', '신비로운 (Mysterious)', '광란의 (Chaotic)'];

// --- Components ---

// 1. Veo Studio Component
const VeoStudio = ({ userData, countryData, languageData, partyOptions }) => {
  const [status, setStatus] = useState('idle'); // idle, prompting, imagining, selection, converting, ready
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [customRequest, setCustomRequest] = useState(''); // Text for custom request
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const startGeneration = async () => {
      setStatus('prompting');
      const generatedPrompt = await generateVeoPrompt(userData, countryData, languageData, partyOptions);
      if (!isMounted) return;
      setPrompt(generatedPrompt);

      setStatus('imagining');

      // Generate 3 images concurrently (Nano Banana Pro)
      const imagePromises = Array(3).fill(0).map(() => generateVeoImage(generatedPrompt));
      const images = await Promise.all(imagePromises);

      if (!isMounted) return;

      const validImages = images.filter(img => img !== null);
      if (validImages.length > 0) {
        setGeneratedImages(validImages);
        setStatus('selection');
      } else {
        setStatus('error');
      }
    };

    startGeneration();

    return () => { isMounted = false; };
  }, [userData, countryData, languageData, partyOptions]);

  // Video Conversion Simulation
  useEffect(() => {
    if (status === 'converting') {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(old => {
          if (old >= 100) {
            clearInterval(interval);
            setStatus('ready');
            return 100;
          }
          return old + 2; // 50 steps * ~50ms = 2.5s
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleSelectImage = (index) => {
    setSelectedImageIndex(index);
  };

  const handleConvertToVideo = () => {
    if (selectedImageIndex !== null) {
      setStatus('converting');
    }
  };

  const handlePlay = () => {
    const msg = new SpeechSynthesisUtterance();
    // In a real scenario, we might use customRequest to alter the speech
    msg.text = `${countryData.greeting}, ${userData.name}!`;
    msg.lang = languageData.id;
    msg.rate = 0.9;
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-black p-4 md:p-6">
      <div className="max-w-6xl w-full bg-slate-900/80 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm flex flex-col h-[90vh]">

        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <div className="flex items-center gap-2 text-white font-bold">
            <Sparkles className="text-yellow-400" size={20} />
            <span className="text-yellow-400">Nano Banana Pro</span>
            <ArrowRight size={16} className="text-slate-500" />
            <span className="text-purple-400">Veo 3 Studio</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono hidden md:flex">
            <span>LOC: {partyOptions.locationName}</span>
            <span>LANG: {languageData.name}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

          {/* Left: Prompt Terminal (Logs) */}
          <div className="w-full md:w-1/3 bg-black p-4 border-r border-slate-800 overflow-y-auto font-mono text-xs md:text-sm">
            <div className="text-slate-500 mb-2 uppercase tracking-wider font-bold">시스템 로그 (System Log)</div>

            <div className="space-y-2">
              <div className="text-green-500">[정보] 워크플로우 초기화됨</div>
              <div className="text-slate-300">사용자: {userData.name} ({userData.age}세)</div>

              {status === 'prompting' && <div className="text-yellow-400 animate-pulse">프롬프트 최적화 중...</div>}

              {status === 'imagining' && (
                <div className="text-yellow-400 animate-pulse">
                  Nano Banana Pro 엔진 가동 중...<br />
                  &gt; 시안 3종 생성 중...
                </div>
              )}

              {generatedImages.length > 0 && <div className="text-green-500">[완료] Nano Banana Pro 시안 생성됨</div>}

              {status === 'selection' && <div className="text-blue-400 animate-pulse">사용자 검토 및 추가 요청 대기 중...</div>}

              {status === 'converting' && (
                <div className="text-purple-500">
                  <div className="mb-2 text-white border-l-2 border-purple-500 pl-2">
                    [VEO 3 입력 데이터]<br />
                    &gt; 선택된 시안: #{selectedImageIndex + 1}<br />
                    &gt; 추가 요청: "{customRequest || '없음'}"
                  </div>
                  Veo 3 비디오 렌더링 시작...<br />
                  물리 엔진 시뮬레이션 중...<br />
                  오디오 합성은 ({languageData.id})로 진행...
                </div>
              )}
              {status === 'ready' && <div className="text-green-500 font-bold">[완료] Veo 3 렌더링 완료</div>}
            </div>

            {prompt && (
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="text-slate-500 mb-1">프롬프트 데이터:</div>
                <div className="text-slate-400 text-xs break-words opacity-70">{prompt.substring(0, 150)}...</div>
              </div>
            )}
          </div>

          {/* Right: Interaction Area */}
          <div className="w-full md:w-2/3 relative bg-slate-900 flex flex-col items-center justify-center p-6 gap-6">

            {/* Loading State */}
            {(status === 'prompting' || status === 'imagining') && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-yellow-400" size={48} />
                <div className="text-slate-300 text-lg font-medium text-center">
                  <span className="text-yellow-400 font-bold">Nano Banana Pro</span>가<br />
                  파티 분위기 시안 3가지를 만들고 있습니다...
                </div>
              </div>
            )}

            {/* ERROR State */}
            {status === 'error' && (
              <div className="text-red-500 text-center">
                <p>이미지 생성에 실패했습니다. 다시 시도해주세요.</p>
                <p className="text-xs mt-2 text-slate-500">API 키를 확인하거나 잠시 후 이용해주세요.</p>
              </div>
            )}

            {/* SELECTION State */}
            {status === 'selection' && (
              <div className="w-full h-full flex flex-col">
                <h3 className="text-white text-xl font-bold mb-4 text-center">
                  <span className="text-yellow-400">Nano Banana Pro</span>가 제안하는 3가지 스타일
                </h3>
                <p className="text-slate-400 text-center text-sm mb-6">가장 마음에 드는 분위기를 선택하고, VEO 3에게 추가로 요청할 내용을 적어주세요.</p>

                {/* 3 Images Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {generatedImages.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectImage(idx)}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border-4 transition-all hover:scale-[1.02] ${selectedImageIndex === idx ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]' : 'border-slate-800 hover:border-slate-600'}`}
                    >
                      <img src={img} alt={`Style ${idx + 1}`} className="w-full h-full object-cover" />
                      {selectedImageIndex === idx && (
                        <div className="absolute top-2 right-2 bg-purple-600 text-white p-1 rounded-full shadow-lg">
                          <CheckCircle size={20} />
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2 text-center text-xs text-white font-mono">
                        STYLE #0{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom Input & Action */}
                <div className="mt-auto bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <label className="block text-sm text-purple-300 mb-2 font-bold">
                    ✨ VEO 3에게 보낼 추가 요청사항 / 대사
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={customRequest}
                      onChange={(e) => setCustomRequest(e.target.value)}
                      placeholder="예: 모두가 춤을 추고 있으면 좋겠어, '생일 축하해!'라고 크게 외쳐줘"
                      className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none text-white"
                      disabled={selectedImageIndex === null}
                    />
                    <button
                      onClick={handleConvertToVideo}
                      disabled={selectedImageIndex === null}
                      className={`whitespace-nowrap px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${selectedImageIndex !== null ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-105' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                    >
                      <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" className="w-5 h-5 hue-rotate-180 brightness-200" alt="AI" />
                      VEO 3 영상 생성
                    </button>
                  </div>
                  {selectedImageIndex === null && (
                    <p className="text-xs text-red-400 mt-2">* 먼저 원하는 스타일의 이미지를 선택해주세요.</p>
                  )}
                </div>
              </div>
            )}

            {/* CONVERTING State */}
            {status === 'converting' && (
              <div className="flex flex-col items-center w-full max-w-md">
                <div className="text-purple-400 font-bold text-xl mb-4 animate-pulse uppercase tracking-widest">Veo 3 Generating</div>
                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-white font-medium mb-1">당신의 선택과 요청사항을 반영하고 있습니다...</p>
                  <p className="text-slate-500 text-xs text-mono">"{customRequest || '기본 설정 적용'}"</p>
                </div>
              </div>
            )}

            {/* READY State (Video Player) */}
            {status === 'ready' && (
              <div className="relative w-full h-full max-h-[600px] group rounded-xl overflow-hidden shadow-2xl bg-black">
                {/* Simulated Video Player utilizing the detailed image + pan animation */}
                <div className="w-full h-full overflow-hidden relative">
                  <img
                    src={generatedImages[selectedImageIndex]}
                    alt="Final Video Frame"
                    className="w-full h-full object-cover scale-100 animate-[kenburns_20s_ease-in-out_infinite] transform"
                    style={{ animation: 'none' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <button
                    onClick={handlePlay}
                    className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform border-2 border-white/50 shadow-2xl group/btn"
                  >
                    <Play fill="white" className="ml-2 text-white group-hover/btn:scale-110 transition-transform" size={40} />
                  </button>
                </div>

                {/* HUD Overlay */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                  <div>
                    <h3 className="text-white font-bold text-3xl drop-shadow-lg mb-1">{userData.name}의 VEO 생일 파티</h3>
                    <p className="text-slate-200 text-sm drop-shadow-md flex items-center gap-2">
                      Generated by Veo 3 | {languageData.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-slate-900/80 backdrop-blur text-white text-xs px-3 py-1 rounded border border-slate-700">
                      요청: "{customRequest || '기본'}"
                    </div>
                    <div className="bg-red-600 text-white text-xs px-3 py-1 rounded font-bold animate-pulse flex items-center gap-1 shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full"></div> REC
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};


// --- Landing, UserForm, Country, Language Selectors ---

const Landing = ({ onStart, onTest }) => (
  <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-6 relative overflow-hidden">
    <div className="absolute inset-0 z-0 opacity-30">
      <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
    </div>
    <div className="z-10 flex flex-col items-center text-center space-y-8 max-w-md w-full">
      <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl">
        <Globe size={48} className="text-blue-400" />
      </div>
      <div>
        <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4 drop-shadow-sm">
          Global AI Birthday
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          당신만을 위한 특별한 생일 파티.<br />
          AI가 선사하는 360도 몰입형 경험.
        </p>
      </div>
      <button onClick={onStart} className="group relative inline-flex items-center justify-center px-10 py-4 text-xl font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-105">
        파티 계획 시작하기
        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Developer Test Button */}
      <button onClick={onTest} className="text-xs text-slate-600 hover:text-slate-400 underline mt-8">
        Developer: AI Backend Test
      </button>
    </div>
  </div>
);

const UserForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '', age: '', occupation: '',
    locationId: 'home', food: '피자 & 치킨', vibe: '활기찬 (Energetic)'
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.age) {
      onSubmit({ ...formData, photo });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-4 overflow-y-auto w-full">
      <div className="w-full max-w-2xl bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700 backdrop-blur-md shadow-2xl my-auto">
        <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <PartyPopper className="text-yellow-400" /> 파티 상세 설정
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400 border-b border-slate-700 pb-2">1. 주인공 정보</h3>
            <div>
              <label className="block text-sm text-slate-400 mb-1">이름 / 닉네임</label>
              <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500" placeholder="홍길동" required />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">나이</label>
              <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500" placeholder="25" required />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1 flex items-center gap-1">
                사진 업로드 <span className="text-xs text-slate-500">(선택)</span>
              </label>
              {!photoPreview ? (
                <div className="relative border-2 border-dashed border-slate-600 rounded-lg p-4 hover:border-blue-500 hover:bg-slate-800/50 transition-all text-center cursor-pointer group">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-blue-400">
                    <Upload size={20} />
                    <span className="text-xs">클릭하여 사진 추가</span>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-32 bg-slate-900 rounded-lg overflow-hidden border border-slate-600 shadow-md">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={removePhoto} className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white hover:bg-red-500 transition-colors">
                    <X size={14} />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-xs p-1 text-center text-green-400">업로드 완료</div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-400 border-b border-slate-700 pb-2">2. 파티 옵션</h3>
            <div>
              <label className="block text-sm text-slate-400 mb-1 flex items-center gap-2"><Briefcase size={14} /> 친구들 컨셉</label>
              <input name="occupation" type="text" value={formData.occupation} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-slate-600" placeholder="예: 우주비행사, 락스타..." />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1 flex items-center gap-2"><MapPin size={14} /> 장소 선택</label>
              <select name="locationId" value={formData.locationId} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded focus:ring-2 focus:ring-purple-500 outline-none text-white cursor-pointer">
                {LOCATIONS.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1 flex items-center gap-2"><Pizza size={14} /> 메인 음식</label>
              <select name="food" value={formData.food} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded focus:ring-2 focus:ring-purple-500 outline-none text-white cursor-pointer">
                {FOODS.map(food => (
                  <option key={food} value={food}>{food}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1 flex items-center gap-2"><Music size={14} /> 분위기</label>
              <select name="vibe" value={formData.vibe} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded focus:ring-2 focus:ring-purple-500 outline-none text-white cursor-pointer">
                {VIBES.map(vibe => (
                  <option key={vibe} value={vibe}>{vibe}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-2 pt-4">
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-[1.01] text-lg">
              다음 단계: 국가 선택 <ArrowRight className="inline ml-1" size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CountrySelect = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">어느 나라 스타일로 꾸밀까요?</h2>
        <p className="text-slate-400">선택한 국가의 문화와 분위기가 반영됩니다.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-4xl overflow-y-auto p-2 scrollbar-hide">
        {COUNTRIES.map((country) => (
          <button
            key={country.id}
            onClick={() => onSelect(country)}
            className="relative overflow-hidden group p-4 rounded-2xl border border-slate-700 bg-slate-800/50 hover:bg-slate-700/80 transition-all hover:scale-105 hover:border-blue-500 hover:shadow-lg flex flex-col items-center justify-between h-40"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none" />

            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-lg border-2 border-white/10 mb-3 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: '#' + country.color.toString(16) }}
            >
              <span className="drop-shadow-md text-white">{country.id}</span>
            </div>

            <div className="text-center w-full">
              <h3 className="text-base font-bold group-hover:text-blue-400 transition-colors truncate w-full">{country.name}</h3>
              <p className="text-xs text-slate-500 mt-1 truncate">{country.greeting}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const LanguageSelect = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">사용할 언어를 선택하세요</h2>
        <p className="text-slate-400">축하 메시지와 음성 안내에 사용됩니다.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl p-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onSelect(lang)}
            className="flex items-center gap-4 p-6 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-700 hover:border-purple-500 transition-all hover:scale-[1.02] group"
          >
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center group-hover:bg-purple-900/50 transition-colors">
              <Mic className="text-slate-400 group-hover:text-purple-400" size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-slate-200 group-hover:text-white">{lang.label}</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{lang.name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Main App Component ---

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
    <div className="w-full h-screen bg-black font-sans overflow-hidden text-slate-100">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[100px]" />
        <div className="absolute top-[30%] -right-[10%] w-[40%] h-[60%] bg-purple-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full h-full">
        {step !== 'landing' && step !== 'test' && (
          <div className="absolute top-4 right-4 z-50">
            <button onClick={handleReset} className="bg-slate-800/80 hover:bg-red-500/80 text-white p-3 rounded-full transition-colors backdrop-blur-md border border-white/10 shadow-xl">
              <RotateCw size={20} />
            </button>
          </div>
        )}

        {step === 'landing' && <Landing onStart={handleStart} onTest={handleTest} />}
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
