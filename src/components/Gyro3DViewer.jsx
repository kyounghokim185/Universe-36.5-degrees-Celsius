import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Smartphone, MousePointer2, Maximize, Minimize, Plus, Minus } from 'lucide-react';

const Gyro3DViewer = ({ imageUrl, videoUrl, backgroundImageUrl, alt = "Panoramic View" }) => {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const containerRef = useRef(null);

    // Configuration
    const SCALE = 1.5; // Image is 50% larger than container
    const MAX_OFFSET_PERCENT = 20; // Shift up to +/- 20% (since scale is 1.5, we have +/- 25% room, keep 20% safe)

    // Motion Values for X and Y offset (in percentage)
    const x = useSpring(0, { stiffness: 50, damping: 20 });
    const y = useSpring(0, { stiffness: 50, damping: 20 });

    // Inputs (Separate logic for merging inputs if needed, but here we just set raw target)
    // We'll treat Gyro as "Basis" and Touch/Mouse as "Offset" or just absolute override?
    // User wants "Touch OR Rotate". 
    // Let's implement Drag for Touch, and Tilt for Gyro. They can fight or additive. 
    // Additive is intuitive: Tilt sets base, Touch adjusts. 
    // BUT usually it's one or other. 
    // Let's do: Touch Drag *adds* to a ref, Gyro *adds*?
    // Simplest: Gyro sets Target. Drag *overrides* temporarily?
    // Actually, "Touch to move" implies sticky drag. "Rotate to move" implies camera control.
    // Let's make them additive via MotionValues?
    // Simpler approach: 
    // Gyro maps to a range. 
    // Drag maps to a range. 
    // We sum them? Or just have one source of truth?
    // Let's try: Touch Drag is PRIMARY. Gyro is SECONDARY (Subtle shift). 
    // Or User wants "Gyro INSTEAD simple...". 
    // "Touch OR Rotate 45 deg".

    // Let's use `drag` prop from framer-motion for touch.
    // And use `useEffect` for gyro to update `x` and `y` constraints? 
    // Wait, if I drag, I change position. If I tilt, I change position.
    // Let's map Gyro to a value `gyroX`, `gyroY`.
    // Let's map Drag to `dragX`, `dragY`.
    // Result = `gyroX + dragX`.

    const gyroX = useMotionValue(0);
    const gyroY = useMotionValue(0);
    const dragX = useMotionValue(0);
    const dragY = useMotionValue(0);

    // Combined transform
    const xCombined = useTransform([gyroX, dragX], (latest) => latest[0] + latest[1]);
    const yCombined = useTransform([gyroY, dragY], (latest) => latest[0] + latest[1]);

    // Apply spring to the combined output for smoothness
    const xSpring = useSpring(xCombined, { stiffness: 40, damping: 20 });
    const ySpring = useSpring(yCombined, { stiffness: 40, damping: 20 });

    useEffect(() => {
        // Check Mobile
        const checkMobile = () => {
            const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
            const mobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i));
            setIsMobile(mobile);
            if (!mobile) setPermissionGranted(true);
        };
        checkMobile();
    }, []);

    const handleOrientation = (event) => {
        const { beta, gamma } = event;
        if (beta === null || gamma === null) return;

        // beta: -180 to 180 (front/back). Neutral ~45 or 90 depending on hold? 
        // gamma: -90 to 90 (left/right). Neutral 0.

        // User said "Rotate 45 degrees to move".
        // Let's clamp Gamma to +/- 45 deg.
        // Gamma -45 -> Move LEFT edge visible (Image moves RIGHT -> x > 0)
        // Wait, if I tilt Left (gamma < 0), I expect to look Left. 
        // Looking Left means Viewport moves Left relative to Image. 
        // So Image moves RIGHT. (positive X).

        const MAX_TILT = 45;
        const boundedGamma = Math.max(-MAX_TILT, Math.min(MAX_TILT, gamma));
        const boundedBeta = Math.max(-MAX_TILT, Math.min(MAX_TILT, beta - 45)); // Assuming 45deg hold is neutral

        // Map -45..45 to 20%..-20% (Inverted? Tilt left -> Image Right)
        const percentX = (boundedGamma / MAX_TILT) * MAX_OFFSET_PERCENT;
        const percentY = (boundedBeta / MAX_TILT) * MAX_OFFSET_PERCENT;

        gyroX.set(percentX);
        gyroY.set(percentY);
    };

    const requestAccess = () => {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(res => {
                    if (res === 'granted') {
                        setPermissionGranted(true);
                        window.addEventListener('deviceorientation', handleOrientation);
                    } else alert('Sensor permission denied.');
                });
        } else {
            setPermissionGranted(true);
            window.addEventListener('deviceorientation', handleOrientation);
        }
    };

    useEffect(() => {
        if (permissionGranted && isMobile) {
            window.addEventListener('deviceorientation', handleOrientation);
        }
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, [permissionGranted, isMobile]);

    const toggleFullScreen = (e) => {
        e.stopPropagation();
        setIsFullScreen(!isFullScreen);
    };

    const containerClasses = isFullScreen
        ? "fixed inset-0 z-[100] bg-black flex items-center justify-center transition-all duration-300"
        : "relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl transition-all duration-300 shadow-xl bg-gray-900";

    // Use backgroundImageUrl or imageUrl. videoUrl support too.
    const source = videoUrl ? 'video' : 'image';
    const mediaUrl = videoUrl || backgroundImageUrl || imageUrl || "https://picsum.photos/1200/800";

    return (
        <div className={containerClasses} ref={containerRef} onClick={(e) => isFullScreen && e.stopPropagation()}>

            {/* Close/Minimize Button */}
            <button
                onClick={toggleFullScreen}
                className="absolute top-4 right-4 z-[110] p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors shadow-lg"
            >
                {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>

            {/* Content Container */}
            <motion.div
                className="relative w-full h-full overflow-hidden flex items-center justify-center"
                style={{ cursor: isMobile ? 'grab' : 'default' }}
                // Enable Drag for "Finger touch"
                drag
                dragConstraints={containerRef} // Constraint to container? No, we want to constrain the IMAGE inside.
                // Actually framer motion dragConstraints logic is tricky with scaled content.
                // Let's use simple dragElastic logic or manual constraints.
                // If we use dragConstraints={{ left: -100, right: 100... }} we need to know pixels.
                // Let's just use dragElastic={0.1} and let it spring back if pulled too far? 
                // Or no constraints and let gyro handle limits?
                // User said "Touch ... to reveal".
                // Let's allow dragging freely but spring back to center + gyro offset?
                // Or just standard drag.
                dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                // We'll trust the user or refine later.
                onDrag={(event, info) => {
                    // Update drag motion values if needed or just let visual drag happen
                    // Framer motion handles visual drag state automatically on the element.
                }}
            >
                <motion.div
                    style={{
                        scale: SCALE,
                        x: xSpring, // Base gyro movement + any other logic
                        y: ySpring
                    }}
                    className="w-full h-full relative"
                    drag // Enable drag on the image itself
                    dragConstraints={containerRef} // Constrain so edges don't leave center
                    dragElastic={0.05} // Stiff edges
                >
                    {source === 'video' ? (
                        <video
                            src={mediaUrl}
                            className="w-full h-full object-cover pointer-events-none"
                            autoPlay loop muted playsInline
                        />
                    ) : (
                        <img
                            src={mediaUrl}
                            alt={alt}
                            className="w-full h-full object-cover pointer-events-none select-none"
                        />
                    )}

                    {/* Hint Overlay if needed */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent"></div>
                </motion.div>

                {/* Drag Hint (Desktop) or Gyro Hint (Mobile) */}
                {!permissionGranted && isMobile && (
                    <div className="absolute inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-center">
                        <div className="text-white">
                            <Smartphone className="mx-auto mb-2 animate-pulse" />
                            <p className="text-sm">터치하거나 권한을 허용하여<br />기기를 기울여보세요.</p>
                            <button onClick={requestAccess} className="mt-4 px-4 py-2 bg-white text-black text-xs font-bold rounded-full">
                                센서 켜기
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Gyro3DViewer;
