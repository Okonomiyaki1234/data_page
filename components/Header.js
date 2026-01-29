"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header({ orgName, menuOpen, setMenuOpen }) {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsAdmin(localStorage.getItem("is_admin") === "true");
        }
    }, []);

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                    <div className="flex flex-col items-start space-y-1">
                        <div className="flex items-center space-x-3">
                            <Link
                                href="/"
                                className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                メンバー管理アプリ
                            </Link>
                            {orgName && (
                                <span className="text-gray-700 dark:text-gray-300 text-base font-semibold">
                                    （{orgName}）
                                </span>
                            )}
                        </div>
                        {isAdmin && (
                            <span className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1">
                                管理者としてログイン中
                            </span>
                        )}
                    </div>
                    {/* PC用ナビゲーション（2段） */}
                    <nav className="hidden lg:flex flex-col space-y-2 lg:space-y-0 lg:space-x-0">
                        <div className="flex space-x-4">
                            <Link href="../home" className="text-xl text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition">ホーム</Link>
                            <Link href="../create" className="text-xl text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition">プロジェクト追加</Link>
                            <Link href="../create2" className="text-xl text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition">メンバー追加</Link>
                            <Link href="../create3" className="text-xl text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition">プロジェクト一覧</Link>
                        </div>
                        <div className="flex space-x-4 mt-2">
                            <Link href="../create4" className="text-xl text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition">メンバー情報更新</Link>
                            <Link href="../create5" className="text-xl text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition">出席登録</Link>
                            <Link href="../create7" className="text-xl text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition">組織管理者ログイン</Link>
                        </div>
                    </nav>
                    {/* モバイル用ハンバーガーメニュー */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-gray-700 dark:text-gray-300 focus:outline-none"
                            aria-label="メニューを開く"
                        >
                            {/* ハンバーガーアイコン */}
                            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        </button>
                        {/* メニュー本体 */}
                        {menuOpen && (
                            <nav className="absolute top-20 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-4 px-6 z-50 flex flex-col space-y-2">
                                <Link href="../home" className="text-lg text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition" onClick={() => setMenuOpen(false)}>ホーム</Link>
                                <Link href="../create" className="text-lg text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition" onClick={() => setMenuOpen(false)}>プロジェクト追加</Link>
                                <Link href="../create2" className="text-lg text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition" onClick={() => setMenuOpen(false)}>メンバー追加</Link>
                                <Link href="../create3" className="text-lg text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition" onClick={() => setMenuOpen(false)}>プロジェクト一覧</Link>
                                <Link href="../create4" className="text-lg text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition" onClick={() => setMenuOpen(false)}>メンバー情報更新</Link>
                                <Link href="../create5" className="text-lg text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition" onClick={() => setMenuOpen(false)}>出席登録</Link>
                                <Link href="../create7" className="text-lg text-gray-700 dark:text-gray-300 font-medium px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition" onClick={() => setMenuOpen(false)}>組織管理者ログイン</Link>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
