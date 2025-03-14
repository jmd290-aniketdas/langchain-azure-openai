import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl; // Get the full URL
  const pathname = url.pathname; // Extract the path

  return NextResponse.json({ pathname });
}
