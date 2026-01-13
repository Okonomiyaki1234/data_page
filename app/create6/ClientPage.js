"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import P_MemberList from "@/components/P_MemberList";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function ClientPage() {
    const [menuOpen, setMenuOpen] = useState(false); // 追加: モバイルメニュー用
    const [mode, setMode] = useState(0); // 0:閲覧, 1:編集
    const searchParams = useSearchParams();
    const projectId = searchParams.get("project_id");

    const [members, setMembers] = useState([]);
    const [checkedIds, setCheckedIds] = useState([]); // 編集モード用
    const [initialCheckedIds, setInitialCheckedIds] = useState([]); // DB初期値
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [orgName, setOrgName] = useState(""); // 追加: 組織名

    // 組織名取得
    useEffect(() => {
        const fetchOrgName = async () => {
            const orgCode =
                typeof window !== "undefined"
                    ? localStorage.getItem("organization_code")
                    : null;
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

    // 編集モード用データ取得
    useEffect(() => {
        if (mode !== 1 || !projectId) return;

        setLoading(true);
        setError("");

        Promise.all([
            supabase
                .from("member")
                .select("id, name, grade, role")
                .eq("now_or_not", "1")
                .order("grade", { ascending: false }),
            supabase
                .from("m_p")
                .select("member_id")
                .eq("project_id", projectId),
        ]).then(([memberRes, mpRes]) => {
            if (memberRes.error || mpRes.error) {
                setError("データ取得エラー");
                setLoading(false);
                return;
            }

            setMembers(memberRes.data);

            const checked = mpRes.data.map((row) => row.member_id);
            setCheckedIds(checked);
            setInitialCheckedIds(checked);

            setLoading(false);
        });
    }, [mode, projectId]);

    // チェックボックス変更
    const handleCheck = (id) => {
        setCheckedIds((prev) =>
            prev.includes(id)
                ? prev.filter((mid) => mid !== id)
                : [...prev, id]
        );
    };

    // 更新ボタン押下時
    const handleUpdate = async () => {
        setLoading(true);
        setError("");

        try {
            // 追加すべきID
            const toAdd = checkedIds.filter(
                (id) => !initialCheckedIds.includes(id)
            );

            // 削除すべきID
            const toRemove = initialCheckedIds.filter(
                (id) => !checkedIds.includes(id)
            );

            // 追加
            for (const member_id of toAdd) {
                const { data: exist } = await supabase
                    .from("m_p")
                    .select("id")
                    .eq("project_id", projectId)
                    .eq("member_id", member_id)
                    .single();

                if (!exist) {
                    await supabase
                        .from("m_p")
                        .insert({ project_id: projectId, member_id });
                }
            }

            // 削除
            for (const member_id of toRemove) {
                await supabase
                    .from("m_p")
                    .delete()
                    .eq("project_id", projectId)
                    .eq("member_id", member_id);
            }

            setInitialCheckedIds([...checkedIds]);
        } catch (e) {
            setError("更新失敗");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {/* ヘッダー */}
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                メンバー管理アプリ
                            </h1>
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
                                className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                            >
                                ホーム
                            </Link>
                            <Link
                                href="../create"
                                className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                            >
                                プロジェクトを追加
                            </Link>
                            <Link
                                href="../create2"
                                className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                            >
                                メンバーを追加
                            </Link>
                            <Link
                                href="../create3"
                                className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                            >
                                プロジェクト一覧
                            </Link>
                            <Link
                                href="../create4"
                                className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                            >
                                メンバー情報更新
                            </Link>
                            <Link
                                href="../create5"
                                className="nav-link text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
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
                                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/>
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
                                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
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

            {/* モード切替 */}
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-end">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow"
                    onClick={() => setMode(mode === 0 ? 1 : 0)}
                >
                    {mode === 0 ? "編集モードに切替" : "閲覧モードに戻す"}
                </button>
            </div>

            {/* メイン */}
            <main className="max-w-7xl mx-auto px-4 py-12">
                {mode === 0 ? (
                    <P_MemberList />
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            プロジェクトメンバー編集
                        </h2>

                        {loading ? (
                            <p>読み込み中…</p>
                        ) : error ? (
                            <p className="text-red-600">{error}</p>
                        ) : (
                            <form>
                                <div className="space-y-4">
                                    {members.map((m) => (
                                        <label
                                            key={m.id}
                                            className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded p-3 shadow text-gray-900 dark:text-white"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checkedIds.includes(m.id)}
                                                onChange={() => handleCheck(m.id)}
                                            />
                                            <span>
                                                {m.name}（{m.grade}年／{m.role}）
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    className="mt-6 bg-green-600 text-white px-4 py-2 rounded shadow"
                                    onClick={handleUpdate}
                                    disabled={loading}
                                >
                                    更新
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </main>

            {/* フッター */}
            <footer className="bg-white dark:bg-gray-800 border-t mt-16">
                <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
                    &copy; 2025 メンバー管理アプリ
                </div>
            </footer>
        </div>
    );
}