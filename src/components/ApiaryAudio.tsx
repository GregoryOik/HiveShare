import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function ApiaryAudio() {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('hive-audio-muted');
    return saved === null ? true : saved === 'true';
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localStorage.setItem('hive-audio-muted', isMuted.toString());
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted) {
        audioRef.current.play().catch(err => {
          console.log('Autoplay prevented by browser:', err);
          setIsMuted(true);
        });
      }
    }
  }, [isMuted]);

  return (
    <div className="fixed bottom-8 left-8 z-[100] flex items-center gap-4">
      <audio 
        ref={audioRef}
        loop
        src="https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a1b2b8.mp3?filename=nature-sounds-forest-ambient-11217.mp3" 
      />
      
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className={`group flex items-center gap-3 px-4 py-2.5 rounded-full border transition-all duration-500 backdrop-blur-md shadow-2xl ${
          isMuted 
            ? 'bg-white/5 border-white/10 hover:border-honey/40' 
            : 'bg-honey/10 border-honey/40 text-honey'
        }`}
        title={isMuted ? "Unmute Apiary Sounds" : "Mute Apiary Sounds"}
      >
        <div className="relative">
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="animate-pulse" />}
          {!isMuted && (
            <div className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-honey opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-honey"></span>
            </div>
          )}
        </div>
        
        <span className={`text-[9px] uppercase tracking-[.2em] font-bold overflow-hidden transition-all duration-500 whitespace-nowrap ${
          isMuted ? 'max-w-0 opacity-0' : 'max-w-[120px] opacity-100'
        }`}>
          Apiary Ambience
        </span>
      </button>

      {!isMuted && (
        <div className="text-[10px] text-white/20 italic animate-in fade-in slide-in-from-left-4 duration-1000">
           Ambient sounds from Laconia
        </div>
      )}
    </div>
  );
}
