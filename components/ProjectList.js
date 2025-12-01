"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function ListProject() {
    const [project, setProject] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadProject() {
            setLoading(true);
            setError(null);

            try {
                const { data, error: sbError } = await supabase
                    .from("project")
                    .select("id, name, duration, roler")
                    .order("id", { ascending: false });
                    {/*.eq("now_or_not", "1");//現役のみ*/}

                if (sbError) throw sbError;

                setProject(data);
            } catch (e) {
                setError(String(e));
            } finally {
                setLoading(false);
            }
        }

        loadProject();
    }, []);

    return (
        <div>
            <h2 className="text-xl text-gray-900 font-bold mb-6">プロジェクト一覧</h2>

            {loading ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">読み込み中…</p>
                </div>
            ) : error ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <p className="text-red-600">エラー: {error}</p>
                </div>
            ) : project.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">プロジェクトが登録されていません。</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {project.map((p) => (
                        <div key={p.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                プロジェクト名：{p.name}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                                期間：{p.duration}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                代表者（一名）：{p.roler}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}