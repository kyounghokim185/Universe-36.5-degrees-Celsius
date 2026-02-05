import React, { useState } from 'react';
import { ArrowLeft, Image as ImageIcon, Video, Loader2, Play } from 'lucide-react';

const AITestPage = ({ onBack }) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [type, setType] = useState(null); // 'image' or 'video'
    const [error, setError] = useState(null);

    const handleGenerate = async (genType) => {
        if (!prompt) return;
        setLoading(true);
        setError(null);
        setResult(null);
        setType(genType);

        const endpoint = genType === 'image'
            ? '/api/generate/image'
            : '/api/generate/video';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    // For video, we might want to pass an image_url if we had one, 
                    // but for this simple test, just text-to-video for now.
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Generation failed');
            }

            const data = await response.json();
            setResult(data.url);
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to connect to backend. Is it running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-900 text-white p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft size={20} /> Back to App
                </button>

                <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    AI Backend Test Console
                </h1>

                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm mb-6">
                    <label className="block text-sm text-slate-400 mb-2">Prompt</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-4 text-white resize-none focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="Describe what you want to generate..."
                    />

                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={() => handleGenerate('image')}
                            disabled={loading || !prompt}
                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ImageIcon size={20} />
                            Generate Image (Flux)
                        </button>
                        <button
                            onClick={() => handleGenerate('video')}
                            disabled={loading || !prompt}
                            className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Video size={20} />
                            Generate Video (Luma)
                        </button>
                    </div>
                </div>

                {/* Status / Error */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="animate-spin text-purple-400 mb-4" size={48} />
                        <p className="text-slate-300 animate-pulse">Communicating with Python Backend...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6">
                        <strong>Error:</strong> {error}
                        <p className="text-xs mt-2 opacity-70">
                            Make sure the backend is running at http://localhost:8000
                        </p>
                    </div>
                )}

                {/* Result */}
                {result && !loading && (
                    <div className="bg-black rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                        <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                            <span className="font-mono text-xs text-green-400">GENERATION SUCCESSFUL</span>
                            <a href={result} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">Open Original</a>
                        </div>
                        <div className="flex justify-center bg-checkerboard min-h-[300px]">
                            {type === 'image' ? (
                                <img src={result} alt="Generated" className="max-w-full max-h-[600px] object-contain" />
                            ) : (
                                <video src={result} controls autoPlay loop className="max-w-full max-h-[600px]" />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AITestPage;
