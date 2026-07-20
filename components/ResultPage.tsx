"use client";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface ResultProps {
  photos: string[];
  config: {
    frameCount: number;
    frameStyle: string;
    filter: string;
  };
  onReset: () => void;
}

interface FrameStyleConfig {
  id: string;
  name: string;
  wallpaperPath: string;
  logoPath: string;
  borderColorHex: string;
  footerTextColor: string;
}

export default function Result({ photos = [], config, onReset }: ResultProps) {
  const [imageBlobUrl, setImageBlobUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(true);

  const frameConfigs: Record<string, FrameStyleConfig> = {
    frame1: {
      id: "frame1",
      name: "POLAROID WALLPAPER MASH",
      wallpaperPath: "/frames/frame9.jpg",
      logoPath: "/logo3.png",
      borderColorHex: "#171717",
      footerTextColor: "text-white",
    },
    frame2: {
      id: "frame2",
      name: "STAR LIGHT BLUE",
      wallpaperPath: "/frames/frame10.png",
      borderColorHex: "#0a0a0a",
      logoPath: "/logo3.png",
      footerTextColor: "text-blue-400",
    },
  };

  const currentFrame =
    frameConfigs[config.frameStyle] || frameConfigs["frame1"];

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
    });
  };

  useEffect(() => {
    const drawStripCanvas = async () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 540;
        canvas.height = 960;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 1. Gambar Background
        const bgImg = await loadImage(currentFrame.wallpaperPath);
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

        // 2. Gambar Foto-Foto
        const padding = 24;
        const gap = 12;
        const photoW = canvas.width - padding * 2;
        const photoH = 220;
        const startY = 60;

        for (let i = 0; i < config.frameCount; i++) {
          const currentY = startY + i * (photoH + gap);

          ctx.lineWidth = 4;
          ctx.strokeStyle = currentFrame.borderColorHex;
          ctx.strokeRect(padding, currentY, photoW, photoH);

          if (photos[i]) {
            const img = await loadImage(photos[i]);
            const imgRatio = img.width / img.height;
            const canvasRatio = photoW / photoH;
            let sx = 0,
              sy = 0,
              sw = img.width,
              sh = img.height;

            if (imgRatio > canvasRatio) {
              sw = img.height * canvasRatio;
              sx = (img.width - sw) / 2;
            } else {
              sh = img.width / canvasRatio;
              sy = (img.height - sh) / 2;
            }

            ctx.drawImage(
              img,
              sx,
              sy,
              sw,
              sh,
              padding,
              currentY,
              photoW,
              photoH,
            );
          } else {
            ctx.fillStyle = "#1f1f1f";
            ctx.fillRect(padding, currentY, photoW, photoH);
          }
        }

        // 3. Render Footer Box
        const footerY = 780;
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fillRect(padding, footerY, photoW, 120);

        // 4. Gambar Logo
        try {
          const logoImg = await loadImage(currentFrame.logoPath);
          const logoH = 40;
          const logoW = logoImg.width * (logoH / logoImg.height);
          const logoX = (canvas.width - logoW) / 2;
          ctx.drawImage(logoImg, logoX, footerY + 20, logoW, logoH);
        } catch (e) {
          console.log("Logo skipped");
        }

        // 5. Gambar Teks
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 14px monospace";
        ctx.textAlign = "center";
        ctx.fillText("IT CLUB PHOTOBOOTH", canvas.width / 2, footerY + 85);

        // FIX FIX SOLUSI UTAMA: Ubah ke blob murni agar string URL-nya sangat pendek!
        canvas.toBlob((blob) => {
          if (blob) {
            const localUrl = URL.createObjectURL(blob);
            setImageBlobUrl(localUrl); // Hasilnya cuma berupa short string: "blob:http://localhost:3000/..."
            setIsGenerating(false);
          }
        }, "image/png");
      } catch (err) {
        console.error("Gagal menggambar:", err);
        setIsGenerating(false);
      }
    };

    drawStripCanvas();

    // Bersihkan memori object URL kalau komponen di-unmount
    return () => {
      if (imageBlobUrl) URL.revokeObjectURL(imageBlobUrl);
    };
  }, [config, photos]);

  const downloadImage = () => {
    if (!imageBlobUrl) return;
    const link = document.createElement("a");
    link.download = `spark-booth-${config.frameStyle}.png`;
    link.href = imageBlobUrl;
    link.click();
  };

  return (
    <div className="h-screen w-screen bg-[#030307] flex flex-col justify-start py-6 px-8 select-none font-retro relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f38_1px,transparent_1px),linear-gradient(to_bottom,#1f1f38_1px,transparent_1px)] bg-[size:50px_50px] opacity-10 pointer-events-none z-0" />

      {/* Header */}
      <div className="text-center z-10 mb-4 flex-none">
        <h2 className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-arcade-blue to-[#00E5FF]">
          YOUR MASTERPIECE!
        </h2>
        <p className="text-[9px] text-gray-500 mt-1 tracking-widest">
          [ STAGE_04 // FINAL_RESULT ]
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row gap-12 items-stretch justify-center z-10 overflow-hidden flex-1 pb-24">
        {/* SISI KIRI: PANEL QR CODE */}
        <div className="flex-1 flex flex-col items-center justify-center bg-black/30 border border-gray-800 rounded-lg p-6 min-w-0 max-h-[55vh]">
          <p className="text-[11px] text-arcade-magenta tracking-wider mb-4 text-center">
            {isGenerating
              ? "// PREPARING QR CODE..."
              : "// SCAN QR TO SAVE DIRECTLY"}
          </p>
          <div className="bg-white p-3 rounded-md shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-4 flex items-center justify-center min-w-[174px] min-h-[174px]">
            {isGenerating ? (
              <div className="w-[150px] h-[150px] bg-neutral-950 flex items-center justify-center text-[10px] text-arcade-blue font-mono animate-pulse rounded">
                GENERATING...
              </div>
            ) : imageBlobUrl ? (
              /* URL.createObjectURL aman masuk ke QR karena pendek banget */
              <QRCodeSVG value={imageBlobUrl} size={150} level="M" />
            ) : (
              <span className="text-red-500 text-[10px]">QR ERROR</span>
            )}
          </div>
          <p className="text-[9px] text-gray-400 font-mono text-center max-w-xs">
            {isGenerating
              ? "Sedang memproses tautan gambar..."
              : "Scan langsung menggunakan HP untuk membuka dan mengunduh berkas strip foto secara instan."}
          </p>
        </div>

        {/* SISI KANAN: PREVIEW FRAME STRIP */}
        <div className="flex-none flex flex-col items-center justify-start w-72">
          <p className="text-[9px] text-gray-500 mb-2 tracking-widest font-mono flex-none">
            // FINAL_IMAGE_PREVIEW
          </p>

          <div className="relative h-[55vh] aspect-[375/666] bg-black border border-white/10 rounded-md overflow-hidden z-20 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.15)]">
            {isGenerating ? (
              <div className="text-[11px] text-gray-500 font-mono animate-pulse">
                RENDERING PREVIEW...
              </div>
            ) : (
              <img
                src={imageBlobUrl}
                alt="Final Photobooth Strip"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      </div>

      {/* Navigasi Footer */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-xl w-full grid grid-cols-2 gap-6 text-[11px] z-30 px-8">
        <button
          onClick={onReset}
          className="border border-gray-700 bg-[#030307] text-gray-400 py-3.5 hover:bg-white/5 cursor-pointer text-center font-bold tracking-wider transition-all"
        >
          &lt; DONE / START OVER
        </button>
        <button
          onClick={downloadImage}
          disabled={isGenerating}
          className={`border-2 border-arcade-magenta text-white py-3.5 font-bold tracking-wider transition-all text-center cursor-pointer ${
            isGenerating
              ? "opacity-50 bg-neutral-800 border-neutral-700 cursor-not-allowed"
              : "bg-arcade-magenta/20 hover:bg-arcade-magenta hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          }`}
        >
          {isGenerating ? "PROCESSING..." : "DOWNLOAD IMAGE >"}
        </button>
      </div>
    </div>
  );
}
