"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function ListProject() {
    const [project, setProject] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState(""); // 検索用ステート追加

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            setError(null);
            try {
                // organization_codeをlocalStorageから取得（文字列のまま）
                const orgCodeStr = typeof window !== "undefined" ? localStorage.getItem("organization_code") : "";
                // 6桁の数字のみ許可
                if (!/^\d{6}$/.test(orgCodeStr)) {
                    setProject([]);
                    setMembers([]);
                    setLoading(false);
                    return;
                }

                // organization_codeで絞り込み
                const { data: projectData, error: projectError } = await supabase
                    .from("project")
                    .select("id, name, duration, roler")
                    .order("id", { ascending: false })
                    .eq("organization_code", orgCodeStr); // ← ここでorganization_codeも参照

                const { data: memberData, error: memberError } = await supabase
                    .from("member")
                    .select("id, name");
                if (projectError) throw projectError;
                if (memberError) throw memberError;

                setProject(projectData);
                setMembers(memberData);
            } catch (e) {
                setError(String(e));
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const getMemberName = (id) => {
        const member = members.find((m) => m.id === id);
        return member ? member.name : "不明";
    };

    // 検索フィルタ
    const filteredProjects = project.filter((p) =>
        p.name && p.name.includes(search)
    );

    return (
        <div>
            <h2 className="text-xl text-gray-900 font-bold mb-6">プロジェクト一覧</h2>
            {/* 検索ボックス追加 */}
            <div className="mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="プロジェクト名で検索"
                    className="border rounded px-3 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
            </div>
            {loading ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">読み込み中…</p>
                </div>
            ) : error ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <p className="text-red-600">エラー: {error}</p>
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">該当するプロジェクトがありません。</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredProjects.map((p) => (
                        <Link
                            key={p.id}
                            href={{
                                pathname: "../create6",
                                search: `?project_id=${p.id}`,
                            }}
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 m-6">
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    プロジェクト名：{p.name}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    期間：{p.duration}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    代表者（一名）：{getMemberName(p.roler)}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}