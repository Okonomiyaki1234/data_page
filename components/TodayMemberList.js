"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function MemberListToday() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const today = new Date().toISOString().split("T")[0]; 
    // YYYY-MM-DD 形式になる

    useEffect(() => {
        async function loadMembers() {
            setLoading(true);
            setError(null);

            try {
                // --- organization_codeをlocalStorageから取得する場合 ---
                // const orgCode = parseInt(localStorage.getItem("organization_code"), 10);
                // const { data, error: sbError } = await supabase
                //     .from("member")
                //     .select("id, name, grade, role, final_updated, status, now_or_not")
                //     .eq("final_updated", today)
                //     .eq("now_or_not", "1")
                //     .eq("organization_code", orgCode) // ← ここでorganization_codeも参照
                //     .order("grade", { ascending: false });

                // --- 実装時の手順 ---
                // 1. localStorage.setItem("organization_code", 123); などで値を保存
                // 2. 上記コメントアウトを外して利用

                // --- 現状はorganization_code参照なし ---
                const { data, error: sbError } = await supabase
                    .from("member")
                    .select("id, name, grade, role, final_updated, status, now_or_not")
                    .eq("final_updated", today)
                    .eq("now_or_not", "1")//現役のみ
                    .order("grade", { ascending: false });

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
            <h2 className="text-xl text-gray-900 font-bold mb-6">本日更新されたメンバー一覧</h2>

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
                    <p className="text-gray-500">本日更新されたメンバーはいません。</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {members.map((m) => (
                        <div key={m.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{m.name}</p>
                            <p className="text-gray-600 dark:text-gray-300">
                                学年：{m.grade} ／ 役職：{m.role}
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                ステータス：{m.status}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                最終更新：{m.final_updated}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
