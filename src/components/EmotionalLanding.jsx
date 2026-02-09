import React, { useEffect } from 'react';
import HeroSection from './landing/HeroSection';
import ServiceSection from './landing/ServiceSection';
import MechanismSection from './landing/MechanismSection';
import PortfolioSection from './landing/PortfolioSection';
import BetaForm from './landing/BetaForm';

export default function EmotionalLanding({ onStart, onTest, onBetaSubmit, lang }) {
    // Simple scroll progress indicator could be added here if needed

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="w-full min-h-screen bg-cream font-sans">
            <HeroSection onStart={onStart} lang={lang} />
            <ServiceSection lang={lang} />
            <MechanismSection lang={lang} />
            {/* Portfolio Section uses horizontal scroll, needs careful layout */}
            <PortfolioSection lang={lang} />
            <div id="beta-form">
                <BetaForm onStart={onBetaSubmit} lang={lang} />
            </div>

            {/* Footer / Dev Link */}
            <div className="bg-gray-900 py-6 text-center border-t border-gray-800">
                <p className="text-gray-500 text-xs mb-2">© 2024 Memory AI. All rights reserved.</p>
                <button onClick={onTest} className="text-xs text-gray-600 hover:text-gray-400 underline">
                    Developer: AI Backend Test
                </button>
            </div>
        </div>
    );
}
