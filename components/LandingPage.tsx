"use client";

import Image from "next/image";

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="h-screen w-screen bg-[#030307] flex flex-col items-center justify-between py-12 px-6 select-none relative overflow-hidden">
      {/* 1. CYBER GRID SYSTEM (Latar Belakang Perspektif Neon) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f38_1px,transparent_1px),linear-gradient(to_bottom,#1f1f38_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_60%,transparent_100%)] opacity-20 pointer-events-none z-0" />

      {/* 2. VIRTUAL SCANNER BAR (Garis Laser yang Bergerak Naik Turun) */}
      <div className="absolute w-full h-[2px] bg-arcade-blue/50 shadow-[0_0_10px_#00A3FF] top-0 left-0 animate-[scan_6s_linear_infinite] z-10 opacity-70 pointer-events-none" />

      {/* 3. RETRO CORNER HUDS (Bingkai Sudut Khas Kiosk Keren) */}
      <div className="absolute top-6 left-6 border-l-4 border-t-4 border-arcade-blue w-8 h-8 opacity-60 pointer-events-none"></div>
      <div className="absolute top-6 right-6 border-r-4 border-t-4 border-arcade-blue w-8 h-8 opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-6 left-6 border-l-4 border-b-4 border-arcade-magenta w-8 h-8 opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-6 right-6 border-r-4 border-b-4 border-arcade-magenta w-8 h-8 opacity-60 pointer-events-none"></div>

      {/* Teks Status Pojok */}
      <div className="absolute top-6 left-16 text-[10px] font-retro text-arcade-blue/70 tracking-widest hidden md:block">
        SYSTEM: ONLINE // STABLE_
      </div>
      <div className="absolute top-6 right-16 text-[10px] font-retro text-arcade-magenta/70 tracking-widest hidden md:block animate-pulse">
        [ CAMERA_READY ]
      </div>

      {/* ==================== HEADER SECTION ==================== */}
      <div className="flex flex-col items-center gap-3 z-10 mt-4">
        <div className="relative w-32 h-32 md:w-36 md:h-36 bg-black/60 p-2 border-[3px] border-arcade-blue rounded-full shadow-[0_0_25px_rgba(0,163,255,0.4),inset_0_0_15px_rgba(0,163,255,0.2)]">
          <Image
            src="/logo3.png"
            alt="IT Club SMKN 1 Subang Logo"
            fill
            sizes="100px"
            className="object-contain p-3"
            priority
          />
        </div>
        <div className="bg-arcade-blue/10 border border-arcade-blue/30 px-4 py-1 mt-2 rounded-sm shadow-[0_0_10px_rgba(0,163,255,0.1)]">
          <p className="font-retro text-[10px] tracking-[0.3em] text-arcade-blue drop-shadow-[0_0_5px_#00A3FF]">
            SMKN 1 SUBANG
          </p>
        </div>
      </div>

      {/* ==================== MIDDLE SECTION ==================== */}
      <div className="flex flex-col items-center text-center my-auto z-10 relative">
        {/* Dekorasi Ornamen Belakang Judul */}
        <div className="absolute -inset-10 bg-gradient-to-r from-arcade-blue/10 to-arcade-magenta/10 blur-xl opacity-40 rounded-full"></div>

        <h1 className="font-retro text-4xl md:text-6xl tracking-wider leading-none text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          IT CLUB
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-arcade-blue to-[#00E5FF] drop-shadow-[0_0_20px_rgba(0,163,255,0.6)]">
            PHOTO
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-arcade-magenta to-[#FF66CC] drop-shadow-[0_0_20px_rgba(255,0,255,0.6)]">
            BOOTH
          </span>
        </h1>

        <div className="flex items-center gap-2 mt-6">
          <span className="w-2 h-2 rounded-full bg-arcade-magenta animate-ping"></span>
          <p className="font-retro text-[11px] text-gray-400 tracking-widest">
            INSERT COIN OR PRESS START
          </p>
        </div>
      </div>

      {/* ==================== BOTTOM SECTION ==================== */}
      <div className="w-full max-w-sm px-6 z-10 mb-4">
        <button
          onClick={onStart}
          className="w-full font-retro text-base bg-gradient-to-r from-arcade-magenta/20 to-transparent text-white border-2 border-arcade-magenta py-4 px-8 transition-all duration-150 cursor-pointer active:scale-95 hover:from-arcade-magenta hover:to-arcade-magenta/80 hover:text-black hover:shadow-[0_0_35px_#FF00FF] shadow-[0_0_15px_rgba(255,0,255,0.3)] relative overflow-hidden group"
        >
          {/* Aksen Segitiga Kecil Khas UI Game */}
          <div className="absolute top-0 left-0 border-t-8 border-l-8 border-t-white border-l-transparent transform rotate-180"></div>
          <div className="absolute bottom-0 right-0 border-b-8 border-r-8 border-b-white border-r-transparent"></div>

          <span className="animate-blink tracking-[0.15em] font-bold block">
            PRESS START
          </span>
        </button>
      </div>
    </div>
  );
}
