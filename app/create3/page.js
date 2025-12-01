import Link from "next/link";
//import AllMemberList from "@/components/AllMemberList";
import ProjectList from "@/components/ProjectList";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {/* ヘッダー */}
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                メンバー管理アプリ
                            </h1>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <Link
                                href="../"
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
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue -400 font-medium"
                            >
                                メンバーを追加
                            </Link>
                            <Link
                                href="/"
                                className="text-blue-600 dark:text-blue-400 font-medium"
                            >
                                プロジェクト一覧
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        プロジェクト一覧
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        プロジェクトを確認できます。
                    </p>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        右上からプロジェクト及びメンバーを追加可能です。
                    </p>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        新規でプロジェクトを追加することもできます。
                    </p>
                </div>

                <div className="my-8">// 波線デコレーション
                    <svg viewBox="0 0 120 10" preserveAspectRatio="none" className="w-full h-3 text-gray-400">
                        <path d="M0 5 Q 10 0 20 5 T 40 5 T 60 5 T 80 5 T 100 5 T 120 5" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </svg>
                </div>
                <ProjectList />
                <div className="my-8">// 波線デコレーション
                    <svg viewBox="0 0 120 10" preserveAspectRatio="none" className="w-full h-3 text-gray-400">
                        <path d="M0 5 Q 10 0 20 5 T 40 5 T 60 5 T 80 5 T 100 5 T 120 5" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </svg>
                </div>
                {/*<AllMemberList />*/}
            </main>

            {/* フッター */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-gray-600 dark:text-gray-400">
                        <p>
                            &copy; 2025 メンバー管理アプリ. 部活用に作成されました。
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
