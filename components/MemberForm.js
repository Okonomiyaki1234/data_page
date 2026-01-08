"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function MemberForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        grade: "",
        role: "",
        now_or_not: "",
        organization_code: 0, // int型で0に初期化。将来的にlocalStorageから値をセット予定
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // フォーム変更
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 送信処理
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // final_updated（今日の日付）を自動補完
            const today = new Date().toISOString().split("T")[0];

            const payload = {
                name: formData.name,
                grade: formData.grade,
                role: formData.role,
                final_updated: today,
                now_or_not: formData.now_or_not,
                organization_code: formData.organization_code, // 0で初期化、将来的にlocalStorageから取得予定
                // status は DB 側で DEFAULT "none" になるようにしてください
            };

            const { error: insertErr } = await supabase
                .from("member")
                .insert([payload]);

            if (insertErr) throw insertErr;

            setSuccess("メンバーを追加しました！");
            setFormData({ name: "", grade: "", role: "", now_or_not: "", organization_code: 0 });

        } catch (err) {
            setError(String(err.message || err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

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
                        役職(お手数ですが、都合上入力してください) <span className="text-red-500">*</span>
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

                {/* now_or_not */}
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
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                    >
                        {loading ? "送信中..." : "メンバーを追加"}
                    </button>
                </div>

            </form>
        </div>
    );
}