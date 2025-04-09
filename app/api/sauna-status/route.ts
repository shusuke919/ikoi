// app/api/sauna-status/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // ダミーデータとして空き状態をランダムに返す
  const isAvailable = Math.random() > 0.5;
  return NextResponse.json({ isAvailable });
}
