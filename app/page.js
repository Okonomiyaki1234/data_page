"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const savedCode = typeof window !== "undefined" ? localStorage.getItem("organization_code") : "";
        if (savedCode) setCode(savedCode);
    }, []);

    const handleChange = (e) => {
        // 6桁までの数字のみ許可
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setCode(value);
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!/^\d{6}$/.test(code)) {
            setError("6桁の数字を入力してください。");
            return;
        }
        localStorage.setItem("organization_code", code);
        router.push("/home");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    ログイン
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="org-code" className="block text-gray-700 dark:text-gray-300 mb-2">
                            組織コード（6桁の数字）
                        </label>
                        <input
                            id="org-code"
                            type="text"
                            value={code}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
                            maxLength={6}
                            inputMode="numeric"
                            autoComplete="off"
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
                    >
                        決定
                    </button>
                </form>
            </div>
        </div>
    );
}
