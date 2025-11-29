"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function MemberListAll() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadMembers() {
            setLoading(true);
            setError(null);

            try {
                const { data, error: sbError } = await supabase
                    .from("member")
                    .select("id, name, grade, role, final_updated, status, now_or_not")
                    .order("grade", { ascending: false })
                    .eq("now_or_not", "1");//現役のみ

                if (sbError) throw sbError;

                setMembers(data);
            } catch (e) {
                setError(String(e));
            } finally {
                setLoading(false);
            }
        }

        loadMembers();
    }, []);

    return (
        <div>
            <h2 className="text-xl text-gray-900 font-bold mb-6">メンバー一覧</h2>

            {loading ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">読み込み中…</p>
                </div>
            ) : error ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <p className="text-red-600">エラー: {error}</p>
                </div>
            ) : members.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">メンバーが登録されていません。</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {members.map((m) => (
                        <div key={m.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {m.name}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                                学年：{m.grade} ／ 役職：{m.role}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                                ステータス：{m.status}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                最終更新：{m.final_updated}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                現在在籍：{m.now_or_not === "1" ? "○" : "×"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}