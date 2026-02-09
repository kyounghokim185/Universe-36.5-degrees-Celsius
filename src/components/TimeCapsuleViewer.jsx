import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useVideoTexture, Html, Loader } from '@react-three/drei';
import * as THREE from 'three';

// 1. Scene Component: Curved Screen with Video
const CurvedScreen = ({ videoUrl }) => {
    // Use Suspense to handle video loading
    return (
        <Suspense fallback={<Html center><div className="text-white">Loading Video...</div></Html>}>
            <VideoMesh videoUrl={videoUrl} />
        </Suspense>
    );
};

const VideoMesh = ({ videoUrl }) => {
    // Load video texture
    const texture = useVideoTexture(videoUrl, {
        unsuspend: 'canplay',
        muted: false,
        loop: true,
        start: true,
        crossOrigin: "Anonymous"
    });

    // CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
    // We want a curved screen, roughly 120-180 degrees (Math.PI / 1.5 or Math.PI)
    // Radius needs to be large enough to feel immersive.
    const radius = 10;
    const height = 6; // Aspect ratio dependent
    const angle = Math.PI * 0.8; // 144 degrees curve

    return (
        <mesh position={[0, 0, -radius + 2]} rotation={[0, Math.PI, 0]}>
            {/* 
        thetaStart = -angle/2 to center it 
        Side = DoubleSide to make sure we see it from inside if needed, but BackSide is usually better for "surrounding"
        Actually, we want to look AT the screen. 
      */}
            <cylinderGeometry args={[radius, radius, height, 64, 1, true, -angle / 2, angle]} />
            <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
    );
};

// 2. Camera Controller with Limits
const CameraController = () => {
    const { camera, gl } = useThree();
    const controlsRef = useRef();

    return (
        <OrbitControls
            ref={controlsRef}
            args={[camera, gl.domElement]}
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.5}
            // Limit horizontal rotation (Azimuth)
            minAzimuthAngle={-Math.PI / 6} // -30 degrees
            maxAzimuthAngle={Math.PI / 6}  // +30 degrees
            // Limit vertical rotation (Polar)
            minPolarAngle={Math.PI / 2 - Math.PI / 12} // 90 - 15 degrees
            maxPolarAngle={Math.PI / 2 + Math.PI / 12} // 90 + 15 degrees
            target={[0, 0, -10]} // Look towards the screen center
        />
    );
};

const TimeCapsuleViewer = ({ videoUrl, onClose }) => {
    return (
        <div className="relative w-full h-full bg-black group">
            {/* 3D Canvas */}
            <Canvas camera={{ position: [0, 0, 0], fov: 60 }}>
                <color attach="background" args={['#000']} />

                {/* Ambient light for base visibility if we used Lit material */}
                <ambientLight intensity={1} />

                <CurvedScreen videoUrl={videoUrl} />
                <CameraController />
            </Canvas>
            <Loader />

            {/* Overlay UI */}
            <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none fade-in">
                <div className="bg-black/50 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-white/70 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Drag to look around (Limited 30°)
                </div>
            </div>

            {/* Close Button */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/60 p-2 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            )}
        </div>
    );
};

export default TimeCapsuleViewer;
