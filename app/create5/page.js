"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import MemberStateForm from "@/components/MemberStateForm";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function CreatePage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [orgName, setOrgName] = useState("");

    useEffect(() => {
        const fetchOrgName = async () => {
            const orgCode = typeof window !== "undefined" ? localStorage.getItem("organization_code") : null;
            if (!orgCode) return;
            const { data, error } = await supabase
                .from("organization")
                .select("name")
                .eq("id", orgCode)
                .single();
            if (data && data.name) setOrgName(data.name);
        };
        fetchOrgName();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* ヘッダー */}
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/"
                                className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                メンバー管理アプリ
                            </Link>
                            {orgName && (
                                <span className="text-gray-700 dark:text-gray-300 text-lg font-semibold">
                                    （{orgName}）
                                </span>
                            )}
                        </div>
                        {/* PC用ナビゲーション */}
                        <nav className="hidden md:flex space-x-8">
                            <Link
                                href="../home"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                            >
                                ホーム
                            </Link>
                            <Link
                                href="../create"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                            >
                                プロジェクトを追加
                            </Link>
                            <Link
                                href="../create2"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                            >
                                メンバーを追加
                            </Link>
                            <Link
                                href="../create3"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                            >
                                プロジェクト一覧
                            </Link>
                            <Link
                                href="../create4"
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                            >
                                メンバー情報更新
                            </Link>
                            <Link
                                href="../create5"
                                className="text-blue-600 dark:text-blue-400 font-medium"
                            >
                                出席登録
                            </Link>
                        </nav>
                        {/* モバイル用ハンバーガーメニュー */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="text-gray-700 dark:text-gray-300 focus:outline-none"
                                aria-label="メニューを開く"
                            >
                                <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                                    <path
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                            {menuOpen && (
                                <nav className="absolute top-20 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-4 px-6 z-50 flex flex-col space-y-4">
                                    <Link
                                        href="../home"
                                        className="text-blue-600 dark:text-blue-400 font-medium"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        ホーム
                                    </Link>
                                    <Link
                                        href="../create"
                                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        プロジェクトを追加
                                    </Link>
                                    <Link
                                        href="../create2"
                                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        メンバーを追加
                                    </Link>
                                    <Link
                                        href="../create3"
                                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        プロジェクト一覧
                                    </Link>
                                    <Link
                                        href="../create4"
                                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        メンバー情報更新
                                    </Link>
                                    <Link
                                        href="../create5"
                                        className="text-blue-600 dark:text-blue-400 font-medium"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        出席登録
                                    </Link>
                                </nav>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        メンバー情報更新
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        メンバー情報を更新して、新しい現し身へと生まれ変わりましょう。
                    </p>
                </div>

                <MemberStateForm />
            </main>
        </div>
    );
}
