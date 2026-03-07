"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function NoticeOrgForm() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [currentNotice, setCurrentNotice] = useState("");
    const [noticeColumn, setNoticeColumn] = useState("Notice");

    const router = useRouter();

    const [formData, setFormData] = useState({
        notice: "",
        organization_code: 0,
    });

    useEffect(() => {
        const adminFlag = typeof window !== "undefined" ? localStorage.getItem("is_admin") : null;
        setIsAdmin(adminFlag === "true");

        const orgCodeStr = typeof window !== "undefined" ? localStorage.getItem("organization_code") : null;
        if (orgCodeStr && /^\d{6}$/.test(orgCodeStr)) {
            setFormData((prev) => ({ ...prev, organization_code: Number(orgCodeStr) }));
        } else {
            setError("組織コードが取得できません。トップ画面から入り直してください。");
        }
        setInitializing(false);
    }, []);

    useEffect(() => {
        const fetchOrganizationNotice = async () => {
            if (!formData.organization_code) return;

            const { data, error } = await supabase
                .from("organization")
                .select("*")
                .eq("id", formData.organization_code)
                .single();

            if (error) {
                setError("組織情報の取得に失敗しました");
                return;
            }

            if (!data || typeof data !== "object") {
                setError("組織情報の形式が正しくありません");
                return;
            }

            if (Object.prototype.hasOwnProperty.call(data, "Notice")) {
                setNoticeColumn("Notice");
                setCurrentNotice(data.Notice || "");
                setFormData((prev) => ({ ...prev, notice: data.Notice || "" }));
            } else if (Object.prototype.hasOwnProperty.call(data, "notice")) {
                setNoticeColumn("notice");
                setCurrentNotice(data.notice || "");
                setFormData((prev) => ({ ...prev, notice: data.notice || "" }));
            } else {
                setError("OrganizationテーブルにNoticeカラムが見つかりません");
            }
        };

        fetchOrganizationNotice();
    }, [formData.organization_code]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAdmin) {
            setError("組織お知らせの登録は管理者のみ実行できます");
            return;
        }

        if (!formData.organization_code) {
            setError("組織コードが取得できません");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, "0");
            const dd = String(today.getDate()).padStart(2, "0");
            const datePrefix = `${yyyy}-${mm}-${dd}`;

            const normalizedNotice = (formData.notice || "")
                .replace(/^\s*\[?\d{4}[-\/]\d{2}[-\/]\d{2}\]?\s*/, "")
                .trim();

            const noticeWithDate = normalizedNotice
                ? `${datePrefix} ${normalizedNotice}`
                : datePrefix;

            const { error: updateErr } = await supabase
                .from("organization")
                .update({ [noticeColumn]: noticeWithDate })
                .eq("id", formData.organization_code);

            if (updateErr) throw updateErr;

            setCurrentNotice(noticeWithDate);
            setFormData((prev) => ({ ...prev, notice: noticeWithDate }));
            setSuccess("組織のお知らせを保存しました");

        } catch (err) {
            setError(String(err.message || err));
        } finally {
            setLoading(false);
        }
    };

    if (initializing) {
        return (
            <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8">
                <p className="text-gray-700 dark:text-gray-200">読み込み中...</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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

                {!isAdmin && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                            この画面は表示できますが、登録実行は管理者のみ可能です。
                        </p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                        現在の組織お知らせ
                    </label>
                    <div className="w-full min-h-24 px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white whitespace-pre-wrap">
                        {currentNotice || "（未登録）"}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                        新しい組織お知らせ <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="notice"
                        value={formData.notice}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="block w-full px-3 py-2 border rounded-md dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="この組織向けのお知らせ内容を入力してください"
                    />
                </div>

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
                        disabled={loading || !isAdmin}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
                    >
                        {loading ? "送信中..." : "組織お知らせを保存"}
                    </button>
                </div>
            </form>
        </div>
    );
}