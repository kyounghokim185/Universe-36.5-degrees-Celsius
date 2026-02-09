import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play } from 'lucide-react';

export default function PortfolioSection() {
    const targetRef = useRef(null);
    const [isDesktop, setIsDesktop] = React.useState(false);

    React.useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-50%"]);

    const cases = [
        {
            id: 1,
            image: "https://picsum.photos/id/1025/600/800", // Dog?
            title: "Case 1: 할머니와 강아지",
            caption: '"강아지야 밥 먹었니?"',
            desc: "그리운 할머니의 사투리 음성이 그대로 담겼습니다."
        },
        {
            id: 2,
            image: "https://picsum.photos/id/1011/600/800", // Woman
            title: "Case 2: 휠체어 탄 친구",
            caption: '"내 목소리 어때?"',
            desc: "TTS 기술로 친구의 목소리를 복원했습니다."
        },
        {
            id: 3,
            image: "https://picsum.photos/id/237/600/800", // Dog for variety
            title: "Case 3: 가족 여행",
            caption: '"이번엔 어디로 갈까?"',
            desc: "오래된 앨범 속 가족 여행이 3D 공간으로 재탄생."
        },
        {
            id: 4,
            image: "https://picsum.photos/id/338/600/800",
            title: "Case 4: 졸업식",
            caption: '"졸업 축하한다 우리 딸"',
            desc: "부모님의 젊은 시절 목소리와 함께하는 졸업식."
        }
    ];

    return (
        <section ref={targetRef} className={`bg-stone-900 relative ${isDesktop ? 'h-[300vh]' : 'h-auto py-20'}`}>
            <div className={isDesktop ? "sticky top-0 flex h-screen items-center overflow-hidden" : "flex flex-col"}>

                {/* Title Section */}
                <div className={isDesktop ? "absolute top-10 left-10 md:left-20 z-10" : "px-6 mb-12 text-center"}>
                    <h2 className="text-4xl md:text-6xl font-serif text-white mb-4">당신의 마음이<br className="hidden md:block" /> 닿는 순간</h2>
                    <p className="text-gray-400">스크롤하여 감동적인 사연들을 만나보세요.</p>
                </div>

                {/* Cards Container */}
                <motion.div
                    style={isDesktop ? { x } : {}}
                    className={isDesktop ? "flex gap-8 pl-[40vw] md:pl-[30vw]" : "flex flex-col gap-10 px-6"}
                >
                    {cases.map((project) => (
                        <div key={project.id} className={`group relative flex-shrink-0 overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 ${isDesktop ? 'w-[600px] h-[70vh]' : 'w-full aspect-[3/4]'}`}>
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                            />

                            <div className="absolute inset-0 flex items-center justify-center">
                                <button className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                                    <Play className="w-10 h-10 text-white fill-white ml-2" />
                                </button>
                            </div>

                            <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
                                <h3 className="text-2xl text-white font-bold font-serif mb-2">{project.title}</h3>
                                <p className="text-orange-400 italic font-serif text-lg mb-2">{project.caption}</p>
                                <p className="text-gray-300 text-sm">{project.desc}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
