import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function BetaForm({ onStart }) {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        target: 'parent',
        message: '',
        paid: false,
        privacy: false
    });

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
            alert('개인정보 수집 동의가 필요합니다.');
            return;
        }
        // Logic to save data could go here
        console.log("Beta Form Submitted:", formData);
        onStart(); // Proceed to main app flow
    };

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
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">당신의 사연을 기다립니다</h2>
                    <p className="text-gray-400">지금 신청하시면 무료 베타 테스터 자격을 드립니다.</p>
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
                            <label className="block text-sm text-gray-400 mb-1">이름</label>
                            <input
                                type="text" name="name" required
                                value={formData.name} onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder="홍길동"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">연락처</label>
                            <input
                                type="tel" name="contact" required
                                value={formData.contact} onChange={handleChange}
                                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder="010-0000-0000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">누구를 위한 선물인가요?</label>
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
                                        {opt === 'parent' && '부모님'}
                                        {opt === 'friend' && '친구'}
                                        {opt === 'lover' && '연인'}
                                        {opt === 'me' && '나 자신'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">전하고 싶은 메시지</label>
                        <textarea
                            name="message" rows="4"
                            value={formData.message} onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                            placeholder="그리운 마음을 담아주세요..."
                        ></textarea>
                    </div>

                    <div className="flex items-center gap-4 py-2 border-t border-gray-700 mt-4 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox" name="paid"
                                checked={formData.paid} onChange={handleChange}
                                className="rounded border-gray-600 bg-gray-900 text-orange-500 focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-400">추후 유료 서비스 이용 의향이 있습니다 (Yes/No)</span>
                        </label>
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox" name="privacy" required
                                checked={formData.privacy} onChange={handleChange}
                                className="rounded border-gray-600 bg-gray-900 text-orange-500 focus:ring-orange-500"
                            />
                            <span className="text-xs text-gray-500">개인정보 수집 및 이용에 동의합니다.</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-95"
                    >
                        베타 테스터 신청하기 (선착순 무료)
                    </button>
                </motion.form>
            </div>
        </section>
    );
}
