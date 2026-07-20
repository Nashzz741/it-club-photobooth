import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return NextResponse.json(
        {
          success: false,
          error: "Image tidak ditemukan",
        },
        {
          status: 400,
        },
      );
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const buffer = Buffer.from(base64Data, "base64");

    const blob = await put(`photobooth/${Date.now()}.jpg`, buffer, {
      access: "public",
      contentType: "image/jpeg",
    });

    const downloadUrl = "downloadUrl" in blob ? blob.downloadUrl : blob.url;

    console.log("Blob URL:", blob.url);
    console.log("Download URL:", downloadUrl);

    return NextResponse.json({
      success: true,
      url: downloadUrl,
    });
  } catch (error: any) {
  console.error("UPLOAD ERROR:", error);

  return NextResponse.json(
    {
      success: false,
      error: error?.message || String(error),
      stack: process.env.NODE_ENV === "development" ? error?.stack : undefined,
    },
    {
      status: 500,
    },
  );
}