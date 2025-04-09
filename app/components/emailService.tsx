// utils/emailService.js
import nodemailer from "nodemailer";

// Gmailのトランスポーター設定
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // 環境変数から取得
    pass: process.env.EMAIL_PASS, // 環境変数から取得
  },
});

interface ReservationData {
  saunaName: string;
  date: string;
  time: string;
  name: string;
  email?: string;
  phone?: string;
  numberOfPeople: number;
}

export async function sendReservationEmail({
  to,
  subject,
  reservationData,
}: {
  to: string;
  subject: string;
  reservationData: ReservationData;
}) {
  const { saunaName, date, time, name, email, phone, numberOfPeople } =
    reservationData;

  // 管理者向けメール本文
  let htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0891b2;">サウナ予約システム - 新規予約</h2>
      <div style="background-color: #164e63; color: white; padding: 20px; border-radius: 10px;">
        <h3 style="margin-top: 0;">${saunaName} 予約詳細</h3>
        <p><strong>日付:</strong> ${date}</p>
        <p><strong>時間:</strong> ${time}</p>
        <p><strong>お名前:</strong> ${name}</p>
        <p><strong>メールアドレス:</strong> ${email || "未入力"}</p>
        <p><strong>電話番号:</strong> ${phone || "未入力"}</p>
        <p><strong>ご利用人数:</strong> ${numberOfPeople}名</p>
      </div>
      <p style="margin-top: 20px; color: #666;">このメールはサウナ予約システムから自動送信されています。</p>
    </div>
  `;

  // ユーザー向けのメールの場合、内容を変更
  if (!phone) {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0891b2;">サウナ予約システム - ご予約確認</h2>
        <p>${name} 様</p>
        <p>この度はご予約いただき、誠にありがとうございます。以下の内容でご予約を承りました。</p>
        <div style="background-color: #164e63; color: white; padding: 20px; border-radius: 10px;">
          <h3 style="margin-top: 0;">${saunaName}</h3>
          <p><strong>日付:</strong> ${date}</p>
          <p><strong>時間:</strong> ${time}</p>
          <p><strong>ご利用人数:</strong> ${numberOfPeople}名</p>
        </div>
        <p style="margin-top: 20px;">ご来店を心よりお待ちしております。</p>
        <p style="color: #666;">このメールはサウナ予約システムから自動送信されています。</p>
      </div>
    `;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("メール送信成功:", info.response);
    return info;
  } catch (error) {
    console.error("メール送信エラー:", error);
    throw error;
  }
}
