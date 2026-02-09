import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Smartphone, MousePointer2 } from 'lucide-react';

const Gyro3DViewer = ({ imageUrl, videoUrl, alt = "3D View" }) => {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Motion values for rotation (Spring for smoothing)
    const rotateX = useSpring(0, { stiffness: 100, damping: 20 });
    const rotateY = useSpring(0, { stiffness: 100, damping: 20 });

    // Glare effect opacity based on rotation
    const glareOpacity = useTransform(rotateY, [-45, 0, 45], [0.1, 0, 0.1]);
    const glareX = useTransform(rotateY, [-45, 45], ['0%', '100%']);
    const glareY = useTransform(rotateX, [-45, 45], ['0%', '100%']);

    useEffect(() => {
        // Check if mobile device
        const checkMobile = () => {
            const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
            const mobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i));
            setIsMobile(mobile);

            // If not mobile/iOS that requires permission, we can just use mouse or standard orientation if available without prompt
            // But for iOS 13+, we need permission.
            if (!mobile) {
                setPermissionGranted(true); // Desktop mode enabled by default
            }
        };
        checkMobile();
    }, []);

    // Mouse Movement Handler (Desktop Fallback)
    const handleMouseMove = (e) => {
        if (isMobile) return;

        // Calculate rotation based on cursor position
        // Center is (0,0), movement range is ±45deg
        const { innerWidth, innerHeight } = window;
        const x = e.clientX - innerWidth / 2;
        const y = e.clientY - innerHeight / 2;

        const percentX = x / (innerWidth / 2); // -1 to 1
        const percentY = y / (innerHeight / 2); // -1 to 1

        // Reverse logic: Mouse left -> Image rotates left (showing right side of 3D object?)
        // "Window effect": Mouse left -> Look left -> Image rotates Y positive?
        // User requested: "Phone left -> Image right" (Window effect).
        // Mouse logic: if I move mouse left, I want to look left.

        rotateY.set(percentX * 45); // Limit to 45 deg
        rotateX.set(-percentY * 45); // Inverted X for natural feel (Mouse up -> Look up -> Rotate X negative)
    };

    // Device Orientation Handler
    const handleOrientation = (event) => {
        const { beta, gamma } = event;
        // beta: front-to-back tilt in degrees, [-180, 180]
        // gamma: left-to-right tilt in degrees, [-90, 90]

        if (beta === null || gamma === null) return;

        // Clamp/Limit values to ±45 degrees
        // We constrain the natural tilt range we care about
        const x = Math.min(Math.max(beta - 45, -45), 45); // Bias beta for holding phone at ~45deg
        // Actually, usually beta is ~90 when holding upright? No, holding generic phone: ~45-60 deg?
        // Let's assume 'center' is holding it somewhat upright.
        // Simplifying: just take beta and gamma, clamp. 
        // Ideally we'd calibrate "zero" on first load, but simpler to just clamp raw for now.

        const constrainedBeta = Math.min(Math.max(beta - 60, -45), 45); // Centered around 60deg tilt
        const constrainedGamma = Math.min(Math.max(gamma, -45), 45);

        // Invert signal for "Window Effect"?
        // Phone tilt Left (Gamma negative) -> View rotates to look Right? 
        // User said: "Phone left -> Image right"
        rotateX.set(constrainedBeta);
        rotateY.set(constrainedGamma); // Test direction
    };

    const requestAccess = () => {
        if (
            typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function'
        ) {
            DeviceOrientationEvent.requestPermission()
                .then((response) => {
                    if (response === 'granted') {
                        setPermissionGranted(true);
                        window.addEventListener('deviceorientation', handleOrientation);
                    } else {
                        alert('Sensor permission denied.');
                    }
                })
                .catch(console.error);
        } else {
            // Non-iOS 13+ devices
            setPermissionGranted(true);
            window.addEventListener('deviceorientation', handleOrientation);
        }
    };

    useEffect(() => {
        if (permissionGranted && isMobile) {
            window.addEventListener('deviceorientation', handleOrientation);
        } else if (!isMobile) {
            window.addEventListener('mousemove', handleMouseMove);
        }
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [permissionGranted, isMobile]);


    return (
        <div className="relative w-full h-full flex items-center justify-center perspective-1000 overflow-hidden rounded-2xl">

            {/* 3D Container */}
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="relative w-full h-full flex items-center justify-center transition-transform duration-100 ease-linear rounded-2xl shadow-xl hover:shadow-2xl"
            >
                {/* 3D Container - Inner */}
                <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden group">

                    {/* Background Layer (Moves MORE - distant) */}
                    <motion.div
                        style={{
                            // Window analogy:
                            // Move Mouse Left -> Look Left -> View rotates Y positive.
                            // If looking Left, objects on the Right should come into view?
                            // Simple parallax: Layers move at different speeds.
                            // Background moves LESS than foreground? Or MORE?
                            // User request: "Person moves a little, Background moves a lot for depth."
                            // Background Scale: 1.2
                            x: useTransform(rotateY, [-45, 45], ['15%', '-15%']),
                            y: useTransform(rotateX, [-45, 45], ['15%', '-15%']),
                            scale: 1.2
                        }}
                        className="absolute inset-0 w-full h-full"
                    >
                        {videoUrl ? (
                            <video src={videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        ) : (
                            <img src={backgroundImageUrl || "https://picsum.photos/800/600"} alt="Background" className="w-full h-full object-cover" />
                        )}
                    </motion.div>

                    {/* Foreground Layer (Moves LESS - close) */}
                    {foregroundImageUrl && (
                        <motion.div
                            style={{
                                x: useTransform(rotateY, [-45, 45], ['5%', '-5%']),
                                y: useTransform(rotateX, [-45, 45], ['5%', '-5%']),
                                scale: 1.1, // Slightly larger than 1, but less than background
                            }}
                            className="absolute inset-0 w-full h-full z-10" // z-index to be above background
                        >
                            <img src={foregroundImageUrl} alt="Foreground" className="w-full h-full object-contain" />
                        </motion.div>
                    )}

                    {/* Glare Effect Layer */}
                    <motion.div
                        style={{
                            opacity: glareOpacity,
                            background: `linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)`,
                            left: glareX,
                            top: glareY,
                        }}
                        className="absolute w-[200%] h-[200%] pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-overlay z-20"
                    />

                    {/* Shadow / Depth enhancement */}
                    <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none rounded-2xl z-30"></div>
                </div>
            </motion.div>

            {/* Permission Button for iOS */}
            {isMobile && !permissionGranted && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 text-center">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full">
                        <Smartphone className="w-12 h-12 text-orange-500 mx-auto mb-4 animate-pulse" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">몰입형 체험 시작하기</h3>
                        <p className="text-gray-600 mb-6 text-sm">
                            폰을 움직여 공간을 둘러보려면<br />센서 권한이 필요합니다.
                        </p>
                        <button
                            onClick={requestAccess}
                            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
                        >
                            권한 허용하고 시작
                        </button>
                    </div>
                </div>
            )}

            {/* Desktop Hint */}
            {!isMobile && (
                <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none opacity-50 text-white text-xs flex items-center justify-center gap-2 z-40">
                    <MousePointer2 size={12} /> Move mouse to look around
                </div>
            )}

        </div>
    );
};

export default Gyro3DViewer;
