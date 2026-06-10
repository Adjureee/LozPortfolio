import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { isCurrentUserAdmin } from "@/lib/data";

export async function POST(request: Request) {
  if (!(await isCurrentUserAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const url = await uploadToCloudinary(file);
  return NextResponse.json({ url });
}
