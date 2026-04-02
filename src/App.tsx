import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#0ff] font-digital flex flex-col items-center justify-center p-4 relative overflow-hidden screen-tear">
      <div className="bg-noise"></div>
      <div className="scanlines"></div>

      <div className="z-10 w-full max-w-6xl flex flex-col xl:flex-row items-center justify-center gap-12 xl:gap-24">
        <div className="flex flex-col items-center xl:items-start gap-8 border-l-8 border-[#f0f] pl-6 bg-black/50 p-6">
          <div className="text-center xl:text-left">
            <p className="text-[#f0f] text-2xl mb-2 animate-pulse font-bold">&gt;&gt; SYS.INIT_PROTOCOL</p>
            <h1 className="text-5xl md:text-7xl font-arcade tracking-tighter text-white mb-6 glitch-text uppercase" data-text="ERR_SNAKE">
              ERR_SNAKE
            </h1>
            <h2 className="text-3xl md:text-5xl font-digital tracking-widest text-black uppercase bg-[#0ff] px-4 py-1 inline-block border-4 border-[#f0f]">
              MODULE_CORRUPTED
            </h2>
          </div>
          <MusicPlayer />
        </div>

        <SnakeGame />
      </div>
    </div>
  );
}
