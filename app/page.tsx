"use client";
import { useState, useEffect } from "react";

export default function ReservationPage() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState(""); // 予約内容
  const [message, setMessage] = useState(""); // 成功・エラー用のメッセージ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [availability, setAvailability] = useState<any[]>([]); // 空き状況用

  // 9:00～19:00 の時間リスト
  const times = Array.from({ length: 11 }, (_, i) => `${9 + i}:00`);

  // 空き状況を取得する関数（GET API /api/availability を呼び出す）
  const fetchAvailability = async () => {
    if (!date || !time) return;
    try {
      const res = await fetch(`/api/availability?date=${date}&time=${time}`);
      if (res.ok) {
        const data = await res.json();
        setAvailability(data.saunaStatus);
      } else {
        setAvailability([]);
      }
    } catch (error) {
      console.error("空き状況取得エラー:", error);
      setAvailability([]);
    }
  };

  // 日付と時間が選択されているとき、10秒ごとに最新の空き状況を取得
  useEffect(() => {
    // まずは即時取得
    fetchAvailability();
    if (date && time) {
      const interval = setInterval(() => {
        fetchAvailability();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [date, time]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage("");

    if (!date || !time || !email || !details) {
      setMessage(
        "日付、時間、メールアドレス、予約内容をすべて入力してください。"
      );
      return;
    }

    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time, email, details }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage("サウナの予約が送信されました。ありがとうございます！");
        setDate("");
        setTime("");
        setEmail("");
        setDetails("");
        setAvailability([]); // 予約送信後に空き情報をリセット
      } else {
        setMessage("送信に失敗しました: " + data.error);
      }
    } catch (error) {
      console.error(error);
      setMessage("エラーが発生しました。");
    }
  };

  return (
    <div className="reservation-page">
      <div className="reservation-container">
        <h1>サウナ予約</h1>

        {/* 空き状況表示セクション */}
        <div className="availability-section">
          <h2>リアルタイム空き状況</h2>
          {date && time ? (
            <div className="availability-list">
              {availability.length > 0 ? (
                availability.map((sauna) => (
                  <div
                    key={sauna.id}
                    className={`sauna ${
                      sauna.available ? "available" : "unavailable"
                    }`}
                  >
                    サウナ {sauna.id}: {sauna.available ? "空きあり" : "満室"}
                  </div>
                ))
              ) : (
                <p>データを読み込み中…</p>
              )}
            </div>
          ) : (
            <p>日付と時間を選択すると空き状況が表示されます。</p>
          )}
        </div>

        {/* 予約フォーム */}
        <form className="reservation-form" onSubmit={handleSubmit}>
          {/* 日付選択 */}
          <div className="form-group">
            <label htmlFor="date">日付：</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* 時間選択 */}
          <div className="form-group">
            <label htmlFor="time">時間：</label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            >
              <option value="">選択してください</option>
              {times.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* メールアドレス入力 */}
          <div className="form-group">
            <label htmlFor="email">メールアドレス：</label>
            <input
              type="email"
              id="email"
              placeholder="your-email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* 予約内容入力 */}
          <div className="form-group">
            <label htmlFor="details">予約内容：</label>
            <textarea
              id="details"
              placeholder="ご利用希望内容を入力してください"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
          </div>

          {/* 送信ボタン */}
          <button type="submit">送信する</button>
        </form>

        {/* メッセージ表示 */}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
