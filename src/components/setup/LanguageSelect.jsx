import React from 'react';
import { Mic } from 'lucide-react';

const LANGUAGES = [
    { id: 'ko-KR', name: '한국어 (Korean)', label: '한국어' },
    { id: 'en-US', name: '영어 (English)', label: 'English' },
    { id: 'ja-JP', name: '일본어 (Japanese)', label: '日本語' },
    { id: 'zh-CN', name: '중국어 (Chinese)', label: '中文' },
    { id: 'es-ES', name: '스페인어 (Spanish)', label: 'Español' },
    { id: 'fr-FR', name: '프랑스어 (French)', label: 'Français' },
];

export default function LanguageSelect({ onSelect }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-cream text-gray-900 p-6 font-sans">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-gray-800">사용할 언어를 선택하세요</h2>
                <p className="text-gray-500 font-medium">축하 메시지와 음성 안내에 사용됩니다.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full max-w-4xl">
                {LANGUAGES.map((lang) => (
                    <button
                        key={lang.id}
                        onClick={() => onSelect(lang)}
                        className="flex items-center gap-5 p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 hover:-translate-y-1 group text-left"
                    >
                        <div className="w-14 h-14 bg-stone-50 rounded-full flex items-center justify-center group-hover:bg-orange-50 transition-colors shadow-inner">
                            <Mic className="text-stone-400 group-hover:text-orange-500" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{lang.label}</h3>
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">{lang.name}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
