"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [orgCode, setOrgCode] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const code = typeof window !== "undefined" ? localStorage.getItem("organization_code") : "";
        setOrgCode(code || "");
        const adminFlag = typeof window !== "undefined" ? localStorage.getItem("is_admin") : null;
        setIsAdmin(adminFlag === "true");
    }, []);

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setPassword(value);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!/^\d{6}$/.test(password)) {
            setError("6桁の数字を入力してください。");
            return;
        }
        if (!orgCode) {
            setError("組織コードが見つかりません。");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const { data, error: dbError } = await supabase
                .from("organization")
                .select("id")
                .eq("id", orgCode)
                .eq("admin_code", password)
                .single();
            if (dbError || !data) {
                setError("パスワードが正しくありません。");
            } else {
                localStorage.setItem("is_admin", "true");
                setIsAdmin(true);
                alert("管理者としてログインしました。");
                router.push("/home");
            }
        } catch (err) {
            setError("サーバーエラーが発生しました。");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("is_admin");
        setIsAdmin(false);
        alert("管理者からログアウトしました。");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
                    組織管理者ログイン
                </h1>
                {isAdmin ? (
                    <div className="space-y-6">
                        <p className="text-green-600 dark:text-green-400 text-center">
                            管理者としてログイン中です。
                        </p>
                        <button
                            onClick={handleLogout}
                            className="w-full py-2 px-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded"
                        >
                            ログアウト
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="admin-password" className="block text-gray-700 dark:text-gray-300 mb-2">
                                管理者パスワード（6桁の数字）
                            </label>
                            <input
                                id="admin-password"
                                type="password"
                                value={password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                                maxLength={6}
                                inputMode="numeric"
                                autoComplete="off"
                                disabled={loading}
                            />
                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
                            disabled={loading}
                        >
                            {loading ? "確認中..." : "ログイン"}
                        </button>
                    </form>
                )}
                <button
                    onClick={() => router.push("/home")}
                    className="w-full mt-8 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded"
                >
                    ホームに戻る
                </button>
            </div>
        </div>
    );
}