"use client";
import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";

export default function CameraBooth({ config, onFinish }: any) {
  const webcamRef = useRef<Webcam>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [activeFilter, setActiveFilter] = useState("none");
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [animatedPhoto, setAnimatedPhoto] = useState<string | null>(null);
  const [isFlying, setIsFlying] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true); // Default kamera ter-mirror biar natural

  // VARIASI FILTER LEBIH BANYAK DAN AESTHETIC
  const filterStyles: any = {
    none: "",
    grayscale: "grayscale contrast-125",
    vintage: "sepia contrast-110 brightness-95",
    cyberpunk: "contrast-150 saturate-150 hue-rotate-[180deg]",
    retroGame: "contrast-200 saturate-50 brightness-110 hue-rotate-[30deg]",
    neonDream: "saturate-200 hue-rotate-[90deg] brightness-105",
    noir: "grayscale brightness-75 contrast-200",
    warmSun: "sepia-[0.3] saturate-125 contrast-105 brightness-105",
  };

  const startCapture = () => {
    if (countdown !== null || isFlying || photos.length >= 3) return;
    setHasStarted(true);
    setCountdown(3);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Enter" && startCapture();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [countdown, isFlying, photos]);

  useEffect(() => {
    if (countdown === 0) {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setIsFlashActive(true);
        setTimeout(() => setIsFlashActive(false), 150);
        setAnimatedPhoto(imageSrc);
        setIsFlying(true);
        setTimeout(() => {
          const newPhotos = [...photos, imageSrc];
          setPhotos(newPhotos);
          setAnimatedPhoto(null);
          setIsFlying(false);
          if (newPhotos.length < 3) setTimeout(() => setCountdown(3), 1500);
          else setTimeout(() => onFinish(newPhotos), 1500);
        }, 1200);
      }
      setCountdown(null);
    } else if (countdown !== null && countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  return (
    <div className="h-screen w-screen bg-[#050505] flex flex-row items-center justify-between p-6 font-retro relative overflow-hidden select-none">
      {/* Flash Effect */}
      {isFlashActive && <div className="absolute inset-0 bg-white z-[100]" />}

      {/* Capture Animation */}
      {animatedPhoto && (
        <div
          className={`fixed z-[80] border-4 border-white transition-all duration-[1000ms] ease-in-out overflow-hidden ${
            isFlying
              ? "top-[40%] right-[10%] w-36 opacity-40 scale-50 rotate-6"
              : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] opacity-100 scale-100"
          }`}
        >
          <img
            src={animatedPhoto}
            className={`w-full h-full object-cover ${filterStyles[activeFilter]} ${isMirrored ? "scale-x-[-1]" : ""}`}
            alt="Snap Animation"
          />
        </div>
      )}

      {/* SISI KIRI: Live View & Filter Controls */}
      <div className="flex-1 max-w-3xl flex flex-col gap-4">
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-arcade-blue">
            // SHOT {Math.min(photos.length + 1, 3)} OF 3
          </span>
          <div className="flex gap-4 items-center">
            {/* Tombol Mirror Toggle */}
            <button
              onClick={() => setIsMirrored(!isMirrored)}
              className={`px-2 py-0.5 border cursor-pointer text-[9px] transition-all ${isMirrored ? "border-arcade-blue text-arcade-blue bg-arcade-blue/10" : "border-gray-700 text-gray-500"}`}
            >
              MIRROR: {isMirrored ? "ON" : "OFF"}
            </button>
            <span className="text-arcade-magenta animate-pulse">
              {hasStarted ? "[ SESSION_RUNNING ]" : "[ WAITING_FOR_TRIGGER ]"}
            </span>
          </div>
        </div>

        {/* Kotak Viewfinder Utama */}
        <div className="relative aspect-video w-full border-4 border-arcade-blue bg-black overflow-hidden shadow-[0_0_30px_rgba(0,163,255,0.2)]">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            mirrored={isMirrored} // Sinkronisasi Mirror ke Modul Utama Webcam
            className={`w-full h-full object-cover ${filterStyles[activeFilter]}`}
          />
          {!hasStarted && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 gap-4 z-10">
              <button
                onClick={startCapture}
                className="px-8 py-4 border-2 border-arcade-blue bg-arcade-blue/20 text-white font-bold cursor-pointer hover:bg-arcade-blue hover:text-black hover:shadow-[0_0_15px_rgba(0,163,255,0.8)] transition-all"
              >
                SPARK SNAP [ENTER]
              </button>
            </div>
          )}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20">
              <span className="text-8xl text-white font-bold drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] animate-ping">
                {countdown === 0 ? "SMILE!" : countdown}
              </span>
            </div>
          )}
        </div>

        {/* Grid Pilihan Filter (2 Baris x 4 Kolom) */}
        <div className="grid grid-cols-4 gap-2 text-[9px]">
          {Object.keys(filterStyles).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`py-2 border cursor-pointer font-bold tracking-wider transition-all ${
                activeFilter === f
                  ? "border-arcade-magenta bg-arcade-magenta/20 text-white shadow-[0_0_10px_rgba(255,0,255,0.4)]"
                  : "border-gray-800 text-gray-500 bg-black/20 hover:border-gray-600"
              }`}
            >
              {f.replace(/([A-Z])/g, " $1").toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* SISI KANAN: Real-time Strip Film Preview (Di-fix pas untuk 3 foto) */}
      <div className="w-72 flex flex-col items-center pl-6 border-l border-gray-900 h-full justify-center">
        <p className="text-[9px] text-gray-600 mb-2 tracking-widest">
          // STRIP_FILM_PREVIEW
        </p>

        {/* Rasio disesuaikan dengan template akhir 375/666 */}
        <div className="relative w-44 aspect-[375/666] border border-white/15 bg-neutral-950 p-3.5 flex flex-col justify-between shadow-[0_0_25px_rgba(255,255,255,0.05)] rounded-sm">
          {/* Container Slot Foto: Menggunakan Susunan Flex Vertikal agar Terbagi Rata */}
          <div className="w-full flex-1 flex flex-col justify-between gap-1.5 min-h-0 mb-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="relative flex-1 min-h-0 w-full bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center rounded-[1px]"
              >
                {photos[i] ? (
                  <img
                    src={photos[i]}
                    className={`w-full h-full object-cover object-center ${filterStyles[activeFilter]} ${isMirrored ? "scale-x-[-1]" : ""}`}
                    alt={`Preview Shot ${i + 1}`}
                  />
                ) : (
                  <span className="text-[7px] text-neutral-700 font-mono tracking-wider">
                    SLOT_{i + 1}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Mini Footer Preview Mockup */}
          <div className="w-full text-center border-t border-white/5 pt-1 flex flex-col items-center justify-center gap-0.5 flex-none">
            <div className="w-3 h-3 bg-neutral-800 rounded-full mb-0.5 opacity-40" />
            <span className="text-[5px] text-neutral-600 font-bold tracking-widest font-mono">
              IT CLUB MOCKUP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
