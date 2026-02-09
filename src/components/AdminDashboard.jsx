import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Video, Database } from 'lucide-react';

export default function AdminDashboard({ onBack }) {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const loadApps = () => {
            try {
                const data = JSON.parse(localStorage.getItem('beta_applications') || '[]');
                setApplications(data);
            } catch (e) {
                console.error("Failed to load applications", e);
            }
        };
        loadApps();
    }, []);

    const clearData = () => {
        if (window.confirm('정말 모든 데이터를 삭제하시겠습니까?')) {
            localStorage.removeItem('beta_applications');
            setApplications([]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 hover:bg-white rounded-full transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <Database className="text-orange-500" />
                            Beta Application Dashboard
                        </h1>
                    </div>
                    <button onClick={clearData} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                        <Trash2 size={16} />
                        Clear All
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Date</th>
                                <th className="p-4 font-semibold text-gray-600">Name</th>
                                <th className="p-4 font-semibold text-gray-600">Contact</th>
                                <th className="p-4 font-semibold text-gray-600">Target</th>
                                <th className="p-4 font-semibold text-gray-600">Message</th>
                                <th className="p-4 font-semibold text-gray-600">Paid Intent</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {applications.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400">
                                        No applications yet.
                                    </td>
                                </tr>
                            ) : (
                                applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(app.date).toLocaleString()}
                                        </td>
                                        <td className="p-4 font-medium text-gray-900">{app.name}</td>
                                        <td className="p-4 text-gray-600">{app.contact}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase">
                                                {app.target}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600 max-w-md truncate" title={app.message}>
                                            {app.message}
                                        </td>
                                        <td className="p-4">
                                            {app.paid ? (
                                                <span className="text-green-600 font-bold text-xs">Yes</span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">No</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
