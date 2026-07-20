"use client";

import { useState } from "react";
import Landing from "@/components/LandingPage";
import CameraBooth from "@/components/CameraBooth";
import Selection from "@/components/Selection";
import Result from "@/components/ResultPage";

export type Step = "landing" | "camera" | "selection" | "result";

export interface BoothConfig {
  frameCount: number;
  frameStyle: string;
  filter: string;
}

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [photos, setPhotos] = useState<string[]>([]);
  const [finalConfig, setFinalConfig] = useState<BoothConfig>({
    frameCount: 3,
    frameStyle: "frame1",
    filter: "none",
  });

  return (
    <main className="min-h-screen bg-black">
      {step === "landing" && <Landing onStart={() => setStep("camera")} />}

      {step === "camera" && (
        <CameraBooth
          config={finalConfig}
          onFinish={(capturedPhotos) => {
            setPhotos(capturedPhotos);
            setStep("selection");
          }}
        />
      )}

      {step === "selection" && (
        <Selection
          capturedPhotos={photos}
          onConfirm={(config) => {
            setFinalConfig(config);
            setStep("result");
          }}
          onBack={() => setStep("camera")}
        />
      )}

      {step === "result" && (
        <Result
          photos={photos}
          config={finalConfig}
          onReset={() => {
            setPhotos([]);
            setStep("landing");
          }}
        />
      )}
    </main>
  );
}
