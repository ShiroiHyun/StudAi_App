import React, { useState, useEffect } from 'react';
import { SpeakerWaveIcon, PauseCircleIcon, EyeIcon, SunIcon } from '@heroicons/react/24/outline';

interface AccessibilityPanelProps {
  contentRef: React.RefObject<HTMLElement>;
  voiceSpeed?: number;
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ contentRef, voiceSpeed = 1.0 }) => {
  const [speaking, setSpeaking] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('grayscale');
    document.documentElement.classList.toggle('contrast-125');
  };

  const handleSpeak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    if (!contentRef.current) return;
    const textToRead = contentRef.current.innerText;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-ES';
    utterance.rate = voiceSpeed;
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-3">
      <button
        onClick={toggleHighContrast}
        className={`w-12 h-12 rounded-full shadow-lg transition-colors flex items-center justify-center border border-slate-200 ${
          highContrast ? 'bg-yellow-400 text-black' : 'bg-white text-slate-700'
        }`}
        aria-label="Alto contraste"
      >
        {highContrast ? <SunIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
      </button>

      <button
        onClick={handleSpeak}
        className={`w-12 h-12 rounded-full shadow-lg transition-colors flex items-center justify-center border border-slate-200 ${
          speaking ? 'bg-red-500 text-white' : 'bg-white text-blue-600'
        }`}
        aria-label="Leer pantalla"
      >
        {speaking ? <PauseCircleIcon className="w-6 h-6" /> : <SpeakerWaveIcon className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default AccessibilityPanel;