import { useState } from "react";

interface Sauna {
  id: string;
  name: string;
  availableTimeSlots: { id: string; time: string; available: boolean }[];
  capacity: number;
}

interface ReservationFormProps {
  sauna: Sauna;
  onClose: () => void;
  onComplete: () => void;
}

export default function ReservationForm({
  sauna,
  onClose,
  onComplete,
}: ReservationFormProps) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<
    Sauna["availableTimeSlots"][number] | null
  >(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!selectedTimeSlot) {
      setError("時間帯を選択してください");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const reservationData = {
        saunaId: sauna.id,
        saunaName: sauna.name,
        timeSlotId: selectedTimeSlot.id,
        time: selectedTimeSlot.time,
        name,
        email,
        phone,
        numberOfPeople,
        date: new Date().toISOString().split("T")[0],
      };

      // API リクエストをシミュレート
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("予約データ:", reservationData);
      setIsSuccess(true);

      // 3秒後に完了処理
      setTimeout(() => {
        onComplete();
      }, 3000);
    } catch (err) {
      setError("予約処理中にエラーが発生しました。もう一度お試しください。");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 利用可能な時間枠のみ表示
  const availableTimeSlots = sauna.availableTimeSlots.filter(
    (slot) => slot.available
  );

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-800 text-teal-300 mb-4 shadow-neon">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-teal-300 mb-2">
          予約が完了しました！
        </h3>
        <p className="text-gray-300 mb-4">
          {sauna.name}を{selectedTimeSlot?.time}に{numberOfPeople}
          名様でご予約いただきました。
          <br />
          ご予約内容の確認メールをお送りしました。
        </p>
        <div className="animate-pulse text-sm text-gray-400">
          自動的に閉じます...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 to-black backdrop-blur-lg rounded-xl shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-teal-200">サウナ予約システム</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-teal-300 transition"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {error && (
        <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-teal-300 mb-2">利用時間</label>
          <div className="grid grid-cols-3 gap-2">
            {availableTimeSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedTimeSlot(slot)}
                className={`py-2 px-4 rounded-lg text-center transition transform hover:scale-105 ${
                  selectedTimeSlot?.id === slot.id
                    ? "bg-teal-600 text-white shadow-neon"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-teal-300 mb-2">お名前</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="山田 太郎"
            className="w-full px-4 py-2 bg-gray-800 bg-opacity-70 border border-gray-700 rounded-lg focus:outline-none focus:border-teal-400 text-white transition"
          />
        </div>

        <div className="mb-4">
          <label className="block text-teal-300 mb-2">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="example@example.com"
            className="w-full px-4 py-2 bg-gray-800 bg-opacity-70 border border-gray-700 rounded-lg focus:outline-none focus:border-teal-400 text-white transition"
          />
        </div>

        <div className="mb-4">
          <label className="block text-teal-300 mb-2">電話番号</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="090-1234-5678"
            className="w-full px-4 py-2 bg-gray-800 bg-opacity-70 border border-gray-700 rounded-lg focus:outline-none focus:border-teal-400 text-white transition"
          />
        </div>

        <div className="mb-6">
          <label className="block text-teal-300 mb-2">ご利用人数</label>
          <select
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(Number(e.target.value))}
            required
            className="w-full px-4 py-2 bg-gray-800 bg-opacity-70 border border-gray-700 rounded-lg focus:outline-none focus:border-teal-400 text-white transition"
          >
            {[...Array(sauna.capacity).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}名
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 font-semibold rounded-lg transition transform hover:scale-105 ${
            isSubmitting
              ? "opacity-70 cursor-not-allowed"
              : "hover:from-purple-600 hover:to-pink-600"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              予約処理中...
            </div>
          ) : (
            "予約を確定する"
          )}
        </button>
      </form>
    </div>
  );
}
