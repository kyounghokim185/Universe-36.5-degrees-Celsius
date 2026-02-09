import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Frame, MessageCircleHeart } from 'lucide-react';

export default function ServiceSection() {
    const cards = [
        {
            icon: <Gift className="w-8 h-8 text-orange-500" />,
            title: "살아있는 1:1 축하 메시지",
            desc: "그리운 사람이 직접 전하는 생일 축하를 받아보세요."
        },
        {
            icon: <Frame className="w-8 h-8 text-orange-500" />,
            title: "그리운 목소리와 재회",
            desc: "사진 속 그 모습 그대로, 따뜻한 목소리를 들려드립니다."
        },
        {
            icon: <MessageCircleHeart className="w-8 h-8 text-orange-500" />,
            title: "마음의 소리를 전하다 (AAC)",
            desc: "말하지 못했던 진심을 AI 기술로 전해보세요."
        }
    ];

    return (
        <section id="service-section" className="py-24 bg-white font-sans">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-orange-600 font-bold tracking-wider uppercase text-sm">Services</span>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mt-3 mb-6">기술, 따뜻한 온기가 되다</h2>
                    <div className="w-24 h-1 bg-orange-400 mx-auto rounded-full"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ y: -15, boxShadow: "0 20px 40px -5px rgba(249, 115, 22, 0.15)" }}
                            className="bg-cream p-8 md:p-10 rounded-3xl shadow-lg border border-transparent hover:border-orange-200 transition-all duration-300 group cursor-pointer"
                        >
                            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-md text-orange-500 group-hover:scale-110 transition-transform duration-300 group-hover:bg-orange-50">
                                {card.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif group-hover:text-orange-700 transition-colors">{card.title}</h3>
                            <p className="text-gray-600 leading-relaxed font-medium text-lg">{card.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
