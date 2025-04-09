import { NextResponse } from "next/server";

export async function GET() {
  // ※ ダミーのデータとして、4台分のサウナの空き状況をランダム生成します。
  // ※ 実際には日付や時間に応じたロジックを組むことになるでしょう。
  const saunaStatus = Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    available: Math.random() > 0.5,
  }));

  return NextResponse.json({ saunaStatus });
}
