"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function ProjectForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [members, setMembers] = useState([]); // ← 代表者候補
    const [durations, setDurations] = useState([]); // 期間候補

    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        duration: "",
        roler: "", // member.id が入る
        organization_code: 0, // int型で0に初期化
    });

    // organization_codeをlocalStorageから取得してセット
    useEffect(() => {
        const orgCodeStr = typeof window !== "undefined" ? localStorage.getItem("organization_code") : null;
        // 6桁の数字のみ許可
        if (orgCodeStr && /^\d{6}$/.test(orgCodeStr)) {
            setFormData((prev) => ({ ...prev, organization_code: Number(orgCodeStr) }));
        }
    }, []);

    // duration候補取得
    useEffect(() => {
        const fetchDurations = async () => {
            // organization_codeがセットされていなければ取得しない
            if (!formData.organization_code) return;
            const { data, error } = await supabase
                .from("duration")
                .select("list")
                .eq("id", formData.organization_code)
                .single();
            if (error) {
                setDurations([]);
            } else {
                // listが配列で入っている前提
                setDurations(Array.isArray(data?.list) ? data.list : []);
            }
        };
        fetchDurations();
        // formData.organization_codeが変わったら再取得
    }, [formData.organization_code]);

    // member 取得処理
    useEffect(() => {
        const fetchMembers = async () => {
            const { data, error } = await supabase
                .from("member")
                .select("id, name, grade, role, now_or_not")
                .eq("now_or_not", 1)
                .order("grade", { ascending: true });

            if (error) {
                console.error(error);
                setError("メンバーリスト取得に失敗しました");
            } else {
                setMembers(data);
            }
        };

        fetchMembers();
    }, []);

    // フォーム変更
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // プロジェクト作成
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // ① project 作成
            const projectPayload = {
                name: formData.name,
                duration: formData.duration,
                roler: formData.roler,
                organization_code: formData.organization_code,
            };

            const { data: projectData, error: projectErr } = await supabase
                .from("project")
                .insert([projectPayload])
                .select()
                .single();

            if (projectErr) throw projectErr;

            const projectId = projectData.id;

            // ② m_p（中間テーブル）に紐づけ作成
            const mpPayload = {
                member_id: formData.roler,
                project_id: projectId,
            };

            const { error: mpErr } = await supabase
                .from("m_p")
                .insert([mpPayload]);

            if (mpErr) throw mpErr;

            setSuccess("プロジェクトを保存しました");
            setFormData({ name: "", duration: "", roler: "", organization_code: 0 });

        } catch (err) {
            setError(String(err.message || err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* --- メッセージ --- */}
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

                {/* --- プロジェクト名 --- */}
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                        プロジェクト名 <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="block w-full px-3 py-2 border rounded-md dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="台本の題名を入力してください"
                    />
                </div>

                {/* --- 期間 --- */}
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                        期間 <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        className="block w-full px-3 py-2 border rounded-md dark:bg-gray-800 text-gray-900 dark:text-white"
                        disabled={durations.length === 0}
                    >
                        <option value="">{durations.length === 0 ? "組織コードを設定してください" : "選択してください"}</option>
                        {durations.map((d, i) => (
                            <option key={i} value={d}>{d}</option>
                        ))}
                    </select>
                </div>

                {/* --- 代表者 (member) --- */}
                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                        代表者 <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="roler"
                        value={formData.roler}
                        onChange={handleChange}
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

                {/* --- ボタン --- */}
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
                        {loading ? "送信中..." : "プロジェクトを作成"}
                    </button>
                </div>
            </form>
        </div>
    );
}