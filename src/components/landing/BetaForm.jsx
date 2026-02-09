import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Volume2, StopCircle } from 'lucide-react';

export default function BetaForm({ onStart, lang = 'ko' }) {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        target: 'parent',
        message: '',
        paid: false,
        privacy: false
    });
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = lang === 'ko' ? 'ko-KR' : 'en-US';

            recognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setFormData(prev => ({
                        ...prev,
                        message: prev.message + ' ' + finalTranscript
                    }));
                }
            };

            recognition.onend = () => {
                // Restart if still listening? No, auto-stop is better for UX or handle manually.
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, [lang]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleSpeak = () => {
        if (!formData.message) return;
        const utterance = new SpeechSynthesisUtterance(formData.message);
        utterance.lang = lang === 'ko' ? 'ko-KR' : 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.privacy) {
            alert(lang === 'ko' ? '개인정보 수집 동의가 필요합니다.' : 'Privacy policy agreement required.');
            return;
        }
        onStart(formData);
    };

    const t = {
        ko: {
            title: '당신의 사연을 기다립니다',
            subtitle: '지금 신청하시면 무료 베타 테스터 자격을 드립니다.',
            name: '이름',
            contact: '연락처',
            targetLabel: '누구를 위한 선물인가요?',
            targets: { parent: '부모님', friend: '친구', lover: '연인', me: '나 자신' },
            messageLabel: '전하고 싶은 메시지',
            messagePlaceholder: '그리운 마음을 담아주세요... (음성 입력 가능)',
            paid: '추후 유료 서비스 이용 의향이 있습니다',
            privacy: '개인정보 수집 및 이용에 동의합니다.',
            btn: '베타 테스터 신청하기 (선착순 무료)'
        },
        en: {
            title: 'Share Your Story',
            subtitle: 'Apply now for free beta access.',
            name: 'Name',
            contact: 'Contact',
            targetLabel: 'Who is this for?',
            targets: { parent: 'Parent', friend: 'Friend', lover: 'Partner', me: 'Myself' },
            messageLabel: 'Message',
            messagePlaceholder: 'Share your feelings... (Voice input available)',
            paid: 'I am interested in paid service later',
            privacy: 'I agree to the privacy policy.',
            btn: 'Apply for Beta (Free)'
        }
    }[lang];

    return (
        <section className="py-24 bg-gray-900 text-white flex items-center justify-center px-4">
            <div className="max-w-xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t.title}</h2>
                    <p className="text-gray-400">{t.subtitle}</p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    onSubmit={handleSubmit}
                    className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 shadow-2xl space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">{t.name}</label>
                            <input
                                type="text" name="name" required
                                value={formData.name} onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder={lang === 'ko' ? "홍길동" : "Full Name"}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">{t.contact}</label>
                            <input
                                type="tel" name="contact" required
                                value={formData.contact} onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder="010-0000-0000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">{t.targetLabel}</label>
                        <div className="flex gap-4 flex-wrap">
                            {['parent', 'friend', 'lover', 'me'].map((opt) => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer bg-gray-900 px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-500">
                                    <input
                                        type="radio" name="target" value={opt}
                                        checked={formData.target === opt}
                                        onChange={handleChange}
                                        className="text-orange-500 focus:ring-orange-500"
                                    />
                                    <span className="capitalize text-sm text-gray-300">
                                        {t.targets[opt]}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm text-gray-400">{t.messageLabel}</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={toggleListening}
                                    className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-700 text-gray-400 hover:text-white'}`}
                                    title="Voice Input"
                                >
                                    {isListening ? <StopCircle size={16} /> : <Mic size={16} />}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSpeak}
                                    className="p-2 bg-gray-700 text-gray-400 rounded-full hover:text-white transition-colors"
                                    title="Read Back"
                                >
                                    <Volume2 size={16} />
                                </button>
                            </div>
                        </div>
                        <textarea
                            name="message" rows="4"
                            value={formData.message} onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                            placeholder={t.messagePlaceholder}
                        ></textarea>
                    </div>

                    <div className="flex items-center gap-4 py-2 border-t border-gray-700 mt-4 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox" name="paid"
                                checked={formData.paid} onChange={handleChange}
                                className="rounded border-gray-600 bg-gray-900 text-orange-500 focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-400">{t.paid}</span>
                        </label>
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox" name="privacy" required
                                checked={formData.privacy} onChange={handleChange}
                                className="rounded border-gray-600 bg-gray-900 text-orange-500 focus:ring-orange-500"
                            />
                            <span className="text-xs text-gray-500">{t.privacy}</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-95"
                    >
                        {t.btn}
                    </button>
                </motion.form>
            </div>
        </section>
    );
}
