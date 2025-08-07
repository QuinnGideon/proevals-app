import React from 'react';
import { createPortal } from 'react-dom';
import { X, Heart } from 'lucide-react';

const names = ['Alca', 'Kenaz', 'Chanz', 'Rhonda', 'Noel', 'Dwyte', 'Henry', 'Jonathan', 'Jamal'];

const EasterEgg: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const modalContent = (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in-up" onClick={onClose}>
            <div 
                className="relative w-full max-w-2xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white rounded-2xl border border-blue-400/30 shadow-2xl p-8 text-center"
                onClick={e => e.stopPropagation()}
                style={{
                    boxShadow: '0 0 20px rgba(88, 199, 242, 0.3), 0 0 40px rgba(74, 144, 226, 0.2)',
                }}
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                    <X size={24} />
                </button>
                
                <Heart className="mx-auto h-16 w-16 text-pink-400 animate-pulse-subtle" />
                
                <h2 className="mt-6 text-3xl font-extrabold" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'}}>
                    A Special Thank You
                </h2>
                
                <p className="mt-4 text-lg text-gray-300">
                    To some of the closest people in my life, and to those who have been telling me for years that I should do my own thing. Your belief in me has been a constant source of strength. This is for you.
                </p>

                <div className="mt-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-4 font-semibold text-xl text-cyan-300">
                    {names.map((name, index) => (
                        <span key={name} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                            {name}
                        </span>
                    ))}
                </div>

                <p className="mt-10 text-xs text-gray-500">
                    - The Creator
                </p>
            </div>
        </div>
    );
    return createPortal(modalContent, document.body);
};

export default EasterEgg;