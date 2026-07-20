"use client";

import { useState } from "react";

interface SelectionProps {
  capturedPhotos?: string[];
  onConfirm: (config: {
    frameCount: number;
    frameStyle: string;
    filter: string;
  }) => void;
  onBack: () => void;
}

interface FrameStyleConfig {
  id: string;
  name: string;
  wallpaperPath: string;
  logoPath: string;
  borderColor: string;
  glowColor: string;
  footerTextColor: string;
}

export default function Selection({
  capturedPhotos = [],
  onConfirm,
  onBack,
}: SelectionProps) {
  const [frameCount] = useState<number>(3);
  const [selectedFrameId, setSelectedFrameId] = useState<string>("frame1");

 const frameConfigs: Record<string, FrameStyleConfig> = {
  frame1: {
    id: "frame1",
    name: "POLAROID WALLPAPER MASH",
    wallpaperPath: "/frames/frame9.jpg",
    logoPath: "/logo3.png", // <--- GANTI DI SINI (tanpa tulisan kata 'public')
    borderColor: "border-neutral-900 shadow-[0_4px_6px_rgba(0,0,0,0.3)]",
    glowColor: "shadow-[0_0_25px_rgba(255,0,255,0.25)]",
    footerTextColor: "text-white text-shadow-neon",
  },
  frame2: {
    id: "frame2",
    name: "STAR LIGHT BLUE",
    wallpaperPath: "/frames/frame10.jpg",
    logoPath: "/logo3.png", // <--- GANTI DI SINI JUGA
    borderColor: "border-neutral-900 shadow-[0_4px_6px_rgba(0,0,0,0.3)]",
    glowColor: "shadow-[0_0_25px_rgba(0,163,255,0.3)]",
    footerTextColor: "text-arcade-blue",
  },
};


  const currentFrame = frameConfigs[selectedFrameId] || frameConfigs["frame1"];

  const handleConfirm = () => {
    onConfirm({
      frameCount,
      frameStyle: selectedFrameId,
      filter: "none",
    });
  };

  return (
    <div className="h-screen w-screen bg-[#030307] flex flex-col justify-start py-6 px-8 select-none font-retro relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f38_1px,transparent_1px),linear-gradient(to_bottom,#1f1f38_1px,transparent_1px)] bg-[size:50px_50px] opacity-10 pointer-events-none z-0" />

      {/* Header */}
      <div className="text-center z-10 mb-4 flex-none">
        <h2 className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-arcade-blue to-[#00E5FF]">
          CHOOSE YOUR FRAME STYLE
        </h2>
        <p className="text-[9px] text-gray-500 mt-1 tracking-widest">
          [ STAGE_03 // CHOOSE_FRAME ]
        </p>
      </div>

      {/* Main Layout Area */}
      <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row gap-8 items-stretch justify-center z-10 overflow-hidden flex-1 pb-24">
        {/* SISI KIRI: Menu Frame */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <p className="text-[10px] text-arcade-magenta tracking-wider flex-none">
            // SELECT WALLPAPER FOR FULL WRAP FRAME
          </p>
          {/* max-h dinamis & overflow-y-auto biar kalau frame nambah dia otomatis ngescroll */}
          <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar flex-1">
            {Object.values(frameConfigs).map((frame) => (
              <button
                key={frame.id}
                onClick={() => setSelectedFrameId(frame.id)}
                className={`py-4 border-2 text-xs font-bold transition-all duration-150 cursor-pointer flex-none ${
                  selectedFrameId === frame.id
                    ? "border-arcade-magenta bg-arcade-magenta/10 text-white shadow-[0_0_15px_rgba(255,0,255,0.4)]"
                    : "border-gray-800 text-gray-400 hover:border-gray-700 bg-black/40"
                }`}
              >
                {frame.name}
              </button>
            ))}
          </div>
        </div>

        {/* SISI KANAN: Preview Monitor */}
        <div className="flex-none flex flex-col items-center justify-start w-72">
          <p className="text-[9px] text-gray-500 mb-2 tracking-widest font-mono flex-none">
            // FULL_WRAP_PREVIEW
          </p>

          {/* KANVAS UTAMA STRIP FILM - DIKUNCI TINGGINYA MENYESUAIKAN TINGGI LAYAR */}
          <div
            className={`relative h-[55vh] aspect-[375/666] bg-neutral-950 border border-white/10 ${currentFrame.glowColor} rounded-md overflow-hidden flex flex-col justify-between p-4 z-20`}
          >
            {/* BACKGROUND LAYER: Wallpaper Utama Penuh */}
            <img
              src={currentFrame.wallpaperPath}
              alt="Full Frame Background"
              className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            />

            {/* FOTO-FOTO LAYER */}
            <div className="w-full flex-1 flex flex-col justify-between gap-1.5 z-10 min-h-0 mb-2">
              {Array.from({ length: frameCount }).map((_, idx) => (
                <div
                  key={idx}
                  className={`relative flex-1 min-h-0 w-full bg-neutral-900 border-2 ${currentFrame.borderColor} overflow-hidden rounded-[2px] flex items-center justify-center`}
                >
                  {capturedPhotos[idx] ? (
                    <img
                      src={capturedPhotos[idx]}
                      alt={`Shot ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <span className="text-[7px] text-neutral-600 font-mono">
                      SLOT_{idx + 1}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* FOOTER BINGKAI LAYER - Nempel kuat di dasar preview container */}
            <div className="w-full flex flex-col items-center justify-center gap-1 z-10 flex-none pt-1.5 border-t border-white/5 bg-black/30 backdrop-blur-[1px] rounded-sm py-1">
              <img
                src={currentFrame.logoPath}
                alt="Logo ITC"
                className="h-5 w-auto object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span
                className={`text-[6.5px] font-bold tracking-wider text-center ${currentFrame.footerTextColor}`}
              >
                IT CLUB PHOTOBOOTH
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigasi Footer - Dikunci di bagian paling bawah halaman agar tombol tidak amblas */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-xl w-full grid grid-cols-2 gap-6 text-[11px] z-30 px-8">
        <button
          onClick={onBack}
          className="border border-gray-700 bg-[#030307] text-gray-400 py-3.5 hover:bg-white/5 cursor-pointer text-center"
        >
          &lt; BACK TO CAMERA
        </button>
        <button
          onClick={handleConfirm}
          className="border-2 border-arcade-blue text-white bg-arcade-blue/20 py-3.5 hover:bg-arcade-blue hover:text-black hover:shadow-[0_0_20px_#00A3FF] cursor-pointer text-center"
        >
          SAVE & PRINT &gt;
        </button>
      </div>
    </div>
  );
}
