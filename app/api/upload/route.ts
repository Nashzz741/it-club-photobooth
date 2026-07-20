import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { imageBase64 } = await request.json();

    // Hapus header base64 jika ada (e.g., data:image/jpeg;base64,)
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Proses upload langsung ke Vercel Blob Storage kamu
    const blob = await put(`photobooth/${Date.now()}.jpg`, buffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    // Balikin URL publik gambar yang pendek ke frontend
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Error di API Upload:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah gambar" },
      { status: 500 },
    );
  }
}
