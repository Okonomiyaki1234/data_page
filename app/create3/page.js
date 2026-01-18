"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProjectList from "@/components/ProjectList";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function Home() {
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {/* 共通ヘッダー */}
            <Header orgName={orgName} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        プロジェクト一覧
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        プロジェクトを確認できます。
                    </p>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        新規でプロジェクトを追加することもできます。
                    </p>
                </div>

                <div className="my-8">
                    <svg
                        viewBox="0 0 120 10"
                        preserveAspectRatio="none"
                        className="w-full h-3 text-gray-400"
                    >
                        <path
                            d="M0 5 Q 10 0 20 5 T 40 5 T 60 5 T 80 5 T 100 5 T 120 5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                    </svg>
                </div>
                <ProjectList />
                <div className="my-8">
                    <svg
                        viewBox="0 0 120 10"
                        preserveAspectRatio="none"
                        className="w-full h-3 text-gray-400"
                    >
                        <path
                            d="M0 5 Q 10 0 20 5 T 40 5 T 60 5 T 80 5 T 100 5 T 120 5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                    </svg>
                </div>
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
