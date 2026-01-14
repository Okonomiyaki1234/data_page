"use client";
import Link from "next/link";

export default function Header({ orgName, menuOpen, setMenuOpen }) {
    return (
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
                        <Link href="../home" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">ホーム</Link>
                        <Link href="../create" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">プロジェクトを追加</Link>
                        <Link href="../create2" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">メンバーを追加</Link>
                        <Link href="../create3" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">プロジェクト一覧</Link>
                        <Link href="../create4" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">メンバー情報更新</Link>
                        <Link href="../create5" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">出席登録</Link>
                    </nav>
                    {/* モバイル用ハンバーガーメニュー */}
                    <div className="md:hidden">
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
                            <nav className="absolute top-20 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-4 px-6 z-50 flex flex-col space-y-4">
                                <Link href="../home" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium" onClick={() => setMenuOpen(false)}>ホーム</Link>
                                <Link href="../create" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium" onClick={() => setMenuOpen(false)}>プロジェクトを追加</Link>
                                <Link href="../create2" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium" onClick={() => setMenuOpen(false)}>メンバーを追加</Link>
                                <Link href="../create3" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium" onClick={() => setMenuOpen(false)}>プロジェクト一覧</Link>
                                <Link href="../create4" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium" onClick={() => setMenuOpen(false)}>メンバー情報更新</Link>
                                <Link href="../create5" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium" onClick={() => setMenuOpen(false)}>出席登録</Link>
                            </nav>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
