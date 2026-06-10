import crypto from "crypto";
import { requiredEnv } from "@/lib/utils";

type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
};

export async function uploadToCloudinary(file: File) {
  const cloudName = requiredEnv("CLOUDINARY_CLOUD_NAME");
  const apiKey = requiredEnv("CLOUDINARY_API_KEY");
  const apiSecret = requiredEnv("CLOUDINARY_API_SECRET");
  const timestamp = Math.round(Date.now() / 1000).toString();
  const folder = "portfolio";
  const signature = crypto
    .createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", apiKey);
  body.append("timestamp", timestamp);
  body.append("folder", folder);
  body.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cloudinary upload failed: ${error}`);
  }

  const payload = (await response.json()) as CloudinaryUploadResponse;
  return payload.secure_url.replace("/upload/", "/upload/f_auto,q_auto/");
}
