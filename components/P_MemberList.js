"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function MemberListAll() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //クエリ取得
    const searchParams = useSearchParams();
    const projectId = searchParams.get("project_id"); // string | null

    useEffect(() => {
        if (!projectId) {
            setError("project_id が指定されていません");
            setLoading(false);
            return;
        }

        async function loadMembers() {
            setLoading(true);
            setError(null);

            try {
                // 1. m_pテーブルから project_id をクエリで指定
                const { data: mpData, error: mpError } = await supabase
                    .from("m_p")
                    .select("member_id")
                    .eq("project_id", projectId);

                if (mpError) throw mpError;

                const memberIds = mpData.map(row => row.member_id);

                if (memberIds.length === 0) {
                    setMembers([]);
                    return;
                }

                // 2. memberテーブルから現役メンバー取得
                const { data, error: sbError } = await supabase
                    .from("member")
                    .select("id, name, grade, role, final_updated, status, now_or_not")
                    .in("id", memberIds)
                    .eq("now_or_not", "1");

                if (sbError) throw sbError;

                setMembers(data);
            } catch (e) {
                setError(String(e));
            } finally {
                setLoading(false);
            }
        }

        loadMembers();
    }, [projectId]); // ← projectIdが変わったら再取得

    return (
        <div>
            <h2 className="text-xl text-gray-900 font-bold mb-6">
                メンバー一覧（project_id: {projectId}）
            </h2>

            {loading ? (
                <p>読み込み中…</p>
            ) : error ? (
                <p className="text-red-600">エラー: {error}</p>
            ) : members.length === 0 ? (
                <p>メンバーが登録されていません。</p>
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
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
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