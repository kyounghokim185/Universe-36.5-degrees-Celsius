import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Smartphone, MousePointer2, Maximize, Minimize } from 'lucide-react';

const Gyro3DViewer = ({ imageUrl, videoUrl, backgroundImageUrl, foregroundImageUrl, alt = "3D View" }) => {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Motion values for rotation (Spring for smoothing)
    // Reduce movement range: The user wands 2x slower.
    // Damping: Higher = less oscillation/smoother. Stiffness: Lower = slower response.
    // Original: stiffness 100, damping 20.
    // New: stiffness 50, damping 30? Or just map input range differently.
    // Let's keep spring snappy but reduce the *output* displacement.
    const rotateX = useSpring(0, { stiffness: 60, damping: 25 }); // Slightly softer spring
    const rotateY = useSpring(0, { stiffness: 60, damping: 25 });

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

        // Reduced sensitivity for mouse too? Maybe just keep it snappy for mouse. 
        // But consistent behavior is good.
        rotateY.set(percentX * 20); // Limit to 20 deg (was 45) -> "2x slower" effect visually
        rotateX.set(-percentY * 20);
    };

    // Device Orientation Handler
    const handleOrientation = (event) => {
        const { beta, gamma } = event;
        // beta: front-to-back tilt in degrees, [-180, 180]
        // gamma: left-to-right tilt in degrees, [-90, 90]

        if (beta === null || gamma === null) return;

        // "2x slower" -> Map larger physical tilt to smaller visual rotation OR just clamp/reduce scale.
        // User said "Movement is too sensitive". 
        // So for 45 deg tilt, maybe we only rotate 22.5 deg visually?
        // Or we require 90 deg tilt to get full effect?

        const constrainedBeta = Math.min(Math.max(beta - 60, -45), 45);
        const constrainedGamma = Math.min(Math.max(gamma, -45), 45);

        // Apply reduction factor 0.5
        rotateX.set(constrainedBeta * 0.5);
        rotateY.set(constrainedGamma * 0.5);
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

    const toggleFullScreen = (e) => {
        e.stopPropagation(); // Prevent triggering other logic if nested
        setIsFullScreen(!isFullScreen);
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


    // Determine container classes based on full screen state
    // For mobile 'separate page' feel: fixed inset-0 z-50 bg-black.
    // 'Full Width of Cell Phone': On portrait, 16:9 image is small width-wise if 'contain', small height-wise if 'cover' (crops sides).
    // User wants "Image fits the screen". 
    // If we use `h-dvh` and `w-screen`, and `object-cover`, it fills the screen.
    // But aspect ratio? user mentioned 16:9 for view, 24:13 for image.

    const containerClasses = isFullScreen
        ? "fixed inset-0 z-[100] bg-black flex items-center justify-center transition-all duration-300"
        : "relative w-full h-full flex items-center justify-center perspective-1000 overflow-hidden rounded-2xl transition-all duration-300";

    // Dynamic scale logic for ratio:
    // Window: 16:9 (1.77)
    // Image: 24:13 (1.85) -> Very similar.
    // User wants "Edges hidden initially".
    // Let's force a window aspect ratio of 16/9, and scale the content up.

    // For Full Screen Mobile:
    // If portrait, `aspect-video` makes it a small box. 
    // Maybe force landscape rotation CSS or just let it fill 100% width?
    // "One separate page so it fits the cell phone screen" -> implies filling the screen?
    // If I fill the screen (portrait), a landscape image is cropped heavily or tiny.
    // Let's assume user rotates phone OR wants it to fill width.
    // But "Immersive" usually means filling the whole screen.
    // Let's use `w-full h-full` for the window frame in full screen, but `max-w-7xl` etc.
    // Actually, to simulate 16:9 window on full screen phone (likely 9:16), 
    // we probably want a "Cinema Mode" black bars top/bottom.
    // `aspect-video` on `w-full` does exactly that.

    // BUT user said "Phone screen... partially visible... immersion drops". 
    // This implies looking at a small box in the middle of a white/other page.
    // Full screen overlay fixes this.

    // "Image borders... 24:13... 16:9... gyro reveals rest"
    // This implies masking.

    // Logic: 
    // Outer 'Window': Aspect Ratio 16/9 (or screen ratio in full screen?).
    // Inner 'Content': Scale > 1 (e.g. 1.2 or 1.3 to simulated 24:13 coverage).

    return (
        <div className={containerClasses} onClick={(e) => isFullScreen && e.stopPropagation()}>

            {/* Close/Minimize Button */}
            <button
                onClick={toggleFullScreen}
                className="absolute top-4 right-4 z-[110] p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors shadow-lg group"
                title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
            >
                {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>

            {/* 3D Container - Inner */}
            {/* Aspect Ratio Handling */}
            {/* If FullScreen, we want to maximize size but keep aspect ratio 16:9 IF that is the "window". 
                Or do we want the window to be the SCREEN?
                User said "24:13 image... 16:9 view". 
                If phone is 9:16, 16:9 view is tiny strip. 
                Maybe "16:9 view" is for desktop/embedded. 
                For mobile full screen, maybe just "Fill Screen"? 
                Let's try: Mobile Full Screen -> Fill Screen (w-full h-full).
                Desktop/Embedded -> Aspect Video (16:9).
            */}
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className={`relative flex items-center justify-center transition-transform duration-100 ease-linear shadow-xl ${isFullScreen
                        ? 'w-full h-full' // Full screen: fill viewport. 
                        : 'w-full h-full rounded-2xl' // Embedded: fill parent
                    }`}
            >
                {/* The "Window" / Mask */}
                {/* User wants 24:13 image (1.85) inside 16:9 (1.77) frame initially? 
                   Actually 24:13 is WIDER. So if we fit height, sides are cut.
                   If we fit width, top/bottom are cut (but 16:9 is taller than 24:13 relative to width).
                   24/13 = 1.846. 16/9 = 1.777. 
                   So 24:13 is wider. 
                   If we show 16:9 crop, we lose sides. Gyro reveals sides. CORRECT.
                */}
                <div className={`relative w-full h-full bg-black overflow-hidden group ${isFullScreen ? '' : 'rounded-2xl' /* No rounded corners in immersive full screen */
                    }`}>

                    {/* Background Layer (Moves MORE - distant) */}
                    <motion.div
                        style={{
                            // Reduce movement range to match slowed sensitivity? 
                            // Or keep it to maximize "reveal"?
                            // If sensitivity is low, we need large movement range to see edges? 
                            // No, sensitivity low = hard to reach edges.
                            // User wants "Slower". 
                            // Disconnect "Sensitivity" (jitter/speed) from "Range" (max reveal).
                            // I reduced input sensitivity. 
                            // Let's keep output range reasonable.
                            x: useTransform(rotateY, [-45, 45], ['10%', '-10%']), // Was 15%. Reduced slightly.
                            y: useTransform(rotateX, [-45, 45], ['10%', '-10%']),
                            scale: 1.3 // Increased scale to ensure coverage (simulating 24:13 > 16:9 overscan)
                        }}
                        className="absolute inset-0 w-full h-full"
                    >
                        {videoUrl ? (
                            <video src={videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                        ) : (
                            <img src={backgroundImageUrl || imageUrl || "https://picsum.photos/800/600"} alt="Background" className="w-full h-full object-cover" />
                        )}
                    </motion.div>

                    {/* Foreground Layer (Moves LESS - close) */}
                    {foregroundImageUrl && (
                        <motion.div
                            style={{
                                x: useTransform(rotateY, [-45, 45], ['5%', '-5%']),
                                y: useTransform(rotateX, [-45, 45], ['5%', '-5%']),
                                scale: 1.15,
                            }}
                            className="absolute inset-0 w-full h-full z-10"
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
                    <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none z-30"></div>
                </div>
            </motion.div>

            {/* Permission Button for iOS */}
            {isMobile && !permissionGranted && (
                <div className="absolute inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 text-center">
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
            {!isMobile && !isFullScreen && (
                <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none opacity-50 text-white text-xs flex items-center justify-center gap-2 z-40">
                    <MousePointer2 size={12} /> Move mouse to look around
                </div>
            )}

        </div>
    );
};

export default Gyro3DViewer;
