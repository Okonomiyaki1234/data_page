"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);


export default function MemberEditForm() {
    const router = useRouter();
    const [members, setMembers] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        grade: "",
        role: "",
        now_or_not: "",
        status: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // メンバー一覧取得
    useState(() => {
        (async () => {
            const { data, error } = await supabase
                .from("member")
                .select("id, name, grade, role, now_or_not, status")
                .eq("now_or_not", 1) // 現役のみ（必要に応じ変更）
                .order("grade", { ascending: true });
            if (!error) setMembers(data);
        })();
    }, []);

    // メンバー選択時に情報を反映
    const handleSelect = (e) => {
        const id = e.target.value;
        setSelectedId(id);
        const member = members.find((m) => String(m.id) === String(id));
        if (member) {
            setFormData({
                name: member.name || "",
                grade: member.grade || "",
                role: member.role || "",
                now_or_not: member.now_or_not || "",
                status: member.status || "",
            });
        }
    };

    // statusのみ変更
    const handleStatusChange = (e) => {
        setFormData((prev) => ({ ...prev, status: e.target.value }));
    };

    // 送信処理（statusのみ更新）
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            // 本日の日付をdate型でセット
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const dateValue = `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD 形式
            const payload = {
                status: formData.status,
                final_updated: dateValue,
            };
            const { error: updateErr } = await supabase
                .from("member")
                .update(payload)
                .eq("id", selectedId);
            if (updateErr) throw updateErr;
            setSuccess("本日の状態を更新しました！");
        } catch (err) {
            setError(String(err.message || err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* メンバー選択 */}
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                        状態を更新するメンバーを選択 <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={selectedId}
                        onChange={handleSelect}
                        required
                        className="block w-full px-3 py-2 border rounded-md dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="">選択してください</option>
                        {members.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}（{m.grade}年 / {m.role}）
                            </option>
                        ))}
                    </select>
                </div>

                {/* メッセージ */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
                    </div>
                )}

                {/* メンバー情報（表示のみ） */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">氏名</label>
                        <div className="px-3 py-2 border rounded-md dark:bg-gray-800 text-gray-900 dark:text-white bg-gray-100">{formData.name}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">学年</label>
                        <div className="px-3 py-2 border rounded-md dark:bg-gray-800 text-gray-900 dark:text-white bg-gray-100">{formData.grade}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">役職</label>
                        <div className="px-3 py-2 border rounded-md dark:bg-gray-800 text-gray-900 dark:text-white bg-gray-100">{formData.role}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">在籍状況</label>
                        <div className="px-3 py-2 border rounded-md dark:bg-gray-800 text-gray-900 dark:text-white bg-gray-100">{formData.now_or_not === "1" ? "現役" : formData.now_or_not === "0" ? "引退/OB/OG" : ""}</div>
                    </div>
                </div>

                {/* 本日の状態（編集可能） */}
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                        本日の状態 <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleStatusChange}
                        required
                        className="block w-full px-3 py-2 border rounded-md dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="">選択してください</option>
                        <option value="出席">出席</option>
                        <option value="欠席">欠席</option>
                        <option value="遅刻">遅刻</option>
                        <option value="早退">早退</option>
                    </select>
                </div>

                {/* ボタン */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="px-4 py-2 border rounded-md text-gray-800 dark:text-gray-200 dark:border-gray-600"
                    >
                        キャンセル
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !selectedId}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                    >
                        {loading ? "送信中..." : "本日の状態を更新"}
                    </button>
                </div>
            </form>
        </div>
    );
}