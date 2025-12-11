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
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // メンバー一覧取得
    useState(() => {
        (async () => {
            const { data, error } = await supabase.from("member").select("id, name, grade, role, now_or_not, status");
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
            });
        }
    };

    // フォーム変更
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 送信処理（更新）
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
                name: formData.name,
                grade: formData.grade,
                role: formData.role,
                now_or_not: formData.now_or_not,
                final_updated: dateValue, // DBのdate型に対応
            };
            const { error: updateErr } = await supabase
                .from("member")
                .update(payload)
                .eq("id", selectedId);
            if (updateErr) throw updateErr;
            setSuccess("メンバー情報を更新しました！");
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
                        編集するメンバーを選択 <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={selectedId}
                        onChange={handleSelect}
                        required
                        className="block w-full px-3 py-2 border rounded-md dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="">選択してください</option>
                        {members.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
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

                {/* 名前 */}
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                        氏名 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="block w-full px-3 py-2 border rounded-md dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="例）演劇太郎"
                    />
                </div>

                {/* 学年 */}
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                        学年 <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        required
                        className="block w-full px-3 py-2 border rounded-md dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="">選択してください</option>
                        <option value="c1">中学１年生</option>
                        <option value="c2">中学２年生</option>
                        <option value="c3">中学３年生</option>
                        <option value="k1">高校１年生</option>
                        <option value="k2">高校２年生</option>
                        <option value="k3">高校３年生</option>
                        <option value="another">その他</option>
                    </select>
                </div>

                {/* 役職 */}
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                        役職 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="block w-full px-3 py-2 border rounded-md dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="部長/副部長/会計/広報/なし"
                    />
                </div>

                {/* 在籍状況 */}
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                        在籍状況 <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="now_or_not"
                        value={formData.now_or_not}
                        onChange={handleChange}
                        required
                        className="block w-full px-3 py-2 border rounded-md dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="">選択してください</option>
                        <option value="1">現役</option>
                        <option value="0">引退/OB/OG</option>
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
                        {loading ? "送信中..." : "メンバー情報を更新"}
                    </button>
                </div>
            </form>
        </div>
    );
}