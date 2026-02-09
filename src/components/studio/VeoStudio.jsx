import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Loader2, CheckCircle, Smartphone } from 'lucide-react';
import Gyro3DViewer from '../Gyro3DViewer';

// API Helpers
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
        const response = await fetch('/api/text/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptText })
        });

        if (!response.ok) {
            // Fallback for demo if backend isn't ready
            return "A realistic birthday party scene.";
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
        const response = await fetch('/api/ai/generate/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) return null;

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

export default function VeoStudio({ userData, countryData, languageData, partyOptions, lang = 'ko' }) {
    const [status, setStatus] = useState('idle'); // idle, prompting, imagining, selection, converting, ready
    const [prompt, setPrompt] = useState('');
    const [generatedImages, setGeneratedImages] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [customRequest, setCustomRequest] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const startGeneration = async () => {
            setStatus('prompting');
            const generatedPrompt = await generateVeoPrompt(userData, countryData, languageData, partyOptions);
            if (!isMounted) return;
            setPrompt(generatedPrompt);

            setStatus('imagining');

            const imagePromises = Array(3).fill(0).map(() => generateVeoImage(generatedPrompt));
            const images = await Promise.all(imagePromises);

            if (!isMounted) return;

            const validImages = images.filter(img => img !== null);
            // Demo fallback if API fails
            if (validImages.length === 0) {
                // Use placeholder images for demo if API fails so UI can be tested
                const demoImages = [
                    "https://picsum.photos/seed/p1/800/600",
                    "https://picsum.photos/seed/p2/800/600",
                    "https://picsum.photos/seed/p3/800/600"
                ];
                setGeneratedImages(demoImages);
                setStatus('selection');
            } else {
                setGeneratedImages(validImages);
                setStatus('selection');
            }
        };

        startGeneration();

        return () => { isMounted = false; };
    }, [userData, countryData, languageData, partyOptions]);

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
                    return old + 2;
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [status]);

    const handleConvertToVideo = () => {
        if (selectedImageIndex !== null) {
            setStatus('converting');
        }
    };

    const str = {
        ko: {
            process: {
                prompting: '프롬프트 최적화 중...',
                imagining: '3가지 스타일 초안 생성 중...',
                generating: '추억을 그리는 중...',
                subtext: '당신의 이야기를 바탕으로\n3가지 파티 분위기를 만들고 있습니다.',
                done: '초안 생성 완료.',
                waiting: '사용자 선택 대기 중...',
                converting: 'VEO 3 렌더링 중...',
                complete: '영상 생성 완료!'
            },
            selection: {
                title: '어떤 분위기가 마음에 드시나요?',
                subtitle: '가장 마음에 드는 사진을 선택해주세요.',
                request: '✨ 추가 요청사항 (선택)',
                placeholder: '예: 다 같이 웃으면서 박수 쳐주면 좋겠어',
                btn: '생생한 영상으로 만들기'
            },
            converting: {
                title: 'VEO 3 Generating...',
                desc1: '시간을 되돌리고 있습니다...',
                desc2: '최고 화질로 렌더링 중입니다.'
            }
        },
        en: {
            process: {
                prompting: 'Optimizing prompt...',
                imagining: 'Generating 3 style drafts...',
                generating: 'Visualizing memory...',
                subtext: 'Creating 3 party atmospheres\nbased on your story.',
                done: 'Drafts generated.',
                waiting: 'Waiting for selection...',
                converting: 'VEO 3 Rendering...',
                complete: 'Video is ready!'
            },
            selection: {
                title: 'Which vibe do you like?',
                subtitle: 'Select your favorite scene.',
                request: '✨ Custom Request (Optional)',
                placeholder: 'e.g., Everyone clapping and laughing',
                btn: 'Generate Video'
            },
            converting: {
                title: 'VEO 3 Generating...',
                desc1: 'Rewinding time...',
                desc2: 'Rendering in high quality.'
            }
        }
    };
    const t = str[lang] || str.ko;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-cream p-4 font-sans">
            <div className="max-w-6xl w-full bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85dvh]">

                {/* Header */}
                <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <div className="flex items-center gap-2 font-bold">
                        <Sparkles className="text-orange-400" size={20} />
                        <span className="text-gray-800">Nano Banana Pro</span>
                        <ArrowRight size={16} className="text-stone-400" />
                        <span className="text-orange-600 font-serif">Veo 3 Studio</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-stone-500 font-medium hidden md:flex uppercase tracking-wide">
                        <span className="py-1 px-3 bg-stone-100 rounded-full">LOC: {partyOptions.locationName}</span>
                        <span className="py-1 px-3 bg-stone-100 rounded-full">LANG: {languageData.name}</span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

                    {/* Left: Log Area (Warm Terminal) */}
                    <div className="w-full md:w-1/3 bg-stone-50 p-6 border-r border-stone-100 overflow-y-auto font-mono text-xs md:text-sm max-h-[150px] md:max-h-full border-b md:border-b-0 border-stone-200">
                        <div className="text-stone-400 mb-4 uppercase tracking-wider font-bold text-xs flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400"></div> System Log
                        </div>

                        <div className="space-y-3">
                            <div className="text-stone-600">[Info] Workflow initialized</div>
                            <div className="text-stone-800 font-bold">User: {userData.name} ({userData.age})</div>

                            {status === 'prompting' && <div className="text-orange-500 animate-pulse">{t.process.prompting}</div>}

                            {status === 'imagining' && (
                                <div className="text-orange-500 animate-pulse">
                                    {t.process.imagining}
                                </div>
                            )}

                            {generatedImages.length > 0 && <div className="text-stone-600">[Done] {t.process.done}</div>}

                            {status === 'selection' && <div className="text-blue-500 animate-pulse">{t.process.waiting}</div>}

                            {status === 'converting' && (
                                <div className="text-purple-600 bg-purple-50 p-2 rounded">
                                    <div className="mb-1 font-bold">{t.process.converting}</div>
                                    <div>Selection: Style #{selectedImageIndex + 1}</div>
                                    <div>Request: "{customRequest || 'None'}"</div>
                                </div>
                            )}
                            {status === 'ready' && <div className="text-green-600 font-bold">[Complete] {t.process.complete}</div>}
                        </div>

                        {prompt && (
                            <div className="mt-6 pt-6 border-t border-stone-200">
                                <div className="text-stone-400 text-xs mb-2">PROMPT DATA</div>
                                <div className="text-stone-500 text-xs break-words leading-relaxed">{prompt.substring(0, 150)}...</div>
                            </div>
                        )}
                    </div>

                    {/* Right: Interaction Area */}
                    <div className="w-full md:w-2/3 relative bg-white flex flex-col items-center p-4 md:p-8 gap-6 overflow-y-auto flex-1">

                        {/* Loading Stylized */}
                        {(status === 'prompting' || status === 'imagining') && (
                            <div className="flex flex-col items-center gap-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-75"></div>
                                    <Loader2 className="relative animate-spin text-orange-500" size={56} />
                                </div>
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-serif font-bold text-gray-800">{t.process.generating}</h3>
                                    <p className="text-stone-500 whitespace-pre-line">{t.process.subtext}</p>
                                </div>
                            </div>
                        )}

                        {/* SELECTION State */}
                        {status === 'selection' && (
                            <div className="w-full h-full flex flex-col">
                                <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2 text-center">
                                    {t.selection.title}
                                </h3>
                                <p className="text-stone-500 text-center text-sm mb-8">{t.selection.subtitle}</p>

                                <div className="grid grid-cols-3 gap-6 mb-8">
                                    {generatedImages.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedImageIndex(idx)}
                                            className={`relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 ${selectedImageIndex === idx ? 'ring-4 ring-orange-400 ring-offset-2' : 'hover:ring-2 hover:ring-orange-200'}`}
                                        >
                                            <img src={img} alt={`Style ${idx + 1}`} className="w-full h-full object-cover" />
                                            {selectedImageIndex === idx && (
                                                <div className="absolute top-2 right-2 bg-orange-500 text-white p-1 rounded-full shadow-lg">
                                                    <CheckCircle size={20} />
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-center text-xs text-white font-medium">
                                                STYLE {idx + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto bg-stone-50 p-6 rounded-2xl border border-stone-100">
                                    <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">
                                        {t.selection.request}
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <input
                                            type="text"
                                            value={customRequest}
                                            onChange={(e) => setCustomRequest(e.target.value)}
                                            placeholder={t.selection.placeholder}
                                            className="flex-1 bg-white border border-stone-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none text-gray-800 shadow-sm"
                                            disabled={selectedImageIndex === null}
                                        />
                                        <button
                                            onClick={handleConvertToVideo}
                                            disabled={selectedImageIndex === null}
                                            className={`whitespace-nowrap px-8 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 ${selectedImageIndex !== null ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105' : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}
                                        >
                                            <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" className="w-5 h-5" alt="AI" />
                                            {t.selection.btn}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CONVERTING State */}
                        {status === 'converting' && (
                            <div className="flex flex-col items-center w-full max-w-md space-y-6">
                                <div className="text-orange-500 font-serif font-bold text-2xl animate-pulse">{t.converting.title}</div>
                                <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-75 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-600 font-medium mb-1">{t.converting.desc1}</p>
                                    <p className="text-stone-400 text-xs">{t.converting.desc2}</p>
                                </div>
                            </div>
                        )}

                        {/* READY State */}
                        {status === 'ready' && (
                            <div className="relative w-full h-full max-h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-black">
                                {/* Use Gyro3DViewer with the selected image instead of video */}
                                <Gyro3DViewer
                                    // Use selected image. If index is null (fallback), use first.
                                    imageUrl={generatedImages[selectedImageIndex] || generatedImages[0]}
                                    // We don't have separate layers for this generated content yet, 
                                    // so we pass the same image or just one.
                                    // To make it look "deep", we can pass it as background.
                                    backgroundImageUrl={generatedImages[selectedImageIndex] || generatedImages[0]}
                                // No foreground for now unless we have segmentation.
                                />
                                <div className="absolute top-6 left-6 z-10 pointer-events-none">
                                    <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                        Interactive 360° Memory
                                    </span>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
