import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// 環境変数で Gmail 認証情報を管理
const GMAIL_PASS = "ycai tjro rosz jfup";
const GMAIL_USER = "sh091965@gmail.com";

// メール送信先
const TO_EMAIL = "sh091965@gmail.com";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(request: any) {
  try {
    // フロントエンドから送られたJSONデータを取得
    const { date, time, email, details } = await request.json();

    // Nodemailerのトランスポートを設定
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
      },
    });

    // メール内容を設定
    const mailOptions = {
      from: email, // 送信者（ユーザーのメール）
      to: TO_EMAIL, // 受信者（管理者のGmail）
      subject: "【新規予約】打ち合わせのリクエストがありました",
      text: `
        🔹 予約が入りました 🔹
        📅 日付: ${date}
        ⏰ 時間: ${time}
        📧 お客様メールアドレス: ${email}
        ✏️ お問い合わせ内容:
        ${details}

        ----------------------------------------
        自動送信メールです。
      `,
    };

    // メール送信
    await transporter.sendMail(mailOptions);

    // 成功時のレスポンス
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("メール送信エラー:", error);
    return NextResponse.json({ success: false });
  }
}
