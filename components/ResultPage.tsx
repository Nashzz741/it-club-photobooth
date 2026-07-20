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
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [previewBase64, setPreviewBase64] = useState<string>("");
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
    const drawAndUploadCanvas = async () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1200;
        canvas.height = 2160;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // 1. Gambar Background Frame
        const bgImg = await loadImage(currentFrame.wallpaperPath);
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

        // 2. Gambar 3 Kotak Foto Hasil jepretan
        const padding = 60;
        const gap = 30;
        const photoW = canvas.width - padding * 2;
        const photoH = 525;
        const startY = 120;

        for (let i = 0; i < 3; i++) {
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

        // 3. Render Area Footer
        const footerY = 600;
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(padding, footerY, photoW, 85);

        // 4. Gambar Aset Logo
        try {
          const logoImg = await loadImage(currentFrame.logoPath);
          const logoH = 84;
          const logoW = logoImg.width * (logoH / logoImg.height);
          const logoX = (canvas.width - logoW) / 2;
          ctx.drawImage(logoImg, logoX, footerY + 12, logoW, logoH);
        } catch (e) {
          console.log("Logo asset skipped/not found");
        }

        // 5. Cetak Teks Info Booth
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 33px monospace";
        ctx.textAlign = "center";
        ctx.fillText("IT CLUB PHOTOBOOTH", canvas.width / 2, footerY + 62);

        // 6. Dapatkan Base64 Kompresi Menengah untuk Preview & Payload Ringan
        const base64Image = canvas.toDataURL("image/png");
        setPreviewBase64(base64Image);

        // 7. Kirim ke API Route /api/upload
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64Image }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const resData = await response.json();

        if (resData.url) {
          setDownloadUrl(resData.url);
        } else {
          throw new Error(
            resData.error || "Gagal mendapatkan link penyimpanan cloud",
          );
        }

        setIsGenerating(false);
      } catch (err: any) {
        console.error("Proses pembuatan/unggah strip gagal:", err);
        // Alert ini bakal ngebantu banget nyari tau error pastinya kenapa QR gagal terbuat
        alert("🚨 BOOTH ERROR: " + (err.message || err));
        setIsGenerating(false);
      }
    };

    drawAndUploadCanvas();
  }, [config, photos]);

  const downloadImage = () => {
    if (!previewBase64) return;
    const link = document.createElement("a");
    link.download = `It-Club-Photobooth-${config.frameStyle}.png`;
    link.href = previewBase64;
    link.click();
  };

  return (
    <div className="h-screen w-screen bg-[#030307] flex flex-col justify-start py-6 px-8 select-none font-retro relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f38_1px,transparent_1px),linear-gradient(to_bottom,#1f1f38_1px,transparent_1px)] bg-[size:50px_50px] opacity-10 pointer-events-none z-0" />

      {/* Judul Stage */}
      <div className="text-center z-10 mb-4 flex-none">
        <h2 className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-arcade-blue to-[#00E5FF]">
          YOUR MASTERPIECE!
        </h2>
        <p className="text-[9px] text-gray-500 mt-1 tracking-widest">
          [ STAGE_04 // FINAL_RESULT ]
        </p>
      </div>

      {/* Main Layout Area */}
      <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row gap-12 items-stretch justify-center z-10 overflow-hidden flex-1 pb-24">
        {/* PANEL KIRI: QR CODE HANDLER */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl mb-5 flex flex-col items-center justify-center border-4 border-cyan-400">
          {isGenerating ? (
            <div className="w-[230px] h-[230px] rounded-xl bg-neutral-900 flex items-center justify-center text-center text-xs font-mono text-cyan-400 animate-pulse">
              GENERATING...
            </div>
          ) : downloadUrl ? (
            <>
              <QRCodeSVG
                value={downloadUrl}
                size={230}
                level="H"
                includeMargin
                bgColor="#FFFFFF"
                fgColor="#000000"
              />

              <p className="mt-5 text-[11px] font-bold text-black tracking-wider">
                SCAN TO DOWNLOAD
              </p>
            </>
          ) : (
            <div className="text-red-500 font-bold text-center text-xs">
              FAILED TO GENERATE QR
            </div>
          )}
        </div>

        {/* PANEL KANAN: PREVIEW HASIL KANVAS STRIP */}
        <div className="flex-none flex flex-col items-center justify-start w-72">
          <p className="text-[9px] text-gray-500 mb-2 tracking-widest font-mono flex-none">
            // FINAL_IMAGE_PREVIEW
          </p>

          <div className="relative h-[55vh] aspect-[375/666] bg-black border border-white/10 rounded-md overflow-hidden z-20 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.15)]">
            {isGenerating && !previewBase64 ? (
              <div className="text-[11px] text-gray-500 font-mono animate-pulse">
                RENDERING LAYOUT...
              </div>
            ) : (
              <img
                src={previewBase64}
                alt="Final Photobooth Strip"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      </div>

      {/* Navigasi Control Menu Bottom */}
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
              : "bg-arcade-magenta/20 hover:bg-arcade-magenta hover:text-black hover:shadow-[0_0_20px_rgba(255,0,255,0.2)]"
          }`}
        >
          {isGenerating ? "SAVING..." : "DOWNLOAD IMAGE >"}
        </button>
      </div>
    </div>
  );
}
