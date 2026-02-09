import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, ShieldCheck } from 'lucide-react';

export default function MechanismSection() {
    return (
        <section className="py-24 bg-cream overflow-hidden">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-16">

                    {/* Text Content */}
                    <div className="flex-1 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-orange-600 font-bold tracking-wider uppercase text-sm">Technology</span>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2 mb-6">안전하고, 생생하게</h2>
                            <p className="text-gray-600 text-lg">최첨단 AI 기술과 자이로 센서를 결합하여<br />가장 자연스러운 추억 경험을 제공합니다.</p>
                        </motion.div>

                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="flex gap-4"
                            >
                                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-gray-800">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">4.5D Gyro Viewer</h3>
                                    <p className="text-gray-600">폰을 움직이면 공간이 보입니다. 가상 현실 장비 없이도<br />몰입감 넘치는 3D 공간을 경험할 수 있습니다.</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                                className="flex gap-4"
                            >
                                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md text-gray-800">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Safety First</h3>
                                    <p className="text-gray-600">딥페이크 악용 방지 & 워터마크 기술 적용.<br />따뜻한 추억 보존을 위한 윤리적 AI 원칙을 준수합니다.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Abstract Illustration/Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="flex-1 relative"
                    >
                        {/* Abstract Phones Grid */}
                        <div className="relative w-full aspect-square max-w-md mx-auto">
                            <div className="absolute inset-0 bg-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
                            <img
                                src="https://picsum.photos/id/48/600/600"
                                alt="Technology"
                                className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700"
                            />

                            {/* Floating Elements */}
                            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl z-20 animate-bounce" style={{ animationDuration: '3s' }}>
                                <Smartphone className="w-8 h-8 text-orange-500" />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl z-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                                <ShieldCheck className="w-8 h-8 text-blue-500" />
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
