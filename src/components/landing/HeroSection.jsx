import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Play } from 'lucide-react';
import Gyro3DViewer from '../Gyro3DViewer';

export default function HeroSection({ onStart, lang }) {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const str = {
        ko: {
            badge: 'AI Birthday Experience',
            title1: '만약, 그날의 사진 속',
            title2: '주인공과 눈을 맞춘다면?',
            desc1: '당신의 스마트폰을 기울여보세요.',
            desc2: '멈춰있는 추억에 숨결을 불어넣고, 다시 만나보세요.',
            cta: '지금 무료로 체험하기',
            more: '더 알아보기'
        },
        en: {
            badge: 'AI Birthday Experience',
            title1: 'What if you could meet',
            title2: 'the memory face to face?',
            desc1: 'Tilt your smartphone.',
            desc2: 'Breathe life into frozen memories and meet them again.',
            cta: 'Start Free Trial',
            more: 'Learn More'
        }
    };
    const t = str[lang] || str.ko;

    return (
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-cream relative overflow-hidden font-sans">
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-orange-200/20 rounded-full blur-[120px] animate-blob"></div>
                <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] bg-amber-200/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
            </div>

            <div className="z-10 w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex-1 text-center md:text-left space-y-6"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 font-bold text-sm tracking-wide mb-2 shadow-sm border border-orange-200">
                        {t.badge}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 leading-tight">
                        {t.title1}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">{t.title2}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed max-w-xl mx-auto md:mx-0">
                        {t.desc1}<br />
                        {t.desc2}
                    </p>

                    <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button
                            onClick={onStart}
                            className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
                        >
                            <Play size={20} fill="currentColor" />
                            {t.cta}
                        </button>
                        <button
                            onClick={() => {
                                const serviceSection = document.getElementById('service-section'); // Need to ensure ID exists or just scroll down
                                if (serviceSection) serviceSection.scrollIntoView({ behavior: 'smooth' });
                                else window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
                            }}
                            className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors shadow-md flex items-center justify-center gap-2"
                        >
                            {t.more}
                        </button>
                    </div>
                </motion.div>

                {/* Interactive 3D Viewer */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex-1 w-full max-w-md md:max-w-lg aspect-[3/4] relative perspective-1000"
                >
                    {/* Photo Frame Effect */}
                    <div className="absolute inset-0 bg-white p-3 pb-16 shadow-2xl rounded-sm transform rotate-1 border border-gray-100">
                        <div className="w-full h-full bg-gray-100 overflow-hidden relative">
                            {/* GYRO VIEWER INTEGRATION */}
                            <Gyro3DViewer
                                // Ideally we'd have a separate background and foreground
                                // For now we can use the same image or a slightly different one to test effect
                                // Let's use a nice old photo background and a clearer subject if possible
                                // But since we are using picsum, we'll sim it.
                                backgroundImageUrl="https://topics.images.site/image/v1/r/s/url/d3ebfa79-d59e-4b77-8025-5d930225d301" // Old room background
                                foregroundImageUrl="https://picsum.photos/id/64/800/1000?grayscale" // Person (Transparent PNG ideally)
                                // In reality, without a transparent PNG, the foreground will just block the background. 
                                // User said: "If I input background and foreground (transparent png) separately..."
                                // So I should set it up to accept them. 
                                // Since I don't have a real transparent PNG handy url, I will just use the old logic for now or try to finding one.
                                // Actually, let's just use the `imageUrl` prop I left for backward compat if they don't provide both?
                                // No, I updated the code to use distinct props.
                                // Let's use a sample transparent PNG for demo if possible, or just the main image as background.

                                // Reverting to single image usage for now as default, but structure supports split.
                                // To make it look good for the user immediately:
                                // Let's use the single image as background (scaled up) and maybe a "frame" or overlay as foreground?
                                // Actually, I'll pass the SAME image to BG, and nothing to FG for now, 
                                // UNLESS I can find a good transparent portrait.

                                // Let's use a specific demo set if available, otherwise just standard.
                                imageUrl="https://picsum.photos/id/64/800/1200?grayscale"
                            />

                            {/* Overlay Texture (Old Photo) */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-30 pointer-events-none mix-blend-overlay"></div>
                        </div>

                        <div className="absolute bottom-4 left-0 right-0 text-center font-handwriting text-gray-500 font-serif italic text-lg">
                            Our precious memory, 2024
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute -top-6 -right-6 w-20 h-20 bg-orange-400 rounded-full blur-xl opacity-40 z-[-1]"
                    />
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity, y: y1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 flex flex-col items-center gap-2"
            >
                <span className="text-xs uppercase tracking-widest">Scroll Down</span>
                <ArrowDown className="animate-bounce" size={20} />
            </motion.div>
        </section>
    );
}
