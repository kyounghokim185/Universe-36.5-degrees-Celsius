import React from 'react';

const COUNTRIES = [
    { id: 'KR', name: '대한민국 (Korea)', greeting: '생일 축하해', color: 'bg-red-50' }, // Using helper classes for logic below
    { id: 'US', name: '미국 (USA)', greeting: 'Happy Birthday', color: 'bg-blue-50' },
    { id: 'JP', name: '일본 (Japan)', greeting: 'お誕生日おめでとう', color: 'bg-red-50' },
    { id: 'CN', name: '중국 (China)', greeting: '生日快乐', color: 'bg-red-50' },
    { id: 'IN', name: '인도 (India)', greeting: 'जन्मदिन मुबारक', color: 'bg-orange-50' },
    { id: 'UK', name: '영국 (UK)', greeting: 'Happy Birthday', color: 'bg-blue-50' },
    { id: 'FR', name: '프랑스 (France)', greeting: 'Joyeux Anniversaire', color: 'bg-indigo-50' },
    { id: 'BR', name: '브라질 (Brazil)', greeting: 'Feliz Aniversário', color: 'bg-green-50' },
];

export default function CountrySelect({ onSelect }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-cream text-gray-900 p-6 font-sans">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-gray-800">어느 나라 스타일로 꾸밀까요?</h2>
                <p className="text-gray-500 font-medium">선택한 국가의 문화와 분위기가 반영됩니다.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full max-w-5xl">
                {COUNTRIES.map((country) => (
                    <button
                        key={country.id}
                        onClick={() => onSelect(country)}
                        className="relative overflow-hidden group p-6 rounded-2xl bg-white border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-between h-48"
                    >
                        <div className={`absolute top-0 right-0 w-20 h-20 ${country.color} rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110`} />

                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shadow-md border-4 border-white mb-4 z-10 bg-stone-100 group-hover:bg-white transition-colors">
                            <span className="text-gray-700 font-serif">{country.id}</span>
                        </div>

                        <div className="text-center w-full z-10">
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors truncate w-full mb-1">{country.name}</h3>
                            <p className="text-xs text-gray-400 font-serif italic">{country.greeting}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
