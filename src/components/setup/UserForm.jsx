import React, { useState } from 'react';
import { PartyPopper, Briefcase, MapPin, Pizza, Music, Upload, X, ArrowRight } from 'lucide-react';

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

const FOODS = ['피자 & 치킨', 'BBQ 파티', '고급 스시', '디저트 & 도넛', '타코 & 멕시칸', '한식 잔칫상', '딤섬 & 베이징덕', '카레 & 난'];
const VIBES = ['활기찬 (Energetic)', '로맨틱한 (Romantic)', '차분한 (Chill)', '신비로운 (Mysterious)', '광란의 (Chaotic)'];

export default function UserForm({ onSubmit }) {
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-cream text-gray-900 p-4 overflow-y-auto w-full font-sans">
            <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-xl my-auto">
                <h2 className="text-3xl font-serif font-bold text-center mb-6 flex items-center justify-center gap-2 text-gray-800">
                    <PartyPopper className="text-orange-500" /> 파티 상세 설정
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h3 className="text-lg font-serif font-semibold text-orange-600 border-b border-orange-100 pb-2">필수 정보 입력</h3>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1">이름 / 닉네임</label>
                            <input name="name" type="text" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all placeholder-gray-400" placeholder="홍길동" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1">나이</label>
                            <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all placeholder-gray-400" placeholder="25" required />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2 flex items-center gap-1">
                                사진 업로드 <span className="text-xs font-normal text-gray-400">(선택)</span>
                            </label>
                            {!photoPreview ? (
                                <div className="relative border-2 border-dashed border-stone-300 rounded-xl p-6 hover:border-orange-400 hover:bg-orange-50 transition-all text-center cursor-pointer group bg-stone-50">
                                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    <div className="flex flex-col items-center gap-2 text-stone-400 group-hover:text-orange-500">
                                        <Upload size={24} />
                                        <span className="text-sm font-medium">클릭하여 추억의 사진 추가</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full h-40 bg-stone-100 rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button type="button" onClick={removePhoto} className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-gray-600 hover:bg-red-100 hover:text-red-500 transition-colors shadow-sm">
                                        <X size={16} />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 text-xs py-1 text-center text-green-600 font-bold border-t border-stone-100">업로드 완료</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Removed Party Options Section per user request */}

                    <div className="md:col-span-1 md:col-start-1 md:col-end-2 md:w-full pt-6">
                        {/* Adjusted column span since we removed the second column */}
                    </div>

                    <div className="md:col-span-2 pt-2">
                        <button type="submit" className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-[1.01] transition-all text-lg flex items-center justify-center gap-2">
                            파티영상 만들기 <ArrowRight size={20} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
