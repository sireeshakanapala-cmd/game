import { useState, useEffect, useRef } from 'react';

const TRACKS = [
  { id: 1, title: 'STREAM_ALPHA.WAV', artist: 'AI_CORE_01', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'STREAM_BETA.WAV', artist: 'AI_CORE_02', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'STREAM_GAMMA.WAV', artist: 'AI_CORE_03', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  
  const handleSkip = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const track = TRACKS[currentTrackIndex];

  return (
    <div className="bg-black border-4 border-[#0ff] p-6 w-full max-w-sm flex flex-col gap-6 font-digital shadow-[8px_8px_0px_#f0f]">
      <audio 
        ref={audioRef} 
        src={track.url} 
        onEnded={handleSkip}
        loop={false}
      />
      
      <div className="border-b-4 border-[#f0f] pb-2 mb-2">
        <h2 className="text-[#f0f] text-3xl font-bold">&gt;&gt; AUDIO_SUBSYSTEM</h2>
      </div>

      <div className="flex items-center gap-4 bg-[#0ff] text-black p-4">
        <div className="w-16 h-16 bg-black border-2 border-black flex items-center justify-center">
          <div className="w-8 h-8 bg-[#f0f] animate-ping"></div>
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-2xl truncate w-48">{track.title}</h3>
          <p className="text-xl truncate w-48 opacity-80">SRC: {track.artist}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 bg-black p-4 border-2 border-[#0ff]">
        <button onClick={handlePrev} className="text-[#0ff] hover:text-white hover:bg-[#f0f] px-4 py-2 border-2 border-[#0ff] text-xl transition-none">
          {'<<'}
        </button>
        <button 
          onClick={handlePlayPause} 
          className="px-6 py-2 bg-[#f0f] hover:bg-white text-black font-bold text-2xl border-2 border-[#f0f] transition-none"
        >
          {isPlaying ? 'HALT' : 'EXEC'}
        </button>
        <button onClick={handleSkip} className="text-[#0ff] hover:text-white hover:bg-[#f0f] px-4 py-2 border-2 border-[#0ff] text-xl transition-none">
          {'>>'}
        </button>
      </div>

      <div className="flex items-center gap-4 border-t-4 border-[#f0f] pt-4">
        <button onClick={() => setIsMuted(!isMuted)} className="text-[#0ff] hover:text-[#f0f] text-2xl">
          {isMuted || volume === 0 ? 'VOL:MUTE' : 'VOL:LVL'}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="w-full h-4 bg-black border-2 border-[#0ff] appearance-none cursor-pointer accent-[#f0f]"
        />
      </div>
    </div>
  );
}
